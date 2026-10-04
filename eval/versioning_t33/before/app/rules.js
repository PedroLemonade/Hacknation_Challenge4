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
  var PATIENT_RE = /\b(mtoto|mtoto wake|msichana|mvulana|mgonjwa|child|baby|infant|boy|girl|patient)\b/;
  var CONTINUE_RE = /^(pia|tena|vilevile|also|and also|as well)\b/;
  var PAST_RE = /\b(wiki iliyopita|mwezi uliopita|mwaka jana|zamani|last week|last month|last year|previously)\b/;

  // Claude rule foundation; bounded role/context repair by ChatGPT / Codex (T31).
  // These are explicit patterns, not a general parser or a language validation.
  var ROLE_WORDS = "mama|baba|bibi|babu|dada|kaka|jirani|shangazi|mjomba|mother|father|grandmother|grandfather|sister|brother|neighbou?r|aunt|uncle|mtoto|msichana|mvulana|mgonjwa|child|baby|infant|boy|girl|patient";
  var REPORT_WORDS = "anasema|amesema|alisema|says|said|reports|reported|hasemi|hakusema";
  var REPORT_AFTER_RE = new RegExp("^\\s+(?:" + REPORT_WORDS + ")\\b");
  var COMPANION_BEFORE_RE = /\b(?:in front of|in the presence of|accompanied by|with|mbele ya|akiwa na|pamoja na)\s+(?:the\s+)?$/;
  var OWNER_BEFORE_RE = new RegExp("\\b(?:" + ROLE_WORDS + ")\\s+(?:of\\s+(?:the\\s+)?|wa\\s+)$");
  var OWNER_AFTER_RE = new RegExp("^[’']s\\s+(?:the\\s+)?(?:" + ROLE_WORDS + ")\\b");
  var NEG_REPORT_RE = /\b(?:(?:does|did|has)\s+not\s+(?:say|said|report|reported)|hasemi|hakusema)\b/;

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
  // ctx supplies the original sentence so a split at "na/and" does not erase
  // accompaniment or a coordinated subject. Offsets and evidence are unchanged.
  function subjectOf(passageText, ctx) {
    var low = (ctx ? ctx.sentenceText : passageText).toLowerCase();
    var offset = ctx ? ctx.passageOffset : 0, end = offset + passageText.length;
    var re = new RegExp("\\b(" + ROLE_WORDS + ")\\b", "g"), roles = [], m;
    while ((m = re.exec(low))) {
      var before = low.slice(0, m.index), after = low.slice(m.index + m[0].length);
      var role = REPORT_AFTER_RE.test(after) ? "reporter" :
        OWNER_BEFORE_RE.test(before) || OWNER_AFTER_RE.test(after) ? "owner" :
        COMPANION_BEFORE_RE.test(before) && !/^\s+(?:who|that|ambaye)\b/.test(after) ? "companion" : "affected";
      roles.push({ word: m[0], index: m.index, end: m.index + m[0].length,
                   who: PATIENT_RE.test(m[0]) ? "patient" : "other", role: role });
    }
    var active = roles.filter(function (r) { return r.role === "affected"; });
    var coordinated = active.some(function (r, i) {
      return i > 0 && /^\s+(?:and|na)\s+(?:the\s+)?$/.test(low.slice(active[i - 1].end, r.index));
    });
    var local = active.filter(function (r) { return r.index >= offset && r.index < end; });
    var roleCues = roles.filter(function (r) { return r.role !== "affected"; }).map(function (r) { return r.role + ": " + r.word; });
    var kinds = {};
    local.forEach(function (r) { kinds[r.who] = true; });
    var ambiguous = coordinated || Object.keys(kinds).length > 1;
    var missingReportedSubject = !active.length && roles.some(function (r) { return r.role === "reporter" || r.role === "companion"; });
    return { who: ambiguous || missingReportedSubject ? "unknown" : local.length ? local[0].who : null,
             cue: local.length ? local[0].word : null, roleCues: roleCues,
             reason: coordinated ? "coordinated people" : ambiguous ? "multiple possible affected people" : missingReportedSubject ? "reported or accompanied person not explicit" : null,
             reportNegated: NEG_REPORT_RE.test(low) };
  }

  // Keep person, finding negation and time separate internally. The existing
  // single-status export cannot express other+denied or past+denied together:
  // require the existing human choice instead of silently discarding a dimension.
  function assertion(passageText, ctx) {
    var low = passageText.toLowerCase(), sub = subjectOf(passageText), cues = [];
    ctx = ctx || { who: sub.who || "patient", cue: sub.cue, roleCues: sub.roleCues, reason: sub.reason, reportNegated: sub.reportNegated };
    if (ctx.carriedOther) { ctx.who = "other"; ctx.cue = ctx.carriedOther; }
    var neg = masked(low).replace(NEG_REPORT_RE, " _ ").match(NEG_RE), past = low.match(PAST_RE);
    var context = { subject: ctx.who || "patient", subject_cue: ctx.cue || null,
                    negated: !!neg, past: !!past, report_negated: !!ctx.reportNegated,
                    role_cues: ctx.roleCues || [], reason: ctx.reason || null };
    if (neg) cues.push("negation: " + neg[1]);
    if (context.subject === "other") cues.push("person: " + (ctx.cue || "other") + (ctx.carried ? " (carried subject)" : ""));
    if (past) cues.push("time: " + past[1]);
    cues = cues.concat(context.role_cues);
    var combined = (context.subject === "other" && (neg || past)) || (neg && past);
    if (context.subject === "unknown" || context.report_negated || combined) {
      context.reason = context.reason || (context.report_negated ? "negation concerns the report" : "multiple status dimensions");
      cues.push("context: " + context.reason);
      return { status: "conflict", cues: cues, context: context };
    }
    return { status: neg ? "denied" : context.subject === "other" ? "other_person" : past ? "past" : "stated", cues: cues, context: context };
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
    var byLabel = {}, prev = null, sentences = {};
    res.passages.forEach(function (p) {
      var s = sentences[p.sentence];
      if (!s) sentences[p.sentence] = { start: p.start, end: p.end };
      else s.end = p.end;
    });
    res.passages.forEach(function (p, pi) {
      var sentence = sentences[p.sentence];
      var sub = subjectOf(p.text, { sentenceText: text.slice(sentence.start, sentence.end), passageOffset: p.start - sentence.start });
      var who = sub.who, cue = sub.cue, carried = false, reason = sub.reason;
      if (!who && prev) {
        var sameSentence = prev.sentence === p.sentence;
        if (sameSentence || p.cont || CONTINUE_RE.test(p.text.toLowerCase())) { who = prev.who; cue = prev.cue; carried = true; reason = prev.reason; }
        else if (prev.who === "other" || prev.who === "unknown") { who = "unknown"; reason = "new sentence without an explicit affected person"; }
      }
      who = who || "patient"; // documented note-patient convention, not a clinical inference
      p.subject = who === "unknown" ? null : who;
      prev = { who: who, cue: cue, sentence: p.sentence, reason: reason };
      var probs = scorer(p.text);
      var a = assertion(p.text, { who: who, cue: cue, carried: carried, reason: reason,
                                  roleCues: sub.roleCues, reportNegated: sub.reportNegated });
      var d = duration(p.text);
      labels.forEach(function (lab, j) {
        var s = probs[j];
        if (s < thresholds.unclear) return;
        var c = { label: lab, score: s, passage: pi, evidence: p.text, start: p.start, end: p.end,
                  field: a.status !== "conflict" && s >= thresholds.suggest ? "suggested" : "unclear",
                  assertion: a.status, cues: a.cues, duration: d, context: a.context };
        (byLabel[lab] = byLabel[lab] || []).push(c);
      });
    });
    Object.keys(byLabel).forEach(function (lab) {
      var list = byLabel[lab].sort(function (x, y) { return y.score - x.score; });
      var best = Object.assign({}, list[0]);
      var statuses = {};
      list.forEach(function (c) { if (c.field === "suggested" || c.assertion === "conflict" || list.length === 1) statuses[c.assertion] = true; });
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
