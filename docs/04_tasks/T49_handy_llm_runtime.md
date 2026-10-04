# T49 · Small-LLM auf einem echten Zieltelefon als Laufzeit-Spike prüfen

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Peter + Codex**. Priorität: **P2 nach Hackathon**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

T05, bestätigtes Gerät und nur fachlich vertretbare fiktive Fälle.

## Eingaben

- `docs/03_plan/mobile_architecture_codex.md`
- `llm/base_models/README.md`
- `llm/training_runs/README.md`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: T05, bestätigtes Gerät und nur fachlich vertretbare fiktive Fälle.

1. Gerät, OS, Browser, RAM-Klasse, freien Speicher und Energiezustand tatsächlich notieren. Keine durchschnittliche CHP-Geräteflotte erfinden.
2. Aktuelle offizielle LiteRT-LM-/WebGPU-/Native-Unterstützung für genau Modell und Quantisierung prüfen. MediaPipe LLM Inference ist maintenance-only; MLX-Safetensors sind kein Telefonartefakt.
3. Separaten technischen Spike bauen: lokale Assets, Lizenz/Checksum, erster Download versus warmer Offlinestart, kein Falldatenbackend. Adapterfusion und Quantisierung mit Originalantworten auf fiktiven Fällen vergleichen.
4. Messe Prozess-/GPU-Speicher getrennt, warme/kalte Latenzen, Start/Reload, Abbruch, thermisches Verhalten und Batterie als reales Geräteexperiment. Prüfe mehr als eine Hardwareklasse vor Verallgemeinerung.
5. Klassifikator als Vergleich behalten. Wenn LLM schlechter, schwerer oder inkompatibel bleibt, Spike dokumentieren und Produktentscheidung offenlassen.

Ausgabe: llm/device_runs/NEUER_ORDNER/
Fertig, wenn: Tatsächlicher physischer Nachweis und Lizenzpfad; keine Mac-Zahl als Telefonzahl.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

Reale Geräte und kompatible Laufzeit fehlen.

## Prüfkriterium

Tatsächlicher physischer Nachweis und Lizenzpfad; keine Mac-Zahl als Telefonzahl.
