# T31 · Personen- und Kontextregeln · ChatGPT / Codex

04.10.2026, Nutzerauftrag „keep working“. Aktiver Auftrag T31. Grundlagen gelesen: AGENTS, BACKLOG, T31, beide Demo-Worklogs, aktuelle Regel-/Auswertungspipeline und Herkunftswegweiser.

**Reservierung in Bearbeitung:** `app/rules.js`, Pflichtanhebung der Cache-Version in `app/sw.js`, `eval/` für neue Kontextfälle, Vergleichsläufe und Browserchecks; `app/build_info.json` wird durch die vorgeschriebene Auswertung erzeugt. Bitte diese Bereiche währenddessen nicht parallel bearbeiten. Keine Modellgewichte, Schwellen, Trainingsdaten oder Goldlabels ändern. Eingefrorene 40er-Notizen und deren Raw-Ergebnisse bleiben erhalten. Keine Commits, Pushes oder Veröffentlichung.

Herkunft: bestehende Regelbasis von Claude; die begrenzte Kontextreparatur, neue Fälle, Runner und Bericht dieser Runde stammen von ChatGPT/Codex. Die resultierende Regeldatei enthält beide Beiträge.

## Reproduzierter Ausgangsfehler

`Mtoto alipata degedege mbele ya mama leo.` enthält einen expliziten Kindbezug und eine als Zeugin/Begleitperson erwähnte Mutter. Das bisherige `subjectOf` und `assertion` prüfen `OTHER_RE` vor dem Kindbezug und behandeln jedes passende Rollenwort außerhalb des engen REPORTER-Musters als andere betroffene Person. Ergebnis `other_person`, gegenüber dem bisherigen unreviewten Gold `stated`.

Geplante Politik: Rollen im Satzbezug unterscheiden; bestimmte Begleit-/Berichtsmuster von der betroffenen Person trennen. Negation und Vergangenheit intern separat erfassen. Mehrere betroffene Personen, unklarer Bezug nach einem anderen Subjekt oder mehrere gleichzeitig erforderliche Statusdimensionen erhalten den bestehenden ungeklärten Prüfschritt mit expliziter Auswahl. Das Exportformat bleibt unverändert; es kann mehrere Kontextdimensionen weiterhin nicht strukturiert gleichzeitig ausdrücken.

Vorherige Regeln, Standardauswertung, App-Zahlen und Browserbericht werden vor dem Fix unter `eval/context_t31/baseline/` erhalten. Neue Kontrastfälle werden vor der Regeländerung geschrieben und mit Hash dokumentiert. Englisch und Swahili bleiben synthetisch; Swahili-Gold ist ausdrücklich ungeprüft. Keine Feld-/Sprach-/Fachvalidierung daraus ableiten.

## Abgeschlossen · v0.4.11

52 Fälle vor dem Fix geschrieben und gehasht (`280ff516c8bcd3762441858502a796a097c51d3edec211834a03464eda37fd8b`). Vorherige Regeldatei dabei noch identisch mit der App (`08e97cbbbfceeebbf41ca45afb21b8c7a4f36badcfc819258f9d6809cd971349`). Danach begrenzte Rollen-/Kontextreparatur implementiert. Aktuelle Regeln: `0a0733a55a9dad4731898072d598180bb4e399edc0b28e91fe558a52afb88ebd`.

- Regelprüfung und tatsächliche Modell-/Wörterbuch-Kontextproben 26/52 → 52/52.
- 34/34 bestehende Modell-Kontrasttests; Wörterbuch unverändert 31/34. Parität 16 Fixtures, maximale Abweichung 4,89227116561128e-7, keine Entscheidungswechsel.
- Bekannte 40er-Regression: genau der Zeugenfall geändert, gefundene Modell-/Wörterbuchbegriffe weiterhin 58/63 bzw. 46/63. Passende Status 58/58 bzw. 46/46. Originalnotizen/Gold/Raw-Ergebnisse erhalten.
- 400 Generatornotizen: unveränderte Begriffserkennung, Statusübereinstimmung sinkt 0,999 → 0,945 beim Modell, 1,000 → 0,945 beim Wörterbuch. 41 geänderte Modell-Goldstatus in 32 Notizen; 30 im Wörterbuch in 24 Notizen. Alle Einzeländerungen gespeichert, kein Gold angepasst. Mehr manuelle Prüfarbeit offengelegt.
- 31/31 Browserchecks in Chrome 154.0.8037.97 auf unverändertem tatsächlichem Endstand, Bericht vom `2026-10-04T01:33:30.882Z`. Vier neue Prüfungen für Zeugenbezug, subjektlosen Folgesatz und kombinierte Dimensionen samt Exportgate. Bestehendes Exportschema und Originalspannen erhalten.
- Modell-/Schwellen-/Trainings-/Daten-/eingefrorene Ergebnis-/v0.4.10-Medienhashes unverändert. 29 geschützte Dateien im T31-Manifest abgeglichen.
- LLM-Guard-Selbsttest bestanden; ausschließlich Klassifikator-/adversariale Referenzausgaben aktualisiert, kein Sprachmodell ausgeführt. Werkzeug weiterhin Claude, neuer Lauf ChatGPT/Codex; Sidecar in llm/T31_reference_run.md. Python-e2e konnte ohne Python-Playwright nicht starten; vorhandenes Node-Playwright für die 31 Browserchecks genutzt.
- Zwei aktuelle Desktopansichten mit Source-/Bildmanifest erstellt und visuell geprüft. Alte 74,88-Sekunden-Aufnahme zeigt v0.4.10 und bleibt unverändert.

Bericht: `docs/03_plan/codex_context_review.md`. Aktuelle statische App 440.004 Bytes, einzelne Gzip-Dateisumme 125.489 Bytes; keine HTTP-/RAM-/Telefonmessung. Bekannt geblieben: Verneinung gilt noch auf Passageebene (`cough without fever` betrifft fälschlich beide Begriffe); nach dem Fix formulierte Exploration separat gespeichert. Menschliche Sprach-/Fachvalidierung und ein mehrdimensionales Exportformat bleiben offen.

Dokumentation, BACKLOG, drei identische Agent-Regeln, Hub, Katalog und Herkunftsregeln auf v0.4.11 angepasst. Die aktuelle rules.js ist gemeinsame Arbeit; neue T31-Dateien ChatGPT/Codex. Original-/Vorher-Kopien behalten ihre belegte ursprüngliche Herkunft. Kein Commit, Push oder Deployment.

**Reservierung aufgehoben.** T31 erledigt; nächste offene Codex-Aufgabe T33. Vor neuen Änderungen aktuelle Dateien und Quellenhashes lesen.

Abschließende Übergabeprüfung: 94 lokale MD-Verweise ohne fehlendes Ziel, 451 Dateiversionen passend zur Herkunftsaufnahme, 29 geschützte Dateien unverändert. Hub mit 44 Statuszeilen/27 Dokumenten, T31 erledigt/T33 offen, 52/52 Kontextfällen und 31 Browserchecks geprüft. Letzte Aufnahme sichtbar als früherer Stand gekennzeichnet; rules.js gemeinsam, neue T31-Dateien ChatGPT/Codex. Der erste Hub-Lauf zeigte Überlauf durch lange ununterbrochene Dateipfade und die nowrap-Metadatenklasse. Im gemeinsamen Hub-Template durch Textumbruch korrigiert. Danach Hub bei 320 und 390 Pixeln mit sämtlichen geöffneten Aufgaben/Dokumenten ohne horizontalen Überlauf; Hauptübersicht ebenfalls geprüft, keine JavaScript-Seitenfehler. Keine App-Änderung durch diese Hub-Korrektur.
