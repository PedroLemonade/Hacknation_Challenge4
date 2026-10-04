# T10 · Codex: Code und Sicherheits Review (Selbst Review von Claude liegt vor)
**Wo:** Codex · **Dauer:** 15 Min · **Verbrauch:** Codex gering

Claude hat die Pflichtpunkte schon geprüft: `docs/03_plan/self_review.md` (keine Funde offen). Ein unabhängiger Blick von Codex ist trotzdem sinnvoll, aber nicht zwingend.

## Prompt
```text
Read AGENTS.md. Review the web app (app/*) as a careful reviewer. Do not change files yet.
Check and report with file and line:
1. Does any code path send note text or case data off the device (fetch, beacons, analytics, logs)?
2. Is every user provided string HTML escaped before it is inserted into the page (XSS)?
3. Is any case data written to localStorage, sessionStorage, IndexedDB or cookies?
4. Does the service worker cache all files needed for an offline restart? Anything missing?
5. Can the user export before every suggestion is reviewed and consent is ticked?
6. Any UI text that sounds like a diagnosis, an urgency level or a "safe" state?
Rank findings by severity. Then propose minimal fixes and wait for my OK.
```

## Fertig wenn
Keine schweren Befunde offen. Kleine Fixes per T06 Prompt umsetzen.
