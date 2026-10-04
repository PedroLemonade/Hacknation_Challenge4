"""Claude Ollama harness, improved by ChatGPT / Codex: loopback-only, immutable captures, provenance.
Uses only repository synthetic notes. Disable Ollama cloud separately (OLLAMA_NO_CLOUD=1).
A mock-server test validates the harness; it is not an LLM or hardware benchmark.
"""
import argparse
import datetime
import hashlib
import ipaddress
import json
from pathlib import Path
import platform
import re
import time
import urllib.parse
import urllib.request

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SETS = {"independent": ROOT / "eval/independent_notes.jsonl", "notes": ROOT / "data/notes_test.jsonl"}

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError("Redirect refused: this harness must use the configured local endpoint")

# Ignore HTTP proxy environment variables; requests must go straight to loopback.
OPENER = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())

def validate_host(value):
    u = urllib.parse.urlsplit(value)
    try:
        loopback = u.hostname == "localhost" or ipaddress.ip_address(u.hostname or "").is_loopback
    except ValueError:
        loopback = False
    if u.scheme != "http" or not loopback or u.username or u.password or u.path not in ("", "/") or u.query or u.fragment:
        raise ValueError("Use an HTTP loopback Ollama endpoint such as http://localhost:11434")
    return value.rstrip("/")

def request(host, path, body=None, timeout=10):
    data = None if body is None else json.dumps(body).encode("utf-8")
    req = urllib.request.Request(host + path, data=data, headers={"Content-Type": "application/json"})
    with OPENER.open(req, timeout=timeout) as response:
        return json.loads(response.read())

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--set", default="independent", choices=SETS)
    ap.add_argument("--host", default="http://localhost:11434")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--request-timeout", type=float, default=120)
    ap.add_argument("--output-dir", type=Path)
    a = ap.parse_args()
    if a.limit < 0 or a.request_timeout <= 0:
        ap.error("Limit must be nonnegative; request timeout must be positive")
    try:
        host = validate_host(a.host)
    except ValueError as e:
        ap.error(str(e))
    if "cloud" in a.model.lower():
        ap.error("Cloud models are outside this local experiment")
    tags = request(host, "/api/tags").get("models", [])
    name = a.model if ":" in a.model else a.model + ":latest"
    tag = next((m for m in tags if m.get("name") == name or m.get("model") == name), None)
    if not tag:
        ap.error("Model is not installed locally; install it explicitly before this run")
    if tag.get("remote_host") or tag.get("remote_model"):
        ap.error("Remote-backed models are outside this local experiment")
    schema = json.loads((HERE / "schema.json").read_text())
    system = (HERE / "prompt.txt").read_text() + "\nOutput schema: " + json.dumps(schema)
    shots = json.loads((HERE / "fewshot.json").read_text())
    messages = [{"role": "system", "content": system}]
    for shot in shots:
        messages += [{"role": "user", "content": shot["note"]}, {"role": "assistant", "content": json.dumps(shot["out"], ensure_ascii=False)}]
    dataset = [json.loads(l) for l in SETS[a.set].read_text().splitlines() if l.strip()]
    notes = dataset[:a.limit] if a.limit else dataset
    now = datetime.datetime.now(datetime.timezone.utc)
    run = now.strftime("%Y%m%dT%H%M%S%fZ")
    folder = a.output_dir or HERE / "outputs" / run
    filename = re.sub(r"[^a-zA-Z0-9.]+", "_", a.model) + "__" + a.set
    output = folder / (filename + ".jsonl")
    meta_path = folder / (filename + ".meta.json")
    folder.mkdir(parents=True, exist_ok=True)
    if output.exists() or meta_path.exists():
        ap.error("Capture already exists; choose a new --output-dir")
    failures = 0
    with output.open("x", encoding="utf-8") as f:
        for i, note in enumerate(notes):
            body = {"model": name, "stream": False, "format": schema,
                    "options": {"temperature": 0, "seed": 1},
                    "messages": messages + [{"role": "user", "content": note["text"]}]}
            start = time.perf_counter()
            try:
                response = request(host, "/api/chat", body, a.request_timeout)
                if response.get("error"):
                    raise ValueError(str(response["error"]))
                raw = response.get("message", {}).get("content")
                if not isinstance(raw, str):
                    raise ValueError("Missing string message content")
                error = None
            except Exception as e:
                response, raw, error = {}, "", str(e)
                failures += 1
            row = {"id": note["id"], "model": a.model, "set": a.set, "raw": raw,
                   "ms": round((time.perf_counter() - start) * 1000, 3), "error": error,
                   "model_bytes": tag.get("size"), "first_request": i == 0,
                   "ollama_timings": {k: response.get(k) for k in ("load_duration", "total_duration", "prompt_eval_count", "prompt_eval_duration", "eval_count", "eval_duration")}}
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
            f.flush()
            print(f"{i + 1}/{len(notes)} {'failed' if error else 'captured'}", flush=True)
    try:
        ps = request(host, "/api/ps").get("models", [])
        loaded = next((m for m in ps if m.get("name") == name or m.get("model") == name), {})
    except Exception:
        loaded = {}
    meta = {"schema_version": "afyanote.ollama-capture/0.2", "run": run, "started_at": now.isoformat(),
            "model": a.model, "model_digest": tag.get("digest"), "set": a.set,
            "expected_notes": len(dataset), "captured_notes": len(notes), "failed_notes": failures,
            "complete": len(notes) == len(dataset) and failures == 0,
            "dataset_sha256": digest(SETS[a.set]), "answer_sha256": digest(output),
            "source_hashes": {p: digest(HERE / p) for p in ("run_ollama.py", "schema.json", "prompt.txt", "fewshot.json")},
            "model_bytes_on_disk": tag.get("size"), "ollama_loaded_size_bytes": loaded.get("size"),
            "ollama_loaded_vram_bytes": loaded.get("size_vram"),
            "machine": {"system": platform.system(), "release": platform.release(), "machine": platform.machine(), "python": platform.python_version()},
            "endpoint": host, "request_timeout_seconds": a.request_timeout,
            "measurement_note": "Mac/computer capture, not a phone; API loaded-model size is not total or peak process RAM; first request may include loading"}
    with meta_path.open("x", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print("Saved:", output)
    print("Evaluate:", "node llm/eval_llm.mjs --input-dir", folder)
    if failures:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
