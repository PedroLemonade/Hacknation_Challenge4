// Claude guard foundation; strict contract and evidence-preserving merge by ChatGPT / Codex.
// Structural validation only: an exact quote does not establish correct term or patient meaning.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const require = createRequire(import.meta.url);
const R = require("../app/rules.js");
const schema = JSON.parse(readFileSync(new URL("./schema.json", import.meta.url)));
const itemSchema = schema.properties.items.items;
export const STATUSES = itemSchema.properties.status.enum;
const isObject = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
const matchesKeys = (obj, allowed) => Object.keys(obj).every(k => allowed.includes(k)) && allowed.every(k => Object.hasOwn(obj, k));

export function parseRaw(raw) {
  if (isObject(raw)) return { obj: raw };
  if (typeof raw !== "string") return { obj: null, error: "not_json" };
  // Fences are a transport wrapper, never normalize the content of an evidence string.
  const text = raw.trim(), fenced = text.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/i);
  try { return { obj: JSON.parse(fenced ? fenced[1] : text) }; }
  catch { return { obj: null, error: "not_json" }; }
}

export function guard(raw, note, labels) {
  const { obj, error } = parseRaw(raw);
  const accepted = [], rejected = [], warnings = [];
  const rootReject = (reason) => ({ accepted, rejected: [{ item: raw, reason }], warnings });
  if (typeof note !== "string" || !Array.isArray(labels)) return rootReject("invalid_input");
  if (!isObject(obj) || !Array.isArray(obj.items)) return rootReject(error || "no_items_array");
  if (!matchesKeys(obj, schema.required)) return rootReject("invalid_root_shape");
  if (obj.items.length > schema.properties.items.maxItems) return rootReject("too_many_items");
  const counts = new Map();
  for (const it of obj.items) if (isObject(it) && typeof it.term === "string") counts.set(it.term, (counts.get(it.term) || 0) + 1);
  for (const it of obj.items) {
    const reject = (reason) => rejected.push({ item: it, reason });
    if (!isObject(it)) { reject("not_object"); continue; }
    if (!matchesKeys(it, itemSchema.required)) { reject("invalid_item_shape"); continue; }
    if (!itemSchema.properties.term.enum.includes(it.term) || !labels.includes(it.term)) { reject("unknown_term"); continue; }
    if (!STATUSES.includes(it.status)) { reject("bad_status"); continue; }
    const ev = it.evidence, evSchema = itemSchema.properties.evidence;
    if (typeof ev !== "string" || Array.from(ev).length < evSchema.minLength || Array.from(ev).length > evSchema.maxLength) { reject("bad_evidence_shape"); continue; }
    const d = it.duration_days, dSchema = itemSchema.properties.duration_days;
    if (d !== null && (!Number.isInteger(d) || d < dSchema.minimum || d > dSchema.maximum)) { reject("bad_duration_shape"); continue; }
    const start = note.indexOf(ev);
    if (start < 0) { reject("evidence_not_in_note"); continue; }
    // Never choose between two conflicting copies by response order.
    if (counts.get(it.term) > 1) { reject("duplicate_term"); continue; }
    const ambiguous = note.indexOf(ev, start + 1) !== -1;
    if (ambiguous) warnings.push({ term: it.term, reason: "evidence_ambiguous" });
    let days = null;
    if (d !== null) {
      const parsed = R.duration(ev);
      if (it.status === "stated" && parsed && parsed.days === d) days = d;
      else warnings.push({ term: it.term, reason: "duration_dropped" });
    }
    accepted.push({ term: it.term, status: it.status, evidence: ev, duration_days: days,
      evidence_start: ambiguous ? null : start, evidence_end: ambiguous ? null : start + ev.length });
  }
  return { accepted, rejected, warnings };
}

// Optional offline experiment only, not wired into app/. Every item still requires human review.
// An LLM-only proposal or disagreement has no preselected status. Preserve both original quotes.
export function combine(classifierCands, llmItems) {
  const out = new Map();
  for (const c of classifierCands) out.set(c.label, {
    label: c.label, status: c.assertion, field: c.field, source: "classifier",
    evidence: { classifier: c.evidence ?? null, llm: null },
    assertions: { classifier: c.assertion, llm: null }
  });
  for (const it of llmItems) {
    const c = out.get(it.term);
    if (!c) out.set(it.term, { label: it.term, status: "conflict", field: "unclear", source: "llm",
      evidence: { classifier: null, llm: it.evidence }, assertions: { classifier: null, llm: it.status } });
    else {
      c.evidence.llm = it.evidence;
      c.assertions.llm = it.status;
      if (c.status === it.status) c.source = "both";
      else { c.status = "conflict"; c.field = "unclear"; c.source = "disagree"; }
    }
  }
  return [...out.values()];
}
