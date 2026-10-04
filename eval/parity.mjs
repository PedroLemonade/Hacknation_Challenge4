// Checks that the browser classifier reproduces the Python probabilities.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const C = require("../app/classify.js");
const model = JSON.parse(readFileSync(new URL("../app/model.json", import.meta.url)));
const fx = JSON.parse(readFileSync(new URL("./parity_fixtures.json", import.meta.url)));
const P = C.prepare(model);
let maxd = 0, decisionFlips = 0;
const t = model.thresholds.suggest;
fx.texts.forEach((txt, i) => {
  const js = C.scores(P, txt);
  js.forEach((v, j) => {
    const py = fx.probs[i][j];
    maxd = Math.max(maxd, Math.abs(v - py));
    if ((v >= t) !== (py >= t)) decisionFlips++;
  });
});
const ok = maxd <= 1e-5 && decisionFlips === 0;
console.log(JSON.stringify({ fixtures: fx.texts.length, max_abs_diff: maxd, decision_flips: decisionFlips, tolerance: 1e-5, pass: ok }));
process.exit(ok ? 0 : 1);
