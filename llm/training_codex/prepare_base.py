"""ChatGPT/Codex: pin/download official Qwen weights, convert locally to MLX INT4.
No remote code, no inference API, no notes sent out. Fresh destination required.
"""
import argparse, datetime, hashlib, json, os, platform, subprocess, sys
from pathlib import Path
os.environ['HF_HUB_DISABLE_TELEMETRY']='1'
os.environ['HF_HUB_DISABLE_IMPLICIT_TOKEN']='1'
from huggingface_hub import HfApi, snapshot_download

def sha(p):
 h=hashlib.sha256()
 with Path(p).open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''):h.update(b)
 return h.hexdigest()
def main():
 p=argparse.ArgumentParser();p.add_argument('--output',required=True);p.add_argument('--revision');a=p.parse_args()
 out=Path(a.output).resolve()
 if out.exists():p.error('Destination exists; use a new folder')
 repo='Qwen/Qwen3-0.6B';info=HfApi().model_info(repo,revision=a.revision,token=False)
 if info.gated:p.error('Gated repository: user acceptance needed')
 out.mkdir(parents=True,exist_ok=False)
 (out/'download_plan.json').write_text(json.dumps({'repo':repo,'revision':info.sha,'gated':info.gated,'started_at':datetime.datetime.now(datetime.timezone.utc).isoformat()},indent=2)+'\n')
 print('Downloading pinned official base',repo,info.sha,flush=True)
 source=snapshot_download(repo_id=repo,revision=info.sha,token=False,local_dir=out/'official_bf16',allow_patterns=['*.json','*.safetensors','*.txt','*.jinja','LICENSE*','README.md'],max_workers=2)
 command=[sys.executable,'-m','mlx_lm','convert','--hf-path',source,'--mlx-path',str(out/'mlx_int4'),'-q','--q-bits','4','--q-group-size','64']
 print('Local INT4 conversion',flush=True)
 with (out/'conversion.log').open('w') as log:
  result=subprocess.run(command,stdout=log,stderr=subprocess.STDOUT)
 if result.returncode:raise RuntimeError('Conversion failed; inspect conversion.log; folder preserved')
 import mlx.core as mx
 files={str(f.relative_to(out)):{'sha256':sha(f),'bytes':f.stat().st_size} for d in ('official_bf16','mlx_int4') for f in sorted((out/d).glob('*')) if f.is_file()}
 manifest={'schema_version':'afyanote.base-model/0.1','prepared_by':'ChatGPT / Codex','original_model_author':'Qwen / Alibaba','repo':repo,'revision':info.sha,'license':'Apache-2.0; original LICENSE retained','source_url':f'https://huggingface.co/{repo}/tree/{info.sha}','quantization':{'bits':4,'group_size':64,'converted_locally':True},'trust_remote_code':False,'conversion_command':command,'machine':{'platform':platform.platform(),'device':mx.device_info()},'conversion_peak_mlx_gb':mx.get_peak_memory()/1e9,'files':files,'completed_at':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 # Conversion ran in a child process; this process's MLX peak is not that process's peak.
 manifest.pop('conversion_peak_mlx_gb')
 (out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 print('Prepared',out/'mlx_int4',flush=True)
if __name__=='__main__':main()
