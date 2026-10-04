# T08 · Swahili-Vorprüfung und qualifizierten Review trennen

> **Herkunft:** Claude-Grundfassung; Quellen-, Machbarkeits- und Versionsreview durch ChatGPT / Codex am 04.10.2026. Aktiver Stand: v0.4.11.

**Grundprompt:** Claude. **Reviewkonzept:** ChatGPT/Codex. **Durchführung:** KI-Vorprüfung möglich; menschliche Freigabe durch Peter organisieren.

Eingabe: [vorbereitete Liste](inputs/swahili_review_input.md). Vor Gebrauch prüfen, ob sie den aktuellen Strings/Begriffen entspricht; das Datum allein belegt keine Aktualität.

```text
Lies AGENTS.md. Prüfe die aktuelle SW/EN-Begriffsliste, app/i18n.js und Beispielnotizen gegen docs/04_tasks/inputs/swahili_review_input.md. Erstelle eine datierte Vorprüftabelle: Original | beabsichtigte Bedeutung | mögliche Mehrdeutigkeit | Vorschlag | Unsicherheit. Nutze Status 'KI-Vorprüfung', keine Muttersprachler- oder klinische Freigabe. Prüfe besonders Personen, Verneinung, Zeit, die vier Gefahrzeichenbegriffe und Handlungs-/Dringlichkeitsimplikationen. Keine Regeln oder Trainingsdaten still ändern. Packe alle Änderungswünsche mit Quellpfad und Beispiel in eine separate MD-Datei.
```

Danach kenianische Sprachperson plus Fachperson die kritischen Beispiele unabhängig beurteilen lassen. Anzahl, Rollen, Änderungen und offene Abweichungen dokumentieren; Gesundheitsdaten nicht für den Review sammeln. Die Personen bestätigen Bedeutung und Nutzbarkeit, nicht die Modellleistung auf unbekannten Fällen.

UI-Änderung: app/i18n.js plus SW-Version und Browserprüfung. Lexikon-/Regeländerung: vorab neue Fälle einfrieren, Training nur bei tatsächlicher Datenänderung, relevante Parität/Evaluation und neue Nachweise. Bereits bekannte Tests als Regression bezeichnen. T09 ist abgeschlossen und kein Auftrag für unbemerkte Neuannotation.

Fertig ist die **Vorprüfung**, wenn die Tabelle vorliegt. Menschlicher Sprach-/Fachreview bleibt separat offen, bis er tatsächlich stattgefunden hat.
