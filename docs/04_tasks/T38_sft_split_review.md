# T38 · SFT-Split und Annotation vor Fine-Tuning reparieren

**Autor/Zuständigkeit:** ChatGPT / Codex. Optional vor jedem SFT-/LLM-Qualitätsclaim. [Audit](../../llm/review_codex/sft_audit.json): 42 gemeinsame Notizen, 79 wiederverwendete Devzeilen.

```text
Lies AGENTS.md, llm/export_sft.py, die Lexikonquellen und llm/review_codex/sft_audit.json. Erhalte llm/sft/train.jsonl und dev.jsonl samt ursprünglichen Hashes. Kein LLM-Training in diesem Auftrag.
Erzeuge einen neuen, unverwechselbaren SFT-Run in llm/sft_runs/. Generator darf bestehende Ziele nicht überschreiben. Split auf dokumentierter Formulierungs-/Vorlagenfamilie statt nur zufälliger Zeile; identische kanonisierte Notizen, inklusive leerer/ablenkender Fälle, nicht zwischen Train/Dev wiederverwenden. Fehlende Mengen verständlich melden statt still duplizieren. Externe Test-/Goldsets nicht als Trainingsquelle lesen. Herkunft, Seed, Eingabehashes, Roh-/Unique-Zeilen, Ausschlüsse und genaue Splitdefinition im Manifest sichern.
Prüfe jedes Target gegen Schema und strikten Guard, wörtliche Belege und zugeordnete Dauer. Prüfe Beispiele mit fremder Person, subjektlosen Folgesätzen und Gefahrzeichen auf Annotation; Regeln sind kein unabhängiger Goldannotator. Stelle Liste für qualifizierten Sprach-/Fachreview bereit. Synthetischen Devstand als bekannten Entwicklungssplit bezeichnen, unabhängigen Abschlusstest separat einfrieren.
Test: kein Splitüberlapp, keine Zielkollision, deterministische Reproduktion mit gleichem Seed/Quellen, historische Dateien bytegleich. Ergebnis in neuem Bericht, BACKLOG/Herkunft/Hub aktualisieren. Keine App-/Modellgewichte ändern, kein Commit/Deployment.
```

Fertig: neuer nachvollziehbarer Datenrun und Fehlerliste. Ein bereinigter Split allein validiert kein medizinisches Modell.
