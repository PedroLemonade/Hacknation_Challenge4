# T31 · aktualisierte Referenzausgaben

04.10.2026. **Werkzeug und Guard: Claude. Ausführung des neuen Selbsttests: ChatGPT / Codex.** Auf dem aktuellen v0.4.11-Kontextstand `node llm/eval_llm.mjs --selftest` ausgeführt, Ergebnis `SELFTEST PASS`.

`outputs/selftest_classifier__independent.jsonl`, `results.json` und `results.md` enthalten dadurch aktualisierte Klassifikator-Referenzwerte. Die weiterhin als `independent` bezeichnete Datenquelle ist derselbe bekannte 40er-Bestand; nach der Kontextreparatur ist seine Verwendung eine Regression. Die ursprüngliche schreibgeschützte Second-author-Auswertung wurde nicht geändert.

Es wurde **kein Sprachmodell ausgeführt**, kein Ollama-Modell geladen und keine neue RAM-/Geräteleistung gemessen. Adversariale Referenzantworten sind absichtlich erfunden und keine medizinischen Ausgaben. Sie prüfen den vorhandenen Guard.

Kontextdetails, Quellhashes und Grenzen: [T31-Review](../docs/03_plan/codex_context_review.md), [Rohvergleich](../eval/context_t31/results.json). Die höhere Statusübereinstimmung der Referenzzeile folgt einem bekannten reparierten Fall und ist kein unabhängiger LLM-Leistungsnachweis.
