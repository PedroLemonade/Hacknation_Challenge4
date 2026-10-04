// Claude original; only rules import path adjusted by ChatGPT/Codex for this reproducible baseline.
// Guard for any extractor output (small LLM or otherwise) before it may reach the review screen.
// The extractor can only propose. Anything that is not a listed term, a listed status and an exact
// quote from the note is dropped. Durations survive only if the rules read the same number from the quote.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const R = require("../../app/rules.js");

export const STATUSES = ["stated", "denied", "other_person", "past"];
const norm = (s) => String(s).toLowerCase().replace(/[“”"'`]/g, "").replace(/\s+/g, " ").replace(/^[\s.,;:!?]+|[\s.,;:!?]+$/g, "").trim();

export function parseRaw(raw) {
  if (raw && typeof raw === "object") return { obj: raw };
  try { return { obj: JSON.parse(String(raw).replace(/^```(?:json)?\s*|\s*```$/g, "")) }; }
  catch (e) { return { obj: null, error: "not_json" }; }
}

export function guard(raw, note, labels) {
  const { obj, error } = parseRaw(raw);
  const accepted = [], rejected = [], warnings = [];
  if (!obj || !Array.isArray(obj.items)) return { accepted, rejected: [{ item: raw, reason: error || "no_items_array" }], warnings };
  const n = norm(note), seen = new Set();
  for (const it of obj.items.slice(0, 20)) {
    if (!it || typeof it !== "object") { rejected.push({ item: it, reason: "not_object" }); continue; }
    if (!labels.includes(it.term)) { rejected.push({ item: it, reason: "unknown_term" }); continue; }
    if (!STATUSES.includes(it.status)) { rejected.push({ item: it, reason: "bad_status" }); continue; }
    const ev = norm(it.evidence || "");
    if (ev.length < 2 || !n.includes(ev)) { rejected.push({ item: it, reason: "evidence_not_in_note" }); continue; }
    if (seen.has(it.term)) { rejected.push({ item: it, reason: "duplicate_term" }); continue; }
    seen.add(it.term);
    let days = null;
    if (it.duration_days != null) {
      const d = R.duration(String(it.evidence));
      if (it.status === "stated" && d && d.days === it.duration_days) days = it.duration_days;
      else warnings.push({ term: it.term, reason: "duration_dropped" });
    }
    accepted.push({ term: it.term, status: it.status, evidence: String(it.evidence).trim(), duration_days: days });
  }
  return { accepted, rejected, warnings };
}

// Product rule for a second opinion: agreement keeps the classifier card as it is,
// disagreement or an LLM only term becomes an "unclear" card with both quotes. The CHP decides.
export function combine(classifierCands, llmItems) {
  const out = new Map();
  for (const c of classifierCands) out.set(c.label, { label: c.label, status: c.assertion, field: c.field, source: "classifier" });
  for (const it of llmItems) {
    const c = out.get(it.term);
    if (!c) out.set(it.term, { label: it.term, status: it.status, field: "unclear", source: "llm" });
    else if (c.status === it.status) c.source = "both";
    else out.set(it.term, { label: it.term, status: "conflict", field: "unclear", source: "disagree" });
  }
  return [...out.values()];
}
