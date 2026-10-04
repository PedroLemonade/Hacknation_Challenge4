# T51 · Realen Formular- und Empfängervertrag klären

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Peter + Codex**. Priorität: **P0 vor Integration**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

T35, benannter lokaler Partner und bestätigter Zugang.

## Eingaben

- `integrations/local_mock/README.md`
- `docs/03_plan/pilot_und_skalierung.md`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: T35, benannter lokaler Partner und bestätigter Zugang.

1. Peter beschafft aktuelle County/MOH/eCHIS-Felddefinitionen und zuständige fachliche Ansprechperson. Nicht selbst ungefragt Nachrichten schicken.
2. Dokumentiere bestätigte CHT-Version, Form-ID, Dokumenttyp, Feld-IDs, zulässige Status/fehlende Werte, UTF-16 oder andere Span-Konvention und feste Displaybegriffe. Historisches MOH100 ist keine aktuelle API.
3. Entscheide Rollen: Befundbetroffener, Reporter und CHP-Autor; Prüfaudit, Consent, Identität, Zeitzone, Versionskonflikt und Idempotenz mit echtem Vertrag.
4. Persistenz/Offlinequeue ist eigene Datenschutz-/Produktentscheidung. Retention, Auth, Wiederholung und Löschung vor einer Implementierung festlegen.
5. Nur nach Vertrag neue lokalmocked Fixtures und Mapping schreiben. Keine Symptomnotiz als diagnostische FHIR Condition kodieren.

Ausgabe: integrations/contracts/NEUER_ORDNER/
Fertig, wenn: Jedes gemappte Feld besitzt Quelle/Freigabe; ungelöste Fragen stehen ausdrücklich offen.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

Partnervertrag und reales Zielformular fehlen.

## Prüfkriterium

Jedes gemappte Feld besitzt Quelle/Freigabe; ungelöste Fragen stehen ausdrücklich offen.
