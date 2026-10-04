# Known 40-note second-author regression

afyanote-v0.4.17; 2026-10-04T07:41:50.279Z. Rerun on already-known synthetic notes after disclosed repairs; not independent field validation.

Unreviewed synthetic SW/EN/mixed data. Model parameters/thresholds unchanged by this runner. Known age/person repairs disclosed; rules are hashed. 40 notes.

| Metric | Model + rules | Dictionary + rules |
|---|---|---|
| Recall including unclear | 58/63 (0.921) | 46/63 (0.730) |
| Status correct / found | 58/58 (1.000) | 46/46 (1.000) |
| All status mismatches | 0 | 0 |
| Wrong status shown as stated (subset) | 0 | 0 |
| Extra suggested / all extra candidates | 1 / 1 | 0 / 0 |
| Suggested-only label micro F1 | 0.933 | 0.844 |
| Exact label/status notes | 35/40 | 24/40 |
| Age agreement (annotated only) | not scored | not scored |

Missing terms and all incorrect statuses are separate. Zero wrong-stated errors does not mean zero context errors. Exact notes exclude duration/source correctness. No age gold in the original sets; raw age states are descriptive.

## Errors
- model, codex-independent-17: {"kind":"missing_term","label":"vomiting","expected":"stated"}
- model, codex-independent-20: {"kind":"missing_term","label":"diarrhoea","expected":"stated"}
- model, codex-independent-28: {"kind":"missing_term","label":"diarrhoea","expected":"stated"}
- model, codex-independent-28: {"kind":"extra_term","label":"vomiting","field":"suggested","actual":"stated"}
- model, codex-independent-29: {"kind":"missing_term","label":"ds_convulsions","expected":"stated"}
- model, codex-independent-36: {"kind":"missing_term","label":"diarrhoea","expected":"stated"}
- keyword_list, codex-independent-01: {"kind":"missing_term","label":"fever","expected":"stated"}
- keyword_list, codex-independent-05: {"kind":"missing_term","label":"diarrhoea","expected":"denied"}
- keyword_list, codex-independent-07: {"kind":"missing_term","label":"diarrhoea","expected":"stated"}
- keyword_list, codex-independent-12: {"kind":"missing_term","label":"vomiting","expected":"denied"}
- keyword_list, codex-independent-12: {"kind":"missing_term","label":"weakness","expected":"stated"}
- keyword_list, codex-independent-13: {"kind":"missing_term","label":"diarrhoea","expected":"past"}
- keyword_list, codex-independent-16: {"kind":"missing_term","label":"fever","expected":"stated"}
- keyword_list, codex-independent-17: {"kind":"missing_term","label":"vomiting","expected":"stated"}
- keyword_list, codex-independent-20: {"kind":"missing_term","label":"diarrhoea","expected":"stated"}
- keyword_list, codex-independent-23: {"kind":"missing_term","label":"pain","expected":"stated"}
- keyword_list, codex-independent-24: {"kind":"missing_term","label":"ds_vomits_everything","expected":"stated"}
- keyword_list, codex-independent-26: {"kind":"missing_term","label":"ds_cannot_drink","expected":"stated"}
- keyword_list, codex-independent-27: {"kind":"missing_term","label":"weakness","expected":"stated"}
- keyword_list, codex-independent-28: {"kind":"missing_term","label":"diarrhoea","expected":"stated"}
- keyword_list, codex-independent-29: {"kind":"missing_term","label":"ds_convulsions","expected":"stated"}
- keyword_list, codex-independent-36: {"kind":"missing_term","label":"diarrhoea","expected":"stated"}
- keyword_list, codex-independent-37: {"kind":"missing_term","label":"weakness","expected":"stated"}

## Reproduction

Run from the project directory with a new destination:

`node eval/independent.mjs --benchmark independent --out eval/runs/NEXT_UNIQUE_RUN`

Manifest and results are in this directory; sources/hash definitions are in manifest.json. No original report, gold file, model or app asset is rewritten.
