# Demo-Arbeit · Codex · 04.10.2026

Nutzerauftrag: „keep working, especially on the demo“. Maßgeblicher Stand ist `01_Working_Demo_AfyaNote`, der ältere Codex-Prototyp im Archiv ist nur Referenz.

In Bearbeitung: T09 (40 separat formulierte synthetische Notizen), anschließend konkrete Demo-Regressionen und Fehlerzustände. Modell und Trainingsdaten werden nicht an das neue Testset angepasst. Die Rollen-/Prüfregeln werden ebenfalls nicht an dessen Fälle angepasst. Unabhängig davon werden Zustandswechsel, Offline-Paket und Exporte geprüft und bei belegten Fehlern repariert.

Betroffene Bereiche: `eval/`, `app/app.js`, `app/sw.js`, `app/i18n.js`, gegebenenfalls `app/index.html`, eigene Dokumentation und Statuszeilen. Bitte währenddessen diese Dateien nicht parallel bearbeiten. Änderungen werden anhand des jeweils aktuellen Dateistands vorgenommen.

Separat formuliert ist keine unabhängige klinische oder sprachliche Validierung: Autor ist ein KI-Assistent, kein Swahili-Muttersprachler oder Kliniker.

## Zwischenstand nach 26 Browserchecks

25 Checks bestanden; einzig die explizite Reparatur eines gelöschten Offline-Modellbestands schlägt fehl. Der getestete Stand v0.4.4 blieb während des Laufs unverändert. Inzwischen hat Claude auf v0.4.7 aktualisiert und die dezimale Altersregel separat repariert. Die ursprünglichen Second-Author-Kennzahlen bleiben als Baseline erhalten; eine Auswertung nach einer bekannten Reparatur ist ein Regressionstest.

Codex bearbeitet jetzt ausschließlich die Paket-Reparatur (`checkOffline`, `retryResources`, zugehöriger Service-Worker-Handler) sowie die unbelegte „fits this phone“-Aussage und Kennzeichnung des Ausdrucks. Bitte diese kleinen Bereiche bis zur abschließenden Rückmeldung nicht parallel ändern. Der restliche Demo-Aufbau bleibt auf Claudes aktuellem Stand.

## Abschlussprüfung und Aufnahme

v0.4.9 bestand 27 Browserchecks. Anschließend hat Claude die Kopfzeilenbreite in `index.html` verbessert und auf v0.4.10 erhöht; dieser neue Dateihash liegt außerhalb des gespeicherten vorherigen Tests. Deshalb wird der tatsächlich gemeinsame Stand jetzt erneut geprüft. Bis zum Ergebnis bitte `app/` unverändert lassen. Danach entsteht eine kurze aktuelle Aufnahme in `docs/05_pitch/assets/codex_v0410/`.

T09 ist abgeschlossen: 40 separat formulierte Notizen, unveränderte Modellparameter und Schwellen, Suggested-only F1 0,933 gegenüber 0,844. Die Altersregel wurde nach Offenlegung eines Fehlers von Claude geändert; das ist eine bekannte Regression und kein unabhängiger Modellgewinn. Die Einordnung steht in `eval/independent_report_notes.md`.

## Fertig · geprüfter gemeinsamer Stand freigegeben

**v0.4.10 bestanden: 27/27 Browserchecks**, Chrome 154.0.8037.97, letzter gespeicherter Lauf `2026-10-04T00:14:32.205Z`. `source_before` und `source_after` stimmen überein und entsprechen den aktuellen App-Dateien. Fehlende Cache-Dateien werden erkannt und beim expliziten Wiederladen vollständig hergestellt. Die korrigierte Kopfzeile von Claude ist im Test enthalten.

**T32 abgeschlossen:** Aufnahme mit fiktiver Swahili-Notiz, tatsächlich simuliertem Netzverlust und Offline-Neuladen, Einzelprüfung, simuliertem Consent, lokalem MD-/QR-Export und ungelöstem Widerspruch. 74,88 Sekunden MP4 ohne Ton, acht Viewport-Screenshots, exakte Ereigniszeitmarken und Quellhashes vor/nach Aufnahme unter `docs/05_pitch/assets/codex_v0410/`. Videoanfang/-mitte/-ende, Desktop-Prüfansicht und aktueller PDF-Entwurf visuell geprüft. Keine Browserausnahmen oder externen Requests beobachtet.

**Dateipaket:** 435.735 Bytes eindeutige statische Dateien einschließlich Service Worker; einzelner Gzip-Dateisummenwert 124.086 Bytes. Keine RAM-/HTTP-/Telefonmessung. `tools/build_demo_manifest.py` erzeugt das Größenmanifest ohne App-Änderungen.

T09, T10 und T32 erledigt. T31 Personenbezug und T33 Auswertungs-Versionierung sind als konkrete nächste Codeaufträge angelegt; T34–T36 als optionale spätere Pakete. Reale Telefon-/Sprach-/Bedienprüfung und finale Stimme/Einreichung bleiben bei den bestehenden zuständigen Aufgaben.

**Koordination:** Codex bearbeitet in dieser Runde keine App-Dateien mehr. Die Reservierung ist aufgehoben. Vor weiteren Änderungen aktuelle Dateien und Hashes lesen; nach einer Änderung den zugehörigen Bericht nicht als aktuelle Prüfung ausgeben. Kein Commit, Push oder Deployment erfolgt.

Zusätzliche Hub-Kontrolle bestanden: eingebettete MP4 lokal geladen (74,88 s), sechs neue Aufgaben samt existierenden MD-Dateien und Kopierbuttons vorhanden, 390-px-Ansicht ohne horizontalen Überlauf und keine Browserausnahmen. `START_HIER.html` wurde mit 42 Statuszeilen und 20 eingebetteten Dokumenten neu erzeugt.

## Fortsetzung T31 · v0.4.11

ChatGPT/Codex hat die begrenzte Personen-/Kontextreparatur auf der Claude-Regelbasis abgeschlossen. 52 vor dem Fix gespeicherte Kontextfälle und 31 Browserchecks bestanden. Modell, Trainingsdaten und ursprüngliches 40er-Gold unverändert; bekannte Zeugenregel repariert. Bei den 400 Generatornotizen sinkt die Statusübereinstimmung durch zusätzliche Auswahlpflicht; jede Änderung und verbleibende Verneinungsgrenze sind offengelegt. Details und Freigabe: `codex_context_worklog.md`, `codex_context_review.md`, `eval/context_t31/`.

Alte v0.4.10-Aufnahme bleibt erhalten und ist vor dem neuen Regelstand. Neue Desktopansichten mit Manifest in `eval/context_t31/ui/`. Herkunftskennzeichnung aktualisiert; rules.js nun Claude + ChatGPT/Codex. T31 erledigt, T33 bleibt offen. Keine App-Reservierung mehr aktiv, kein Commit/Push/Deployment.
