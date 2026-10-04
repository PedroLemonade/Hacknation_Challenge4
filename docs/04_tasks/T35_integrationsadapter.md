# T35 · Übergabeformat und lokalen Integrationsadapter konkretisieren

**Wer:** Codex. **Zeitpunkt:** nach Hackathon. **Ziel:** überprüfbarer Anschlussplan statt unbelegter eCHIS-/FHIR-Kompatibilitätsbehauptung.

## Kopierbarer Auftrag

```text
Lies AGENTS.md, pilot_und_skalierung.md, threat_model.md und einen aktuellen JSON-Export. Prüfe die aktuelle offizielle CHT- und HL7-FHIR-Dokumentation; nenne genaue Version und URLs. Recherchiere kenianische Zielformulare über offizielle öffentliche Quellen. Keine vermutete eCHIS-Schnittstelle erfinden.

1. Dokumentiere das bestehende Schema afyanote.referral-draft/0.3 mit Originalnotiz, Termen, assertion, Einzelentscheidungen, evidence start/end, Alterseinheit, fehlenden Feldern und simuliertem Consent. Unterscheide Transportvertrag und klinische Bedeutung.
2. Schreibe eine Mapping-Tabelle zu einem ausdrücklich gewählten Ziel: zunächst ein lokaler CHT-Mock oder ein FHIR-Dokument als Vorschlag. Jedes nicht belegte Mapping als offene Frage markieren. Keine diagnostischen Condition-Codes aus bloßen Symptomnotizen erzeugen.
3. Implementiere einen lokalen reinen Validator/Adapter mit fiktiven Fixtures: gültiger Entwurf, offene Felder, denied, other_person, past, verworfene Vorschläge, Widerspruch, ungültige evidence span, falsche Einheit, manipuliertes Schema. Bewahre Quelle und Auditspur; unbekannte Felder nach klarer Policy behandeln.
4. Entwirf spätere Offline-Synchronisation: Idempotenz, Identität, Versionskonflikte, Wiederholungen, Autorisierung, Consent und Löschfristen. Das erfordert eine separate Produktentscheidung, da die aktuelle App Falldaten ausschließlich im Speicher hält. Nicht beiläufig Persistenz oder Backend ergänzen.
5. Lege Artefakte und Architekturentscheidung unter integrations/ und docs/03_plan/ ab. Messwerte nur aus ausgeführten lokalen Tests. Keine echten Endpunkte aufrufen, Daten übertragen, Partner kontaktieren oder Deployment durchführen.
```

## Fertig wenn

Ein dokumentierter lokaler Vertrag, getestete Fixtures und eine explizite Liste offener Partnerfragen existieren. Der Adapter wird als Mock/Prototyp bezeichnet, bis das reale Zielsystem die Integration bestätigt.


## Umsetzung 04.10.2026 durch ChatGPT / Codex

04.10.: rein lokaler Mock für Schema 0.3, 21 Vertragschecks; exakte UTF-16-Belege/Audit/Consent. CHT/FHIR-Referenzen geprüft, echter Partnervertrag offen.

Nachweise und Grenzen: [Fortsetzungsreview](../03_plan/codex_continuation_review.md). Der ursprüngliche Auftrag oben bleibt für die Herkunft erhalten.
