# T42 · Belege per Passage-ID auswählen und messen

Autor: ChatGPT / Codex. Begrenztes lokales Experiment nach den belegten Fehlversuchen mit freier Zitatausgabe.

```text
Lies aktuellen LLM-Trainingsreview, llm/training_codex/selection.py und den selection_v01-Datenrun. Originalnotizen/Gold unverändert lassen. Modell soll ausschließlich erlaubte Begriffe, Status, Dauer und eine vorhandene Passage-ID wählen. Ausgaben mit unbekannter ID, Zusatzfeldern, falschem Typ, doppeltem Begriff oder nicht belegter Dauer zurückweisen. Originalzitat deterministisch aus dem gewählten Originalspan holen, aber semantisch falsche Quellenwahl als eigene Fehlermetrik zählen. Train-/Dev-Familien und Quellhashes erhalten. Training mit geprüftem Loss-Maskenende, festem Seed, neuem Runordner und ohne Cloudtracker. Basismodell und gespeicherten Adapter mit identischen Eingaben auf dem vor Training eingefrorenen Dev-Ausschnitt vergleichen; vollständige bekannte 40er-Regression separat. Erfundene Zitate verhindern beweist keine richtige Begriff-/Personenzuordnung. Keine App-Anbindung, keine Diagnose/Dringlichkeit, keine automatischen Übernahmen. Nachweise, ungelöste Fehler und Wiederausführungsprompt speichern.
```

Fertig: gehashter Modelllauf, Decoder-/Bindingschecks und ehrliche Vergleichsergebnisse. Semantische und reale Geräteprüfung bleiben T40/T41.
