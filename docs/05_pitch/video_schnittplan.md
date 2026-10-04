# Schnittplan · aktuelles Skript und Version passend aufnehmen

> **Herkunft:** Claude-Grundfassung, durch ChatGPT / Codex am 04.10.2026 auf v0.4.11 und belegbare Aussagen überarbeitet. Alte Medien bleiben erhalten.

[Skript](video_scripts.md), [Folienquelle](slides.html). Zeitangaben sind Planwerte; fertige Renderlänge prüfen. World-Bank-Bereich **2–5 Minuten**, Ziel etwa 3:30–4:00.

| Planzeit | Inhalt | Aktuelles Material |
|---|---|---|
| 0:00–0:35 | Problem, Nutzenhypothese, vorhandenes eCHIS | Folie 1 aus aktuellem HTML |
| 0:35–1:15 | Modell, synthetischer Vergleich, Prüfschritte | Folie 2 |
| 1:15–1:30 | Offline-Nachweis korrekt benennen | T05 reale Aufnahme, falls tatsächlich bestanden; sonst ausdrücklich Desktop-Netzsimulation |
| 1:30–2:45 | Swahili, Belege, erfragte Dauer, Widerspruch, Einrichtung, Einwilligung, Entwurf/QR | Neue Aufnahme von v0.4.11, fiktive Daten |
| 2:45–3:15 | Ablauf, Einbettung, technischer Umfang | Folie 3 |
| 3:15–3:50 | Lokalisierung, Grenzen, nächster Review | Folie 4 |

## Fertige Bausteine für v0.4.13 (empfohlen, 4. Okt 09:10)

Alles in `assets/claude_v0413/` passt zum aktuellen Stand und zum Skript. Details und Hashes: [README](assets/claude_v0413/README.md).

| Planzeit | Datei | Hinweis |
|---|---|---|
| 0:00–0:35 | `slide_1.png` | |
| 0:35–1:15 | `slide_2.png` | Absatz zum feinjustierten LLM kann auch über Folie 4 laufen |
| 1:15–1:30 | **eigene Handy Aufnahme (T05)** | sonst Satz „checked in a desktop browser“ aus dem Skript nehmen |
| 1:30–2:20 | `demo_main_1080p.mp4` | Live Vorschau, Prüfen, „Ask before you leave“ (4 Tage), Karte, Einwilligung, QR; ggf. auf 70 % verlangsamen |
| 2:20–2:35 | `demo_hardcase_1080p.mp4` | Widerspruch bei Fieber, Auswahlpflicht, Swahili Umschaltung |
| 2:35–2:45 | Ende von `demo_main_1080p.mp4` | QR Blatt |
| 2:45–3:15 | `slide_3.png` | |
| 3:15–3:50 | `slide_4.png` | enthält die gemessene Tabelle AfyaNote vs. feinjustiertes 0.6B LLM |

Die Clips sind automatische Browseraufnahmen ohne Ton. Für den Hochkant Look gibt es dieselben Clips als `*_phone.mp4`.

## Was vorhandene Medien bedeuten

* Claude-MP4s/PNGs im assets-Hauptordner zeigen ältere Stände. Dateinamen sind keine Versionsnachweise. Nicht automatisch als aktuelle Bausteine verwenden.
* `assets/codex_v0410/demo_mobile.mp4` ist eine **74,88-s-Desktopaufnahme ohne Ton**, mobile Ansicht, v0.4.10 vor T31; Manifest liegt dabei. Kein echter Handyclip.
* T31-UI-Bilder in `eval/context_t31/ui/` belegen zwei begrenzte aktuelle Kontextabläufe, sind kein fertiges End-to-end-Video.
* Aktualisierte `slides.html` wurde in diesem Review geändert. Alte `slide_*.png` wurden erhalten; für das Video neue Bilder/Screenaufnahme verwenden.

## Fertigstellung

Neuen Ordner z.B. `assets/peter_v0411/` mit Aufnahme, Gerät/Browser/Version, Quelle, UTC-Zeit und Hashmanifest anlegen. Folien und Aufnahme passend zur Stimme schneiden; Belege lang genug lesbar lassen. Stimmaufnahme und Render überprüfen, reale Dauer dokumentieren. Drei Videos hochladen, Links ohne Login prüfen und in T14 verwenden. Diese Datei ist ein Plan, kein Nachweis fertiger Videos.

**Neu verfügbar:** Vier überprüfte PNGs aus der überarbeiteten HTML-Quelle unter [codex_review_v0411](assets/codex_review_v0411/README.md).
