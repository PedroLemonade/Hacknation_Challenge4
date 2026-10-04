# Datenbestand · synthetisch

Alle Dateien hier stammen aus dem synthetischen Generator in `training/`. Sie sind für Entwicklung und Vergleich nützlich, aber weder echte Patientendaten noch ein klinisch oder muttersprachlich freigegebenes Korpus.

| Datei | Verwendung | Grenze |
|---|---|---|
| passages_train.csv | Modelltraining | Bekannte Trainingsformulierungen |
| passages_dev.csv | Schwellen-/Entwicklungsentscheidungen | Entwicklungsbestand, kein unabhängiger Schlussnachweis |
| passages_test_typo.csv | Tippfehlerprüfung | Synthetische Varianten aus demselben Generator |
| passages_test_heldout.csv | Vergleich auf zurückgehaltenen Formulierungen | Gleiche Autoren/Generatorfamilie, keine Feldvalidierung |
| notes_test.jsonl | Pipelineprüfung von Begriff und Kontext | Synthetische Besuchsnotizen |
| dictionary.json | Stichwort-Baseline für Evaluation | Runtime-Kopie unter `app/` bleibt absichtlich bestehen |

Der zusätzliche Bestand mit 40 Notizen liegt getrennt unter `eval/independent_notes.jsonl`, samt [Einordnung](../eval/independent_report_notes.md). Er wurde ohne Einsicht in Trainingslexikon/Daten geschrieben, aber durch einen KI-Autor annotiert. Nach Offenlegung von Fehlern dienen bekannte Fälle als Regression.

Die Dateipfade bleiben stabil, weil Training/Evaluation sie verwenden. Ein neuer Testbestand gehört in einen eigenen versionierten Ordner mit Herkunft, Goldreview und Freeze-Hashes. Trainings-, Entwicklungs- und Testbestände nicht zur besseren Zahl vermischen. Dieses README verändert keine Daten.
