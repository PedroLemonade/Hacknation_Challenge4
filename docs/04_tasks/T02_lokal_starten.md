# T02 · Lokal starten und einmal durchklicken
**Wo:** Du (Terminal in VS Code/PyCharm) · **Dauer:** 10 Min · **Verbrauch:** keiner

## Befehle
```bash
cd ~/Desktop/"Challenge 4"/01_Working_Demo_AfyaNote/app
python3 -m http.server 8000
```
Dann im Browser `http://localhost:8000` öffnen.

## Durchklicken
1. Ein paar Wörter ins Notizfeld tippen, z. B. „mtoto ana homa“: Unter dem Feld erscheinen live die erkannten Begriffe.
2. Beispiel „Kiswahili“ → „Suggest fields“.
3. Jede Karte bestätigen oder ablehnen, Alter bestätigen. Unten erscheint „Ask before you leave“: bei „Cough“ eine Zahl eintragen → Next.
4. Fallnummer, Geschlecht, Einwilligung → Next.
5. Entwurf ansehen, „Copy text“ testen.
6. Unten „↺ New case“, dann Beispiel „Hard case“: Fieber zeigt „conflicting statements“, erst nach Wahl eines Status lässt es sich bestätigen.
7. Unten „Facilities“: Karte, Suche, Filter, Einrichtung antippen.
8. Oben auf „SW“ tippen: Oberfläche wechselt auf Swahili.
9. Am Mac Fenster breit ziehen: Seitenleiste erscheint. Sehr breit (ab 1200 px) steht im Prüfschritt die Notiz links, die Karten rechts; Tasten 1 bis 4, Enter und X funktionieren.

## Optional: Pipeline selbst laufen lassen
```bash
cd ~/Desktop/"Challenge 4"/01_Working_Demo_AfyaNote
python3 -m pip install scikit-learn numpy
python3 training/generate_data.py && python3 training/train.py
node eval/parity.mjs && node eval/eval.mjs
```

## Fertig wenn
Der Ablauf funktioniert ohne Fehlermeldung. Falls etwas hakt: Fehlertext notieren und T06 nutzen.
