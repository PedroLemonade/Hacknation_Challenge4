# 00 INDEX · Was liegt wo

**Hauptdatei:** `START_HIER.html` (im Browser öffnen: Zeitplan, alle Aufgaben mit Kopier Buttons, Status aus BACKLOG.md).
**Für Agenten (Claude Code, Codex, ChatGPT):** zuerst `AGENTS.md` (= `CLAUDE.md` = `PROJECT.md`), dann `BACKLOG.md`. Nur die Dateien lesen, die für die Aufgabe nötig sind.

## Hauptordner
| Datei | Wofür |
|---|---|
| START_HIER.html | Arbeits Hub für Peter, wird aus BACKLOG.md und docs/04_tasks erzeugt (`python3 tools/build_hub.py`) |
| BACKLOG.md | Status aller Aufgaben, wird nach jeder Aufgabe aktualisiert |
| AGENTS.md, CLAUDE.md, PROJECT.md | Regeln für KI Agenten (identisch) |
| README.md | Englische Projektbeschreibung für Jury und GitHub |
| vercel.json | Deploy Einstellung (Ausgabeordner app) |
| ../START_HIER.html, ../00_LIES_MICH.md | Gesamter gemeinsamer Ordner: aktuelle Inhalte, Research, Originale, Archiv und durchsuchbarer Dateikatalog |
| docs/00_organisation/ordner_und_dateiregeln.md | Wohin neue Dateien gehören, welche Kopien bewusst erhalten bleiben |
| docs/00_organisation/herkunft_beitragsuebersicht.md, ../00_HERKUNFT_CLAUDE_CHATGPT.md | Claude- und ChatGPT/Codex-Beiträge, gemeinsame Dateien, Originalinputs und Regeln zur Herkunftspflege |

## app/ · die fertige Demo (wird deployed)
| Datei | Wofür |
|---|---|
| index.html | Oberfläche und Styles |
| app.js | Ablauf (Notiz, Prüfen, Ergänzen, Übergabe), Karte, Export |
| rules.js | Textstellen, Verneinung, andere Person, Vergangenheit, Dauer, Alter, Widerspruch |
| classify.js | Modell im Browser (ohne Bibliotheken) |
| model.json | Trainiertes Modell, 249 KB |
| facilities.json | Demo Einrichtungen (fiktiv) |
| i18n.js | Texte Englisch und Swahili |
| sw.js, manifest.webmanifest, icon* | Offline Cache und App Installation |
| build_info.json | Kennzahlen für „About“, wird von eval/eval.mjs erzeugt |

## training/ und data/ · Modell bauen
| Datei | Wofür |
|---|---|
| training/lexicon.py | Alle synthetischen Formulierungen (train, heldout, verneint) |
| training/generate_data.py | Erzeugt data/*.csv und data/notes_test.jsonl |
| training/train.py | Trainiert und exportiert app/model.json |
| data/ | Generierte Daten, alle synthetisch |
| data/README.md | Verwendung der sechs Datenbestände; Training/Entwicklung/Tests nicht vermischen |

## eval/ · Belege
| Datei | Wofür |
|---|---|
| results.md | **Wichtigster Beleg:** Modell vs. Stichwortliste, Kontrasttests, Grenzen |
| parity.mjs | Python und Browser rechnen gleich |
| eval.mjs | Erzeugt results.md und app/build_info.json |
| independent.mjs | Historischer Second-author-Runner; bekannte Regression, versionierter Lauf T33 offen |
| e2e.py | Browser Test inkl. Offline Neustart |
| independent_notes.jsonl, independent_results.md | 40 Notizen von Codex als zweitem Autor und das Ergebnis (Recall 0,92 vs. 0,73) |
| independent_report_notes.md | Grenzen der neuen Auswertung, bekannte Altersreparatur und eingefrorene Notizdatei |
| demo-regression.cjs, demo_regression_results.json | Browserchecks für Fallwechsel, Export, Fokus, Offline-Verlust und Paket-Reparatur; enthält Hashes des getesteten Stands |
| demo_asset_manifest.json | Rohgrößen und Hashes der lokalen App-Dateien; kein RAM-/HTTP-Benchmark |
| context_t31/ | 52 eingefrorene Kontextfälle, Vorher-Regeln und neue 40er-/400er-Regressionsberichte; frühere Raw-Ergebnisse bleiben erhalten |
| demo_artifacts/ | Fiktive JSON-, MD- und PDF-Entwürfe sowie Screenshots aus den Tests |
| README.md | Bedeutung der Prüfdateien, historische Fehlerbelege und eingefrorene Berichte |

## llm/ · Optionales kleines LLM (nicht in der App)
| Datei | Wofür |
|---|---|
| README.md | Überblick (Englisch) |
| guard.mjs | Struktureller Guard: feste Form und wörtliche Zitate; keine semantische Sicherheitsgarantie |
| run_ollama.py, eval_llm.mjs | Messung eines lokalen Modells auf dem Mac (Task T29) und Auswertung |
| export_sft.py, sft/ | Reparierter Generator schreibt neue Runordner; ursprüngliche Claude-Daten mit dokumentiertem Overlap erhalten |
| sft_runs/ | Neue 3.000/300 Familiensplits, Reviewpaket und abgeleitete Passage-ID-Repräsentation |
| training_codex/ | Lokales Training, gespeicherte Adapterprüfung, Quellenbindung und neue Vertragstests |
| training_runs/ | Echte QLoRA-Adapter, Rohantworten, Fehlversuche und Vergleiche; kein App-Modell |
| base_models/, local_runtime/ | Offizielles Qwen-Basismodell und isolierte MLX-Umgebung mit Drittanbieter-Lizenzen |
| docs/03_plan/codex_llm_training_review.md | Aktueller Trainingsstand, gemessene Probleme, nächste Aufgaben und Herkunft |

## docs/ · Arbeitsunterlagen (Deutsch)
| Ordner | Inhalt |
|---|---|
| 01_challenge/challenge_brief.md | Regeln, Abgabe, Bewertung der Challenge in Kurzform |
| 02_research/ | Erster Research, Codex Review, Antwort darauf, Bewertung der Codex/ChatGPT Arbeit |
| model_card.md | Modellkarte (Englisch, für Jury) |
| 03_plan/threat_model.md | Bedrohungsmodell |
| 03_plan/pilot_und_skalierung.md | Einbettung (CHT, FHIR, DHA), Pilotfragen, Nutzenrechnung |
| 03_plan/plan.md | Umfang, Entscheidungen, Zeitplan |
| 03_plan/ui_reference_notes.md | Was aus Peters Trainern für die Oberfläche übernommen wurde |
| 04_tasks/T*.md | Ein Aufgabenpaket pro Datei mit Prompt und „Fertig wenn“ |
| 04_tasks/inputs/ | Fertige Eingaben für Aufgaben (z.B. Swahili Check) |
| 03_plan/self_review.md | Selbst Review: Daten, XSS, Offline, Export Sperre |
| 03_plan/codex_demo_review.md | Zweiter Review mit reparierten Fehlern, Nachweisen und verbleibenden Grenzen |
| 03_plan/codex_demo_worklog.md | Koordination und geprüfte Version der gemeinsamen Demo |
| 03_plan/codex_context_review.md, codex_context_worklog.md | T31-Kontextpolitik v0.4.11, belegte Reparatur, zusätzliche Prüfarbeit und Herkunft der neuen Änderungen |
| 05_pitch/demo_rehearsal_codex.md | Ablauf für drei Minuten mit belegbaren Aussagen und offenen Nachweisen |
| 04_tasks/T31–T36 | Neue kopierbare Aufträge für Kontextregeln, Aufnahmen, Benchmark-Versionierung, Goldreview, Integration und Pilot |
| 05_pitch/ | Video Skripte, Schnittplan, Folien (slides.html), Abgabetexte |
| 05_pitch/assets/ | Fertige Folien PNG und Demo Clips MP4 für das Video |
| 05_pitch/assets/codex_v0410/ | Historische 75-Sekunden-Aufnahme ohne Stimme, 8 saubere Screenshots, fiktiver MD-Export, Capture-/Medienmanifest |
| screenshots/ | Bilder für README und GitHub |

## tools/
| Datei | Wofür |
|---|---|
| build_hub.py, hub_template.html | Erzeugen START_HIER.html |
| make_media.py | Erzeugt Folien Bilder, Demo Clips und Screenshots |
| record_demo_codex.cjs | Nimmt den echten Ablauf im lokalen Browser auf; verweigert Überschreiben alter Aufnahmeordner |
| build_demo_manifest.py | Erzeugt Rohgrößen/Hashes und prüft, ob die App zum Browserbericht passt |
| build_workspace_catalog.py, workspace_portal_template.html | Erzeugen Hauptübersicht und Dateikatalog eine Ebene über dem Projekt; verändern keine App-/Dateninhalte |

## Claude-Dateireview am 04.10.2026

[Review und Änderungen](docs/03_plan/codex_claude_review.md), [Quellen-/Claimregister](docs/02_research/codex_claims_20261004.md), [LLM-Prüfberichte](llm/review_codex/README.md), [aktuelle Folienbilder](docs/05_pitch/assets/codex_review_v0411/README.md). T37/T38 sind inzwischen mit getrennten Nachweisen abgeschlossen; neue Anschlussaufträge bis T55 stehen im BACKLOG. Historische Originalfassungen vor Änderung: ../90_Archiv/03_Claude_Review_20261004/.


## Aktuelle Weiterarbeit 04.10.2026

- [Fortsetzungsreview](docs/03_plan/codex_continuation_review.md): T33/T37, aktuelle 39 + 29 Browserprüfungen, konkrete Grenzen.
- [Nächste Sitzung](docs/03_plan/next_session_prompts.md): priorisierte kopierbare Prompts, vorhandene Abschlüsse und laufenden T47 zuerst erkennen.
- [Mobile Architektur](docs/03_plan/mobile_architecture_codex.md): App auf dem Telefon, Offlineursprung, Mac-LLM versus Telefonruntime.
- `eval/runs/`, `browser_runs/`, `deep_runs/`, `asset_runs/`: frische versionierte Belege; `versioning_t33/before/` und `context_t37/before/` sind Vorherkopien.
- [Aktuelle Aufnahme v0.4.17](docs/05_pitch/assets/codex_v0417/README.md), frühere Aufnahmen bleiben historisch erhalten.
- [Goldreview-Material](eval/gold_review/packet_20261004_v0416/README.md): 120 Notizen, 30 Familien, ungeprüft; kein Trainingsbestand.
- [Lokaler Integrationsmock](integrations/local_mock/README.md): 21 Verträge, keine Verbindung zu einem echten Versorgungssystem.
- [Bedienprobe-Material](docs/06_pilot/README.md): Moderator, sechs fiktive Fälle, leere Messvorlage.
- `llm/training_codex/plans/`: vorab definierter T47-Lauf; `llm/training_runs/`: tatsächliche Gewichte und Rohantworten.
