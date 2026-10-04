/* AfyaNote app v2. Case data lives in memory only (variable `state`).
   Nothing is written to localStorage, IndexedDB or a server. Only the UI language is remembered. */
(function () {
  "use strict";
  var I18N = window.AFYA_I18N, R = window.AfyaRules, C = window.AfyaClassifier;

  var PROFILE = { chu: "Kiharu Demo CHU (fictional)", chp: "CHP Demo 014 (fictional)" };
  var EXAMPLES = [
    { label: "ex_sw", text: "Mtoto wa miaka miwili ana homa siku tatu na anakohoa. Hawezi kunywa tangu jana. Hana kuhara." },
    { label: "ex_mixed", text: "Child 8 months, diarrhoea 2 days, anatapika kila kitu. Mama ana homa pia." },
    { label: "ex_en", text: "Baby: cough for 5 days, no fever. Vomited once last week." },
    { label: "ex_hard", text: "Mama anasema mtoto alipata degedege usiku na amelegea. Hana homa. Homa leo asubuhi." }
  ];
  function stamp(d) { var z = function (n) { return (n < 10 ? "0" : "") + n; }; return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate()) + " " + z(d.getHours()) + ":" + z(d.getMinutes()); }
  var ASSERTIONS = ["stated", "denied", "other_person", "past"];
  var ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
    visit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4h6v3H9z"/><path d="M15 5h3v16H6V5h3"/><path d="M9 12h6M9 16h4"/></svg>',
    facilities: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><path d="M12 7v5M9.5 9.5h5"/></svg>',
    about: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>'
  };

  var model = null, prepared = null, buildInfo = null, fac = null, dictionary = null;
  var lang = "en";
  try { lang = localStorage.getItem("afya_lang") || "en"; } catch (e) {}
  if (lang !== "en" && lang !== "sw") lang = "en";

  function fresh() {
    return { tab: "home", info: null, homeQuery: "", step: 0, note: "", analysis: null, decisions: {}, ageDecision: null, error: null,
      fields: { caseId: "", sex: "", ageValue: "", ageUnit: "years", referralTime: "", treatment: "", chu: PROFILE.chu, chp: PROFILE.chp, facilityId: "" },
      consent: false, created: null, ageFromNote: false, facFilter: "all", facQuery: "", sheet: null, qr: false, ms: null,
      cmp: "Kikohozi kavu, homma kidogo na ameharisha" };
  }
  var state = fresh();
  function resetCase(note) {
    var filter = state.facFilter;
    state = fresh(); state.facFilter = filter; state.note = note || "";
  }
  function replaceNote(note) {
    if (note !== state.note) resetCase(note);
  }
  function validAge() {
    var value = state.fields.ageValue.trim();
    return !value || (/^\d+(?:\.\d+)?$/.test(value) && Number.isFinite(Number(value)) && Number(value) >= 0);
  }

  function t(k) { var v = I18N[lang] && I18N[lang][k]; return v != null ? v : (I18N.en[k] != null ? I18N.en[k] : k); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function $(id) { return document.getElementById(id); }
  function info(lab) { return R.LABEL_INFO[lab]; }
  function termName(lab) { return lang === "sw" ? info(lab).sw : info(lab).en; }
  function termOther(lab) { return lang === "sw" ? info(lab).en : info(lab).sw; }
  function validDur(v) { var n = +v; return v !== "" && v != null && n >= 1 && n <= 365 && Math.floor(n) === n; }
  function daysTxt(n) { return n + " " + (n === 1 ? t("day") : t("days")); }

  // ---------- loading ----------
  function getJSON(url) {
    var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 8000);
    return fetch(url, { signal: controller.signal }).then(function (r) { if (!r.ok) throw new Error(url); return r.json(); })
      .finally(function () { clearTimeout(timer); });
  }
  function validateLoadedModel(m) {
    var finite = function (v) { return typeof v === "number" && Number.isFinite(v); };
    if (!m || !Array.isArray(m.labels) || m.labels.length !== 10 || new Set(m.labels).size !== 10 || m.labels.some(function (l) { return !R.LABEL_INFO[l]; }) ||
        !Array.isArray(m.vocab) || !m.vocab.length || m.vocab.length > 10000 || m.vocab.some(function (v) { return typeof v !== "string"; }) ||
        JSON.stringify(m.ngram) !== "[2,4]" || !Array.isArray(m.W) || m.W.length !== m.labels.length ||
        m.W.some(function (row) { return !Array.isArray(row) || row.length !== m.vocab.length || row.some(function (v) { return !finite(v); }); }) ||
        !Array.isArray(m.b) || m.b.length !== m.labels.length || m.b.some(function (v) { return !finite(v); }) ||
        !m.thresholds || !finite(m.thresholds.unclear) || !finite(m.thresholds.suggest) || m.thresholds.unclear <= 0 ||
        m.thresholds.suggest >= 1 || m.thresholds.unclear > m.thresholds.suggest) throw new Error("Invalid model");
    return m;
  }
  var loaded = false;
  function loadResources() { loaded = false; return Promise.all([
    getJSON("model.json").then(function (m) { var checked = validateLoadedModel(m); prepared = C.prepare(checked); model = checked; }).catch(function () { model = null; prepared = null; }),
    getJSON("facilities.json").then(function (f) { fac = prepFacilities(f); }).catch(function () { fac = null; }),
    getJSON("build_info.json").then(function (b) { buildInfo = b; }).catch(function () {}),
    getJSON("dictionary.json").then(function (d) { dictionary = d; }).catch(function () {})
  ]).then(function () { loaded = true; }); }
  var ready = loadResources();

  // ---------- offline status ----------
  var offlineState = "loading";
  function paintOffline() {
    var txt = offlineState === "ready" ? "✓ " + t("offline_ready") : offlineState === "no" ? t("offline_no") : t("offline_loading");
    if (offlineState === "ready" && navigator.onLine === false) txt = "✈ " + t("offline_now");
    ["offlinePill", "offlinePill2"].forEach(function (id) { var p = $(id); if (p) { p.textContent = txt; p.className = "pill" + (offlineState === "ready" ? " ok" : ""); } });
    var retry = $("retryResources"); if (retry) retry.hidden = !(offlineState === "no" || (loaded && (!model || !fac)));
  }
  function checkOffline(repair) {
    if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) { offlineState = "no"; paintOffline(); return Promise.resolve(false); }
    return new Promise(function (resolve) {
      var channel = new MessageChannel(), timer = setTimeout(function () { finish(false); }, 3000);
      function finish(ok) { clearTimeout(timer); channel.port1.close(); ok = ok && loaded && !!model && !!fac && !!dictionary && !!buildInfo; offlineState = ok ? "ready" : "no"; paintOffline(); renderStatsOnly(); resolve(ok); }
      channel.port1.onmessage = function (event) { finish(event.data.ready === true); };
      navigator.serviceWorker.controller.postMessage(repair === true ? "REPAIR_CACHE" : "CHECK_READY", [channel.port2]);
    });
  }
  function prepareOffline() {
    if (!("serviceWorker" in navigator) || !window.isSecureContext) { offlineState = "no"; paintOffline(); return Promise.resolve(); }
    offlineState = "loading"; paintOffline();
    var timeout = new Promise(function (_, reject) { setTimeout(function () { reject(new Error("Offline install timeout")); }, 10000); });
    return Promise.race([navigator.serviceWorker.register("sw.js").then(function () { return navigator.serviceWorker.ready; }), timeout])
      .then(checkOffline).catch(function () { offlineState = "no"; paintOffline(); renderStatsOnly(); });
  }
  window.addEventListener("online", paintOffline); window.addEventListener("offline", paintOffline);
  // A new version took over: reload once so the user sees it (only when no case is open).
  var hadController = "serviceWorker" in navigator && !!navigator.serviceWorker.controller, reloading = false;
  if ("serviceWorker" in navigator) navigator.serviceWorker.addEventListener("controllerchange", function () {
    checkOffline();
    if (hadController && !reloading && !state.analysis && !state.note) { reloading = true; location.reload(); }
  });
  prepareOffline();

  // ---------- facilities ----------
  function haversine(a, b) {
    var R0 = 6371, toR = Math.PI / 180, dLat = (b.lat - a.lat) * toR, dLon = (b.lon - a.lon) * toR;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R0 * Math.asin(Math.sqrt(h));
  }
  function prepFacilities(f) {
    var o = f.origin;
    var list = f.facilities.map(function (x) {
      var km = haversine(o, x);
      var dx = (x.lon - o.lon) * 111.32 * Math.cos(o.lat * Math.PI / 180), dy = (x.lat - o.lat) * 111.32;
      return Object.assign({}, x, { km: km, dx: dx, dy: dy, group: x.type.indexOf("hospital") === 0 ? "hospital" : x.type });
    }).sort(function (a, b) { return a.km - b.km; });
    list.forEach(function (x, i) { x.n = i + 1; });
    return { note: f.note, origin: o, list: list };
  }
  function walk(km) { var m = Math.round(km / 4 * 60); return m < 60 ? m + " " + t("min") : Math.floor(m / 60) + " " + t("h") + " " + (m % 60) + " " + t("min"); }
  function facById(id) { return fac && fac.list.filter(function (x) { return x.id === id; })[0]; }
  function facLabel(x) { return x ? x.name + " (" + t("type_" + x.type) + ", " + x.km.toFixed(1) + " km)" : ""; }
  function filteredFac() {
    if (!fac) return [];
    var q = state.facQuery.trim().toLowerCase();
    return fac.list.filter(function (x) {
      return (state.facFilter === "all" || x.group === state.facFilter) && (!q || x.name.toLowerCase().indexOf(q) >= 0);
    });
  }

  // ---------- analysis ----------
  function analyse() {
    state.error = null;
    if (!model) { state.error = t("err_model"); render(); return; }
    var t0 = performance.now();
    var res = R.analyze(state.note, model.labels, function (txt) { return C.scores(prepared, txt); }, model.thresholds);
    state.ms = performance.now() - t0;
    if (res.error) { state.error = t("err_" + res.error); render(); return; }
    res.candidates.forEach(function (c) { c.why = keyWords(c.evidence, model.labels.indexOf(c.label)); });
    state.analysis = res;
    state.decisions = {};
    res.candidates.forEach(function (c) { state.decisions[c.label] = { decision: "pending", assertion: c.assertion === "conflict" ? "" : c.assertion, edited: false }; });
    state.ageDecision = res.age && res.age.status === "suggested" ? "pending" : null;
    state.cur = null;
    state.created = new Date();
    state.step = 1;
    render(); window.scrollTo(0, 0);
  }
  // Words that pushed this suggestion up (exact share of the model score, see classify.explain)
  function keyWords(text, j) {
    var ex = C.explain(prepared, text, j).filter(function (w) { return w.contribution > 0.5; });
    if (!ex.length) return [];
    var top = ex[0].contribution;
    return ex.filter(function (w) { return w.contribution >= 0.4 * top; }).slice(0, 3);
  }
  function markWhy(text, why) {
    if (!why || !why.length) return esc(text);
    var ranges = why.slice().sort(function (a, b) { return a.start - b.start; }), out = "", pos = 0;
    ranges.forEach(function (w) { out += esc(text.slice(pos, w.start)) + "<b class='why'>" + esc(text.slice(w.start, w.end)) + "</b>"; pos = w.end; });
    return out + esc(text.slice(pos));
  }

  function reviewCount() {
    if (!state.analysis) return { done: 0, total: 0 };
    var keys = Object.keys(state.decisions), total = keys.length + (state.ageDecision !== null ? 1 : 0);
    var done = keys.filter(function (k) { var d = state.decisions[k]; return d.decision === "rejected" || (d.decision === "confirmed" && d.assertion); }).length;
    if (state.ageDecision === "confirmed" || state.ageDecision === "rejected") done++;
    return { done: done, total: total };
  }
  function allReviewed() { var c = reviewCount(); return !!state.analysis && c.done === c.total; }
  function confirmedDanger() {
    return Object.keys(state.decisions).filter(function (k) { var d = state.decisions[k]; return info(k).danger && d.decision === "confirmed" && d.assertion === "stated"; });
  }

  // ---------- views: visit ----------
  function stepper() {
    var s = "<div class='stephead'><button type='button' class='backbtn' id='stepBack' aria-label='" + esc(t("back")) + "'>←</button><div><div class='stepof'>" + esc(t("step_word")) + " " + (state.step + 1) + " " + esc(t("of_word")) + " 4</div><h1 class='steptitle'>" + esc(t("steps")[state.step]) + "</h1></div></div>";
    s += "<div class='stepper' aria-hidden='true'>" + [0, 1, 2, 3].map(function (i) { return "<div class='" + (i < state.step ? "done" : i === state.step ? "on" : "") + "'></div>"; }).join("") + "</div>";
    return s + "<p class='stephint'>" + esc(t("step_hint_" + (state.step + 1))) + "</p>";
  }

  function stats() {
    var kib = buildInfo ? Math.round(buildInfo.model_bytes / 1024) + " KiB" : (model ? "…" : "–");
    return "<div class='stats' id='stats'>" +
      stat(offlineState === "ready" ? "✓" : "…", t("stat_offline")) + stat(kib, t("stat_model")) +
      stat(model ? model.labels.length : "–", t("stat_terms")) + stat("0 B", t("stat_sent")) + "</div>";
  }
  function stat(v, l) { return "<div class='stat'><b>" + esc(v) + "</b><span>" + esc(l) + "</span></div>"; }
  function renderStatsOnly() { var s = $("stats"); if (s) s.outerHTML = stats(); }

  // ---------- home dashboard ----------
  var TILES = [
    { k: "visit", ic: "📝", kw: "note visit new start kumbukumbu ziara" },
    { k: "example", ic: "💡", kw: "example demo try mfano" },
    { k: "facilities", ic: "📍", kw: "map facility clinic hospital referral ramani kituo" },
    { k: "how", ic: "ⓘ", kw: "how works model offline small ai about" },
    { k: "install", ic: "⬇", kw: "install app download home screen offline sakinisha" }
  ];
  var installEvt = null;
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); installEvt = e; });
  function standalone() { return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone === true; }
  function viewHome() {
    var q = state.homeQuery.trim().toLowerCase();
    var h = "<section class='dash'><div class='eyebrow'>AfyaNote · " + esc(t("tagline")) + "</div><h1>" + esc(t("home_title")) + "</h1>";
    h += "<p class='dash-sub'>" + esc(t("home_sub")) + " <button class='ibtn' type='button' data-info='problem' aria-label='" + esc(t("home_why")) + "'>i</button></p>";
    h += "<div class='dash-facts'><span>✓ " + esc(t("home_f1")) + "</span><span>🔒 " + esc(t("home_f2")) + "</span><span>👤 " + esc(t("home_f3")) + "</span></div></section>";
    h += "<div class='searchrow'><input id='homeQuery' type='search' placeholder='" + esc(t("home_search")) + "' value='" + esc(state.homeQuery) + "' aria-label='" + esc(t("home_search")) + "'></div>";
    var tiles = TILES.filter(function (x) { if (x.k === "install" && standalone()) return false; return !q || (t("tile_" + x.k) + " " + t("tile_" + x.k + "_d") + " " + x.kw).toLowerCase().indexOf(q) >= 0; });
    h += "<div class='tiles'>" + tiles.map(function (x, i) {
      return "<button type='button' class='tile" + (i === 0 && !q ? " main" : "") + "' data-tile='" + x.k + "'><span class='tic' aria-hidden='true'>" + x.ic + "</span><b>" + esc(t("tile_" + x.k)) + "</b><span>" + esc(t("tile_" + x.k + "_d")) + "</span><span class='tgo' aria-hidden='true'>→</span></button>";
    }).join("") + "</div>";
    if (!tiles.length) h += "<p class='meta'>" + esc(t("nothing_found")) + "</p>";
    return h;
  }
  function infoSheet() {
    var k = state.info, body = "", btns = "";
    var close = "<button class='btn' type='button' data-closeinfo='1'>" + esc(t("close")) + "</button>";
    if (k === "problem") {
      body = "<h1>" + esc(t("home_why")) + "</h1>" + ["p", "a", "r"].map(function (x) { return "<div class='ib'><div class='eyebrow'>" + esc(t("why_" + x)) + "</div><p>" + esc(t("why_" + x + "_d")) + "</p></div>"; }).join("");
      btns = "<button class='btn primary' type='button' data-go='visit'>" + esc(t("tile_visit")) + " →</button>" + close;
    } else if (k === "note") {
      body = "<h1>" + esc(t("hero_title")) + "</h1><p class='meta'>🔒 " + esc(t("privacy")) + "</p><ol class='steps4'>" + [1, 2, 3, 4].map(function (n) { return "<li><span class='sn'>" + esc(t("step_word")) + " " + n + "</span><span>" + esc(t("step4_" + n)) + "</span></li>"; }).join("") + "</ol>" + stats();
      btns = close;
    } else if (k === "example") {
      body = "<div class='eyebrow'>" + esc(t("examples")) + "</div><h1>" + esc(t("tile_example")) + "</h1><p class='meta'>" + esc(t("tile_example_l")) + "</p><div class='exlist'>" + EXAMPLES.map(function (e, i) { return "<button type='button' class='exitem' data-exgo='" + i + "'><b>" + esc(t(e.label)) + "</b><span>" + esc(e.text) + "</span></button>"; }).join("") + "</div>";
      btns = close;
    } else if (k === "install") {
      body = "<div class='eyebrow'>PWA</div><h1>" + esc(t("tile_install")) + "</h1><p>" + esc(t("install_l")) + "</p>" + (installEvt ? "" : "<ol class='steps4'><li><span class='sn'>Android</span><span>" + esc(t("install_android")) + "</span></li><li><span class='sn'>iPhone</span><span>" + esc(t("install_ios")) + "</span></li></ol>");
      btns = (installEvt ? "<button class='btn primary' type='button' id='installBtn'>⬇ " + esc(t("tile_install")) + "</button>" : "") + close;
    } else {
      body = "<div class='eyebrow'>" + esc(t("tile_" + k + "_d")) + "</div><h1>" + esc(t("tile_" + k)) + "</h1><p>" + esc(t("tile_" + k + "_l")) + "</p>";
      btns = "<button class='btn primary' type='button' data-go='" + k + "'>" + esc(t("open_btn")) + " →</button>" + close;
    }
    return "<div class='sheet-bg' data-closeinfo='1'></div><div class='sheet' role='dialog' aria-modal='true' aria-label='" + esc(t("tile_" + k) || k) + "'><div class='grab'></div>" + body + "<div class='decide'>" + btns + "</div></div>";
  }

  function viewNote() {
    var h = stepper();
    h += "<section class='hero'><h2 class='herot'>" + esc(t("hero_title")) + " <button class='ibtn light' type='button' data-info='note' aria-label='" + esc(t("home_why")) + "'>i</button></h2>";
    h += "<label class='sr' for='note' style='position:absolute;left:-9999px'>" + esc(t("note_label")) + "</label>";
    h += "<textarea id='note' maxlength='" + (R.MAX_LEN + 50) + "' placeholder='Mtoto ana homa siku tatu…'>" + esc(state.note) + "</textarea>";
    h += "<div class='row' style='justify-content:space-between;margin-top:6px'><span class='meta' id='count'>" + state.note.length + " / " + R.MAX_LEN + " " + esc(t("chars")) + "</span><span class='meta'>" + esc(t("examples")) + "</span></div>";
    h += "<div class='chips'>" + EXAMPLES.map(function (e, i) { return "<button class='chip' type='button' data-ex='" + i + "'>" + esc(t(e.label)) + "</button>"; }).join("") + "</div>";
    h += "<div class='live' id='live' aria-live='polite'>" + liveHtml() + "</div></section>";
    if (state.error) h += "<div class='notice err' role='alert'>" + esc(state.error) + "</div>";
    if (loaded && !model) h += "<div class='notice err' role='alert'>" + esc(t("err_model")) + "</div>";
    h += "<button class='btn sm' type='button' id='retryResources' hidden>" + esc(t("retry_resources")) + "</button>";
    return h;
  }

  // Live preview while typing: same pipeline as the review step, nothing is accepted here.
  function liveHtml() {
    if (!model || state.note.trim().length < 3) return "<span class='live-h'>" + esc(t("live_idle")) + "</span>";
    var res = R.analyze(state.note, model.labels, function (txt) { return C.scores(prepared, txt); }, model.thresholds);
    if (res.error) return "";
    var chips = res.candidates.map(function (c) {
      var cls = c.assertion === "stated" ? "" : c.assertion === "conflict" ? " warn" : " off";
      return "<span class='lchip" + cls + "'>" + esc(termName(c.label)) + (c.assertion !== "stated" ? " · " + esc(t("st_" + c.assertion)) : "") + "</span>";
    });
    if (res.age && res.age.status === "suggested") chips.push("<span class='lchip age'>" + esc(t("age")) + " " + res.age.value + " " + esc(t(res.age.unit)) + "</span>");
    return "<span class='live-h'>⚡ " + esc(t("live_title")) + "</span>" + (chips.length ? chips.join("") : "<span class='live-h'>" + esc(t("nothing_found")) + "</span>");
  }
  var liveTimer = null;
  function updateLive() { clearTimeout(liveTimer); liveTimer = setTimeout(function () { var el = $("live"); if (el) el.innerHTML = liveHtml(); }, 120); }

  // Gaps a receiving officer would ask about: age and duration of confirmed symptoms. Documentation only.
  function gaps() {
    var a = state.analysis, out = [];
    a.candidates.forEach(function (c) {
      var d = state.decisions[c.label];
      if (d.decision === "confirmed" && d.assertion === "stated" && !c.duration) out.push({ kind: "dur", label: c.label, done: validDur(d.dur) });
    });
    var ageInNote = a.age && a.age.status === "suggested" && state.ageDecision !== "rejected";
    if (!ageInNote) out.push({ kind: "age", done: !!state.fields.ageValue });
    return out;
  }
  function gapsHtml() {
    var g = gaps(); if (!g.length) return "";
    var h = "<article class='card gaps'><div class='card-top'><span class='term'>🗣 " + esc(t("gaps_title")) + "</span><span class='badge " + (g.every(function (x) { return x.done; }) ? "b-sug'>✓" : "b-unc'>" + g.filter(function (x) { return !x.done; }).length + " " + esc(t("open"))) + "</span></div>";
    h += "<p class='meta' style='margin:0 0 8px'>" + esc(t("gaps_help")) + "</p>";
    g.forEach(function (x) {
      if (x.kind === "dur") {
        var d = state.decisions[x.label];
        h += "<div class='gap" + (x.done ? " done" : "") + "'><label for='dur_" + x.label + "'>" + esc(t("gap_since")) + " <b>" + esc(termName(x.label)) + "</b></label><span class='gin'><input id='dur_" + x.label + "' type='number' min='1' max='365' inputmode='numeric' data-dur='" + x.label + "' value='" + esc(d.dur || "") + "'><span>" + esc(t("days")) + "</span></span></div>";
      } else {
        var f = state.fields;
        h += "<div class='gap" + (x.done ? " done" : "") + "'><label for='g_age'>" + esc(t("gap_age")) + "</label><span class='gin'><input id='g_age' type='number' min='0' max='120' inputmode='numeric' data-f='ageValue' value='" + esc(f.ageValue) + "'><select data-f='ageUnit' aria-label='" + esc(t("age_unit")) + "'><option value='years'" + (f.ageUnit === "years" ? " selected" : "") + ">" + esc(t("years")) + "</option><option value='months'" + (f.ageUnit === "months" ? " selected" : "") + ">" + esc(t("months")) + "</option></select></span></div>";
      }
    });
    return h + "</article>";
  }

  // Keyboard review (desktop): the "current" card is the chosen one, else the first open one.
  function labels() { return state.analysis ? state.analysis.candidates.map(function (c) { return c.label; }) : []; }
  function curLabel() {
    var L = labels(); if (state.cur && L.indexOf(state.cur) >= 0) return state.cur;
    for (var i = 0; i < L.length; i++) if (state.decisions[L[i]].decision === "pending") return L[i];
    return L[0] || null;
  }
  function nextOpen(from) {
    var L = labels(), i0 = L.indexOf(from);
    for (var k = 1; k <= L.length; k++) { var l = L[(i0 + k) % L.length]; if (state.decisions[l].decision === "pending") return l; }
    return from;
  }
  function showCur() { var el = document.querySelector(".card.cur"); if (el && el.scrollIntoView) el.scrollIntoView({ block: "center", behavior: "smooth" }); }

  function highlighted() {
    var a = state.analysis, note = state.note, used = {}, dec = {};
    a.candidates.forEach(function (c) {
      used[c.passage] = true;
      var d = state.decisions[c.label] && state.decisions[c.label].decision;
      if (d === "confirmed") dec[c.passage] = dec[c.passage] || "ok";
      if (d === "rejected" && !dec[c.passage]) dec[c.passage] = "no";
      (c.others || []).forEach(function (o) { a.passages.forEach(function (p, i) { if (p.start === o.start) used[i] = true; }); });
    });
    var out = "", pos = 0;
    a.passages.forEach(function (p, i) {
      out += esc(note.slice(pos, p.start)) + "<mark data-p='" + i + "' class='" + (used[i] ? (dec[i] || "") : "unused") + "'>" + esc(note.slice(p.start, p.end)) + "</mark>";
      pos = p.end;
    });
    return { html: out + esc(note.slice(pos)), unused: a.passages.filter(function (p, i) { return !used[i]; }) };
  }

  function viewReview() {
    var a = state.analysis, hn = highlighted(), rc = reviewCount();
    var cur = curLabel();
    var h = stepper() + "<div class='rv'><div class='rv-side'>";
    if (state.ms != null) h += "<p class='meta' style='margin:-8px 0 12px'>⚡ " + esc(t("analysed_in")) + " " + (state.ms < 1 ? "&lt; 1" : Math.round(state.ms)) + " ms · " + esc(t("no_network")) + "</p>";
    h += "<div class='progress'><div class='bar'><i style='width:" + (rc.total ? rc.done / rc.total * 100 : 100) + "%'></i></div><span>" + rc.done + " / " + rc.total + " " + esc(t("checked")) + "</span></div>";
    h += "<div class='orig'>" + hn.html + "</div>";
    if (hn.unused.length) h += "<div class='meta'>⋯ " + esc(t("not_used")) + "</div>";
    h += "<p class='kbdhint meta'>⌨ " + esc(t("kbd_hint")) + "</p></div><div class='rv-main'>";
    if (!a.candidates.length) h += "<div class='notice warn'>" + esc(t("no_candidates")) + "</div>";
    a.candidates.forEach(function (c) {
      var d = state.decisions[c.label];
      h += "<article class='card " + (d.decision === "confirmed" ? "confirmed" : d.decision === "rejected" ? "rejected" : "") + (state.kb && cur === c.label ? " cur" : "") + "' data-card='" + c.label + "' data-passage='" + c.passage + "'>";
      h += "<div class='card-top'><span class='term'>" + esc(termName(c.label)) + "<small>" + esc(termOther(c.label)) + "</small></span>";
      if (c.field !== "suggested") h += "<span class='badge b-unc'>" + esc(t("unclear")) + "</span>";
      if (info(c.label).danger) h += "<span class='badge b-who' title='WHO IMCI general danger sign'>⚠ " + esc(t("danger_short")) + "</span>";
      h += "</div>";
      h += "<div class='quote'>“" + markWhy(c.evidence, c.why) + "”" + (c.others ? c.others.map(function (o) { return "<br>+ “" + esc(o.evidence) + "” · " + esc(t("st_" + o.assertion)); }).join("") : "") + "</div>";
      if (c.duration) h += "<div class='meta'>" + esc(t("duration")) + ": " + esc(daysTxt(c.duration.days)) + " · “" + esc(c.duration.raw) + "”</div>";
      else if (d.dur && d.assertion === "stated") h += "<div class='meta'>" + esc(t("duration")) + ": " + esc(daysTxt(+d.dur)) + " · " + esc(t("dur_asked")) + "</div>";
      h += "<div class='seg small' role='radiogroup' aria-label='Status'><span class='seglabel'>" + esc(t("status_word")) + "</span>";
      if (!d.assertion) h += "<span class='badge b-unc' style='align-self:center'>" + esc(t("st_conflict")) + "</span>";
      ASSERTIONS.forEach(function (s) {
        h += "<label><input type='radio' name='as_" + c.label + "' value='" + s + "' data-as='" + c.label + "'" + (d.assertion === s ? " checked" : "") + "><span>" + esc(t("st_" + s)) + "</span></label>";
      });
      h += "</div>";
      if (d.edited) h += "<div class='meta'>✎ " + esc(t("edited")) + "</div>";
      h += "<div class='decide'><button class='btn " + (d.decision === "confirmed" ? "ok" : "") + "' type='button' data-ok='" + c.label + "'" + (d.assertion ? "" : " disabled") + ">" + (d.decision === "confirmed" ? "✓ " + esc(t("confirmed")) : esc(t("confirm"))) + "</button>";
      h += "<button class='btn " + (d.decision === "rejected" ? "no" : "") + "' type='button' data-no='" + c.label + "'>" + (d.decision === "rejected" ? "✕ " + esc(t("rejected")) : esc(t("reject"))) + "</button></div></article>";
    });
    var ag = a.age;
    h += "<article class='card " + (state.ageDecision === "confirmed" ? "confirmed" : state.ageDecision === "rejected" ? "rejected" : "") + "'><div class='card-top'><span class='term'>" + esc(t("age")) + "</span>";
    if (ag.status === "suggested") {
      h += "<span class='badge b-sug'>" + esc(t("suggested")) + "</span></div><div class='quote'>“" + esc(ag.raw) + "” → " + ag.value + " " + esc(t(ag.unit)) + "</div>";
      h += "<div class='decide'><button class='btn " + (state.ageDecision === "confirmed" ? "ok" : "") + "' type='button' id='ageOk'>" + (state.ageDecision === "confirmed" ? "✓ " + esc(t("confirmed")) : esc(t("confirm"))) + "</button><button class='btn " + (state.ageDecision === "rejected" ? "no" : "") + "' type='button' id='ageNo'>" + (state.ageDecision === "rejected" ? "✕ " + esc(t("rejected")) : esc(t("reject"))) + "</button></div>";
    } else if (ag.status === "unclear") {
      h += "<span class='badge b-unc'>" + esc(t("age_unclear")) + "</span></div><div class='quote'>“" + esc(ag.raw) + "” · " + esc(ag.reason) + "</div>";
    } else h += "<span class='badge b-unc'>" + esc(t("age_missing")) + "</span></div>";
    h += "</article>" + gapsHtml();
    var dg = confirmedDanger();
    if (dg.length) h += "<div class='notice warn'><b>" + esc(t("danger_title")) + "</b>" + esc(t("danger_body")) + esc(dg.map(termName).join(", ")) + ". " + esc(t("danger_note")) + "</div>";
    return h + "</div></div>";
  }

  function field(id, label, control) { return "<div class='field'><label for='f_" + id + "'>" + esc(label) + "</label>" + control + "</div>"; }
  function viewComplete() {
    var f = state.fields, ag = state.analysis.age, agePre = ag.status === "suggested" && state.ageDecision === "confirmed";
    var h = stepper();
    h += field("caseId", t("case_id"), "<input id='f_caseId' data-f='caseId' value='" + esc(f.caseId) + "' placeholder='KE-DEMO-001' autocomplete='off'>");
    h += field("sex", t("sex"), "<select id='f_sex' data-f='sex'><option value=''>…</option>" + [["female", "sex_f"], ["male", "sex_m"], ["not_recorded", "sex_x"]].map(function (o) { return "<option value='" + o[0] + "'" + (f.sex === o[0] ? " selected" : "") + ">" + esc(t(o[1])) + "</option>"; }).join("") + "</select>");
    var av = f.ageValue, au = f.ageUnit;
    h += "<div class='two'>" + field("ageValue", t("age_value") + (agePre ? " · " + t("age_from_note") : ""), "<input id='f_ageValue' data-f='ageValue' inputmode='numeric' value='" + esc(av) + "'>") +
      field("ageUnit", t("age_unit"), "<select id='f_ageUnit' data-f='ageUnit'><option value='years'" + (au === "years" ? " selected" : "") + ">" + esc(t("years")) + "</option><option value='months'" + (au === "months" ? " selected" : "") + ">" + esc(t("months")) + "</option></select>") + "</div>";
    h += field("referralTime", t("referral_time"), "<input id='f_referralTime' type='datetime-local' data-f='referralTime' value='" + esc(f.referralTime) + "'>");
    h += field("treatment", t("treatment"), "<input id='f_treatment' data-f='treatment' value='" + esc(f.treatment) + "' placeholder='" + esc(t("treatment_ph")) + "'>");
    var sel = facById(f.facilityId);
    h += "<fieldset><legend>" + esc(t("profile")) + "</legend>" + field("chu", t("chu"), "<input id='f_chu' data-f='chu' value='" + esc(f.chu) + "'>");
    h += "<div class='inline'>" + field("facility", t("facility"), "<input id='f_facility' readonly value='" + esc(sel ? facLabel(sel) : "") + "' placeholder='…'>") + "<button class='btn sm' type='button' id='pickFac' style='min-height:48px'>📍 " + esc(t("pick_facility")) + "</button></div>";
    h += field("chp", t("chp"), "<input id='f_chp' data-f='chp' value='" + esc(f.chp) + "'>") + "</fieldset>";
    h += "<label class='check'><input type='checkbox' id='consent'" + (state.consent ? " checked" : "") + "><span>" + esc(t("consent")) + "</span></label>";
    if (!validAge()) h += "<div class='notice err' id='ageError' role='alert'>" + esc(t("err_age")) + "</div>";
    h += "<p class='meta'>" + esc(t("consent_demo")) + "</p>";
    return h;
  }

  function draft() {
    var f = state.fields, a = state.analysis, dec = state.decisions, groups = { stated: [], denied: [], other: [] };
    a.candidates.forEach(function (c) {
      var d = dec[c.label]; if (d.decision !== "confirmed") return;
      var item = { term_en: info(c.label).en, term_sw: info(c.label).sw, label: c.label, evidence: c.evidence,
        duration_days: d.assertion !== "stated" ? null : c.duration ? c.duration.days : (validDur(d.dur) ? +d.dur : null),
        duration_source: d.assertion !== "stated" ? null : c.duration ? "note" : (validDur(d.dur) ? "asked_during_visit" : null), status: d.assertion, edited_by_user: d.edited };
      (d.assertion === "stated" ? groups.stated : d.assertion === "denied" ? groups.denied : groups.other).push(item);
    });
    var ag = a.age, agePre = ag.status === "suggested" && state.ageDecision === "confirmed";
    var ageVal = f.ageValue.trim(), ageUnit = f.ageUnit;
    var sel = facById(f.facilityId);
    return {
      schema: "afyanote.referral-draft/0.3",
      form_reference: "Oriented on MOH 100 Community Referral Form, section A (historical template). Not an official or validated form.",
      status: allReviewed() && state.consent && validAge() ? "reviewed_by_user" : "draft",
      created_device_time: state.created ? state.created.toISOString() : null,
      referral_time: f.referralTime || null, case_id: f.caseId || null, sex: f.sex || null,
      age: ageVal && validAge() ? { value: Number(ageVal), unit: ageUnit } : null,
      community_health_unit: f.chu || null,
      link_health_facility: sel ? { id: sel.id, name: sel.name, type: sel.type, keph_level: sel.kephLevel, straight_line_km: +sel.km.toFixed(1), demo_data: true } : null,
      community_health_promoter: f.chp || null,
      main_problems: groups.stated, documented_absent: groups.denied, mentioned_other_person_or_past: groups.other,
      who_imci_general_danger_signs_confirmed: confirmedDanger().map(function (k) { return info(k).en; }),
      treatment_given: f.treatment || null, original_note: state.note, consent_recorded: state.consent,
      model: model ? { name: model.name, version: model.version, thresholds: model.thresholds } : null,
      review_log: a.candidates.map(function (c) { var decision = dec[c.label]; return { label: c.label, decision: decision.decision,
        selected_status: decision.assertion || null, original_rule_status: c.assertion, edited_by_user: decision.edited,
        evidence: [{ text: c.evidence, start: c.start, end: c.end }].concat((c.others || []).map(function (o) { return { text: o.evidence, start: o.start, end: o.end }; })) }; }),
      demo_data_fictional: true
    };
  }
  function probs(list) { return list.map(function (p) { return p.term_en + (p.duration_days ? " (" + p.duration_days + (p.duration_days === 1 ? " day)" : " days)") : ""); }); }
  function draftText(d, compact) {
    var L = [], com = [];
    L.push("REFERRAL DRAFT · MOH 100 oriented, section A · " + d.status.toUpperCase());
    L.push("Created (device): " + (d.created_device_time || "-"));
    L.push("Referral time: " + (d.referral_time || "OPEN"));
    L.push("Case: " + (d.case_id || "OPEN") + " | Sex: " + (d.sex || "OPEN") + " | Age: " + (d.age ? d.age.value + " " + d.age.unit : "OPEN"));
    L.push("CHU: " + (d.community_health_unit || "OPEN") + " | Link facility: " + (d.link_health_facility ? d.link_health_facility.name : "OPEN"));
    L.push("Main problem(s): " + (d.main_problems.length ? probs(d.main_problems).join("; ") : "OPEN"));
    L.push("Treatment given: " + (d.treatment_given || "not stated"));
    if (d.documented_absent.length) com.push("Documented as not present: " + d.documented_absent.map(function (p) { return p.term_en; }).join(", "));
    if (d.mentioned_other_person_or_past.length) com.push("Mentioned, not this patient or not current: " + d.mentioned_other_person_or_past.map(function (p) { return p.term_en + " (" + p.status + ")"; }).join(", "));
    if (d.who_imci_general_danger_signs_confirmed.length) com.push("CHP confirmed the note mentions WHO IMCI general danger sign(s): " + d.who_imci_general_danger_signs_confirmed.join(", "));
    com.push('Original note: "' + d.original_note + '"');
    L.push("Comments: " + com.join(" | "));
    L.push("CHP: " + (d.community_health_promoter || "OPEN") + " | Consent recorded: " + (d.consent_recorded ? "yes" : "no"));
    if (!compact) L.push("Section B: to be completed by the receiving officer.");
    L.push("AfyaNote " + (d.model ? d.model.version : "") + " · documentation aid, not a clinical decision.");
    return L.join("\n");
  }

  function viewHandover() {
    var d = draft(), o = function (v) { return v ? esc(v) : "<span class='openv'>" + esc(t("open")) + "</span>"; };
    var h = stepper() + "<p class='help'>" + esc(t("handover_sub")) + "</p>";
    h += "<p class='notice info'>" + esc(t("fictional_handover")) + "</p>";
    h += "<div class='form'><div class='form-h'><strong>MOH 100 · A</strong><span class='badge " + (d.status === "draft" ? "b-unc" : "b-sug") + "'>" + esc(d.status === "draft" ? t("status_draft") : t("status_reviewed")) + "</span></div><dl>";
    var rows = [
      [t("created"), o(state.created ? stamp(state.created) : "")],
      [t("referral_time"), o(d.referral_time ? d.referral_time.replace("T", " ") : "")],
      [t("case_id"), o(d.case_id)],
      [t("sex"), o(d.sex ? t({ female: "sex_f", male: "sex_m", not_recorded: "sex_x" }[d.sex]) : "")],
      [t("age"), o(d.age ? d.age.value + " " + t(d.age.unit) : "")],
      [t("chu"), o(d.community_health_unit)],
      [t("facility"), o(d.link_health_facility ? d.link_health_facility.name : "")],
      [t("main_problems"), d.main_problems.length ? probs(d.main_problems).map(esc).join("<br>") : o("")],
      [t("treatment"), d.treatment_given ? esc(d.treatment_given) : "<span class='meta'>" + esc(t("not_stated")) + "</span>"]
    ];
    var com = [];
    if (d.documented_absent.length) com.push(esc(t("documented_absent")) + ": " + esc(d.documented_absent.map(function (p) { return p.term_en; }).join(", ")));
    if (d.mentioned_other_person_or_past.length) com.push(esc(t("other_or_past")) + ": " + esc(d.mentioned_other_person_or_past.map(function (p) { return p.term_en + " (" + t("st_" + p.status) + ")"; }).join(", ")));
    if (d.who_imci_general_danger_signs_confirmed.length) com.push("WHO IMCI: " + esc(d.who_imci_general_danger_signs_confirmed.join(", ")));
    com.push(esc(t("original_note")) + ": “" + esc(d.original_note) + "”");
    rows.push([t("comments"), com.join("<br>")], [t("chp"), o(d.community_health_promoter)]);
    rows.forEach(function (r) { h += "<dt>" + esc(r[0]) + "</dt><dd>" + r[1] + "</dd>"; });
    h += "</dl></div>";
    if (d.status === "draft") h += "<div class='notice warn'>" + esc(t("need_review")) + "</div>";
    h += "<div class='exportmain'><button class='btn primary big' type='button' id='printBtn'" + (d.status === "draft" ? " disabled" : "") + ">📄 " + esc(t("create_pdf")) + "</button><button class='btn big' type='button' id='qrBtn'" + (d.status === "draft" ? " disabled" : "") + ">▦ " + esc(t("show_qr")) + "</button></div>";
    h += "<details class='more'><summary>" + esc(t("more_export")) + "</summary><div class='row' style='margin-top:10px'><button class='btn' type='button' id='copyBtn'" + (d.status === "draft" ? " disabled" : "") + ">" + esc(t("copy_text")) + "</button><button class='btn' type='button' id='jsonBtn'" + (d.status === "draft" ? " disabled" : "") + ">" + esc(t("export_json")) + "</button><button class='btn' type='button' id='mdBtn'" + (d.status === "draft" ? " disabled" : "") + ">" + esc(t("export_md")) + "</button></div></details>";
    h += "<p class='meta'>" + esc(t("export_note")) + "</p>";
    h += "<p id='exportStatus' class='meta' role='status' aria-atomic='true'></p>";
    return h;
  }

  // ---------- views: facilities ----------
  function mapSvg(list) {
    var W = 360, H = 300, cx = W / 2, cy = H / 2;
    var maxKm = Math.max.apply(null, fac.list.map(function (x) { return x.km; }).concat([2]));
    var rings = [2, 5, 10, 15].filter(function (r) { return r <= maxKm + 1; });
    var outer = rings[rings.length - 1], s = 128 / outer;
    var g = "<svg viewBox='0 0 " + W + " " + H + "' role='group' aria-label='" + esc(t("fac_title")) + "'><rect class='map-bg' width='" + W + "' height='" + H + "'/>";
    rings.forEach(function (r) { g += "<circle class='ringc' cx='" + cx + "' cy='" + cy + "' r='" + (r * s).toFixed(1) + "'/><text class='ringt' x='" + (cx + r * s * 0.72 + 3).toFixed(1) + "' y='" + (cy + r * s * 0.72 + 12).toFixed(1) + "'>" + r + " km</text>"; });
    g += "<g aria-hidden='true'><path d='M" + (W - 22) + " 30 l6 -14 l6 14 l-6 -4z' fill='var(--muted)'/><text class='ringt' x='" + (W - 20) + "' y='44'>N</text></g>";
    g += "<g><rect x='" + (cx - 9) + "' y='" + (cy - 9) + "' width='18' height='18' rx='4' fill='var(--ink)'/><path d='M" + (cx - 5) + " " + (cy + 1) + " L" + cx + " " + (cy - 4) + " L" + (cx + 5) + " " + (cy + 1) + " V" + (cy + 5) + " H" + (cx - 5) + "z' fill='var(--paper)'/></g>";
    var shown = {}; list.forEach(function (x) { shown[x.id] = true; });
    fac.list.forEach(function (x) {
      var lx = cx + x.dx * s, ly = cy - x.dy * s, on = state.fields.facilityId === x.id;
      if (shown[x.id]) g += "<line class='link" + (on ? " on" : "") + "' x1='" + cx + "' y1='" + cy + "' x2='" + lx.toFixed(1) + "' y2='" + ly.toFixed(1) + "'/>";
    });
    fac.list.forEach(function (x) {
      var px = cx + x.dx * s, py = cy - x.dy * s, sel = state.fields.facilityId === x.id;
      var color = x.group === "hospital" ? "var(--red)" : x.group === "health_centre" ? "var(--blue)" : "var(--green)";
      var shape = x.group === "hospital" ? "<rect class='dot' x='" + (px - 9) + "' y='" + (py - 9) + "' width='18' height='18' transform='rotate(45 " + px + " " + py + ")' fill='" + color + "'/>"
        : x.group === "health_centre" ? "<rect class='dot' x='" + (px - 9) + "' y='" + (py - 9) + "' width='18' height='18' rx='3' fill='" + color + "'/>"
        : "<circle class='dot' cx='" + px + "' cy='" + py + "' r='10' fill='" + color + "'/>";
      g += "<g class='pin" + (sel ? " sel" : "") + "' data-fac='" + x.id + "' tabindex='0' role='button' aria-label='" + esc(x.name) + "' opacity='" + (shown[x.id] ? 1 : 0.25) + "'>" +
        (sel ? "<circle class='halo' cx='" + px + "' cy='" + py + "' r='16'/>" : "") + shape +
        "<text x='" + px + "' y='" + (py + 4) + "' text-anchor='middle' style='fill:#fff;stroke:none;font-size:10px'>" + x.n + "</text></g>";
    });
    return g + "</svg>";
  }
  function viewFacilities() {
    if (!fac) return "<h1>" + esc(t("fac_title")) + "</h1><div class='notice err'>facilities.json missing</div>";
    var list = filteredFac();
    var h = "<div class='eyebrow'>" + esc(fac.origin.name) + "</div><h1>" + esc(t("fac_title")) + "</h1><p class='help'>" + esc(t("fac_note")) + "</p>";
    h += "<div class='mapwrap'>" + mapSvg(list) + "</div>";
    h += "<div class='searchrow'><input id='facQuery' type='search' placeholder='" + esc(t("fac_search")) + "' value='" + esc(state.facQuery) + "' aria-label='" + esc(t("fac_search")) + "'><kbd class='slash' aria-hidden='true'>/</kbd><span class='count' aria-live='polite'><b>" + list.length + "</b> / " + fac.list.length + "</span></div>";
    h += "<div class='fchips' role='group'>" + ["all", "dispensary", "health_centre", "hospital"].map(function (k) { return "<button class='fchip' type='button' data-ff='" + k + "' aria-pressed='" + (state.facFilter === k) + "'>" + esc(t("fac_" + k)) + "</button>"; }).join("") + "</div>";
    h += "<div class='flist'>" + list.map(function (x) {
      return "<button class='fitem" + (state.fields.facilityId === x.id ? " sel" : "") + "' type='button' data-fac='" + x.id + "'><span class='ficon'>" + x.n + "</span><span style='min-width:0'><b>" + esc(x.name) + "</b><span>" + esc(t("type_" + x.type)) + " · " + esc(t("level")) + " " + x.kephLevel + "</span></span><span class='fdist'>" + x.km.toFixed(1) + " km<br><span class='meta'>" + esc(walk(x.km)) + "</span></span></button>";
    }).join("") + "</div>";
    return h;
  }
  function sheetHtml() {
    var x = facById(state.sheet); if (!x) return "";
    var isSel = state.fields.facilityId === x.id;
    return "<div class='sheet-bg' data-close='1'></div><div class='sheet' role='dialog' aria-modal='true' aria-label='" + esc(x.name) + "'><div class='grab'></div>" +
      "<div class='eyebrow'>" + esc(t("type_" + x.type)) + " · " + esc(t("level")) + " " + x.kephLevel + "</div><h1>" + esc(x.name) + "</h1>" +
      "<div class='stats' style='grid-template-columns:repeat(2,1fr)'>" + stat(x.km.toFixed(1) + " km", t("straight")) + stat(walk(x.km), t("walk") + " 4 km/h") + "</div>" +
      "<p class='meta'>" + esc(t("fac_note")) + "</p><div class='decide'>" +
      "<button class='btn " + (isSel ? "ok" : "primary") + "' type='button' id='useFac' data-id='" + x.id + "'>" + (isSel ? "✓ " + esc(t("used_facility")) : esc(t("use_facility"))) + "</button><button class='btn' type='button' data-close='1'>" + esc(t("close")) + "</button></div></div>";
  }

  function qrSheet() {
    var d = draft(), txt = draftText(d, true), svg = "";
    try {
      window.qrcode.stringToBytes = window.qrcode.stringToBytesFuncs["UTF-8"];
      var q = window.qrcode(0, "L"); q.addData(txt, "Byte"); q.make();
      svg = q.createSvgTag({ cellSize: 4, margin: 4, scalable: true });
    } catch (e) { svg = "<p class='notice err'>QR: " + esc(e.message || e) + "</p>"; }
    return "<div class='sheet-bg' data-closeqr='1'></div><div class='sheet' role='dialog' aria-modal='true' aria-label='" + esc(t("qr_title")) + "'><div class='grab'></div>" +
      "<div class='eyebrow'>MOH 100 · A · " + esc(t("status_reviewed")) + "</div><h1>" + esc(t("qr_title")) + "</h1>" +
      "<div class='qrbox'>" + svg + "</div><p class='meta'>" + esc(t("qr_note")) + " " + txt.length + " " + esc(t("chars")) + ".</p>" +
      "<div class='decide' style='grid-template-columns:1fr'><button class='btn' type='button' data-closeqr='1'>" + esc(t("close")) + "</button></div></div>";
  }

  // ---------- views: about ----------
  var CMP_EXAMPLES = ["Kikohozi kavu, homma kidogo na ameharisha", "Baby threw up twice, tummy ache, feverish",
    "Mtoto amelegea sana, alishikwa na degedege", "Leo tulizungumza kuhusu bei ya kahawa"];
  function found(note, scorer, thr) {
    var r = R.analyze(note, model.labels, scorer, thr);
    if (r.error) return [];
    return r.candidates.filter(function (c) { return c.field === "suggested"; });
  }
  function chipsFor(list) {
    if (!list.length) return "<span class='meta'>" + esc(t("nothing_found")) + "</span>";
    return list.map(function (c) { return "<span class='tchip'>" + esc(termName(c.label)) + " <small>" + esc(t("st_" + c.assertion)) + "</small></span>"; }).join("");
  }
  // Why no LLM on the phone: published sizes and memory needs next to this phone's reported memory (Chrome only, rounded).
  // Measured comparison on the same 40 second-author notes (llm/reports/20261004_selection_saved_40, eval/independent_results.md).
  // The language model ran on a laptop outside the app; nothing here runs it.
  var LLM_ROWS = [
    { n: "AfyaNote", sub: "llm_sub_app", size: "243 KiB", terms: "58/63", extra: "1", ctx: "0" },
    { n: "Qwen3 0.6B", sub: "llm_sub_ft", size: "335 MB", terms: "54/63", extra: "13", ctx: "3" },
    { n: "Qwen3 0.6B", sub: "llm_sub_base", size: "335 MB", terms: "0/63", extra: "0", ctx: "0" }
  ];
  function llmPanel() {
    var h = "<h2>" + esc(t("llm_title")) + "</h2><p class='help'>" + esc(t("llm_help2")) + "</p>";
    h += "<div class='llm' role='table' aria-label='" + esc(t("llm_title")) + "'><div class='lrow lh' role='row'><span role='columnheader'>" + esc(t("llm_c_model")) + "</span><span role='columnheader'>" + esc(t("llm_c_size")) + "</span><span role='columnheader'>" + esc(t("llm_c_terms")) + "</span><span role='columnheader'>" + esc(t("llm_c_extra")) + "</span><span role='columnheader'>" + esc(t("llm_c_ctx")) + "</span></div>";
    LLM_ROWS.forEach(function (r, i) {
      h += "<div class='lrow" + (i === 0 ? " me" : "") + "' role='row'><span role='cell'><b>" + esc(r.n) + "</b><small>" + esc(t(r.sub)) + "</small></span><span class='mono' role='cell'>" + esc(r.size) + "</span><span class='mono' role='cell'>" + esc(r.terms) + "</span><span class='mono' role='cell'>" + esc(r.extra) + "</span><span class='mono' role='cell'>" + esc(r.ctx) + "</span></div>";
    });
    return h + "</div><p class='meta'>" + esc(t("llm_note2")) + "</p>";
  }
  function viewAbout() {
    var m = model, b = buildInfo;
    var h = "<div class='eyebrow'>" + esc(t("tab_about")) + "</div><h1>" + esc(t("how_title")) + "</h1>";
    h += "<div class='pipe'>" + [["1", t("pipe_1"), t("pipe_1s")], ["2", t("pipe_2"), t("pipe_2s")], ["3", t("pipe_3"), t("pipe_3s")], ["4", t("pipe_4"), t("pipe_4s")]].map(function (x, i) {
      return "<div class='pstep" + (i === 1 ? " hl" : "") + "'><span class='pn'>" + x[0] + "</span><div><b>" + esc(x[1]) + "</b><span>" + esc(x[2]) + "</span></div></div>";
    }).join("") + "</div>";
    if (m && dictionary) {
      var mod = found(state.cmp, function (txt) { return C.scores(prepared, txt); }, m.thresholds);
      var kw = found(state.cmp, R.dictionaryScorer(dictionary, m.labels), { suggest: 0.5, unclear: 0.5 });
      h += "<h2>" + esc(t("compare_title")) + "</h2><p class='help'>" + esc(t("compare_help")) + "</p>";
      h += "<input id='cmpInput' class='cmpin' value='" + esc(state.cmp) + "' aria-label='" + esc(t("compare_title")) + "'>";
      h += "<div class='chips light'>" + CMP_EXAMPLES.map(function (e, i) { return "<button class='chip' type='button' data-cmpex='" + i + "'>" + esc(e.length > 26 ? e.slice(0, 24) + "…" : e) + "</button>"; }).join("") + "</div>";
      h += "<div class='cmp'><div class='cmpcol'><div class='eyebrow'>AfyaNote · " + esc(t("compare_model")) + "</div>" + chipsFor(mod) + "</div><div class='cmpcol'><div class='eyebrow'>" + esc(t("compare_keywords")) + "</div>" + chipsFor(kw) + "</div></div>";
    }
    h += llmPanel();
    h += "<h2>" + esc(t("facts_title")) + "</h2><table class='kv'>";
    var rows = [];
    if (m) rows.push([t("fr_model"), m.name + " " + m.version + " · " + (b ? Math.round(b.model_bytes / 1024) + " KiB · " : "") + m.vocab.length + " " + t("fr_features") + " · " + m.labels.length + " " + t("fr_terms")], [t("fr_thresholds"), t("fr_suggest") + " ≥ " + m.thresholds.suggest + ", " + t("fr_unclear") + " ≥ " + m.thresholds.unclear]);
    if (b) rows.push([t("fr_unseen"), t("compare_model") + " " + b.heldout_f1_model + " · " + t("compare_keywords") + " " + b.heldout_f1_dictionary], [t("fr_typos"), t("compare_model") + " " + b.typo_f1_model + " · " + t("compare_keywords") + " " + b.typo_f1_dictionary], [t("fr_contrast"), b.contrast_pass]);
    ["data", "unsupported", "case", "facilities", "form", "thirdparty"].forEach(function (k) { rows.push([t("fr_" + k), t("fr_" + k + "_v")]); });
    rows.forEach(function (r) { h += "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td></tr>"; });
    h += "</table><p class='foot'>" + esc(t("fr_disclaimer")) + "</p>";
    return h;
  }

  // ---------- chrome ----------
  function renderNav() {
    var tabs = [["home", t("tab_home")], ["visit", t("tab_visit")], ["facilities", t("tab_facilities")], ["about", t("tab_about")]];
    var btn = function (k, l) { return "<button type='button' data-tab='" + k + "'" + (state.tab === k ? " aria-current='page'" : "") + ">" + ICON[k] + "<span>" + esc(l) + "</span></button>"; };
    $("tabbar").innerHTML = tabs.map(function (x) { return btn(x[0], x[1]); }).join("");
    $("sideNav").innerHTML = tabs.map(function (x) { return btn(x[0], x[1]); }).join("");
    $("sideSteps").innerHTML = state.tab === "visit" ? t("steps").map(function (s, i) { return "<li class='" + (i === state.step ? "on" : i < state.step ? "done" : "") + "'>" + (i < state.step ? "✓ " : "") + esc(s) + "</li>"; }).join("") : "";
    var rc = reviewCount(), pct = state.step === 0 ? 0 : state.step === 1 ? (rc.total ? rc.done / rc.total : 1) * 50 : state.step === 2 ? 75 : 100;
    $("ringArc").setAttribute("stroke-dasharray", (pct * 0.942).toFixed(1) + " 100");
    $("sideStatus").textContent = state.tab === "visit" ? (state.step + 1) + " / 4 · " + t("steps")[state.step] : t("tab_" + state.tab);
    $("sideSub").textContent = state.step === 1 ? rc.done + " / " + rc.total + " " + t("checked") : t("tagline");
  }
  function renderActions() {
    var a = "";
    if (state.tab === "visit") {
      if (state.step === 0) a = "<button class='btn primary' type='button' id='goAnalyse'>" + esc(t("analyse")) + " →</button>";
      else if (state.step === 1) a = "<button class='btn' type='button' id='back'>" + esc(t("back")) + "</button><button class='btn primary' type='button' id='next'" + (allReviewed() ? "" : " disabled") + ">" + esc(t("next")) + " →</button>";
      else if (state.step === 2) a = "<button class='btn' type='button' id='back'>" + esc(t("back")) + "</button><button class='btn primary' type='button' id='next'" + (validAge() ? "" : " disabled") + ">" + esc(t("next")) + " →</button>";
      else a = "<button class='btn' type='button' id='back'>" + esc(t("back")) + "</button><button class='btn' type='button' id='newCase'>↺ " + esc(t("new_case")) + "</button>";
    }
    $("actions").hidden = !a;
    $("actionsIn").innerHTML = a;
  }
  function render() {
    var previous = document.activeElement, focusId = previous && previous.id, focusData = null;
    if (previous && previous.dataset) ["as", "ok", "no", "ff", "lang", "tab"].some(function (key) {
      if (previous.dataset[key] !== undefined) { focusData = { key: key, value: previous.dataset[key], radio: previous.type === "radio" ? previous.value : null,
        side: previous.closest(".side") ? ".side " : previous.closest(".topbar") ? ".topbar " : "" }; return true; } return false;
    });
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i")); });
    document.querySelectorAll("[data-lang]").forEach(function (el) { el.innerHTML = "<span" + (lang === "en" ? " class='on'" : "") + ">English</span><span" + (lang === "sw" ? " class='on'" : "") + ">Kiswahili</span>"; el.setAttribute("aria-label", lang === "en" ? "Switch to Kiswahili" : "Badilisha kwa English"); });
    syncHistory();
    var v = state.tab === "home" ? viewHome() : state.tab === "facilities" ? viewFacilities() : state.tab === "about" ? viewAbout() : [viewNote, viewReview, viewComplete, viewHandover][state.step]();
    $("view").innerHTML = v;
    $("view").classList.toggle("wide", state.tab === "visit" && state.step === 1);
    $("sheetRoot").innerHTML = state.info ? infoSheet() : state.qr ? qrSheet() : state.sheet ? sheetHtml() : "";
    renderNav(); renderActions(); paintOffline();
    document.querySelectorAll("[data-newcase]").forEach(function (button) { button.textContent = t("new_case"); button.hidden = !state.note && state.step === 0; });
    var dialog = document.querySelector("#sheetRoot [role=dialog]");
    document.querySelector(".shell").inert = !!dialog; $("actions").inert = !!dialog; $("tabbar").inert = !!dialog;
    if (dialog) { var first = dialog.querySelector("button"); if (first) first.focus(); }
    else if (focusId && $(focusId)) $(focusId).focus({ preventScroll: true });
    else if (focusData) {
      var selector = focusData.side + "[data-" + focusData.key + "='" + focusData.value + "']" + (focusData.radio ? "[value='" + focusData.radio + "']" : "");
      var target = document.querySelector(selector); if (target) target.focus({ preventScroll: true });
    }
  }
  // Browser back/forward: every tab and visit step has its own history entry.
  var applyingHistory = false;
  function route() { return state.tab === "visit" ? "#visit-" + (state.step + 1) : "#" + state.tab; }
  function syncHistory() {
    if (applyingHistory) return;
    var r = route();
    if (location.hash !== r) { if (!location.hash) history.replaceState(null, "", r); else history.pushState(null, "", r); }
  }
  function applyRoute() {
    var h = (location.hash || "#home").slice(1), m = /^visit-(\d)$/.exec(h);
    state.info = null; state.sheet = null; state.qr = false;
    if (m) {
      var want = Math.min(3, Math.max(0, +m[1] - 1));
      if (!state.analysis) want = 0;
      else if (want >= 2 && !allReviewed()) want = 1;
      else if (want === 3 && !(validAge() && state.consent)) want = 2;
      state.tab = "visit"; state.step = want;
    } else if (["home", "facilities", "about"].indexOf(h) >= 0) state.tab = h;
    else state.tab = "home";
    applyingHistory = true; render(); applyingHistory = false;
    if (location.hash !== route()) history.replaceState(null, "", route());
    window.scrollTo(0, 0);
  }
  window.addEventListener("popstate", applyRoute);
  function focusView() { var heading = $("view").querySelector("h1"); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } }

  // ---------- events ----------
  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.id === "note") { replaceNote(el.value); $("count").textContent = state.note.length + " / " + R.MAX_LEN + " " + t("chars"); document.querySelectorAll("[data-newcase]").forEach(function (b) { b.hidden = !state.note; }); renderNav(); updateLive(); }
    else if (el.dataset && el.dataset.dur) state.decisions[el.dataset.dur].dur = el.value;
    else if (el.id === "homeQuery") { state.homeQuery = el.value; var hp = el.selectionStart; render(); var hq = $("homeQuery"); hq.focus(); hq.setSelectionRange(hp, hp); }
    else if (el.id === "cmpInput") { state.cmp = el.value; var p2 = el.selectionStart; render(); var ci = $("cmpInput"); ci.focus(); ci.setSelectionRange(p2, p2); }
    else if (el.id === "facQuery") { state.facQuery = el.value; var pos = el.selectionStart; render(); var q = $("facQuery"); q.focus(); q.setSelectionRange(pos, pos); }
    else if (el.dataset && el.dataset.f) {
      state.fields[el.dataset.f] = el.value;
      if (el.dataset.f === "ageValue" || el.dataset.f === "ageUnit") { state.ageFromNote = false; renderActions(); var warning = $("ageError"); if (warning) warning.remove();
        if (!validAge()) { var ageError = document.createElement("div"); ageError.id = "ageError"; ageError.className = "notice err"; ageError.setAttribute("role", "alert"); ageError.textContent = t("err_age"); $("view").appendChild(ageError); } }
    }
  });
  document.addEventListener("change", function (e) {
    var el = e.target;
    if (el.dataset && el.dataset.as) { var d = state.decisions[el.dataset.as]; d.assertion = el.value; d.edited = true; d.decision = "pending"; render(); }
    else if (el.id === "consent") state.consent = el.checked;
    else if (el.closest && el.closest(".gaps")) setTimeout(function () { var y = window.scrollY, fid = document.activeElement && document.activeElement.id; render(); window.scrollTo(0, y); if (fid && $(fid)) $(fid).focus(); }, 0);
  });
  document.addEventListener("keydown", function (e) {
    var dialog = document.querySelector("#sheetRoot [role=dialog]");
    if (e.key === "Tab" && dialog) {
      var buttons = Array.from(dialog.querySelectorAll("button:not(:disabled),a[href],input,select,textarea,[tabindex='0']"));
      var first = buttons[0], last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches("g.pin")) { e.preventDefault(); state.sheet = e.target.getAttribute("data-fac"); render(); }
    if (e.key === "Escape" && state.info) { state.info = null; render(); return; }
    if (e.key === "Escape" && (state.sheet || state.qr)) { var wasQr = state.qr, oldSheet = state.sheet; state.sheet = null; state.qr = false; render();
      var returnControl = wasQr ? $("qrBtn") : document.querySelector("button[data-fac='" + oldSheet + "']"); if (returnControl) returnControl.focus(); return; }
    var tag = (document.activeElement && document.activeElement.tagName) || "";
    if (e.key === "/" && state.tab === "facilities" && !/INPUT|TEXTAREA|SELECT/.test(tag)) { e.preventDefault(); var fq = $("facQuery"); if (fq) fq.focus(); return; }
    if (state.tab !== "visit" || state.step !== 1 || /INPUT|TEXTAREA|SELECT/.test(tag) || e.metaKey || e.ctrlKey || e.altKey) return;
    if (tag === "BUTTON" && (e.key === "Enter" || e.key === " ")) return;
    var cur = curLabel(), L = labels(); if (!cur) return;
    var d = state.decisions[cur], hit = true;
    if (e.key >= "1" && e.key <= "4") { var a = ASSERTIONS[+e.key - 1]; if (d.assertion !== a) { d.assertion = a; d.edited = true; d.decision = "pending"; } }
    else if (e.key === "Enter" || e.key === "c" || e.key === "C") { if (d.assertion) { d.decision = "confirmed"; state.cur = nextOpen(cur); } }
    else if (e.key === "x" || e.key === "X") { d.decision = "rejected"; state.cur = nextOpen(cur); }
    else if (e.key === "ArrowDown" || e.key === "j") state.cur = L[Math.min(L.length - 1, L.indexOf(cur) + 1)];
    else if (e.key === "ArrowUp" || e.key === "k") state.cur = L[Math.max(0, L.indexOf(cur) - 1)];
    else hit = false;
    if (hit) { e.preventDefault(); state.kb = true; render(); showCur(); }
  });
  document.addEventListener("click", function (e) {
    var pin = e.target.closest && e.target.closest("[data-fac]");
    if (pin) { state.sheet = pin.getAttribute("data-fac"); render(); return; }
    var el = e.target.closest && e.target.closest("button,[data-close]"); if (!el) return;
    var ds = el.dataset;
    if (ds.closeinfo) { state.info = null; render(); return; }
    if (ds.info) { state.info = ds.info; render(); return; }
    if (ds.tile) { state.info = ds.tile; render(); return; }
    if (ds.exgo !== undefined) { replaceNote(EXAMPLES[+ds.exgo].text); state.info = null; state.tab = "visit"; state.step = 0; render(); window.scrollTo(0, 0); return; }
    if (ds.go) { var go = ds.go; state.info = null; state.tab = go === "how" ? "about" : go === "facilities" ? "facilities" : "visit"; if (go === "visit") state.step = state.analysis ? state.step : 0; render(); window.scrollTo(0, 0); focusView(); return; }
    if (el.id === "installBtn" && installEvt) { installEvt.prompt(); installEvt.userChoice.then(function () { installEvt = null; state.info = null; render(); }); return; }
    if (ds.close) { var closedSheet = state.sheet; state.sheet = null; render(); var item = document.querySelector("button[data-fac='" + closedSheet + "']"); if (item) item.focus(); return; }
    if (ds.closeqr) { state.qr = false; render(); if ($("qrBtn")) $("qrBtn").focus(); return; }
    if (ds.cmpex !== undefined) { state.cmp = CMP_EXAMPLES[+ds.cmpex]; render(); return; }
    if (ds.tab) { state.tab = ds.tab; state.sheet = null; state.qr = false; render(); focusView(); window.scrollTo(0, 0); return; }
    if (ds.lang !== undefined) { lang = lang === "en" ? "sw" : "en"; try { localStorage.setItem("afya_lang", lang); } catch (x) {} render(); return; }
    if (ds.ex !== undefined) { replaceNote(EXAMPLES[+ds.ex].text); state.error = null; render(); return; }
    if (ds.newcase !== undefined) { resetCase(); render(); $("note").focus(); window.scrollTo(0, 0); return; }
    if (ds.ff) { state.facFilter = ds.ff; render(); return; }
    if (ds.ok) { var d = state.decisions[ds.ok]; if (d.assertion) d.decision = d.decision === "confirmed" ? "pending" : "confirmed"; render(); return; }
    if (ds.no) { var d2 = state.decisions[ds.no]; d2.decision = d2.decision === "rejected" ? "pending" : "rejected"; render(); return; }
    switch (el.id) {
      case "goAnalyse": analyse(); if (!state.error) focusView(); break;
      case "back": state.step = Math.max(0, state.step - 1); render(); focusView(); break;
      case "stepBack": if (state.step === 0) state.tab = "home"; else state.step--; render(); focusView(); window.scrollTo(0, 0); break;
      case "next": if ((state.step === 1 && !allReviewed()) || (state.step === 2 && !validAge())) return; state.step++; render(); focusView(); window.scrollTo(0, 0); break;
      case "ageOk": state.ageDecision = state.ageDecision === "confirmed" ? "pending" : "confirmed";
        if (state.ageDecision === "confirmed") { state.fields.ageValue = String(state.analysis.age.value); state.fields.ageUnit = state.analysis.age.unit; state.ageFromNote = true; }
        else if (state.ageFromNote) { state.fields.ageValue = ""; state.ageFromNote = false; } render(); break;
      case "ageNo": state.ageDecision = state.ageDecision === "rejected" ? "pending" : "rejected";
        if (state.ageFromNote) { state.fields.ageValue = ""; state.ageFromNote = false; } render(); break;
      case "newCase": resetCase(); render(); $("note").focus(); window.scrollTo(0, 0); break;
      case "retryResources": el.disabled = true; ready = loadResources(); Promise.all([ready, prepareOffline()]).then(function () { return checkOffline(true); }).then(function () { render(); }); break;
      case "pickFac": state.returnToVisit = true; state.tab = "facilities"; render(); window.scrollTo(0, 0); break;
      case "useFac":
        state.fields.facilityId = state.fields.facilityId === ds.id ? "" : ds.id; state.sheet = null;
        if (state.returnToVisit && state.fields.facilityId) { state.returnToVisit = false; state.tab = "visit"; }
        render(); var chosenControl = state.tab === "visit" ? $("pickFac") : document.querySelector("button[data-fac='" + ds.id + "']"); if (chosenControl) chosenControl.focus(); break;
      case "qrBtn": if (draft().status !== "draft") { state.qr = true; render(); } break;
      case "copyBtn": if (draft().status !== "draft") copyText(el); break; // guard even if the button was re-enabled
      case "jsonBtn": if (draft().status !== "draft") downloadJson(); break;
      case "mdBtn": if (draft().status !== "draft") downloadMarkdown(); break;
      case "printBtn": if (draft().status !== "draft") window.print(); break;
    }
  });
  // hovering or focusing a card highlights its passage in the original note
  document.addEventListener("pointerover", function (e) {
    var card = e.target.closest && e.target.closest("[data-passage]");
    document.querySelectorAll("mark.focus").forEach(function (m) { m.classList.remove("focus"); });
    if (card) { var m = document.querySelector("mark[data-p='" + card.getAttribute("data-passage") + "']"); if (m) m.classList.add("focus"); }
  });

  function copyText(btn) {
    var txt = draftText(draft()), done = function () { btn.textContent = "✓ " + t("copied"); };
    function fallback() { var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { if (document.execCommand("copy")) done(); else exportStatus(t("copy_failed")); } catch (x) { exportStatus(t("copy_failed")); } ta.remove(); btn.focus(); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, fallback); else fallback();
  }
  function downloadJson() {
    downloadFile(JSON.stringify(draft(), null, 2), "application/json", "json");
  }
  function exportStatus(message) { if ($("exportStatus")) $("exportStatus").textContent = message; }
  function downloadFile(text, type, extension) {
    var url;
    try {
      url = URL.createObjectURL(new Blob([text], { type: type }));
      var a = document.createElement("a"); a.href = url; a.download = "afyanote-fictional-draft." + extension;
      document.body.appendChild(a); a.click(); a.remove(); exportStatus(t("download_started"));
    } catch (e) { exportStatus(t("download_failed")); }
    finally { if (url) setTimeout(function () { URL.revokeObjectURL(url); }, 2000); }
  }
  function literalBlock(text) {
    var runs = String(text).match(/`+/g) || [], size = Math.max.apply(null, [3].concat(runs.map(function (r) { return r.length + 1; })));
    var fence = "`".repeat(size); return fence + "text\n" + text + "\n" + fence;
  }
  function downloadMarkdown() {
    var d = draft(), lines = ["# AfyaNote · fictional referral draft", "", "Fictional demonstration only. Not an official form or clinical assessment.", "", literalBlock(draftText(d)), "", "## Review record", ""];
    d.review_log.forEach(function (r) { lines.push(r.label + " · " + r.decision + " · " + (r.selected_status || "unresolved"), "");
      r.evidence.forEach(function (e) { lines.push("Source offsets " + e.start + "–" + e.end + " (UTF-16)", "", literalBlock(e.text), ""); }); });
    lines.push("Downloaded files, copied text, screenshots, PDFs and scanned QR codes persist outside the app. Handle them separately.", "");
    downloadFile(lines.join("\n"), "text/markdown;charset=utf-8", "md");
  }
  window.addEventListener("pageshow", function (event) { if (event.persisted) { resetCase(); render(); } });

  // Privacy: blur case content while the app is in the background, warn before closing an open case.
  document.addEventListener("visibilitychange", function () { document.body.classList.toggle("veil", document.hidden && !!state.analysis); });
  window.addEventListener("beforeunload", function (e) { if (state.analysis) { e.preventDefault(); e.returnValue = ""; } });

  render();
  ready.then(function () { render(); checkOffline(); });
})();
