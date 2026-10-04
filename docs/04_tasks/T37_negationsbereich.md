# T37 · Verneinungsbereich pro Begriff reparieren

**Autor/Zuständigkeit:** ChatGPT / Codex. Auftrag inzwischen umgesetzt (Nachweise unten), ursprüngliche Priorität P1. Beispiel aus v0.4.11: „Child has cough without fever“ markiert auch cough denied. T31 hat diesen Fehler ausdrücklich nicht gelöst.

```text
Lies AGENTS.md, codex_context_review.md und eval/context_t31/exploratory_after.json. Reserviere nur rules.js, neue eval/context_t37-Dateien und Versions-/Nachweisdoku. Vor jeder Regeländerung mindestens 24 neue SW/EN-Fälle mit positiven und verneinten Begriffen im selben Satz einfrieren, inklusive 'without', 'but no', 'hana', mehrfacher Personen und Dauerzuordnung. KI-Erwartungen ausdrücklich unreviewt kennzeichnen. Erhalte alle T31-/40er-Goldsets und Baselines unverändert.
Implementiere einen begrenzten Negationsbereich pro Begriff. Keine pauschale Verneinung aller Terme in der Passage. Zeige Mehrdeutigkeit durch bestehende Auswahlpflicht, ohne Exportdimensionen oder medizinische Texte neu zu erfinden. Vergleiche vor/nach mit aktueller Modell- und Wörterbuchpipeline, alle 400 Generatornotizen, Fehlalarme und Kontextstatus getrennt. Fix darf bekannte Personen-/Zeitregeln nicht unbemerkt schwächen.
Bump Service-Worker-Version nach letzter Appänderung; Parität, 34 Kontrasttests, 52 T31-Fälle und aktuelle Browserregression mit gehashtem Nachweis. Schreibe Ergebnis und verbleibende Fehlfälle, markiere neue Fälle als bekannte Regression. Keine Trainingsdaten-/Goldänderung zur Scoreverbesserung und kein Commit/Deployment.
```

Fertig: definierter Fix, nachvollziehbare Grenzen, neue Versionsnachweise. Sprach-/Fachfreigabe bleibt T08/T34.


## Umsetzung 04.10.2026 durch ChatGPT / Codex

04.10.: begrenzter Term-Negationsbereich; 54/56 Policy, 53/56 Modell, 49/56 Wörterbuch; 52/52 T31, 61 Verträge, 39 Browserchecks. Zwei fragliche KI-Erwartungen erhalten; native Prüfung offen.

Nachweise und Grenzen: [Fortsetzungsreview](../03_plan/codex_continuation_review.md). Der ursprüngliche Auftrag oben bleibt für die Herkunft erhalten.
