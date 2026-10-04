# Independent test (second author)

Notes: 40 (15 Swahili, 15 English, 10 mixed). Written without access to the training lexicon or generated data. Model and rules were not tuned on this set.

Author: Codex AI assistant, separate from the original Claude generator. Gold labels and Swahili wording have not been reviewed by a native speaker or clinician. This is a second-author synthetic challenge set, not independent clinical validation.

| Metric | Model + rules | Keyword list + rules |
|---|---|---|
| Term recall (including unclear candidates) | 0.921 (58/63) | 0.73 (46/63) |
| Status accuracy of found terms | 0.983 (57/58) | 0.978 (45/46) |
| Context errors shown as stated | 0 | 0 |
| Extra suggested terms | 1 | 0 |
| Suggested-only micro F1 | 0.933 | 0.844 |
| Exact notes: all candidate labels and statuses | 34/40 | 23/40 |

Recall above counts both suggested and unclear terms; it is not the previous passage benchmark F1. Context errors shown as stated is a narrow count, not all context errors. Inspect all errors and raw results.

## Model errors

| Note | Error |
|---|---|
| Mtoto alipata degedege mbele ya mama leo. | ds_convulsions: expected stated, got other_person |
| The child denies stomach pain. She threw up after breakfast. | missed vomiting |
| No vomiting is reported for the child. Her stools are watery and frequent. | missed diarrhoea |
| Age: 7, unit omitted. The child has loose stools. | missed diarrhoea |
| Age: 7, unit omitted. The child has loose stools. | extra vomiting (stated) |
| The child had a fit during this visit and is now very weak. | missed ds_convulsions |
| Mtoto hana homa. Watery stools are recorded for this child. | missed diarrhoea |

## Reproduction

Run `node eval/independent.mjs`. Raw candidates, age suggestions and annotations: `eval/independent_results.json`.

Test SHA-256: `16cdf0516ef9a9c710a17a3629734c6961cbec9c87cc0524f2b6ec3dd74bcde3`

Model SHA-256: `fdc100ac4dbad796bf9a4994835838c0dbd1adbae14ccf576cf0b2d0f7e28659`

The set includes 10 notes with a denied term, six with another person, six with a past term, four notes with unrelated text, and four with two ages or a missing age unit. It also includes a decimal-age case. Age is exposed in the raw report but not included in the label metrics.
