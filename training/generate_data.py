"""
Generate synthetic AfyaNote data. Every row carries synthetic=true.

Outputs (data/):
  passages_train.csv      model training, train phrasings
  passages_dev.csv        threshold selection, train phrasings, other seed
  passages_test_typo.csv  train phrasings with injected spelling errors
  passages_test_heldout.csv  phrasings never seen in training (template family split)
  notes_test.jsonl        whole notes with gold term + assertion, for pipeline eval
  dictionary.json         train phrasings, used by the rule baseline
"""
import csv, json, random, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from lexicon import LABELS, DANGER, LEX, PATIENT, OTHER, NUM_SW, NUM_SW_AGE, DISTRACT

ROOT = os.path.join(os.path.dirname(__file__), "..")
OUT = os.path.join(ROOT, "data")
os.makedirs(OUT, exist_ok=True)


def typo(word, rng):
    if len(word) < 4:
        return word
    i = rng.randrange(1, len(word) - 1)
    op = rng.choice(["drop", "dup", "swap"])
    if op == "drop":
        return word[:i] + word[i + 1:]
    if op == "dup":
        return word[:i] + word[i] + word[i:]
    return word[:i - 1] + word[i] + word[i - 1] + word[i + 1:]


def add_typo(text, rng):
    words = text.split(" ")
    idx = [k for k, w in enumerate(words) if len(w) >= 4]
    if not idx:
        return text
    k = rng.choice(idx)
    words[k] = typo(words[k], rng)
    return " ".join(words)


def duration(lang, rng):
    n = rng.choice([1, 2, 3, 4, 5])
    if lang == "sw":
        return rng.choice([f" siku {NUM_SW[n]}", f" siku {n}", f" kwa siku {NUM_SW[n]}", " tangu jana", " tangu juzi", " wiki moja"])
    return rng.choice([f" for {n} days", f" {n} days", " since yesterday", f" x{n} days", " for 1 week"])


def phrase_pool(label, pool, lang):
    return LEX[label][pool].get(lang, [])


def make_passage(rng, pool, allow_neg=True, distract_slice=slice(None)):
    """Return (text, lang, set(labels))."""
    r = rng.random()
    lang = rng.choice(["sw", "sw", "en", "mix"])
    if r < 0.12:  # distractor
        l2 = "sw" if lang in ("sw", "mix") else "en"
        items = DISTRACT[l2][distract_slice]
        return rng.choice(items), l2, set()
    # pick term(s)
    n_terms = 2 if rng.random() < 0.12 else 1
    labels = rng.sample(LABELS, n_terms)
    parts, gold = [], set()
    for lab in labels:
        plang = lang if lang != "mix" else rng.choice(["sw", "en"])
        negate = allow_neg and rng.random() < 0.18 and phrase_pool(lab, "negated", plang)
        if negate:
            ph = rng.choice(phrase_pool(lab, "negated", plang))
            if lab not in DANGER:
                gold.add(lab)  # mention, rules decide "denied"
        else:
            cands = phrase_pool(lab, pool, plang) or phrase_pool(lab, pool, "sw" if plang == "en" else "en")
            ph = rng.choice(cands)
            gold.add(lab)
            if lab == "ds_vomits_everything":
                gold.add("vomiting")
        parts.append(ph)
    body = rng.choice([" ", " / ", " + "]).join(parts)
    slang = lang if lang != "mix" else rng.choice(["sw", "en"])
    subj_pool = OTHER if rng.random() < 0.1 else PATIENT
    subj = rng.choice(subj_pool[slang])
    tmpl = rng.choice(["{s} {b}", "{b}", "{s}: {b}", "{b}"])
    text = tmpl.format(s=subj, b=body)
    if rng.random() < 0.45:
        dl = lang if lang != "mix" else rng.choice(["sw", "en"])
        text += duration(dl, rng)
    if rng.random() < 0.3:
        text = text.capitalize()
    return text, lang, gold


def write_passages(name, rows):
    with open(os.path.join(OUT, name), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["id", "lang", "text", "labels", "synthetic"])
        for i, (t, lang, g) in enumerate(rows):
            w.writerow([f"{name.split('.')[0]}_{i}", lang, t, ";".join(sorted(g)), "true"])


def gen(seed, n, pool, typo_rate=0.0, force_typo=False, dslice=slice(None)):
    rng = random.Random(seed)
    rows = []
    for _ in range(n):
        t, lang, g = make_passage(rng, pool, distract_slice=dslice)
        if force_typo or rng.random() < typo_rate:
            t = add_typo(t, rng)
        rows.append((t, lang, g))
    return rows


# distractor family split: first part for train/dev, rest only in tests
DS_TRAIN = slice(0, 10)
DS_TEST = slice(10, None)

train = gen(11, 5000, "train", typo_rate=0.15, dslice=DS_TRAIN)
dev = gen(22, 1000, "train", typo_rate=0.15, dslice=DS_TRAIN)
test_typo = gen(33, 800, "train", force_typo=True, dslice=DS_TEST)
test_held = gen(44, 800, "heldout", dslice=DS_TEST)
write_passages("passages_train.csv", train)
write_passages("passages_dev.csv", dev)
write_passages("passages_test_typo.csv", test_typo)
write_passages("passages_test_heldout.csv", test_held)

# ---------- whole notes with assertion gold ----------
PAST = {"sw": [" wiki iliyopita", " mwezi uliopita"], "en": [" last week", " last month"]}


def note_clause(rng, pool, lang):
    lab = rng.choice(LABELS)
    kind = rng.choices(["affirmed", "denied", "other_person", "past"], [0.5, 0.2, 0.15, 0.15])[0]
    if kind == "denied" and (lab in DANGER or not LEX[lab]["negated"].get(lang)):
        kind = "affirmed"
    if kind == "denied":
        ph = rng.choice(LEX[lab]["negated"][lang])
    else:
        ph = rng.choice(LEX[lab][pool].get(lang) or LEX[lab][pool]["sw"])
    if kind == "other_person":
        subj = rng.choice(OTHER[lang])
    else:
        subj = rng.choice(PATIENT[lang])
    text = rng.choice(["{s} {p}", "{s}: {p}", "{p}"]).format(s=subj, p=ph) if kind != "other_person" else f"{subj} {ph}"
    if kind == "past":
        text += rng.choice(PAST[lang])
    elif rng.random() < 0.4:
        text += duration(lang, rng)
    gold = [{"label": lab, "assertion": kind}]
    if lab == "ds_vomits_everything" and kind in ("affirmed", "other_person", "past"):
        gold.append({"label": "vomiting", "assertion": kind})
    return text, gold


def gen_notes(seed, n, pool):
    rng = random.Random(seed)
    notes = []
    for i in range(n):
        lang = rng.choice(["sw", "en"])
        k = rng.choice([1, 2, 2, 3])
        clauses, gold, used = [], [], set()
        tries = 0
        while len(clauses) < k and tries < 20:
            tries += 1
            c, g = note_clause(rng, pool, lang)
            if any(x["label"] in used for x in g):
                continue
            used.update(x["label"] for x in g)
            clauses.append(c)
            gold.extend(g)
        sep = ". " if rng.random() < 0.6 else "; "
        notes.append({"id": f"{pool}_note_{i}", "lang": lang, "pool": pool,
                      "text": sep.join(clauses), "gold": gold, "synthetic": True})
    return notes


notes = gen_notes(55, 200, "train") + gen_notes(66, 200, "heldout")
with open(os.path.join(OUT, "notes_test.jsonl"), "w", encoding="utf-8") as f:
    for n in notes:
        f.write(json.dumps(n, ensure_ascii=False) + "\n")

# dictionary baseline: train phrasings only (what a developer would write by hand)
dictionary = {lab: sorted(set(LEX[lab]["train"]["sw"] + LEX[lab]["train"]["en"])) for lab in LABELS}
with open(os.path.join(OUT, "dictionary.json"), "w", encoding="utf-8") as f:
    json.dump(dictionary, f, ensure_ascii=False, indent=1)

print("train", len(train), "dev", len(dev), "test_typo", len(test_typo), "test_heldout", len(test_held), "notes", len(notes))
