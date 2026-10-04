// ChatGPT / Codex: denominator, status, age and immutable output contracts.
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,rmSync} from 'node:fs';
import os from 'node:os';import path from 'node:path';
import {validateNotes,scoreNotes,writeFreshRun,sha} from './benchmark_lib.mjs';
const labels=['fever','cough'],note={id:'x',text:'Fever.',language:'en',synthetic:true,gold:[{label:'fever',assertion:'affirmed'}]},bad=x=>assert.throws(()=>validateNotes([x],labels));let count=0;
for(const x of [{...note,gold:undefined},{...note,gold:[{label:'fever'}]},{...note,gold:[{label:'alien',assertion:'stated'}]},{...note,gold:[...note.gold,...note.gold]},{...note,synthetic:false},{...note,gold_age:{status:'suggested',unit:'years',value:'2'}}]){bad(x);count++;}
assert.throws(()=>validateNotes([note,note],labels),/duplicate/);count++;
const cand=(label,assertion,field='suggested')=>({label,assertion,field,evidence:'Fever.',start:0,end:6});
const rules=cs=>({analyze:()=>({candidates:cs,age:{status:'missing'}})});
let r=scoreNotes([note],labels,rules([cand('fever','stated')]),null,null);assert.equal(r.totals.exact_notes,1);assert.equal(r.age.accuracy,null);count++;
r=scoreNotes([note],labels,rules([cand('fever','other_person'),cand('cough','conflict','unclear')]),null,null);assert.equal(r.totals.status_mismatches,1);assert.equal(r.totals.wrong_stated,0);assert.equal(r.totals.extra_including_unclear,1);assert.equal(r.totals.extra_suggested,0);count++;
r=scoreNotes([note],labels,rules([]),null,null);assert.equal(r.suggested_only.fn,1);assert.equal(r.term_recall_including_unclear,0);assert.equal(r.status_accuracy_of_found,null);count++;
r=scoreNotes([{...note,gold_age:{status:'missing'}}],labels,rules([]),null,null);assert.equal(r.age.accuracy,1);count++;
assert.throws(()=>scoreNotes([note],labels,rules([{...cand('fever','stated'),end:5}]),null,null),/offset/);count++;
const dir=mkdtempSync(path.join(os.tmpdir(),'afya-t33-'));try{const out=path.join(dir,'run');writeFreshRun(out,{'manifest.json':{a:1}});const before=sha(readFileSync(path.join(out,'manifest.json')));assert.throws(()=>writeFreshRun(out,{'manifest.json':{a:2}}),/already exists/);assert.equal(sha(readFileSync(path.join(out,'manifest.json'))),before);count++;}finally{rmSync(dir,{recursive:true,force:true});}
console.log(JSON.stringify({pass:true,contract_checks:count}));
