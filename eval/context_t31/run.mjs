// ChatGPT / Codex: known-case regression. Never writes the frozen 40-note reports.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const C = require('../../app/classify.js'), R = require('../../app/rules.js');
const B = require('./baseline/rules.js');
const u = p => new URL(p, import.meta.url), raw = p => readFileSync(u(p));
const json = p => JSON.parse(raw(p)), hash = b => createHash('sha256').update(b).digest('hex');
const cases = json('./cases.json').cases, freeze = json('./case_freeze.json');
if (hash(raw('./cases.json')) !== freeze.cases_sha256 || cases.length !== freeze.case_count)
  throw Error('Pre-fix cases changed; preserve the original cases and add future cases separately.');
if (hash(raw('./baseline/rules.js')) !== freeze.rules_before_sha256)
  throw Error('Preserved baseline rules changed; do not redefine the before-version.');
const model = json('../../app/model.json'), P = C.prepare(model), L = model.labels, T = model.thresholds;
const notes = raw('../independent_notes.jsonl').toString().trim().split('\n').map(JSON.parse);
const dictionary = json('../../data/dictionary.json');
const scorers = { model: [t => C.scores(P, t), T], dictionary: [R.dictionaryScorer(dictionary, L), {suggest: .5, unclear: .5}] };

// Isolate context handling from term recognition. This fixture is not a model benchmark.
const contextScorer = text => L.map(label => ({fever: /\b(?:fever|homa)\b/i,
  cough: /\b(?:cough|kikohozi|anakohoa)\b/i, ds_convulsions: /\b(?:convulsions|degedege)\b/i}[label]?.test(text) ? 1 : 0));

function caseResult(rules, tc, scorer, threshold) {
  const result = rules.analyze(tc.text, L, scorer, threshold);
  const problems = [];
  for (const [label, expected] of Object.entries(tc.expected)) {
    const c = result.candidates.find(c => c.label === label);
    if (!c) problems.push(`${label}: missing`);
    else {
      if (c.assertion !== expected) problems.push(`${label}: expected ${expected}, got ${c.assertion}`);
      if (expected === 'conflict' && c.field !== 'unclear') problems.push(`${label}: unresolved context must be unclear`);
    }
  }
  for (const c of result.candidates) {
    if (tc.text.slice(c.start, c.end) !== c.evidence) problems.push(`${c.label}: original span changed`);
    for (const other of c.others || [])
      if (tc.text.slice(other.start, other.end) !== other.evidence) problems.push(`${c.label}: additional span changed`);
  }
  return {id: tc.id, language: tc.language, category: tc.category, text: tc.text,
    pass: !problems.length, problems, candidates: result.candidates};
}

function knownNotes(rules, scorer, threshold, noteSet = notes) {
  const details = [], totals = {gold: 0, found: 0, correct_status: 0, extra_suggested: 0, wrong_stated: 0, suggested_tp: 0, suggested_fp: 0};
  for (const n of noteSet) {
    const result = rules.analyze(n.text, L, scorer, threshold), errors = [];
    const goldLabels = new Set(n.gold.map(g => g.label));
    for (const g of n.gold) {
      totals.gold++;
      const c = result.candidates.find(c => c.label === g.label);
      if (!c) errors.push(`missed ${g.label}`);
      else {
        totals.found++;
        const expected = g.assertion === 'affirmed' ? 'stated' : g.assertion;
        if (c.assertion === expected) totals.correct_status++;
        else { errors.push(`${g.label}: expected ${expected}, got ${c.assertion}`); if (c.assertion === 'stated') totals.wrong_stated++; }
      }
    }
    for (const c of result.candidates.filter(c => c.field === 'suggested')) {
      if (goldLabels.has(c.label)) totals.suggested_tp++;
      else { totals.suggested_fp++; totals.extra_suggested++; errors.push(`extra ${c.label} (${c.assertion})`); }
    }
    details.push({id: n.id, text: n.text, gold: n.gold, candidates: result.candidates, errors});
  }
  const precision = totals.suggested_tp / Math.max(totals.suggested_tp + totals.suggested_fp, 1);
  const recall = totals.suggested_tp / Math.max(totals.gold, 1);
  return {totals, term_recall_including_unclear: totals.found / Math.max(totals.gold, 1),
    status_accuracy_of_found: totals.correct_status / Math.max(totals.found, 1),
    suggested_only_f1: precision + recall ? 2 * precision * recall / (precision + recall) : 0, details};
}

const policy = {before: cases.map(tc => caseResult(B, tc, contextScorer, {suggest: .5, unclear: .5})),
  after: cases.map(tc => caseResult(R, tc, contextScorer, {suggest: .5, unclear: .5}))};
const shippedCases = Object.fromEntries(Object.entries(scorers).map(([name, [scorer, threshold]]) =>
  [name, {before: cases.map(tc => caseResult(B, tc, scorer, threshold)), after: cases.map(tc => caseResult(R, tc, scorer, threshold))}]));
function compareNotes(noteSet) { return Object.fromEntries(Object.entries(scorers).map(([name, [scorer, threshold]]) => {
  const before = knownNotes(B, scorer, threshold, noteSet), after = knownNotes(R, scorer, threshold, noteSet);
  const changes = after.details.flatMap((n, i) => {
    const old = before.details[i];
    if (JSON.stringify(n.candidates) === JSON.stringify(old.candidates)) return [];
    const assertions = cs => cs.map(c => ({label:c.label, assertion:c.assertion, field:c.field}));
    if (JSON.stringify(assertions(n.candidates)) === JSON.stringify(assertions(old.candidates))) return [];
    return [{id:n.id,text:n.text,before:assertions(old.candidates),after:assertions(n.candidates),errors_before:old.errors,errors_after:n.errors,
      contexts_after:n.candidates.map(c=>({label:c.label,context:c.context}))}];
  });
  return [name, {before, after, changes}];
})); }
const known = compareNotes(notes);
const generatedNotes = raw('../../data/notes_test.jsonl').toString().trim().split('\n').map(JSON.parse);
const generated = compareNotes(generatedNotes);
const protectedManifest = json('./baseline/source_manifest.json');
const protectedChanged = Object.entries(protectedManifest.protected_files).filter(([p,h]) => hash(raw('../../'+p)) !== h).map(([p]) => p);
const report = {created_at:new Date().toISOString(),author:'ChatGPT / Codex',purpose:'Known-pattern regression after a disclosed rule repair; not an independent benchmark.',
  cases_sha256:hash(raw('./cases.json')), rules_before_sha256:hash(raw('./baseline/rules.js')), rules_after_sha256:hash(raw('../../app/rules.js')),
  model_sha256:hash(raw('../../app/model.json')), notes_sha256:hash(raw('../independent_notes.jsonl')),
  dictionary_sha256:hash(raw('../../data/dictionary.json')), generated_notes_sha256:hash(raw('../../data/notes_test.jsonl')),
  native_swahili_review:false,clinical_review:false,protected_files_changed:protectedChanged,policy,shipped_cases:shippedCases,known_40_notes:known,
  generated_400_notes:generated};
const beforePass = policy.before.filter(c=>c.pass).length, afterPass = policy.after.filter(c=>c.pass).length;
const probe = Object.fromEntries(Object.entries(shippedCases).map(([name, r]) => [name,{before_pass:r.before.filter(c=>c.pass).length,after_pass:r.after.filter(c=>c.pass).length,total:cases.length}]));
writeFileSync(u('./results.json'),JSON.stringify(report,null,2)+'\n');
let md = `# T31 Kontextregression · ChatGPT / Codex\n\n${cases.length} synthetische Fälle, vor dem Fix eingefroren; ${cases.filter(c=>c.language==='en').length} Englisch, ${cases.filter(c=>c.language==='sw').length} Swahili. Sprach-/Fachreview: nein. Bekannte Muster nach Reparatur, keine unabhängige Validierung.\n\n## Regelprüfung und echte Pipeline getrennt\n\nRegelprüfung mit festem Test-Termdetektor: **${beforePass}/${cases.length} → ${afterPass}/${cases.length}**. Der Testdetektor misst keine Modellgüte.\n\n`;
for (const [name,v] of Object.entries(probe)) md += `- Ausgelieferte ${name}-Pipeline: ${v.before_pass}/${v.total} → ${v.after_pass}/${v.total} erwartete Kontextstatus erfüllt; zusätzliche Kandidaten sind nicht Teil dieser Quote. Fehlstellen und Rohkandidaten in results.json.\n`;
md += '\n## Bekannte 40 Notizen als Regression\n\n| Pipeline | Begriffe gefunden vorher → nachher | Korrekte Status vorher → nachher | Zusätzlich vorgeschlagene Begriffe vorher → nachher |\n|---|---|---|---|\n';
for (const [name,r] of Object.entries(known)) {
  const b=r.before.totals,a=r.after.totals;
  md += `| ${name} | ${b.found}/${b.gold} → ${a.found}/${a.gold} | ${b.correct_status}/${b.found} → ${a.correct_status}/${a.found} | ${b.extra_suggested} → ${a.extra_suggested} |\n`;
}
md += '\n### Jede Status-/Prüfänderung\n\n';
for (const [name,r] of Object.entries(known)) {
  md += `\n**${name}**\n\n`;
  for (const c of r.changes) md += `- ${c.id}: ${JSON.stringify(c.before)} → ${JSON.stringify(c.after)}. Fehler vorher: ${c.errors_before.join('; ')||'keine'}; nachher: ${c.errors_after.join('; ')||'keine'}.\n`;
  if (!r.changes.length) md += 'Keine Änderungen.\n';
}
md += `\n## Verbleibende Fallfehler\n\n`;
for (const [name,r] of Object.entries(shippedCases)) for (const c of r.after.filter(c=>!c.pass)) md += `- ${name}, ${c.id}: ${c.text} — ${c.problems.join('; ')}\n`;
md += '\n## Bestehende 400 Generatornotizen: Verschlechterungen offenlegen\n\nDer alte Generator setzt das Subjekt nach Satzgrenzen implizit wieder auf den Patienten. Nach einer anderen Person ist das jetzt ausdrücklich ungeklärt und verlangt eine menschliche Auswahl. Die unveränderten alten Goldlabels bewerten diese konservative Änderung als Fehler; die Statusquote sinkt. Dies ist keine Verbesserung aller Kennzahlen und keine extern bestätigte Korrektur der Goldlabels.\n\n| Pipeline | Gefundene Begriffe | Korrekte Status vorher → nachher | Statusquote vorher → nachher | Geänderte Notizen |\n|---|---|---|---|---|\n';
for (const [name,r] of Object.entries(generated)) md += `| ${name} | ${r.after.totals.found}/${r.after.totals.gold} | ${r.before.totals.correct_status} → ${r.after.totals.correct_status} | ${r.before.status_accuracy_of_found.toFixed(3)} → ${r.after.status_accuracy_of_found.toFixed(3)} | ${r.changes.length} |\n`;
md += '\n### Jede geänderte Generatornotiz\n\n';
for (const [name,r] of Object.entries(generated)) {
  md += `\n**${name}**\n\n`;
  for (const c of r.changes) md += `- ${c.id}: ${c.text}\n  Vorher: ${JSON.stringify(c.before)}. Nachher: ${JSON.stringify(c.after)}. Fehler vorher: ${c.errors_before.join('; ')||'keine'}; nachher: ${c.errors_after.join('; ')||'keine'}.\n`;
}
md += `\nGeschützte Modell-/Trainings-/Daten-/Raw-Ergebnis-/v0.4.10-Mediendateien geändert: ${protectedChanged.length}.\n\nRegeln vorher: \`${report.rules_before_sha256}\`\n\nRegeln nachher: \`${report.rules_after_sha256}\`\n\nFälle: \`${report.cases_sha256}\`\n\nModell: \`${report.model_sha256}\`\n\nReproduktion: \`node eval/context_t31/run.mjs\`. Dies schreibt ausschließlich neue T31-Berichte; die ursprünglichen 40er-Notizen, Goldlabels und eingefrorenen Ergebnisse werden nicht überschrieben.\n`;
writeFileSync(u('./results.md'),md);
console.log(JSON.stringify({rule_cases:{before:beforePass,after:afterPass,total:cases.length},shipped:probe,protected_files_changed:protectedChanged,known_40:Object.fromEntries(Object.entries(known).map(([name,r])=>[name,{before:r.before.totals,after:r.after.totals,changes:r.changes}]))},null,2));
if (afterPass!==cases.length || protectedChanged.length) process.exitCode=1;
