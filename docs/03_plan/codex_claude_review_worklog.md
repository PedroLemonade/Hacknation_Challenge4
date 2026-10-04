# Claude-Dateireview · ChatGPT / Codex · 04.10.2026

Peter hat ausdrücklich Prüfung und Verbesserung der Claude-Dateien beauftragt. Reserviert: die 23 in der [Sicherung](../../../90_Archiv/03_Claude_Review_20261004/manifest.json) aufgeführten aktiven Dateien, neue Review-/Testdokumente sowie Hub/Herkunft/BACKLOG für den eigenen Review-Eintrag. Keine App-/Modell-/Trainingsdatenänderung vorgesehen. Historische Worklogs werden nicht umgeschrieben.

**Status: abgeschlossen, Reservierung freigegeben.** Die App bleibt v0.4.11; physischer Telefon-/Sprach-/Fachreview bleibt offen.

## Änderungen

23 aktive Claude-Grunddateien verbessert: Plan, Selbstreview, Pilot, Bedrohungsmodell, LLM-Entscheidung, Challenge-Kurzfassung, historische Researchzusätze, Pitch/Abgabetexte, Folienquellen und Aufgaben T05/T08/T12/T29. Historische Researchkörper und Claude-Worklog erhalten. Downloads-HTML weiterhin nicht als geprüft behauptet.

llm/guard.mjs, eval_llm.mjs und run_ollama.py auf Claude-Basis repariert, README/CI ergänzt. Neue Tests, eigene Referenz- und Auditberichte, Quellenregister, Review und Aufgaben T37/T38 durch Codex. Kein App-Einbau, LLM-Download oder Modelllauf. Bestehende SFT-Daten/Generator erhalten; Overlap 42 Notizen und 79/300 Devzeilen dokumentiert.

Vier 1080p-Folien aus korrigiertem Claude-Deck gerendert, alle visuell geprüft, neues Manifest/Medienverzeichnis. Alte Bilder/Clips nicht überschrieben. README/INDEX, Hubs, Hauptwegweiser und Herkunft integriert; zwei alte PDF-Links im aktiven Codex-Feasibilityreview repariert. Nur eigene neue BACKLOG-Zeile O03; andere historische Erledigt-Zeilen nicht nachträglich als eigene Leistung ausgegeben.

## Verifikation und Erhaltung

Guard 13/31 → 31/31 mit unveränderter vor dem Fix gespeicherter Testdatei. Scorer 13/13, CLI 8/8, Fake-Server 11/11: zusammen **63 Vertragschecks**. Vollständige neue Klassifikator-/Adversarialreferenz auf endgültigem Scorer, passende Quellhashes. Kein klinischer/LMM-Gütemesswert daraus.

31 gespeicherte App-Browserchecks passen weiter zu den Apphashes. 89 Vorherdateien abgeglichen: **88 bytegleich**, ausschließlich der Medien-README erhielt einen vorgesehenen Wegweiserzusatz. Seine Vorherfassung aus dem unveränderten Originalpräfix gesichert und gegen den **vor dem Review erfassten Hash** verifiziert: [Zusatzmanifest](../../../90_Archiv/03_Claude_Review_20261004/additional_guide_manifest.json). Keine App-/Modell-/Trainings-/Gold-/alten Medienbytes geändert; alle 23 reservierten Originalsicherungen bytegleich.

Aktive MD-Verweise geprüft. Workflow-YAML mit vorhandenem Ruby-Parser gelesen; geänderte Python-/JavaScript-Dateien syntaktisch geprüft. Python hatte kein YAML-Modul: vorhandenen Parser genutzt, nichts installiert. CI-Prüfschritte lokal getestet; kein GitHub-Job, Commit, Push oder Deployment behauptet.

Hub: **47 Aufgaben, 31 Dokumente**, neue Prompts und Review, geöffnete Details bei 390/320 px ohne Überlauf. Root bei 390 px geprüft, ältere Aufnahme bezeichnet, keine Skriptfehler. [Guide-Browsernachweis](../../llm/review_codex/hub_browser_checks.json) wird aus dem Katalog ausgeschlossen, damit der Quellhash nicht in den eigenen Katalog zurückwirkt; bleibt direkt zugänglich. Kein App-/Telefon-Test daraus.

Herkunftsregeln gezielt ergänzt: Kopien behalten frühere Urheberschaft, bearbeitete Claude-Dateien gemeinsam, neue Prüfprogramme/Reviews Codex, Folieninhalt gemeinsam mit Render durch Codex. Abschließender --refresh-origin-Lauf dokumentiert aktuelle Dateiversionen; historischer Ordnungsnachweis bleibt erhalten, kein --audit-organisation.

## Übergabe

[Review](codex_claude_review.md), [Claimcheck](../02_research/codex_claims_20261004.md), [LLM-Prüfdateien](../../llm/review_codex/README.md), [Erhaltung/Links](../../llm/review_codex/preservation_and_links.json). Nächste offene Codex-Aufgabe T33, T37 danach, T38 vor Fine-Tuning. Peter-Aufgaben zu Telefon, qualifizierter Sprache, Videos und tatsächlicher Abgabe bleiben offen.
