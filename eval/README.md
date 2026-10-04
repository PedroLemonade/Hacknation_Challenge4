# Prüfungen und Nachweise

## Für aktuelle Zahlen und Demo

| Dateien | Zweck und Einordnung |
|---|---|
| results.md / results.json | Synthetischer Generator-Benchmark, Modell gegen Stichwortliste, Kontext-Kontrastfälle |
| browser_runs/20261004_final_v0417/browser_report.json | Aktuelle 39 Browserchecks, alle App-Hashes passen; keine physische Telefonprüfung |
| deep_runs/20261004_final_v0417/report.json | 29 weitere Prüfpunkte, 60 Layoutkonstellationen; Desktop-Chrome |
| demo_regression_results.json | Erhaltene historische Browserprüfung, nicht aktueller Stand |
| asset_runs/20261004_v0417/assets.json | Aktuelle Dateigrößen/Hashes; Gzip-Schätzung, keine HTTP-/RAM-Messung |
| demo_asset_manifest.json | Historischer Größenstand erhalten |
| independent_notes.jsonl | Unveränderter Second-author-Bestand mit 40 synthetischen Notizen |
| independent_results.md / .json | Auswertung dieses Bestands; eingefrorene Dateien erhalten |
| independent_report_notes.md | Metrikdefinitionen, unreviewte Annotation und bekannte Altersreparatur |
| context_t31/ | 52 vor dem Fix eingefrorene Kontextfälle; Vorher-/Nachher-Regeln, neue 40er-Regression, jede Änderung der 400 Generatornotizen |

## Programme und Eingaben

- `eval.mjs`: Generator-Auswertung, schreibt auch `app/build_info.json`. Eine Ausführung kann also App-Dateien ändern und verlangt passende Versionierung.
- `parity.mjs` und `parity_fixtures.json`: Python-/Browser-Abgleich anhand festgelegter Fixtures.
- `demo-regression.cjs`: tatsächliche Browserabläufe einschließlich Fehlerzuständen, Exportfreigabe und Offline-Reparatur.
- `e2e.py`: weiterer Browserablauf; Voraussetzungen stehen im Programm/Projekt-README.
- `independent.mjs`: fresh-only Runner für den bekannten 40er- oder 400er-Bestand. T33 ist umgesetzt: --out ist Pflicht, bestehende Ziele werden verweigert. Historische Baselines bleiben schreibgeschützt; nicht entsperren.
- `context_t31/run.mjs`: neuer T31-Runner. Erhält eingefrorene 40er-Ergebnisse; schreibt eigene Berichte und prüft Fall-/Baseline-Hashes sowie geschützte Dateien. [Politik und Auswirkungen](../docs/03_plan/codex_context_review.md).

## Historisch und nur für Fehlernachweise

`demo_baseline.json` und `demo_baseline_export.json` zeigen reparierte Fehler aus einem früheren App-Stand. Der absichtlich ungültige Export ist **keine Vorlage** für einen korrekten Entwurf.

`context_t31/baseline/` hält die Regeln, Standardergebnisse, About-Zahlen und Browserprüfung von v0.4.10 vor der Personenreparatur fest. Diese damalige Prüfung gehörte zu v0.4.11 und 31 Browserchecks. Aktuell v0.4.17: 39 Browserchecks plus 29 Tiefenprüfpunkte; die alten Dateien werden nicht nachträglich als aktuell umetikettiert.

`demo_artifacts/` enthält fiktive Exporte und Test-Screenshots. `markdown-fence-fixture.md` ist eine absichtlich ungewöhnliche Eingabe für den Robustheitscheck. Für saubere Pitchbilder bevorzugt die [aktuelle Aufnahme mit Manifest](../docs/05_pitch/assets/codex_v0417/README.md); manche Full-Page-Testbilder enthalten durch Sticky-Header verschobene Elemente.

Für einen unverbrauchten Vergleich Modell **und** Regeln vor neuen Testfällen einfrieren. Bestehende Fehlerfälle nicht als neuen unabhängigen Erfolgsbeleg verwenden. Test- und Datenpfade bleiben bei der Organisation erhalten.

## Neue versionierte Läufe, T33/T37

Aktuell: [40 Notizen](runs/20261004_final_v0417_40/results.md), [400 Notizen](runs/20261004_final_v0417_400/results.md), [Versionierung](versioning_t33/README.md), [Negationsbereiche](context_t37/README.md). `node eval/independent.mjs --out eval/runs/NEXT_UNIQUE_RUN` schreibt in ein frisches Ziel. Alte Standardziele nicht entsperren. `demo-regression.cjs` schreibt jetzt nach `eval/browser_runs/`; zusätzliches Layout-/Interaktionsprogramm `demo-deep.cjs` nach `eval/deep_runs/`. Beide behalten Fehlruns und alle historischen Belege.
