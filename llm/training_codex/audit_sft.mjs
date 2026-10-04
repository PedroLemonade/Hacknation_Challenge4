// ChatGPT/Codex audit; guard verifies shape/copy/duration, not clinical semantics.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {guard} from '../guard.mjs';
const dir=resolve(process.argv[2]||'');
const load=p=>readFileSync(p,'utf8').trim().split('\n').map(x=>JSON.parse(x));
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const canonical=s=>s.normalize('NFKC').toLowerCase().match(/[\p{L}\p{N}_]+/gu)?.join(' ')||'';
const stem=process.argv[3]||'audit';
if(!/^[a-zA-Z0-9_-]+$/.test(stem))throw Error('Invalid report name');
const reportPath=join(dir,stem+'.json');
if(existsSync(reportPath))throw Error('Audit already exists; preserve it');
const manifest=JSON.parse(readFileSync(join(dir,'manifest.json')));
const labels=JSON.parse(readFileSync(new URL('../schema.json',import.meta.url))).properties.items.items.properties.term.enum;
for(const [name,hash] of Object.entries(manifest.file_hashes))if(sha(join(dir,name))!==hash)throw Error('Dataset hash mismatch '+name);
const notes={};const families={};const issues=[];const review=[];const covered=new Set();const splits={};
for(const split of ['train','dev']){
 const rows=load(join(dir,split+'.jsonl')),meta=load(join(dir,split+'.annotations.jsonl'));
 if(rows.length!==meta.length)throw Error('Annotation count mismatch');
 notes[split]=new Set();families[split]=new Set();let targets=0;const cells={};
 for(let n=0;n<rows.length;n++){
  const r=rows[n],m=meta[n],msg=r.messages;
  if(msg.length!==3||msg.map(x=>x.role).join()!=='system,user,assistant')throw Error('Bad chat roles');
  const note=msg[1].content,key=canonical(note),target=JSON.parse(msg[2].content);
  if(notes[split].has(key))issues.push({id:m.id,reason:'duplicate_canonical_note'});
  notes[split].add(key);m.families.forEach(f=>families[split].add(f));
  const g=guard(target,note,labels);
  targets+=target.items.length;
  if(g.rejected.length||g.warnings.length||g.accepted.length!==target.items.length)issues.push({id:m.id,rejected:g.rejected,warnings:g.warnings});
  for(let i=0;i<g.accepted.length;i++)if(g.accepted[i].duration_days!==target.items[i].duration_days)issues.push({id:m.id,reason:'duration_changed'});
  const cellKeys=target.items.map(i=>[split,m.language,i.term,i.status,i.duration_days===null?'no-duration':'duration'].join('/'));
  if(m.empty_target)cellKeys.push([split,m.language,'empty'].join('/'));
  const novel=cellKeys.some(k=>!covered.has(k));
  cellKeys.forEach(k=>{cells[k]=(cells[k]||0)+1;covered.add(k);});
  if(novel)review.push({id:m.id,split,language:m.language,note,target,review_status:'unreviewed',reviewer:null,decision:null,corrected_target:null,comments:'',synthetic:true});
 }
 splits[split]={rows:rows.length,unique_notes:notes[split].size,targets,cells};
}
const overlap=[...notes.train].filter(x=>notes.dev.has(x));
const familyOverlap=[...families.train].filter(x=>families.dev.has(x));
const report={schema_version:'afyanote.sft-audit/0.1',authored_by:'ChatGPT / Codex',manifest_sha256:sha(join(dir,'manifest.json')),source_hashes:{'audit_sft.mjs':sha(new URL(import.meta.url)),'guard.mjs':sha(new URL('../guard.mjs',import.meta.url)),'rules.js':sha(new URL('../../app/rules.js',import.meta.url))},splits,canonical_note_overlap:overlap.length,family_overlap:familyOverlap.length,issues,all_targets_guard_exact:issues.length===0,passed:!issues.length&&!overlap.length&&!familyOverlap.length,qualified_review:false,review_packet_rows:review.length};
writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');
writeFileSync(join(dir,stem+'_review_packet.jsonl'),review.map(x=>JSON.stringify(x)).join('\n')+'\n');
writeFileSync(join(dir,stem+'_review_packet.md'),'# Qualified review packet\n\nClaude source lexicon; selection by ChatGPT/Codex. All examples synthetic and unreviewed. '+review.length+' cases cover split/language/term/status/duration combinations. This is a selection, not a review of all rows.\n\nFor each JSONL row, review the original note and all omitted/added terms, subject, tense, negation, quoted span and duration. Especially: inability vs refusal, weakness vs tiredness, convulsion vs condition, lethargy vs normal sleep. Do not invent a diagnosis. Record reviewer/decision/correction/comments in a NEW file; preserve this packet. Freeze a separate test before model selection. Do not train on review/test answers until split policy is redesigned.\n');
console.log(JSON.stringify({passed:report.passed,overlap:overlap.length,familyOverlap:familyOverlap.length,issues:issues.length,review_rows:review.length,splits:Object.fromEntries(Object.entries(splits).map(([k,v])=>[k,{rows:v.rows,targets:v.targets}]))}));
if(!report.passed)process.exitCode=1;
