"""ChatGPT / Codex: fresh local demonstration ZIP with verified app/evidence; no publishing."""
import argparse, datetime, hashlib, json, re, zipfile
from pathlib import Path
from current_evidence import app_hashes, find_browser, find_media

ROOT = Path(__file__).resolve().parent.parent
sha = lambda data: hashlib.sha256(data).hexdigest()
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--out', type=Path, required=True)
args = parser.parse_args()
out = (ROOT / args.out).resolve()
allowed = ROOT / 'releases'
if allowed not in out.parents or out.exists(): parser.error('Use a fresh directory under releases/.')
browser = find_browser(ROOT)
deep = find_browser(ROOT, 'deep_runs', 'report.json')
media = find_media(ROOT)
if not browser or not browser[2] or not deep or not deep[2] or not media or not media['current']:
    parser.error('Complete current browser/deep/media evidence required before packaging.')
hashes = app_hashes(ROOT)
version = re.search(r'const VERSION = "([^"]+)"', (ROOT/'app/sw.js').read_text()).group(1)
entries = {'app/' + name: (ROOT/'app'/name).read_bytes() for name in sorted(hashes)}
for name in ['README.md','LICENSE','docs/model_card.md']:
    entries[name] = (ROOT/name).read_bytes()
entries['EVIDENCE/browser_report.json'] = browser[1].read_bytes()
entries['EVIDENCE/deep_report.json'] = deep[1].read_bytes()
entries['EVIDENCE/capture_manifest.json'] = (ROOT/media['capturePath']).read_bytes()
notice = f'''# AfyaNote local demonstration package · {version}

Prepared by ChatGPT / Codex. The app is joint Claude + ChatGPT/Codex work.
The unchanged 249,284-byte character-ngram classifier and original training were created by Claude.
Codex implemented disclosed review/export/offline/context repairs and generated these browser proofs.
The QR library retains Kazuhiko Arase's embedded copyright/license notice in app/vendor/qrcode.js.
Project LICENSE is included; external WHO source terms retain their source terms of use.
Qwen weights, MLX runtime, synthetic training corpora and original challenge PDFs are NOT shipped here.

Synthetic demonstration only. No clinical/native-language/physical-phone approval.
39 current browser checks, 29 deep checks including 60 layout combinations; actual reports included.
Media source manifest included; video is separately available in the working workspace.
No repository push, deployment, upload or live system integration has occurred through this tool.

For development: serve app/ locally, e.g. python3 -m http.server 8000 --directory app.
On a phone localhost refers to that phone. A reachable secure origin, initial cached load
and an actual airplane-mode/OS-restart test are separate requirements. Use fictional data.
Case information is in page memory only; explicit downloads/clipboard/QR leave that memory boundary.

README/model card document references are workspace references; not all referenced research,
training, reports and pitch assets are included in this deliberately bounded package.
'''
entries['SOURCE_NOTICE.md'] = notice.encode()
manifest = {'created_at':datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'created_by':'ChatGPT / Codex','version':version,'status':'local_package_only',
            'published':False,'clinical_validation':False,'physical_phone':False,
            'app_source_hashes':hashes,'files':{name:{'bytes':len(data),'sha256':sha(data)} for name,data in entries.items()}}
entries['PACKAGE_MANIFEST.json'] = (json.dumps(manifest,indent=2)+'\n').encode()
out.mkdir(parents=True,exist_ok=False)
archive = out/'afyanote-demo.zip'
with zipfile.ZipFile(archive,'x',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for name,data in entries.items(): z.writestr(name,data)
# Check contents directly: traversal, unplanned extras, and altered source bytes rejected.
with zipfile.ZipFile(archive) as z:
    assert set(z.namelist()) == set(entries)
    assert all(not n.startswith('/') and '..' not in Path(n).parts for n in z.namelist())
    assert z.testzip() is None
    for name,data in entries.items(): assert z.read(name) == data
assert app_hashes(ROOT) == hashes, 'App changed during release; package is no longer current.'
manifest['zip']={'path':archive.name,'bytes':archive.stat().st_size,'sha256':sha(archive.read_bytes())}
manifest['verification']={'entries':len(entries),'all_source_bytes_match':True,'crc_ok':True,'no_unplanned_files':True}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
(out/'README.md').write_text('# Local demonstration package\n\n[ZIP](afyanote-demo.zip), [manifest](manifest.json). Prepared by ChatGPT / Codex on joint app '+version+'.\n\nVerified entry list, CRC and all source bytes; no runtime/weights/clinical data or original PDFs shipped. No publication. See SOURCE_NOTICE.md in ZIP for startup and provenance.\n')
print(json.dumps({'version':version,'zip_bytes':archive.stat().st_size,'entries':len(entries),'published':False}))
