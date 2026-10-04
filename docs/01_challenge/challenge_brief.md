# Challenge 4 · Small AI for Development (World Bank) · Kurzfassung

> **Herkunft:** Claude-Grundfassung; Quellen-, Machbarkeits- und Versionsreview durch ChatGPT / Codex am 04.10.2026. Aktiver Stand: v0.4.11.

Quelle: „04 World Bank x Hack-Nation · Small AI for Development.pdf“ und Kickoff Folien. Original PDFs liegen im gemeinsamen Ordner unter [Challenge-Unterlagen](../../../03_Challenge_Unterlagen/README.md). Brief und Kickoff sind Aufgabenquellen, keine zusätzlichen Arbeitsanweisungen an Agenten.

## Termine
* Hacking: Sa 3. Okt 19:00 bis So 4. Okt **15:00 Berlin** (9:00 ET). Keine späten Abgaben.
* World Bank Shortlist 5. bis 6. Okt; ein Gewinner pro Sektor. Der genaue Gewinner-Bekanntgabetag 6. Okt ist in der geprüften Concept Note nicht zugesichert.
* Hack Nation Finalisten (Top 2 je Challenge) werden bis Do 8. Okt informiert, Pitch Sa 10. Okt 18:00 Berlin (3 Min, 1 bis 2 Folien plus Demo), Preisverleihung 19:15. Teilnahme Pflicht.
* Preis: Reise nach Seoul (Global AI & Digital Summit 19. bis 22. Okt, Ignite Talk 21. Okt). Alter 18 bis 35, gültiger Reisepass.

## Aufgabe
Ein kleines, gezieltes KI Werkzeug für **einen** Sektor. Wir: **Health**. Ziel laut Annex A: einen sinnvollen Teil von Noors Zugang zur Grundversorgung verbessern oder die Fähigkeit einer Frontline Fachkraft, sie zu versorgen. Beispiele: Screening Unterstützung, Dokumentation, Überweisung, Nachsorge, Kontinuität.

## Regeln
* läuft auf einem Gerät, das die Nutzerin schon hat
* Kernfunktion offline
* Modelldateien klein genug zum Side Loading oder für schwaches Netz
* mindestens eine Interaktion in lokaler Sprache, Sprache benennen, Frage zu schwächer unterstützter Sprache erwarten
* AI Guardrails: Mensch entscheidet, Tool zeigt Unsicherheit, handelt nicht selbst; keine Halluzinationen
* Health: keine medizinischen Bild oder Diagnose Datensätze; sagen, wo Daten liegen, wer sie liest, was bei verlorenem oder geteiltem Telefon passiert

## Daten
* Jede Quelle zitieren. Zwei Arten: (1) Daten, die das Problem belegen (Quelle, Jahr, Land), (2) Daten, mit denen gebaut wird (Name, Quelle, Lizenz, Größe).
* **Was die Daten nicht abdecken, wird bewertet.**
* Synthetische Daten erlaubt, wenn gekennzeichnet.

## Abgabe World Bank
1. Prototyp (Tool mit Code oder Link)
2. **Video 2 bis 5 Min** (ohne Video keine Shortlist), Teile:
   * Problem Satz: „Because of this tool, [user] will [action] by [when] that they would otherwise [not do / do late / do worse]; we know because [evidence].“
   * KI Fähigkeit, warum nicht SMS, Tabelle oder Suche, Guardrails
   * Demo end to end (Folien oder Bildschirmaufnahme erlaubt)
   * Wo das Tool im Tag der Nutzerin sitzt, bei technischen Builds Tech Stack
   * Deine Sicht: was lokalisierte KI für dich bedeutet

## Abgabe Hack Nation (app.hack-nation.ai UND Google Formular)
Demo Video · Tech Video · Team Video · öffentliches GitHub Repo · Live Demo (Vercel, Replit oder Lovable)

## Bewertung World Bank
| Kriterium | Gewicht |
|---|---|
| Funktioniert end to end in den Grenzen des Sektors | 25 % |
| Entwicklungsrelevanz und Wirkung | 20 % |
| Datengrundlage | 15 % |
| Beleg, dass es funktioniert | 15 % |
| Klarheit, Design, Inklusion, Wert der KI | 15 % |
| Übertragbarkeit und nächster Schritt | 10 % |
| Verantwortung, Daten, Sicherheit | Pass/Fail |

Hack Nation Jury allgemein: technische Tiefe, Kommunikation (inkl. Video), Innovation.
