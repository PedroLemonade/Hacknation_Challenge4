# Lokales LLM-Training: Werkzeuge und Herkunft

**Claude** lieferte Lexikon, ursprünglichen SFT-Generator, Prompt, Schema und die erste LLM-Werkzeugbasis. **ChatGPT/Codex** reparierte den Generator, erstellte diese Trainings-/Prüfprogramme und führt das Adaptertraining aus. **Qwen/Alibaba** stellt das Basismodell bereit. Der App-Klassifikator ist ein anderes, unverändertes Claude-Modell.

- `prepare_base.py`: offizieller Qwen3-0.6B-Snapshot mit festem Commit, Lizenzdatei, Dateihashes und lokaler INT4-Konvertierung. Keine Notizübertragung; Modellgewichte werden heruntergeladen.
- `../export_sft.py`: neue eindeutige Runordner, Split vor dem Sampling, kanonisierte Notizen ohne Wiederverwendung, dokumentierte Singleton-Ausnahmen und semantische Ausschlüsse. Keine Test-/Goldsets als Quelle.
- `audit_sft.mjs`: alle Targets mit dem bestehenden Guard prüfen, Familien-/Notizüberlappung und Reviewpaket. Der Guard prüft keine klinische Bedeutung.
- `run_mlx.py`: lokal und offline, gleicher Prompt vor/nach Training, eigener Tokenoffset für ausschließlich Antwort-/EOS-Loss, keine gekürzten Datensätze, QLoRA und unverwechselbare Runordner. Der mitgelieferte Chat-Datenloader setzt den Qwen-Schalter nicht explizit; deshalb wird hier das tatsächlich verwendete Generierungsprefix direkt tokenisiert.
- `score_run.mjs`: fester Nenner, Rohfehler, Begriffe, Status, Dauer und zusätzliche Aussagen separat. 48 bekannte Dev-Beispiele ersetzen keinen vollständigen 300er-Devtest.
- `capture_saved.py`: gespeicherten Adapter mit überprüften Hashes neu laden; 40/400 bekannte Regressionen, kein Training auf diesen Daten. Rohantworten passen zum gemeinsamen `eval_llm.mjs`.
- `test_sft.py`, `test_score_run.mjs`: deterministische Splits, Überschreibschutz und Auswertungsvertrag; brauchen kein Modell. GPU-/Tokenisierungsprüfungen separat auf dem Mac.

Bibliotheken und lokale Installation: [Runtime](../local_runtime/README.md). Daten: [SFT-Run](../sft_runs/20261004_family_v03/README.md). Gemma bleibt ein separater Kandidat; dessen Zugangsvoraussetzung wurde nicht stellvertretend bestätigt.
