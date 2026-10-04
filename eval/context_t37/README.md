# T37 · bekannte Verneinungsregression

ChatGPT / Codex auf Claude-Basis. `cases.json` und `case_freeze.json` vor dem Fix geschrieben; `before/rules.js` unveränderte v0.4.11-Regeln. Alle ursprünglichen 40/400-/T31-Goldbestände und Daten geschützt. Keine klinische/native Prüfung.

`runs/20261004_before_v0411`: Vorherkontrolle. `scope_candidate_01/02`: bewahrt auch die zuerst entdeckten Regressionen, etwa `does not have fever` und `hawezi kunyonya wala kunywa`; danach korrigiert. `runs/20261004_final_v0412`: finale Regeldatei; dieser Ordnername beschreibt die geplante Version, keine unzutreffende Versionsbehauptung im Report. Tatsächliche 40/400-App-Manifeste und Browserversionen separat lesen. Code-/Datenhashes binden den Bericht an die geprüften Dateien.

54/56 vorgegebene Policyerwartungen, 53/56 Modellfälle, 49/56 Wörterbuchfälle. Zwei KI-Draft-Erwartungen sind zweifelhaft und bleiben als Abweichung erhalten. [Einwand](annotation_issues.json). [Review](../../docs/03_plan/codex_continuation_review.md). 52 T31-Policyfälle unverändert passend; bestehende 40/400-Metriken nicht verschlechtert.

```bash
node eval/test_scope_t37.mjs
node eval/context_t37/run.mjs eval/context_t37/runs/NEXT_UNIQUE_RUN
```

61 Scope-/Quellenverträge; der separate Vertrag für die zwei bedingten Konstruktionen verlangt Auswahl, während der eingefrorene Bericht deren ursprüngliche Abweichung weiterhin zählt. Tests sind zusätzliche bekannte Regression, keine unabhängige Qualitätsschätzung.
