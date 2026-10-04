# T09 · Codex: unabhängiges Testset (wichtigster Glaubwürdigkeits Punkt)
**Wo:** Codex (VS Code Extension oder chatgpt.com/codex) · **Dauer:** 30 Min · **Verbrauch:** Codex mittel

Warum: Die bisherigen Tests kommen aus demselben Generator wie das Training. Ein Testset, das jemand anderes schreibt, ist der ehrlichste Beleg.

## Prompt
```text
Read AGENTS.md first and follow all hard rules. Do not edit training/, app/model.json or app/classify.js.

Task: build an INDEPENDENT test set for AfyaNote.
1. Without opening training/lexicon.py or data/*, write 40 short fictional visit notes about one child each:
   15 Swahili, 15 English, 10 mixed. Use your own natural wording. Include:
   10 notes with a negation, 6 with another person (mother, father, neighbour), 6 with a past time,
   4 with two different ages or an age without unit, 4 notes with unrelated text only.
2. Annotate each note with gold terms from this fixed list and a status per term
   (stated | denied | other_person | past):
   fever, cough, diarrhoea, vomiting, pain, weakness, ds_cannot_drink, ds_vomits_everything, ds_convulsions, ds_lethargic
   Save as eval/independent_notes.jsonl in the same format as data/notes_test.jsonl (field "pool": "independent").
3. Run `node eval/independent.mjs` (the runner already exists and writes eval/independent_results.md).
4. Do not tune anything to this test set. Report the numbers as they are.
Show me the summary table at the end.
```

## Teil 2 (nur falls T08 Lexikonfehler fand)
```text
Read AGENTS.md. Apply these Swahili corrections to training/lexicon.py: <Liste>.
Then run: python3 training/generate_data.py && python3 training/train.py && node eval/parity.mjs && node eval/eval.mjs
Bump VERSION in app/sw.js. Report changes in eval/results.md compared to before.
```

## Fertig wenn
`eval/independent_results.md` existiert. Die Zahlen kommen ins README (Abschnitt Why AI) und ins Tech Video, egal ob gut oder schlecht.

## Teil 3: Ergebnis ins README (Claude Code, ca. 3 %)
```text
Read CLAUDE.md. Add the numbers from eval/independent_results.md to README.md, section "Why AI, and why small",
as a new row "Independent test notes written by a second author (n=40)" for model and keyword list.
Do not change other numbers. If the model is not better, say so plainly. Do not commit.
```
