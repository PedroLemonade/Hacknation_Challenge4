// ChatGPT / Codex: denominator and corrupt-run contract tests, no LLM or phone required.
import assert from 'node:assert/strict';
import { scoreAnswers } from './eval_llm.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const notes=[{id:'a',text:'fever',gold:[{label:'fever',assertion:'affirmed'}]},
  {id:'b',text:'cough',gold:[{label:'cough',assertion:'denied'}]},
  {id:'c',text:'No finding',gold:[]}];
const answer=(id,term,status,evidence)=>({id,raw:{items:[{term,status,evidence,duration_days:null}]},ms:0});
const a=answer('a','fever','stated','fever'),b=answer('b','cough','denied','cough');
const score=(as,ns=notes)=>scoreAnswers(as,ns,['fever','cough'],()=>[]);
const tests=[];
const check=(name,fn)=>{try{fn();tests.push({name,pass:true});}catch(e){tests.push({name,pass:false,error:e.message});}};
check('Partial run keeps all gold terms in denominator',()=>{const s=score([a]);assert.equal(s.recall,.5);assert.equal(s.gold_terms,2);assert.equal(s.missing_notes,2);assert.equal(s.complete,false);});
check('Duplicate answer IDs abort',()=>assert.throws(()=>score([a,a]),/duplicate_answer_id/));
check('Unknown answer IDs abort',()=>assert.throws(()=>score([{...a,id:'elsewhere'}]),/unknown_answer_id/));
check('Duplicate dataset IDs abort',()=>assert.throws(()=>score([],[notes[0],notes[0]]),/duplicate_dataset_id/));
check('Missing empty-gold note is not an exact match',()=>assert.equal(score([a,b]).exact_notes,2));
check('Completed empty-gold note counts only with valid JSON',()=>assert.equal(score([a,b,{id:'c',raw:{items:[]}}]).exact_notes,3));
check('Invalid JSON does not become an exact empty-gold note',()=>{const s=score([{id:'c',raw:'I cannot help'}]);assert.equal(s.exact_notes,0);assert.equal(s.not_json,1);});
check('Failed requests cannot contribute apparently valid answers',()=>{const s=score([{...a,error:'timeout'}]);assert.equal(s.found_terms,0);assert.equal(s.failed_notes,1);assert.equal(s.median_ms,null);assert.equal(s.complete,false);});
check('Zero millisecond successful capture is recorded',()=>assert.equal(score([a]).median_ms,0));
check('Other wrong statuses lower status agreement',()=>{const s=score([answer('a','fever','past','fever'),b]);assert.equal(s.status_acc,.5);assert.equal(s.ctx,0);});
check('Wrong stated status is explicitly counted',()=>assert.equal(score([a,answer('b','cough','stated','cough')]).ctx,1));
check('No extracted terms has undefined conditional accuracy',()=>assert.equal(score([]).status_acc,null));
check('Unsupported gold status aborts',()=>assert.throws(()=>score([],[{...notes[0],gold:[{label:'fever',assertion:'maybe'}]}]),/unsupported_gold_status/));
const result={created_by:'ChatGPT / Codex',created_at:new Date().toISOString(),source_sha256:createHash('sha256').update(readFileSync(new URL('./eval_llm.mjs',import.meta.url))).digest('hex'),passed:tests.filter(t=>t.pass).length,total:tests.length,tests};
const i=process.argv.indexOf('--report');if(i>=0)writeFileSync(process.argv[i+1],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));if(result.passed!==result.total)process.exitCode=1;
