"""ChatGPT/Codex: training-fit diagnostics, NOT a quality test.
Only fixed existing training samples; records next-token errors vs teacher loss.
"""
import argparse,json,os,hashlib
from pathlib import Path
os.environ.update(HF_HUB_OFFLINE='1',TRANSFORMERS_OFFLINE='1',TOKENIZERS_PARALLELISM='false')
import mlx.core as mx
import mlx.nn as nn
from mlx_lm import load,generate
from mlx_lm.sample_utils import make_sampler
PROJECT=Path(__file__).resolve().parents[2]
def main():
 p=argparse.ArgumentParser();p.add_argument('--run',required=True);p.add_argument('--output',required=True);a=p.parse_args();out=Path(a.output)
 if out.exists():p.error('Output exists')
 run=Path(a.run);m=json.loads((run/'manifest.json').read_text());cfg=json.loads((run/'requested_config.json').read_text())
 if hashlib.sha256((run/m['adapter']['path']).read_bytes()).hexdigest()!=m['adapter']['sha256']:p.error('Adapter changed')
 model,t=load(cfg['model'],adapter_path=str(run/'adapter'),tokenizer_config={'trust_remote_code':False});model.eval()
 rows=[json.loads(s) for s in (PROJECT/'llm/sft_runs/20261004_family_v03/train.jsonl').read_text().splitlines()]
 indices=[0,1,2,3,4,5,10,20];results=[]
 for idx in indices:
  row=rows[idx];target=row['messages'][-1]['content'];prompt=t.apply_chat_template(row['messages'][:-1],tokenize=False,add_generation_prompt=True,enable_thinking=False)
  prefix=t.encode(prompt,add_special_tokens=False);completion=t.encode(target,add_special_tokens=False)
  tokens=prefix+completion+[t.eos_token_id];logits=model(mx.array([tokens[:-1]]))[0];loss=nn.losses.cross_entropy(logits[len(prefix)-1:],mx.array(tokens[len(prefix):])).mean().item()
  transitions=[]
  for j in range(min(8,len(completion))):
   distribution=mx.softmax(logits[len(prefix)+j-1].astype(mx.float32));gold=completion[j];pred=mx.argmax(distribution).item()
   transitions.append({'position':j,'gold':t.decode([gold]),'predicted':t.decode([pred]),'gold_probability':distribution[gold].item()})
  raw=generate(model,t,prompt=prefix,max_tokens=512,sampler=make_sampler(temp=0),verbose=False)
  results.append({'training_row':idx,'note':row['messages'][1]['content'],'target':target,'raw':raw,'completion_tokens':len(completion),'teacher_forced_mean_ce_without_padding':loss,'first_transitions':transitions})
 out.write_text(json.dumps({'created_by':'ChatGPT / Codex','purpose':'Training fit only, no held-out claim','run_manifest_sha256':hashlib.sha256((run/'manifest.json').read_bytes()).hexdigest(),'rows':results},ensure_ascii=False,indent=2)+'\n')
 print([(r['training_row'],round(r['teacher_forced_mean_ce_without_padding'],3),r['raw'][:55]) for r in results])
if __name__=='__main__':main()
