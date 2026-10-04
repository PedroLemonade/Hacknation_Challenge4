// Claude scorer foundation; denominator/provenance/failure fixes by ChatGPT / Codex.
// Optional saved-answer experiment. Does not change app/ or frozen historical reports.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { guard, combine } from "./guard.mjs";
const require = createRequire(import.meta.url), C = require("../app/classify.js"), R = require("../app/rules.js");
const HERE = dirname(fileURLToPath(import.meta.url));
const model = JSON.parse(readFileSync(join(HERE,"../app/model.json"))), P = C.prepare(model), L = model.labels;
const scorer = (t) => C.scores(P,t);
const SETS = { independent: "../eval/independent_notes.jsonl", notes: "../data/notes_test.jsonl" };
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const load = (p) => readFileSync(p,"utf8").split("\n").filter(l=>l.trim()).map(l=>JSON.parse(l));
const MAP = { affirmed:"stated", stated:"stated", denied:"denied", other_person:"other_person", past:"past" };
const analyze = (t) => R.analyze(t,L,scorer,model.thresholds).candidates;
const classifierItems = (text) => analyze(text).filter(c=>c.assertion!=="conflict")
  .map(c=>({term:c.label,status:c.assertion,evidence:c.evidence,duration_days:c.duration?c.duration.days:null}));
const ratio = (n,d) => d ? +(n/d).toFixed(3) : null;

// Missing answers stay in the full dataset denominator. Corrupt IDs abort instead of inflating scores.
export function scoreAnswers(answers, dataset, labels = L, candidates = analyze) {
  const notes = new Map(dataset.map(n=>[n.id,n]));
  if (notes.size!==dataset.length) throw new Error("duplicate_dataset_id");
  const seen = new Set();
  for (const a of answers) {
    if (!notes.has(a.id)) throw new Error("unknown_answer_id: "+a.id);
    if (seen.has(a.id)) throw new Error("duplicate_answer_id: "+a.id);
    seen.add(a.id);
  }
  const byID = new Map(answers.map(a=>[a.id,a]));
  const s = {expected_notes:dataset.length,answered_notes:answers.length,missing_notes:dataset.length-answers.length,
    failed_notes:0,gold_terms:0,found_terms:0,correct_status:0,ctx:0,extra:0,exact_notes:0,not_json:0,rejected:{},warnings:{},
    hybrid:{found_terms:0,ctx:0,extra_suggested:0,unclear_cards:0},timings:[]};
  for (const n of dataset) {
    const gl=new Map(n.gold.map(x=>[x.label,MAP[x.assertion]]));
    if ([...gl.values()].some(v=>!v)) throw new Error("unsupported_gold_status: "+n.id);
    s.gold_terms+=gl.size;
    const a=byID.get(n.id);
    const failed=a && Boolean(a.error);
    if (failed) s.failed_notes++;
    const g=a && !failed ? guard(a.raw,n.text,labels) : {accepted:[],rejected:[],warnings:[]};
    if (g.rejected.some(r=>["not_json","no_items_array"].includes(r.reason))) s.not_json++;
    g.rejected.forEach(r=>{s.rejected[r.reason]=(s.rejected[r.reason]||0)+1;});
    g.warnings.forEach(w=>{s.warnings[w.reason]=(s.warnings[w.reason]||0)+1;});
    const got=new Map(g.accepted.map(x=>[x.term,x.status]));
    for (const [lab,want] of gl) if(got.has(lab)) {
      s.found_terms++;
      if(got.get(lab)===want)s.correct_status++;
      else if(got.get(lab)==="stated")s.ctx++;
    }
    for(const lab of got.keys())if(!gl.has(lab))s.extra++;
    if(a&&!failed&&g.rejected.length===0&&got.size===gl.size&&[...gl].every(([k,v])=>got.get(k)===v))s.exact_notes++;
    const hybrid=combine(candidates(n.text),g.accepted);
    for(const [lab,want] of gl){const h=hybrid.find(x=>x.label===lab);if(h){s.hybrid.found_terms++;if(h.field==="suggested"&&h.status==="stated"&&want!=="stated")s.hybrid.ctx++;}}
    hybrid.forEach(h=>{if(!gl.has(h.label)&&h.field==="suggested")s.hybrid.extra_suggested++;if(h.field==="unclear")s.hybrid.unclear_cards++;});
    if(a&&!failed&&Number.isFinite(a.ms)&&a.ms>=0)s.timings.push(a.ms);
  }
  const timings=s.timings.sort((a,b)=>a-b); delete s.timings;
  return {...s,coverage_complete:s.missing_notes===0,complete:s.missing_notes===0&&s.failed_notes===0,recall:ratio(s.found_terms,s.gold_terms),status_acc:ratio(s.correct_status,s.found_terms),
    hybrid:{...s.hybrid,recall:ratio(s.hybrid.found_terms,s.gold_terms)},median_ms:timings.length?timings[Math.floor(timings.length/2)]:null};
}

function main() {
  const arg=(name)=>{const i=process.argv.indexOf(name);if(i<0)return null;if(!process.argv[i+1]||process.argv[i+1].startsWith("--"))throw new Error("Missing value: "+name);return process.argv[i+1];};
  const inputDir=resolve(arg("--input-dir")||join(HERE,"outputs"));
  const reportDir=resolve(arg("--report-dir")||join(HERE,"reports",new Date().toISOString().replace(/[:.]/g,"-")));
  if(existsSync(join(reportDir,"results.json"))||existsSync(join(reportDir,"results.md")))throw new Error("Report exists; choose a new --report-dir.");
  mkdirSync(inputDir,{recursive:true});
  if(process.argv.includes("--selftest")) {
    for(const name of ["selftest_classifier__independent.jsonl","selftest_adversarial__independent.jsonl"])
      if(existsSync(join(inputDir,name)))throw new Error("Reference output exists; choose a new --input-dir.");
    const notes=load(join(HERE,SETS.independent));
    const ref=notes.map(n=>({id:n.id,model:"afyanote-classifier (reference)",set:"independent",raw:JSON.stringify({items:classifierItems(n.text)}),ms:0}));
    const bad=notes.map((n,i)=>({id:n.id,model:"adversarial (reference)",set:"independent",ms:0,raw:i%5===0?"Sure! Here is the JSON:":JSON.stringify({items:[
      {term:"fever",status:"stated",evidence:"child is very sick with high fever",duration_days:3},
      {term:"malaria",status:"stated",evidence:n.text.slice(0,12),duration_days:null},
      {term:"cough",status:"severe",evidence:n.text.slice(0,12),duration_days:null}]})}));
    for(const [name,data] of [["classifier",ref],["adversarial",bad]])writeFileSync(join(inputDir,`selftest_${name}__independent.jsonl`),data.map(x=>JSON.stringify(x)).join("\n")+"\n");
  }
  const files=readdirSync(inputDir).filter(f=>f.endsWith(".jsonl")).sort();
  if(!files.length)throw new Error("No saved answers. Run run_ollama.py or --selftest with a fresh --input-dir.");
  const rows=[];
  for(const f of files){
    const path=join(inputDir,f),ans=load(path);
    if(!ans.length)throw new Error("Empty answer file: "+f);
    const set=ans[0].set||"independent";
    if(!Object.hasOwn(SETS,set))throw new Error("Unknown set: "+set);
    if(ans.some(a=>(a.set||"independent")!==set||a.model!==ans[0].model))throw new Error("Mixed models/sets in "+f);
    const dp=join(HERE,SETS[set]),metaPath=path.replace(/\.jsonl$/,".meta.json");
    const meta=existsSync(metaPath)?JSON.parse(readFileSync(metaPath)):{};
    if(meta.dataset_sha256&&meta.dataset_sha256!==sha(dp))throw new Error("Dataset hash changed since capture: "+f);
    if(meta.answer_sha256&&meta.answer_sha256!==sha(path))throw new Error("Raw answers changed since capture: "+f);
    const result=scoreAnswers(ans,load(dp));
    rows.push({file:f,model:ans[0].model,set,...result,answer_sha256:sha(path),dataset_sha256:sha(dp),
      capture_provenance_verified:Boolean(meta.dataset_sha256),capture_complete:meta.complete??null,
      model_bytes:meta.model_bytes_on_disk||ans[0].model_bytes||null,
      ollama_loaded_size_bytes:meta.ollama_loaded_size_bytes||meta.memory_bytes_loaded||null,
      model_digest:meta.model_digest||null,machine:meta.machine||null});
  }
  const report={schema_version:"afyanote.llm-evaluation/0.2",generated_at:new Date().toISOString(),
    authored_by:"Claude foundation + ChatGPT / Codex review",source_hashes:Object.fromEntries(["guard.mjs","schema.json","prompt.txt","fewshot.json","eval_llm.mjs","../app/rules.js","../app/model.json","../app/classify.js"].map(f=>[f,sha(join(HERE,f))])),rows};
  let md="# Optional LLM experiment · guarded saved answers\n\nClaude toolkit, repaired and rerun by ChatGPT/Codex. All datasets are synthetic, unreviewed and already known during development. Reference rows use the existing classifier, **no actual LLM**. Phone performance and clinical validity are unmeasured.\n\n";
  md+="| Model | Set | Answers / expected | Failures | Terms / gold | Recall | Matching status / found | Extra terms | Exact notes / expected | Unclear hybrid cards | Median ms |\n|---|---|---|---|---|---|---|---|---|---|---|\n";
  for(const r of rows)md+=`| ${String(r.model).replace(/\|/g,"/")} | ${r.set} | ${r.answered_notes}/${r.expected_notes} | ${r.failed_notes} | ${r.found_terms}/${r.gold_terms} | ${r.recall??"n/a"} | ${r.correct_status}/${r.found_terms} | ${r.extra} | ${r.exact_notes}/${r.expected_notes} | ${r.hybrid.unclear_cards} | ${r.model.includes("(reference)")?"n/a (reference)":r.median_ms??"n/a"} |\n`;
  md+="\nMissing answers count as no extracted terms in the full dataset denominator. Duplicate or unknown IDs, mixed sets and a changed capture dataset abort the report. Partial runs are smoke tests, not comparable complete benchmarks. Status agreement is conditional on found terms, not clinical accuracy. Hybrid recall includes unresolved proposals. Exact quotes can still have incorrect term, subject or status meaning.\n\nThe JSON contains source, dataset and raw-answer hashes. Older raw files without capture hashes are explicitly unverified. Disk bytes and Ollama `/api/ps` loaded-model size are separate; the latter is not total process RAM or peak memory. Median wall time includes startup for the first note and excludes failed requests; raw timings remain available. No phone claim follows from a Mac run.\n";
  const ref=rows.find(r=>r.file.startsWith("selftest_classifier")),adv=rows.find(r=>r.file.startsWith("selftest_adversarial"));
  if(process.argv.includes("--selftest")) {
    // Derive exact expectations from this frozen dataset/current classifier, not a loose >0.85 tolerance.
    const ns=load(join(HERE,SETS.independent));
    const expected=ns.reduce((n,x)=>n+classifierItems(x.text).filter(it=>guard({items:[it]},x.text,L).accepted.length).length,0);
    const ok=Boolean(ref&&adv&&ref.complete&&adv.complete&&ref.found_terms+ref.extra===expected&&adv.found_terms===0&&adv.extra===0);
    report.selftest={passed:ok,expected_reference_terms:expected};
    md+=`\nReference contract selftest: **${ok?"PASS":"FAIL"}**, ${expected} expected classifier terms; adversarial terms 0. Run test_guard_codex.mjs and test_eval_codex.mjs for malformed-input and denominator regressions.\n`;
    if(!ok)process.exitCode=1;
  }
  mkdirSync(reportDir,{recursive:true});writeFileSync(join(reportDir,"results.json"),JSON.stringify(report,null,2)+"\n");writeFileSync(join(reportDir,"results.md"),md);
  console.log(md+"\nSaved new report: "+reportDir);
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url)main();
