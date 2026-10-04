> **Aktualisierung ChatGPT / Codex, 04.10.2026:** Historische Bewertung des früheren 6-Begriffe-Prototyps, kein Vergleich aktueller Claude- und Codex-Beiträge. „In jedem Punkt weiter“ ist Claudes damaliges Urteil, keine gemessene Rangfolge. Die aktive 10-Begriffe-Demo enthält inzwischen wesentliche gemeinsame Änderungen, zusätzliche Fehlerprüfungen und Kontextreparaturen. Auch „explores whether“ bleibt bei ungemessener Feldwirkung sinnvoll. [Beitragsübersicht](../00_organisation/herkunft_beitragsuebersicht.md), [aktuelle Prüfung](../03_plan/codex_claude_review.md).

# Bewertung der Arbeit von Codex / ChatGPT im Ordner „Challenge 4“

Stand 4. Okt, 00:45. Geprüft von Claude. Alles Originalmaterial bleibt erhalten (Ordner `90_Archiv` und `02_Research_und_Planung/von_Codex_ChatGPT`).

## Kurzfazit
Codex hat parallel einen **eigenen kleineren Prototyp** gebaut (6 Begriffe, 202 Trainingsfälle, 57 KB Modell, Hashing statt fester Wortliste, keine Regeln für Verneinung oder Person, Desktop Test). Die Demo in `01_Working_Demo_AfyaNote` ist in jedem Punkt weiter (10 Begriffe, 5.000 Passagen, Regeln, Karte, QR Übergabe, Erklärung, 33 Kontrasttests, Offline Neustart getestet). **Die Codex Demo wird nicht weitergeführt.** Wertvoll sind seine kritische Haltung, mehrere Fachdokumente und vier Testfälle, die übernommen wurden.

## Einzelbewertung
| Datei / Ordner | Herkunft | Urteil | Was übernommen wurde |
|---|---|---|---|
| AfyaNote_Feasibility_Review_und_ueberarbeiteter_Plan.md | Codex | **übernommen** | Fast alle Kritikpunkte umgesetzt, siehe `codex_review_response.md` |
| WorldBank_SmallAI_Hackathon_Plan_und_Brainstorming.md | Codex/ChatGPT, früher Stand | teilweise | Ideenliste (FieldRelay, CareLedger, ReferralReady …) bestätigt unsere Richtung; ReferralReady ≈ AfyaNote. Rest Hintergrund |
| AfyaNote_Weiterentwicklung_und_Aufgaben.md | Codex | teilweise | Gates und „kein Produktivitätsslogan ohne Messung“ übernommen; 40 Tasks sind überwiegend Post Hackathon |
| afyanote/prototype/ (eigene App, Modell 57 KB) | Codex | **nicht weiterführen** | Idee „drei Modi im Vergleich“ steckt jetzt im About Tab (Modell vs. Stichwortliste live) |
| afyanote/docs/Bedrohungsmodell.md | Codex | **übernommen, angepasst** | `docs/03_plan/threat_model.md` |
| afyanote/docs/Interview_und_Pilotpaket.md, Kosten_und_Nutzen.md | Codex | **übernommen, gekürzt** | `docs/03_plan/pilot_und_skalierung.md` |
| afyanote/docs/Research_Nachpruefung.md, Quellen_und_Claims.md | Codex | **teilweise** | Neue Quellen: CHT UI Extensions, CHT FHIR, DHA HIE, DHA Zertifizierung → README Roadmap und Pilot Dokument. MoH Link April 2025 konnte ich weiterhin nicht öffnen |
| afyanote/docs/Modellkarte.md, Datenkarte.md | Codex, für dessen Modell | Format übernommen | Eigene Modellkarte für unser Modell: `docs/model_card.md` |
| afyanote/docs/Evaluationsprotokoll.md | Codex | Hinweis übernommen | Reihenfolge A/B/C im Zeittest, Teamtests nicht als CHP Tests ausgeben → T07 |
| afyanote/docs/Geraete_und_Offline_Test.md | Codex | deckungsgleich | Unser T05 Protokoll deckt das ab |
| afyanote/docs/Sprachreview_und_Annotation.md | Codex | deckungsgleich | Unser T08 plus Eingabedatei |
| afyanote/docs/Pitch_und_Demo.md, Produktvertrag_und_ADRs.md | Codex | Haltung übernommen | Grenzen stehen in AGENTS.md und README; „explores whether“ nicht nötig, weil wir gemessene synthetische Ergebnisse haben |
| afyanote/docs/Umsetzungsnachweis.md (Fehlerfälle) | Codex | **übernommen** | 4 Fälle als Kontrasttests mit Quelle „codex“ in `eval/eval.mjs`, alle bestanden |
| afyanote/tasks/T01–T40, index.html, START_HIER.md | Codex | archiviert | Unser Backlog ist maßgeblich. Post Hackathon Ideen (CHT Sandbox, DHA Mapping, Kosten) stehen in `pilot_und_skalierung.md` |
| afyanote/schema/draft.schema.json | Codex, für dessen Format | archiviert | Passt nicht zu unserem Export Format |
| afyanote/collaboration/* , scripts/* , tests/* , reports/* | Codex | archiviert | Gilt für den Codex Prototyp |
| README.md, AGENTS.md, CLAUDE.md (alt, Projektwurzel) | Codex | **ersetzt** | Zeigten auf den Codex Ordner; neue Fassungen zeigen auf die Working Demo. Alte liegen im Archiv |
| Code 00.30 | Claude, älterer Stand 00:30 | archiviert | Ersetzt durch `01_Working_Demo_AfyaNote` |
| exports/, AfyaNote_Arbeitsmaterial_und_Prototyp.zip | Codex | archiviert | Pakete des Codex Stands |

## Was ich ausdrücklich nicht übernommen habe
* Die Aussage, das 390 KB Modell sei „unbestätigt“: Codex hatte die Dateien nicht. Größe, Parität und Tests liegen jetzt im Repo.
* Die Empfehlung, Gefahrenzeichen ganz wegzulassen: bewusst als neutraler Prüfhinweis behalten (Entscheidung T13 bei Peter).
* Zusätzliche Abhängigkeiten oder einen zweiten Prototyp: kostet Zeit ohne Mehrwert für die Abgabe.
