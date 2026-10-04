# Passage-ID-Adapter: tatsächlich trainiert, nicht freigegeben

ChatGPT/Codex trainierte 600 Updates mit Batch 2 neu ab Qwen3-0.6B INT4. Datenbasis: Claude-Lexikon, gemeinsamer synthetischer Familiensplit. Keine Fortsetzung des Quote-Adapters.

[Vergleich](comparison.md), [vollständige Fehler/Sprachgruppen](comparison.json), [Manifest](manifest.json), [vorab eingefrorener Dev-Ausschnitt](frozen_eval.jsonl). 48 bekannte synthetische Notizen, 116 Goldbegriffe. Modellartefakt: [Adaptergewichte](adapter/adapters.safetensors), 8.668.615 Bytes; funktioniert nur zusammen mit dem passenden Basismodell und Konfiguration.

Nach Training 76/116 Begriffe, 54/76 Status passend, 28 zusätzliche Begriffe. 45/48 strukturell gültige Notizen. 10/48 vollständig passend mit Dauer und Quelle. EN 9/18 vollständig passend, SW 0/19, Mixed 1/11. Guard verwirft drei ungültige Auswahlen und entfernt elf nicht belegte Dauern. 32 falsche positive stated-Vorschläge. Die Qualität genügt nicht für einen Produktwechsel. Alle 76 passenden Begriffe wählten ihre richtige Goldpassage; zusätzliche Labels und falsche Status bleiben möglich.

Training 973,31 Sekunden; MLX-Allocatorpeak durch Training 1,766 GB, kein Totalprozess-/Telefon-RAM. Das Paket wurde auf einem 8-GiB-Apple-M2-Mac trainiert. Keine unabhängige Sprach-/Fachannotation, kein physisches Handy und keine App-Integration.

`runner_snapshot.py`, `selection_snapshot.py`, `loss_snapshot.py`, `scorer_snapshot.mjs` sichern den tatsächlichen Versuchscode. Der vorab erzeugte Plan enthält aus der ersten Runnerfassung den ungenauen Beschreibungstext „original system + note“: tatsächlich waren es der Auswahl-Systemprompt und nummerierte Originalpassagen, wie in frozen_eval.jsonl gespeichert. Hashes und Rohdaten sind unverändert. Die zukünftige Runnerfassung korrigiert diese Beschreibung und macht ungültige Auswahlen auch für andere Scorer ausdrücklich unlesbar. Dieser Report hat sie bereits anhand selection_error vollständig zurückgewiesen. Keine Rückfallannahme freier Quote-Ausgaben.
