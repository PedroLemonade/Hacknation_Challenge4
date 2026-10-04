"""ChatGPT / Codex: immutable review materials. No predictions or human approval."""
import argparse,hashlib,json,datetime,re,unicodedata
from pathlib import Path
P=Path(__file__).resolve().parents[2]
# Thirty underlying linguistic families; four variants per family are correlated.
# tuple(stratum,language,text,term,word,person,polarity,time,reporter)
BASE=[
('negation','en','Child has cough without fever.','fever','fever','patient','denied','current',None),
('negation','sw','Mtoto ana kikohozi bila homa.','fever','homa','patient','denied','current',None),
('negation','mixed','Mtoto has cough bila homa.','fever','homa','patient','denied','current',None),
('other_person','en','Mother has no fever; child has cough.','fever','fever','other','denied','current',None),
('other_person','sw','Baba hana homa; mtoto ana kikohozi.','fever','homa','other','denied','current',None),
('other_person','mixed','Mama has no fever; mtoto ana kikohozi.','fever','fever','other','denied','current',None),
('witness','en','Child has fever in front of grandmother.','fever','fever','patient','stated','current',None),
('witness','sw','Mtoto ana homa mbele ya bibi.','fever','homa','patient','stated','current',None),
('witness','mixed','Mtoto has fever mbele ya mama.','fever','fever','patient','stated','current',None),
('reporter','en','Mother says the child has cough.','cough','cough','patient','stated','current','mother'),
('reporter','sw','Mama anasema mtoto ana kikohozi.','cough','kikohozi','patient','stated','current','mama'),
('reporter','mixed','Mama says mtoto ana kikohozi.','cough','kikohozi','patient','stated','current','mama'),
('past','en','Last month the child had fever, no cough.','fever','fever','patient','stated','past',None),
('past','sw','Mwezi uliopita mtoto alikuwa na homa.','fever','homa','patient','stated','past',None),
('past','mixed','Last month mtoto alikuwa na homa.','fever','homa','patient','stated','past',None),
('orphan','en','Father has fever. Cough for three days.','cough','Cough','unresolved','stated','current',None),
('orphan','sw','Baba ana homa. Kikohozi siku tatu.','cough','Kikohozi','unresolved','stated','current',None),
('orphan','mixed','Baba has fever. Cough siku tatu.','cough','Cough','unresolved','stated','current',None),
('duration_age','en','Child aged 2.5 years has cough for 3 days without fever.','cough','cough','patient','stated','current',None),
('duration_age','sw','Mtoto wa miaka 2,5 ana kikohozi siku tatu bila homa.','cough','kikohozi','patient','stated','current',None),
('duration_age','mixed','Mtoto age 2 has cough siku tatu bila homa.','cough','cough','patient','stated','current',None),
('typo','en','Child has couhg and a hot body since yesterday.','cough','couhg','patient','stated','current',None),
('typo','sw','Mtoto ana kikohozi na homma tangu jana.','fever','homma','patient','stated','current',None),
('typo','mixed','Child ana kikohozi na homma tangu jana.','fever','homma','patient','stated','current',None),
('new_wording','en','The child passed loose stools after lunch.','diarrhoea','loose stools','patient','stated','current',None),
('new_wording','sw','Mtoto ametoa choo chepesi leo.','diarrhoea','choo chepesi','patient','stated','current',None),
('new_wording','mixed','Mtoto passed loose stools leo.','diarrhoea','loose stools','patient','stated','current',None),
('no_finding','en','Visit rescheduled because the household was away.',None,None,'unresolved','unresolved','unresolved',None),
('no_finding','sw','Ziara imeahirishwa kwa sababu familia haikuwepo.',None,None,'unresolved','unresolved','unresolved',None),
('no_finding','mixed','Visit rescheduled; familia haikuwepo.',None,None,'unresolved','unresolved','unresolved',None),
]
FRAMES={'en':['{}','Household visit note: {}','{} Notebook page checked.','Visit record: {} Next visit date is not recorded.'], 'sw':['{}','Maelezo ya ziara: {}','{} Daftari limeangaliwa.','Kumbukumbu ya ziara: {} Tarehe ya ziara ijayo haijaandikwa.'], 'mixed':['{}','Visit note: {}','{} Daftari limeangaliwa.','Household visit: {} Next visit date haijaandikwa.']}
UTF16=lambda s:len(s.encode('utf-16-le'))//2
sha=lambda b:hashlib.sha256(b).hexdigest()
def build(out):
 if out.exists():raise ValueError('Output already exists; choose a fresh review directory.')
 blind=[];draft=[]
 for fi,(stratum,lang,text,term,word,person,polarity,time,reporter) in enumerate(BASE):
  for vi,frame in enumerate(FRAMES[lang]):
   note=frame.format(text);ident=f'GR26-{fi+1:02}-{vi+1}';family=f'GR26-F{fi+1:02}'
   b={'id':ident,'family_id':family,'stratum':stratum,'language':lang,'text':note,'synthetic':True,'review':{'status':'unreviewed','reviewer_id':None,'reviewed_at':None,'items':None,'age':None,'comment':None}}
   blind.append(b)
   items=[]
   if term:
    start=note.index(word);items=[{'term':term,'experiencer':person,'reporter':reporter,'patient_role':'child','negation':polarity,'temporality':time,'evidence':{'text':word,'start_utf16':UTF16(note[:start]),'end_utf16':UTF16(note[:start+len(word)])},'duration_days':None,'single_status_draft':'conflict' if person=='unresolved' or person=='other' and (polarity=='denied' or time=='past') or polarity=='denied' and time=='past' else 'other_person' if person=='other' else 'past' if time=='past' else polarity}]
   draft.append({'id':ident,'family_id':family,'created_by':'ChatGPT / Codex','draft_only':True,'clinical_review':False,'native_review':False,'completeness':'One focal example item only; reviewers must annotate every relevant mention. Not a scoring goldset.','focal_items':items,'comment':'Negation/subject/time spans and other findings intentionally left for blinded human annotation; do not assume complete gold from focal drafts.'})
 canonical=lambda s:' '.join(re.findall(r'\w+',unicodedata.normalize('NFKC',s).casefold()))
 assert len(blind)==120 and len({canonical(n['text']) for n in blind})==120
 known=[json.loads(l)['text'] for file in ['eval/independent_notes.jsonl','data/notes_test.jsonl'] for l in (P/file).read_text().splitlines()]
 train=[json.loads(l)['messages'][1]['content'] for l in (P/'llm/sft_runs/20261004_family_v03/train.jsonl').read_text().splitlines()]
 old_keys={canonical(s) for s in known+train}
 overlap=[b['id'] for b in blind if canonical(b['text']) in old_keys];assert not overlap
 regressions=[c['text'] for folder in ['context_t31','context_t37'] for c in json.loads((P/'eval'/folder/'cases.json').read_text())['cases']]
 shared_regression=[b['id'] for b in blind if canonical(b['text']) in {canonical(s) for s in regressions}]
 out.mkdir(parents=True)
 write=lambda name,rows:(out/name).write_text(''.join(json.dumps(x,ensure_ascii=False)+'\n' for x in rows))
 write('reviewer_A.jsonl',blind);write('reviewer_B.jsonl',blind);write('ai_focal_draft_NOT_GOLD.jsonl',draft)
 manifest={'created_by':'ChatGPT / Codex','created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'schema':'afyanote.review-packet/1','notes':120,'new_note_texts_outside_context_cases':120-len(shared_regression),'shared_context_case_ids':shared_regression,'underlying_families':30,'variants_per_family':4,'language_counts':{'en':40,'sw':40,'mixed':40},'synthetic':True,'clinical_review':False,'native_review':False,'predictions_run':False,'training_allowed':False,'canonical_overlap_checked':{'known_40':0,'known_400':0,'sft_train_3000':0},'limitations':['Written after known rule repairs by same AI author; not blind external case acquisition. Shared T31/T37 notes explicitly listed.','Four context-frame variants per family are correlated; count families in resampling.','AI draft has focal items only, intentionally incomplete; never score model from it.','Human reviewers must improve naturalness/meaning and all evidence dimensions.'],'frozen_code':{f:sha((P/f).read_bytes()) for f in ['app/rules.js','app/model.json','app/classify.js','app/sw.js']},'files':{f.name:sha(f.read_bytes()) for f in out.iterdir() if f.is_file()}}
 (out/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n');print(json.dumps({'notes':120,'families':30,'out':str(out),'no_predictions':True}))
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('--out',type=Path,required=True);build(a.parse_args().out)
