"""Claude SFT idea; immutable family-split rebuild by ChatGPT/Codex.
Only lexicon train/negated pools. Never reads app gold/test datasets.
python3 llm/export_sft.py --output-dir llm/sft_runs/a-new-name
"""
import argparse
from collections import Counter
from datetime import datetime, timezone
import hashlib, json, random, re, sys, unicodedata
from pathlib import Path
HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / 'training'))
from lexicon import LABELS, LEX, PATIENT, OTHER, NUM_SW, DISTRACT

# Conservative development exclusions, not qualified clinical/linguistic review.
EXCLUDE = {
 'vomiting': {'ametapika':'tense needs review','vomited':'intrinsic past'},
 'weakness': {'amechoka sana':'fatigue is a broader proxy'},
 'ds_cannot_drink': {'hanyonyi':'no feeding does not establish inability','amekataa kunyonya':'refusal does not establish inability','hakunywa chochote':'no intake does not establish inability'},
 'ds_convulsions': {'alipata degedege':'intrinsic past','had convulsions':'intrinsic past','mwili ulikuwa unatetemeka':'past trembling is a broader proxy','kifafa':'condition vs current event','fits':'ambiguous word','no fits':'ambiguous word','hakuwa na degedege':'past denial cannot fit one current status'},
 'ds_lethargic': {'usingizi mzito':'sleep vs danger sign','very sleepy':'sleep vs danger sign','amezimia':'fainting/tense needs review'},
}
STATUSES = ['stated','denied','other_person','past']
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
def dump(x): return json.dumps(x,ensure_ascii=False,separators=(',',':'))
def canonical(x): return ' '.join(re.findall(r'\w+',unicodedata.normalize('NFKC',x).casefold()))

def pools():
 out={'train':{},'dev':{}}; excluded=[]; shared=[]; missing=[]
 for lang in ('en','sw'):
  for label in LABELS:
   for status in STATUSES:
    source=LEX[label]['negated' if status=='denied' else 'train'][lang]
    # Ability/alertness phrases are empty-target contrasts, not explicit denials.
    if status=='denied' and label in ('ds_cannot_drink','ds_vomits_everything','ds_lethargic'): source=[]
    good=[]
    for phrase in source:
     reason=EXCLUDE.get(label,{}).get(phrase)
     if reason: excluded.append({'language':lang,'term':label,'status':status,'phrase':phrase,'reason':reason})
     else: good.append(phrase)
    key=f'{lang}/{label}/{status}'
    if not good: missing.append(key); continue
    if len(good)==1:
     shared.append({'cell':key,'phrase':good[0],'reason':'singleton; subject/template families only held out'})
     a,b=good,good
    else: a,b=good[:-1],good[-1:]
    out['train'][key],out['dev'][key]=a,b
 return out,excluded,shared,missing

def clause(lang,split,rng,pool):
 label=rng.choice(LABELS); status=rng.choices(STATUSES,[55,20,15,10])[0]
 key=f'{lang}/{label}/{status}'
 if key not in pool: return None
 phrase=rng.choice(pool[key]); original=phrase
 subjects=OTHER[lang] if status=='other_person' else [s for s in PATIENT[lang] if s!='Amani']
 cut=(len(subjects)+1)//2
 subject=rng.choice(subjects[:cut] if split=='train' else subjects[cut:]); days=None
 if status=='past':
  phrase += {'en':{'train':' last week','dev':' last month'},'sw':{'train':' wiki iliyopita','dev':' mwezi uliopita'}}[lang][split]
 elif status=='stated' and rng.random()<.45:
  days=rng.randint(1,7)
  phrase += (f' kwa siku {NUM_SW[days]}' if split=='train' else f' siku {days}') if lang=='sw' else (f' for {days} days' if split=='train' else f' {days} days')
 template=rng.choice(['subject_colon','subject_space'] if split=='train' else ['subject_dash','subject_parenthesis'])
 text={'subject_colon':f'{subject}: {phrase}','subject_space':f'{subject} {phrase}','subject_dash':f'{subject} — {phrase}','subject_parenthesis':f'{phrase} ({subject})'}[template]
 items=[{'term':label,'status':status,'evidence':text,'duration_days':days}]
 if label=='ds_vomits_everything': items.append({'term':'vomiting','status':status,'evidence':text,'duration_days':days})
 family=f'{lang}/{label}/{status}/{original}/{template}'
 return text,items,family

def distractors(lang,split):
 source=list(DISTRACT[lang]); cut=len(source)*2//3
 pool=source[:cut] if split=='train' else source[cut:]
 for label in ('ds_cannot_drink','ds_lethargic'):
  phrases=LEX[label]['negated'][lang]
  pool += phrases[:-1] if split=='train' else phrases[-1:]
 return pool

def example(split,rng,pool,system):
 language=rng.choices(['en','sw','mixed'],[45,45,10])[0]
 base=rng.choice(['en','sw']) if language=='mixed' else language
 parts=[]; items=[]; families=[]; used=set()
 if rng.random()<.15:
  source=distractors(base,split); parts=rng.sample(source,rng.randint(1,min(3,len(source))))
  families=[f'distractor/{base}/{s}' for s in parts]; language=base
 else:
  count=rng.choice([1,1,2,2,3]) if language!='mixed' else rng.choice([2,3])
  for idx in range(count):
   lang=('en' if idx%2==0 else 'sw') if language=='mixed' else base
   for _ in range(50):
    c=clause(lang,split,rng,pool)
    if c and not any(i['term'] in used for i in c[1]):
     t,its,family=c;parts.append(t);items.extend(its);families.append(family);used.update(i['term'] for i in its);break
   else: raise ValueError('Could not construct unique-term clause')
  if rng.random()<.15:
   t=rng.choice(distractors(base,split));parts.append(t);families.append(f'distractor/{base}/{t}')
 note=rng.choice(['. ','; ']).join(parts)
 row={'messages':[{'role':'system','content':system},{'role':'user','content':note},{'role':'assistant','content':dump({'items':items})}]}
 meta={'language':language,'families':families,'terms':[i['term'] for i in items],'statuses':[i['status'] for i in items],'empty_target':not bool(items),'synthetic':True}
 return row,meta

def build(seed=7070,train_count=3000,dev_count=300):
 source,excluded,shared,missing=pools();system=(HERE/'prompt.txt').read_text();result={};stats={};seen=set()
 for idx,(split,target) in enumerate((('train',train_count),('dev',dev_count))):
  rng=random.Random(seed+idx*100003);rows=[];annotations=[];attempts=0;duplicates=0
  while len(rows)<target and attempts<max(1000,target*100):
   attempts+=1;row,meta=example(split,rng,source[split],system);key=canonical(row['messages'][1]['content'])
   if key in seen:duplicates+=1;continue
   seen.add(key);meta.update({'id':f'sft-{split}-{len(rows):05d}','split':split,'canonical_note_sha256':hashlib.sha256(key.encode()).hexdigest()})
   rows.append(row);annotations.append(meta)
  if len(rows)!=target:raise ValueError(f'{split}: requested {target}, unique capacity reached {len(rows)}; no silent duplication')
  result[split]=(rows,annotations)
  stats[split]={'requested':target,'rows':len(rows),'unique_canonical_notes':len(rows),'raw_attempts':attempts,'duplicate_attempts_excluded':duplicates,'language':dict(Counter(x['language'] for x in annotations)),'terms':dict(Counter(t for x in annotations for t in x['terms'])),'statuses':dict(Counter(t for x in annotations for t in x['statuses'])),'empty_targets':sum(x['empty_target'] for x in annotations)}
 return result,stats,excluded,shared,missing

def export(output,seed=7070,train_count=3000,dev_count=300):
 output=Path(output).resolve()
 if output.exists():raise FileExistsError('Existing output directory; choose a new run name')
 result,stats,excluded,shared,missing=build(seed,train_count,dev_count)
 output.mkdir(parents=True,exist_ok=False)
 for split,(rows,meta) in result.items():
  (output/f'{split}.jsonl').write_text(''.join(dump(x)+'\n' for x in rows))
  (output/f'{split}.annotations.jsonl').write_text(''.join(dump(x)+'\n' for x in meta))
 (output/'valid.jsonl').write_bytes((output/'dev.jsonl').read_bytes())
 manifest={'schema_version':'afyanote.sft/0.3','created_at':datetime.now(timezone.utc).isoformat(),'authored_by':'Claude lexicon/toolkit; rebuilt by ChatGPT / Codex','seed':seed,'synthetic':True,'qualified_review':False,'stats':stats,
 'split_definition':'Before sampling: train phrases all but last, dev last. Singleton phrases shared but all subject, template, time/duration and distractor families disjoint. Canonical notes unique across both splits.',
 'canonicalization':'Unicode NFKC, casefold, word tokens; punctuation/whitespace ignored','shared_singleton_phrases':shared,'unavailable_cells':missing,'excluded_phrasings':excluded,
 'not_used':['LEX heldout pool','data/notes_test.jsonl','eval/independent_notes.jsonl','original llm/sft'],
 'limitations':['Known synthetic development split, not independent field evaluation','Four statuses cannot encode overlapping person/time/negation; no such cases trained','Every clause has its own explicit subject; orphans excluded','Normal ability/alertness phrases are empty contrasts; explicit no convulsions can be denied','No Kikuyu; SW and mixed-language annotation need qualified review'],
 'source_hashes':{str(p.relative_to(HERE.parent)):sha(p) for p in [Path(__file__),HERE.parent/'training/lexicon.py',HERE/'prompt.txt',HERE/'schema.json']},
 'file_hashes':{p.name:sha(p) for p in sorted(output.glob('*.jsonl'))}}
 (output/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');return manifest

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--output-dir',required=True);p.add_argument('--seed',type=int,default=7070);p.add_argument('--train-count',type=int,default=3000);p.add_argument('--dev-count',type=int,default=300)
 a=p.parse_args()
 if min(a.train_count,a.dev_count)<1:p.error('Both splits must contain rows')
 m=export(a.output_dir,a.seed,a.train_count,a.dev_count);print(dump({'output':a.output_dir,'stats':m['stats']}))
if __name__=='__main__':main()
