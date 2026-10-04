"""ChatGPT / Codex: unpack own local ZIP temporarily, verify hashes and offline paths."""
import argparse, hashlib, json, re, tempfile, zipfile
from pathlib import Path
from html.parser import HTMLParser

p=argparse.ArgumentParser(description=__doc__);p.add_argument('directory',type=Path);a=p.parse_args()
directory=a.directory.resolve();m=json.loads((directory/'manifest.json').read_text());archive=directory/m['zip']['path']
assert hashlib.sha256(archive.read_bytes()).hexdigest()==m['zip']['sha256']
class References(HTMLParser):
    def __init__(self):super().__init__();self.refs=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag in {'script','img','link'}:
            v=d.get('src') or d.get('href')
            if v:self.refs.append(v)
with tempfile.TemporaryDirectory(prefix='afyanote-release-verify-') as t:
    root=Path(t)
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        assert all(not n.startswith('/') and '..' not in Path(n).parts for n in z.namelist())
        assert set(z.namelist())==set(m['files'])|{'PACKAGE_MANIFEST.json'}
        z.extractall(root)
    for name,v in m['files'].items():
        raw=(root/name).read_bytes();assert len(raw)==v['bytes'] and hashlib.sha256(raw).hexdigest()==v['sha256']
    app=root/'app';parser=References();parser.feed((app/'index.html').read_text())
    assert all('://' not in ref and not ref.startswith('//') for ref in parser.refs)
    assert all((app/ref).is_file() for ref in parser.refs)
    precache=json.loads(re.search(r'const FILES = (\[.*?\]);',(app/'sw.js').read_text(),re.S).group(1))
    assert all((app/('index.html' if ref=='./' else ref)).is_file() for ref in precache)
    actual={x.relative_to(app).as_posix():hashlib.sha256(x.read_bytes()).hexdigest() for x in app.rglob('*') if x.is_file()}
    assert actual==m['app_source_hashes']
result={'created_by':'ChatGPT / Codex','status':'passed','zip_sha256':m['zip']['sha256'],
        'temporarily_unpacked':True,'all_entry_hashes_match':True,'all_app_files_match':True,
        'html_asset_paths_valid':True,'offline_precache_paths_valid':True,'external_script_asset_references':0,
        'app_files':len(actual),'precache_urls':len(precache),'physical_phone':False,'published':False}
with (directory/'unpack_verification.json').open('x') as f:f.write(json.dumps(result,indent=2)+'\n')
print(json.dumps(result))
