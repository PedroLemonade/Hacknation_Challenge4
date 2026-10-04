# AfyaNote · Arbeitsgrundlage für Claude Code und Codex

Diese Datei ist identisch in PROJECT.md, CLAUDE.md und AGENTS.md. Lies sie vor jeder Aufgabe. Überblick über alle Dateien: `00_INDEX.md`. Aufgabenstatus: `BACKLOG.md`.

## Wenn Peter „mach weiter“ oder „was ist offen?“ schreibt
1. `BACKLOG.md` lesen.
2. Erste Zeile mit Status `offen` nehmen, deren Spalte „Wer“ zu dir passt. Aufgaben für Peter nur ansagen.
3. Die verlinkte Task Datei lesen und genau das tun, nicht mehr.
4. Danach in `BACKLOG.md` Status und Notiz aktualisieren und `python3 tools/build_hub.py` ausführen.
5. Kurz berichten: was erledigt ist, was als Nächstes kommt.

## Ziel
Hackathon Prototyp (Hack Nation, Challenge 4 World Bank, Health). Offline Web App für Community Health Promoters in Kenia: kurze Swahili/Englisch Besuchsnotiz → belegte Vorschläge → Mensch prüft → Entwurf orientiert an MOH 100 Abschnitt A.
Abgabe: So 4. Okt 2026, 15:00 Berlin (9:00 ET).

## Harte Regeln (nicht verhandelbar)
1. Keine Diagnose, keine Dringlichkeit, kein „heute überweisen“, kein „sicher/gesund“ Zustand.
2. Keine generierten medizinischen Texte. Nur feste Begriffsliste plus wörtliche Belegstelle.
3. Jeder Vorschlag braucht Bestätigen oder Ablehnen. Export erst nach Prüfung und Einwilligung.
4. Falldaten nur im Arbeitsspeicher. Kein localStorage/IndexedDB/Server für Falldaten.
5. Keine externen Skripte, Fonts oder CDNs. Alles muss offline aus dem Cache laufen.
6. Nach jeder Änderung an Dateien in app/: VERSION in app/sw.js hochzählen.
7. Nach jeder Änderung an Modell, Regeln oder Daten: Pipeline laufen lassen (siehe unten) und eval/results.md mit committen. Keine Zahl im README ohne Quelle in eval/results.md.
8. Nicht selbst committen oder pushen. Peter committet.
9. Nichts behaupten, was nicht gemessen ist (Sprache, Gerät, Zeitersparnis).

## Dateien und Zuständigkeit
| Bereich | Dateien | Wer ändert |
|---|---|---|
| Daten und Modell | training/*, data/*, app/model.json, app/classify.js | Codex |
| Regeln und Auswertung | app/rules.js, eval/* | Codex oder Claude Code, nie gleichzeitig |
| Oberfläche | app/index.html, app/app.js, app/i18n.js, app/sw.js, app/manifest.webmanifest, app/facilities.json | Claude Code |
| Doku und Status | README.md, docs/*, BACKLOG.md, 00_INDEX.md | alle, nur eigene Zeilen in BACKLOG.md ändern |

## Befehle

Daten/Modell nur neu erzeugen, wenn die konkrete Task das verlangt. Regel-/UI-Fixes dürfen unveränderte Trainings-/Goldbestände nicht beiläufig regenerieren. Aktuelle Kontrollläufe: node eval/test_benchmark_t33.mjs, node eval/test_scope_t37.mjs, node eval/parity.mjs und node eval/eval.mjs. Versionierte Browserläufe brauchen den laufenden lokalen Server.

```bash
python3 training/generate_data.py
python3 training/train.py
node eval/parity.mjs        # muss pass:true zeigen
node eval/eval.mjs          # schreibt eval/results.md und app/build_info.json
cd app && python3 -m http.server 8000
python3 eval/e2e.py http://localhost:8000/ /tmp   # Browser Test inkl. Offline Neustart
```

## Stand (04.10.2026, Weiterarbeit durch ChatGPT / Codex)
* App v0.4.17, gemeinsam: Claude-S04-About-/Pitcharbeit um 09:05 erhalten; Codex ergänzte T37-Regelreparatur, kleine CSS-/Dauer-Lückenfixes und aktuelle Nachweise. 39 Browserchecks plus 29 Tiefenprüfpunkte mit 60 Layoutkonstellationen; alle 15 App-Dateien gehasht. Keine physische Telefon-/Sprach-/Fachfreigabe.
* T33 fertig: reguläre Auswertung braucht --out eval/runs/FRISCHER_NAME; vorhandene Ziele werden verweigert. Originale 40er-Berichte/Gold unverändert. Aktuelle 40/400-Runs: eval/runs/20261004_final_v0417_40 bzw. _400.
* T31 historisch erhalten; T37 hält alle 52 T31-Fälle. Neue 56 T37-Fälle: Policy 54, Modell 53, Wörterbuch 49. Zwei zweifelhafte KI-Erwartungen unverändert; keine KI-Goldänderung zur Scoreverbesserung. 61 zusätzliche Term-Scope-Verträge.
* Aktuelle Aufnahme docs/05_pitch/assets/codex_v0417/: 75,56 Sekunden ohne Stimme, acht Bilder, vollständiger Quell-/Mediennachweis. Frühere Aufnahmen nicht überschreiben.
* T34/T35/T36-Material fertig: 120 blinde Reviewnotizen in 30 Familien, 21 geprüfte lokale Adapterverträge und sechs fiktive Bedienprobe-Fälle. Menschliche Freigabe, reales Versorgungssystem und tatsächliche Probe bleiben offen.
* O03, T38, T39 und T42 abgeschlossen: Claude-Dateien verbessert, Familiensplit repariert, drei echte lokale QLoRA-Läufe mit negativen Semantikergebnissen gesichert. T47 ist der weitere kontrollierte 1.500-Update-Lauf; zuerst Plan/Log/Manifest prüfen und niemals doppelt starten. Kein LLM in der App.
* Aktueller Review: docs/03_plan/codex_continuation_review.md. Priorisierte nächste Sitzung: docs/03_plan/next_session_prompts.md. Aufgaben bis T55 liegen einzeln als MD vor.
* Vor jeder Änderung aktuelle Dateien und beide Worklogs lesen. Claude war zunächst als inaktiv angekündigt; ein neuer Worklog belegt spätere Arbeit. Kein Rücksetzen auf eine alte gemeinsame Kopie. Nutzerauftrag kann den Standard „genau eine Task“ ausdrücklich erweitern; Abschlüsse trotzdem pro Task belegen.
* Katalog/Herkunft eine Ebene darüber; .venv/.cache vom Katalog ausgeschlossen, Base-/Trainingsweights für Repository-Push ignoriert. Keine laufenden Modellpfade verschieben. Ursprüngliche Herkunft bleibt getrennt vom ausführenden Agenten.

## Bekannte Grenzen
* Ein subjektloser Folgesatz nach einer anderen/unklaren Person verlangt Auswahl. Sonstige subjektlose Notizen verwenden weiter eine Patienten-Konvention. Rollen-/Berichts-/Begleitmuster und Pronomen sind begrenzt; kein allgemeiner Grammatikparser.
* T37 verwendet begrenzte Verneinungsbereiche pro festem Begriff und kontrollierte Koordination. „Child has cough without fever“ ist repariert. Modalität, Berichte, kombinierte Zeit/Person und mehrfache Dauer bleiben begrenzt; ein einzelner Exportstatus kann nicht alle Dimensionen ausdrücken. Zweifelsfälle verlangen menschliche Wahl. Siehe docs/03_plan/codex_continuation_review.md.
* Kikuyu und andere Sprachen nicht unterstützt.
* Alle Daten synthetisch, kein Review durch Muttersprachler oder Kliniker.
