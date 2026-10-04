"""ChatGPT / Codex: pure local fictional transport validation; no clinical validation or network."""
import argparse,copy,hashlib,json,math
from pathlib import Path
LABELS={'fever','cough','diarrhoea','vomiting','pain','weakness','ds_cannot_drink','ds_vomits_everything','ds_convulsions','ds_lethargic'}
ROOT_FIELDS={'schema','form_reference','status','created_device_time','referral_time','case_id','sex','age','community_health_unit','link_health_facility','community_health_promoter','main_problems','documented_absent','mentioned_other_person_or_past','who_imci_general_danger_signs_confirmed','treatment_given','original_note','consent_recorded','model','review_log','demo_data_fictional'}
ITEM_FIELDS={'term_en','term_sw','label','evidence','duration_days','duration_source','status','edited_by_user'}
LOG_FIELDS={'label','decision','selected_status','original_rule_status','edited_by_user','evidence'}
STATUSES={'stated','denied','other_person','past'}
class InvalidDraft(ValueError):pass
def need(ok,message):
 if not ok:raise InvalidDraft(message)
def integer(x):return type(x) is int
def units(text):return len(text.encode('utf-16-le'))//2
def slice16(text,a,b):
 try:return text.encode('utf-16-le')[2*a:2*b].decode('utf-16-le')
 except UnicodeError:raise InvalidDraft('Evidence splits a Unicode character.')
def unique_object(pairs):
 d={}
 for k,v in pairs:
  need(k not in d,'Duplicate JSON key: '+k);d[k]=v
 return d
def load(path):
 need(path.stat().st_size<=1024*1024,'Draft exceeds local transport size limit (1 MiB).')
 return json.loads(path.read_text(),object_pairs_hook=unique_object,parse_constant=lambda x:(_ for _ in ()).throw(InvalidDraft('Non-finite JSON number: '+x)))
def validate(d):
 need(isinstance(d,dict) and set(d)==ROOT_FIELDS,'Root fields must match referral-draft/0.3 exactly; unknown or missing fields rejected.')
 need(d['schema']=='afyanote.referral-draft/0.3','Unsupported source schema.')
 need(d['status']=='reviewed_by_user' and d['consent_recorded'] is True,'Completed human review and explicit demo consent required.')
 need(d['demo_data_fictional'] is True,'This local mock accepts fictional demonstration data only.')
 text=d['original_note'];need(isinstance(text,str) and text.strip() and units(text)<=600,'Original note must be nonempty and at most 600 UTF-16 units.')
 if d['age'] is not None:
  a=d['age'];need(isinstance(a,dict) and set(a)=={'value','unit'} and isinstance(a['unit'],str) and a['unit'] in {'years','months'},'Invalid age object/unit.')
  v=a['value'];need(type(v) in {int,float} and math.isfinite(v) and 0<=v<=(120 if a['unit']=='years' else 1440),'Invalid age value.')
 for k in ['form_reference','created_device_time','referral_time','case_id','sex','community_health_unit','community_health_promoter','treatment_given']:
  need(d[k] is None or isinstance(d[k],str),'Invalid scalar field: '+k)
 need(isinstance(d['who_imci_general_danger_signs_confirmed'],list) and all(isinstance(x,str) for x in d['who_imci_general_danger_signs_confirmed']),'Invalid fixed display labels.')
 # These nested objects are preserved for a partner-specific mapping. Check shape,
 # not clinical meaning or verified facility/device identifiers.
 if d['link_health_facility'] is not None:
  f=d['link_health_facility'];need(isinstance(f,dict) and set(f)=={'id','name','type','keph_level','straight_line_km','demo_data'} and f['demo_data'] is True,'Invalid demo facility envelope.')
  need(all(isinstance(f[k],str) and f[k] for k in ['id','name','type']),'Invalid facility identifiers/display text.')
  need(type(f['straight_line_km']) in {int,float} and math.isfinite(f['straight_line_km']) and f['straight_line_km']>=0,'Invalid straight-line distance.')
 if d['model'] is not None:
  m=d['model'];need(isinstance(m,dict) and set(m)=={'name','version','thresholds'},'Invalid source model envelope.')
  need(isinstance(m['name'],str) and isinstance(m['version'],str) and isinstance(m['thresholds'],dict) and {'suggest','unclear'}<=set(m['thresholds'])<= {'suggest','unclear','dev_precision_at_suggest','dev_recall_at_suggest'},'Invalid model metadata.')
  need(all(type(v) in {int,float} and math.isfinite(v) and 0<=v<=1 for v in m['thresholds'].values()),'Invalid model thresholds.')
 logs=d['review_log'];need(isinstance(logs,list) and len(logs)<=10,'Invalid review log.')
 by_label={}
 for log in logs:
  need(isinstance(log,dict) and set(log)==LOG_FIELDS,'Invalid review entry fields.')
  label=log['label'];need(isinstance(label,str) and label in LABELS and label not in by_label,'Unknown/duplicate reviewed term.')
  need(isinstance(log['decision'],str) and log['decision'] in {'confirmed','rejected'},'Pending review cannot be transported.')
  need(log['selected_status'] is None or isinstance(log['selected_status'],str) and log['selected_status'] in STATUSES,'Invalid selected status.')
  need(isinstance(log['original_rule_status'],str) and log['original_rule_status'] in STATUSES|{'conflict'} and type(log['edited_by_user']) is bool,'Invalid source assertion/edit marker.')
  if log['decision']=='confirmed':
   need(log['selected_status'] in STATUSES,'Confirmed term still unresolved.')
   if log['selected_status']!=log['original_rule_status']:need(log['edited_by_user'],'Changed status must retain edit marker.')
  spans=log['evidence'];need(isinstance(spans,list) and spans,'Missing source evidence.')
  for e in spans:
   need(isinstance(e,dict) and set(e)=={'text','start','end'} and isinstance(e['text'],str) and e['text'],'Invalid evidence object.')
   a,b=e['start'],e['end'];need(integer(a) and integer(b) and 0<=a<b<=units(text),'Invalid evidence bounds.')
   need(slice16(text,a,b)==e['text'],'Evidence does not match original note at declared UTF-16 offset.')
  by_label[label]=log
 grouped={}
 for key,allowed in [('main_problems',{'stated'}),('documented_absent',{'denied'}),('mentioned_other_person_or_past',{'other_person','past'})]:
  need(isinstance(d[key],list),'Invalid output group: '+key)
  for item in d[key]:
   need(isinstance(item,dict) and set(item)==ITEM_FIELDS,'Invalid term item fields.')
   label=item['label'];need(isinstance(label,str) and label in LABELS and label not in grouped,'Unknown/duplicate grouped term.')
   need(isinstance(item['status'],str) and item['status'] in allowed and type(item['edited_by_user']) is bool,'Group and term status mismatch.')
   log=by_label.get(label);need(log and log['decision']=='confirmed' and log['selected_status']==item['status'] and log['edited_by_user']==item['edited_by_user'],'Term not backed by matching confirmed review.')
   need(isinstance(item['evidence'],str) and any(e['text']==item['evidence'] for e in log['evidence']),'Grouped evidence not linked to review evidence.')
   need(all(isinstance(item[k],str) and item[k] for k in ['term_en','term_sw']),'Missing fixed display text.')
   days=item['duration_days'];source=item['duration_source'];need(days is None and source is None or integer(days) and 1<=days<=365 and isinstance(source,str) and source in {'note','asked_during_visit'},'Invalid duration/source.')
   if item['status']!='stated':need(days is None and source is None,'Non-stated item cannot export a finding duration.')
   grouped[label]=item
 danger_names={'ds_cannot_drink':'Not able to drink or breastfeed','ds_vomits_everything':'Vomits everything','ds_convulsions':'Convulsions','ds_lethargic':'Lethargic or unconscious'}
 expected_danger={danger_names[l] for l,item in grouped.items() if l in danger_names and item['status']=='stated'}
 need(len(d['who_imci_general_danger_signs_confirmed'])==len(expected_danger) and set(d['who_imci_general_danger_signs_confirmed'])==expected_danger,'Fixed sign display list must match confirmed stated terms.')
 need(set(grouped)=={l for l,r in by_label.items() if r['decision']=='confirmed'},'Confirmed review and output groups differ.')
 return d
def build_mock(d):
 validate(d);canonical=json.dumps(d,ensure_ascii=False,sort_keys=True,separators=(',',':'),allow_nan=False);digest=hashlib.sha256(canonical.encode()).hexdigest()
 return {'schema':'afyanote.local-handover-mock/1','transport_status':'validated_for_local_mock','mock':True,'clinical_validation':False,'partner_mapping_confirmed':False,'record_key':'afyanote-mock:'+digest,'canonical_source_sha256':digest,'device_time_untrusted':d['created_device_time'],'source_draft':copy.deepcopy(d),'network_destination':None}
if __name__=='__main__':
 a=argparse.ArgumentParser();a.add_argument('input',type=Path);a.add_argument('--out',type=Path,required=True);args=a.parse_args()
 try:
  result=build_mock(load(args.input));args.out.parent.mkdir(parents=True,exist_ok=True)
  with args.out.open('x') as f:f.write(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
  print(json.dumps({'status':'local_mock_created','source_sha256':result['canonical_source_sha256'],'network_calls':0}))
 except (ValueError,OSError,UnicodeError) as e:raise SystemExit(str(e))
