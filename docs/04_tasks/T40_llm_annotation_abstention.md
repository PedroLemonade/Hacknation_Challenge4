# T40 · LLM-Daten fachlich prüfen und Unsicherheit ausdrücken

Autor: ChatGPT / Codex. Menschliche Sprach-/Fachprüfung benötigt; Vorbereitung kann Codex übernehmen.

```text
Lies llm/sft_runs/20261004_family_v03/manifest.json, README.md, audit_guard_v2_review_packet.jsonl und docs/03_plan/codex_context_review.md. Beauftrage im Rahmen bereits autorisierter Kontakte qualifizierte SW/EN-Annotatoren bzw. bereite eine lokal ausfüllbare Reviewvorlage vor; nicht selbst ohne Autorisierung Personen anschreiben. Reviewpaket unverändert erhalten. Prüfe positive/negative Begriffe, Gefahrzeichen-Proxies, Subjekt, Zeit, Dauer, Belegspan und ausgelassene Items. Aktuell ausgeschlossene Kombinationen andere Person + Vergangenheit/Negation und subjektlose Folgesätze sammeln. Entwirf ein Schema für Auswahlpflicht/Abstention, das keine unklare Notiz zu stated zwingt. Bestehenden Guard und App-Export nicht ohne gesonderte Implementierung ändern. Annotation korrigieren, Konflikte adjudizieren, neue Datenversion und Splitmanifest erstellen. Kein Gold aus Modellvorschlägen übernehmen. Train/Dev und neues externes Testset getrennt halten. Alle Reviewentscheidungen mit Reviewer, Datum, Begründung und ursprünglicher Zielantwort sichern.
```

Fertig: überprüfte Datenversion, Fehlerregister und konkret prüfbares Unsicherheitsformat. Keine klinische Freigabe aus bloßem Schema-/Zitatcheck ableiten.
