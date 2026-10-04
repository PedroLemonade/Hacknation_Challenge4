"""ChatGPT/Codex: verify and reload a saved adapter; known synthetic regressions only.
Default full 40-note capture. New output directory; never train on this data.
"""
import argparse, datetime, hashlib, json, os, time
from pathlib import Path
os.environ.update(HF_HUB_OFFLINE='1',HF_HUB_DISABLE_TELEMETRY='1',TRANSFORMERS_OFFLINE='1',TOKENIZERS_PARALLELISM='false')
from mlx_lm import load,generate
from mlx_lm.sample_utils import make_sampler
from selection import SYSTEM as SELECTION_SYSTEM,user_content,resolve_selection
PROJECT=Path(__file__).resolve().parents[2]
SETS={'independent':PROJECT/'eval/independent_notes.jsonl','notes':PROJECT/'data/notes_test.jsonl'}
def sha(p):
 h=hashlib.sha256()
 with Path(p).open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return h.hexdigest()
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--run',required=True);p.add_argument('--output',required=True);p.add_argument('--set',choices=SETS,default='independent');p.add_argument('--base-only',action='store_true');p.add_argument('--limit',type=int,default=0);a=p.parse_args()
 run=Path(a.run).resolve();out=Path(a.output).resolve()
 if out.exists() or a.limit<0:p.error('Fresh output folder and nonnegative limit required')
 manifest=json.loads((run/'manifest.json').read_text());config=json.loads((run/'requested_config.json').read_text());base=Path(config['model'])
 if manifest.get('status')!='completed':p.error('Training run incomplete')
 base_manifest=base.parent/'manifest.json'
 if sha(base_manifest)!=manifest['base_manifest_sha256']:p.error('Base manifest changed')
 bm=json.loads(base_manifest.read_text())
 for rel,info in bm['files'].items():
  if rel.startswith('mlx_int4/') and sha(base.parent/rel)!=info['sha256']:p.error('Base file changed '+rel)
 adapter=run/manifest['adapter']['path']
 if sha(adapter)!=manifest['adapter']['sha256']:p.error('Adapter changed')
 out.mkdir(parents=True,exist_ok=False)
 model,tokenizer=load(str(base),adapter_path=None if a.base_only else str(adapter.parent),tokenizer_config={'trust_remote_code':False})
 data=SETS[a.set];rows=[json.loads(s) for s in data.read_text().splitlines() if s.strip()];expected=len(rows)
 if a.limit:rows=rows[:a.limit]
 label='Qwen3-0.6B INT4 '+('base' if a.base_only else f'AfyaNote QLoRA {manifest.get("total_updates",manifest["iterations_completed"])} steps')
 path=out/f'{"base" if a.base_only else "saved_adapter"}__{a.set}.jsonl';failed=0
 selection=manifest.get('representation')=='passage_id'
 system=SELECTION_SYSTEM if selection else (PROJECT/'llm/prompt.txt').read_text();sampler=make_sampler(temp=0.0)
 with path.open('x') as f:
  for idx,n in enumerate(rows):
   prompt=tokenizer.apply_chat_template([{'role':'system','content':system},{'role':'user','content':user_content(n['text']) if selection else n['text']}],tokenize=False,add_generation_prompt=True,enable_thinking=False)
   tic=time.perf_counter();error=None;raw_selection=None;selection_error=None
   try:
    raw=generate(model,tokenizer,prompt=prompt,max_tokens=512,sampler=sampler,verbose=False)
    if selection:
     raw_selection=raw
     try:raw=json.dumps(resolve_selection(raw_selection,n['text']),ensure_ascii=False,separators=(',',':'))
     except (ValueError,TypeError,KeyError) as e:selection_error=f'{type(e).__name__}: {e}';raw='invalid_selection'
   except Exception as e:raw='';error=f'{type(e).__name__}: {e}';failed+=1
   item={'id':n['id'],'set':a.set,'model':label,'raw':raw,'raw_selection':raw_selection,'selection_error':selection_error,'ms':(time.perf_counter()-tic)*1000,'error':error};f.write(json.dumps(item,ensure_ascii=False)+'\n');f.flush()
   print(f'{idx+1}/{len(rows)} {item["ms"]:.0f} ms',flush=True)
 metadata={'schema_version':'afyanote.mlx-capture/0.1','created_by':'ChatGPT / Codex','captured_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'set':a.set,'expected_notes':expected,'captured_notes':len(rows),'failed_notes':failed,'complete':len(rows)==expected and not failed,'dataset_sha256':sha(data),'answer_sha256':sha(path),'model_digest':bm['revision']+('' if a.base_only else ':'+manifest['adapter']['sha256']),'model_bytes_on_disk':sum(info['bytes'] for rel,info in bm['files'].items() if rel.startswith('mlx_int4/') and rel.endswith('.safetensors'))+(0 if a.base_only else manifest['adapter']['bytes']),'machine':manifest['machine'],'training_manifest_sha256':sha(run/'manifest.json'),'capture_script_sha256':sha(__file__),'settings':{'temperature':0,'max_tokens':512,'enable_thinking':False,'fewshot':False,'constrained_decoding':False},'representation':manifest.get('representation','direct_quote'),'selection_sha256':sha(Path(__file__).parent/'selection.py') if selection else None,'offline_mode':True,'trust_remote_code':False,'saved_adapter_reloaded':not a.base_only,'prompt_sha256':hashlib.sha256(system.encode()).hexdigest()}
 path.with_suffix('.meta.json').write_text(json.dumps(metadata,indent=2)+'\n');print('Saved',path,flush=True)
 if failed:raise SystemExit(1)
if __name__=='__main__':main()
