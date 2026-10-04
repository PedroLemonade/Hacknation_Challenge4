# Bedrohungsmodell · aktiver Demo-Stand

> **Herkunft:** Claude-Grundfassung; Quellen-, Machbarkeits- und Versionsreview durch ChatGPT / Codex am 04.10.2026. Aktiver Stand: v0.4.11.

Die Struktur stammt aus früherer ChatGPT/Codex-Arbeit, wurde von Claude angepasst und in diesem Review konkretisiert. Schutz bezieht sich auf den geprüften App-Code, nicht auf das ganze Telefon.

| Risiko | Kontrolle | Restgrenze / nächste Prüfung |
|---|---|---|
| Vorschlag gilt als Befund | Feste Liste, Beleg, Einzelprüfung; keine Diagnose/Dringlichkeit | Automation Bias und Verständnis ungemessen; T36 |
| Falsche Person / Verneinung / Zeit | Begrenzte Regeln, Statuswahl bei Unklarheit | Bekannte Negationsbereichsfehler T37; Kombinationen passen nicht vollständig in einen Exportstatus |
| Freier LLM-Text / erfundene Belege | LLM-Werkzeuge außerhalb der App; Guard erzwingt Form und Originalzitat | Wörtliche falsche Zuordnung bleibt möglich; kein klinischer Sicherheitstest |
| Schadcode in Notiz / Export | Escaping, CSP und bestehende Browserregression | Kein formales Security-Audit; Exporte müssen auch bei empfangenden Programmen als Daten behandelt werden |
| Geteiltes oder verlorenes Telefon | Keine App-Fallhistorie; neuer Fall setzt Daten zurück; Hintergrundunschärfe | Screenshot, entsperrter Bildschirm, Zwischenablage, Downloads, Druck und Betriebssystem liegen außerhalb dieser Kontrolle |
| Bewusste Übergabe | Prüfung und Einwilligung vor Export | Einwilligung in der Demo ersetzt keine organisatorische Rechtsgrundlage; QR-Inhalt ist unverschlüsselt und kopierbar |
| Falsche oder veraltete Einrichtung | Fiktive Daten kenntlich; Auswahl durch Person | Distanz/Zuständigkeit/Öffnung/Leistungsangebot nicht real belegt; T22 |
| Cache fehlt / gelöscht | Vollständige Paketprüfung und explizite Reparatur | Erster Download braucht Netz; Browser kann Cache verwerfen; T05 auf echter Zielhardware |
| Host / Update / Modell manipuliert | Lokale Assets, versionsbezogener Cache und Testhashes | Hashberichte sind Nachweise, keine Laufzeit-Signaturprüfung; kompromittierter Host kann beliebigen Code liefern |
| Verlust von Fällen bei Schließen | Bewusst keine dauerhafte Speicherung; Schließwarnung | RAM kann unerwartet verloren gehen, Mobilbrowserwarnung ist keine Garantie; T05 testen |
| Forschungsdaten/Goldlabels verzerrt | Synthetik und Urheberschaft dokumentiert | Keine Feldvalidierung; Testautoren kennen inzwischen Fehler; T34 und SFT-Split T38 |

## Vor einem echten Pilot

Betreiber und Empfangseinrichtung bestimmen Zugriffsrollen, Einwilligungs-/Rechtsgrundlage, Aufbewahrung, Geräteverwaltung, Verlustverfahren und Verantwortlichkeit für Inhalte. Gesundheits-/Datenschutzanforderungen müssen im konkreten kenianischen Einsatz geprüft werden. Keine automatische Folgerung „keine Speicherung = kein Datenschutzproblem“. Sicherheitsprüfung, Sprach-/Fachreview und Abbruchkriterien vor echten Fällen vereinbaren.

Nachweise: [Demo-Review](codex_demo_review.md), [Kontextreview](codex_context_review.md), [LLM-Review](../../llm/review_codex/README.md). Aus diesem Dokument folgt weder eine Zertifizierung noch ein produktiver Anschluss.
