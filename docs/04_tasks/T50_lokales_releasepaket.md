# T50 · Geprüftes lokales Demo-Paket ohne Trainingsgewichte vorbereiten

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Codex**. Priorität: **P1 vor Übergabe**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

Passende v0.4.17 Prüfungen, keine weitere Appänderung.

## Eingaben

- `README.md`
- `LICENSE`
- `eval/asset_runs/20261004_v0417/assets.json`
- `app/vendor/qrcode.js`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: Passende v0.4.17 Prüfungen, keine weitere Appänderung.

1. Erzeuge ein neues lokales ZIP mit app-Dateien, README, Lizenz und Herkunftshinweis. Keine .venv, Downloads, Trainingsgewichte, Rohdatensätze, privaten Notizen oder historischen Pakete hineinnehmen.
2. Liste jeden Eintrag mit SHA/Bytes und bindende App-/Browser-/Medienversion. Der aktuelle Klassifikator und eingebundene QR-Lizenz bleiben erhalten.
3. Entpacke ausschließlich in temporären neuen Ordner, prüfe Dateiinhalt, relative Assetpfade und keine externen Skripte. Kein automatisches Hosting, GitHub-Push oder Abgabe.
4. Schreibe Start-/Offlinehinweis: lokaler Macserver fürs Entwickeln; Telefon braucht erreichbaren sicheren Ursprung, Erstcache und echten Flugmodus-Test.

Ausgabe: releases/NEUER_ORDNER/
Fertig, wenn: Wiederherstellbares geprüftes Paket, vollständige Hashliste, keine Veröffentlichung behauptet.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

Lokale Erstellung geplant; Upload/Repo/Deploy bleiben bei Peter.

## Prüfkriterium

Wiederherstellbares geprüftes Paket, vollständige Hashliste, keine Veröffentlichung behauptet.
