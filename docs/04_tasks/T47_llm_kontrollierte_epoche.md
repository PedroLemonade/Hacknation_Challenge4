# T47 · Small-LLM mit einer kontrollierten nominalen Epoche messen

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Codex**. Priorität: **P2 Experiment**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

T38/T42; geprüfter lokaler Base-/Datenstand.

## Eingaben

- `llm/training_codex/plans/20261004_selection_epoch01.json`
- `llm/training_codex/run_selection.py`
- `llm/training_runs/20261004_qwen3_06b_selection_v01/manifest.json`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: T38/T42; geprüfter lokaler Base-/Datenstand.

1. Prüfe zuerst, ob der unten genannte Lauf schon läuft oder abgeschlossen ist. Nicht doppelt starten. Plan, Runordner, Log und gespeicherte Gewichte gemeinsam lesen.
2. Einziger veränderter Hauptparameter gegenüber dem 600-Update-Run: 1.500 Updates, Batch 2, nominal 3.000 Trainingsbeispiele. Gleiche Seeds 7072/7070, gleiche 48 Devnotizen, Rank 8, LR 1e-4, gleiche Base. Start von Base, keine vorgetäuschte Optimizer-Fortsetzung.
3. Erhalte Datenaudit und Gewichte, Rohantworten, Lernkurve, Adapter-SHA und tatsächliche Laufzeit/MLX-Allokation. Keine Cloudtracker, keine Appanbindung.
4. Score beide Runs mit derselben Guard-/Metrikfassung. Vergleiche Formatakzeptanz, Recall, Status aller gefundenen Terme, wrong-stated-Subset, Extras, ganze Notizen einschließlich Dauer/Quelle; zeige jede Verschlechterung.
5. Niedrigere Loss ist keine Einsatzfreigabe. Bleibt die Semantik unzureichend, dokumentiere das negative Ergebnis und beende den einen Lauf ohne automatische Suchschleife.

Ausgabe: llm/training_runs/20261004_qwen3_06b_selection_epoch01/
Fertig, wenn: Tatsächlicher Abschluss oder dokumentierter Abbruch mit Rohbelegen; kein unabhängiger Qualitäts-/Handyclaim.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

04.10.: separat gestartet; Status aus Plan/Log/Manifest prüfen, keinen zweiten Prozess starten.

## Prüfkriterium

Tatsächlicher Abschluss oder dokumentierter Abbruch mit Rohbelegen; kein unabhängiger Qualitäts-/Handyclaim.
