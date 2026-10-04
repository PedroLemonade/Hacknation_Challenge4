# Demo-Probe mit belastbaren Aussagen

Aktive App: `app/`, lokal unter `http://localhost:8000/`. Die browsergestützten Nachweise liegen in `eval/demo_regression_results.json` und `eval/demo_artifacts/`. Ein enger Desktop-Viewport ist kein reales Smartphone.

**Letzte Aufnahme v0.4.10:** [74,88 Sekunden MP4](assets/codex_v0410/demo_mobile.mp4), [Material und Grenzen](assets/codex_v0410/README.md), [Capture-Manifest](assets/codex_v0410/capture_manifest.json). Acht Viewport-Screenshots liegen daneben. Aktueller Code v0.4.11 enthält die neue Personen-/Kontextpolitik; sie ist im alten Clip nicht aufgenommen. Der Clip bleibt ein früherer Demo-Baustein ohne Stimme. Der im Browser simulierte Netzausfall ersetzt T05 nicht.

## Ablauf für ungefähr drei Minuten

| Zeit | Bedienung | Was dabei sichtbar werden soll |
|---|---|---|
| 0:00–0:20 | App öffnen; Offline-Paket abwarten | Dokumentationsaufgabe eines CHPs, fiktive Daten, keine klinische Entscheidung |
| 0:20–0:40 | Verbindung tatsächlich abschalten; neu starten | Nur bei einem aufgenommenen realen Telefon Flugmodus behaupten. Am Rechner „simulierter Netzausfall“ sagen |
| 0:40–1:15 | Neue Notiz `Child has a cough for two days. No fever.` eingeben | Originalpassagen und Vorschläge; Verneinung bleibt sichtbar; vor Einzelprüfung kein Weitergehen |
| 1:15–1:45 | Jeden Vorschlag einzeln prüfen; bei Bedarf Status korrigieren | Menschliche Dokumentationsentscheidung. Eine Statusänderung braucht erneut Bestätigung |
| 1:45–2:10 | Fallnummer selbst eingeben, andere Felder offen lassen, simulierte Einwilligung setzen | Fehlende Angaben bleiben offen; Demo-Profil und Einrichtungen sind fiktiv |
| 2:10–2:30 | JSON, lesbaren MD-Entwurf und optional QR zeigen | Lokale Weitergabe nach Prüfung; Originalbelege im Prüfprotokoll. Ein Export bleibt außerhalb der App bestehen |
| 2:30–2:50 | Hard case laden, Fieber-Konflikt zeigen | Keine automatische Auflösung; bewusste menschliche Auswahl nötig |
| 2:50–3:00 | Einen tatsächlichen Modellfehler und nächsten Validierungsschritt nennen | Second-author-Test ist synthetisch; Nutzer-, Sprach- und Gerätetest stehen noch aus |

Beispiel nach dem Fallwechsel: neue Notiz eingeben und zeigen, dass alte Fallnummer, Behandlung und Einwilligung verschwinden. Dafür nicht dieselbe alte Notiz unverändert wiederverwenden; der Test betrifft eine tatsächlich geänderte Quelle.

## Sprechbaustein für die neue Auswertung

“A second AI author wrote forty additional fictional notes without opening the training lexicon. The model found fifty-eight of sixty-three annotated terms, including unclear suggestions; the keyword list found forty-six. Suggested-only F1 was 0.933 versus 0.844. We later repaired a known person-reference error; rerunning that case is regression evidence. Missed terms and one extra suggestion remain. These are synthetic development results, with no native-speaker or clinical review.”

Kurzer Kontextfall für v0.4.11: `Child has fever in front of the mother.` behält den Kindbezug. `Mother has fever. Cough today.` verlangt bei cough eine ausdrückliche Auswahl. Nicht sagen, die Regel verstehe allgemeine Grammatik. Die konservative Politik erhöht auf bestehenden Generatornotizen die Prüfarbeit und senkt die Übereinstimmung mit deren unverändertem Gold; [Einordnung](../03_plan/codex_context_review.md).

Falls Dezimalalter gezeigt wird: Die frühere Parser-Version las `2.5 years` falsch als 5. Das ist inzwischen repariert; die App verlangt dafür jetzt manuelle Eingabe. Diese Korrektur ist ein Regressionsergebnis und gehört nicht als unabhängiger Modellgewinn in den Pitch.

## Aussagen im bestehenden Skript präzisieren

- Dateigröße und gesamte App aus `eval/demo_asset_manifest.json` nehmen. Rohdateien, Gzip-Schätzung und belegte HTTP-Übertragung unterscheiden. „Die ganze App hat 300 KB“ ist für den aktuellen Stand zu niedrig.
- Python/JS-Parität: gemessene maximale Abweichung `4.89227116561128e-7` bei 16 Fixtures und null Entscheidungswechseln; keine allgemeine bitgenaue Gleichheit behaupten.
- „Fixed list“ verhindert freie generierte Prosa. Sie verhindert keine falschen Begriffsvorschläge oder Kontextfehler.
- QR-Erzeugung wurde lokal geprüft. Die Nutzung einer beliebigen Smartphone-Kamera ohne Netz ist nicht automatisch damit belegt; Kamera/App separat testen.
- Den Team-Abschnitt mit Peter prüfen. Studiengang, Arbeitgeber und Einzelbeiträge nicht allein aus einem früheren Skript als bestätigte Fakten übernehmen.

## Vor der Aufnahme

App-Version notieren; neueste Browserprüfung lesen; Beispiele einmal vollständig durchgehen; alle Fälle löschen; Sprache wählen. Keine Testfehlermeldung aus einer absichtlich provozierten Clipboard-Verweigerung im Hauptclip stehen lassen. Aufnahme auf dem echten Telefon als eigenen Nachweis kennzeichnen. Bestehende Clips zeigen teilweise frühere Versionen und müssen vor Verwendung mit der aktuellen UI abgeglichen werden.

Noch notwendige Aufgaben: T05 realer Telefon-/Offline-Test, T08 unabhängiger Sprachreview, T12 Stimme und finale Videos, T14 tatsächliche Einreichung. T31 ist als begrenzte bekannte Kontextreparatur abgeschlossen; T33 allgemeine Auswertungs-Versionierung bleibt offen. Dieses Dokument ersetzt weder Einreichung noch externe Nachweise.
