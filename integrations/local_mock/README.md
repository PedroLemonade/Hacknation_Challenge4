# T35 · Lokaler Übergabevertrag

**ChatGPT / Codex, 04.10.2026. Implementierter lokaler Mock.** App-JSON basiert auf Claude plus Codex; keine echte CHT-, eCHIS- oder FHIR-Schnittstelle verbunden. [Beispiel](fictional_envelope_v0417.json), [Nachweis](verification_v2.json), [Tests](test_report_v2.log).

Aus dem fiktiven Export `afyanote.referral-draft/0.3` entsteht `afyanote.local-handover-mock/1`. Quelle, ausgewählte Status, abgelehnte Vorschläge und Originalbelege bleiben erhalten. Reine lokale Dateien; kein Netzwerkcode. Die App bekommt weder Backend noch Fallpersistenz.

## Vertrag

| Quelle | Lokaler Umgang | Offene Frage für CHT/Empfänger |
|---|---|---|
| Originalnotiz, Beleg `start/end/text` | Exakte UTF-16-Spanne überprüft; Quelle vollständig kopiert | Zielformular und Zugriff auf Originalnotiz bestätigen |
| `main_problems`, `documented_absent`, `mentioned_other_person_or_past` | Status muss zur Gruppe und bestätigten Reviewentscheidung passen | Wie Nichtvorliegen, andere Person, Vergangenheit und Unklarheit getrennt abgebildet werden |
| `review_log` | Alle Einträge geprüft oder verworfen; Änderung verlangt Auditmarkierung | Verantwortliche Person und tatsächliche Authentifizierung fehlen |
| Dauer und Herkunft | Nur `stated` darf Dauer exportieren; ganze 1–365 Tage mit `note`/`asked_during_visit` | Unterschied zwischen Quellnotiz und nachgefragter Angabe bewahren |
| Alter, Einheit | Offen bleibt null; Wert und Jahre/Monate geprüft | Empfängerprofil, Dezimalalter und Identität |
| Einwilligung | Demonstrationshäkchen erforderlich | Rechtmäßiger Prozess und konkreter Verwendungszweck vom Betreiber festlegen |
| Einrichtungsdaten | Fiktive Werte erhalten, keine Verfügbarkeits-/Eignungsaussage | Reales Register, Aktualisierung, Berechtigungen und Pflichtfelder |
| Gerätezeit | Als unzuverlässige Geräteangabe bewahren | Zeitabgleich, tatsächliche Autor-/Serverzeit |
| Quelldokument | Kanonisierter SHA-256 für byteunabhängige Schlüsselreihenfolge | Das ist keine Patientenidentität oder vollständige Synchronisationslösung |

Unbekannte oder fehlende Root-/Item-/Reviewfelder werden abgewiesen; gleiches gilt für doppelte JSON-Schlüssel, NaN/Infinity, ungeprüfte Einträge, falsche Spannen, inkonsistente Gruppen und falsche Alterseinheiten. Das beweist strukturelle Konsistenz. Ein semantisch falscher Term mit passendem Zitat und bestätigter Entscheidung kann bestehen. Das Werkzeug ersetzt keine fachliche Prüfung.

## Reproduktion

```bash
python3 integrations/local_mock/test_adapter.py
python3 integrations/local_mock/adapter.py eval/browser_runs/20261004_final_v0417/artifacts/fictional-scope-draft.json --out integrations/local_mock/NEXT_FICTIONAL_ENVELOPE.json
```

21 Verträge bestanden; vorhandene Ausgabe wird nicht überschrieben. Tests nutzen echte fiktive Browserexports einschließlich Emoji-Spannen. Alle Fixtures sind Demonstrationsdaten. Vor einem anderen Schema einen neuen Adapter versionieren.

## Öffentliche Standards und Architekturentscheidung

CHT-Referenzstand: **5.3.1**, in der [offiziellen Versionsübersicht](https://docs.communityhealthtoolkit.org/releases/) zum Abruf am 04.10.2026 aufgeführt. Betreiberstand in Kenia ist unbekannt. Die [CHT-Architektur](https://docs.communityhealthtoolkit.org/technical-overview/architecture/cht-core/) und der [Offline-First-Ablauf](https://docs.communityhealthtoolkit.org/technical-overview/concepts/offline-first/) verwenden lokale PouchDB-Daten und Replikation zu CouchDB. Eine CHT-Einbettung braucht daher eine eigene Datenhaltungsentscheidung; AfyaNote hält den Fall bisher im RAM. Ohne tatsächliches Formular-/Kontaktprofil wird kein CHT-Datensatz behauptet oder erzeugt.

FHIR als spätere Alternative: [HL7 FHIR R4, Version 4.0.1, Composition](https://hl7.org/fhir/R4/composition.html) organisiert Dokumentinhalte; für ein Dokument gehört Composition zuerst in einen Dokument-Bundle. Ein Demonstrationshäkchen begründet keine klinisch attestierte finale Composition. Ressourcen, Profil, Terminologie, Identitäten und Autorenschaft sind Partnerfragen. Es werden keine diagnostischen Condition-Codes aus Begriffen erfunden. Der aktuelle Adapter implementiert unseren Mockvertrag.

MOH-100-Bezug ist weiterhin ein historischer Formularbezug aus dem Projekt, keine bestätigte aktuelle nationale Schnittstelle. Kein offizielles eCHIS-/Kenya-Zielformularprofil konnte hier belegt werden. Ein formales FHIR-/CHT-Conformance-Tool wurde nicht ausgeführt.

## Spätere Synchronisation

Vor Umsetzung entscheiden: Wer vergibt reale Record-/Patienten-/Visit-IDs? Welche Offline-Nutzer dürfen welche Daten speichern? Wo liegen Schlüssel? Welche Retention und Einwilligung gilt für Downloads/Queues? Transport-Wiederholung verwendet stabile Record-ID **plus Revision**; identischer Inhaltsdigest kann Retries erkennen, aber keine Identität ersetzen. Konflikte nicht automatisch überschreiben. Empfangsbestätigung, Authentifizierung, Wiederholung mit Backoff, Löschung/Widerruf und Versionsmigration benötigen separate Verträge. Keine Queue, Cloud oder automatische Weitergabe ist in dieser Phase hinzugefügt.


Aktualisierung v0.4.17: zusätzliche Fixtures für tatsächlich exportierten other_person, geänderten past-Status, verworfene Vorschläge, ungelösten Konflikt und nicht endliche JSON-Zahlen. [21 Prüfungen](test_report_v2.log), [aktueller fiktiver Mock](fictional_envelope_v0417.json), [Quell-/Prüfnachweis](verification_v2.json). Historischer 16er-Nachweis erhalten.
