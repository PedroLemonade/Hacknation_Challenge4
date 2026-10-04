# T55 · Große Artefakte und Aufbewahrung nachvollziehbar ordnen

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Codex**. Priorität: **P3**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

Quellnachweise und Herkunftskatalog aktuell.

## Eingaben

- `../00_Ordnung_und_Inventar/dateiinventar.json`
- `docs/00_organisation/ordner_und_dateiregeln.md`
- `llm/training_runs/README.md`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: Quellnachweise und Herkunftskatalog aktuell.

1. Erstelle eine reine Größen-/Abhängigkeitsübersicht: Base, Adapter, Checkpoints, Fehlruns, aktuelle Medien, historische Belege. Kein automatisches Duplikat-Löschen.
2. Entscheide pro Gruppe behalten/archivierbar/reproduzierbar/Originalquelle. Base und Adapter sind verschiedene Beiträge; Modelldownload-Lizenz erhalten.
3. Verschiebe nur nachweislich nicht aktive Dateien in klaren neuen Archivordner, wenn alle Import-/Run-/Taskpfade aktualisierbar sind. Vorher manifestieren, nachher Hash-Erhaltung und Links prüfen.
4. Keine aktive .venv oder Modelle während eines Trainingslaufs verschieben. Ungeklärte Eingaben bleiben ungeklärt; Beiträge nicht aus Dateizahl als Arbeitsanteil ableiten.

Ausgabe: docs/00_organisation/artefakt_retention.md und gegebenenfalls neue Archivmanifeste
Fertig, wenn: Nichts irreversibel entfernt, laufende Trainings-/Demopfade stabil, Herkunft und Links erhalten.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

Hauptstruktur geordnet; keine weitere Bewegung während Training nötig.

## Prüfkriterium

Nichts irreversibel entfernt, laufende Trainings-/Demopfade stabil, Herkunft und Links erhalten.
