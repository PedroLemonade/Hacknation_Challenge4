"""Record local static-file sizes and hashes, without claiming RAM or HTTP benchmarks."""
from pathlib import Path
import datetime
import gzip
import hashlib
import json
import re
import argparse

root = Path(__file__).resolve().parent.parent
app = root / "app"
args_parser = argparse.ArgumentParser(description=__doc__)
args_parser.add_argument('--out', type=Path, required=True, help='Fresh directory under eval/asset_runs; existing targets are rejected.')
args = args_parser.parse_args()
target = (root / args.out).resolve()
allowed = (root / 'eval/asset_runs').resolve()
if target == allowed or allowed not in target.parents:
    args_parser.error('--out must be a fresh subdirectory of eval/asset_runs.')
if target.exists():
    args_parser.error('Output already exists; no historical manifest overwritten.')
sw = (app / "sw.js").read_text()
version = re.search(r'const VERSION = "([^"]+)"', sw).group(1)
cache_urls = json.loads(re.search(r"const FILES = (\[.*?\]);", sw, re.S).group(1))
precache_files = sorted({"index.html" if p == "./" else p for p in cache_urls})
files = []
for name in sorted(set(precache_files) | {"sw.js"}):
    raw = (app / name).read_bytes()
    files.append({"file": name, "bytes": len(raw), "sha256": hashlib.sha256(raw).hexdigest(),
                  "precache": name in precache_files, "gzip_bytes": len(gzip.compress(raw, mtime=0))})
all_app_hashes = {p.relative_to(app).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in app.rglob('*') if p.is_file()}
reports = []
for p in (root / 'eval/browser_runs').glob('*/browser_report.json'):
    r = json.loads(p.read_text())
    if r.get('status') == 'passed' and r.get('checks') and all(c.get('status') == 'passed' for c in r['checks']) and r.get('source_before') == all_app_hashes and r.get('source_after') == all_app_hashes:
        reports.append((r, p))
if not reports:
    args_parser.error('No passing browser report covering and matching every current app file.')
report, report_path = max(reports, key=lambda pair: pair[0].get('created_at', ''))
matching = True
manifest = {
    "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(), "version": version,
    "unique_asset_bytes": sum(f["bytes"] for f in files),
    "unique_precache_bytes": sum(f["bytes"] for f in files if f["precache"]),
    "sum_individual_gzip_bytes": sum(f["gzip_bytes"] for f in files),
    "http_gzip_measured": False, "peak_ram_measured": False,
    "browser_report_created_at": report.get("created_at"), "browser_report_source_hashes_match": matching,
    "browser_report": report_path.relative_to(root).as_posix(), "source_hashes": all_app_hashes,
    "note": "Unique shipped static files including the service worker. Cached root and index.html share content but occupy separate cache entries. Gzip is a file-compression estimate, not observed HTTP transfer. The passing browser report covers all current app files before and after the run.",
    "files": files,
}
target.mkdir(parents=True, exist_ok=False)
(target / 'assets.json').write_text(json.dumps(manifest, indent=2) + "\n")
print(json.dumps({key: manifest[key] for key in ("version", "unique_asset_bytes", "sum_individual_gzip_bytes", "browser_report_source_hashes_match")}))
