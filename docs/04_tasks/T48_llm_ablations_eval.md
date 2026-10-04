# T48 · LLM-Fehler in Format, Quellenwahl und Semantik zerlegen

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Codex**. Priorität: **P2**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

T47 und unveränderte Guard-/Datengrundlage.

## Eingaben

- `llm/training_codex/selection.py`
- `llm/training_codex/score_run.mjs`
- `llm/training_codex/capture_saved_selection.py`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: T47 und unveränderte Guard-/Datengrundlage.

1. Lege vor neuen Antworten einen Ablationsplan fest: Base/Adapter, freie Auswahl/zulässige JSON-Grammatik, gleiches Tokenlimit und gleiche Prompts. Keine Goldlabels oder semantischen Regelantworten in Prompts einbauen.
2. Unterscheide Formatfehler von gültiger aber falscher Auswahl. Das bisherige Base-Ergebnis 0/63 beruht auf Formatverwerfung und beweist nicht allgemeine Unfähigkeit.
3. Erweitere einen fresh-only Capture für alle 300 bekannten Devnotizen, bevor das neue menschliche Goldset verwendet wird. Gold bleibt außerhalb des Inferenzprompts; Seed/Temperatur/Runtime/Hashes dokumentieren.
4. Formatconstraint darf nur Schema, erlaubte IDs und Werte erzwingen; nicht die richtige Person, Negation oder Dauer ersetzen. Ablationen nicht durch stilles Goldfilter reparieren.
5. Zeige Unterschiede EN/SW/mixed und term/status/duration mit festen Nennern, Ausfälle eingeschlossen. Keine Handytauglichkeit aus MLX ableiten.

Ausgabe: llm/ablations/NEUER_ORDNER/
Fertig, wenn: Reproduzierbare format-versus-semantic Auswertung; keine unbemerkte Daten-/Regelhilfe.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

Noch nicht durchgeführt.

## Prüfkriterium

Reproduzierbare format-versus-semantic Auswertung; keine unbemerkte Daten-/Regelhilfe.
