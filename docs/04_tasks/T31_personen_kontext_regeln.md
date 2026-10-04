# T31 · Personen- und Kontextregeln reparieren

**Wer:** Codex. **Priorität:** P0 vor einer Nutzung mit echten Fällen; die Hackathon-App bleibt eine Demo. **Voraussetzung:** Niemand bearbeitet gleichzeitig `app/rules.js` oder `eval/`.

## Problem und gewünschtes Ergebnis

Der Second-author-Test enthält einen falsch als `other_person` behandelten Kind-Befund, weil die Mutter im Satz als Begleitperson auftaucht. Daneben ist der bekannte Standard „neuer Satz ohne Subjekt = Patient“ zu prüfen. Die feste Begriffsliste verhindert solche Kontextfehler nicht.

Bekannter Ausgangsfall: `Mtoto alipata degedege mbele ya mama leo.` Die aktuelle Annotation lautet Kind / stated, ist aber nicht muttersprachlich geprüft. Neue Tests brauchen auch Varianten mit tatsächlich betroffener Mutter, indirekter Rede, Begleitung, Verneinung, Vergangenheitsbezug und mehreren Subjekten. Einzelne Wörter wie „mother“ oder „mama“ dürfen keine universelle Rollenentscheidung begründen.

## Kopierbarer Auftrag

```text
Arbeite nur in 01_Working_Demo_AfyaNote. Lies AGENTS.md, BACKLOG.md und die beiden Demo-Worklogs. Reserviere rules.js und eval/ im eigenen Worklog; lies den aktuellen Stand vor jeder Änderung.

1. Reproduziere den Personenfehler aus eval/independent_results.json und erkläre, welcher Codepfad ihn erzeugt. Verändere keine Goldlabels, um die App besser aussehen zu lassen.
2. Beschreibe eine kleine ausdrückliche Kontextpolitik: betroffene Person, berichtende/begleitende Person, Zeitpunkt und Verneinung. Prüfe, wo der einzelne assertion-Status gleichzeitig mehrere Dimensionen verliert. Bei nicht lösbarer Mehrdeutigkeit bleibt eine menschliche Auswahl erforderlich; nichts als klinisch sicher markieren.
3. Schreibe vor dem Fix mindestens 24 Kontrastfälle in einer neuen Datei: Patient, Begleitperson als Zeuge, erkrankte andere Person, zwei Personen, indirekte Rede, Folgesatz ohne Subjekt, denied+other_person und past+denied. Englisch und Swahili; Swahili-Gold als ungeprüft kennzeichnen. Zu jedem Muster positive und negative Gegenbeispiele.
4. Implementiere eine begrenzte nachvollziehbare Reparatur in den Regeln. Keine Modellgewichte, Schwellen oder Trainingsdaten ändern. Belege und Originalspannen erhalten. Bei Schemaänderung Kompatibilität und UI-Prüfschritt ausdrücklich bearbeiten; keine stillschweigende Änderung der Exportsemantik.
5. Bekannte 40 Notizen künftig nur als Regression auswerten, eingefrorene Ergebnisse erhalten. Vorher/Nachher und jede Verschlechterung berichten. parity.mjs, eval.mjs, die neuen Kontrastfälle und demo-regression.cjs auf dem tatsächlichen Endstand ausführen. VERSION nach letzter App-Änderung erhöhen. Kein Commit, Push oder Deployment.
6. Bericht mit Regelpolitik, Fehlerbeispielen, Hashes, offenen Sprachfragen und tatsächlichen Messergebnissen speichern. BACKLOG und Hub aktualisieren.
```

## Fertig wenn

- Die Personenzuordnung wird aus dem Satzbezug begründet; Begleitpersonen führen nicht automatisch zu `other_person`.
- Neue Kontrastfälle und bestehende Prüfungen bestehen oder verbleibende Fehler sind mit konkreten Auswirkungen offengelegt.
- Kein bekannter Testfall wird als neuer unabhängiger Erfolgsbeleg verkauft.
- Menschlicher Sprach-/Fachreview bleibt eine eigene Voraussetzung. Keine automatische Dringlichkeit, Diagnose oder Überweisungsentscheidung ergänzen.
