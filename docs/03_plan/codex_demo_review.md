# Demo-Review und umgesetzte Verbesserungen

Stand 04.10.2026, aktiver Projektordner `01_Working_Demo_AfyaNote`. ChatGPT/Codex-Beitrag auf der Claude-Grunddemo. Aktuell geprüfte App-Version: **v0.4.11**, einschließlich T31-Kontextreparatur. Die frühere v0.4.10-Fassung dieses Reviews ist unter `eval/context_t31/baseline/` erhalten; der aktuelle Browserbericht enthält die tatsächlich getesteten Dateihashes.

## Ergebnis

**31 Browserchecks bestanden.** Der Code blieb während des vollständigen letzten Laufs unverändert. Belege: [Prüfbericht](../../eval/demo_regression_results.json), [Dateimanifest](../../eval/demo_asset_manifest.json), [Testskript](../../eval/demo-regression.cjs), [Beispiel-JSON](../../eval/demo_artifacts/fictional-draft.json), [lesbarer MD-Entwurf](../../eval/demo_artifacts/fictional-draft.md), [PDF](../../eval/demo_artifacts/fictional-draft.pdf).

Chrome auf macOS, isolierte Browserkontexte, schmale Viewports und simulierter Netzausfall. Keine realen Patientendaten, kein physischer Smartphone-Test, keine WCAG-Konformitätsbehauptung und kein Muttersprachler-/Klinikerreview.

Die aktuelle App umfasst **440.004 Bytes** eindeutige statische Dateien einschließlich Service Worker, rund 430 KiB. Die Summe einzeln gzip-komprimierter Dateien beträgt 125.489 Bytes; das ist eine Dateischätzung und keine gemessene HTTP-Übertragung. Modell: 249.284 Bytes. Größen und Hashes sind im Dateimanifest abgelegt. Peak-RAM und tatsächliche Telefonleistung wurden nicht gemessen.

## Belegte Fehler und Korrekturen

| Befund | Bedeutung | Aktueller Nachweis |
|---|---|---|
| P1: Neue Notiz trug alte Fallnummer, Behandlung und Einwilligung weiter | Angaben konnten einem neuen Fall zugeordnet werden | `replaceNote` verwirft den Fallzustand bei geänderter Quelle. Regression mit alter Fallnummer/Behandlung und gesetzter Einwilligung bestanden |
| P1: Ungültiges manuelles Alter wurde im JSON als `null` mit Einheit ausgegeben | Eine ungültige Eingabe wirkte wie ein exportierter Alterswert | UI und Aktionshandler blockieren ungültige Zahlen. Manuelle Dezimalzahl 2.5 bleibt möglich |
| P2: Fokus ging nach Prüfklicks und beim QR-Dialog auf BODY | Tastaturbedienung verlor ihren Ort | Fokus erhalten; Dialog erhält und begrenzt Fokus; Escape stellt den Auslöser wieder her |
| P2: Download-/Clipboard-Fehler nicht verständlich; Kopiererfolg konnte trotz Fehlschlag angezeigt werden | Nutzer konnte sich auf eine nicht erfolgte Übergabe verlassen | Provozierte Blob- und Clipboard-Fehler zeigen eine Meldung. Kein falsches „Copied“ |
| P2: Fehlende Offline-Datei wurde erkannt, „erneut prüfen“ stellte sie aber nicht wieder her | Nach Cacheverlust musste die App neu installiert/aktualisiert werden | Explizite Reparatur lädt nur die feste App-Dateiliste neu. Modell und Icon aus Cache gelöscht; vollständige Reparatur bestanden |
| P2: Wiederholen-Knopf fehlte bei erst später erkannter Paketlücke | Aus dem Fehlerzustand gab es keinen sichtbaren Ausweg | Sichtbarkeit folgt dem tatsächlichen Paket-/Modellstatus, auch nach asynchroner Prüfung |
| P2: Service Worker konnte beliebige gleichnamige Origin-Caches löschen bzw. unbekannte Antworten zwischenspeichern | Andere lokale Apps bzw. künftige URLs waren unnötig betroffen | Cache an App-Version und Scope gebunden; nur bekannte Dateien werden gespeichert. Fremder Cache im Test erhalten |
| P2: RAM-Signal wurde als „fits this phone“ für ungetestete Sprachmodelle ausgelegt | Ein Referenzwert wirkte wie ein Kompatibilitätstest | Sprachmodelle ausdrücklich als auf diesem Gerät ungeprüft gekennzeichnet. Nur der hier laufende Klassifikator erhält den Hinweis „running in this browser“ |

Der ursprüngliche Browserbefund ist in [demo_baseline.json](../../eval/demo_baseline.json) dokumentiert. Die dazugehörige absichtlich ungültige Beispiel-Datei ist ein Fehlernachweis, kein Muster für die Abgabe.

## Praktische Demo-Ergänzungen

- Lesbarer `.md`-Download zusätzlich zu JSON und QR. Er enthält die Originalnotiz, alle Prüfschritte und wörtliche Belege; Backtick-Blöcke im Eingabetext können den Markdown-Codeblock nicht vorzeitig schließen.
- JSON-Schema-Bezeichner jetzt `afyanote.referral-draft/0.3`, zusätzlich `review_log` mit bestätigten/abgelehnten Vorschlägen, gewähltem Status und Originalspannen. Keine FHIR-/eCHIS-Konformität daraus ableiten.
- Druck/PDF ohne App-Steuerelemente. Die fiktive und nicht freigegebene Natur des Entwurfs bleibt auch im Ausdruck sichtbar.
- Neuer Fall aus mehreren Ansichten erreichbar. Rücknavigation führt zu einem leeren Fall; bfcache und Neuinitialisierung sind browserabhängig, eine forensische Löschung wird nicht behauptet.
- Beschädigtes Modell, fehlende Installationsdatei und überlange/leere Notiz haben explizite Fehlerzustände. Hintergrund-/Cache-Timeouts führen zu keiner verdeckten Cloud-Inferenz.

Die modernen UI-Bestandteile (Live-Vorschau, Lückenfragen, zweispaltiger Prüfbereich, Tastenkürzel, Sichtschutz) wurden von Claude ergänzt. Sie wurden beim aktuellen Test mitbenutzt; der ältere Codex-Prototyp im Archiv wird nicht weitergeführt.

Letzte [Aufnahme und Screenshots](../05_pitch/assets/codex_v0410/README.md): v0.4.10, 74,88 Sekunden, echte Bedienung im Browser, fiktive Swahili-Notiz, tatsächlich simuliertes Offline-Neuladen, Review, Export und Widerspruchsfall. Quellhashes blieben während der Aufnahme unverändert; die neue v0.4.11-Kontextpolitik ist darin nicht aufgenommen. Clip und Bilder bleiben im HTML-Hub erreichbar; Stimme und echter Telefon-Nachweis fehlen weiterhin.

## Grenzen der aktuellen Prüfungen

Der Test überwacht Anfragen aller getesteten Kontexte. Beobachtet wurden nur GET-Anfragen an den lokalen Ursprung, keine Notiz-Uploads oder externen Requests. Die App speichert keine Falldaten in localStorage, sessionStorage, IndexedDB oder Cookies; nur die Oberflächensprache ist lokal gespeichert. Heruntergeladene Dateien, Clipboard, Ausdrucke, Screenshots und QR-Kopien bleiben außerhalb des laufenden App-Speichers.

320/390 px wurden als Browserbreiten geprüft. Das belegt keine reale Android-/iOS-Installation, Leistungsfähigkeit, Betriebssystem-Neustart oder langfristige Cachehaltung. QR-Erzeugung wurde geprüft, Kamera-Decodierung mit beliebigen Apps auf realen Telefonen noch nicht. Ein Screenreader- und Nutzertest bleibt nötig.

Modellvalidierung prüft Struktur, unterstützte Labels, Dimensionen, endliche Gewichte und Schwellen. Sie beweist nicht automatisch die Echtheit einer veröffentlichten Modelldatei. Dateihashes im Manifest ermöglichen den Abgleich des konkret geprüften Standes.

## Second-author-Baseline und bekannte Kontextreparatur

40 separat formulierte synthetische Notizen, 63 Goldbegriffe. Suggested-only micro F1 0.933 gegenüber 0.844 für die Stichwortliste. Einschließlich unklarer Kandidaten Recall 58/63 gegenüber 46/63. Modellparameter und Schwellen unverändert. [Einordnung und Versionsgrenze](../../eval/independent_report_notes.md).

Die frühere Regel ordnete `Mtoto alipata degedege mbele ya mama leo.` fälschlich als `other_person` ein. T31 trennt nun den ausdrücklich genannten Kindbezug von der Mutter als Zeugin. Der neue bekannte 40er-Regressionslauf hat 58/58 beziehungsweise 46/46 passende Status bei unveränderter Begriffserkennung. Das ist eine bekannte Reparatur auf unreviewtem Gold, kein unabhängiger Modellgewinn. Ausgelassene Begriffe und ein zusätzlicher Vorschlag bleiben sichtbar.

52 vor dem Fix geschriebene Kontextfälle bestehen. Auf den 400 Generatornotizen sinkt die Modell-Statusübereinstimmung von 0,999 auf 0,945: 41 bisher dem Patienten zugerechnete Goldbefunde in 32 Notizen verlangen nach einem anderen Subjekt nun ausdrücklich eine Auswahl. Kein Goldlabel angepasst. [Kontextpolitik, jede Verschlechterung und Formatgrenzen](codex_context_review.md). Neue Personen-/Kontextregeln und Kontrastfälle stammen von ChatGPT/Codex auf Claude-Regelbasis.

Der Dezimalaltersfehler wurde nach seiner Offenlegung von Claude repariert: `2.5 years` wird nun unklar und muss manuell eingetragen werden. Dieser bekannte Fall ist nach der Reparatur ein Regressionstest; die Begriffsgütezahl enthält Alter ohnehin nicht.

## Quellencheck für die Gerätevergleichstafel

Google nennt für seine Gemma-3-1B-Variante 529 MB und empfiehlt mindestens 4 GB RAM für gute Performance. Die gezeigten Android-Messwerte stammen von einem Galaxy S24 Ultra. Das ist ein publiziertes Referenzsetup und keine Messung auf dem CHP-Telefon. [Google AI Edge, 12.03.2025](https://developers.googleblog.com/gemma-3-on-mobile-and-web-with-google-ai-edge/).

Google beschreibt Gemma 3 270M ausdrücklich für spezialisierte Aufgaben auf Geräten und zeigt einen Offline-Web-Anwendungsfall. Deshalb wäre die pauschale Aussage „ein lokales Sprachmodell geht auf einem Telefon nicht“ unbelegt. Der kleine Klassifikator bleibt für diesen Hackathon eine nachvollziehbare Architekturentscheidung; eine technische Unmöglichkeit anderer Varianten ist nicht nachgewiesen. [Google, Gemma 3 270M, 14.08.2025](https://developers.googleblog.com/introducing-gemma-3-270m/).

`navigator.deviceMemory` liefert ein grobes, gerundetes Signal zur physischen Speicherkapazität. Es misst weder freien Speicher noch GPU-/Runtime-Kompatibilität. **Schlussfolgerung:** Aus diesem Wert allein lässt sich kein „läuft/läuft nicht“-Urteil ableiten. [W3C Device Memory API](https://www.w3.org/TR/device-memory/), [MDN API-Dokumentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory).

## Übergabe

T31 abgeschlossen; nächster Codeauftrag T33: allgemeine Versionierung und neue Ausgaben für eingefrorene Auswertungen. Daneben: T05 physisches Telefon, T08 unabhängiger Swahili-Review und T12 finale Aufnahme. [Demo-Anleitung](../05_pitch/demo_rehearsal_codex.md). Vor Änderungen aktuellen Stand lesen und VERSION erhöhen.
