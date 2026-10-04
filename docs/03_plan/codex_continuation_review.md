# Demo und Weiterarbeit · ChatGPT / Codex · 04.10.2026

## Ergebnis

Die begrenzte Verneinungsreparatur ist implementiert, historische Tests bleiben erhalten, neue Auswertungen benutzen frische Laufordner. Claude lieferte während dieser Arbeit eine neue About-Tafel; diese Änderungen wurden erhalten. Der aktuelle gemeinsame Stand hat eigene Browser-, Medien- und Quellenbelege. Aufgaben mit physischem Gerät, qualifiziertem Sprachreview oder Veröffentlichung sind weiterhin offen.

## Verneinung und Datenqualität

`Child has cough without fever` hält cough als stated und fever als denied. `Mtoto ana kikohozi siku mbili bila homa` liest zwei Tage nur für cough. Bare koordinierte Listen tragen bekannte Verneinung weiter; ein ausdrücklich positives Prädikat beendet den Bereich. `hana nguvu` und `hawezi` bleiben affirmative Formulierungen der jeweiligen festen Terme. Berichtende/Begleiter werden weiter nach T31 behandelt. Mehrere Statusdimensionen verlangen Auswahl.

Vor dem Fix: 56 synthetische Fälle eingefroren, 26 EN/26 SW/4 mixed. Unreviewte Erwartungen, kein unabhängiger Sprach-/Fachtest. [Vorher-/Nachher-Beleg](../../eval/context_t37/runs/20261004_final_v0412/results.md): Policy-Detektor **15 → 54/56**, Modell **15 → 53/56**, Wörterbuch **15 → 49/56**. Policy-Detektor isoliert Kontextregeln; zusätzliche Begriffe sind keine Bestandteile dieser Passquote. Vollständige Modell-/Wörterbuchmetriken und alle Kandidaten im JSON.

Zwei eingefrorene KI-Erwartungen zu „cannot drink without vomiting“ beziehungsweise „hawezi kunywa bila kutapika“ sind zweifelhaft. Die Implementierung fordert Auswahl für beide Terme. Die ursprünglichen Erwartungsdateien wurden nicht umgeschrieben; [Annotationseinwand](../../eval/context_t37/annotation_issues.json). Das Modell verpasst außerdem `weakness` in einem neuen englischen Fall. Das bleibt ein Erkennungsfehler, keine gelöste Regelaufgabe.

Alle **52 T31-Policyfälle** bleiben passend. Bekannte 40 Notizen: Modell 58/63 erkannt, Status 58/58, ein zusätzlich vorgeschlagener Term, 35/40 exakt nach Label/Status. Bekannte 400 Generatornotizen: 766/870 erkannt, Status 724/766; 42 Statusabweichungen, davon null als stated, ein zusätzlicher Vorschlag bzw. fünf Extras einschließlich unklarer Kandidaten. **Null wrong-stated bedeutet nicht null Kontextfehler.** Nach T37 bleiben diese Metriken unverändert. Eine 40er-Notiz bekommt eine kürzere belegte Passage durch den zusätzlichen `wala`-Splitter; Gold-/Trainings-/Modellparameter bleiben erhalten.

[40er-Lauf](../../eval/runs/20261004_final_v0417_40/results.md) · [400er-Lauf](../../eval/runs/20261004_final_v0417_400/results.md). Ordner mit früherem Namen v0412 wurden während Claudes Versionspflege erzeugt; die dortigen 40/400-Manifeste nennen korrekt den tatsächlich vorliegenden v0.4.13. Namen und historische Ergebnisse bleiben unverändert. Der final_v0412-Kontextbericht bindet Regeln/Daten, deren Hashes auch beim abschließenden Stand gelten; er enthält keinen falschen App-Versionswert.

## Auswertung und Browserbelege

T33: `--out` ist Pflicht; reguläre Runs ausschließlich unter `eval/runs`, ausdrücklich gewählte Baselines unter `eval/baselines`. Frisches Ziel wird exklusiv angelegt. Fehlende/ungültige Goldfelder, doppelte IDs und Kollisionen werden abgewiesen. Manifest nennt Titel, Modus, bekannte Reparaturen, UTC-Zeit, App-Version, Test-/Gold-/Regel-/Modell-/Klassifikator-/Wörterbuch-/Runnerhashes und Metrikdefinitionen. Originalberichte weiter read-only. **13 Vertragschecks plus sieben CLI/Erhaltungschecks** bestanden; [Nachweis](../../eval/versioning_t33/verification.json).

Browserberichte liegen jetzt in neuen `eval/browser_runs`-Ordnern mit allen 15 App-Dateihashes; alte Berichte/Exports bleiben erhalten. Der Hub bezeichnet einen Bericht nur als aktuell, wenn vollständige Vorher-/Nachher-Dateihashes passen und alle Checks erfolgreich sind. Ein alter 31er-Bericht ersetzt den neuen Stand nicht.

Zusätzlicher Test prüft alle drei Tabs über fünf Breiten, zwei Sprachen, hell/dunkel: **60 Layoutkombinationen**, keine physische Geräteprüfung. Er fand reale Überläufe bei 320/360 px sowie Swahili 390 px. Codex-CSS-Reparatur: Suchfeld darf schrumpfen, Grid-Spalten erlauben schmale Inhalte; Zähler und Namen bleiben lesbar. Ein weiterer Fund: Eine ungültige, manuell eingegebene Dauer wurde bereits aus dem Export ausgeschlossen, aber im Lückenhinweis als erledigt markiert. Jetzt bestimmt dieselbe Ganzzahlprüfung auch den Lückenstatus.

Keyboard-Auswahl, Quelle mit Emoji, Literal-Markup, Sprachwechsel, manuelle Dauer und fehlende Storage-/SW-Funktionen wurden tatsächlich im Browser geprüft. Fehlerläufe bleiben dokumentiert: erster Exporttest verwendete den falschen Feldnamen; erster Desktop-Sprachwechsel zielte auf einen versteckten Knopf. Die Testfehler wurden korrigiert; sie sind keine Produktfehlerbehauptung.

## Neue nutzbare Bausteine

- [Sprachreview-Paket](../../eval/gold_review/README.md): 120 eindeutige Notizen, 117 außerhalb der T31/T37-Falltexte, je 40 EN/SW/mixed. 30 Grundfamilien mit Kontextvarianten; nicht 120 unabhängige Beobachtungen. Keine Modellvorhersagen; zwei getrennte blinde Reviewerdateien, fokaler KI-Entwurf ausdrücklich kein Gold.
- [Lokaler Übergabeadapter](../../integrations/local_mock/README.md): strukturelle Quellen-/Reviewprüfung, UTF-16-Spannen, Gruppen, Dauer, Alter, Dubletten und frische Ausgabe; 16 Verträge bestanden. Reiner Mock, keine reale CHT/FHIR-/eCHIS-Verbindung.
- [Bedienprobe](../06_pilot/README.md): Moderator, sechs fiktive Fälle, leeres Messprotokoll, getrennte Review-/Gesamtzeit und vorab zu bestätigende Entscheidungen. Keine Durchführung oder Zeitersparnis gemessen.
- [Gerätearchitektur](mobile_architecture_codex.md): Browserdemo und MLX-Labor, localhost/HTTPS, Cache-Eviction und reale Telefonprüfungen; aktuelle Google-Doku weist MediaPipe LLM Inference als maintenance-only aus.
- [Challenge-Abgleich](../02_research/challenge_recheck_20261004/README.md): Pflichten der PDFs, Originalhashes, vollständige Extraktion und visuelle Kontrolle der Regeln. Publizieren/Einreichen bleibt eine separate tatsächliche Handlung.

## Grenze und Priorität

Keine allgemeine Grammatik, Kikuyu, klinische Freigabe, authentifizierte Personen oder belastbare Telefon-/Energie-/RAM-/Nutzenmessung. Mehr Datenzeilen oder Trainingsupdates ersetzen keinen qualifizierten Review. LLM bleibt außerhalb der Demo; bestehender Klassifikator ist auf den bekannten Notizen zuverlässiger. Jetzt bringt reale Handy-/Empfänger-/Sprachprüfung mehr als weitere unkontrollierte Modellvarianten. Experimentpakete sind vorbereitet, mit frischen Ausgaben und vorher festzulegenden Kriterien.


## Abschließende Demo-Belege v0.4.17

[39/39 Browserchecks](../../eval/browser_runs/20261004_final_v0417/browser_report.json), [29/29 Tiefenprüfpunkte](../../eval/deep_runs/20261004_final_v0417/report.json), [alle statischen App-Dateien](../../eval/asset_runs/20261004_v0417/assets.json) und [75,56-Sekunden-Aufnahme](../05_pitch/assets/codex_v0417/README.md) stimmen mit allen 15 App-Dateien überein. 449.075 Byte statische Dateien, 128.169 Byte Summe einzeln gzip-komprimierter Dateien; keine HTTP-/RAM-Messung. Die neue Aufnahme hat keine Tonspur und ist ein Desktop-Chrome-Ablauf.

Neu gespeichert: 13 Aufgabenpakete T43–T55 und [priorisierte Übergabe](next_session_prompts.md). T47 startet einen vorab geplanten 1.500-Update-Lauf mit gleicher Base, gleicher Datenrepräsentation und gleicher 48er-Dev-Auswahl; Ergebnis erst nach tatsächlichem Abschluss/Scoring. Keine Modellanbindung aus bloßem Trainingsfortschritt ableiten.
