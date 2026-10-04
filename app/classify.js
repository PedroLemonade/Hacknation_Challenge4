/* AfyaNote passage classifier, runs fully in the browser, no libraries.
   Reproduces scikit-learn CountVectorizer(analyzer="char_wb", ngram_range=(2,4),
   binary=True, lowercase=True) followed by L2 normalisation and one logistic
   regression per label. Parity with Python is checked in eval/parity.mjs. */
(function (root) {
  "use strict";

  // Exact port of sklearn _char_wb_ngrams, counted in Unicode code points.
  function charWbNgrams(text, minN, maxN) {
    var out = [];
    var words = text.toLowerCase().split(/\s+/).filter(Boolean);
    for (var k = 0; k < words.length; k++) {
      var w = Array.from(" " + words[k] + " ");
      var L = w.length;
      for (var n = minN; n <= maxN; n++) {
        var offset = 0;
        out.push(w.slice(offset, offset + n).join(""));
        while (offset + n < L) {
          offset += 1;
          out.push(w.slice(offset, offset + n).join(""));
        }
        if (offset === 0) break; // short word counted once, like sklearn
      }
    }
    return out;
  }

  function prepare(model) {
    var index = new Map();
    for (var i = 0; i < model.vocab.length; i++) index.set(model.vocab[i], i);
    return { model: model, index: index };
  }

  // Returns an array of probabilities, one per label (same order as model.labels).
  function scores(prepared, text) {
    var m = prepared.model;
    var seen = new Set();
    var grams = charWbNgrams(text || "", m.ngram[0], m.ngram[1]);
    for (var g = 0; g < grams.length; g++) {
      var idx = prepared.index.get(grams[g]);
      if (idx !== undefined) seen.add(idx);
    }
    var norm = Math.sqrt(seen.size) || 1;
    var out = new Array(m.labels.length);
    for (var j = 0; j < m.labels.length; j++) {
      var z = m.b[j];
      var row = m.W[j];
      seen.forEach(function (i) { z += row[i] / norm; });
      out[j] = 1 / (1 + Math.exp(-z));
    }
    return out;
  }

  // Which words pushed label j up? Each active n gram adds W[j][i]/norm to the score.
  // A gram that occurs in several words is split equally between them.
  // Returns words with their character offsets in `text`, sorted by contribution.
  function explain(prepared, text, j) {
    var m = prepared.model, row = m.W[j];
    var words = [], re = /\S+/g, w;
    while ((w = re.exec(text || ""))) words.push({ text: w[0], start: w.index, end: w.index + w[0].length, grams: new Set(), contribution: 0 });
    var owners = new Map();
    words.forEach(function (wd, k) {
      charWbNgrams(wd.text, m.ngram[0], m.ngram[1]).forEach(function (g) {
        var idx = prepared.index.get(g);
        if (idx === undefined) return;
        wd.grams.add(idx);
        if (!owners.has(idx)) owners.set(idx, new Set());
        owners.get(idx).add(k);
      });
    });
    var norm = Math.sqrt(owners.size) || 1;
    owners.forEach(function (ks, idx) {
      var share = row[idx] / norm / ks.size;
      ks.forEach(function (k) { words[k].contribution += share; });
    });
    return words.map(function (x) { return { text: x.text, start: x.start, end: x.end, contribution: x.contribution }; })
      .sort(function (a, b) { return b.contribution - a.contribution; });
  }

  var api = { charWbNgrams: charWbNgrams, prepare: prepare, scores: scores, explain: explain };
  root.AfyaClassifier = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof self !== "undefined" ? self : globalThis);
