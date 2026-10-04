# T06 · Fehler nach dem Handy Test beheben
**Wo:** Claude Code · **Dauer:** 30 Min · **Verbrauch:** ca. 10 bis 20 % eines Pro Fensters (Sonnet nutzen)

## Prompt (Liste unten ersetzen)
```text
Lies PROJECT.md und halte dich an alle harten Regeln.
Beim Test am Handy (GERÄT EINTRAGEN) sind mir diese Probleme aufgefallen:
1. ...
2. ...
Behebe nur diese Punkte, ohne neue Funktionen. Ändere nur Dateien im Bereich Oberfläche,
außer ein Punkt betrifft eindeutig rules.js.
Danach:
- VERSION in app/sw.js hochzählen
- node eval/eval.mjs laufen lassen, Kontrasttests müssen weiter bestehen
- falls Playwright verfügbar: python3 eval/e2e.py http://localhost:8000/ /tmp
Zeig mir eine kurze Liste der Änderungen. Nicht committen.
```

## Fertig wenn
Probleme behoben, `eval/results.md` unverändert gut, neue Version deployed (git push → Vercel baut automatisch).
