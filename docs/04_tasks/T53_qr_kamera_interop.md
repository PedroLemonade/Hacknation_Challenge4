# T53 · QR-Übergabe mit echten Kameras und Kapazitätsgrenzen prüfen

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Peter + Codex**. Priorität: **P2**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

T05; fiktive bestätigte und freigegebene Entwürfe.

## Eingaben

- `app/app.js`
- `eval/browser_runs/20261004_final_v0417/browser_report.json`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: T05; fiktive bestätigte und freigegebene Entwürfe.

1. Ermittle tatsächlichen Payload, Kapazität, Unicode und Fehlerbehandlung aus aktuellem Code. Ein offline erzeugter QR allein beweist keinen eCHIS-Empfang.
2. Teste fiktive kurze/lange EN/SW/mixed Entwürfe, Emoji und Sonderzeichen auf zwei echten Kamera-/Scanner-Apps; Empfängeranzeige, Decoding und manuelle Alternative dokumentieren.
3. Prüfe offene/abgelehnte Einträge, Consentgate, keine URL mit Fallinhalt und sichtbare Trennung von Export und Synchronisation.
4. Bei nötigem Fix neu versionieren, Quell- und Browsernachweis erneuern; keine zusätzlichen personenbezogenen Felder oder externen QR-Dienste.

Ausgabe: eval/qr_device_runs/NEUER_ORDNER/
Fertig, wenn: Beide echten Geräte/Apps genannt, erkannte Grenzen und funktionierende manuelle Alternative.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

Bisher Browserprüfung; reales Kamera-Decoding offen.

## Prüfkriterium

Beide echten Geräte/Apps genannt, erkannte Grenzen und funktionierende manuelle Alternative.
