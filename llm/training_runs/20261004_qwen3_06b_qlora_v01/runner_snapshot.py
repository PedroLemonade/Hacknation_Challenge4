"""ChatGPT/Codex: offline, immutable QLoRA development run with matched baseline.
Fresh output only. No cloud trackers; explicit completion-token loss mask.
"""
import argparse, datetime, hashlib, importlib.metadata as metadata, json, os, platform, random, sys, time, types
from pathlib import Path
os.environ.update(HF_HUB_OFFLINE='1',HF_HUB_DISABLE_TELEMETRY='1',HF_HUB_DISABLE_IMPLICIT_TOKEN='1',TRANSFORMERS_OFFLINE='1',TOKENIZERS_PARALLELISM='false')
import mlx.core as mx
import numpy as np
from mlx_lm import load, generate
from mlx_lm.sample_utils import make_sampler
from mlx_lm.lora import CONFIG_DEFAULTS, train_model
from mlx_lm.tuner.callbacks import TrainingCallback
from mlx.utils import tree_flatten
HERE=Path(__file__).resolve().parent
PROJECT=HERE.parent.parent

def sha(p):
 h=hashlib.sha256()
 with Path(p).open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return h.hexdigest()
def read_rows(p):return [json.loads(s) for s in Path(p).read_text().splitlines() if s.strip()]
def dumpfile(p,x):Path(p).write_text(json.dumps(x,ensure_ascii=False,indent=2)+'\n')

class CompletionDataset:
 """Identical non-thinking prompt for generation/training; mask prompt tokens."""
 def __init__(self,rows,tokenizer):
  self.rows=rows;self.records=[];self.lengths=[];self.offsets=[]
  for r in rows:
   prompt=tokenizer.apply_chat_template(r['messages'][:-1],tokenize=False,add_generation_prompt=True,enable_thinking=False)
   prefix=tokenizer.encode(prompt,add_special_tokens=False)
   completion=tokenizer.encode(r['messages'][-1]['content'],add_special_tokens=False)
   eos=tokenizer.eos_token_id
   tokens=prefix+completion+[eos]
   if not completion:raise ValueError('Empty completion')
   # Separate tokenization is intentional; inference feeds the exact prefix IDs.
   self.records.append((tokens,len(prefix)));self.lengths.append(len(tokens));self.offsets.append(len(prefix))
 def __len__(self):return len(self.rows)
 def __getitem__(self,i):return {'record':i}
 def process(self,row):return self.records[row['record']]

class LocalMetrics(TrainingCallback):
 def __init__(self,path):self.path=path;self.events=[]
 def record(self,kind,info):
  event={'kind':kind,**info,'recorded_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
  self.events.append(event)
  with self.path.open('a') as f:f.write(json.dumps(event)+'\n')
 def on_train_loss_report(self,info):self.record('train',info)
 def on_val_loss_report(self,info):self.record('validation',info)

def select_eval(rows,annotations,count,seed):
 if not 1<=count<=len(rows):raise ValueError('Evaluation count out of range')
 order=list(range(len(rows)));random.Random(seed).shuffle(order)
 features=[]
 for r,m in zip(rows,annotations):
  its=json.loads(r['messages'][-1]['content'])['items']
  attrs={f'language/{m["language"]}'}
  for it in its:attrs.update([f'term/{it["term"]}',f'status/{it["status"]}',f'cell/{m["language"]}/{it["term"]}/{it["status"]}',f'duration/{it["duration_days"] is not None}'])
  if not its:attrs.add(f'empty/{m["language"]}')
  features.append(attrs)
 covered=set();selected=[]
 while len(selected)<count:
  i=max(order,key=lambda i:len(features[i]-covered));order.remove(i);selected.append(i);covered.update(features[i])
 return [{'id':annotations[i]['id'],'text':rows[i]['messages'][1]['content'],'messages':rows[i]['messages'][:-1],
          'target':json.loads(rows[i]['messages'][-1]['content']),'language':annotations[i]['language'],'dev_row':i,'synthetic':True} for i in selected]

def capture(model,tokenizer,dataset,out,label,max_tokens):
 path=out/f'{label}_answers.jsonl'
 if path.exists():raise FileExistsError(path)
 model.eval();sampler=make_sampler(temp=0.0);start=time.perf_counter()
 with path.open('x') as f:
  for n,d in enumerate(dataset):
   prompt=tokenizer.apply_chat_template(d['messages'],tokenize=False,add_generation_prompt=True,enable_thinking=False)
   tic=time.perf_counter();error=None
   try:raw=generate(model,tokenizer,prompt=prompt,max_tokens=max_tokens,sampler=sampler,verbose=False)
   except Exception as e:raw='';error=f'{type(e).__name__}: {e}'
   row={'id':d['id'],'model':label,'set':'frozen_synthetic_dev_subset','raw':raw,'ms':(time.perf_counter()-tic)*1000,'error':error}
   f.write(json.dumps(row,ensure_ascii=False)+'\n');f.flush()
   print(f'{label} {n+1}/{len(dataset)} {row["ms"]:.0f} ms'+(' ERROR' if error else ''),flush=True)
 return {'path':path.name,'sha256':sha(path),'answers':len(dataset),'total_seconds':time.perf_counter()-start}

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--model',required=True);p.add_argument('--data',required=True);p.add_argument('--output',required=True);p.add_argument('--iters',type=int,default=400);p.add_argument('--eval-count',type=int,default=48);p.add_argument('--max-tokens',type=int,default=512);p.add_argument('--seed',type=int,default=7070)
 a=p.parse_args();out=Path(a.output).resolve();base=Path(a.model).resolve();data=Path(a.data).resolve()
 if out.exists():p.error('Run folder exists; choose a new name')
 if not base.is_dir() or not data.is_dir() or a.iters<1:p.error('Local model/data and positive iterations required')
 manifest=json.loads((data/'manifest.json').read_text());audit=json.loads((data/'audit_guard_v2.json').read_text())
 if not audit['passed'] or audit['manifest_sha256']!=sha(data/'manifest.json'):p.error('Dataset audit missing/stale/failed')
 for name,h in manifest['file_hashes'].items():
  if sha(data/name)!=h:p.error('Dataset changed: '+name)
 base_manifest=json.loads((base.parent/'manifest.json').read_text())
 for rel,m in base_manifest['files'].items():
  if rel.startswith('mlx_int4/') and sha(base.parent/rel)!=m['sha256']:p.error('Base changed: '+rel)
 out.mkdir(parents=True,exist_ok=False);started=datetime.datetime.now(datetime.timezone.utc).isoformat()
 np.random.seed(a.seed);mx.random.seed(a.seed)
 # Bounded cache on an 8 GiB laptop; allocator limit is not a measured process-RAM cap.
 mx.set_cache_limit(512*1024*1024)
 print('Loading verified local base; offline mode; remote code disabled',flush=True)
 model,tokenizer=load(str(base),tokenizer_config={'trust_remote_code':False})
 train_rows=read_rows(data/'train.jsonl');dev_rows=read_rows(data/'dev.jsonl');annotations=read_rows(data/'dev.annotations.jsonl')
 train_set=CompletionDataset(train_rows,tokenizer);valid_set=CompletionDataset(dev_rows,tokenizer)
 longest=max(train_set.lengths+valid_set.lengths);max_seq=((longest+31)//32)*32
 if max_seq>1536:raise ValueError('Sequence length exceeds planned memory budget; no truncation allowed')
 evaluation=select_eval(dev_rows,annotations,a.eval_count,a.seed)
 eval_path=out/'frozen_eval.jsonl';eval_path.write_text(''.join(json.dumps(x,ensure_ascii=False)+'\n' for x in evaluation))
 plan={'schema_version':'afyanote.qlora-run/0.1','started_at':started,'created_by':'ChatGPT / Codex','data_origin':'Claude lexicon; rebuilt family generator by ChatGPT / Codex','base_repo':base_manifest['repo'],'base_revision':base_manifest['revision'],'base_manifest_sha256':sha(base.parent/'manifest.json'),'data_manifest_sha256':sha(data/'manifest.json'),'dataset_file_hashes':manifest['file_hashes'],'runner_sha256':sha(__file__),'guard_sha256':sha(HERE.parent/'guard.mjs'),'seed':a.seed,'offline_mode':True,'trust_remote_code':False,'trackers':None,'machine':{'platform':platform.platform(),'device':mx.device_info()},'versions':{m:metadata.version(m) for m in ('mlx','mlx-lm','transformers','huggingface-hub','numpy')},'tokenization':{'enable_thinking':False,'loss_mask':'completion plus EOS only; exact prefix token offset','max_seq_length':max_seq,'max_observed_length':longest,'truncated_rows':0,'prompt_token_min':min(train_set.offsets),'prompt_token_max':max(train_set.offsets),'target_token_max':max(n-o for n,o in zip(train_set.lengths,train_set.offsets))},'evaluation':{'file':'frozen_eval.jsonl','sha256':sha(eval_path),'count':len(evaluation),'selection':'seeded greedy coverage from synthetic dev; frozen before training, not independent test','max_tokens':a.max_tokens,'temperature':0,'prompt':'original system + note; no fewshot, no JSON constrained decoding; thinking disabled'},'iterations_requested':a.iters,'batch_size':1,'full_epoch':a.iters>=len(train_rows),'limitations':['Synthetic, no qualified review','A development run, not a released health model','Mac MLX allocator peak is not process/phone RAM','No browser integration or Ollama-compatible export']}
 dumpfile(out/'plan.json',plan)
 print('Preflight: longest',longest,'max_seq',max_seq,'no truncation; evaluation frozen',len(evaluation),flush=True)
 before=capture(model,tokenizer,evaluation,out,'base',a.max_tokens)
 args=dict(CONFIG_DEFAULTS);args.update(model=str(base),train=True,test=False,data=str(data),fine_tune_type='lora',optimizer='adamw',mask_prompt=True,num_layers=12,batch_size=1,iters=a.iters,val_batches=16,learning_rate=2e-4,steps_per_report=10,steps_per_eval=100,grad_accumulation_steps=1,resume_adapter_file=None,adapter_path=str(out/'adapter'),save_every=100,max_seq_length=max_seq,grad_checkpoint=True,report_to=None,project_name=None,seed=a.seed,lora_parameters={'rank':8,'dropout':0.0,'scale':16.0})
 dumpfile(out/'requested_config.json',args)
 callback=LocalMetrics(out/'metrics.jsonl');tic=time.perf_counter()
 train_model(types.SimpleNamespace(**args),model,train_set,valid_set,callback)
 train_seconds=time.perf_counter()-tic;train_peak=mx.get_peak_memory()/1e9
 trainable=sum(v.size for _,v in tree_flatten(model.trainable_parameters()))
 after=capture(model,tokenizer,evaluation,out,'adapter',a.max_tokens)
 adapters=out/'adapter'/'adapters.safetensors'
 result={**plan,'completed_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'completed','iterations_completed':max(e['iteration'] for e in callback.events if e['kind']=='train'),'trainable_parameters':trainable,'training_seconds':train_seconds,'peak_mlx_allocator_gb_through_training':train_peak,'captures':{'base':before,'adapter':after},'adapter':{'path':str(adapters.relative_to(out)),'sha256':sha(adapters),'bytes':adapters.stat().st_size},'metrics_sha256':sha(out/'metrics.jsonl')}
 dumpfile(out/'manifest.json',result);print('Completed run',out,flush=True)
if __name__=='__main__':main()
