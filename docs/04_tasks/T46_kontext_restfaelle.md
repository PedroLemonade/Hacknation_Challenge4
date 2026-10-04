# T46 · Modalität, kombinierte Zeit und Dauer als neue Kontextfälle prüfen

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Codex**. Priorität: **P2**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

T37-Code und bestehende Rohbelege einfrieren.

## Eingaben

- `eval/context_t37/README.md`
- `eval/context_t37/annotation_issues.json`
- `app/rules.js`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: T37-Code und bestehende Rohbelege einfrieren.

1. Schreibe vor Codeänderung mindestens 36 zusätzliche EN/SW/mixed Fälle: cannot ... without, doppelte Negation, hypothetische/berichtete Befunde, seit/during/zamani, derselbe Term mehrfach mit verschiedenen Dauern und Personen.
2. Die zwei fraglichen KI-Erwartungen aus T37 erhalten, alternative Annotation als separate Hypothese. Kein Goldwechsel, um 56/56 zu melden.
3. Untersuche getrennt Termerkennung, Quellenbindung, assertion und Dauerzuordnung. Zeige Fälle, die wegen begrenztem Exportstatus menschliche Wahl brauchen. Keine klinische Logik hinzufügen.
4. Nur konkrete reproduzierte Fehler minimal reparieren. Vorher/Nachher auf 52 T31, 56 T37, bekannten 40 und 400 sowie Extras und Reviewlast offenlegen. Regression nie als bislang ungesehenen Sprachtest bezeichnen.
5. Bei Appänderung Version bumpen und passende Browser-/Mediennachweise neu erzeugen. Keine Trainingsdaten- oder Modelländerung.

Ausgabe: eval/context_t46/ mit vorab eingefrorenen Fällen und frischen Runs
Fertig, wenn: Definierte Grenzen und unveränderte ursprüngliche Goldbelege; neue Zweifelsfälle fachlich offen.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

Nicht ausgeführt; T37-Restfehler und zweifelhafte KI-Erwartungen dokumentiert.

## Prüfkriterium

Definierte Grenzen und unveränderte ursprüngliche Goldbelege; neue Zweifelsfälle fachlich offen.
