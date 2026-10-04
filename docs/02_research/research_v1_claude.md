> **Aktualisierung ChatGPT / Codex, 04.10.2026:** Historischer Research, keine aktuelle Bauanweisung. Die frühere Ampel/Dringlichkeit, Schwangerschaftsausweitung, 390-KB-Zahl und Kikuyu-Nachtrainingszusage gelten nicht. Original-Toolautor des eingefügten Researchtexts bleibt ungeklärt; diese Kopie wurde zuvor Claude zugeordnet. Aktuelle überprüfte Aussagen: [Claude-Dateireview](../03_plan/codex_claude_review.md), [Plan](../03_plan/plan.md).

> **Hinweis:** Erster Research Stand vom 3. Okt, 21:45. Einige Zahlen und Aussagen sind überholt. Korrekturen stehen in `codex_feasibility_review.md` und `codex_review_response.md` im selben Ordner. Für Pitch und README gilt `README.md` im Hauptordner.

# AfyaNote Research und Ideen (Challenge 4, Health)

Stand: Sa 3. Okt 2026, 21:45

## 1. Aufgabe nochmal geprüft (Health Annex A)
• Ziel laut Brief: einen sinnvollen Teil von Noors Zugang zur Grundversorgung verbessern oder die Fähigkeit einer Frontline Fachkraft, sie zu versorgen. Beispiele: Screening Unterstützung, Dokumentation, Überweisung, Nachsorge, Kontinuität.
• Harte Grenze: keine medizinischen Bilder, keine Diagnose Datensätze.
• Pflicht im Health Teil: sagen, wo Daten liegen, wer sie lesen kann, was bei verlorenem oder geteiltem Handy passiert.
• Risiken laut Brief: Bias aus Daten reicher Länder, Patientendaten über Mobilfunk, ein selbstsicher falsches Ergebnis ist schlimmer als keins.
• Vorbedingungen laut Brief: Konnektivität, digitale Kompetenz, Vertrauen der Kliniker, Regulierung (IFC TechEmerge Kenia).
• Allgemeine Regeln: vorhandenes Gerät, offline, kleine Modelldateien, eine Interaktion in lokaler Sprache (benennen, Frage zu schwächer unterstützter Sprache erwarten), Mensch entscheidet, keine Halluzinationen.
• Bewertung: 25 % End to end, 20 % Relevanz, 15 % Daten (inkl. was nicht abgedeckt ist), 15 % Beleg, 15 % Klarheit und warum KI, 10 % Übertragbarkeit, Pass/Fail Verantwortung.

## 2. Gefundene Fakten
| Thema | Fakt | Quelle |
|---|---|---|
| Gesundheitshelfer und Geräte | 100.000 Community Health Promoters, Kits mit Smartphones und Basis Screening Ausrüstung, je 100 Haushalte (Rede 25.9.2023) | president.go.ke |
| eCHIS | ca. 106.000 CHWs nutzen eCHIS auf Smartphones, landesweit seit Okt 2023, basiert auf Medic CHT | exemplars.health |
| CHT offline | „designed to be Offline First and work with only an occasional internet connection“ | docs.communityhealthtoolkit.org |
| Ärzte | 2,6 Ärzte pro 10.000 Einwohner (2023), WHO Richtwert 10; Pflege 22,3 | WHO Kenya Health Profile 2025 |
| Sterblichkeit | Unter 5: 41,1 pro 1.000 (2021); Müttersterblichkeit 355 pro 100.000 (2019) | WHO Kenya Health Profile 2025 |
| Personal fehlt | über 29 % des Personals abwesend; 58 % stellen 4 von 5 häufigen Krankheiten richtig fest | World Bank SDI Kenia 2013 |
| Dokumentationslast | Aufzeichnen frisst ca. ein Drittel der Konsultationszeit, 34 Register pro Einrichtung, ca. 9 h Monatsberichte pro Person (Ghana, Tansania, Nigeria, Mosambik, Kambodscha; nicht Kenia) | Siyam et al. 2021, BMC Health Services Research |
| Entfernung | 25,8 % der Frauen nennen Entfernung als Problem, Kitui 55 %, Nairobi 9 % (DHS 2014) | DHS Program |
| Gender Gap | Subsahara Afrika 29 % Gender Gap bei mobilem Internet; Einstiegs Smartphone kostet 24 % des Monatseinkommens einer Frau | GSMA Mobile Gender Gap 2025 |
| Überweisungsformular | MOH 100 Community Referral Form: Datum, Patient, Geschlecht, Alter, Community Unit, Link Facility, Hauptproblem, Behandlung, Kommentar, CHV Name, Rückmeldung der Klinik | MOH 100 Formular |
| Gefahrenzeichen Kind | WHO IMCI, 2 Monate bis 5 Jahre: kann nicht trinken oder stillen, erbricht alles, Krämpfe, schläfrig oder bewusstlos | WHO IMCI Booklet |
| Gefahrenzeichen Schwangerschaft | Blutung, Krämpfe, starke Kopfschmerzen mit verschwommenem Sehen, Fieber und zu schwach zum Aufstehen, starke Bauchschmerzen, schnelle oder schwere Atmung | WHO PCPNC (NCBI NBK304178) |
| Datenschutz Recht | Kenia Digital Health Act 2023, Data Protection Act 2019 (Gesundheitsdaten sensibel) | Kenya Law |
| MASSIVE | Swahili Kenia enthalten, CC BY 4.0, ca. 16.500 Sätze, aber keine Gesundheits Intents | Hugging Face |

## 3. Vergleichbare Lösungen und Abgrenzung
| Lösung | Was sie tut | Lücke für uns |
|---|---|---|
| eCHIS / Medic CHT | Offline Formulare für Helfer, Sync später | Kein Freitext Verständnis, Helfer klickt Formulare |
| Jacaranda PROMPTS | SMS Plattform für Mütter, KI sortiert Dringlichkeit, über 1 Mio Mütter, Englisch und Swahili, u.a. Murang'a | Läuft in der Cloud; lokale Sprachen wie Kikuyu fehlen laut Artikel |
| Penda Health AI Consult (OpenAI) | LLM Copilot für Kliniker, Ampel Alerts, 16 % weniger Diagnosefehler, 13 % weniger Behandlungsfehler (39.849 Besuche, Nairobi, 2025) | Braucht Internet und große Modelle, nur Klinik, nicht Gemeinde |
| Mwana, mTrac | SMS Routing und Datensammlung | Versteht keinen Freitext |

Unsere Lücke: Freitext Verständnis offline auf dem Helfer Handy, mit fester Ausgabe und Übergabe in das bestehende MOH 100 Formular.

## 4. Brainstorming Health Ideen
| Idee | Warum KI | Offline/klein | Pass/Fail Risiko | Solo Aufwand | Urteil |
|---|---|---|---|---|---|
| A. AfyaNote: Notiz zu MOH 100 plus Gefahrenzeichen | Freitext, gemischte Sprache | Ja, 390 KB | Niedrig (feste Liste, Mensch bestätigt) | ca. 9 h | Empfehlung |
| B. Schwangerschafts Nachsorge Planer für Helfer | Termine sind Regeln, KI kaum nötig | Ja | Niedrig | ca. 6 h | Schwach beim warum KI |
| C. Medikamenten Engpass Prognose für Dispensary | Zeitreihen Prognose | Ja | Niedrig | ca. 9 h | Echte Verbrauchsdaten fehlen |
| D. Offline Leitlinien Suche für Klinikpersonal | Semantische Suche statt Stichwort | Modell ca. 25 MB | Mittel | ca. 10 h | Spannend, aber größer und PDF Aufbereitung |
| E. Klinik Register per Sprache füllen | Sprache zu Text | Sprachmodell zu groß | Mittel | 12 h plus | Zu riskant |
| F. Rückmeldung Klinik an Gemeinde (MOH 100 Teil B) übersetzen | Übersetzung | Übersetzungsmodell groß | Mittel | 10 h | Später als Erweiterung |
| G. Symptom Chat direkt für Noor per SMS | Freitext | Nicht offline auf Basishandy | Hoch | 10 h | Bricht Regeln |

## 5. Schärfung der Empfehlung
• Region: Murang'a County, Kaffeegebiet, Swahili plus Kikuyu, PROMPTS aktiv. Passt zu Noor.
• Ausgabe: vorausgefülltes MOH 100 (Hauptproblem, Gefahrenzeichen, Alter, Dauer) auf Englisch für die Klinik, Oberfläche auf Swahili für die Helferin. Kein generierter Text, nur Felder und feste Sätze.
• Ampel wie AI Consult: Rot = WHO Gefahrenzeichen, heute überweisen; Gelb = nicht sicher, Pflegekraft fragen; Grün = dokumentiert.
• Zielgruppen: Kinder unter 5 und Schwangere.
• Optional: MASSIVE Swahili Sätze als „nicht gesundheitsbezogen“ Beispiele, damit das Modell bei fremdem Text Gelb zeigt.
• Antwort zu Kikuyu: Laut PROMPTS fehlen lokale Sprachen schon heute. Unser Modell lernt aus Buchstabenfolgen und lässt sich mit 200 bis 300 Sätzen von Helferinnen nachtrainieren. Bis dahin Gelb.

## 6. Problem Satz (Entwurf)
Because of this tool, community health promoters in Murang'a will turn a Swahili visit note into a complete MOH 100 referral with WHO danger signs flagged during the household visit, instead of filling the form later by hand and often incompletely; we know because Kenya has 2.6 doctors per 10,000 people (WHO 2025), over 29 % of providers were absent during the Service Delivery Indicators survey (World Bank 2013), and recording takes about a third of consultation time in comparable countries (Siyam et al. 2021).

## 7. Machbarkeit
• Modell: Prototyp getestet, Python und JS identisch, ca. 390 KB.
• Daten: MASSIVE hat keine Gesundheits Intents, Training daher komplett synthetisch (gekennzeichnet).
• Offline am iPhone: über Service Worker auf Vercel, früh testen.
• Zahlen zur Dokumentationslast stammen nicht aus Kenia, offen sagen.
• Zeit: unverändert ca. 11 h Arbeit, Plan bleibt gültig.

## Quellen
• https://president.go.ke/wp-content/uploads/AT-THE-FLAGGING-OFF-OF-COMMUNITY-HEALTH-PROMOTERS-KITS.pdf
• https://www.exemplars.health/stories/kenyas-echis
• https://docs.communityhealthtoolkit.org/why-the-cht/
• https://www.afro.who.int/sites/default/files/2025-03/WHO%20Kenya%20Health%20Profile%202025.pdf
• https://www.worldbank.org/en/news/press-release/2013/07/12/new-service-delivery-data-raising-quality-education-health-services-critical-kenya
• https://doaj.org/article/c2cc3fc95dbd4451898e0f54e57f4c52
• https://dhsprogram.com/pubs/pdf/AB2/FA110.pdf
• https://www.gsma.com/newsroom/press-release/progress-closing-the-mobile-internet-gender-gap-stalls-in-lmics-gsma-mobile-gender-gap-report-2025
• https://tciurbanhealth.org/wp-content/uploads/2018/04/Community-Referral-form-MOH-100.pdf
• https://platform.who.int/docs/default-source/mca-documents/policy-documents/operational-guidance/EGY-CH-59-01-OPERATIONALGUIDANCE-eng-IMCI-Assessment-Booklet-2m-5yrs.pdf
• https://www.ncbi.nlm.nih.gov/books/NBK304178/
• https://new.kenyalaw.org/akn/ke/act/2023/15/eng@2023-11-24
• https://openai.com/index/ai-clinical-copilot-penda-health
• https://www.standardmedia.co.ke/health/health-science/article/2001515393/how-ai-is-transforming-maternal-healthcare-in-muranga-county
• https://huggingface.co/datasets/AmazonScience/massive
