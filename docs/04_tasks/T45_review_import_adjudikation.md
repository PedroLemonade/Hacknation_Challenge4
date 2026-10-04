# T45 · Menschliche Reviews importieren und adjudiziertes Gold freigeben

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Peter + Codex**. Priorität: **P0 für Qualitätsclaim**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

T34 und zwei qualifizierte voneinander unabhängige Reviewer.

## Eingaben

- `eval/gold_review/packet_20261004_v0416/README.md`
- `eval/gold_review/packet_20261004_v0416/manifest.json`
- `docs/04_tasks/T40_llm_annotation_abstention.md`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: T34 und zwei qualifizierte voneinander unabhängige Reviewer.

1. Peter organisiert Sprach- und Fachreview. Ohne echte Rückläufe keine Reviewerkennungen, Kommentare oder Freigaben erfinden; keine Kontakte anschreiben.
2. Originale blinde Dateien bytegleich erhalten. Echte Rückläufe in einen neuen Ordner kopieren; IDs, Originalnotiz, qualifizierte Reviewerrolle, Reviewdatum und unresolved-Felder prüfen.
3. Baue einen Importvalidator: alle erwähnten Terme mit exact UTF-16-Spans; patient/reporter/experiencer, Negation und Zeit getrennt. Fehlende Angaben bleiben fehlend. Keine Goldlabels aus Modellvorhersagen ergänzen.
4. Vergleiche A/B ohne Modellanzeige. Erzeuge Konfliktliste und dokumentierte menschliche Adjudikation; ungeklärte Fälle bleiben ausgeschlossen bzw. separat. Die KI-Fokaldrafts sind ausdrücklich unvollständig.
5. Nur nach Freigabe Gold-Release mit unveränderlichem Manifest, Ausschlussgründen, 30 Familien, drei bekannten Kontextüberschneidungen und Sprachstrata erzeugen. Bootstrap über Familien; bekannten 40er-Bestand separat zeigen.

Ausgabe: eval/gold_review/reviews/NEUER_ORDNER und releases/NEUER_ORDNER
Fertig, wenn: Tatsächliche Freigabe nachvollziehbar; keine unabhängigen 120 Familien behauptet; Testset nicht ins Training übernommen.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

Material bereit; qualifizierte menschliche Rückläufe fehlen.

## Prüfkriterium

Tatsächliche Freigabe nachvollziehbar; keine unabhängigen 120 Familien behauptet; Testset nicht ins Training übernommen.
