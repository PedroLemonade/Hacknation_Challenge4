"""Build the local workspace guide, without moving files or changing app/data contents."""
from pathlib import Path
from collections import Counter, defaultdict
import datetime
import hashlib
import json
import os
import re
import sys
from current_evidence import app_hashes, find_browser, find_media

PROJECT = Path(__file__).resolve().parent.parent
ROOT = PROJECT.parent
META = ROOT / "00_Ordnung_und_Inventar"
META.mkdir(exist_ok=True)
EXCLUDED_DIRS = {".git", ".aws", ".codex", ".agents", "node_modules", "__pycache__", ".venv", ".cache"}
GENERATED = {
    "START_HIER.html", "01_Working_Demo_AfyaNote/START_HIER.html",
    "01_Working_Demo_AfyaNote/llm/review_codex/hub_browser_checks.json",  # Avoid a guide-QA/catalog self-reference.
    "01_Working_Demo_AfyaNote/eval/verification_codex/hub_browser_checks.json",
    "01_Working_Demo_AfyaNote/llm/training_codex/verification_20261004/hub_browser_checks.json",
    *["00_Ordnung_und_Inventar/" + f for f in ("dateiinventar.json", "identische_dateien.md", "erhaltungspruefung.json", "ordnungsbericht.md", "herkunftsaufnahme.json")],
}
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
read_json = lambda p: json.loads(p.read_text(encoding="utf-8"))
task_status = {}
for line in (PROJECT / "BACKLOG.md").read_text().splitlines():
    cols = [c.strip() for c in line.strip().strip("|").split("|")]
    if len(cols) >= 7 and re.fullmatch(r"(?:T|O|K|M|S)\d+", cols[0]):
        task_status[cols[0]] = cols[2]


def classify(rel):
    if rel.startswith("90_Archiv/"):
        return "Archiv", "Historischer Stand / Sicherung", "Für Rückblick und Wiederherstellung; nicht als aktueller Produktstand verwenden."
    if rel.startswith("03_Challenge_Unterlagen/"):
        return "Original", "Challenge-Unterlage", "Original-PDF bzw. Quellenwegweiser erhalten."
    if rel.startswith("02_Research_und_Planung/00_Originalinputs_von_Peter/"):
        return "Original", "Frühere Eingabe / Herkunft", "Ausgangspunkt erhalten; Aussagen sind nicht automatisch geprüft."
    if rel.startswith("02_Research_und_Planung/"):
        return "Referenz", "Research / Planung", "Hilfreicher Hintergrund; frühere Annahmen mit aktuellem Demo- und Quellenstand abgleichen."
    if not rel.startswith("01_Working_Demo_AfyaNote/"):
        return "Orientierung", "Wegweiser / Ordnung", "Hauptübersicht und Erhaltungsnachweise."
    short = rel.split("/", 1)[1]
    if short.startswith("app/"):
        return "Aktiv", "Ausgelieferte Demo", "Stabile Pfade erhalten; Änderungen brauchen passende Cache-Version und Prüfung."
    if short.startswith(("data/", "training/")):
        return "Aktiv", "Synthetische Daten / Training", "Entwicklung und Vergleich; keine klinisch oder muttersprachlich validierten Daten."
    if short == "llm/review_codex/baseline_guard.mjs":
        return "Historisch", "Claude-Guard vor Reparatur", "Nur Importpfad für reproduzierbare Fehlerprüfungen angepasst; nicht als aktueller Guard verwenden."
    if short == "docs/02_research/codex_claims_20261004.md":
        return "Nachweis", "Aktueller Quellen-/Claimcheck", "Primärquellen, Datum und Abrufgrenzen für Pitch und Machbarkeit; keine Partner- oder Feldfreigabe."
    if short.startswith("llm/training_runs/"):
        return "Nachweis", "Lokaler LLM-Trainingsversuch", "Runmanifest/Rohfehler beachten; synthetische Entwicklung, kein freigegebenes App-/Feldmodell."
    if short.startswith("llm/base_models/"):
        return "Baustein", "Drittanbieter-Basismodell", "Qwen-Commit und Lizenz erhalten; lokale INT4-Konvertierung, keine Browser-/Handydatei."
    if short.startswith("llm/sft_runs/"):
        return "Aktiv", "Synthetische LLM-SFT-Daten", "Getrennte Entwicklungssplits und Quellenbindung; fachlich/sprachlich ungeprüft."
    if short.startswith("llm/sft/"):
        return "Historisch", "Ursprüngliche Claude-SFT-Daten", "Bytegleich erhalten; 79 Devzeilen mit Notizüberlapp zum Training, nicht als unabhängige Evaluation verwenden."
    if short.startswith("llm/"):
        return "Optional", "LLM-Werkzeug / Experiment", "Separater Versuch; nicht Bestandteil der ausgelieferten App. Ergebnisstatus im llm/README prüfen."
    if short.startswith("eval/demo_baseline"):
        return "Historisch", "Reparierter Fehlerbeleg", "Absichtlich fehlerhafter früherer Stand; kein korrekter Musterexport."
    if short.startswith("eval/context_t31/baseline/"):
        return "Historisch", "Vorher-Stand v0.4.10", "Für T31-Vergleich erhalten; nicht als aktueller Regelstand oder aktuelle Prüfung ausgeben."
    if short.startswith("eval/context_t31/"):
        return "Nachweis", "Bekannte Kontextregression", "52 vor dem Fix geschriebene Fälle; jede 400er-Goldabweichung offenlegen. Keine unabhängige Sprach-/Fachvalidierung."
    if short.startswith(("eval/versioning_t33/before/", "eval/context_t37/before/")):
        return "Historisch", "Eingefrorener Vorherstand T33/T37", "Vor Reparatur erhaltene Originaldaten/-programme. Nicht als aktuelles Laufresultat verwenden."
    if short.startswith("eval/gold_review/"):
        return "Vorbereitung", "Menschlicher Sprach-/Fachreview", "Blinde Dateien und ungeprüfte KI-Fokaldrafts; kein freigegebenes Gold und kein Trainingsbestand."
    if short.startswith(("eval/context_t37/", "eval/versioning_t33/", "eval/runs/", "eval/baselines/", "eval/browser_runs/", "eval/deep_runs/", "eval/asset_runs/")):
        return "Nachweis", "Versionierte Regression / Fehlerlauf", "Laufstatus und sämtliche Quellhashes prüfen; Fehlruns bleiben erhalten. Bekannte synthetische Fälle, keine Geräte-/Sprachfreigabe."
    if short.startswith("integrations/"):
        return "Prototyp", "Lokaler Integrationsvertrag / Mock", "Kein verbundenes Versorgungssystem; fiktive Daten, exakte Quellen und Prüfaudit. Partnervertrag fehlt."
    if short.startswith("releases/"):
        return "Übergabe", "Lokales Demo-Paket", "Geprüfte Datei-/Lizenzzusammenstellung, keine Veröffentlichung oder Abgabe."
    if short.startswith("docs/06_pilot/"):
        return "Vorbereitung", "Bedienprobe / Pilotmaterial", "Moderator, fiktive Fälle und leere Messvorlage. Keine tatsächlichen Teilnehmer oder gemessenen Ergebnisse."
    if short.startswith("eval/demo_artifacts/"):
        return "Nachweis", "Fiktive Testausgabe", "Für Robustheits-/Exportprüfung; saubere Pitchbilder im aktuellen Aufnahmeordner bevorzugen."
    if short.startswith("eval/independent_") or short == "eval/independent.mjs":
        return "Nachweis", "Second-author-Test", "40 synthetische Notizen; unreviewtes Gold, bekannte Reparaturen als Regression. Eingefrorene Berichte erhalten."
    if short.startswith("eval/"):
        return "Nachweis", "Prüfung / Messergebnis", "Metrikdefinition und konkrete Code-/Datenversion beachten. Kein physischer Telefonbeleg."
    if short.startswith("docs/05_pitch/assets/codex_v0410/"):
        return "Nachweis", "Aufnahme v0.4.10", "Fiktiver Ablauf mit Quellmanifest; Desktop-Browser, simulierter Netzausfall, ohne Stimme."
    if re.match(r"docs/05_pitch/assets/codex_v\d+/", short):
        return "Nachweis", "Versionierte Browseraufnahme", "Erstellt durch Codex auf gemeinsamer App; vollständiges Quell-/Medienmanifest, kein physisches Telefon."
    if short.startswith("docs/05_pitch/assets/codex_review_v0411/"):
        return "Nachweis", "Aktualisierte Folien", "Claude-Deck plus ChatGPT/Codex-Faktenkorrekturen; 1080p-Render mit Manifest, keine App-/Handyaufnahme."
    if short.startswith(("docs/05_pitch/assets/", "docs/screenshots/")):
        return "Baustein", "Bild / Clip / Folie", "Weiterhin brauchbar; genauer App-Stand ohne Manifest nicht nachgewiesen. Vor Verwendung abgleichen."
    if short.startswith("docs/04_tasks/"):
        match = re.match(r"(T\d+)_", Path(short).name)
        status = task_status.get(match.group(1), "siehe BACKLOG") if match else "Eingabe"
        return "Aufgabe", "Auftrag: " + status, "Aktive Aufgaben-ID und Status gelten nur in diesem Projekt."
    if short.startswith("docs/02_research/"):
        return "Referenz", "Früherer Review / Research", "Projektkontext; aktuelle Umsetzung und Zahlen zusätzlich im Demo-Review lesen."
    if short.startswith("docs/03_plan/") and "worklog" in short:
        return "Protokoll", "Arbeitsverlauf / Koordination", "Für Übergabe und Nachvollziehbarkeit; aktuelle Entscheidung am Ende prüfen."
    if short.startswith("docs/05_pitch/"):
        return "Aktiv", "Pitch / Abgabeentwurf", "Sprechtext, Schnittplan oder Abgabetext; reale Aufnahme/Einreichung nicht daraus ableiten."
    if short.startswith("tools/"):
        return "Aktiv", "Hilfsprogramm / Vorlage", "Nur benötigte Werkzeuge ausführen; Ausgabeziel und Voraussetzungen prüfen."
    return "Aktiv", "Projektregeln / Dokumentation", "Aktuelle gemeinsame Arbeitsgrundlage."


files = []
for base, dirs, names in os.walk(ROOT):
    dirs[:] = sorted(d for d in dirs if d not in EXCLUDED_DIRS and not (Path(base) / d).is_symlink())
    for name in sorted(names):
        p = Path(base) / name
        rel = p.relative_to(ROOT).as_posix()
        if name == ".DS_Store" or p.is_symlink() or rel in GENERATED:
            continue
        category, kind, use = classify(rel)
        files.append({"path": rel, "bytes": p.stat().st_size, "sha256": sha(p), "category": category, "kind": kind, "use": use})
files.sort(key=lambda f: f["path"])
by_path = {f["path"]: f for f in files}
groups = defaultdict(list)
for f in files:
    groups[f["sha256"]].append(f)
duplicates = [group for group in groups.values() if len(group) > 1]
now = datetime.datetime.now(datetime.timezone.utc).isoformat()

origin_rules = read_json(META / "herkunftsregeln.json")


def documented_origin(path):
    for rule in origin_rules["rules"]:
        if (path in rule.get("paths", [])
                or any(path.startswith(prefix) for prefix in rule.get("prefixes", []))
                or (rule.get("regex") and re.search(rule["regex"], path))):
            return rule
    return origin_rules["fallback"]


origin_path = META / "herkunftsaufnahme.json"
refresh_origin = "--refresh-origin" in sys.argv or not origin_path.exists()
if refresh_origin:
    pinned = {}
    for f in files:
        rule = documented_origin(f["path"])
        pinned[f["path"]] = {"sha256": f["sha256"], "origin": rule["origin"],
                             "origin_group": rule["group"], "origin_note": rule["note"]}
    origins = {"created_at": now, "generated_by": "build_workspace_catalog.py (erstellt von ChatGPT / Codex)",
               "executing_agent": "Nicht automatisch erfasst; Bearbeiter im Worklog dokumentieren.",
               "basis": "Dokumentierte Beiträge laut Worklogs und Herkunftsregeln; keine vollständige Git-Autorenhistorie.",
               "rules_sha256": sha(META / "herkunftsregeln.json"), "files": pinned}
    origin_path.write_text(json.dumps(origins, ensure_ascii=False, indent=2) + "\n")
else:
    origins = read_json(origin_path)

for f in files:
    prior = origins["files"].get(f["path"])
    f["origin_basis_sha256"] = prior["sha256"] if prior else None
    if prior and prior["sha256"] == f["sha256"]:
        f.update({key: prior[key] for key in ("origin", "origin_group", "origin_note")})
    else:
        f["origin"] = "Neue Bearbeitung ungeklärt" if prior else "Noch nicht zugeordnet"
        f["origin_group"] = "Ungeklärt"
        f["origin_note"] = ("Frühere dokumentierte Version: " + prior["origin"] + ". Inhalt seit der Zuordnung geändert; neue Beiträge im Worklog prüfen."
                            if prior else "Neue Datei seit der Herkunftsaufnahme; Beiträge dokumentieren und gezielt zuordnen.")
origin_counts = dict(sorted(Counter(f["origin_group"] for f in files).items()))

baseline = read_json(META / "bestandsaufnahme_vorher.json")
moves = read_json(META / "verschiebungen.json")["moves"]
backup = "90_Archiv/02_Ordnungssicherung_20261004/"
preserved, unexpected = [], []
for old in baseline["files"]:
    target = old["path"]
    for move in sorted(moves, key=lambda m: len(m["from"]), reverse=True):
        if target == move["from"] or target.startswith(move["from"] + "/"):
            target = move["to"] + target[len(move["from"]):]
            break
    p = ROOT / target
    if p.is_file() and sha(p) == old["sha256"]:
        preserved.append({"original": old["path"], "present": target, "status": "moved_unchanged" if target != old["path"] else "unchanged"})
    elif (ROOT / (backup + old["path"])).is_file() and sha(ROOT / (backup + old["path"])) == old["sha256"]:
        preserved.append({"original": old["path"], "present": backup + old["path"], "status": "updated_guide_original_preserved"})
    else:
        unexpected.append({"original": old["path"], "expected": target, "reason": "Original content not found at retained/moved path or guide backup."})

frozen_paths = [f for f in baseline["files"] if f["path"].startswith(("01_Working_Demo_AfyaNote/app/", "01_Working_Demo_AfyaNote/data/", "01_Working_Demo_AfyaNote/training/", "01_Working_Demo_AfyaNote/docs/05_pitch/assets/codex_v0410/")) or f["path"] in {"01_Working_Demo_AfyaNote/eval/independent_notes.jsonl", "01_Working_Demo_AfyaNote/eval/independent_results.json", "01_Working_Demo_AfyaNote/eval/independent_results.md"}]
frozen_changed = [f["path"] for f in frozen_paths if not (ROOT / f["path"]).is_file() or sha(ROOT / f["path"]) != f["sha256"]]
check = {"created_at": now, "baseline_files": len(baseline["files"]), "preserved_count": len(preserved), "unexpected": unexpected, "preserved": preserved, "app_data_training_frozen_evaluation_and_current_media_changed": frozen_changed, "all_original_content_accounted_for": not unexpected}
audit_path = META / "erhaltungspruefung.json"
audit_now = "--audit-organisation" in sys.argv or not audit_path.exists()
if audit_now:
    audit_path.write_text(json.dumps(check, ensure_ascii=False, indent=2) + "\n")
else:
    # Normal future catalogue rebuilds must not redefine the historical organisation audit.
    check = read_json(audit_path)
    preserved, unexpected = check["preserved"], check["unexpected"]
    frozen_changed = check["app_data_training_frozen_evaluation_and_current_media_changed"]

inventory = {"created_at": now, "root": str(ROOT), "count": len(files), "bytes": sum(f["bytes"] for f in files), "origin_counts": origin_counts, "origin_snapshot_created_at": origins["created_at"], "excluded_directories": sorted(EXCLUDED_DIRS), "generated_outputs_excluded": sorted(GENERATED), "symlinks_followed": False, "files": files}
(META / "dateiinventar.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n")
md = "# Identische Dateien\n\nNach SHA-256 bitgleich, keine automatische Löschliste. Kopien in Snapshots erhalten Herkunft. App-/Trainingswörterbuch und AGENTS-/CLAUDE-/PROJECT-Dateien erfüllen unterschiedliche Zwecke. Ein identischer Researchtext ist kein zweiter unabhängiger Beleg.\n\n"
for number, group in enumerate(sorted(duplicates, key=lambda g: g[0]["path"]), 1):
    primary = min(group, key=lambda f: (not f["path"].startswith("01_Working_Demo_AfyaNote/"), f["path"]))
    md += f"## Gruppe {number} · {primary['bytes']:,} Bytes\n\n".replace(",", ".")
    md += f"Vergleichseinstieg: [{primary['path']}](../{primary['path'].replace(' ', '%20')})\n\n"
    md += "\n".join(f"- `{f['path']}` · {f['category']}" for f in group) + "\n\n"
(META / "identische_dateien.md").write_text(md)

browser = find_browser(PROJECT)
report, report_path, matches = browser if browser else ({}, None, False)
version = re.search(r'const VERSION = "([^"]+)"', (PROJECT / "app/sw.js").read_text()).group(1)
media = find_media(PROJECT)
capture_matches = bool(media and media['current'])
summary = f"""# Ordnungsbericht · 04.10.2026

Der aktive Projektstand bleibt `01_Working_Demo_AfyaNote`. Hauptübersicht: [START_HIER.html](../START_HIER.html), [Wegweiser](../00_LIES_MICH.md).

## Durchgeführt

- Sieben Archivobjekte (sechs TGZ-Dateien und ein ZIP-Ordner) unter `90_Archiv/01_Sicherungen_und_Transfers/` gebündelt. Dateinamen und Inhalte erhalten.
- 15 vorherige Wegweiser-/Status-/Hub-Dateien als frühere Fassungen gesichert.
- Originalen Chat-Research unverändert in den gemeinsamen Research-Ordner kopiert, mit Herkunft und Hash.
- Daten-, Prüf- und Medienhinweise ergänzt. Aktuelle Aufnahme mit Manifest von sonstigen weiterhin nutzbaren Bausteinen unterschieden.
- Durchsuchbaren Hauptkatalog und bitgleiche Kopien erfasst; keine automatische Deduplizierung vorgenommen.

## Erhaltung bei der Ordnerorganisation

Historische Ordnungsprüfung vom `{check['created_at']}`: Vorher **{len(baseline['files'])} Inhaltsdateien**. Nachgewiesen erhalten **{len(preserved)}**. Unerwartet fehlende/geänderte Originalinhalte **{len(unexpected)}**. App-, Daten-, Trainings-, eingefrorene Evaluations- und damalige aktuelle Mediendateien bei dieser Prüfung geändert **{len(frozen_changed)}**. Ein späterer Kataloglauf überschreibt diesen Nachweis nicht; spätere Entwicklungsänderungen werden dadurch nicht als unverändert behauptet.

## Aktueller Katalog und Demo-Abgleich

Aktueller katalogisierter Bestand: {len(files)} Dateien, {sum(f['bytes'] for f in files):,} Bytes. Ausgenommen Finder-/Cache-/geschützte Konfigurationsordner und erzeugte Katalog-/Hub-Dateien; keine vollständige System- oder Git-Inventur. Die Bestandsaufnahme und die Vergleichsregeln stehen in JSON-Dateien daneben.

Herkunft der Arbeit: [Claude und ChatGPT / Codex](../00_HERKUNFT_CLAUDE_CHATGPT.md). Dateigruppen: {', '.join(f'{group}: {count}' for group, count in origin_counts.items())}. Das sind Dateizahlen inklusive Kopien, keine Messung von Arbeitsaufwand oder Beitragsanteilen. Die Zuordnung ist an Inhalts-Hashes gebunden; neue oder geänderte Fassungen werden bis zur dokumentierten Aktualisierung als ungeklärt markiert.

App-Version: **{version}**. Browserbericht: {len(report.get('checks', []))} Checks, Status `{report.get('status')}`; Quellhashes passen zur App: **{'ja' if matches else 'nein'}**. Aufnahmehashes passen: **{'ja' if capture_matches else 'nein'}**. Das ist keine physische Telefon-/Sprach-/Fachfreigabe.

## Welche Inhalte weiterhelfen

Aktives Projekt und BACKLOG für Umsetzung, gehashte Prüfberichte für Messwerte, aktuelle Aufnahme für die Demo. Research/Fachdokumente als Ideen- und Prüfgrundlage; frühere Annahmen und alte Prototypzahlen abgleichen. Sicherungspakete und alte Projekte für Rückblick/Wiederherstellung. Gleiche Aufgaben-IDs im alten Prototyp nicht als aktuelle Aufträge ausführen.

## Noch externe Originaldatei

`/Users/peter/Downloads/afyanote-plan.html` bleibt am Originalort. macOS verweigerte den Inhaltzugriff auch nach freigegebener Ausführung. Es ist keine erfolgreiche Kopie behauptet; der Chat-Research und die schon vorhandenen Feasibility-/Planungsdokumente sind zentral verfügbar.

Katalog neu erzeugen: aus dem Projektordner `python3 tools/build_workspace_catalog.py`. Das Werkzeug verschiebt oder löscht selbst keine Dateien und trainiert kein Modell. Es behält den historischen Ordnungsnachweis bei; `--audit-organisation` ist nur für eine ausdrückliche erneute Prüfung gegen dieselbe Vorher-Bestandsaufnahme gedacht, nicht nach normalen Codeänderungen. Herkunft neu zuordnen mit `--refresh-origin` erst nach Prüfung der Worklogs und Aktualisierung der Herkunftsregeln. Verschiebungen zurückverfolgen: `verschiebungen.json`; vorherige Wegweiser: `90_Archiv/02_Ordnungssicherung_20261004/`.
"""
(META / "ordnungsbericht.md").write_text(summary)
payload = {"built": now, "files": [{k: f[k] for k in ("path", "bytes", "category", "kind", "use", "origin", "origin_group", "origin_note")} for f in files], "version": version, "checks": len(report.get("checks", [])), "reportMatches": matches and report.get("status") == "passed", "captureMatches": capture_matches, "media": media, "preserved": len(preserved), "before": len(baseline["files"]), "unexpected": len(unexpected)}
template = (PROJECT / "tools/workspace_portal_template.html").read_text()
(ROOT / "START_HIER.html").write_text(template.replace("/*__DATA__*/null", json.dumps(payload, ensure_ascii=False).replace("</", "<\\/")))
print(json.dumps({"catalog_files": len(files), "origin_counts": origin_counts, "origin_refreshed": refresh_origin, "identical_groups": len(duplicates), "preserved": len(preserved), "baseline": len(baseline["files"]), "unexpected": len(unexpected), "frozen_files_changed": len(frozen_changed), "app_matches_browser_report": matches}))
if audit_now and (unexpected or frozen_changed):
    raise SystemExit(1)
