# T03 · GitHub Repo anlegen und hochladen
**Wo:** Claude Code (oder manuell) · **Dauer:** 10 Min · **Verbrauch:** Claude Code ca. 3 bis 5 %

## Variante A: manuell (empfohlen, kein Verbrauch)
1. Auf github.com → New repository → Name `afyanote` → **Public** → ohne README anlegen.
2. Im Terminal:
```bash
cd ~/Desktop/"Challenge 4"/01_Working_Demo_AfyaNote
git init
git add .
git commit -m "AfyaNote prototype: offline note to referral draft"
git branch -M main
git remote add origin https://github.com/DEINNAME/afyanote.git
git push -u origin main
```

## Variante B: Prompt für Claude Code
```text
Lies PROJECT.md. Hilf mir, diesen Ordner als neues öffentliches GitHub Repo "afyanote" hochzuladen.
Prüfe zuerst mit `git status`, dass keine geheimen Dateien (.env, Schlüssel) dabei sind.
Nutze die gh CLI falls angemeldet, sonst gib mir die Befehle zum Kopieren.
Committe nur, wenn ich es bestätige.
```

## Fertig wenn
Das Repo ist öffentlich und im privaten Browserfenster ohne Login sichtbar.
Im Tab **Actions** läuft der Check `check` automatisch und zeigt einen grünen Haken (Syntax, Parität, Auswertung). Falls rot: Log kopieren und Claude zeigen.
