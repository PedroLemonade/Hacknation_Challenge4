# Gemeinsame Ordner und Dateiregeln

Peter arbeitet mit Claude, Codex und ChatGPT im selben Ordner. Es gibt **einen aktiven Projektstand**: `01_Working_Demo_AfyaNote`. Hauptwegweiser und durchsuchbarer Katalog liegen eine Ebene darüber. [Hauptübersicht](../../../00_LIES_MICH.md), [Ordnung/Nachweise](../../../00_Ordnung_und_Inventar/README.md).

## Wohin neue Inhalte gehören

| Inhalt | Ziel |
|---|---|
| Laufende App und lokale Ressourcen | `app/`, mit Cache-Version nach Änderung |
| Training / bestehende synthetische Daten | `training/` / `data/`; stabile Pipelinepfade |
| Prüfprogramme, Ergebnisse, neue versionierte Läufe | `eval/`; eingefrorene Berichte nicht überschreiben |
| Neuer Research mit Quellen und Datum | `docs/02_research/`; Herkunfts-/Annahmenkennzeichnung |
| Entscheidungen, technische Planung, Worklog | `docs/03_plan/` |
| Ausführbarer Anschlussauftrag | `docs/04_tasks/` und Statuszeile in BACKLOG |
| Pitch, Stimme, Folien, Abgabetexte | `docs/05_pitch/` |
| Neue Aufnahme eines bestimmten Stands | `docs/05_pitch/assets/<eindeutiger Versionsordner>/` mit README und Manifest |
| Spätere Pilotmaterialien | `docs/06_pilot/`, sobald tatsächlich erstellt |
| Optionaler LLM-Versuch | `llm/`, Ergebnisse klar vom ausgelieferten Modell trennen |
| Externe ursprüngliche Research-Eingabe | `../02_Research_und_Planung/00_Originalinputs_von_Peter/` mit Herkunft |
| Original Challenge-Unterlage | `../03_Challenge_Unterlagen/` |
| Historischer Snapshot / Transfer | `../90_Archiv/01_Sicherungen_und_Transfers/`, klar benannt |

Pfadangaben in der Tabelle sind vom Projektordner aus gedacht. Die Links oben sind vom Ort dieses Dokuments aus aufgelöst.

## Was maßgeblich ist

Aktueller Code steht in `app/`; der Aufgabenstatus in `BACKLOG.md`. Messwerte müssen zum im Bericht festgehaltenen Modell-/Regel-/App-Stand passen. Researchkopien, alte ZIP-/TGZ-Pakete und der parallele archivierte Prototyp sind Hintergrund und Historie. Alte Aufgaben-IDs sind kein Alias für aktuelle IDs.

`data/dictionary.json` und `app/dictionary.json` werden absichtlich getrennt gehalten: Evaluation bzw. offline gelieferte App. Auch identische Agent-Anweisungen haben mehrere Namen für verschiedene Programme. Hash-identische Dateien nicht automatisch entfernen.

## Pflege

1. Zuerst aktuellen Dateistand und Worklogs lesen; dieselbe Datei nicht gleichzeitig mit einem anderen Agenten ändern.
2. Vor einer Verschiebung Verweise prüfen; Modell-/Daten-/App-Pfade bei einer reinen Ordnung erhalten. Alte Texte nicht stillschweigend in neue Messergebnisse umdeuten.
3. Nach Aufgabenänderungen `python3 tools/build_hub.py` ausführen. Nach Ordner-/Dateiänderungen zusätzlich `python3 tools/build_workspace_catalog.py` für die Hauptübersicht.
4. Frühere Inhalte erhalten; Snapshots/alte Einstiegdateien als Archiv kennzeichnen. Änderungen aus Archivpaketen zuerst separat vergleichen.
5. Keine neuen synchron gehaltenen Researchkopien anlegen. Neue Arbeit im aktiven Projekt erstellen, Herkunft nennen und vom Hauptwegweiser verlinken.

Diese Runde bündelt sieben Archivobjekte, sichert frühere Wegweiser und ergänzt Herkunfts-/Nutzungshinweise. App, Modell, synthetische Daten, eingefrorener 40er-Bestand und aktuelle Aufnahme bleiben unverändert. Der Chat-Research ist als Originalkopie verfügbar; das angegebene Plan-HTML bleibt wegen tatsächlicher macOS-Zugriffssperre noch in Downloads.
