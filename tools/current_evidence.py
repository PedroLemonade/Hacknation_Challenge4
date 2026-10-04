"""ChatGPT / Codex: full-file binding for local browser and media evidence."""
import hashlib
import json

def app_hashes(root):
    app = root / 'app'
    return {p.relative_to(app).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in app.rglob('*') if p.is_file()}

def load_json(path):
    try: return json.loads(path.read_text())
    except (OSError, ValueError): return None

def matches_sources(report, hashes):
    return bool(hashes) and report.get('source_before') == hashes and report.get('source_after') == hashes

def find_browser(root, directory='browser_runs', filename='browser_report.json'):
    hashes = app_hashes(root)
    paths = list((root / 'eval' / directory).glob('*/' + filename))
    if directory == 'browser_runs': paths.append(root / 'eval/demo_regression_results.json')
    valid = []
    for p in paths:
        r = load_json(p)
        if r and r.get('status') == 'passed' and isinstance(r.get('checks'), list) and r['checks'] and all(c.get('status') == 'passed' for c in r['checks']):
            valid.append((r, p))
    current = [(r, p) for r, p in valid if matches_sources(r, hashes)]
    if not valid: return None
    r, p = max(current or valid, key=lambda pair: pair[0].get('created_at', ''))
    return r, p, bool(current)

def find_media(root):
    hashes = app_hashes(root)
    valid = []
    for p in (root / 'docs/05_pitch/assets').glob('codex_*/capture_manifest.json'):
        r = load_json(p)
        meta = load_json(p.parent / 'media_manifest.json')
        video = p.parent / 'demo_mobile.mp4'
        if not r or not meta or not video.is_file(): continue
        files = meta.get('files', {})
        entry = files.get('demo_mobile.mp4') if isinstance(files, dict) else next((f for f in files if f.get('file') == 'demo_mobile.mp4'), None) if isinstance(files, list) else None
        # New manifests include the output digest, not just a capture source.
        if isinstance(entry, dict) and entry.get('sha256') != hashlib.sha256(video.read_bytes()).hexdigest(): continue
        valid.append((r, p, meta))
    if not valid: return None
    current = [(r, p, m) for r, p, m in valid if matches_sources(r, hashes) and m.get('version') == r.get('version')]
    r, p, meta = max(current or valid, key=lambda row: row[0].get('created_at', ''))
    return {'version': r['version'], 'videoPath': (p.parent / 'demo_mobile.mp4').relative_to(root).as_posix(),
            'current': bool(current), 'duration_seconds': meta.get('duration_seconds'),
            'capturePath': p.relative_to(root).as_posix()}
