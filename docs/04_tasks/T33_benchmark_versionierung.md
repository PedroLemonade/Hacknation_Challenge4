# T33 · Eingefrorene Auswertung und Regression trennen

**Wer:** Codex. **Priorität:** P1 für belastbare Pitch-Zahlen und spätere Modellvergleiche.

## Warum

Die 40 Notizen bleiben unverändert. Die Altersregel wurde jedoch nach Bekanntwerden eines Fehlers repariert. `independent_results.*` ist inzwischen schreibgeschützt; der bisherige Runner versucht noch, diese Dateien zu überschreiben. Eine neue Auswertung darf die historische Baseline weder ersetzen noch als bislang unbekannten Test darstellen.

## Kopierbarer Auftrag

```text
Lies AGENTS.md, eval/independent_report_notes.md, den aktuellen Runner und die Provenienz der bestehenden Reports. Keine Baseline-Datei entsperren, überschreiben oder umbenennen.

1. Führe eine Baseline-/Regressionsschnittstelle ein: ein ausdrücklicher Baseline-Modus nur bei noch nicht existierendem Ziel; reguläre spätere Läufe schreiben in neue versionierte Ordner unter eval/runs/. Existierende Ziele niemals stillschweigend überschreiben.
2. Schreibe einen maschinenlesbaren Run-Manifest: UTC-Zeit, App-Version, Hashes von Testbestand, Goldlabels, rules.js, classify.js, model.json und Wörterbuch, Runner-Version, Benchmarktitel, synthetisch/unreviewt, bekannte reparierte Fälle und getrennte Metrikdefinitionen.
3. Erhalte F1 für vorgeschlagene Begriffe, Recall einschließlich unklarer Kandidaten, Statusgüte nur gefundener Begriffe, exakte Notizen, zusätzliche Begriffe und alle Kontextfehler als verschiedene Zahlen. Context-errors-shown-as-stated darf nicht pauschal null Kontextfehler bedeuten. Alter separat auswerten, falls annotiert.
4. Ersetze unzutreffende Standardtexte wie 'model and rules were not tuned' durch zutreffende Aussagen zum konkreten Lauf. Bekannte Reparatur und unveränderte Modellparameter getrennt benennen.
5. README-Reproduktion auf einen tatsächlich ausführbaren Befehl aktualisieren. Teste: Baseline bleibt bytegleich; neuer Lauf reproduziert aktuellen Stand; Zielkollision verweigert Überschreiben; fehlende/falsche Goldfelder werden verständlich abgewiesen. Kein Modelltraining.
6. Hub soll den aktuellen Browserbericht nur dann als aktuellen Stand zeigen, wenn seine Hashes zur App passen. Bericht, BACKLOG und Hub aktualisieren. Kein Commit oder Deployment.
```

## Fertig wenn

Ein zweiter Lauf funktioniert ohne Schreibrechte an der Baseline; jeder Bericht lässt sich einem unverwechselbaren Code- und Datenstand zuordnen. Baseline- und Regressionsergebnisse werden im Pitch korrekt bezeichnet.


## Umsetzung 04.10.2026 durch ChatGPT / Codex

04.10.: fresh-only Runner, vollständige Manifeste; 13 Vertragschecks und 7 Versions-/Erhaltungsprüfungen. Historische 40er-Berichte bytegleich; neue v0.4.17-Runs in eval/runs/.

Nachweise und Grenzen: [Fortsetzungsreview](../03_plan/codex_continuation_review.md). Der ursprüngliche Auftrag oben bleibt für die Herkunft erhalten.
