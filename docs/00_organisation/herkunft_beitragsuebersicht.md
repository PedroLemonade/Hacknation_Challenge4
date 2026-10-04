# Claude und ChatGPT / Codex · Beiträge

Zusammengestellt von **ChatGPT / Codex**, 04.10.2026. Die aktive Demo enthält Beiträge von beiden.

| Herkunft | Dokumentierte Arbeit |
|---|---|
| **Claude** | Grunddemo, aktuelles 10-Begriffe-Modell und Training, viele UI-Funktionen, Dezimalaltersregel, ursprüngliche Aufgaben, frühere Medien/Pitchtexte und optionale LLM-Werkzeuge |
| **ChatGPT / Codex** | Research-/Feasibility-Reviews, zusätzlicher 40er-Testbestand, Demo-Reparaturen und neue Browserchecks, MD-Export/Prüfprotokoll/Druckansicht, Aufgaben T31–T36, Aufnahme `codex_v0410/`, Ordnerorganisation und Herkunftskatalog |
| **Gemeinsam** | Aktuelle `app.js`, `index.html`, `i18n.js`, `sw.js`, `rules.js`; Second-author-Runner und aktuelle Standardauswertung; README, BACKLOG, Agent-Regeln und Projekt-Hub |
| **Originalquelle / Dritte** | Challenge-PDFs; QR-Bibliothek von Kazuhiko Arase, von Claude eingebunden |
| **Ungeklärt** | Tatsächlicher ursprünglicher Tool-Autor des von Peter eingefügten Researchtexts; einzelne Paketbereitstellungen |

**Die Spalte „Wer“ im BACKLOG ist die Aufgaben-Zuständigkeit.** Beispielsweise stammt der ursprüngliche T09-Prompt von Claude, während ChatGPT/Codex die 40 Testnotizen geschrieben hat. Eine spätere Modell-Zuständigkeit für Codex macht das bestehende Modell nicht zu einem Codex-Modell.

Die [vollständige Beitragsübersicht](../../../00_HERKUNFT_CLAUDE_CHATGPT.md) nennt Unterschiede, Originalinput-Grenzen und Grundlagen. Die [Ordnerübersicht](../../../START_HIER.html) bietet eine Dateisuche mit Herkunftsfilter. Bei jeder Datei steht die dokumentierte Herkunft und deren Grundlage; geänderte Dateiversionen werden bis zur geprüften Aktualisierung als ungeklärt markiert.

Nachweise: [Claude-Worklog](../03_plan/claude_demo_worklog.md), [ChatGPT/Codex-Worklog](../03_plan/codex_demo_worklog.md), [Mapping übernommener Vorarbeiten](../02_research/bewertung_fremdarbeit.md). Diese Zuordnung ist keine vollständige Git-Autorenhistorie und keine quantitative Aufteilung des Arbeitsaufwands.

**T31 / v0.4.11:** Die neue Personen-/Kontextpolitik, 52 vor dem Fix gespeicherte Fälle und Vergleichsberichte stammen von ChatGPT/Codex; die Regelbasis und das weiterhin unveränderte Modell von Claude. [Aktueller Kontext-Worklog](../03_plan/codex_context_worklog.md). Die damaligen LLM-Werkzeuge stammen von Claude; T31-Referenzausgaben wurden von ChatGPT/Codex erzeugt, ohne tatsächliches Sprachmodell. Der spätere Claude-Dateireview macht Guard, Scorer, Capture und Anleitung zu gemeinsamer Arbeit.

## Neue Beiträge festhalten

1. Im eigenen Worklog benennen, welche Dateien/Bereiche erstellt oder verändert wurden. Bei gemeinsamer Vorarbeit beide nennen.
2. Herkunftsregeln in `../../../00_Ordnung_und_Inventar/herkunftsregeln.json` nach belegten Beiträgen aktualisieren; spezifische Dateiregeln haben Vorrang vor den breiten Regeln der ursprünglichen Übergabe.
3. Erst nach dieser Prüfung im Projektordner `python3 tools/build_workspace_catalog.py --refresh-origin` ausführen. Das verknüpft die dokumentierte Zuordnung mit den aktuellen Inhalts-Hashes aller Katalogdateien. Vorher alle seit der letzten Aufnahme geänderten Dateien prüfen; sonst würde eine breite alte Regel neue Beiträge falsch zuordnen.
4. Normale Katalogläufe ohne Flag behalten die bestehende Herkunftsaufnahme. Neue oder geänderte Dateien fallen unter „Ungeklärt“. Auch der ausführende Agent muss seinen Beitrag dokumentieren; das Werkzeug erkennt ihn nicht automatisch.

**O03 / Claude-Dateireview:** ChatGPT/Codex prüfte und verbesserte 23 aktive Claude-Grunddateien, ergänzt gemeinsame README/Hubs und Herkunftsangaben. Neue Quellennachweise, 63 LLM-Vertragschecks, SFT-Audit und Aufgaben T37/T38 von ChatGPT/Codex. Pitch/Plan/Guard-Dateien sind gemeinsam; aktuelle PNGs beruhen auf Claude-Deck plus Codex-Korrekturen. [Review](../03_plan/codex_claude_review.md), [Worklog](../03_plan/codex_claude_review_worklog.md).

**T38/T39/T42 · tatsächliches LLM-Training:** Claude stellte Lexikon/ursprüngliche Vorbereitung; ChatGPT/Codex bereinigte Splits, implementierte Passage-ID-Auswahl und führte drei echte lokale QLoRA-Läufe aus. Basisgewichte stammen von Qwen/Alibaba. Neue Daten/Adapter sind davon abgeleitet, keine klinische oder unabhängige Sprachfreigabe. [Aktueller Trainingsreview](../03_plan/codex_llm_training_review.md). Der ursprüngliche App-Klassifikator bleibt unverändert und Claude zugeordnet.


## Weitere Beiträge 04.10. · Demo v0.4.17

**Claude:** S04-About-/Pitchvergleich um 09:05, README/Folie/Sprechtext und Ausschluss von Base-/Laufzeitordnern für einen späteren Repository-Push. Diese während der Sitzung neu vorliegenden Beiträge wurden erhalten.

**ChatGPT / Codex:** T33 fresh-only Benchmarks und Manifeste, T37 begrenzte Term-Verneinungsbereiche, 56 vorab eingefrorene Fälle, 61 Verträge, aktuelle 39 Browserchecks und 29 Tiefenprüfpunkte mit 60 Layoutkonstellationen; atomare Grid-/Suchfeld- und Dauer-Lückenfixes auf Claude-UI. Neue v0.4.17-Aufnahme, 120 vorbereitete blinde Reviewnotizen, lokaler Integrationsmock mit 21 Prüfungen, Bedienprobe-Unterlagen, mobile Architektur und neue Prompts T43–T55. Ein weiterer T47-Trainingslauf ist separat vorab geplant und gestartet; Abschluss ausschließlich aus tatsächlichem Manifest ableiten.

**Gemeinsam:** modifizierte App-/Regeldateien, vorhandener Second-author-Runner, Generatorauswertung, README/Hub/Status und Agent-Regeln. **Dritte:** Qwen-Basismodell, Frameworks, QR-Library, Original-PDFs. Die Erstellung neuer Belege ist von der Autorenschaft der getesteten App und von der fachlichen Freigabe getrennt.
