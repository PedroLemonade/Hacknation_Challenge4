# T13 · Entscheidung: WHO Gefahrenzeichen Hinweis behalten?
**Wo:** Du (optional Mentor fragen) · **Dauer:** 10 Min · **Verbrauch:** keiner oder Claude Code ca. 3 %

Aktuell: Nach Bestätigung zeigt die App neutral „Check against your protocol … AfyaNote does not set urgency.“ Kein „heute überweisen“.

**Meine Empfehlung:** behalten. Der Brief nennt Screening Unterstützung ausdrücklich, und der Hinweis entscheidet nichts. Codex empfiehlt weglassen. Wenn ein Mentor oder du Zweifel hast, abschalten.

## Prompt zum Abschalten (Claude Code)
```text
Read CLAUDE.md. Remove the WHO danger sign reminder box from the review step in app/app.js
(function confirmedDanger and the notice that uses it) and the "WHO IMCI" line from the handover comments.
Keep the four danger sign terms as normal documentation terms. Bump VERSION in app/sw.js.
Run node eval/eval.mjs. Do not commit.
```
Danach im Video Teil 3 den Satz zum Gefahrenzeichen streichen.
