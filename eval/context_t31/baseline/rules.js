/* AfyaNote documentation rules and pipeline.
   The model only proposes WHICH term a passage talks about.
   These rules decide how the passage talks about it (stated, denied, other person,
   past) and pull out explicit age and duration. Anything ambiguous stays open for
   the health promoter. Nothing here is a clinical decision. */
(function (root) {
  "use strict";

  var LABEL_INFO = {
    fever: { en: "Fever", sw: "Homa" },
    cough: { en: "Cough", sw: "Kikohozi" },
    diarrhoea: { en: "Diarrhoea", sw: "Kuhara" },
    vomiting: { en: "Vomiting", sw: "Kutapika" },
    pain: { en: "Pain", sw: "Maumivu" },
    weakness: { en: "Weakness", sw: "Udhaifu" },
    ds_cannot_drink: { en: "Not able to drink or breastfeed", sw: "Hawezi kunywa au kunyonya", danger: true },
    ds_vomits_everything: { en: "Vomits everything", sw: "Anatapika kila kitu", danger: true },
    ds_convulsions: { en: "Convulsions", sw: "Degedege", danger: true },
    ds_lethargic: { en: "Lethargic or unconscious", sw: "Amelegea au hajitambui", danger: true }
  };

  // Passage boundaries: sentence marks, semicolons, line breaks, commas, and joiners.
  var SPLIT_RE = /[.;!?\n]+|,\s*|\s+(?:na|and|lakini|but|ila|pia|also)\s+/gi;

  // Phrases that LOOK negative but state a finding. Masked before negation check.
  var AFFIRMATIVE_MASKS = [
    /\bhana nguvu\b/g, /\bhawezi\b/g, /\bhajitambui\b/g, /\bhanyonyi\b/g, /\bhakunywa\b/g,
    /\bno energy\b/g, /\bnot able to\b/g, /\bunable to\b/g, /\bcannot\b/g, /\bcan'?t\b/g,
    /\bwon'?t\b/g, /\bnot responding\b/g
  ];
  var NEG_RE = /\b(hana|hakuna|bila|hakuwa|si|hakohoi|hatapiki|hajatapika|haharishi|hajaharisha|haliumi|no|not|denies|denied|without|never|negative)\b/;
  var OTHER_RE = /\b(mama|baba|bibi|babu|dada|kaka|jirani|shangazi|mjomba|mother|father|grandmother|grandfather|sister|brother|neighbou?r|aunt|uncle)\b/;
  var REPORTER_RE = /\b(mama|baba|mother|father)\s+(anasema|amesema|alisema|says|said|reports|reported)\b/;
  var PATIENT_RE = /\b(mtoto|mtoto wake|msichana|mvulana|mgonjwa|child|baby|infant|boy|girl|patient)\b/;
  var CONTINUE_RE = /^(pia|tena|vilevile|also|and also|as well)\b/;
  var PAST_RE = /\b(wiki iliyopita|mwezi uliopita|mwaka jana|zamani|last week|last month|last year|previously)\b/;

  var NUM = { moja: 1, mbili: 2, tatu: 3, nne: 4, tano: 5, sita: 6, saba: 7, nane: 8, tisa: 9, kumi: 10,
              mmoja: 1, miwili: 2, mitatu: 3, minne: 4, mitano: 5, one: 1, two: 2, three: 3, four: 4, five: 5,
              six: 6, seven: 7 };
  function num(tok) { return /^\d+$/.test(tok) ? parseInt(tok, 10) : (NUM[tok] || null); }

  // Each passage gets a sentence index: commas and joiners stay in the same sentence, . ; ! ? and line breaks start a new one.
  function splitPassages(note) {
    var out = [], last = 0, m, sentence = 0, cont = false;
    SPLIT_RE.lastIndex = 0;
    while ((m = SPLIT_RE.exec(note)) !== null) {
      if (pushPassage(out, note, last, m.index, sentence, cont)) cont = false;
      if (/[.;!?\n]/.test(m[0])) sentence++;
      if (/\b(pia|also)\b/i.test(m[0])) cont = true; // "... Pia ..." continues the previous subject
      last = m.index + m[0].length;
      if (m[0].length === 0) SPLIT_RE.lastIndex++;
    }
    pushPassage(out, note, last, note.length, sentence, cont);
    return out;
  }
  function pushPassage(out, note, a, b, sentence, cont) {
    var raw = note.slice(a, b);
    var lead = raw.length - raw.replace(/^\s+/, "").length;
    var text = raw.trim();
    if (!text) return false;
    out.push({ text: text, start: a + lead, end: a + lead + text.length, sentence: sentence, cont: !!cont });
    return true;
  }

  function masked(text) {
    var t = text.toLowerCase();
    AFFIRMATIVE_MASKS.forEach(function (re) { t = t.replace(re, " _ "); });
    return t;
  }

  // How does this passage talk about the term?
  // Who is the passage about? "other", "patient" or null (not stated in this passage).
  function subjectOf(passageText) {
    var low = passageText.toLowerCase(), m;
    if ((m = low.match(OTHER_RE)) && !REPORTER_RE.test(low)) return { who: "other", cue: m[1] };
    if ((m = low.match(PATIENT_RE))) return { who: "patient", cue: m[1] };
    return { who: null, cue: null };
  }

  // ctx (optional): { carriedOther: "mama" } when an earlier passage of the same sentence was about another person.
  function assertion(passageText, ctx) {
    var low = passageText.toLowerCase();
    var cues = [];
    var m;
    if ((m = masked(low).match(NEG_RE))) { cues.push("negation: " + m[1]); return { status: "denied", cues: cues }; }
    if ((m = low.match(OTHER_RE)) && !REPORTER_RE.test(low)) { cues.push("person: " + m[1]); return { status: "other_person", cues: cues }; }
    if (ctx && ctx.carriedOther) { cues.push("person: " + ctx.carriedOther + " (earlier in the sentence)"); return { status: "other_person", cues: cues }; }
    if ((m = low.match(PAST_RE))) { cues.push("time: " + m[1]); return { status: "past", cues: cues }; }
    return { status: "stated", cues: cues };
  }

  function duration(passageText) {
    var t = passageText.toLowerCase(), m;
    if (PAST_RE.test(t)) return null;
    if ((m = t.match(/\bsiku\s+(\d+|moja|mbili|tatu|nne|tano|sita|saba|nane|tisa|kumi)\b/))) return { days: num(m[1]), raw: m[0] };
    if ((m = t.match(/\bwiki\s+(\d+|moja|mbili|tatu)\b/))) return { days: 7 * num(m[1]), raw: m[0] };
    if ((m = t.match(/\btangu jana\b/))) return { days: 1, raw: m[0] };
    if ((m = t.match(/\btangu juzi\b/))) return { days: 2, raw: m[0] };
    if ((m = t.match(/\bx?(\d+)\s*(?:days?|d)\b/))) return { days: num(m[1]), raw: m[0] };
    if ((m = t.match(/\b(one|two|three|four|five|six|seven)\s+days?\b/))) return { days: num(m[1]), raw: m[0] };
    if ((m = t.match(/\b(\d+|one|two)\s+weeks?\b/))) return { days: 7 * num(m[1]), raw: m[0] };
    if ((m = t.match(/\bsince yesterday\b/))) return { days: 1, raw: m[0] };
    return null;
  }

  // Age is only filled from an explicit number WITH a unit. Everything else stays open.
  function age(note) {
    var t = note.toLowerCase(), found = [], m, re;
    // A number may carry decimals ("2.5 years"). Decimal ages are never converted: the CHP enters them.
    var N = "(\\d+(?:[.,]\\d+)?";
    var push = function (v, unit, raw) { found.push(/[.,]/.test(v) ? { decimal: true, raw: raw } : { value: num(v), unit: unit, raw: raw }); };
    re = new RegExp("\\bmiaka\\s+" + N + "|mmoja|miwili|mitatu|minne|mitano)\\b", "g");
    while ((m = re.exec(t))) push(m[1], "years", m[0]);
    re = new RegExp("\\b(?:umri wa|mtoto wa|ana)\\s+miezi\\s+" + N + "|sita|tatu|tisa|mbili|nne|tano|saba|nane|kumi)\\b", "g");
    while ((m = re.exec(t))) push(m[1], "months", m[0]);
    re = new RegExp("(?:^|[^\\d.,])" + N + ")\\s*(?:years?|yrs?)(?:\\s*old)?\\b", "g");
    while ((m = re.exec(t))) push(m[1], "years", m[0].replace(/^[^\d]/, ""));
    re = new RegExp("(?:^|[^\\d.,])" + N + ")\\s*months?(?:\\s*old)?\\b", "g");
    while ((m = re.exec(t))) push(m[1], "months", m[0].replace(/^[^\d]/, ""));
    var dec = found.filter(function (f) { return f.decimal; });
    if (dec.length) return { status: "unclear", reason: "decimal age, enter it yourself", raw: dec[0].raw };
    if (found.length === 0) {
      if ((m = t.match(/\b(?:age|umri)\s*:?\s*(\d+)\b/))) return { status: "unclear", reason: "number without unit", raw: m[0] };
      return { status: "missing" };
    }
    var keys = {};
    found.forEach(function (f) { keys[f.value + f.unit] = f; });
    var uniq = Object.keys(keys);
    if (uniq.length > 1) return { status: "unclear", reason: "more than one age in the note", raw: found.map(function (f) { return f.raw; }).join(" | ") };
    return { status: "suggested", value: found[0].value, unit: found[0].unit, raw: found[0].raw };
  }

  var MAX_LEN = 600;

  // Full analysis. scorer(text) returns probabilities per label (model) or 0/1 (dictionary).
  function analyze(note, labels, scorer, thresholds) {
    var res = { error: null, passages: [], candidates: [], age: null };
    var text = (note || "").replace(/\s+$/, "");
    if (!text.trim()) { res.error = "empty"; return res; }
    if (text.length > MAX_LEN) { res.error = "too_long"; return res; }
    if (!/[a-zA-ZÀ-ɏ]/.test(text)) { res.error = "no_text"; return res; }
    res.passages = splitPassages(text);
    var byLabel = {}, prev = null;
    res.passages.forEach(function (p, pi) {
      var sub = subjectOf(p.text);
      var who = sub.who, cue = sub.cue;
      if (!who && prev) {
        var sameSentence = prev.sentence === p.sentence;
        if (sameSentence || p.cont || CONTINUE_RE.test(p.text.toLowerCase())) { who = prev.who; cue = prev.cue; }
      }
      p.subject = who;
      prev = { who: who, cue: cue, sentence: p.sentence };
      var probs = scorer(p.text);
      var a = assertion(p.text, who === "other" && !sub.who ? { carriedOther: cue } : null);
      var d = duration(p.text);
      labels.forEach(function (lab, j) {
        var s = probs[j];
        if (s < thresholds.unclear) return;
        var c = { label: lab, score: s, passage: pi, evidence: p.text, start: p.start, end: p.end,
                  field: s >= thresholds.suggest ? "suggested" : "unclear",
                  assertion: a.status, cues: a.cues, duration: d };
        (byLabel[lab] = byLabel[lab] || []).push(c);
      });
    });
    Object.keys(byLabel).forEach(function (lab) {
      var list = byLabel[lab].sort(function (x, y) { return y.score - x.score; });
      var best = Object.assign({}, list[0]);
      var statuses = {};
      list.forEach(function (c) { if (c.field === "suggested" || list.length === 1) statuses[c.assertion] = true; });
      if (Object.keys(statuses).length > 1) {
        best.assertion = "conflict";
        best.field = "unclear";
        best.others = list.slice(1).map(function (c) { return { evidence: c.evidence, assertion: c.assertion, start: c.start, end: c.end }; });
      }
      res.candidates.push(best);
    });
    res.candidates.sort(function (x, y) { return x.start - y.start; });
    res.age = age(text);
    return res;
  }

  // Rule baseline: hand written dictionary, word bounded match, same assertion rules.
  function dictionaryScorer(dictionary, labels) {
    var res = labels.map(function (lab) {
      return (dictionary[lab] || []).map(function (ph) {
        return new RegExp("(^|[^a-z])" + ph.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^a-z])");
      });
    });
    return function (text) {
      var t = text.toLowerCase();
      return res.map(function (list) { return list.some(function (re) { return re.test(t); }) ? 1 : 0; });
    };
  }

  var api = { LABEL_INFO: LABEL_INFO, splitPassages: splitPassages, assertion: assertion, duration: duration,
              age: age, subjectOf: subjectOf, analyze: analyze, dictionaryScorer: dictionaryScorer, MAX_LEN: MAX_LEN };
  root.AfyaRules = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof self !== "undefined" ? self : globalThis);
