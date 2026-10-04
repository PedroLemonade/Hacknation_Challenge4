// ChatGPT / Codex. Shared metrics for known synthetic regressions; no training.
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
export const sha = value => createHash('sha256').update(value).digest('hex');
export const STATUS = {affirmed:'stated',stated:'stated',denied:'denied',other_person:'other_person',past:'past',conflict:'conflict'};
export function validateNotes(notes, labels, expectedCount = null) {
  if (!Array.isArray(notes) || !notes.length || (expectedCount !== null && notes.length !== expectedCount)) throw Error(`Expected ${expectedCount ?? 'nonempty'} notes; received ${notes?.length}.`);
  const ids = new Set();
  for (const [i,n] of notes.entries()) {
    const at = `Note ${i+1} (${n?.id ?? 'no id'})`;
    if (!n || typeof n.id !== 'string' || !n.id || ids.has(n.id)) throw Error(`${at}: missing/duplicate id.`);
    ids.add(n.id);
    if (typeof n.text !== 'string' || !n.text.trim() || !Array.isArray(n.gold)) throw Error(`${at}: text and gold array required.`);
    if (!['sw','en','mixed'].includes(n.language ?? n.lang) || n.synthetic !== true) throw Error(`${at}: language and synthetic:true required.`);
    const seen = new Set();
    for (const g of n.gold) {
      if (!g || !labels.includes(g.label) || seen.has(g.label) || !Object.hasOwn(STATUS,g.assertion)) throw Error(`${at}: gold requires unique supported label and assertion.`);
      seen.add(g.label);
      if (Object.hasOwn(g,'duration_days') && g.duration_days !== null && (!Number.isInteger(g.duration_days) || g.duration_days < 1 || g.duration_days > 365)) throw Error(`${at}: invalid gold duration_days.`);
    }
    if (n.gold_age !== undefined) {
      const a=n.gold_age;
      if (!a || !['suggested','unclear','missing'].includes(a.status) || (a.status==='suggested' && (!Number.isFinite(a.value) || a.value<0 || !['years','months'].includes(a.unit)))) throw Error(`${at}: invalid gold_age.`);
    }
  }
  return notes;
}
const ratio = (a,b) => b ? a/b : null;
export function scoreNotes(notes, labels, rules, scorer, thresholds) {
  const t={notes:notes.length,gold_terms:0,found_terms:0,correct_status:0,status_mismatches:0,wrong_stated:0,extra_suggested:0,extra_including_unclear:0,found_unclear:0,suggested_tp:0,suggested_fp:0,exact_notes:0,annotated_ages:0,correct_ages:0,annotated_durations:0,correct_durations:0};
  const details=[], confusion={}, ageStatuses={}, langs={};
  for (const n of notes) {
    const res=rules.analyze(n.text,labels,scorer,thresholds), candidates=res.candidates;
    if (res.error) throw Error(`${n.id}: pipeline rejected a benchmark note: ${res.error}`);
    const cands=new Map(candidates.map(c=>[c.label,c])), gl=new Set(n.gold.map(g=>g.label)), errors=[];
    const lang=n.language ?? n.lang, l=langs[lang]??={notes:0,gold:0,found:0,status_correct:0,extras:0};l.notes++;
    for (const g of n.gold) {
      t.gold_terms++;l.gold++;
      const c=cands.get(g.label), want=STATUS[g.assertion];
      if (!c) errors.push({kind:'missing_term',label:g.label,expected:want});
      else {
        t.found_terms++;l.found++;if(c.field==='unclear')t.found_unclear++;
        confusion[want]??={};confusion[want][c.assertion]=(confusion[want][c.assertion]??0)+1;
        if (c.assertion===want) {t.correct_status++;l.status_correct++;}
        else {t.status_mismatches++;if(c.assertion==='stated')t.wrong_stated++;errors.push({kind:'status_mismatch',label:g.label,expected:want,actual:c.assertion});}
      }
      if (Object.hasOwn(g,'duration_days')) {t.annotated_durations++;if(c && (c.duration?.days??null)===g.duration_days)t.correct_durations++;else errors.push({kind:'duration',label:g.label,expected:g.duration_days,actual:c?.duration?.days??null});}
    }
    for (const c of candidates) {
      if(n.text.slice(c.start,c.end)!==c.evidence)throw Error(`${n.id}: evidence offset mismatch.`);
      for(const other of c.others??[])if(n.text.slice(other.start,other.end)!==other.evidence)throw Error(`${n.id}: additional evidence offset mismatch.`);
      if (!gl.has(c.label)) {t.extra_including_unclear++;l.extras++;errors.push({kind:'extra_term',label:c.label,field:c.field,actual:c.assertion});}
      if(c.field==='suggested') {if(gl.has(c.label))t.suggested_tp++;else {t.suggested_fp++;t.extra_suggested++;}}
    }
    if(candidates.length===n.gold.length && n.gold.every(g=>cands.get(g.label)?.assertion===STATUS[g.assertion]))t.exact_notes++;
    ageStatuses[res.age.status]=(ageStatuses[res.age.status]??0)+1;
    if(n.gold_age) {t.annotated_ages++;const a=n.gold_age; const ok=res.age.status===a.status && (a.status!=='suggested'||(res.age.value===a.value&&res.age.unit===a.unit));if(ok)t.correct_ages++;else errors.push({kind:'age',expected:a,actual:res.age});}
    details.push({id:n.id,language:lang,text:n.text,gold:n.gold,candidates,age:res.age,errors});
  }
  const p=ratio(t.suggested_tp,t.suggested_tp+t.suggested_fp)??0,r=ratio(t.suggested_tp,t.gold_terms)??0;
  return {totals:t,term_recall_including_unclear:ratio(t.found_terms,t.gold_terms),status_accuracy_of_found:ratio(t.correct_status,t.found_terms),suggested_only:{tp:t.suggested_tp,fp:t.suggested_fp,fn:t.gold_terms-t.suggested_tp,precision:p,recall:r,f1:p+r?2*p*r/(p+r):0},status_confusion_on_found:confusion,age:{annotated:t.annotated_ages,correct:t.correct_ages,accuracy:ratio(t.correct_ages,t.annotated_ages),observed_statuses:ageStatuses,caveat:t.annotated_ages?'Only explicitly annotated ages scored.':'No gold age annotations: observed age states are not accuracy.'},duration:{annotated:t.annotated_durations,correct:t.correct_durations,accuracy:ratio(t.correct_durations,t.annotated_durations)},by_language:langs,details};
}
export function writeFreshRun(out, artifacts) {
  mkdirSync(path.dirname(out),{recursive:true});
  try {mkdirSync(out);} catch(e) {if(e.code==='EEXIST')throw Error(`Output already exists; choose a fresh run directory: ${out}`);throw e;}
  for(const [name,data] of Object.entries(artifacts))writeFileSync(path.join(out,name),typeof data==='string'?data:JSON.stringify(data,null,2)+'\n',{flag:'wx'});
}
