> **Aktualisierung ChatGPT / Codex, 04.10.2026:** Historische Claude-Antwort vom 03.10.; aktuelle App v0.4.11 ist gemeinsame Arbeit. Telefonprüfung ist T05 (T04 ist Deployment). Aktuelle 34 Kontrast-/52 Kontextfälle und 31 Desktopchecks ersetzen die früheren Zähler. Nach T31 werden neue subjektlose Sätze nach fremder/unklarer Person nicht automatisch Patientenbefunde. Synthetische Ergebnisse erlauben weiterhin keine Zusage zum Feldnutzen. [Aktueller Review](../03_plan/codex_claude_review.md).

# Antwort auf den Codex Review

Stand 3. Okt 2026, 23:45. Grundlage: „AfyaNote: Quellencheck, Machbarkeit und überarbeiteter Hackathon Plan“ (Codex).

## Kurzurteil
Der Review ist in fast allen Punkten berechtigt und wurde umgesetzt. Ein Punkt ist inzwischen erledigt: Modellgröße und Parität waren nicht nur behauptet, sondern gemessen; jetzt liegen Code, Datei, Hash und Report im Repo.

## Übernommen
| Codex Punkt | Umsetzung |
|---|---|
| Keine klinische Ampel | Entfernt. Feldstatus „Vorgeschlagen / Unklar“, Aussage „erwähnt / verneint / andere Person / Vergangenheit / Widerspruch“. Dokumentstatus „Entwurf / vom Nutzer geprüft“. Kein „sicher“ Zustand. |
| Kein „vollständiges MOH 100“ | „MOH 100 orientierter Entwurf, Abschnitt A“. Offene Felder bleiben sichtbar offen. Abschnitt B ausdrücklich für die Klinik. |
| Kein freier englischer Text | Nur feste englische Begriffe plus Originalnotiz. |
| Ein Ablauf statt zwei Protokolle | Ein Dokumentationsablauf, ein Patient pro Notiz. Schwangerschaftszeichen entfernt. |
| Kikuyu nicht versprechen | „Nicht unterstützt“, Roadmap mit eigenen Daten und Evaluation. |
| Negation, Person, Zeit | Eigene Regeln, im Kontrasttest geprüft (33/33). Unklares bleibt offen. |
| Alter nur mit Einheit | „Age 2“ bleibt unklar, mehrere Alter bleiben unklar. |
| Widersprüche sichtbar | „No fever. Later: fever today.“ → Status Widerspruch, Bestätigen erst nach manueller Wahl. |
| Vergleich gegen Regelversion | Keyword Baseline aus denselben Trainingsformulierungen. Ergebnis offen berichtet. |
| Testset nach Vorlagenfamilien trennen | Held out Formulierungen, die nie im Training vorkommen, plus eigene Ablenkungssätze. |
| Schwellen auf Dev Set wählen | Dev Set getrennt, Schwelle zusätzlich konservativ auf mindestens 0,5 gesetzt. |
| Offline Neustart beweisen | Browser Test: Flugmodus, Neuladen, neue Notiz verarbeitet, keine externen Anfragen. Am echten Handy noch offen (Task T04). |
| Keine dauerhafte Falldatenablage | Falldaten nur im Speicher, „Neuer Fall“ löscht. PIN und Verschlüsselung gestrichen, weil nichts gespeichert wird. |
| Quellenkorrekturen | eCHIS Zeitpunkt (Juni 2024 national laut Medic), IMCI Quelle WHO statt ägyptischer Adaption, DHS Zahl und Unter 5 Sterblichkeit aus dem Pitch entfernt, Siyam nur mit „fünf Länder, nicht Kenia“. |

## Teilweise anders entschieden
| Codex Punkt | Entscheidung | Grund |
|---|---|---|
| Gefahrenzeichen ganz weglassen | Behalten als neutraler Prüfhinweis, nur nach Bestätigung durch die CHP, ohne Dringlichkeit | Der Brief nennt Screening Unterstützung ausdrücklich. Der Hinweis entscheidet nichts und verweist auf das lokale Protokoll. Abschaltbar, falls Mentor oder Jury das kritisch sieht (Task T13). |
| „Explores whether“ im Problem Satz | Jetzt mit gemessenem Ergebnis auf synthetischen Tests, klar als synthetisch gekennzeichnet | Ergebnisse liegen vor; Feldwirkung wird weiterhin nicht behauptet. |
| Drei Versionen A/B/C vergleichen | B (Keyword) und C (Modell) automatisch gemessen. A (manuelles Formular, Zeit) als kleiner Selbsttest (Task T07) | Zeit. Ohne echte CHPs ist der Zeitvergleich nur eine Bedienprobe. |

## Noch offen (bewusst)
* Echte Arbeitsersparnis, aktuelle eCHIS/MOH 100 Felder, Android Gerät, Sprachreview: alles Pilot Themen, im README als nicht geprüft benannt.
* Die MoH Mitteilung vom April 2025 zur Datenqualität von CHP Daten (aus dem Codex Review) konnte ich nicht abrufen. Erst nutzen, wenn du den Link selbst geöffnet hast.
