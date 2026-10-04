# T18 · Optional: mehr Ablenkungssätze aus MASSIVE (nur wenn alles andere fertig ist)
**Wo:** Codex · **Dauer:** 30 Min · **Verbrauch:** Codex mittel

## Prompt
```text
Read AGENTS.md. Optional improvement, keep everything else unchanged.
Download the sw-KE split of the MASSIVE dataset (CC BY 4.0, github.com/alexa/massive or Hugging Face AmazonScience/massive).
Take 300 utterances from the train split that contain none of the health words in training/lexicon.py, add them as
label-free distractor passages to the training data generator (mark source=massive, keep synthetic=false for these rows),
and 100 from the test split as additional held out distractors. Retrain and run parity and eval.
Report false alarm rate before and after. Add MASSIVE with licence and attribution to the README data table.
Do not commit.
```
