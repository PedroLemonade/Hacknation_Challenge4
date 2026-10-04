# Plan · Abgabe, Nachweise und nächste Entwicklung

> **Herkunft:** Claude-Grundfassung; Quellen-, Machbarkeits- und Versionsreview durch ChatGPT / Codex am 04.10.2026. Aktiver Stand: v0.4.11.

## Produkt und Nutzenhypothese
Eine CHP dokumentiert eine kurze SW/EN-Notiz, prüft belegte Begriffsvorschläge und erstellt einen an MOH 100 Abschnitt A orientierten Entwurf. Der Nutzen ist eine Hypothese: weniger Übertragungsarbeit und mehr beantwortete Rückfragen während des Besuchs. Die Demo belegt den Ablauf; sie belegt noch keine Zeitersparnis oder bessere Versorgung.

Murang'a ist ein gewählter Demokontext, keine bestätigte Pilotregion. Noor ist eine fiktive Person aus der Challenge, keine kenianische Studienperson. Eine konkrete CHP und deren Empfangseinrichtung müssen Bedarf und Arbeitsablauf erst bestätigen.

## Entscheidungen mit Nachweisgrenze

| Thema | Entscheidung | Evidenz / offene Grenze |
|---|---|---|
| AI | 10 Begriffe, Zeichen-n-Gramme, 249.284 Bytes | [Auswertung](../../eval/results.md); 5.000 synthetische Trainingspassagen |
| Sprachen | Swahili, Englisch, gemischt | Synthetische Tests; kein Muttersprachlerreview; Kikuyu nicht unterstützt |
| Kontext | Begrenzte Personen-, Zeit-, Verneinungsregeln | 52 bekannte Kontextfälle, keine allgemeine Sprachkompetenz; [Grenzen](codex_context_review.md) |
| Ausgabe | Feste Begriffe, Originalbelege, Prüfung und Einwilligung | Entwurf, kein aktuelles nationales Formular und kein interoperabler FHIR-Export |
| Gefahrenzeichen | Neutraler Protokollhinweis nach Bestätigung | Fachprüfung und Entscheidung T13 offen; kein Triageauftrag |
| Offline | Statische PWA mit vollständigem Paketcache | 31 aktuelle Desktop-Browserchecks; physischer Telefonneustart T05 offen |
| Daten | Fall im Arbeitsspeicher, Sprache darf gespeichert sein | Dateien, Zwischenablage, Druck und QR verlassen die App auf bewusste Übergabe |
| Einrichtungen | Schematische Karte, fiktive Einrichtungen | Keine realen Entfernungs-/Zuständigkeits-/Versorgungsangaben ableiten |
| LLM | Optionaler Messwerkzeugkasten außerhalb der App | Struktureller Guard; kein echter Modelllauf, keine Handy-RAM-Messung |

## Reihenfolge vor der Abgabe

Die früheren Uhrzeiten waren ein Plan und kein Erledigungsnachweis. Aktueller Status steht nur im [BACKLOG](../../BACKLOG.md). Deadline laut Kickoff: So 04.10., 09:00 ET = 15:00 Berlin. Einreichung mindestens 30 Minuten vorher fertigstellen.

1. **Produktstand festlegen:** v0.4.11 und aktuelle Hashes dokumentieren; neue Regeln brauchen neue Nachweise. T33 und T37 sind fachliche Weiterentwicklung, keine Voraussetzung, um die begrenzte Demo ehrlich vorzuführen.
2. **Telefonprobe T05:** reales Gerät, Installation, kalter Offline-Neustart, vollständige Prüfung/Übergabe. Falls sie fehlt: Video mit korrekt bezeichnetem Desktop-Offlinetest; keine Flugmodusbehauptung erfinden.
3. **Sprache/Fachgrenze:** T08 liefert Vorprüfung; KI-Review ist kein Sprach-/Fachreview. T13 Entscheidung zum Hinweis separat festhalten.
4. **Pitch aktualisieren:** Quellen und Synthesestatus zeigen. Folien-HTML ist aktuell; alte PNG/MP4-Dateien sind Referenzen bis zur neuen Aufnahme. Keine alten Clips als v0.4.11 ausgeben.
5. **Einreichen:** T03/T04/T12/T14/T15 mit echten Links und Login-freier Prüfung. Drei Videos gemäß Kickoff; World-Bank-Anforderung 2–5 Minuten, interne Zielzeit etwa 3:30–4:00.

## Danach, mit klaren Abhängigkeiten

| Paket | Ergebnis | Voraussetzung |
|---|---|---|
| T33 | Neue versionierte Auswertungen statt Überschreiben der Baseline | Unveränderte Goldsets erhalten |
| T37 | Verneinung pro Begriff statt über ganze Passage | Neue Fälle vor dem Fix einfrieren |
| T34 / T08 | Getrenntes, doppelt annotiertes Sprach-/Kontextset | Kenianische Sprachperson und Fachpartner |
| T38 | SFT-Train/Dev-Split ohne identische Notizen | Daten-/Generatorreview; keine neue Modellbehauptung |
| T35 | Lokaler Adapter mit Erhalt von Verneinung, Person und Zeit | Zielfelder und CHT/eCHIS-Version vom Betreiber |
| T36 | Ablaufvergleich inkl. Korrektur- und Übertragungszeit | CHP und Empfangseinrichtung; vorher keine Patientenfälle |
| T29 | Vollständiger lokaler LLM-Vergleich mit Provenienz | Installiertes lokales Modell; kein Phone-Claim daraus |

Keine neue Sprache, Spracherkennung, echte Synchronisation oder freie medizinische Textgenerierung vor diesen Prüfungen. Integration und Sprachvalidierung haben für einen Pilot höheren Wert als weitere Demo-Funktionen.
