# Echte lokale LLM-Trainingsläufe

Trainingsarbeit, Messung und Auswertung: **ChatGPT/Codex**. Ausgangsidee/Lexikon/Prompt: **Claude**. Basismodell: **Qwen/Alibaba**. Die App und ihr bestehender Klassifikator bleiben ein separater Stand.

Jeder Run hat ein vor dem Training erstelltes `plan.json`, einen eingefrorenen Dev-Ausschnitt, Rohantworten, lokale Lossmetriken, Adapter/Checkpoints und ein Abschlussmanifest. `manifest.json` mit `status: completed` belegt den erfolgreichen Programmabschluss, keine Modellfreigabe. Ohne Abschlussmanifest ist ein Run unvollständig.

| Run | Bedeutung |
|---|---|
| [Direkte Zitate v01](20261004_qwen3_06b_qlora_v01/comparison.md) | 400 Updates, Batch 1, unbrauchbarer Empty-Output-Kollaps: 0/116 Begriffe auf 48 bekannten Devnotizen. Struktur 48/48 gültig ist kein Erfolg. |
| [Direkte Zitate v02](20261004_qwen3_06b_qlora_v02/comparison.md) | Weitere 400 Updates, insgesamt 800. Padding-Maske korrigiert; Optimizer frisch initialisiert. Nur 1/116 Begriffe mit falschem Status; überwiegend erfundene Zitate und Duplikate. Kein Produktkandidat. Der historische Reporttitel nennt die 400 Updates dieser Phase; Gesamtzahl steht im Manifest. |
| Passage-ID selection_v01 | Neuer Trainingsversuch vom ursprünglichen Basismodell, kein Fortsetzen des Quote-Adapters. Ausgabe wählt eine Quellpassage; Resolver rekonstruiert den Beleg. Ergebnisstatus im Abschlussmanifest und aktuellen Trainingsreview. |

Reports bewahren alle Fehler. Referenzzahlen sind keine klinische oder unabhängige Sprachgüte. Keine App-Anbindung, Browser-/Ollama-Konvertierung, Verteilung oder Upload ausgeführt. Adaptergewichte sind in der lokalen Arbeitskopie vorhanden und werden durch `.gitignore` nicht automatisch als Repositorydateien aufgenommen. Archivierte Modelldaten weder umbenennen noch ersetzen.
