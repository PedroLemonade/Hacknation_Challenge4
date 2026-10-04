# Optional LLM experiment · guarded saved answers

Claude toolkit, repaired and rerun by ChatGPT/Codex. All datasets are synthetic, unreviewed and already known during development. Reference rows use the existing classifier, **no actual LLM**. Phone performance and clinical validity are unmeasured.

| Model | Set | Answers / expected | Failures | Terms / gold | Recall | Matching status / found | Extra terms | Exact notes / expected | Unclear hybrid cards | Median ms |
|---|---|---|---|---|---|---|---|---|---|---|
| adversarial (reference) | independent | 40/40 | 0 | 0/63 | 0 | 0/0 | 0 | 0/40 | 2 | n/a (reference) |
| afyanote-classifier (reference) | independent | 40/40 | 0 | 58/63 | 0.921 | 58/58 | 1 | 35/40 | 2 | n/a (reference) |

Missing answers count as no extracted terms in the full dataset denominator. Duplicate or unknown IDs, mixed sets and a changed capture dataset abort the report. Partial runs are smoke tests, not comparable complete benchmarks. Status agreement is conditional on found terms, not clinical accuracy. Hybrid recall includes unresolved proposals. Exact quotes can still have incorrect term, subject or status meaning.

The JSON contains source, dataset and raw-answer hashes. Older raw files without capture hashes are explicitly unverified. Disk bytes and Ollama `/api/ps` loaded-model size are separate; the latter is not total process RAM or peak memory. Median wall time includes startup for the first note and excludes failed requests; raw timings remain available. No phone claim follows from a Mac run.
