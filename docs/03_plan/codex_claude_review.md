# Claude-Dateien geprüft und verbessert · 04.10.2026

**Review und neue Arbeit: ChatGPT / Codex.** Die tragfähige Grunddemo, das unveränderte Klassifikatormodell und viele Bedienfunktionen stammen von Claude. Die bearbeiteten aktiven Dateien sind gemeinsame Arbeit; ursprüngliche Fassungen, Researchkopien, frühere Worklogs, Modellgewichte und Medien bleiben erhalten. Dieser Review folgt Peters Auftrag und bewertet Inhalte anhand von Code/Nachweisen, nicht anhand des erzeugenden Tools.

## Mein Urteil

Die Richtung ist für den Hackathon überzeugend: ein begrenzter Extraktionsschritt mit sichtbaren Belegen, echter Wörterbuchbaseline und Human Review passt zu Small AI. Die größte Schwäche lag in der **Distanz zwischen gutem technischen Prototyp und zu weit gehenden Textbehauptungen**. Ein kleiner Dateidownload beweist kein funktionierendes 2-GB-Telefon; ein Originalzitat beweist keine richtige Interpretation; synthetischer Recall beweist weder Spracheignung noch Zeitersparnis.

Ich würde diese Demo mit ihren konkreten Grenzen zeigen. Für einen Pilot wäre die wichtigste nächste Investition Sprach-/Fachreview und ein bestätigter eCHIS-Arbeitsablauf, bevor weitere Modellgrößen, Sprachen oder Funktionen hinzukommen.

## Wesentliche Befunde und Änderungen

| Priorität | Befund | Verbesserung / offener Schritt |
|---|---|---|
| P1 | LLM-Guard versprach exakte Zitate, normalisierte aber Großschreibung, Leerzeichen, Satzzeichen und Anführungszeichen | Echte Originalteilzeichenfolge, Typ-/Schlüssel-/Längenprüfung, Fundstellen, mehrdeutige Belege gekennzeichnet |
| P1 | Guard ließ zusätzliche Textfelder, fehlende Pflichtfelder und einige ungültige Dauern zu; erster Duplikateintrag gewann | Schema-Vertrag wirklich geprüft; alle Duplikate desselben Terms verworfen; unsicherer Dauerwert entfernt/benannt |
| P1 | Hybridfunktion verlor beide Belegtexte, LLM-only hatte bereits stated-Status | Beide Zitate und Aussagen erhalten; LLM-only/Abweichung conflict + unclear; bestehende Unklarheit bleibt |
| P1 | LLM-Auswertung ignorierte unbekannte IDs, zählte doppelte Antworten und bewertete nur vorhandene Zeilen | Voller Goldnenner, Missing/Failures, harte ID-/Set-/Hashprüfung; neue Reports und Kollisionsschutz |
| P1 | Ollama-Datei wurde bei Wiederholung überschrieben; keine Capture-Provenienz; localhost wurde als Datenschutzgarantie gelesen | Neue Runordner, Digests und Hashes, Loopback/keine Proxy-/Redirectpfade, lokale Modellprüfung; Clouddeaktivierung separat nötig |
| P1 | Alte SFT-Devdaten überschneiden sich mit Training | 42 identische Notizen, 79 von 300 Devzeilen. Unverändert erhalten und Audit gespeichert; T38 vor Fine-Tuning-Qualitätsclaim |
| P1 | Selbstreview/Plan beschrieb frühere Personenpolitik und keine offenen Fehler | v0.4.11, konservative Auswahlpflicht und Negationsbereichsfehler ausdrücklich dokumentiert; T37 angelegt |
| P1 | Pitch versprach Handyfunktion/2 GB, „no data leaves phone“, teils alte Paketgröße und fertige Clips | Gerätegrenze offen, App-Upload von bewusster Übergabe getrennt, gehashte aktuelle Zahlen, Medienherkunft explizit |
| P2 | Einführungsdatum eCHIS mit nationaler Abdeckung verwechselt; Integration/Freitextlücke vorausgesetzt | Primärquellen erneut geprüft; vorhandene Versorgung zuerst untersuchen, CHT-Version/Einbettungsstelle als Voraussetzung |
| P2 | Aufgaben zu Video/Telefon/Sprache behandelten Zwischenstände als Ergebnis | Messprotokoll, Version, fachlicher Review und tatsächlicher Upload sind getrennte Abschlusskriterien |
| P2 | Alte Video-/Techzähler, unbelegte Biografie und harte Videolänge | Aktuelle Zahlen, neutrale Teamvorlage, World-Bank-Bereich 2–5 Min; neue Folienbilder mit Manifest |

Ein exaktes vorhandenes Zitat wie „Mother has cough“ kann weiterhin als `fever` falsch zugeordnet werden. Das wird bewusst getestet und bleibt **keine** vom Guard gelöste Semantikfrage. Das optionale LLM-Modul wurde nicht in die App integriert.

## Dateiprüfung: wo die Verbesserungen liegen

| Aktive Datei / Gruppe | Behandlung |
|---|---|
| docs/03_plan/plan.md | Nutzenhypothese, aktueller Scope, Nachweisgrenzen, tatsächliche Abhängigkeiten und Reihenfolge |
| self_review.md | Alter Selbstreview erhalten, aktuelle belegte Checks und offene Fehler klar getrennt |
| lokales_llm.md | Geräte-/Speicherannahmen korrigiert; Kandidaten als Experiment; Guardgrenze und SFT-Overlap |
| threat_model.md | RAM-/Export-/QR-/OS-/Host-Grenzen, falsche Zuordnung und Verlustkonsequenzen konkretisiert |
| pilot_und_skalierung.md | CHT/eCHIS/HIE und World-Bank-Kontext überprüft; gestufter Bedarf/Sandbox/Pilot mit Abbruchentscheidungen |
| docs/01_challenge/challenge_brief.md | Originalpfade und ungesichertes Gewinndatum korrigiert; Quellen-/Arbeitsanweisung getrennt |
| docs/02_research/research_v1_claude.md | Historischer Körper erhalten; alte Ampel/Schwangerschaft/Kikuyu-Aussagen klar außer Kraft für aktuellen Bauplan |
| codex_review_response.md, bewertung_fremdarbeit.md | Historische Claude-Urteile erhalten, aktueller Versions-/Beitrags-/Wirksamkeitszusatz davor |
| docs/05_pitch/slides.md und slides.html | Aktuelle, begrenzte Aussagen; vier neue visuell geprüfte PNGs in separatem Ordner |
| submission_texts.md | Wiederverwendbarer Abgabetext, ehrliche Evidenz, sichtbare Linkplatzhalter |
| video_scripts.md und video_schnittplan.md | Belegbare Erzählung, Version, Telefon vs Desktop, aktuelle technische Zähler, Teamdaten nicht erfunden |
| docs/04_tasks/T05, T08, T12, T29 | Geprüfte, konkrete Nachweisanforderungen und aktuelle Ordner-/Befehlswege |
| llm/guard.mjs, eval_llm.mjs, run_ollama.py, README.md | Implementierte Reparaturen und ausführbare neue Anleitung |
| .github/workflows/check.yml | Zusätzliche Guard/Scorer/CLI/Mock-Verträge, Selbsttest im temporären Ordner; keine historischen Reports überschreiben |
| llm/schema.json, prompt.txt, fewshot.json, export_sft.py, sft/ | Vertrag/Generator und vorhandene Outputs geprüft; unverändert erhalten. SFT-Splitkorrektur separat T38 |
| Claude-Worklog und frühere Research-/Archivkopien | Referenzgeschichte erhalten; keine nachträgliche Umschreibung |

23 aktive Originaldateien vor Änderung gesichert: [Snapshot mit Quellhashes](../../../90_Archiv/03_Claude_Review_20261004/manifest.json). Der SFT-Audit bedeutet keine neue Datenautorschaft. TRAIN/model/classify bleiben Claudes Grundlage; ursprüngliche Beitragsetiketten werden nicht pauschal ersetzt.

## Was tatsächlich geprüft wurde

* **Guard 13/31 → 31/31:** dieselbe vor dem Fix gespeicherte Testdatei, passende Testquellhashes; Baseline nur Importpfad angepasst. [Reports](../../llm/review_codex/README.md).
* **13/13 Scorer-, 8/8 echte CLI-, 11/11 Fake-Server-Verträge:** 63 neue Vertragschecks insgesamt inklusive Guard. Fehler/Teilmenge/Kollision/Dataset-/Rawhash werden geprüft. Keine Netzwerkverbindung zu einem externen Modell.
* **Aktuelle Klassifikatorreferenz:** 58/63 Begriffe, 58/58 passende Status, 1 zusätzlicher Term und 35/40 exakte Notizen; adversarial 0 Begriffe. Neu getrennte [Auswertung](../../llm/review_codex/current_reference_report/results.md). Keine neue klinische oder LLM-Leistungsbewertung.
* **SFT-Overlap:** Audit liest die beiden vorhandenen Dateien und hält Hashes/Mengen fest; kein Training oder Regenerieren.
* **Folien:** vier PNGs, 1920×1080, Chrome 154, kein Abschneiden der geprüften Elemente, alle vier visuell gesichtet. [Material](../05_pitch/assets/codex_review_v0411/README.md).
* **App:** keine Appdatei geändert; v0.4.11 und bestehende gehashte 31-Browsercheck-Evidenz gelten weiter. Der Check wurde in diesem Review nicht neu als Telefonprüfung ausgegeben.

Die GitHub-Workflowänderung wurde lokal in ihren geänderten Prüfschritten ausgeführt, nicht als gelaufener GitHub-Job. Frühere axe/e2e-Aussagen im Claude-Worklog bleiben Aussagen zum damaligen Stand; keine neue aktuelle Accessibilityfreigabe.

## Realistische Weiterarbeit

1. **T05/T08:** Zieltelefon und qualifizierte Sprache/Fachlichkeit. KI-Vorprüfung spart Strukturarbeit, ersetzt diese Personen nicht.
2. **T33:** Versionierte Standard-/40er-Evaluation. Die neue LLM-Auswertung behebt ihre eigene Baselineproblematik, nicht den noch offenen independent.mjs-Runner.
3. **T37:** Verneinungsbereich pro Begriff, eingefrorene neue Fälle, Status-/Personenregression. Den bekannten Fehler nicht wegkommunizieren.
4. **T38:** Getrennte SFT-Vorlagen/Notizen und Sprachreview, bevor ein feinjustiertes Modell als Verbesserung gilt.
5. **T35/T36:** Zielintegration und Nettoablaufvergleich. Fremde Personen, Verneinung und Zeit im Übergabeformat erhalten; Empfänger muss bestätigen, dass der Entwurf nutzbar ist.

Alle Aufgaben stehen als eigene MD-Prompts im [BACKLOG](../../BACKLOG.md) und im aktualisierten Projekt-Hub. Bereits als erledigt markierte historische Medienaufgaben beweisen kein fertiges aktuelles Video.

## Quellen und Grenzen dieses Reviews

[Claimregister](../02_research/codex_claims_20261004.md) enthält Primärquellen, Datum, Korrektur und Abrufgrenzen. World-Bank-/Kickoff-PDFs wurden für Abgabeformat und Termine gegen die Kurzfassung gelesen. World-Bank-/MoH-Programme zeigen Relevanz, keine Partnerschaft. Die jüngste MoH-Seite war im Suchindex lesbar, direkter Abruf lief in Timeout; AI-Repository-Hauptseite nicht direkt abrufbar. Konkurrenz-/Use-Case-Analyse ist daher keine Vollständigkeitsbehauptung.

Das ursprünglich erwähnte Plan-HTML in Downloads bleibt wegen macOS-Dateizugriff außerhalb dieses Inhaltsreviews; die vorhandenen aktiven Claude-Dateien konnten bearbeitet werden. Nicht jede historische Researchzahl wurde erneut validiert. Ungeprüfte Zahlen werden deshalb nicht in aktuelle Pitchtexte übernommen.
