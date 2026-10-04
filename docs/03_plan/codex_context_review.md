# T31 · Kontextreparatur und Auswirkungen

**ChatGPT / Codex, 04.10.2026. Aktuelle App v0.4.11.** Regelbasis von Claude, begrenzte Reparatur und neue Kontrastfälle von ChatGPT/Codex. Modellgewichte, Schwellen, Trainingsdaten und bisherige Goldlabels bleiben unverändert.

Der bekannte Satz `Mtoto alipata degedege mbele ya mama leo.` erhält jetzt den Kindbezug `stated`; „mama“ als Zeugin/Begleitperson löst keinen pauschalen anderen Personenbezug mehr aus. Die Swahili-Interpretation bleibt unreviewt. Dies ist eine Reparatur eines bekannten Fehlers.

## Nachweise und Verschlechterungen

| Prüfung | Vorher | Nachher / Einordnung |
|---|---|---|
| Neue Kontextfälle, feste Test-Termerkennung | 26/52 | **52/52**; Regelprüfung ohne Einfluss der Modell-Termerkennung |
| Dieselben erwarteten Kontextstatus mit tatsächlichem Modell bzw. Wörterbuch | jeweils 26/52 | **jeweils 52/52**; zusätzliche Kandidaten sind nicht Teil dieser Quote |
| Bestehende Modell-Kontrastfälle | 34/34 | **34/34** |
| Bestehende Wörterbuch-Kontrastfälle | 31/34 | **31/34**; dieselben drei fehlenden Begriffe |
| Python/JavaScript-Parität | 16 Fixtures | Bestanden: maximale Abweichung 4,89227116561128e-7; keine Entscheidungswechsel |
| Browserabläufe auf tatsächlichem Endstand | 27 v0.4.10 | **31/31 v0.4.11**, einschließlich vier neuer Kontext-/Exportchecks |
| Bekanntes 40er-Set: gefundene Begriffe, Modell / Wörterbuch | 58/63 · 46/63 | **Unverändert** |
| Bekanntes 40er-Set: passende Status unter gefundenen Begriffen | 57/58 · 45/46 | **58/58 · 46/46**; genau der bekannte Zeugenfall repariert |
| 400 Generatornotizen: passende Modellstatus | 765/766, 0,999 | **724/766, 0,945**; 41 Goldbegriffe in 32 Notizen jetzt ungeklärt |
| 400 Generatornotizen: passende Wörterbuchstatus | 547/547, 1,000 | **517/547, 0,945**; 30 Goldbegriffe in 24 Notizen jetzt ungeklärt |

Die geringere Statusübereinstimmung ist eine konkrete Folge der neuen Kontextpolitik: Der alte Generator nimmt nach einem anderen Subjekt am Satzende implizit wieder den Patienten an. Beispielsweise wird `the mother vomiting everything for 1 week; stomach pain since yesterday` im alten Gold als Mutterbefund plus Patienten-Schmerz bewertet. Ohne ausdrücklichen Personenbezug ist diese zweite Zuordnung jetzt ungeklärt. Alle 41 geänderten Modell-Goldstatus entstehen durch diese Regel. Keine Goldlabels werden passend gemacht.

Damit entstehen mehr manuelle Entscheidungen: Bei den 400 Notizen steigen gefundene, aber unklare Modellbegriffe von 36 auf 75. Der Term-Recall und die Passage-F1-Werte bleiben gleich, doch weniger Kandidaten sind sofort als „suggested“ eingestuft. Das ist zusätzliche Prüfarbeit; eine Zeitersparnis ist nicht gemessen. Diese Politik braucht Sprach- und Nutzertests, bevor sie für echte Fälle verwendet wird.

Vollständige Einzeländerungen, alle alten/neuen Kandidaten und Hashes: [Kontextbericht](../../eval/context_t31/results.md), [Rohvergleich](../../eval/context_t31/results.json). Standardbenchmark: [results.md](../../eval/results.md). Browser: [31 Checks und Quellhashes](../../eval/demo_regression_results.json).

Neue Browseransichten v0.4.11: [Kindbefund mit Mutter als Zeugin](../../eval/context_t31/ui/01_child_witness_desktop.png), [subjektloser Folgesatz mit gesperrtem Bestätigen](../../eval/context_t31/ui/02_orphan_requires_choice_desktop.png), [Aufnahmemanifest](../../eval/context_t31/ui/capture_manifest.json). Desktop-Chrome, fiktive Daten; keine Telefonaufnahme.

## Begrenzte Kontextpolitik

1. **Betroffene Person:** ausdrückliche Rollen wie child/mtoto/patient und mother/mama werden im Satzbezug gelesen. Eine Rollenbezeichnung allein beweist nicht, wer den Befund hat. Ein klarer Wechsel zum Kind überschreibt einen zuvor anderen Bezug.
2. **Begleitung und Zeugenschaft:** begrenzte Muster wie `in front of the mother`, `accompanied by`, `mbele ya` oder `akiwa na` kennzeichnen eine Begleitperson. Die umgekehrten Fälle Mutter betroffen / Kind begleitet sind ebenfalls getestet. Ein Relativsatz wie `mother who has fever` wird nicht als reine Begleitung entfernt.
3. **Berichtende Person:** bekannte Verben wie `mother reports that the child ...` oder `mama anasema mtoto ...` trennen Bericht und betroffenes Subjekt. `Mother reports fever` hat keinen ausdrücklichen Betroffenen und bleibt ungeklärt. Auch `Mother says she has fever` wird nicht durch eine erfundene Pronomenauflösung entschieden.
4. **Besitz-/Verwandtschaftsbezug:** einfache Muster wie `mother's child`, `child's mother`, `mtoto wa mama` und `mama wa mtoto` werden getrennt. Das ist keine vollständige Grammatikabdeckung.
5. **Fortführung:** innerhalb eines Satzes sowie nach `also`/`pia` wird der Bezug fortgeführt. Ein neuer Satz ohne Subjekt nach einer anderen oder unklaren Person bleibt ungeklärt. Sonstige subjektlose Notizen verwenden weiter die dokumentierte Konvention „Notiz über den Patienten“; das ist eine Produktannahme.
6. **Mehrere Personen:** koordinierte oder mehrere mögliche betroffene Personen verlangen eine Auswahl. Es entsteht kein Mehrpatienten-Fallmodell.
7. **Verneinung und Zeitpunkt:** intern getrennte Merkmale. Verneinung einer Aussage ist kein Nachweis, dass der Befund fehlt. Andere Person + verneint, andere Person + Vergangenheit oder Vergangenheit + verneint werden nicht auf eine einzelne Dimension verkürzt.

Die Muster sind absichtlich begrenzt. Nicht erkannte Pronomen, komplexe Satzstrukturen, andere Verneinungsformen und weitere Sprachen können weiterhin falsch eingeordnet werden. Die feste Begriffsliste verhindert keine Kontextfehler.

Zwei zusätzlich **nach** dem Fix formulierte Explorationsfälle stehen separat in [exploratory_after.json](../../eval/context_t31/exploratory_after.json), außerhalb der 52 vorher eingefrorenen Fälle. `The child has cough without fever.` zeigt eine bereits zuvor vorhandene Grenze: Die Verneinungsregel gilt für die ganze Passage und markiert hier auch cough als denied. Der Mensch muss den Hustenstatus korrigieren; eine künftige Reparatur braucht befundbezogene Verneinung. `Mother says her son has fever.` bleibt nun ungeklärt, weil son nicht zu den begrenzten Patientenrollen gehört. Diese Beispiele verhindern eine Behauptung vollständiger Grammatik-/Kontextabdeckung.

## Prüfschritt und Export bleiben kompatibel

Unlösbare Kontextfälle verwenden den vorhandenen Regelstatus `conflict` und das Feld `unclear`. Die bestehende Oberfläche lässt dabei keinen Status vorgewählt; Bestätigen und Weitergehen bleiben gesperrt. Der Nutzer wählt ausdrücklich einen der vorhandenen vier Status oder lehnt den Vorschlag ab. Eine neue Exportstatus- oder UI-Schemaversion wird nicht eingeführt.

Intern enthält der Kandidat zusätzlich `context` mit Person, Negation, Vergangenheit, Rollenhinweisen und Grund. Dieser Datensatz ist **kein neues Exportfeld**. Das JSON-Exportformat bleibt `afyanote.referral-draft/0.3`, mit unveränderten wörtlichen Belegen und `review_log`, das ursprünglichen Regelstatus und menschliche Auswahl festhält.

**Grenze:** Ein einzelner Exportstatus kann andere Person und Verneinung nicht gleichzeitig strukturiert ausdrücken. Die ausdrückliche Auswahl und Originalpassage erhalten die Information, lösen aber diese Formatgrenze nicht. Eine mehrdimensionale, integrierbare Darstellung gehört in T35. Der ungeklärte Schritt bedeutet keine klinisch bestätigte Interpretation.

## Reproduktion und Versionen

- `node eval/context_t31/run.mjs`: Vergleich mit erhaltenen v0.4.10-Regeln; schreibt ausschließlich T31-Ergebnisse. Prüft den vor dem Fix gespeicherten Fall-Hash und schützt Modell, Daten, Raw-Auswertungen und alte Aufnahme vor Änderungen.
- `node eval/parity.mjs`, `node eval/eval.mjs`: vorgeschriebene Paritäts-/Standardprüfungen. Die Standardauswertung aktualisiert `app/build_info.json`; Cache danach auf v0.4.11 angehoben.
- `node eval/demo-regression.cjs`: mit lokal laufender App, Playwright für Node und Chrome. Testet auch tatsächliche UI-Auswahl, gleichbleibendes Exportschema und Originalspannen.
- Vorherige Regeln, Standardergebnisse, About-Zahlen und Browserbericht unter [baseline/](../../eval/context_t31/baseline/). Die 40er-Originalberichte bleiben schreibgeschützt; sie sind keine aktuellen v0.4.11-Ergebnisse.

Der zusätzliche Python-Browserlauf `eval/e2e.py` konnte lokal nicht starten, weil Python-Playwright nicht installiert ist. Die 31 tatsächlichen Browserchecks liefen mit dem vorhandenen Node-Playwright und installiertem Chrome. Der LLM-Guard-Selbsttest bestand; seine Referenzausgaben wurden mit aktuellen Regeln neu erzeugt. Es lief kein Sprachmodell und keine neue Hardwaremessung.

Die letzte Aufnahme unter `assets/codex_v0410/` bleibt unverändert und zeigt v0.4.10 vor dieser Reparatur. Sie ist ein vorhandener Demo-Baustein; die neue Personenpolitik ist darin nicht aufgenommen. Reale Telefon-/Sprach-/Fach-/Bedienprüfung, Stimme und Einreichung bleiben externe Aufgaben. Nächster Codeauftrag: T33, allgemeine Trennung eingefrorener Auswertung und neuer Läufe.
