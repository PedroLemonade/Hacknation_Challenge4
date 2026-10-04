# BACKLOG · Stand aller Aufgaben

**Für Agenten:** Wenn Peter „mach weiter“ oder „was ist offen?“ schreibt: diese Tabelle lesen, die erste Zeile mit Status `offen` nehmen, deren „Wer“ zu dir passt (Claude Code, Codex, Claude Chat), die verlinkte Task Datei lesen und abarbeiten. Danach Status hier auf `erledigt` setzen, Datum/Uhrzeit und ein Satz Ergebnis in „Notiz“. Aufgaben mit „Wer = Peter“ nur ansagen, nicht selbst erledigen. Danach `python3 tools/build_hub.py` laufen lassen, damit START_HIER.html aktuell ist.

**Aktueller Claude-Dateireview:** Pitch-/Plan-/LLM-Dateien wurden am 04.10. durch ChatGPT/Codex verbessert. Frühere „Folien/Clips fertig“-Notizen beziehen sich auf damalige Bausteine. Folienrevision liegt in assets/codex_review_v0411. Eine neue Browseraufnahme v0.4.17 ist vorhanden; Stimme und echter Telefonbeleg bleiben offen. Claude ergänzte um 09:05 den tatsächlichen LLM-Vergleich (S04). [Review](docs/03_plan/codex_claude_review.md).

**Aktuelles LLM-Training:** Drei echte lokale QLoRA-Läufe und gehashte Adapter/Rohantworten durch ChatGPT/Codex; Claude-Datenbasis und Qwen-Basismodell klar getrennt. Kein Produktwechsel wegen semantischer Fehler. [Trainingsreview](docs/03_plan/codex_llm_training_review.md).

**Weiterarbeit 04.10.:** T33/T37 sowie das Material für T34/T35/T36 sind fertig. T34/T36 bezeichnen die Vorbereitung; qualifizierter Review und tatsächliche Bedienprobe bleiben T45/T08/T07. [Aktueller Review](docs/03_plan/codex_continuation_review.md), [priorisierte nächste Prompts](docs/03_plan/next_session_prompts.md). Die alten Uhrzeiten sind ursprüngliche Hackathon-Zeitfenster, keine automatisch aktualisierten Termine.

Status: `offen` · `erledigt` · `optional` · `wartet` (braucht erst etwas von Peter)

**„Wer“ bezeichnet die Zuständigkeit, nicht automatisch den Autor.** Herkunft der Prompts, Dateien und tatsächlichen Umsetzung: [Claude / ChatGPT: Beitragsübersicht](docs/00_organisation/herkunft_beitragsuebersicht.md). Die aktuelle Demo enthält gemeinsame Beiträge.

| ID | Aufgabe | Status | Wer | Zeitfenster | Datei | Notiz |
|---|---|---|---|---|---|---|
| T01 | Projektordner auf den Mac holen | erledigt | Claude Chat | | docs/04_tasks/T01_ordner_auf_den_mac.md | 4. Okt 00:50: liegt in Desktop/Challenge 4/01_Working_Demo_AfyaNote |
| T02 | Lokal starten und durchklicken | offen | Peter | 00:35 | docs/04_tasks/T02_lokal_starten.md | |
| T03 | GitHub Repo anlegen und pushen | offen | Peter / Claude Code | 00:45 | docs/04_tasks/T03_github.md | |
| T04 | Live schalten auf Vercel | offen | Peter | 00:55 | docs/04_tasks/T04_vercel.md | |
| T05 | Offline Test am Handy, gleich aufnehmen | offen | Peter | 01:05 | docs/04_tasks/T05_handy_offline_test.md | |
| T09 | Unabhängiges Testset (40 Notizen) | erledigt | Codex | 01:20 | docs/04_tasks/T09_codex_unabhaengiger_test.md | 4. Okt: 40 synthetische Notizen, Recall 58/63 vs. 46/63, Suggested-only F1 0,933 vs. 0,844; Grenzen in eval/independent_report_notes.md |
| T08 | Swahili gegenlesen | offen | ChatGPT + Peter | 01:20 | docs/04_tasks/T08_swahili_gegenlesen.md | Eingabe liegt in docs/04_tasks/inputs/ |
| T10 | Code und Sicherheits Review | erledigt | Codex | 01:50 | docs/04_tasks/T10_codex_review.md | 4. Okt: Fallwechsel, Exportprüfung, Alter, Dialogfokus und Offline-Reparatur korrigiert; Review in docs/03_plan/codex_demo_review.md. Bekannter Personenfehler anschließend in T31 repariert; begrenzte Kontextpolitik dokumentiert |
| T06 | Fixes nach Handy Test | wartet | Claude Code | 02:05 | docs/04_tasks/T06_fixes_nach_handy_test.md | nur wenn T05 Probleme zeigt |
| T16 | Mentor Slot buchen | offen | Peter | 07:30 | docs/04_tasks/T16_mentor.md | |
| T13 | Entscheidung Gefahrenzeichen Hinweis | offen | Peter | 07:40 | docs/04_tasks/T13_gefahrenzeichen_entscheidung.md | Empfehlung: behalten |
| T07 | Bedienprobe Zeit | offen | Peter | 07:50 | docs/04_tasks/T07_bedienprobe_zeit.md | |
| T11 | Folien prüfen | offen | Peter | 08:15 | docs/04_tasks/T11_folien.md | Folien fertig als PNG, nur prüfen (5 Min) |
| T12 | Videos aufnehmen und hochladen | offen | Peter | 08:30 | docs/04_tasks/T12_videos_aufnehmen.md | Clips und Schnittplan fertig, nur Stimme und Handy Clip |
| T14 | Abgabe auf beiden Plattformen | offen | Peter | 10:45 | docs/04_tasks/T14_abgabe.md | Texte fertig in docs/05_pitch/submission_texts.md |
| T15 | Schlusskontrolle gegen die Regeln | offen | Peter | 11:15 | docs/04_tasks/T15_schlusskontrolle.md | |
| T17 | LinkedIn Post | optional | Peter | 11:30 | docs/04_tasks/T17_linkedin.md | |
| T29 | Kleines LLM auf dem Mac messen (Ollama) | optional | Peter | wenn Zeit | docs/04_tasks/T29_llm_messen.md | 20 Min, Gemma 3 270M und 1B, Ergebnis in llm/results.md |
| T22 | Echte Einrichtungsdaten | optional | Codex | Puffer | docs/04_tasks/T22_echte_einrichtungsdaten.md | |
| T18 | Mehr Ablenkungssätze (MASSIVE) | optional | Codex | Puffer | docs/04_tasks/T18_optional_ablenkungssaetze.md | |
| T19 | Finalisten Pitch (nur falls ausgewählt) | optional | Peter | 10. Okt | docs/04_tasks/T19_finalisten_pitch.md | |
| T20 | Oberfläche v2 nach Trainer Mustern | erledigt | Claude Chat | | docs/04_tasks/T20_ui_v2.md | 4. Okt 00:30, Browser Test PASS |
| T21 | Offline Karte der Einrichtungen | erledigt | Claude Chat | | docs/04_tasks/T21_einrichtungen_karte.md | 4. Okt 00:30, Demo Daten |
| T23 | Regel: Subjekt weitertragen | erledigt | Claude Chat | | docs/04_tasks/T23_subjekt_regel.md | 4. Okt 00:30, Kontrasttests 33/33 |
| T24 | Video Bausteine, Folien, Screenshots | erledigt | Claude Chat | | docs/04_tasks/T24_video_bausteine.md | 4. Okt 00:45 |
| T25 | Erklärung, QR Übergabe, Vergleich im About Tab, Offline Anzeige | erledigt | Claude Chat | | docs/04_tasks/T25_erklaerung_qr_vergleich.md | 4. Okt 00:40, Browser Test PASS, QR dekodiert |
| T26 | Codex/ChatGPT Arbeit bewerten und einarbeiten | erledigt | Claude Chat | | docs/02_research/bewertung_fremdarbeit.md | Modellkarte, Bedrohungsmodell, Pilot Dokument, 4 Testfälle |
| S01 | Selbst Review App | erledigt | Claude Chat | | docs/03_plan/self_review.md | keine Funde offen |
| S02 | Barrierefreiheit, Swahili Lücken, CI, Vercel Pfad | erledigt | Claude Chat | | docs/03_plan/self_review.md | 4. Okt 01:15, axe 0 Verstöße, 161 Schlüssel je Sprache, check.yml, Vercel Ausgabeordner in README und T04 korrigiert (app statt web) |
| T27 | Demo v0.4: Live Vorschau, „Ask before you leave“, Notiz Markierung, Tastatur Prüfung, Desktop zweispaltig, Sichtschutz im Hintergrund | erledigt | Claude Chat | | docs/03_plan/ui_reference_notes.md | 4. Okt 01:35, Browser Test PASS, axe 0, Muster aus MDM Trainer |
| T28 | Lokales LLM bewerten (Modellwahl, RAM, Einbau) plus About Tafel | erledigt | Claude Chat | | docs/03_plan/lokales_llm.md | 4. Okt 01:50, Empfehlung: kein LLM auf dem Handy für die Abgabe; LLM als Lehrer; später Gemma 3 270M als optionaler Extraktor |
| T30 | LLM Werkzeugkasten: Schema, Guard, Ollama Messung, Auswertung, Feinjustier Daten | erledigt | Claude Chat | | llm/README.md | 4. Okt 02:10, Selbsttest PASS: Klassifikator reproduziert 0,921, erfundene Zitate werden alle verworfen |
| S03 | Aufgaben und Video auf Stand bringen | erledigt | Claude Chat | | docs/05_pitch/video_scripts.md | 4. Okt 02:25, T02 Pfad korrigiert (app statt web), Video Skript von 784 auf 523 Wörter (3:20 bis 3:45), Schnittplan neu getaktet |
| S04 | Gemessenen LLM Vergleich in Pitch und App einbauen | erledigt | Claude Chat | | docs/03_plan/lokales_llm.md | 4. Okt 09:05, v0.4.13: README Tabelle, Folie 4, Video Skript, Abgabetext, About Tab; .gitignore schließt llm/base_models und llm/local_runtime aus (Push 42 MB) |
| M01 | Claude v0.4.3 und Codex Fehlerbehebungen in app/ zusammenführen | erledigt | Claude Chat | | docs/03_plan/claude_demo_worklog.md | 4. Okt 01:45, v0.4.4, zwei Konflikte gelöst, e2e PASS, axe 0 |
| K01 | Synthetische Daten, Modell, Parität, Auswertung | erledigt | Claude Chat | | eval/results.md | F1 0,85 vs 0,50 unbekannte Formulierungen |
| K02 | Web App v1, Offline Cache, README, Video Skripte | erledigt | Claude Chat | | README.md | |
| T31 | Personen- und Kontextregeln gezielt reparieren | erledigt | Codex | | docs/04_tasks/T31_personen_kontext_regeln.md | 4. Okt: v0.4.11, 52/52 Kontextfälle, 31/31 Browserchecks; Zeugenfall repariert. Auf 400 Generatornotizen Statusübereinstimmung 0,999 → 0,945 durch Auswahlpflicht; Details in docs/03_plan/codex_context_review.md |
| T32 | Aktuelle Demoaufnahme und Nachweise | erledigt | Codex | | docs/04_tasks/T32_demoaufnahme_nachweise.md | 4. Okt: v0.4.10 27/27 Browserchecks; 74,88 s MP4 ohne Ton, 8 Screenshots, Capture-/Medienmanifest in docs/05_pitch/assets/codex_v0410/ |
| T33 | Eingefrorene Auswertung und reproduzierbare Regression trennen | erledigt | Codex | nach T32 | docs/04_tasks/T33_benchmark_versionierung.md | 04.10.: fresh-only Runner, vollständige Manifeste; 13 Vertragschecks und 7 Versions-/Erhaltungsprüfungen. Historische 40er-Berichte bytegleich; neue v0.4.17-Runs in eval/runs/ |
| T34 | Neues Goldset und externen Sprachreview vorbereiten | erledigt | Codex | nach T31 | docs/04_tasks/T34_goldset_review.md | 04.10.: 120 blinde Reviewnotizen (40 EN/40 SW/40 mixed), 30 Familien, 117 außerhalb alter Kontextfälle; Freeze/Anleitung. Kein menschlicher Review und kein Goldrelease |
| T35 | Übergabeformat und Integrationsadapter konkretisieren | erledigt | Codex | nach Hackathon | docs/04_tasks/T35_integrationsadapter.md | 04.10.: rein lokaler Mock für Schema 0.3, 21 Vertragschecks; exakte UTF-16-Belege/Audit/Consent. CHT/FHIR-Referenzen geprüft, echter Partnervertrag offen |
| T36 | Bedienprobe und Pilotentscheidung vorbereiten | erledigt | Codex | nach Hackathon | docs/04_tasks/T36_pilot_bedienprobe.md | 04.10.: Moderatorleitfaden, sechs fiktive Fälle, leere Messvorlage und vorab formulierte Entscheidungsregeln; keine tatsächliche Bedienprobe |
| O01 | Gemeinsamen Ordner ordnen und Inhalte einordnen | erledigt | Codex | | docs/00_organisation/ordner_und_dateiregeln.md | 4. Okt: Archivpakete gebündelt, Original-Chatinput gesichert, Wegweiser und Dateisuche, Erhaltungsprüfung aller 396 vorherigen Dateien; ursprüngliches Plan-HTML wegen macOS-Zugriff noch in Downloads |
| O02 | Claude- und ChatGPT/Codex-Beiträge sichtbar kennzeichnen | erledigt | Codex | | docs/00_organisation/herkunft_beitragsuebersicht.md | 4. Okt: Beitragsübersicht, Dateikatalog mit Herkunft/Grundlage und Versions-Hashes, Herkunftsfilter; gemeinsame Dateien, Drittquellen und ungeklärte Originalinputs ausdrücklich ausgewiesen |
| T37 | Verneinungsbereich pro Begriff reparieren | erledigt | Codex | nach T33 | docs/04_tasks/T37_negationsbereich.md | 04.10.: begrenzter Term-Negationsbereich; 54/56 Policy, 53/56 Modell, 49/56 Wörterbuch; 52/52 T31, 61 Verträge, 39 Browserchecks. Zwei fragliche KI-Erwartungen erhalten; native Prüfung offen |
| T38 | SFT-Split und Annotation vor Fine-Tuning reparieren | erledigt | Codex | | docs/04_tasks/T38_sft_split_review.md | 4. Okt: neue 3.000/300 eindeutige Notizen, 0 Notiz-/Familienüberlapp, 6.346 geprüfte Items, vollständige bytegleiche Reproduktion; Singleton-Ausnahmen, semantische Ausschlüsse und 195 Reviewfälle; Originale erhalten |
| O03 | Claude-Dateien prüfen und konkret verbessern | erledigt | Codex | | docs/03_plan/codex_claude_review.md | 4. Okt: 23 aktive Dateien, Quellen-/Pitch-/Planreview, LLM-Guard/Scorer/Capture repariert, 63 Vertragschecks und vier neue Folienbilder; gemeinsame Herkunft dokumentiert |
| T39 | Lokales LLM wirklich trainieren und vergleichen | erledigt | Codex | | docs/04_tasks/T39_llm_trainingsversuch.md | 4. Okt: echte Quote-Runs 400+400 gesichert, neuer 600-Update-Passage-ID-Adapter; gespeicherte Gewichte auf vollständigen 40 Regressionen geprüft, 54/63 Begriffe, 13 Extras; keine App-Anbindung |
| T40 | LLM-Annotation fachlich prüfen und Unsicherheit ausdrücken | wartet | Peter + Codex | vor Freigabe | docs/04_tasks/T40_llm_annotation_abstention.md | 195 Reviewfälle vorbereitet; qualifizierte SW/EN-Annotatoren und Adjudikation fehlen |
| T41 | Unabhängiger LLM-Vergleich und reale Geräteentscheidung | optional | Codex + Peter | nach T40 | docs/04_tasks/T41_llm_vergleich_geraete.md | Neues Testset einfrieren; fünf alte 400er-Notizen im SFT-Training; Gemma-Zugang und reale Telefonmessung offen |
| T42 | Passage-ID-LLM statt freier Zitatformulierung messen | erledigt | Codex | | docs/04_tasks/T42_llm_passagen_auswahl.md | 4. Okt: Quellenbindung implementiert, 600 Updates, 76/116 Begriffe auf 48 Devnotizen, 10/48 inkl. Dauer/Quelle, 28 Extras; semantische Qualität unzureichend, T40/T41 offen |
| T43 | Aktuelle Demoaufnahme und vollständige Quellnachweise | erledigt | Codex | P1 | docs/04_tasks/T43_demoaufnahme_v0417.md | 04.10.: neue Aufnahme v0.4.17, vollständiger Quellnachweis; Ton und echter Telefonclip offen |
| T44 | Demo vertieft prüfen und mobilen Betriebsweg erklären | erledigt | Codex | P1 | docs/04_tasks/T44_demo_tiefentest_architektur.md | 04.10.: 29/29, 60 Layoutkonstellationen; Grid-/Suchfeldüberlauf und Dauer-Lückenanzeige repariert |
| T45 | Menschliche Reviews importieren und adjudiziertes Gold freigeben | wartet | Peter + Codex | P0 für Qualitätsclaim | docs/04_tasks/T45_review_import_adjudikation.md | Material bereit; qualifizierte menschliche Rückläufe fehlen |
| T46 | Modalität, kombinierte Zeit und Dauer als neue Kontextfälle prüfen | optional | Codex | P2 | docs/04_tasks/T46_kontext_restfaelle.md | Nicht ausgeführt; T37-Restfehler und zweifelhafte KI-Erwartungen dokumentiert |
| T47 | Small-LLM mit einer kontrollierten nominalen Epoche messen | offen | Codex | P2 Experiment | docs/04_tasks/T47_llm_kontrollierte_epoche.md | 04.10.: separat gestartet; Status aus Plan/Log/Manifest prüfen, keinen zweiten Prozess starten |
| T48 | LLM-Fehler in Format, Quellenwahl und Semantik zerlegen | optional | Codex | P2 | docs/04_tasks/T48_llm_ablations_eval.md | Noch nicht durchgeführt |
| T49 | Small-LLM auf einem echten Zieltelefon als Laufzeit-Spike prüfen | optional | Peter + Codex | P2 nach Hackathon | docs/04_tasks/T49_handy_llm_runtime.md | Reale Geräte und kompatible Laufzeit fehlen |
| T50 | Geprüftes lokales Demo-Paket ohne Trainingsgewichte vorbereiten | offen | Codex | P1 vor Übergabe | docs/04_tasks/T50_lokales_releasepaket.md | Lokale Erstellung geplant; Upload/Repo/Deploy bleiben bei Peter |
| T51 | Realen Formular- und Empfängervertrag klären | wartet | Peter + Codex | P0 vor Integration | docs/04_tasks/T51_partner_schnittstellenvertrag.md | Partnervertrag und reales Zielformular fehlen |
| T52 | Pitch und Abgabe auf den abschließenden Quellstand abstimmen | optional | Codex + Peter | P1 vor Abgabe | docs/04_tasks/T52_pitch_aktueller_nachweis.md | Aktualisierte Belege vorhanden; Stimme, echte Telefonaufnahme und Abgabe offen |
| T53 | QR-Übergabe mit echten Kameras und Kapazitätsgrenzen prüfen | optional | Peter + Codex | P2 | docs/04_tasks/T53_qr_kamera_interop.md | Bisher Browserprüfung; reales Kamera-Decoding offen |
| T54 | Service-Worker-Update während offener Notiz prüfen | optional | Codex | P2 | docs/04_tasks/T54_cache_update_konflikte.md | Offline-Reload geprüft; echtes Versionswechsel-Szenario noch offen |
| T55 | Große Artefakte und Aufbewahrung nachvollziehbar ordnen | optional | Codex | P3 | docs/04_tasks/T55_artefakt_retention.md | Hauptstruktur geordnet; keine weitere Bewegung während Training nötig |
