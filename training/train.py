"""
Train the AfyaNote passage classifier and export it for the browser.

Model: character n grams (2 to 4, word bounded, binary), L2 normalised,
one logistic regression per label. Exported as plain JSON with an explicit
vocabulary (no hashing), so the browser can reproduce the features exactly.
"""
import csv, json, hashlib, os, datetime
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import normalize
import sys
sys.path.insert(0, os.path.dirname(__file__))
from lexicon import LABELS

ROOT = os.path.join(os.path.dirname(__file__), "..")
D = os.path.join(ROOT, "data")
SEED = 7
NGRAM = (2, 4)
MAX_FEATURES = 3000
C = 4.0


def load(name):
    X, Y = [], []
    with open(os.path.join(D, name), encoding="utf-8") as f:
        for r in csv.DictReader(f):
            X.append(r["text"])
            labs = set(filter(None, r["labels"].split(";")))
            Y.append([int(l in labs) for l in LABELS])
    return X, np.array(Y)


Xtr, Ytr = load("passages_train.csv")
vec = CountVectorizer(analyzer="char_wb", ngram_range=NGRAM, max_features=MAX_FEATURES, binary=True, lowercase=True)
Xv = normalize(vec.fit_transform(Xtr))
W, B = [], []
for j, lab in enumerate(LABELS):
    m = LogisticRegression(C=C, max_iter=3000, random_state=SEED).fit(Xv, Ytr[:, j])
    W.append(m.coef_[0]); B.append(m.intercept_[0])
W = np.array(W); B = np.array(B)

# ---- threshold selection on the dev set (never on tests) ----
Xd, Yd = load("passages_dev.csv")
Pd = 1 / (1 + np.exp(-(normalize(vec.transform(Xd)) @ W.T + B)))
best = None
for t in np.arange(0.30, 0.95, 0.01):
    pred = Pd >= t
    tp = (pred & (Yd == 1)).sum(); fp = (pred & (Yd == 0)).sum(); fn = (~pred & (Yd == 1)).sum()
    p = tp / max(tp + fp, 1); r = tp / max(tp + fn, 1); f = 2 * p * r / max(p + r, 1e-9)
    if p >= 0.97 and (best is None or f > best[3]):
        best = (round(float(t), 2), p, r, f)
HI = max(0.5, best[0]) if best else 0.5  # floor: dev uses seen phrasings, so stay conservative
LO = 0.25  # below this nothing is shown; between LO and HI the field is marked "unclear"
_pred = Pd >= HI
_tp = (_pred & (Yd == 1)).sum(); _fp = (_pred & (Yd == 0)).sum(); _fn = (~_pred & (Yd == 1)).sum()
model_thresholds = {"suggest": HI, "unclear": LO,
                    "dev_precision_at_suggest": round(float(_tp / max(_tp + _fp, 1)), 4),
                    "dev_recall_at_suggest": round(float(_tp / max(_tp + _fn, 1)), 4)}
print("thresholds", model_thresholds)

# vocabulary ordered by column index
vocab_list = [None] * len(vec.vocabulary_)
for g, i in vec.vocabulary_.items():
    vocab_list[i] = g

data_hash = hashlib.sha256(open(os.path.join(D, "passages_train.csv"), "rb").read()).hexdigest()[:12]
model = {
    "name": "afyanote-passage-classifier",
    "version": "0.1.0",
    "created": datetime.date.today().isoformat(),
    "labels": LABELS,
    "ngram": list(NGRAM),
    "analyzer": "char_wb, lowercase, binary, l2",
    "vocab": vocab_list,
    "W": np.round(W, 4).tolist(),
    "b": np.round(B, 4).tolist(),
    "train_rows": len(Xtr),
    "train_data_sha256_12": data_hash,
    "synthetic_training_data": True,
    "thresholds": model_thresholds,
}
os.makedirs(os.path.join(ROOT, "app"), exist_ok=True)
path = os.path.join(ROOT, "app", "model.json")
with open(path, "w", encoding="utf-8") as f:
    json.dump(model, f, ensure_ascii=False, separators=(",", ":"))


def predict(texts):
    return 1 / (1 + np.exp(-(normalize(vec.transform(texts)) @ W.T + B)))


# parity fixtures: python probabilities with the EXPORTED (rounded) weights
Wr = np.array(model["W"]); Br = np.array(model["b"])
fixtures = ["mtoto ana homa siku tatu", "hawezi kunywa na anatapika kila kitu", "Child: cough for 2 days",
            "degedege usiku", "hana homa", "mama ana homa", "visited the household", "AMANI amelegea!!",
            "kikohozi kavu", "loose stools since yesterday", "tumbo lina uma", "ü é ß unicode test", "",
            "x", "homa/kikohozi", "child aged 2 years; cough 3 days"]
Xf = normalize(vec.transform(fixtures))
Pf = 1 / (1 + np.exp(-(Xf @ Wr.T + Br)))
os.makedirs(os.path.join(ROOT, "eval"), exist_ok=True)
json.dump({"texts": fixtures, "probs": Pf.round(6).tolist()},
          open(os.path.join(ROOT, "eval", "parity_fixtures.json"), "w"), ensure_ascii=False)

size = os.path.getsize(path)
sha = hashlib.sha256(open(path, "rb").read()).hexdigest()
print(f"features={len(vocab_list)} labels={len(LABELS)} model_bytes={size} sha256={sha[:16]}")
