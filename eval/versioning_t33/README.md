# T33 · historische Auswertung erhalten

ChatGPT / Codex. `before/` enthält unveränderte Kopien des früheren Runners und Reports samt Hashmanifest. Der ursprüngliche 40er-Bestand und seine read-only-Berichte sind unangetastet. Reguläre neue Läufe in `eval/runs`, ausdrücklich benannte neue Baselines in `eval/baselines`. Ein Baseline-Modus macht bekanntes synthetisches Gold nicht unabhängig.

```bash
node eval/test_benchmark_t33.mjs
node eval/independent.mjs --out eval/runs/NEXT_UNIQUE_40
node eval/independent.mjs --benchmark generated --out eval/runs/NEXT_UNIQUE_400
```

`verification.json`: 13 Verträge plus sieben tatsächliche CLI/Erhaltungschecks. [Metrik-/Versionsreview](../../docs/03_plan/codex_continuation_review.md). Runner schreibt keine App-Datei und trainiert kein Modell. Fehlende/falsche Goldfelder verständlich abgewiesen; unklares Alter ohne Goldannotation nicht als Accuracy bewertet.
