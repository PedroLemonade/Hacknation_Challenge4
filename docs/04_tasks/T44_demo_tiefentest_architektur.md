# T44 · Demo vertieft prüfen und mobilen Betriebsweg erklären

Autor: **ChatGPT / Codex**, 04.10.2026. Zuständigkeit: **Codex**. Priorität: **P1**.
Status der Umsetzung steht verbindlich im [BACKLOG](../../BACKLOG.md); diese Datei beschreibt den Auftrag.

## Voraussetzung

T37.

## Eingaben

- `eval/demo-deep.cjs`
- `docs/03_plan/mobile_architecture_codex.md`

## Kopierbarer Prompt

```text
Lies AGENTS.md und BACKLOG.md im aktiven Projekt. Dieser Auftrag stammt von ChatGPT / Codex. Prüfe vorhandene Ergebnisse und laufende Prozesse zuerst; nichts doppelt ausführen.
Voraussetzungen: T37.

1. Prüfe EN/SW und hell/dunkel bei 320/360/390/768/1280 px in allen drei Tabs. Halte Layoutkonstellationen getrennt von funktionalen Prüfpunkten fest.
2. Prüfe literal behandelte Markup-Notizen, UTF-16-Belege, Tastatur-Auswahlpflicht, Dauerwerte und Quellen, Netzausfall mit Reload sowie blockierten Speicher/SW.
3. Fixe reproduzierte Probleme atomar auf dem aktuellen gemeinsamen UI-Stand. Cache-Version erhöhen, passende aktuelle Browserbelege und frische Fehlerläufe erhalten.
4. Erkläre: Mac-localhost ist nicht Telefon-localhost; Telefon-SW braucht sicheren Ursprung und zuerst geladenen Cache. Unterscheide Klassifikator-Webapp und Mac-MLX-LLM, prüfe aktuelle offizielle Laufzeitdokumentation.

Ausgabe: eval/deep_runs/20261004_final_v0417/
Fertig, wenn: 29 Prüfpunkte bestanden, 60 Layoutkonstellationen; App-Hashes passen. Tatsächliches Safari/Android/Installation/RAM/Batterie bleibt T05/T49.
Keine historischen Belege überschreiben. Status nur mit tatsächlichem Nachweis ändern. Danach Hub/Katalog nachvollziehbar aktualisieren; kein Commit, Deployment oder externes Messaging.
```

## Aktueller Übergabestand

04.10.: 29/29, 60 Layoutkonstellationen; Grid-/Suchfeldüberlauf und Dauer-Lückenanzeige repariert.

## Prüfkriterium

29 Prüfpunkte bestanden, 60 Layoutkonstellationen; App-Hashes passen. Tatsächliches Safari/Android/Installation/RAM/Batterie bleibt T05/T49.
