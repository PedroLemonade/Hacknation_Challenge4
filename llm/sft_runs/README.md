# Neue, getrennte SFT-Datenläufe

Claude: ursprüngliches Lexikon und SFT-Idee. ChatGPT/Codex: Splitreparatur, Ausschlüsse, neue Generatoren, Audits. Generierte Inhalte sind gemeinsame abgeleitete Daten; keine qualifizierte Annotation.

- [family_v03](20261004_family_v03/README.md): 3.000/300 eindeutige Notizen, strukturell geprüfte feste Begriffe mit Originalzitaten. Originalgenerator/SFT-Dateien aus Claude bleiben unter `../sft/` und im Archiv erhalten.
- [selection_v01](20261004_selection_v01/README.md): exakt dieselben Quellnotizen/Labels als nummerierte Passagen und Auswahlantwort. Ein abgeleitetes Format, keine weiteren 3.300 unabhängigen Fälle. Jedes Target wurde zurück an das ursprüngliche Gold gebunden.

Immer neues Zielverzeichnis. Fachlich korrigierte Daten brauchen eine neue Version; niemals alte Ergebnisse durch Überschreiben scheinbar verbessern. Dev bleibt Entwicklungssplit. Fünf von 400 ursprünglichen Generator-Testnotizen überschneiden sich mit dem neuen Training; 0/40 bekannte Second-author-Notizen teilen eine kanonische Notiz. Siehe [nachgelagerten Overlapcheck](20261004_family_v03/external_overlap_check.json). Der Check beeinflusste weder Generator noch Training.
