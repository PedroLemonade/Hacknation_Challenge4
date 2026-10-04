# QLoRA development comparison

Claude source lexicon/toolkit; split and actual training by ChatGPT/Codex. Base weights: Qwen/Alibaba. 400 updates, not a full epoch. This 48-note synthetic Dev subset was frozen before training. It is a known development comparison, not a clinical, language or independent test. No app integration.

| Model | Valid shape / notes | Terms / gold | Matching status / found | Extra | Exact term/status | Exact incl. duration | Duration / gold | Median ms |
|---|---|---|---|---|---|---|---|---|
| base | 0/48 | 0/116 | 0/0 | 0 | 0/48 | 0/48 | 0/23 | 539 |
| adapter | 0/48 | 1/116 | 0/1 | 0 | 0/48 | 0/48 | 0/23 | 1047 |

All missing and failed answers count in the full selected-subset denominator. Guarded exact quotes do not establish semantic correctness. JSON errors, rejected items, dropped durations and all note-level raw errors are retained in comparison.json. No constrained JSON decoder was used; this measures learned output behavior. Temperature 0, thinking disabled, same system prompt and token cap before/after. Median is Mac wall time, not phone timing.

MLX peak through training: 1.274 GB; allocator memory only, not total process/OS memory. Adapter: 8668615 bytes. Disk model size, RAM and download size are separate. Validation loss uses sampled batches, not task correctness.
