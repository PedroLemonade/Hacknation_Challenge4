// Runs the shipped pipeline on eval/independent_notes.jsonl (notes written by a second author, see task T09)
// and writes eval/independent_results.md. Does not tune anything.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const C = require("../app/classify.js");
const R = require("../app/rules.js");
const u = (p) => new URL(p, import.meta.url);
const file = u("./independent_notes.jsonl");
if (!existsSync(file)) { console.error("eval/independent_notes.jsonl not found. Write it first (task T09)."); process.exit(1); }
const model = JSON.parse(readFileSync(u("../app/model.json")));
const dictionary = JSON.parse(readFileSync(u("../data/dictionary.json")));
const P = C.prepare(model), L = model.labels, T = model.thresholds;
const scorers = { model: [(t) => C.scores(P, t), T], keyword_list: [R.dictionaryScorer(dictionary, L), { suggest: 0.5, unclear: 0.5 }] };
const MAP = { stated: "stated", affirmed: "stated", denied: "denied", other_person: "other_person", past: "past" };
const notes = readFileSync(file, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l));
if (notes.length !== 40 || notes.some(n => n.pool !== 'independent' || !n.text || !Array.isArray(n.gold) ||
    new Set(n.gold.map(g => g.label)).size !== n.gold.length || n.gold.some(g => !L.includes(g.label) || !MAP[g.assertion]))) {
  throw new Error('Expected 40 independently authored notes with unique, supported gold labels and assertions.');
}

const out = {};
for (const [name, [scorer, thr]] of Object.entries(scorers)) {
  let gold = 0, found = 0, ok = 0, ctx = 0, extra = 0, suggestedTP = 0, suggestedFP = 0, exactNotes = 0;
  const errs = [], details = [];
  for (const n of notes) {
    const res = R.analyze(n.text, L, scorer, thr);
    const cands = Object.fromEntries(res.candidates.map((c) => [c.label, c]));
    const gl = new Set(n.gold.map((g) => g.label));
    const suggested = res.candidates.filter(c => c.field === 'suggested');
    suggestedTP += suggested.filter(c => gl.has(c.label)).length;
    suggestedFP += suggested.filter(c => !gl.has(c.label)).length;
    for (const g of n.gold) {
      gold++;
      const c = cands[g.label], want = MAP[g.assertion] || g.assertion;
      if (!c) { errs.push([n.text, `missed ${g.label}`]); continue; }
      found++;
      if (c.assertion === want) ok++;
      else { if (c.assertion === "stated") ctx++; errs.push([n.text, `${g.label}: expected ${want}, got ${c.assertion}`]); }
    }
    for (const c of res.candidates) if (!gl.has(c.label) && c.field === "suggested") { extra++; errs.push([n.text, `extra ${c.label} (${c.assertion})`]); }
    if (res.candidates.length === n.gold.length && n.gold.every(g => cands[g.label]?.assertion === g.assertion)) exactNotes++;
    details.push({ id: n.id, language: n.language, text: n.text, gold: n.gold, candidates: res.candidates, age: res.age });
  }
  const precision = suggestedTP / Math.max(suggestedTP + suggestedFP, 1), recall = suggestedTP / Math.max(gold, 1);
  out[name] = { gold, found, correct_status: ok, recall: +(found / Math.max(gold, 1)).toFixed(3), status_acc: +(ok / Math.max(found, 1)).toFixed(3), ctx, extra,
    suggested_only: { tp: suggestedTP, fp: suggestedFP, fn: gold - suggestedTP, precision, recall, f1: precision + recall ? 2 * precision * recall / (precision + recall) : 0 },
    exact_notes: exactNotes, errs, details };
}
const hash = value => createHash('sha256').update(value).digest('hex');
const provenance = { created_at: new Date().toISOString(), notes: notes.length, languages: Object.fromEntries(['sw','en','mixed'].map(l => [l, notes.filter(n => n.language === l).length])),
  test_sha256: hash(readFileSync(file)), model_sha256: hash(readFileSync(u('../app/model.json'))), rules_sha256: hash(readFileSync(u('../app/rules.js'))),
  author: 'Codex AI assistant, separate from the original Claude generator', clinical_validation: false, native_swahili_review: false,
  caveat: 'Second-author synthetic challenge set. Gold annotations are unreviewed; no training lexicon or generated data was opened before authoring. Not independent field validation.' };
let md = `# Independent test (second author)\n\nNotes: ${notes.length} (15 Swahili, 15 English, 10 mixed). Written without access to the training lexicon or generated data. Model and rules were not tuned on this set.\n\nAuthor: Codex AI assistant, separate from the original Claude generator. Gold labels and Swahili wording have not been reviewed by a native speaker or clinician. This is a second-author synthetic challenge set, not independent clinical validation.\n\n| Metric | Model + rules | Keyword list + rules |\n|---|---|---|\n`;
md += `| Term recall (including unclear candidates) | ${out.model.recall} (${out.model.found}/${out.model.gold}) | ${out.keyword_list.recall} (${out.keyword_list.found}/${out.keyword_list.gold}) |\n| Status accuracy of found terms | ${out.model.status_acc} (${out.model.correct_status}/${out.model.found}) | ${out.keyword_list.status_acc} (${out.keyword_list.correct_status}/${out.keyword_list.found}) |\n| Context errors shown as stated | ${out.model.ctx} | ${out.keyword_list.ctx} |\n| Extra suggested terms | ${out.model.extra} | ${out.keyword_list.extra} |\n| Suggested-only micro F1 | ${out.model.suggested_only.f1.toFixed(3)} | ${out.keyword_list.suggested_only.f1.toFixed(3)} |\n| Exact notes: all candidate labels and statuses | ${out.model.exact_notes}/40 | ${out.keyword_list.exact_notes}/40 |\n\nRecall above counts both suggested and unclear terms; it is not the previous passage benchmark F1. Context errors shown as stated is a narrow count, not all context errors. Inspect all errors and raw results.\n\n## Model errors\n\n| Note | Error |\n|---|---|\n`;
out.model.errs.forEach(([t, e]) => { md += `| ${t.replace(/\|/g, "/")} | ${e} |\n`; });
md += `\n## Reproduction\n\nRun \`node eval/independent.mjs\`. Raw candidates, age suggestions and annotations: \`eval/independent_results.json\`.\n\nTest SHA-256: \`${provenance.test_sha256}\`\n\nModel SHA-256: \`${provenance.model_sha256}\`\n\nThe set includes 10 notes with a denied term, six with another person, six with a past term, four notes with unrelated text, and four with two ages or a missing age unit. It also includes a decimal-age case. Age is exposed in the raw report but not included in the label metrics.\n`;
writeFileSync(u("./independent_results.md"), md);
writeFileSync(u('./independent_results.json'), JSON.stringify({ provenance, results: out }, null, 2));
console.log(md.split("## Model errors")[0]);
