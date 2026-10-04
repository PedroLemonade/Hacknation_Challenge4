"""ChatGPT / Codex: deterministic fake-local-server harness tests. No model download/inference."""
import argparse
import hashlib
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import threading
import datetime

HERE = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("runner", HERE / "run_ollama.py")
runner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(runner)
tests = []

def check(name, fn):
    try:
        fn()
        tests.append({"name": name, "pass": True})
    except Exception as e:
        tests.append({"name": name, "pass": False, "error": str(e)})

def must(condition):
    if not condition:
        raise AssertionError("contract not fulfilled")

def invalid_host(value):
    try:
        runner.validate_host(value)
    except ValueError:
        return
    raise AssertionError("nonlocal/ambiguous endpoint accepted")

for value in ["https://example.com", "http://example.com", "http://localhost@evil.example", "http://localhost/x", "http://localhost?target=elsewhere"]:
    check("Reject endpoint " + value, lambda v=value: invalid_host(v))
check("IPv4 loopback allowed", lambda: must(runner.validate_host("http://127.0.0.1:11434") == "http://127.0.0.1:11434"))
check("IPv6 loopback allowed", lambda: must(runner.validate_host("http://[::1]:11434") == "http://[::1]:11434"))

class Mock(BaseHTTPRequestHandler):
    requests = []
    failure = False

    def log_message(self, *args):
        pass

    def reply(self, obj):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode())

    def do_GET(self):
        if self.path == "/api/tags":
            self.reply({"models": [{"name": "fake:local", "size": 1234, "digest": "test-digest"}]})
        elif self.path == "/api/ps":
            self.reply({"models": [{"name": "fake:local-else", "size": 999}, {"name": "fake:local", "size": 2345}]})
        else:
            self.send_response(302)
            self.send_header("Location", "http://example.com/")
            self.end_headers()

    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers["Content-Length"])))
        self.requests.append(body)
        self.reply({"error": "synthetic failure"} if self.failure else {"message": {"content": '{"items": []}'}, "load_duration": 123})

server = ThreadingHTTPServer(("127.0.0.1", 0), Mock)
thread = threading.Thread(target=server.serve_forever, daemon=True)
thread.start()
host = f"http://127.0.0.1:{server.server_port}"
try:
    with tempfile.TemporaryDirectory(prefix="afya-runner-contract-") as temp:
        folder = Path(temp) / "capture"
        command = [sys.executable, str(HERE / "run_ollama.py"), "--host", host, "--model", "fake:local", "--limit", "2", "--output-dir", str(folder)]
        def partial():
            result = subprocess.run(command, capture_output=True, text=True, timeout=10)
            must(result.returncode == 0)
            meta = json.loads(next(folder.glob("*.meta.json")).read_text())
            must(meta["captured_notes"] == 2 and meta["expected_notes"] == 40 and meta["complete"] is False)
            must(meta["dataset_sha256"] == runner.digest(runner.SETS["independent"]))
            must(meta["ollama_loaded_size_bytes"] == 2345 and meta["model_digest"] == "test-digest")
            must(meta["answer_sha256"] == runner.digest(next(folder.glob("*.jsonl"))))
            must(Mock.requests[0]["format"]["properties"]["items"]["maxItems"] == 10)
        check("Partial capture has full denominator, hashes, exact model identity and schema", partial)
        def collision():
            before = next(folder.glob("*.jsonl")).read_bytes()
            result = subprocess.run(command, capture_output=True, timeout=10)
            must(result.returncode != 0 and next(folder.glob("*.jsonl")).read_bytes() == before)
        check("Existing capture is never overwritten", collision)
        def failed():
            Mock.failure = True
            target = Path(temp) / "failed"
            cmd = command[:-1] + [str(target)]
            result = subprocess.run(cmd, capture_output=True, timeout=10)
            meta = json.loads(next(target.glob("*.meta.json")).read_text())
            must(result.returncode == 1 and meta["failed_notes"] == 2 and meta["complete"] is False)
        check("API failures remain captured and make run incomplete", failed)
        def redirect():
            try:
                runner.request(host, "/redirect")
            except ValueError as e:
                must("Redirect refused" in str(e))
                return
            raise AssertionError("redirect followed")
        check("HTTP redirect cannot send request outside loopback", redirect)
finally:
    server.shutdown()
    server.server_close()
    thread.join(timeout=2)

ap = argparse.ArgumentParser()
ap.add_argument("--report", type=Path)
a = ap.parse_args()
result = {"created_by": "ChatGPT / Codex", "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
          "mock_only": True, "source_sha256": hashlib.sha256((HERE / "run_ollama.py").read_bytes()).hexdigest(),
          "passed": sum(t["pass"] for t in tests), "total": len(tests), "tests": tests}
if a.report:
    a.report.write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
raise SystemExit(0 if all(t["pass"] for t in tests) else 1)
