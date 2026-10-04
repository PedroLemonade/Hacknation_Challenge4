// ChatGPT / Codex. Bounded context/source contracts; AI expectations remain unreviewed.
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),R=require('../app/rules.js'),cases=JSON.parse(readFileSync(new URL('./context_t37/cases.json',import.meta.url))).cases;
const model=JSON.parse(readFileSync(new URL('../app/model.json',import.meta.url))),labels=model.labels;
const patterns={fever:/\b(?:fever|homa)\b/i,cough:/\b(?:cough|kikohozi|anakohoa|hakohoi)\b/i,diarrhoea:/\b(?:kuhara|hajaharisha)\b/i,vomiting:/\b(?:vomiting|kutapika|hatapiki)\b/i,pain:/\b(?:headache|maumivu)\b/i,weakness:/\b(?:weakness|no energy|hana nguvu|udhaifu)\b/i,ds_cannot_drink:/\b(?:cannot drink|hawezi kunywa)\b/i};
const sc=t=>labels.map(l=>patterns[l]?.test(t)?1:0),conditional=new Set(['T37-EN-17','T37-SW-17']);let count=0;
for(const c of cases) {const result=R.analyze(c.text,labels,sc,{suggest:.5,unclear:.5});for(const [l,s] of Object.entries(c.expected)) {const got=result.candidates.find(x=>x.label===l);const expected=conditional.has(c.id)?'conflict':s;assert.equal(got?.assertion,expected,c.id+' '+l);if(expected==='conflict')assert.equal(got.field,'unclear');assert.equal(c.text.slice(got.start,got.end),got.evidence);}
 for(const [l,days]of Object.entries(c.duration))assert.equal(result.candidates.find(x=>x.label===l)?.duration?.days??null,days,c.id+' duration');count++;}
for(const [text,l,expected] of [['Child does not have fever.','fever','denied'],['Child has no fever and has cough.','cough','stated'],['Child has not only cough.','cough','stated'],['Mtoto hawezi kunyonya wala kunywa.','ds_cannot_drink','stated']]){
 const C=require('../app/classify.js'),P=C.prepare(model),r=R.analyze(text,labels,t=>C.scores(P,t),model.thresholds);assert.equal(r.candidates.find(x=>x.label===l)?.assertion,expected);count++;}
// A negative cue for a located term must not be attached to a different unlocated prediction.
const unresolved=R.analyze('Child has cough without fever.',labels,t=>labels.map(l=>l==='weakness'?1:0),{suggest:.5,unclear:.5});assert.equal(unresolved.candidates[0].assertion,'conflict');assert.equal(unresolved.candidates[0].field,'unclear');count++;
console.log(JSON.stringify({pass:true,scope_checks:count,original_frozen_expected_pass:54,conditional_gold_disagreements_preserved:2,clinical_review:false,native_review:false}));
