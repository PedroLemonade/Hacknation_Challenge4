# T31 · Kontextregression · ChatGPT / Codex

Neue Prüfung nach bekannter Reparatur auf Claude-Regelbasis. **Kein unabhängiger Erfolgsbeleg.** Alle Fälle synthetisch; Swahili und Goldlabels nicht muttersprachlich oder klinisch freigegeben.

| Datei | Zweck / Herkunft |
|---|---|
| cases.json | 52 vor dem Fix geschriebene Kontextfälle, ChatGPT/Codex |
| case_freeze.json | Fall-Hash und noch unveränderter App-Regelhash beim Einfrieren |
| run.mjs | Neuer Vorher-/Nachher-Runner von ChatGPT/Codex; schreibt keine alten 40er-Ergebnisse |
| results.md / results.json | Aktueller Kontextvergleich, bekannte 40 Notizen und jede Änderung der 400 Generatornotizen |
| exploratory_after.json | Zwei nach dem Fix formulierte Grenzfälle; separat von den 52 eingefrorenen Fällen und ohne unabhängigen Validierungsanspruch |
| ui/ | Zwei aktuelle v0.4.11-Desktopansichten mit Source-/Bild-Hashes; Kind mit Begleitperson und notwendige menschliche Auswahl |
| baseline/ | Erhaltene Vorher-Dateien und Hashmanifest, als Referenz nicht weiterentwickeln |

[Produktpolitik, Auswirkungen und Grenzen](../../docs/03_plan/codex_context_review.md). Regel-/Pipeline-Kontextfälle 26/52 → 52/52. Bei Generatornotizen sinkt die Statusübereinstimmung, weil ein subjektloser Folgesatz nach einer anderen Person jetzt ungeklärt bleibt. Sämtliche geänderten Notizen sind im Bericht enthalten; bestehende Goldlabels bleiben gleich.

Reproduktion im Projektordner: `node eval/context_t31/run.mjs`. Der Runner überprüft den ursprünglichen Fall-Hash und geschützte Dateien. Regeln nicht an diesen bekannten Fällen als „unabhängiger Gewinn“ bewerten. Neue Fälle in einer neuen Datei/Laufrunde führen; eingefrorene Eingaben und frühere Fassungen erhalten.
