# Pilot und Einbettung · mit prüfbaren Entscheidungsschritten

> **Herkunft:** Claude-Grundfassung; Quellen-, Machbarkeits- und Versionsreview durch ChatGPT / Codex am 04.10.2026. Aktiver Stand: v0.4.11.

Claude übernahm frühere Codex-Interview-/Kostenstrukturen. Dieser Review ergänzt Quellen und Abhängigkeiten. Keine Interviews, Partnerzusagen oder Kenia-Pilotfreigabe liegen vor.

## Vorhandenes System ernst nehmen

Kenias eCHIS basiert auf CHT; Medic beschreibt nationale Abdeckung im Jahr 2024. Die 2023-Einführungsankündigung ist nicht mit vollständiger Abdeckung gleichzusetzen. [Medic Q2 2024](https://medic.org/q2-2024-impact-report/).

CHT dokumentiert UI Extensions **ab v5.2.0**. Diese sind ein möglicher technischer Erweiterungsweg, keine automatisch passende Erweiterungsstelle für jede Formularansicht. Die in Kenia eingesetzte Version, Erlaubnisse, Offlinefunktion und Einbettung müssen mit dem Betreiber geklärt werden. [CHT UI Extensions](https://docs.communityhealthtoolkit.org/building/reference/ui-extensions/).

CHT beschreibt FHIR-Workflows mit Patient, Encounter und Observation über einen Mediator. AfyaNotes Export `afyanote.referral-draft/0.3` ist kein FHIR-Format und bildet komplexe Personen-/Zeitdimensionen noch nicht vollständig ab. [CHT Interoperabilität](https://docs.communityhealthtoolkit.org/building/interoperability/cht-config/). Kenias DHA beschreibt den nationalen HIE als autorisierten Austausch; daraus folgt keine Zugangserlaubnis für den Hackathon. [DHA HIE](https://hie-docs.dha.go.ke/understandHIE).

Die bisherige Aussage „eCHIS versteht keinen Freitext“ ist nicht ausreichend belegt. Erst prüfen, welche Dokumentation, Sprachen, Überweisung und Rückmeldung es bereits abdeckt und ob AfyaNote einen zusätzlichen Engpass löst.

## World-Bank-Anschluss

Die Bank beschreibt mit BREHS eine Unterstützung kenianischer Primärversorgung, institutioneller Kapazität und Datennutzung. Das ist thematische Relevanz, keine Finanzierung oder Befürwortung von AfyaNote. [World Bank, 14.03.2024](https://www.worldbank.org/en/news/press-release/2024/03/14/kenya-afe-secures-215-million-to-bolster-primary-healthcare-services-and-enhance-institutional-capacity). Eine MoH-Mitteilung mit Ereignisdatum **10.09.2026**, veröffentlicht am 14.09., nennt BREHS/KHEPRR, digitale Gesundheit und Patientensicherheit als aktuelle Kooperationsfelder; der Suchindex war lesbar, der direkte Abruf in diesem Review lief in einen Timeout. [MoH-Mitteilung](https://www.health.go.ke/strengthening-health-systems-through-kenya-world-bank-partnership).

Die Bank verweist 2026 auf ihren AI Repository und praktische angepasste KI. Der Hackathon-Prototyp ist noch keine belegte Bereitstellung für diesen Katalog. [World Bank Live 2026](https://live.worldbank.org/en/event/2026/ask-experts-making-ai-work-for-all).

## Drei Stufen

| Stufe | Arbeit und Ergebnis | Entscheidung |
|---|---|---|
| 1: Bedarf, etwa 1–2 Wochen als Planannahme | 5–8 CHPs und 2–3 Empfangspersonen, verwendete App/Formulare, Sprache, Geräte, doppelte Eingaben, typische Auslassungen | Weiter nur mit bestätigtem Engpass und benannter Verantwortung; Zahlen sind Planumfang, keine Statistik |
| 2: Sandbox | Sprach-/Fachreview, getrenntes Goldset, echte Zielgeräte, fiktive Notizen, lokaler Adapter, Originalbelege und Statusverlust prüfen | Keine echte Personendatenintegration; Abbruch bei kritischer Fehlzuordnung oder unverständlicher Auswahl |
| 3: Beaufsichtigte Erprobung | Betreiberfreigabe, angemessene Datenrechte, Schulung und definierter Empfänger; gepaarter Ablaufvergleich | Pilotbeginn erst nach vereinbarten Anforderungen; keine fachliche Freigabe allein durch hohe F1 |

## Fragen und Messung

Bei der CHP: Wo entsteht die Originalnotiz? Wer trägt sie später wohin ein? Welche Felder fehlen? Was kostet Prüfung eines falschen Vorschlags? Welche Sprache und welches Gerät sind tatsächlich vorhanden? Bei der Einrichtung: Mindestangaben, Rückmeldung, Umgang mit fremden Personen/verneinten/past-Aussagen, kann ein QR/Text überhaupt genutzt werden?

Zeit **vom Notizbeginn bis zum verwertbaren Empfang** messen, einschließlich Prüfung, Korrektur, Doppelübertragung und Training. Zufällige Reihenfolge von manuell / Wörterbuch / Modell, gleiche Fallkomplexität und Vollständigkeit, Anfangseffekte getrennt, Fehlerraten und Spannweite berichten. Team-Bedienprobe separat von CHP-Erprobung kennzeichnen. Konkretes Protokoll: [T36](../04_tasks/T36_pilot_bedienprobe.md).

`gesparte Stunden = Fälle pro Monat × gemessener Nettozeitgewinn in Minuten / 60`

Kosten enthalten Sprach-/Fachannotation, Integration, Supervision, Wartung, Gerätehilfe und Datenbetrieb; lokal laufende KI macht diese Kosten nicht null. Szenarien: Doppelarbeit, Gleichstand, Vorteil bei gleicher Qualität. Neues Land/Sprache braucht neue Begriffe, Labels, Partner und Evaluation; schnelles Laptoptraining belegt keine schnelle institutionelle Einführung.
