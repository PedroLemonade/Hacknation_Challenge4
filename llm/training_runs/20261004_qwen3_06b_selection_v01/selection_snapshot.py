"""ChatGPT/Codex: passage-ID representation; quotes always retrieved from source.
Exact source binding does not prove the selected term, person or time is correct.
"""
import json,re
LABELS=['fever','cough','diarrhoea','vomiting','pain','weakness','ds_cannot_drink','ds_vomits_everything','ds_convulsions','ds_lethargic']
STATUSES=['stated','denied','other_person','past']
SYSTEM='''Extract fixed documentation terms from the supplied numbered passages. No diagnosis or advice.
Terms: fever/Homa, cough/Kikohozi, diarrhoea/Kuhara, vomiting/Kutapika, pain/Maumivu, weakness/Udhaifu, ds_cannot_drink/Hawezi kunywa au kunyonya, ds_vomits_everything/Anatapika kila kitu, ds_convulsions/Degedege, ds_lethargic/Amelegea au hajitambui.
Return JSON only: {"items":[{"term":"allowed ID","status":"stated","clause_id":"c0","duration_days":null}]}.
Each mentioned term once, max 10 items. stated=patient now; denied=explicit absence in patient; other_person=someone else; past=previous week/month. Choose the passage that actually mentions the term; never create text. Inability to drink is stated, not denied. Hana nguvu means stated weakness. Vomits everything also mentions vomiting. duration_days is 1..365 only for stated and explicit days in its own passage, otherwise null. Nonhealth or normal drinking/alertness: {"items":[]}. Skip unclear combined contexts.'''
def clauses(note):
 result=[];start=0
 def append(a,b):
  text=note[a:b];left=len(text)-len(text.lstrip());right=len(text.rstrip());text=text.strip()
  if text:result.append({'id':f'c{len(result)}','text':text,'start':a+left,'end':a+right})
 for m in re.finditer(r';\s*|\.(?:\s+|$)|\n+',note):append(start,m.start());start=m.end()
 append(start,len(note))
 if len(result)>32:raise ValueError('More than 32 source passages')
 return result

def user_content(note):return json.dumps({'clauses':[{'id':c['id'],'text':c['text']} for c in clauses(note)]},ensure_ascii=False,separators=(',',':'))
def resolve_selection(raw,note):
 obj=json.loads(raw) if isinstance(raw,str) else raw
 if not isinstance(obj,dict) or set(obj)!={'items'} or not isinstance(obj['items'],list) or len(obj['items'])>10:raise ValueError('Invalid selection root')
 source={c['id']:c for c in clauses(note)};items=[];seen=set()
 for i in obj['items']:
  if not isinstance(i,dict) or set(i)!={'term','status','clause_id','duration_days'}:raise ValueError('Invalid selection item shape')
  if i['term'] not in LABELS or i['status'] not in STATUSES or i['clause_id'] not in source:raise ValueError('Invalid term/status/source ID')
  if i['term'] in seen:raise ValueError('Duplicate selected term')
  d=i['duration_days']
  if d is not None and (type(d)!=int or not 1<=d<=365):raise ValueError('Invalid duration')
  c=source[i['clause_id']]
  if note[c['start']:c['end']]!=c['text']:raise ValueError('Source-offset mismatch')
  items.append({'term':i['term'],'status':i['status'],'evidence':c['text'],'duration_days':d});seen.add(i['term'])
 return {'items':items}
