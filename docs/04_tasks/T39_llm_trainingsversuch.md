# T39 · Lokales Adaptertraining und überprüfbarer Vergleich

Autor: ChatGPT / Codex. Ausdrücklich von Peter beauftragt; erweitert T38 um tatsächliches Training. Status ausschließlich im BACKLOG.

```text
Lies AGENTS.md, llm/README.md, docs/03_plan/codex_llm_training_review.md und llm/training_codex/README.md. Keine historischen Daten/Runs überschreiben. Nutze nur den qualifizierten oder ausdrücklich synthetisch gekennzeichneten Trainingssplit, nie externe Tests als Trainingsquelle. Prüfe Base-, Daten-, Guard- und Adapterhashes. Starte einen neuen lokalen MLX-Run mit festem Modellcommit, dokumentierter Antwortmaskierung, Seed, nicht gekürzten Antworten und ohne Cloudtracker. Friere den Entwicklungsausschnitt vor dem Lauf ein; gleiche Prompt-/Generierungssettings vor und nach Training. Dokumentiere alle fehlenden, leeren und ungültigen Antworten. Loss ist kein Qualitätsbeleg. Lade den tatsächlich gespeicherten Adapter neu und prüfe die bekannte 40er-Regression als vollständige Regression, mit unverändertem Gold. Nach Fehlern konkrete Ursache untersuchen, neue Korrekturen/Weitertrainings in neue Runordner. Kein App-Einbau, Commit oder Deployment. Herkunft: Claude-Grundlage, Codex-Trainingsarbeit, Drittanbieter-Basismodell klar trennen.
```

Fertig: echte Adapterdatei, gehashte Rohantworten, verständlicher Vergleich und Fehlertypen. Ein erfolgter Trainingslauf ist keine Freigabe des Modells.
