// AfyaNote evaluation: model vs. dictionary baseline, using the SAME shipped web code.
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const C = require("../app/classify.js");
const R = require("../app/rules.js");
const u = (p) => new URL(p, import.meta.url);
const model = JSON.parse(readFileSync(u("../app/model.json")));
const dictionary = JSON.parse(readFileSync(u("../data/dictionary.json")));
const P = C.prepare(model);
const L = model.labels;
const T = model.thresholds;
const modelScorer = (t) => C.scores(P, t);
const dictScorer = R.dictionaryScorer(dictionary, L);

function csv(name) {
  const lines = readFileSync(u("../data/" + name), "utf8").replace(/\r/g, "").trim().split("\n").slice(1);
  return lines.map((line) => {
    const m = line.match(/^([^,]+),([^,]+),(.*),([^,]*),(true)$/);
    const text = m[3].startsWith('"') ? m[3].slice(1, -1).replace(/""/g, '"') : m[3];
    return { id: m[1], lang: m[2], text, labels: new Set(m[4].split(";").filter(Boolean)) };
  });
}

function prf(tp, fp, fn) {
  const p = tp / Math.max(tp + fp, 1), r = tp / Math.max(tp + fn, 1);
  return { precision: +p.toFixed(3), recall: +r.toFixed(3), f1: +(2 * p * r / Math.max(p + r, 1e-9)).toFixed(3), tp, fp, fn };
}

function passageEval(rows, scorer, thr) {
  const out = { all: [0, 0, 0], byLang: {}, distractorRows: 0, distractorHits: 0, perLabel: {} };
  L.forEach((l) => (out.perLabel[l] = [0, 0, 0]));
  for (const r of rows) {
    const s = scorer(r.text);
    const pred = new Set(L.filter((l, j) => s[j] >= thr));
    const bl = (out.byLang[r.lang] = out.byLang[r.lang] || [0, 0, 0]);
    if (r.labels.size === 0) { out.distractorRows++; if (pred.size) out.distractorHits++; }
    for (const l of L) {
      const g = r.labels.has(l), p = pred.has(l);
      const k = g && p ? 0 : !g && p ? 1 : g && !p ? 2 : -1;
      if (k >= 0) { out.all[k]++; bl[k]++; out.perLabel[l][k]++; }
    }
  }
  const res = { overall: prf(...out.all), byLang: {}, perLabel: {}, unrelated_text_false_alarm_rate: +(out.distractorHits / Math.max(out.distractorRows, 1)).toFixed(3), unrelated_rows: out.distractorRows };
  for (const k in out.byLang) res.byLang[k] = prf(...out.byLang[k]);
  for (const k in out.perLabel) res.perLabel[k] = prf(...out.perLabel[k]);
  return res;
}

const MAP = { affirmed: "stated", denied: "denied", other_person: "other_person", past: "past" };
function noteEval(notes, scorer, thr) {
  let gold = 0, found = 0, assertOk = 0, contextErrors = 0, fp = 0, unclearShown = 0;
  const byPool = {};
  for (const n of notes) {
    const res = R.analyze(n.text, L, scorer, thr);
    const cands = Object.fromEntries(res.candidates.map((c) => [c.label, c]));
    const goldLabels = new Set(n.gold.map((g) => g.label));
    const bp = (byPool[n.pool] = byPool[n.pool] || { gold: 0, found: 0, assertOk: 0 });
    for (const g of n.gold) {
      gold++; bp.gold++;
      const c = cands[g.label];
      if (!c) continue;
      found++; bp.found++;
      if (c.field === "unclear") unclearShown++;
      if (c.assertion === MAP[g.assertion]) { assertOk++; bp.assertOk++; }
      else if (c.assertion === "stated") contextErrors++; // denied / other person / past shown as plainly stated
    }
    for (const c of res.candidates) if (!goldLabels.has(c.label) && c.field === "suggested") fp++;
  }
  const pools = {};
  for (const k in byPool) pools[k] = { term_recall: +(byPool[k].found / byPool[k].gold).toFixed(3), assertion_accuracy_of_found: +(byPool[k].assertOk / Math.max(byPool[k].found, 1)).toFixed(3) };
  return { notes: notes.length, gold_terms: gold, term_recall: +(found / gold).toFixed(3), assertion_accuracy_of_found: +(assertOk / Math.max(found, 1)).toFixed(3),
           context_errors_shown_as_stated: contextErrors, extra_suggested_terms: fp, found_but_marked_unclear: unclearShown, byPool: pools };
}

// ---------------- contrast tests ----------------
const CONTRAST = [
  { text: "Fever for two days", expect: { fever: "stated" }, duration: { fever: 2 } },
  { text: "No fever for two days", expect: { fever: "denied" } },
  { text: "Mother has fever; child is well", expect: { fever: "other_person" } },
  { text: "Vomited once last week", expect: { vomiting: "past" } },
  { text: "Child aged 2 years; cough for 3 days", expect: { cough: "stated" }, age: "2 years", duration: { cough: 3 } },
  { text: "Age 2", expect: {}, age: "unclear" },
  { text: "Child is 1.5 years old with a cough", expect: { cough: "stated" }, age: "unclear" },
  { text: "Cough and diarrhoea", expect: { cough: "stated", diarrhoea: "stated" } },
  { text: "No treatment mentioned", expect: {} },
  { text: "No fever. Later note: fever today.", expect: { fever: "conflict" } },
  { text: "Das Kind hat Fieber seit gestern", expect: {}, noSuggested: true },
  { text: "", error: "empty" },
  { text: "😀😀😀", error: "no_text" },
  { text: "homa ".repeat(200), error: "too_long" },
  { text: "mtoto ana homa siku tatu", expect: { fever: "stated" }, duration: { fever: 3 } },
  { text: "mtoto hana homa", expect: { fever: "denied" } },
  { text: "mama ana homa, mtoto yuko sawa", expect: { fever: "other_person" } },
  { text: "mama anasema mtoto anakohoa", expect: { cough: "stated" } },
  { text: "hawezi kunywa na hana nguvu", expect: { ds_cannot_drink: "stated", weakness: "stated" } },
  { text: "anatapika kila kitu", expect: { ds_vomits_everything: "stated" } },
  { text: "alitapika wiki iliyopita", expect: { vomiting: "past" } },
  { text: "anakunywa vizuri", expect: {}, forbid: ["ds_cannot_drink"] },
  { text: "mtoto wa miaka miwili, kikohozi siku tatu", expect: { cough: "stated" }, age: "2 years", duration: { cough: 3 } },
  { text: "Mtoto ana degedege tangu jana na amelegea", expect: { ds_convulsions: "stated", ds_lethargic: "stated" }, duration: { ds_convulsions: 1 } },
  { text: "Kikohozi kavu, homma kidogo", expect: { cough: "stated", fever: "stated" } },
  { text: "Mama ana homa na anakohoa", expect: { fever: "other_person", cough: "other_person" } },
  { text: "Mama ana homa na mtoto anakohoa", expect: { fever: "other_person", cough: "stated" } },
  { text: "Mama ana homa. Pia anakohoa.", expect: { fever: "other_person", cough: "other_person" } },
  { text: "The mother has fever and cough", expect: { fever: "other_person", cough: "other_person" } },
  { text: "Mama ana homa. Mtoto anakohoa.", expect: { fever: "other_person", cough: "stated" } },
  // cases written by a second assistant (Codex) for its own prototype, reused unchanged
  { text: "Cough, pain and weakness.", expect: { cough: "stated", pain: "stated", weakness: "stated" }, src: "codex" },
  { text: "No fever, no cough.", expect: { fever: "denied", cough: "denied" }, src: "codex" },
  { text: "Hana homa.", expect: { fever: "denied" }, src: "codex" },
  { text: "Noor ana kikohozi kwa siku mbili.", expect: { cough: "stated" }, duration: { cough: 2 }, src: "codex" },
];

function runContrast(scorer) {
  return CONTRAST.map((tc) => {
    const res = R.analyze(tc.text, L, scorer, T);
    const problems = [];
    if (tc.error) { if (res.error !== tc.error) problems.push(`expected error ${tc.error}, got ${res.error}`); }
    else {
      if (res.error) problems.push("unexpected error " + res.error);
      const cands = Object.fromEntries(res.candidates.map((c) => [c.label, c]));
      for (const [lab, a] of Object.entries(tc.expect || {})) {
        if (!cands[lab]) problems.push(`missing ${lab}`);
        else if (cands[lab].assertion !== a) problems.push(`${lab}: expected ${a}, got ${cands[lab].assertion}`);
      }
      for (const c of res.candidates) {
        if (!(c.label in (tc.expect || {})) && c.field === "suggested" && c.assertion === "stated" && !(c.label === "vomiting" && "ds_vomits_everything" in (tc.expect || {})))
          problems.push(`extra stated ${c.label}`);
      }
      (tc.forbid || []).forEach((lab) => { if (cands[lab] && cands[lab].field === "suggested") problems.push(`forbidden ${lab}`); });
      if (tc.noSuggested && res.candidates.some((c) => c.field === "suggested")) problems.push("suggested term for unsupported language");
      if (tc.age) {
        const a = res.age;
        const got = a.status === "suggested" ? `${a.value} ${a.unit}` : a.status;
        if (got !== tc.age) problems.push(`age expected ${tc.age}, got ${got}`);
      }
      for (const [lab, d] of Object.entries(tc.duration || {})) {
        const c = cands[lab];
        if (!c || !c.duration || c.duration.days !== d) problems.push(`${lab} duration expected ${d}, got ${c && c.duration ? c.duration.days : "none"}`);
      }
    }
    return { text: tc.text.length > 60 ? tc.text.slice(0, 57) + "..." : tc.text, pass: problems.length === 0, problems };
  });
}

// ---------------- run ----------------
const sets = { dev: csv("passages_dev.csv"), test_typo: csv("passages_test_typo.csv"), test_heldout: csv("passages_test_heldout.csv") };
const notes = readFileSync(u("../data/notes_test.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const results = { model: {}, dictionary: {}, notes: {}, contrast: {}, meta: {} };
for (const [k, rows] of Object.entries(sets)) {
  results.model[k] = passageEval(rows, modelScorer, T.suggest);
  results.dictionary[k] = passageEval(rows, dictScorer, 0.5);
}
results.notes.model = noteEval(notes, modelScorer, T);
results.notes.dictionary = noteEval(notes, dictScorer, { suggest: 0.5, unclear: 0.5 });
results.contrast.model = runContrast(modelScorer);
results.contrast.dictionary = runContrast(dictScorer);

// timing
const t0 = performance.now();
for (let i = 0; i < 300; i++) R.analyze(notes[i % notes.length].text, L, modelScorer, T);
const perNote = (performance.now() - t0) / 300;
const bytes = readFileSync(u("../app/model.json")).length;
results.meta = { model_bytes: bytes, model_version: model.version, features: model.vocab.length, labels: L.length, thresholds: T,
                 app_version:readFileSync(u('../app/sw.js'),'utf8').match(/const VERSION = "([^"]+)"/)[1],
                 source_hashes:Object.fromEntries(['../app/rules.js','../app/classify.js','../app/model.json','../data/dictionary.json','../data/notes_test.jsonl','./eval.mjs'].map(p=>[p,createHash('sha256').update(readFileSync(u(p))).digest('hex')])),
                 avg_ms_per_note_node: +perNote.toFixed(3), train_rows: model.train_rows, synthetic: true, date: new Date().toISOString().slice(0, 10) };
writeFileSync(u("./results.json"), JSON.stringify(results, null, 1));

// ---------------- markdown report ----------------
const f = (x) => x.toFixed(2);
let md = `# AfyaNote evaluation report\n\nGenerated ${results.meta.date} by \`node eval/eval.mjs\`. All data is synthetic and was not reviewed by a native Swahili speaker or a clinician. Small test sets, read the numbers as a feasibility check, not as clinical performance.\n\n`;
md += `## Model file\n\n| Item | Value |\n|---|---|\n| model.json | ${bytes.toLocaleString("en")} bytes (${(bytes / 1024).toFixed(0)} KiB) |\n| Features / labels | ${model.vocab.length} / ${L.length} |\n| Training rows | ${model.train_rows} synthetic passages |\n| Thresholds | suggest ≥ ${T.suggest}, show as unclear ≥ ${T.unclear} (chosen on dev set) |\n| Inference | ${results.meta.avg_ms_per_note_node} ms per note (Node, laptop CPU) |\n\n`;
md += `## Passage level: does the right term get proposed?\n\nModel = small character n gram classifier. Dictionary = hand written phrase list built from the same training phrasings (rule baseline).\n\n| Test set | What it checks | Model P / R / F1 | Dictionary P / R / F1 |\n|---|---|---|---|\n`;
const desc = { dev: "seen phrasings, new combinations", test_typo: "seen phrasings with one spelling error", test_heldout: "phrasings never seen in training" };
for (const k of Object.keys(sets)) {
  const m = results.model[k].overall, d = results.dictionary[k].overall;
  md += `| ${k} | ${desc[k]} | ${f(m.precision)} / ${f(m.recall)} / ${f(m.f1)} | ${f(d.precision)} / ${f(d.recall)} / ${f(d.f1)} |\n`;
}
md += `\nFalse alarms on unrelated text (rows with no health term, held out sentences): model ${results.model.test_heldout.unrelated_text_false_alarm_rate}, dictionary ${results.dictionary.test_heldout.unrelated_text_false_alarm_rate} (n=${results.model.test_heldout.unrelated_rows}).\n\n`;
md += `### By language on held out phrasings\n\n| Language | Model F1 | Dictionary F1 |\n|---|---|---|\n`;
for (const k of Object.keys(results.model.test_heldout.byLang)) md += `| ${k} | ${f(results.model.test_heldout.byLang[k].f1)} | ${f(results.dictionary.test_heldout.byLang[k].f1)} |\n`;
md += `\n## Note level: full pipeline incl. rules\n\n| Metric | Model + rules | Dictionary + rules |\n|---|---|---|\n`;
const nm = results.notes.model, nd = results.notes.dictionary;
md += `| Term found (recall) | ${nm.term_recall} | ${nd.term_recall} |\n| Correct status of found terms (stated / denied / other person / past) | ${nm.assertion_accuracy_of_found} | ${nd.assertion_accuracy_of_found} |\n| Context errors shown as plainly stated | ${nm.context_errors_shown_as_stated} | ${nd.context_errors_shown_as_stated} |\n| Extra suggested terms not in the note | ${nm.extra_suggested_terms} | ${nd.extra_suggested_terms} |\n| Term recall, seen phrasings | ${nm.byPool.train.term_recall} | ${nd.byPool.train.term_recall} |\n| Term recall, held out phrasings | ${nm.byPool.heldout.term_recall} | ${nd.byPool.heldout.term_recall} |\n\nNotes: ${nm.notes}, gold terms: ${nm.gold_terms}.\n\n`;
const cm = results.contrast.model, cd = results.contrast.dictionary;
md += `## Contrast tests (hand written, expected behaviour fixed in advance)\n\nModel + rules: ${cm.filter((x) => x.pass).length} / ${cm.length} pass. Dictionary + rules: ${cd.filter((x) => x.pass).length} / ${cd.length} pass.\n\n| Input | Model | Dictionary |\n|---|---|---|\n`;
cm.forEach((x, i) => { md += `| ${x.text.replace(/\|/g, "/") || "(empty)"} | ${x.pass ? "pass" : "FAIL: " + x.problems.join("; ")} | ${cd[i].pass ? "pass" : "FAIL: " + cd[i].problems.join("; ")} |\n`; });
md += `\n## Known limits\n\n* The subject of a passage carries over within a sentence and after \"pia\" or \"also\". A new subjectless sentence after another or unresolved person requires a human choice. Other subjectless notes still use a documented note-patient convention. Supported companion/reporter patterns are bounded, not a general grammar parser.\n* Person, negation and past time are separate internal dimensions. The existing single-status export cannot represent all combinations. Unresolved combinations use the existing conflict/choice step; the original evidence remains available.\n* Negation is pattern based. Unlisted negative forms are missed. Negation of a report does not establish absence of the finding.\n* Kikuyu and other languages are not supported. Unsupported text can still produce a candidate, which the health promoter must reject.\n* The 400 generator notes assume a reset to the patient at sentence boundaries. The conservative T31 policy deliberately leaves some such cases unresolved, lowering status agreement with unchanged gold. Full before/after changes are in eval/context_t31/results.md and results.json. No goldlabels were changed to improve the score.\n* The 52 T31 context cases were frozen before repair, but their authorship and implementation are from the same AI assistant. They and the known 40-note rerun are regression checks, not independent validation.\n* No clinical validation or native-language review. Synthetic data only.\n`;
// small summary the app shows under "About this app"
writeFileSync(u("../app/build_info.json"), JSON.stringify({
  model_bytes: bytes, model_version: model.version, date: results.meta.date,
  heldout_f1_model: results.model.test_heldout.overall.f1, heldout_f1_dictionary: results.dictionary.test_heldout.overall.f1,
  typo_f1_model: results.model.test_typo.overall.f1, typo_f1_dictionary: results.dictionary.test_typo.overall.f1,
  contrast_pass: `${cm.filter((x) => x.pass).length} / ${cm.length}`, synthetic: true
}, null, 1));

// T31: attach measured follow-up evidence only when its recorded sources still match.
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const ruleHash = sha(readFileSync(u('../app/rules.js'))), modelHash = sha(readFileSync(u('../app/model.json')));
if (existsSync(u('./context_t31/results.json'))) {
  const context = JSON.parse(readFileSync(u('./context_t31/results.json')));
  if (context.rules_after_sha256 === ruleHash && context.model_sha256 === modelHash &&
      context.cases_sha256 === sha(readFileSync(u('./context_t31/cases.json'))) &&
      context.notes_sha256 === sha(readFileSync(u('./independent_notes.jsonl'))) &&
      context.dictionary_sha256 === sha(readFileSync(u('../data/dictionary.json'))) &&
      context.generated_notes_sha256 === sha(readFileSync(u('../data/notes_test.jsonl')))) {
    const before = context.policy.before.filter(c => c.pass).length;
    const after = context.policy.after.filter(c => c.pass).length;
    md += `\n## T31 known-context regression\n\nFrozen before repair: ${context.policy.after.length} synthetic cases. Rule-context checks: ${before} → ${after} pass. Native-language/clinical review: no. Real model and dictionary context-status probes: ${Object.values(context.shipped_cases).map(r => r.after.filter(c => c.pass).length + '/' + r.after.length).join(', ')}; extra labels are outside that case count.\n\n`;
    for (const [name,r] of Object.entries(context.known_40_notes)) md += `Known 40-note ${name} regression: ${r.before.totals.correct_status}/${r.before.totals.found} → ${r.after.totals.correct_status}/${r.after.totals.found} matching statuses. Term recall and suggested-only F1 unchanged.\n\n`;
    md += 'Generated-note status agreement decreases because subjectless sentences after another person now require choice. All changed notes, before/after candidates, source hashes and limitations: [T31 report](context_t31/results.md). These are known-case repairs, not independent performance gains.\n';
  } else md += '\nT31 report is historical: source hashes differ. Current follow-up evidence is versioned under eval/context_t37/runs; do not overwrite historical T31 results.\n';
}
// T33: historical evidence is retained; only complete matching snapshots count as current.
const allAppFiles=(dir,prefix='')=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?allAppFiles(new URL(e.name+'/',dir),prefix+e.name+'/'):[prefix+e.name]).sort();
const appHashes=Object.fromEntries(allAppFiles(u('../app/')).map(p=>[p,sha(readFileSync(u('../app/'+p)))]));
const browserPaths=existsSync(u('./browser_runs/'))?readdirSync(u('./browser_runs/')).map(p=>'./browser_runs/'+p+'/browser_report.json'):[];
for(const p of browserPaths.reverse())if(existsSync(u(p))){const browser=JSON.parse(readFileSync(u(p)));if(browser.status==='passed'&&browser.checks?.length&&browser.checks.every(c=>c.status==='passed')&&JSON.stringify(browser.source_after)===JSON.stringify(appHashes)&&JSON.stringify(browser.source_before)===JSON.stringify(appHashes)){
 md+=`\nCurrent browser regression: ${browser.checks.length}/${browser.checks.length} checks passed on ${browser.created_at}, Chrome ${browser.browser}. All app file hashes match. Desktop simulation, no physical phone/native review. [Source](${p.slice(2)}).\n`;break;}}
const assetPaths=existsSync(u('./asset_runs/'))?readdirSync(u('./asset_runs/')).map(p=>'./asset_runs/'+p+'/assets.json'):[];
for(const p of assetPaths.reverse())if(existsSync(u(p))){const assets=JSON.parse(readFileSync(u(p)));if(assets.source_hashes && JSON.stringify(Object.fromEntries(Object.entries(assets.source_hashes).sort()))===JSON.stringify(appHashes)){
 md+=`\nMatching static-file manifest: ${assets.unique_asset_bytes} unique asset bytes including service worker; ${assets.sum_individual_gzip_bytes} bytes as a sum of individually compressed files. Not measured HTTP transfer or RAM. [Source](${p.slice(2)}).\n`;break;}}
writeFileSync(u('./results.md'), md);
console.log(md);
// CI gate: every hand written contrast test must pass for the shipped model.
const failed = cm.filter((x) => !x.pass);
if (failed.length) { console.error("Contrast tests failed:", failed.map((x) => x.text).join(" | ")); process.exitCode = 1; }
