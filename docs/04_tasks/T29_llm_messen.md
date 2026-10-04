# T29 · Optionaler lokaler LLM-Vergleich

> **Herkunft:** Claude-Grundfassung; Quellen-, Machbarkeits- und Versionsreview durch ChatGPT / Codex am 04.10.2026. Aktiver Stand: v0.4.11.

**Grundpaket:** Claude. **Mess-/Provenienzkorrektur:** ChatGPT/Codex. **Durchführung:** Peter, optional nach Demo/Abgabe-Nachweisen. Dauer und Downloadgröße hängen von Modell, Rechner und Netz ab; kein 20-Minuten-Versprechen.

Ollama installieren, gewählten lokalen Modelltag und tatsächliche Downloadgröße prüfen. Gemma 3 270M/1B sind ein definiertes erstes Kandidatenpaar, keine aktuelle Bestmodell-Empfehlung. Nur vorhandene synthetische Notizen. Cloudfunktionen deaktivieren und Ollama neu starten, gemäß [FAQ](https://docs.ollama.com/faq). Am Mac kann eine App-Installation Umgebungsvariablen erst nach Neustart übernehmen; keine laufende Instanz gleichzeitig überschreiben.

```bash
cd ~/Desktop/"Challenge 4"/01_Working_Demo_AfyaNote
ollama pull gemma3:270m
python3 llm/run_ollama.py --model gemma3:270m --limit 2 --output-dir llm/outputs/270m-smoke-01
python3 llm/run_ollama.py --model gemma3:270m --output-dir llm/outputs/270m-full-01
node llm/eval_llm.mjs --input-dir llm/outputs/270m-full-01 --report-dir llm/reports/270m-full-01
```

Für 1B dasselbe mit anderem Modelltag und neuen Ordnernamen. Verzeichnisnamen bei Wiederholung ändern; existierende Captures/Reports werden nicht überschrieben. Ein Fehlerstatus muss geprüft werden, nicht nur die Tabelle öffnen.

Bericht: vollständige 40/40 IDs, Ausfälle, Recall **58/63 als Klassifikatorreferenz**, Statusübereinstimmung und Zusatzbegriffe getrennt, exakte Notizen, Modelldigest, Quell-/Datenhashes, Rechner/OS, erstmalige und warme Laufzeiten. Guard akzeptiert nur die Form, keine richtige Interpretation. Loaded-model-size ist keine Peak-RAM-Messung; Macwerte belegen kein Telefonverhalten.

Fertig: neue vollständige vergleichbare Reports und Rohantworten, Grenzen dokumentiert. Selbsttestzeilen oder eine Teilmenge zählen nicht als LLM-Messung. Zahlen erst anschließend durch einen Agenten in Pitch/README übernehmen lassen; Appintegration ist ein separater Auftrag.
