"""ChatGPT/Codex: derive passage-selection SFT from the frozen Claude/Codex split.
No external test data. Bound targets must resolve back to original exact quotes.
"""
import argparse,datetime,hashlib,json
from pathlib import Path
from selection import SYSTEM,clauses,user_content,resolve_selection
sha=lambda p:hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main():
 p=argparse.ArgumentParser();p.add_argument('--source',required=True);p.add_argument('--output',required=True);a=p.parse_args();source=Path(a.source);out=Path(a.output)
 if out.exists():p.error('Output exists')
 original=json.loads((source/'manifest.json').read_text());audit=json.loads((source/'audit_guard_v2.json').read_text())
 if not audit['passed'] or audit['manifest_sha256']!=sha(source/'manifest.json'):p.error('Stale/failed source audit')
 for name,h in original['file_hashes'].items():
  if sha(source/name)!=h:p.error('Source data changed')
 out.mkdir(parents=True,exist_ok=False);counts={}
 for split in ('train','dev'):
  output=[]
  for line in (source/f'{split}.jsonl').read_text().splitlines():
   row=json.loads(line);note=row['messages'][1]['content'];target=json.loads(row['messages'][-1]['content']);parts=clauses(note);selected=[]
   for i in target['items']:
    matches=[c for c in parts if c['text']==i['evidence']]
    if len(matches)!=1:raise ValueError('Ambiguous/nonmatching target passage')
    selected.append({'term':i['term'],'status':i['status'],'clause_id':matches[0]['id'],'duration_days':i['duration_days']})
   result={'items':selected}
   if resolve_selection(result,note)!=target:raise ValueError('Target binding changed original gold')
   output.append({'messages':[{'role':'system','content':SYSTEM},{'role':'user','content':user_content(note)},{'role':'assistant','content':json.dumps(result,ensure_ascii=False,separators=(',',':'))}],'original_note':note})
  (out/f'{split}.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False,separators=(',',':'))+'\n' for r in output));counts[split]=len(output)
  (out/f'{split}.annotations.jsonl').write_bytes((source/f'{split}.annotations.jsonl').read_bytes())
 (out/'valid.jsonl').write_bytes((out/'dev.jsonl').read_bytes())
 manifest={'schema_version':'afyanote.selection-sft/0.1','authored_by':'Claude source lexicon, Codex split and passage-selection representation','representation':'passage_id','created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source_manifest_sha256':sha(source/'manifest.json'),'source_audit_sha256':sha(source/'audit_guard_v2.json'),'generator_sha256':sha(__file__),'selection_sha256':sha(Path(__file__).parent/'selection.py'),'counts':counts,'all_targets_resolve_to_original_gold':True,'file_hashes':{f.name:sha(f) for f in out.glob('*.jsonl')},'qualified_review':False,'limitations':['Known synthetic development split','Source ID binding prevents invented quotes, not wrong source choice or semantic status','Original 4-status ambiguity restrictions retained']}
 (out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 (out/'audit_guard_v2.json').write_text(json.dumps({'passed':True,'manifest_sha256':sha(out/'manifest.json'),'meaning':'All selected targets resolve exactly to original targets that passed strict guard; original split overlaps zero','source_audit_sha256':sha(source/'audit_guard_v2.json')},indent=2)+'\n')
 print('Derived',counts,'all targets resolve to original gold')
if __name__=='__main__':main()
