# AfyaNote evaluation report

Generated 2026-10-03 by `node eval/eval.mjs`. All data is synthetic and was not reviewed by a native Swahili speaker or a clinician. Small test sets, read the numbers as a feasibility check, not as clinical performance.

## Model file

| Item | Value |
|---|---|
| model.json | 249,284 bytes (243 KiB) |
| Features / labels | 3000 / 10 |
| Training rows | 5000 synthetic passages |
| Thresholds | suggest ≥ 0.5, show as unclear ≥ 0.25 (chosen on dev set) |
| Inference | 0.039 ms per note (Node, laptop CPU) |

## Passage level: does the right term get proposed?

Model = small character n gram classifier. Dictionary = hand written phrase list built from the same training phrasings (rule baseline).

| Test set | What it checks | Model P / R / F1 | Dictionary P / R / F1 |
|---|---|---|---|
| dev | seen phrasings, new combinations | 1.00 / 0.98 / 0.99 | 0.98 / 0.89 / 0.93 |
| test_typo | seen phrasings with one spelling error | 1.00 / 0.91 / 0.95 | 0.97 / 0.46 / 0.62 |
| test_heldout | phrasings never seen in training | 0.99 / 0.74 / 0.85 | 0.96 / 0.34 / 0.50 |

False alarms on unrelated text (rows with no health term, held out sentences): model 0, dictionary 0.071 (n=141).

### By language on held out phrasings

| Language | Model F1 | Dictionary F1 |
|---|---|---|
| sw | 0.93 | 0.57 |
| mix | 0.79 | 0.46 |
| en | 0.72 | 0.37 |

## Note level: full pipeline incl. rules

| Metric | Model + rules | Dictionary + rules |
|---|---|---|
| Term found (recall) | 0.88 | 0.629 |
| Correct status of found terms (stated / denied / other person / past) | 0.999 | 1 |
| Context errors shown as plainly stated | 0 | 0 |
| Extra suggested terms not in the note | 1 | 0 |
| Term recall, seen phrasings | 1 | 0.949 |
| Term recall, held out phrasings | 0.763 | 0.314 |

Notes: 400, gold terms: 870.

## Contrast tests (hand written, expected behaviour fixed in advance)

Model + rules: 34 / 34 pass. Dictionary + rules: 31 / 34 pass.

| Input | Model | Dictionary |
|---|---|---|
| Fever for two days | pass | pass |
| No fever for two days | pass | pass |
| Mother has fever; child is well | pass | pass |
| Vomited once last week | pass | pass |
| Child aged 2 years; cough for 3 days | pass | pass |
| Age 2 | pass | pass |
| Child is 1.5 years old with a cough | pass | pass |
| Cough and diarrhoea | pass | pass |
| No treatment mentioned | pass | pass |
| No fever. Later note: fever today. | pass | pass |
| Das Kind hat Fieber seit gestern | pass | pass |
| (empty) | pass | pass |
| 😀😀😀 | pass | pass |
| homa homa homa homa homa homa homa homa homa homa homa ho... | pass | pass |
| mtoto ana homa siku tatu | pass | pass |
| mtoto hana homa | pass | pass |
| mama ana homa, mtoto yuko sawa | pass | pass |
| mama anasema mtoto anakohoa | pass | pass |
| hawezi kunywa na hana nguvu | pass | pass |
| anatapika kila kitu | pass | pass |
| alitapika wiki iliyopita | pass | FAIL: missing vomiting |
| anakunywa vizuri | pass | pass |
| mtoto wa miaka miwili, kikohozi siku tatu | pass | pass |
| Mtoto ana degedege tangu jana na amelegea | pass | pass |
| Kikohozi kavu, homma kidogo | pass | FAIL: missing fever |
| Mama ana homa na anakohoa | pass | pass |
| Mama ana homa na mtoto anakohoa | pass | pass |
| Mama ana homa. Pia anakohoa. | pass | pass |
| The mother has fever and cough | pass | pass |
| Mama ana homa. Mtoto anakohoa. | pass | pass |
| Cough, pain and weakness. | pass | FAIL: missing weakness |
| No fever, no cough. | pass | pass |
| Hana homa. | pass | pass |
| Noor ana kikohozi kwa siku mbili. | pass | pass |

## Known limits

* The subject of a passage carries over within a sentence and after "pia" or "also". A new sentence without any subject and without such a word is attributed to the patient.
* Negation is pattern based. Unlisted negative forms are missed.
* Kikuyu and other languages are not supported. Unsupported text can still produce a candidate, which the health promoter must reject.
* Note level status accuracy is optimistic: the test notes were generated with the same cue words the rules use. An independent test set written by another person is needed before any claim.
* No clinical validation. Synthetic data only.
