# Wo AfyaNote läuft · Geräte- und Laufzeitentscheidung

**ChatGPT / Codex, 04.10.2026.** Produktdemo, Trainingslabor und Zukunftspfade getrennt, damit Dateigröße keine Gerätetauglichkeit vortäuscht.

| Baustein | Heute ausgeführt auf | Was aufs Handy müsste | Belegt / noch offen |
|---|---|---|---|
| App + Zeichen-N-Gramm-Klassifikator | JavaScript in lokalem Desktop-Chrome | Statische `app/`-Dateien; Modell 249.284 Bytes | Browserabläufe, Offline-Neustart und schmale Ansichten gemessen; echtes Telefon offen |
| Regeln und Belegstellen | Im selben Browser, pro Notiz | Schon Teil der App | Personen, Verneinung, Zeit und Auswahlpflicht begrenzt geprüft |
| Fallzustand | Browser-Arbeitsspeicher | Kein Falldatenbank-Setup | Reload/neuer Fall löscht In-App-Fall; Dateien/Clipboard/QR außerhalb dieser Kontrolle |
| Offlinepaket | Cache API + Service Worker | Einmaliges Laden in geeignetem Browser über HTTPS | Eviction/fehlendes Paket sichtbar, Reparatur geprüft; dauerhafte Verfügbarkeit nicht garantiert |
| Qwen3-0.6B + Adapter | Separates MLX-Python-Labor auf diesem M2-Mac | Andere unterstützte Laufzeit und überprüfte Konvertierung erforderlich | Gespeicherter Adapter läuft lokal; keine PWA-/Telefonintegration |
| Übergabe | Lokaler Download und Mockvalidator | Download/QR mit Empfänger prüfen | Struktur geprüft; reale Empfänger-Schnittstelle fehlt |

## Lokaler Start und Handyzugang

`http://localhost:8000/` bezeichnet **das Gerät, auf dem der Browser läuft**. Auf dem Telefon ist das nicht der Mac. Der aktuelle Server bindet an 127.0.0.1 und ist für diesen Mac erreichbar. Ein nackter HTTP-LAN-Link zum Mac bietet die für Service Worker nötige sichere Umgebung gewöhnlich nicht. Für einen verlässlichen Handytest einen vorgesehenen HTTPS-Demo-Link oder eine bewusst eingerichtete lokale HTTPS-Testumgebung benutzen. Noch kein neuer Dienst wurde veröffentlicht.

[MDN: Installation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) nennt HTTPS oder lokale Loopback-Entwicklung; auf iOS erfolgt das Hinzufügen über das Teilen-Menü. Installation und Offlinefunktion sind getrennt zu prüfen. [MDN: sichere Kontexte](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts) erklärt die localhost-Ausnahme. Keine Safari-/Android-Erfolgsaussage aus einem Chrome-Fenster mit 390 Pixeln ableiten.

## Test auf echtem Gerät

Gerätemodell, OS, Browser und App-Version notieren. Einmal online öffnen, Paketbereitschaft abwarten, Flugmodus **und** WLAN aus, Browser vollständig beenden, wieder öffnen, neue fiktive Notiz verarbeiten und Export/QR prüfen. Danach echter OS-Neustart, geringe freie Speicherkapazität und privater Modus separat. Fall zurücksetzen; prüfen, was bereits heruntergeladene Dateien betrifft. QR mit zweitem realem Gerät und langen/mehrsprachigen Notizen testen. Ergebnisse in T05, auch Fehlschläge und nicht durchgeführte Schritte. Kein klinischer Fall.

[WebKit-Speicherpolitik](https://webkit.org/blog/14403/updates-to-storage-policy/) beschreibt automatische Eviction bei Speicherdruck, Quoten oder Inaktivität. Standardmäßig ist Persistenz best effort. Keine pauschale „nach sieben Tagen weg“- oder „installiert deshalb garantiert gespeichert“-Behauptung. App-Cache und Gesundheitsdatenhaltung sind unterschiedliche Entscheidungen.

## Optionales LLM auf dem Telefon

Die lokale INT4-Basis inklusive Tokenizerdateien umfasst 346.929.206 Bytes, der Adapter 8.668.615 Bytes. Das sind Plattendateien. Der beobachtete MLX-Spitzenallocator von 1,766 GB beim Training ist weder vollständiger Prozess-RAM noch Telefon-Inferenz-RAM. Semantische Qualität reicht bislang nicht für einen Produktwechsel.

Aktuelle Primärquelle: Googles [LLM-Inference-Guide](https://developers.google.com/edge/mediapipe/solutions/genai/llm_inference) bezeichnet MediaPipe LLM Inference für Android/iOS/Web inzwischen als **maintenance-only** und verweist für Weiterentwicklung auf LiteRT-LM. Deshalb einen neuen Prototyp nicht ungeprüft auf eine ältere MediaPipe-Anleitung festlegen. Deren `.task`/`.litertlm`-Bundles sind nicht unsere MLX-Dateien. Die dort beschriebene Torch-Konvertierung nennt Linux und mindestens 64 GB RAM; dieser Mac mit 8 GiB erfüllt diese konkrete Voraussetzung nicht. Unterstützte Modelle, LoRA und Zielplattform müssen vor jeder anderen Konvertierung einzeln verifiziert werden.

Machbarer nächster Schritt ist ein separater Laufzeit-Spike: tatsächliches Testtelefon benennen, unterstützten Modell-/Runtime-Pfad anhand der aktuellen Herstellerdoku wählen, unveränderten Base-vs-Adapter-Ausgabevergleich überführen, Hashes prüfen, Kaltstart/erste Antwort/gesamte Antwort und tatsächlichen RAM/Temperatur/Batterie messen. Cloudfallback bleibt eine eigene Entscheidung. Ein gescheiterter Export oder fehlender Laufzeit-Support ist ein gültiges Feasibility-Ergebnis. Der 249-KB-Klassifikator bleibt die aktuelle Demo-Grundlage.

[Trainingsreview](codex_llm_training_review.md) · [T05](../04_tasks/T05_handy_offline_test.md) · [T41](../04_tasks/T41_llm_vergleich_geraete.md).
