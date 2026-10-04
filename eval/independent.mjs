// Claude pipeline foundation; immutable known-regression runner rebuilt by ChatGPT / Codex (T33).
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {sha,validateNotes,scoreNotes,writeFreshRun} from './benchmark_lib.mjs';
const require=createRequire(import.meta.url),root=fileURLToPath(new URL('../',import.meta.url));
const read=p=>readFileSync(path.join(root,p));
export function main(args=process.argv.slice(2)) {
  const opts={mode:'regression',benchmark:'independent'};
  for(let i=0;i<args.length;i++) {const a=args[i];if(a==='--help'){console.log('node eval/independent.mjs --out eval/runs/UNIQUE [--benchmark independent|generated] [--mode regression|baseline]');return;}
    if(!['--out','--mode','--benchmark'].includes(a)||!args[i+1]||args[i+1].startsWith('--'))throw Error(`Invalid/missing argument ${a}. Use --help.`);opts[a.slice(2)]=args[++i];}
  if(!opts.out)throw Error('Required --out: use a fresh eval/runs/ directory. Historical reports are never overwritten.');
  if(!['regression','baseline'].includes(opts.mode)||!['independent','generated'].includes(opts.benchmark))throw Error('Invalid mode or benchmark.');
  const out=path.resolve(root,opts.out),allowed=path.join(root,'eval',opts.mode==='baseline'?'baselines':'runs');
  if(!out.startsWith(allowed+path.sep))throw Error(`Output must be a new directory under ${path.relative(root,allowed)}/.`);
  const test=opts.benchmark==='independent'?'eval/independent_notes.jsonl':'data/notes_test.jsonl',bytes=read(test),model=JSON.parse(read('app/model.json')),dict=JSON.parse(read('data/dictionary.json'));
  const notes=validateNotes(bytes.toString().trim().split('\n').map((l,i)=>{try{return JSON.parse(l);}catch{throw Error(`Invalid JSON at note line ${i+1}.`);}}),model.labels,opts.benchmark==='independent'?40:400);
  const C=require('../app/classify.js'),R=require('../app/rules.js'),P=C.prepare(model);
  const results={model:scoreNotes(notes,model.labels,R,t=>C.scores(P,t),model.thresholds),keyword_list:scoreNotes(notes,model.labels,R,R.dictionaryScorer(dict,model.labels),{suggest:.5,unclear:.5})};
  const paths=[test,'app/sw.js','app/rules.js','app/classify.js','app/model.json','data/dictionary.json','app/dictionary.json','eval/independent.mjs','eval/benchmark_lib.mjs'];
  const hashes=Object.fromEntries(paths.map(p=>[p,sha(read(p))]));
  const manifest={schema:'afyanote.benchmark-run/1',created_at:new Date().toISOString(),created_by:'ChatGPT / Codex',runner_version:'T33-1',mode:opts.mode,benchmark:opts.benchmark,title:opts.benchmark==='independent'?'Known 40-note second-author regression':'Known 400-note generator regression',app_version:read('app/sw.js').toString().match(/const VERSION = "([^"]+)"/)[1],source_hashes:hashes,test_sha256:sha(bytes),gold_labels_sha256:sha(JSON.stringify(notes.map(n=>({id:n.id,gold:n.gold,gold_age:n.gold_age??null})))),notes:notes.length,synthetic:true,clinical_review:false,native_swahili_review:false,previously_seen:true,known_repairs:['Decimal age after initial second-author test','T31 witness/person and orphan context; see preserved results','Later rule repairs recorded in matching rule review and source hash'],parameters_tuned_on_40:false,model_training_performed:false,interpretation:opts.mode==='baseline'?'Explicit first measurement at this fresh destination; already-known data. Baseline mode does not make this an unseen test.':'Rerun on already-known synthetic notes after disclosed repairs; not independent field validation.',metric_definitions:{suggested_only_f1:'Label-only micro F1; suggested candidates; all gold terms in recall denominator; no status correctness implied.',term_recall:'All found labels, including unclear.',status_accuracy:'Correct normalized status / found gold labels; missing terms excluded.',status_mismatches:'All wrong found statuses including conflict/other_person; wrong_stated is only the narrow subset.',exact_notes:'All candidate labels and normalized statuses match; excludes age, duration and semantic source validation.',extras:'Both suggested-only and including unclear reported separately.',age:'Only scored when gold_age explicitly annotated.'}};
  if(paths.some(p=>sha(read(p))!==hashes[p]))throw Error('Sources changed during run; no report written.');
  const fmt=v=>v===null?'not scored':v.toFixed(3);
  let md=`# ${manifest.title}\n\n${manifest.app_version}; ${manifest.created_at}. ${manifest.interpretation}\n\nUnreviewed synthetic SW/EN/mixed data. Model parameters/thresholds unchanged by this runner. Known age/person repairs disclosed; rules are hashed. ${notes.length} notes.\n\n| Metric | Model + rules | Dictionary + rules |\n|---|---|---|\n`;
  for(const [title,get] of [['Recall including unclear',x=>`${x.totals.found_terms}/${x.totals.gold_terms} (${fmt(x.term_recall_including_unclear)})`],['Status correct / found',x=>`${x.totals.correct_status}/${x.totals.found_terms} (${fmt(x.status_accuracy_of_found)})`],['All status mismatches',x=>x.totals.status_mismatches],['Wrong status shown as stated (subset)',x=>x.totals.wrong_stated],['Extra suggested / all extra candidates',x=>`${x.totals.extra_suggested} / ${x.totals.extra_including_unclear}`],['Suggested-only label micro F1',x=>fmt(x.suggested_only.f1)],['Exact label/status notes',x=>`${x.totals.exact_notes}/${notes.length}`],['Age agreement (annotated only)',x=>fmt(x.age.accuracy)]])md+=`| ${title} | ${get(results.model)} | ${get(results.keyword_list)} |\n`;
  md+='\nMissing terms and all incorrect statuses are separate. Zero wrong-stated errors does not mean zero context errors. Exact notes exclude duration/source correctness. No age gold in the original sets; raw age states are descriptive.\n\n## Errors\n';
  for(const [name,r]of Object.entries(results))for(const d of r.details)for(const e of d.errors)md+=`- ${name}, ${d.id}: ${JSON.stringify(e)}\n`;
  md+=`\n## Reproduction\n\nRun from the project directory with a new destination:\n\n\`node eval/independent.mjs --benchmark ${opts.benchmark} --out eval/runs/NEXT_UNIQUE_RUN\`\n\nManifest and results are in this directory; sources/hash definitions are in manifest.json. No original report, gold file, model or app asset is rewritten.\n`;
  writeFreshRun(out,{'manifest.json':manifest,'results.json':{manifest,results},'results.md':md});
  console.log(JSON.stringify({out:path.relative(root,out),version:manifest.app_version,model:results.model.totals,keyword_list:results.keyword_list.totals},null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {try{main();}catch(e){console.error(e.message);process.exitCode=1;}}
