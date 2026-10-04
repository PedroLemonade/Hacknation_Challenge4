# Model card · afyanote-passage-classifier 0.1.0

| | |
|---|---|
| Task | Propose which of 10 documentation terms a short passage talks about (multi label). A denied term or a term about another person still counts as a mention; rules decide the status. |
| Terms | fever, cough, diarrhoea, vomiting, pain, weakness, and 4 WHO IMCI general danger signs (not able to drink or breastfeed, vomits everything, convulsions, lethargic or unconscious) |
| Architecture | character n grams 2 to 4 (word bounded, lowercase, binary), explicit vocabulary of 3000 grams, L2 normalisation, one logistic regression per term |
| Size | Model 249,284 bytes; v0.4.11 static app including service worker 440,004 bytes. Individual file-compression sum 125,489 bytes; no HTTP/RAM measurement |
| Runtime | plain JavaScript in the browser, no model-runtime libraries; latest measured Node/laptop timing in eval/results.md, not a physical-phone benchmark. Python and browser agree to 4.9e-7 |
| Training data | 5,000 synthetic passages (Swahili, English, mixed, 15 % with spelling errors), written by the team, not reviewed by native speakers or clinicians |
| Thresholds | suggest ≥ 0.5, show as unclear ≥ 0.25; chosen on a separate dev set, floor 0.5 |
| Explanation | each suggestion shows the words with the largest share of the score (exact decomposition of the linear score) |

## Results (synthetic, see eval/results.md)
| Test | Model F1 | Keyword list F1 |
|---|---|---|
| Seen phrasings, new combinations | 0.991 | 0.933 |
| One spelling error | 0.953 | 0.624 |
| Phrasings never seen in training | 0.851 | 0.499 |

Contrast tests: 34 / 34 (4 of them written by a second assistant for its own prototype).

Preserved second-author evaluation (`eval/independent_results.md`): 40 notes written by Codex without access to the lexicon or generated data. Terms found 0.921 vs 0.730 for the keyword list; earlier status correct for 57 of 58 found model terms, 34 of 40 notes fully correct. T31 later repaired the known child/mother-reference error: status on the known rerun is 58/58, with term recognition unchanged. This is regression evidence on unreviewed gold, not an independent gain. Missed terms and an extra suggestion remain; model/thresholds were not tuned on these notes.

T31 adds 52 prewritten synthetic context cases (all pass). On the 400 generator notes, status agreement falls from 0.999 to 0.945 because subjectless sentences after another person now require human choice, while unchanged gold assumes the patient. Every change is disclosed in `eval/context_t31/results.md`; no clinical/native-language review.

Model and original training/generator work: Claude. Bounded T31 context repair, new cases and reruns: ChatGPT/Codex. Model weights remain unchanged.

## Intended use
Hackathon demonstration of a small, checkable, offline documentation aid. Every suggestion must be confirmed by the health promoter.

## Not intended
Diagnosis, triage, urgency, treatment advice, free translation, unattended normalisation, real patient data, any language other than Swahili and English (Kikuyu is not supported and not detected).

## Known weaknesses
* Test sets come from the same generator as training; held out phrasings reduce but do not remove this bias. A second author test set exists (see above); a field set from real, consented notes does not.
* Scores are not calibrated probabilities.
* Subjectless sentences after another or unresolved person require choice; other subjectless notes still use a note-patient convention. Reporter/companion patterns and pronoun handling are limited.
* One export status cannot represent person, negation and past time together; ambiguous combinations require choice and retain original evidence.
* Negation currently applies to a whole passage. For example, "The child has cough without fever" also incorrectly marks cough denied; human correction is required.
