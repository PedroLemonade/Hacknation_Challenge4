# Aktuelle Demoaufnahme · AfyaNote v0.4.10

[Video als MP4](demo_mobile.mp4), 74,88 Sekunden, 390 × 844 Pixel, ohne Ton. [Original-WebM](demo_mobile.webm). Alles in diesem Ordner ist lokal gespeichert und enthält ausschließlich fiktive Daten.

Die Aufnahme zeigt tatsächliche Bedienung der gemeinsam entwickelten App in Chrome 154.0.8037.97 auf macOS. Der Browser wird nach vollständiger Paketinstallation offline gesetzt und neu geladen. Das ist ein **simulierter Netzausfall im Desktop-Browser**, keine Aufnahme eines physischen Telefons oder eines Betriebssystem-Neustarts. Swahili-Notiz und Übersetzungen haben keinen unabhängigen Muttersprachler-/Fachreview.

## Gezeigter Ablauf

1. Lokales Offline-Paket abwarten; Netzwerk im Browser abschalten; neu laden.
2. Fiktive Swahili-Notiz eingeben: `Mtoto ana homa kwa siku mbili. Pia anakohoa. Hana kuhara. Ana miaka 3.`
3. Jeden Begriff und das Alter einzeln bestätigen. Die dokumentierte Verneinung bleibt sichtbar.
4. Fallnummer `DEMO-CODEX-VIDEO` selbst eingeben und simulierte Einwilligung setzen. Andere Angaben bleiben offen.
5. Entwurf zeigen, lesbare MD-Datei lokal herunterladen und QR lokal erzeugen. Kein realer Kameratest.
6. Neuen Fall beginnen und Widerspruchsbeispiel laden. Fieber kann ohne ausdrückliche Statuswahl nicht bestätigt werden. Eine Auswahl wird demonstriert; der neue Fall bleibt ungeprüft.

Die Aufnahme behauptet keine Diagnose, Dringlichkeit, klinische Sicherheit oder tatsächliche Einwilligung eines Patienten. Sie ist noch kein fertiges Abgabevideo mit Stimme. T05 und T12 bleiben dafür offen.

## Saubere Screenshots

| Datei | Ansicht |
|---|---|
| 01_note_mobile.png | Notiz und Vorschau, 390 px |
| 02_review_mobile.png | Originalbelege und Prüfung, 390 px |
| 03_handover_mobile.png | Fiktiver Entwurf und offene Felder |
| 04_qr_mobile.png | Lokal erzeugter QR-Dialog |
| 05_conflict_mobile.png | Widersprüchlicher Befund vor menschlicher Auswahl |
| 06_note_desktop.png | Notiz auf dem Desktop |
| 07_review_desktop.png | Zweispaltiger Prüfbereich |
| 08_handover_desktop.png | Entwurf auf dem Desktop |

Viewport-Aufnahmen vermeiden die verschobenen Sticky-Header mancher Full-Page-Screenshots. Anfang, Mitte und Ende der MP4 wurden zusätzlich anhand tatsächlich extrahierter Frames visuell geprüft. Der aktuelle PDF-Entwurf aus der Browserprüfung wurde gerendert und ebenfalls visuell geprüft.

## Nachweise und Reproduktion

[Capture-Manifest](capture_manifest.json) enthält tatsächliche Zeitmarken, Browser, Quellhashes vor/nach Aufnahme und Testgrenzen. [Fiktiver MD-Export](fictional-video-draft.md) stammt direkt aus der App. `media_manifest.json` verzeichnet Dauer, Format, Dateigrößen und SHA-256 der gespeicherten Aufnahme und Bilder.

Der App-Code blieb während Aufnahme und Screenshots unverändert. Beobachtet wurden keine externen Anfragen, Notiz-Uploads oder Browserausnahmen. Die Ausgabe-Dateien bleiben außerhalb der App bestehen.

Aus dem Projektordner: `node tools/record_demo_codex.cjs`, bei Bedarf `AFYANOTE_TEST_URL`, `AFYANOTE_BROWSER_PATH`, `AFYANOTE_PLAYWRIGHT` und einen neuen `AFYANOTE_MEDIA_FOLDER` setzen. Benötigt Playwright, einen Browser und den von Playwright erwarteten FFmpeg-Pfad. In dieser Sitzung wurde dafür das bereits installierte FFmpeg über einen temporären Runtime-Pfad verwendet; keine Software heruntergeladen. Bestehende Aufnahmeordner werden vom Skript nicht überschrieben.

MP4-Konvertierung erfolgte aus dem Original-WebM mit FFmpeg / H.264, CRF 18, yuv420p, ohne Ton; keine App-Texte oder Fallinformationen wurden nachträglich hineinmontiert. Die Vorlage für eine gesprochene Demo liegt in [demo_rehearsal_codex.md](../../demo_rehearsal_codex.md).
