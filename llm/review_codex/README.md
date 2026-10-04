# Review des optionalen Claude-LLM-Werkzeugkastens

ChatGPT / Codex, 04.10.2026. Originalwerkzeuge Claude; Änderungen an Guard/Scorer/Capture und neue Tests Codex. Die App bleibt v0.4.11, Werkzeug ist nicht eingebaut.

| Nachweis | Ergebnis | Datei |
|---|---|---|
| Vor dem Fix festgeschriebene Guardprüfungen | 13/31 → 31/31 | guard_before.json / guard_after.json |
| Scorer-Verträge | 13/13 | eval_tests.json |
| Tatsächliche CLI / Kollision / Hashprüfung / Teilmenge | 8/8 | cli_tests.json |
| Fake-Server-Messablauf | 11/11 | runner_tests.json |
| Neue Klassifikator-/Adversarialreferenz | PASS, 58/63 Modellbegriffe plus 1 zusätzlicher Begriff; adversarial 0 | [Report](current_reference_report/results.md) |
| Alter SFT-Train/Dev-Split | 42 gemeinsame Notizen, 79/300 Devzeilen wiederverwendet | sft_audit.json |

Der alte Guard ist in baseline_guard.mjs reproduzierbar; ausschließlich sein Importpfad und ein Herkunftskommentar wurden angepasst. Bytegleiche Originalfassung unter [Review-Sicherung](../../../90_Archiv/03_Claude_Review_20261004/llm/guard.mjs). Der Testquellhash in beiden Guardreports stimmt überein; Quellhashes sind keine Laufzeit-Zertifizierung.

Neue Referenzreports liegen separat. `reference_report/` hält den ersten Zwischenlauf fest; `current_reference_report/` hat die endgültigen Scorerhashes. Der vollständige Selbsttest wurde zusätzlich durch den CLI-Test auf dem Endstand ausgeführt. Historische llm/results.* / outputs / sft und alle App-/Modell-/Trainingsdaten sind erhalten. Kein Sprachmodell wurde ausgeführt und die Mockdaten sind keine Modell-/RAM-Messungen. Der neue Guard akzeptiert weiterhin wörtliche, aber semantisch falsche Belege; genau diese Grenze wird mitgetestet.

Reproduktion: [LLM-README](../README.md). Erneute Captures und Reports immer in neue Ordner schreiben. source_hashes im Report prüfen, nicht das Dateidatum als Versionsnachweis verwenden.
