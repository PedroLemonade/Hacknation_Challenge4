"""Builds START_HIER.html from BACKLOG.md, docs/04_tasks/*.md and the key docs. Run: python3 tools/build_hub.py"""
import os, json, re, datetime
import hashlib
from pathlib import Path
from current_evidence import find_browser, find_media
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read()

rows = []
for line in rd("BACKLOG.md").splitlines():
    if not line.startswith("| ") or line.startswith("| ID") or line.startswith("|---"):
        continue
    c = [x.strip() for x in line.strip().strip("|").split("|")]
    if len(c) < 7:
        continue
    tid, title, status, who, when, path, note = c[:7]
    md = rd(path) if path.endswith(".md") and os.path.exists(os.path.join(ROOT, path)) else ""
    rows.append({"id": tid, "title": title, "status": status, "who": who, "when": when, "path": path, "note": note, "md": md if path.startswith("docs/04_tasks") else ""})

DOCS = [("Was liegt wo (00_INDEX.md)", "00_INDEX.md"), ("Challenge in Kurzform", "docs/01_challenge/challenge_brief.md"),
        ("Aktuell: Demo-Tiefentest, Negationsbereiche und Anschlussarbeit", "docs/03_plan/codex_continuation_review.md"),
        ("Nächste Sitzung: priorisierte kopierbare Prompts", "docs/03_plan/next_session_prompts.md"),
        ("Telefon: App, Offlinebetrieb und Small-LLM-Laufzeiten", "docs/03_plan/mobile_architecture_codex.md"),
        ("T33: eingefrorene Baseline und neue Regression", "eval/versioning_t33/README.md"),
        ("T37: begrenzte Negationsbereiche und Restfehler", "eval/context_t37/README.md"),
        ("Menschliches Goldreview: 120 vorbereitete Notizen", "eval/gold_review/packet_20261004_v0416/README.md"),
        ("Lokaler Übergabeadapter: geprüfter Mock", "integrations/local_mock/README.md"),
        ("Bedienprobe: Material und leere Messvorlage", "docs/06_pilot/README.md"),
        ("Originalbrief/Kickoff erneut gelesen", "docs/02_research/challenge_recheck_20261004/README.md"),
        ("Claude / ChatGPT: Herkunft und Beiträge", "docs/00_organisation/herkunft_beitragsuebersicht.md"), ("Gemeinsame Ordner und Dateiregeln", "docs/00_organisation/ordner_und_dateiregeln.md"), ("Datenbestand: Zweck und Grenzen", "data/README.md"), ("Prüfungen und Nachweise: Wegweiser", "eval/README.md"), ("Medien: aktueller Stand und weitere Bausteine", "docs/05_pitch/assets/README.md"),
        ("Aktueller Codex Demo-Review", "docs/03_plan/codex_demo_review.md"), ("T31: Kontextreparatur und zusätzliche Prüfarbeit", "docs/03_plan/codex_context_review.md"), ("T31-Prüfdateien und frühere Fassungen", "eval/context_t31/README.md"), ("Demo-Probe und Nachweise", "docs/05_pitch/demo_rehearsal_codex.md"), ("Second-author-Test: Grenzen", "eval/independent_report_notes.md"),
        ("Aufnahme v0.4.10: Material und Grenzen", "docs/05_pitch/assets/codex_v0410/README.md"),
        ("LLM: tatsächliches Training, Fehler und nächste Schritte", "docs/03_plan/codex_llm_training_review.md"), ("LLM-Daten und Trainingsläufe", "llm/training_runs/README.md"),
        ("Claude-Dateien: Review und konkrete Verbesserungen", "docs/03_plan/codex_claude_review.md"), ("Quellen- und Claimcheck 04.10.", "docs/02_research/codex_claims_20261004.md"), ("LLM-Werkzeuge: Vertragsprüfungen und Grenzen", "llm/review_codex/README.md"), ("Aktuelle Folienbilder nach Review", "docs/05_pitch/assets/codex_review_v0411/README.md"), ("Plan und Entscheidungen", "docs/03_plan/plan.md"), ("Auswertung (eval/results.md)", "eval/results.md"),
        ("Antwort auf den Codex Review", "docs/02_research/codex_review_response.md"), ("Video Skripte", "docs/05_pitch/video_scripts.md"), ("Schnittplan Video", "docs/05_pitch/video_schnittplan.md"), ("Selbst Review", "docs/03_plan/self_review.md"), ("Bewertung Codex/ChatGPT Arbeit", "docs/02_research/bewertung_fremdarbeit.md"), ("Modellkarte", "docs/model_card.md"), ("Pilot und Skalierung", "docs/03_plan/pilot_und_skalierung.md"), ("Lokales LLM: wann und wie", "docs/03_plan/lokales_llm.md"),
        ("Folien", "docs/05_pitch/slides.md"), ("Abgabetexte", "docs/05_pitch/submission_texts.md"),
        ("UI Referenzen aus den Trainern", "docs/03_plan/ui_reference_notes.md"), ("Regeln für Agenten", "AGENTS.md")]
docs = [{"title": t, "path": p, "md": rd(p)} for t, p in DOCS if os.path.exists(os.path.join(ROOT, p))]

res = json.loads(rd("eval/results.json"))
m = res["meta"]
status = [
    f"Modell {m['model_bytes']:,} Bytes".replace(",", ".") + f", {m['features']} Merkmale, {m['labels']} Begriffe",
    f"Unbekannte Formulierungen F1: Modell {res['model']['test_heldout']['overall']['f1']} vs Stichwortliste {res['dictionary']['test_heldout']['overall']['f1']}",
    f"Tippfehler F1: Modell {res['model']['test_typo']['overall']['f1']} vs Stichwortliste {res['dictionary']['test_typo']['overall']['f1']}",
    f"Kontrasttests {sum(x['pass'] for x in res['contrast']['model'])}/{len(res['contrast']['model'])}, Parität Python/Browser 4,9e-7",
    "App: Tabs, Desktop Seitenleiste, Prüfschritt mit Auswahl Chips, Offline Karte der fiktiven Einrichtungen, ungeprüfte Swahili Oberfläche",
    "Desktop-Browserregression prüft Fallwechsel, Export und simulierten Netzausfall; kein physischer Telefon-/Sprachtest",
    "Vier aktualisierte Folienbilder mit Render-Manifest; ältere Demo-Clips bleiben Referenzen. Stimme, Telefonclip und Upload offen",
    "Neu: Wort Erklärung je Vorschlag, QR Übergabe ohne Netz, Live Vergleich Modell vs. Stichwortliste",
    "Claude berichtet frühere axe-Audits; kein neuer Audit in diesem Review. Sprach-/Nutzertest offen; CI-Konfiguration ist kein GitHub-Ausführungsnachweis",
    "Neu 01:35 (v0.4): Live Vorschau beim Tippen, Karte „Ask before you leave“ für Alter und Dauer, Tastatur Prüfung und zweispaltige Desktop Ansicht, Sichtschutz im Hintergrund",
]
# Display browser evidence only as current when every app file is covered and matches.
app_files = {p.relative_to(Path(ROOT)/"app").as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
             for p in (Path(ROOT)/"app").rglob("*") if p.is_file()}
reports = [Path(ROOT)/"eval/demo_regression_results.json", *sorted((Path(ROOT)/"eval/browser_runs").glob("*/browser_report.json"))]
valid = []
for report in reports:
    if not report.exists(): continue
    demo = json.loads(report.read_text())
    if demo.get("status") == "passed" and demo.get("checks") and all(c.get("status") == "passed" for c in demo["checks"]): valid.append((demo, report))
if valid:
    matching = [(d,p) for d,p in valid if d.get("source_after") == app_files and d.get("source_before") == app_files]
    demo, report = max(matching or valid, key=lambda pair: pair[0].get("created_at", ""))
    current = bool(matching)
    status.append(f"ChatGPT/Codex: {len(demo['checks'])} Browserchecks bestanden; " + ("alle App-Dateien stimmen mit dem geprüften Stand überein" if current else "historischer Bericht: App geändert oder Dateiabdeckung unvollständig, neue Prüfung nötig") + ". Kein reales Telefon geprüft.")
if os.path.exists(os.path.join(ROOT, "eval/context_t31/results.json")):
    context = json.loads(rd("eval/context_t31/results.json"))
    current = (context.get("rules_after_sha256") == hashlib.sha256(open(os.path.join(ROOT, "app/rules.js"), "rb").read()).hexdigest()
               and context.get("model_sha256") == hashlib.sha256(open(os.path.join(ROOT, "app/model.json"), "rb").read()).hexdigest()
               and context.get("cases_sha256") == hashlib.sha256(open(os.path.join(ROOT, "eval/context_t31/cases.json"), "rb").read()).hexdigest())
    if current:
        cases = context["policy"]["after"]
        status.append(f"ChatGPT/Codex T31: {sum(c['pass'] for c in cases)}/{len(cases)} Kontextfälle; bekannte Zeugenregel repariert. Auf Generatornotizen mehr Auswahlpflicht und geringere Statusübereinstimmung; kein unabhängiger Sprach-/Fachnachweis.")
status.append("Claude-Dateireview O03: 63 Vertragschecks ohne LLM. Danach: T38-Datensplit repariert und echte separate QLoRA-Experimente durch ChatGPT/Codex; Details im aktuellen Trainingsreview. Kein LLM in der App.")
t37_path = "eval/context_t37/runs/20261004_final_v0412/results.json"
if os.path.exists(os.path.join(ROOT, t37_path)):
    t37 = json.loads(rd(t37_path))
    if all((Path(ROOT)/p).is_file() and hashlib.sha256((Path(ROOT)/p).read_bytes()).hexdigest() == h for p,h in t37["source_hashes"].items()):
        counts = {k: sum(c["pass"] for c in v["after"]) for k,v in t37["cases"].items()}
        status.append(f"T37 auf passenden Regel-/Datenhashes: Policy {counts['policy']}/56, Modell {counts['model']}/56, Wörterbuch {counts['dictionary']}/56; alle 52 T31-Fälle erhalten. Zwei fragliche KI-Erwartungen unverändert, keine Sprach-/Fachfreigabe.")
deep = find_browser(Path(ROOT), "deep_runs", "report.json")
if deep:
    d,p,current = deep
    status.append(f"Vertiefte Prüfung: {len(d['checks'])} bestandene Prüfpunkte mit 60 Layoutkonstellationen; " + ("alle App-Hashes passen" if current else "historischer Stand, Hashes passen nicht") + ". Desktop-Chrome, kein echtes Telefon.")
status.append("Vorbereitet: 120 Reviewnotizen in 30 Familien, 21 lokal geprüfte Adapterverträge und Material für eine tatsächliche Bedienprobe. Menschliche Durchführung bleibt offen.")
media = find_media(Path(ROOT))
payload = json.dumps({"rows": rows, "docs": docs, "status": status, "media": media, "built": datetime.datetime.now().strftime("%d.%m. %H:%M")}, ensure_ascii=False).replace("</", "<\\/")
out = rd("tools/hub_template.html").replace("/*__DATA__*/null", payload)
open(os.path.join(ROOT, "START_HIER.html"), "w", encoding="utf-8").write(out)
print(f"START_HIER.html written: {len(rows)} backlog rows, {len(docs)} docs, {len(out)} bytes")
