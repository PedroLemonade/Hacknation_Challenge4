// ChatGPT/Codex: development comparison, fixed denominator incl. missing/failed notes.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {guard} from '../guard.mjs';
const labels=JSON.parse(readFileSync(new URL('../schema.json',import.meta.url))).properties.items.items.properties.term.enum;
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const load=p=>readFileSync(p,'utf8').trim().split('\n').filter(Boolean).map(x=>JSON.parse(x));
const ratio=(n,d)=>d?Math.round(n/d*10000)/10000:null;
export function score(answers,dataset){
 const ids=new Set(dataset.map(x=>x.id));if(ids.size!==dataset.length)throw Error('Duplicate gold IDs');
 const seen=new Set();for(const a of answers){if(!ids.has(a.id))throw Error('Unknown answer ID');if(seen.has(a.id))throw Error('Duplicate answer ID');seen.add(a.id);}
 const by=new Map(answers.map(a=>[a.id,a]));const errors=[];const details=[];const times=[];
 const s={expected_notes:dataset.length,answered_notes:answers.length,missing_notes:dataset.length-answers.length,failed_notes:0,structurally_valid_notes:0,gold_terms:0,found_terms:0,status_correct:0,extra_terms:0,term_status_exact_notes:0,term_status_duration_exact_notes:0,gold_durations:0,correct_durations:0,stated_false_positive_terms:0,rejected:{},warnings:{}};
 for(const d of dataset){
  const gold=new Map(d.target.items.map(i=>[i.term,i]));if(gold.size!==d.target.items.length)throw Error('Duplicate gold terms');
  const a=by.get(d.id);if(a?.error)s.failed_notes++;
  const g=a&&!a.error?guard(a.raw,d.text,labels):{accepted:[],rejected:[],warnings:[]};
  g.rejected.forEach(r=>s.rejected[r.reason]=(s.rejected[r.reason]||0)+1);g.warnings.forEach(r=>s.warnings[r.reason]=(s.warnings[r.reason]||0)+1);
  const got=new Map(g.accepted.map(i=>[i.term,i]));s.gold_terms+=gold.size;
  const valid=Boolean(a&&!a.error&&!g.rejected.length);if(valid)s.structurally_valid_notes++;
  for(const [term,it] of gold){
   const pred=got.get(term);if(it.duration_days!==null)s.gold_durations++;
   if(pred){s.found_terms++;if(pred.status===it.status)s.status_correct++;if(it.duration_days!==null&&pred.status===it.status&&pred.duration_days===it.duration_days)s.correct_durations++;}
  }
  for(const [term,pred] of got){if(!gold.has(term))s.extra_terms++;if(pred.status==='stated'&&gold.get(term)?.status!=='stated')s.stated_false_positive_terms++;}
  const exact=valid&&got.size===gold.size&&[...gold].every(([t,i])=>got.get(t)?.status===i.status);
  const durationExact=exact&&!g.warnings.length&&[...gold].every(([t,i])=>got.get(t).duration_days===i.duration_days);
  if(exact)s.term_status_exact_notes++;if(durationExact)s.term_status_duration_exact_notes++;
  const detail={id:d.id,language:d.language,text:d.text,gold:d.target,raw:a?.raw??null,error:a?.error??null,accepted:g.accepted,rejected:g.rejected,warnings:g.warnings,term_status_exact:exact,term_status_duration_exact:durationExact};details.push(detail);
  if(!durationExact)errors.push(detail);
  if(a&&!a.error&&Number.isFinite(a.ms))times.push(a.ms);
 }
 times.sort((a,b)=>a-b);
 const metrics={...s,recall:ratio(s.found_terms,s.gold_terms),status_agreement_on_found:ratio(s.status_correct,s.found_terms),term_precision:ratio(s.found_terms,s.found_terms+s.extra_terms),duration_recall:ratio(s.correct_durations,s.gold_durations),term_and_status_micro_f1:ratio(2*s.status_correct,s.gold_terms+s.found_terms+s.extra_terms),median_ms:times.length?times[Math.floor(times.length/2)]:null,complete:s.missing_notes===0&&s.failed_notes===0};
 return {metrics,details,errors};
}
function main(){
 const dir=resolve(process.argv[2]||'');const out=join(dir,'comparison.json');if(existsSync(out))throw Error('Comparison exists; preserve it');
 const manifest=JSON.parse(readFileSync(join(dir,'manifest.json'))),dataset=load(join(dir,'frozen_eval.jsonl'));
 if(sha(join(dir,'frozen_eval.jsonl'))!==manifest.evaluation.sha256)throw Error('Frozen dataset changed');
 const results={};
 for(const name of ['base','adapter']){
  const c=manifest.captures[name];if(sha(join(dir,c.path))!==c.sha256)throw Error('Capture changed: '+name);
  results[name]=score(load(join(dir,c.path)),dataset);
 }
 const report={schema_version:'afyanote.qlora-comparison/0.1',authored_by:'ChatGPT / Codex',generated_at:new Date().toISOString(),run_manifest_sha256:sha(join(dir,'manifest.json')),source_hashes:{scorer:sha(new URL(import.meta.url)),guard:sha(new URL('../guard.mjs',import.meta.url)),schema:sha(new URL('../schema.json',import.meta.url))},evaluation:manifest.evaluation,synthetic:true,qualified_review:false,results};
 writeFileSync(out,JSON.stringify(report,null,2)+'\n');
 let md='# QLoRA development comparison\n\nClaude source lexicon/toolkit; split and actual training by ChatGPT/Codex. Base weights: Qwen/Alibaba. '+manifest.iterations_completed+' updates, not a full epoch. This '+dataset.length+'-note synthetic Dev subset was frozen before training. It is a known development comparison, not a clinical, language or independent test. No app integration.\n\n| Model | Valid shape / notes | Terms / gold | Matching status / found | Extra | Exact term/status | Exact incl. duration | Duration / gold | Median ms |\n|---|---|---|---|---|---|---|---|---|\n';
 for(const name of ['base','adapter']){const m=results[name].metrics;md+=`| ${name} | ${m.structurally_valid_notes}/${m.expected_notes} | ${m.found_terms}/${m.gold_terms} | ${m.status_correct}/${m.found_terms} | ${m.extra_terms} | ${m.term_status_exact_notes}/${m.expected_notes} | ${m.term_status_duration_exact_notes}/${m.expected_notes} | ${m.correct_durations}/${m.gold_durations} | ${Math.round(m.median_ms??0)} |\n`;}
 md+='\nAll missing and failed answers count in the full selected-subset denominator. Guarded exact quotes do not establish semantic correctness. JSON errors, rejected items, dropped durations and all note-level raw errors are retained in comparison.json. No constrained JSON decoder was used; this measures learned output behavior. Temperature 0, thinking disabled, same system prompt and token cap before/after. Median is Mac wall time, not phone timing.\n\nMLX peak through training: '+manifest.peak_mlx_allocator_gb_through_training.toFixed(3)+' GB; allocator memory only, not total process/OS memory. Adapter: '+manifest.adapter.bytes+' bytes. Disk model size, RAM and download size are separate. Validation loss uses sampled batches, not task correctness.\n';
 writeFileSync(join(dir,'comparison.md'),md);console.log(md);
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)main();
