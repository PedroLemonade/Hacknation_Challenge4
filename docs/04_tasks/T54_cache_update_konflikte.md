# T54 · Service-Worker-Update während offener Notiz prüfen

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Codex**. Priorität: **P2**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

T33/T44; zwei eingefrorene App-Fassungen.

## Eingaben

- `app/sw.js`
- `app/app.js`
- `eval/demo-regression.cjs`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: T33/T44; zwei eingefrorene App-Fassungen.

1. Sichere zwei Quellstände; teste mit eigener temporärer Serverwurzel und frischen Browserprofilen, ohne die aktive Demo zu überschreiben.
2. Simuliere Version A mit offenem Fall, dann Version B und controllerchange. Prüfe gemischte Cache-Assets, Offlinebadge, laufende Prüfschritte, Updatehinweis und unbeabsichtigtes Zurücksetzen.
3. Es gibt absichtlich keine persistente Fallhistorie. Keine Datenbank als Testreparatur ergänzen. Ein Reload darf Datenverlust nur nach ausdrücklicher Nutzerentscheidung auslösen.
4. Teste mehrere Tabs und beschädigten Cache mit Failures im Bericht. Fixe nur reproduzierte Probleme und erneuere Version/Nachweise falls nötig.

Ausgabe: eval/cache_update_runs/NEUER_ORDNER/
Fertig, wenn: Konkretes Updateverhalten dokumentiert; keine still verlorenen Falldaten beim Update.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

Offline-Reload geprüft; echtes Versionswechsel-Szenario noch offen.

## Prüfkriterium

Konkretes Updateverhalten dokumentiert; keine still verlorenen Falldaten beim Update.
