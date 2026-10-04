# Local LLM extractor: results after the guard

Same metrics as `eval/independent.mjs`. Every answer passes `llm/guard.mjs` first: unknown terms, unknown statuses and quotes that are not in the note are dropped. "Hybrid" is the proposed product rule: classifier cards as today, guarded LLM terms only as extra "unclear" cards.

| Answers | Set | Term recall | Status accuracy | Context errors as stated | Extra terms | Exact notes | Not JSON | Dropped by guard | Hybrid recall | Hybrid extra unclear cards | Median ms per note | Model on disk | Memory loaded |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| adversarial (reference) | independent (40) | 0 | 0 | 0 | 0 | 4/40 | 8 | not_json 8, evidence_not_in_note 32, unknown_term 32, bad_status 32 | 0.921 | 2 | n/a | n/a | n/a |
| afyanote-classifier (reference) | independent (40) | 0.921 | 1 | 0 | 1 | 35/40 | 0 | 0 | 0.921 | 2 | n/a | n/a | n/a |

Reference rows: `afyanote-classifier (reference)` must reproduce `eval/independent_results.md` (recall 0.921). `adversarial (reference)` must end with recall 0 because the guard drops every invented quote, unknown term and unknown status.

Timings and memory come from the computer that ran Ollama, not from a phone.
