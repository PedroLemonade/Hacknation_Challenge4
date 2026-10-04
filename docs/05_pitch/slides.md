# Vier Folien · aktuelle Quelle für das Demo-Video

> **Herkunft:** Claude-Grundfassung, durch ChatGPT / Codex am 04.10.2026 auf v0.4.11 und belegbare Aussagen überarbeitet. Alte Medien bleiben erhalten.

Aktuelle HTML-Fassung: [slides.html](slides.html). Vorhandene `assets/slide_*.png` sind ältere Fassungen und wurden nicht ersetzt. Neue Aufnahmen/Render in eigenem Versionsordner.

## 1 · Problem und Hypothese

**AfyaNote — visit note to reviewed referral draft, offline.**

For a community health promoter in Kenya, we test whether a short Swahili visit note can become a checked draft during the visit, while the family can still answer missing questions.

Kontext: Dokumentationslast in fünf Ländern untersucht (Siyam 2021, **nicht Kenia**); eCHIS erreicht laut Medic 2024 alle 47 kenianischen Counties. Beides belegt einen relevanten Kontext, nicht AfyaNotes Nutzen oder eine fehlende eCHIS-Funktion. Kein erfundener Zeitgewinn.

## 2 · Small AI und Nachweis

Note → classifier + bounded rules → person reviews each item → MOH 100-oriented draft.

**243 KiB** Modell · **F1 0,85 vs 0,50** auf synthetischen zurückgehaltenen Formulierungen · **58/63 vs 46/63** Begriffe auf bekanntem synthetischen 40er-Bestand.

Keine klinische Genauigkeit: Daten unreviewt, Recall enthält auch unklare Vorschläge. Feste Liste begrenzt Ausgabe, verhindert aber keine falsche Interpretation. Belege, Statuswahl, Bestätigen/Ablehnen und Einwilligung; keine Diagnose/Dringlichkeit.

## 3 · Ablauf und Übergabe

Haushaltsbesuch → kurze Notiz → Belege mit Familie prüfen → fehlende Angaben erfragen → bewusste Übergabe. Fiktive Einrichtungen. Integration in bestehende App ist nächster Prüfschritt.

Tech: statische PWA, exportiertes JSON-Modell, JavaScript, Service Worker. **440.004 Bytes statische Assets**, kein RAM-/HTTP-Transferwert. 31 aktuelle Desktopchecks; echter Telefonneustart offen.

## 4 · Lokalisierung und Grenzen

**Small, checkable, local.**

Synthetische Daten; SW/EN noch ohne menschlichen Sprach-/Fachreview; Kikuyu nicht unterstützt; begrenzte Personen-/Negationsregeln. Nächster Schritt: qualifizierter Review, Zielgerät und bestätigter Workflow mit CHP und empfangender Fachkraft. Claude-Grunddemo plus dokumentierte ChatGPT/Codex-Weiterentwicklung.

Kennzahl-/Quellennachweis: [eval/results.md](../../eval/results.md), [Kontextreview](../03_plan/codex_context_review.md), [Claims](../02_research/codex_claims_20261004.md).

**Neu verfügbar:** Vier überprüfte PNGs aus der überarbeiteten HTML-Quelle unter [codex_review_v0411](assets/codex_review_v0411/README.md).
