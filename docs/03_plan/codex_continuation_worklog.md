# Weiterarbeit 04.10.2026 · ChatGPT / Codex

Peter hat Demo-, HTML-, Test-, Ordner- und Aufgabenarbeit ausdrücklich erweitert und erklärt, dass Claude aktuell nicht mehr arbeitet. Diese Phase übernimmt deshalb auch notwendige Oberflächen-/Versionspflege. Ursprüngliche Autoren bleiben sichtbar. Kein Commit, Deployment oder externes Messaging.

## Reserviert

T33: eval/independent.mjs, neue versioning_t33- und runs-Dateien, Browserreport-Ausgabe und Hub-Prüfung. Danach T37: rules.js, neue eingefrorene Fälle, Versions-/Nachweisdokumentation. Modellparameter, Trainingsdaten, ursprüngliche 40er-/400er-Goldlabels, T31-Belege und alte Medien bleiben erhalten.

## Vorher

LLM-Phase abgeschlossen: drei lokale Runs, gespeicherter Adapter auf allen 40 Regressionen geprüft. 90 geschützte Dateien unverändert und alle neuen Laufartefakte überprüft; Bericht in llm/training_codex/verification_20261004. T33-Vorherstand in eval/versioning_t33/before/ gesichert.

## Verlauf

- T33 in Arbeit: aktueller 40er-Runner versucht historische schreibgeschützte Ziele zu überschreiben; neuer regulärer Run muss ein frisches Ziel verwenden.

- Während der Arbeit zeigte ein neuer Claude-Worklog weitere About-/Pitch-Arbeit um 09:05. Neue UI-Dateien neu eingelesen und erhalten. Von v0.4.13 aus auf v0.4.14 erhöht; keine UI-Überschreibung. Reservierung weiterhin Regeln, Runner, Hub und neue Nachweise. Frühe Runordner heißen v0412, ihr Manifest weist korrekt den tatsächlich gleichzeitig vorliegenden v0.4.13 aus; Namen nicht nachträglich umgeschrieben.
- Erster erweiterter Browserlauf scheiterte an einem neuen Testzugriff auf einen nicht existierenden Exportfeldnamen. App nutzt main_problems; Test korrigiert, Fehlerlauf erhalten.

- Zusätzlicher Desktop-Chrome-Test fand Überlauf im Einrichtungen-Tab bei 320/360 px sowie Swahili bei 390 px. Atomare CSS-Reparatur im aktuellen Claude-HTML: Flex-Suchfeld darf schrumpfen, Zähler bleibt stabil, lange Einrichtungsnamen können umbrechen. Keine restliche UI neu geschrieben; Version v0.4.15. Zusätzlicher Test verwendete zunächst eine auf Desktop versteckte Sprachschaltfläche; korrigiert auf jeweils sichtbaren Schalter. Fehlruns erhalten.
