# Optional local LLM experiment

Claude created the toolkit. ChatGPT/Codex repaired its quote guard, scoring, capture provenance and CI on 2026-10-04. It is **outside the deployed app**. Actual local Qwen-based adapter experiments now exist, with complete raw captures and documented failures. Phone/field quality remains unmeasured. See the [current training review](../docs/03_plan/codex_llm_training_review.md).

The app classifier is 249,284 bytes / 243 KiB. Physical target-device performance is unmeasured. See [decision and sources](../docs/03_plan/lokales_llm.md).

| File | Purpose / limit |
|---|---|
| `schema.json`, `prompt.txt`, `fewshot.json` | Fixed extraction shape and examples. Schema is not a semantic correctness guarantee. |
| `guard.mjs` | Strict required keys/types/bounds, exact original substring, duplicate rejection, duration check, original offsets. Wrong semantic labels can still survive. |
| `combine()` in guard | Keeps both quotes; disagreement or LLM-only terms require human status choice; agreement never removes existing uncertainty. Not wired into the app. |
| `run_ollama.py` | Synthetic datasets only; local installed model, loopback, no redirect/proxy, new capture directory, model digest and source/dataset/raw hashes. |
| `eval_llm.mjs` | New reports, full denominator even for missing answers, rejects duplicate/unknown IDs and mismatched capture hashes; separates failures and status metrics. |
| `test_*_codex.*` | Guard, denominator and fake-server harness regressions; no model needed. |
| `export_sft.py`, `sft/` | Original Claude SFT data preserved; exporter repaired by Codex to write new immutable family splits. Historical overlap remains documented. New data in `sft_runs/`. |
| `review_codex/` | Before/after guard tests, runner/scorer tests, SFT audit, new reference outputs/reports. |

## Without a model

Run from the project root, with a **fresh** directory name each time:

```bash
node llm/test_guard_codex.mjs
node llm/test_eval_codex.mjs
python3 llm/test_runner_codex.py
node llm/eval_llm.mjs --selftest --input-dir /tmp/afya-reference-new --report-dir /tmp/afya-report-new
```

The committed [review report](review_codex/current_reference_report/results.md) contains classifier/adversarial reference rows only. `llm/results.*` and `outputs/selftest_*` remain historical and are no longer overwritten by default. Old source commands must be replaced by the explicit directory commands above.

## Actual experiment, optional T29

1. Install Ollama and a chosen **local** model explicitly. Disable Ollama cloud and restart the service; see [official FAQ](https://docs.ollama.com/faq). A local daemon can otherwise use cloud-backed models. Do not use patient notes.
2. Function check: `python3 llm/run_ollama.py --model gemma3:270m --limit 2 --output-dir llm/outputs/270m-smoke-01`.
3. Complete run: `python3 llm/run_ollama.py --model gemma3:270m --output-dir llm/outputs/270m-full-01`.
4. Score that exact capture: `node llm/eval_llm.mjs --input-dir llm/outputs/270m-full-01 --report-dir llm/reports/270m-full-01`.

Use a different directory for each model/run. A smoke test is partial and cannot be presented as a 40-note benchmark. CLI failures remain in the capture and count as no terms. Record warm/cold behavior separately: first request can include loading, median is successful request wall time, not controlled phone inference. Ollama loaded-model size is not peak process RAM.

Structured output is supported by local Ollama via `format` schema; revalidate in code. [Official structured outputs](https://docs.ollama.com/capabilities/structured-outputs), [loaded-model API](https://docs.ollama.com/api/ps). Complete set and digest comparisons are required before editing pitch figures. Gemma 3 candidates are a defined first comparison, not a claim to the latest or best model.

## Actual training work (ChatGPT/Codex, on Claude's data/toolkit basis)

[Training review and decisions](../docs/03_plan/codex_llm_training_review.md), [run guide](training_runs/README.md), [new data](sft_runs/README.md), [runtime](local_runtime/README.md). Base weights are Qwen/Alibaba; the model is not Anthropic Claude. Failed quote extractors are preserved. The source-bound passage selector improves extraction but has too many semantic errors to replace the app classifier.

From the project root, fresh output names only:

```bash
# Repeat the passage-selection development trial from the local verified base
llm/local_runtime/.venv/bin/python llm/training_codex/run_selection.py --model llm/base_models/qwen3_06b_official_20261004/mlx_int4 --data llm/sft_runs/20261004_selection_v01 --output llm/training_runs/next-selection-01 --iters 600 --eval-count 48
node llm/training_codex/score_run.mjs llm/training_runs/next-selection-01
# Reload the saved adapter, full known regression (never train on this input)
llm/local_runtime/.venv/bin/python llm/training_codex/capture_saved.py --run llm/training_runs/next-selection-01 --output llm/outputs/next-selection-40
node llm/eval_llm.mjs --input-dir llm/outputs/next-selection-40 --report-dir llm/reports/next-selection-40
```

Current [saved-model regression](reports/20261004_selection_saved_40/README.md) is a complete actual model capture. New tasks T40/T41 cover qualified annotation, abstention, independent model comparison and physical device tests. T29 remains the separately scoped optional Gemma/Ollama experiment.
