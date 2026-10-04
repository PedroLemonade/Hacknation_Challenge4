# Texte für die Abgabe · aktuelle, überprüfbare Fassung

> **Herkunft:** Claude-Grundfassung, durch ChatGPT / Codex am 04.10.2026 auf v0.4.11 und belegbare Aussagen überarbeitet. Alte Medien bleiben erhalten.

**Project name:** AfyaNote

**Challenge:** 04 World Bank · Small AI for Development · Health

**One liner:** Offline small AI that proposes evidence-backed documentation terms from a Swahili or English visit note for a human-reviewed referral draft.

**Description:**
AfyaNote is a hackathon prototype for community health promoters in Kenya. A 243 KiB character n-gram classifier runs locally in a browser and proposes ten fixed documentation terms from Swahili, English or mixed notes. Each proposal shows its original evidence and requires confirmation or rejection. Bounded rules flag negation, another person, past events and ambiguity. Missing age or duration can be asked during the visit. The output is a draft oriented on section A of MOH 100, with original text and explicit gaps. Facility data are fictional. On a known 40-note synthetic regression set, the model finds 58 of 63 terms, compared with 46 for a phrase dictionary; these are not clinical performance results. A 0.6B language model fine tuned on the same synthetic data (335 MB, run on a laptop outside the app) found 54 of 63 terms with 13 extra terms and 3 context errors, so the small classifier stays in the app. Current source-matched desktop checks cover the review/export gates and simulated offline restart. Physical target-phone tests, native-language review, clinical validation and workflow benefit remain open. There is no diagnosis, urgency decision or generated medical narrative. Case text is not sent by the app to a server. Reviewed drafts can deliberately leave the app through files, print, clipboard or QR. The next step is to test the workflow and integration need with health promoters and receiving facilities.

**Tech stack:** Python/scikit-learn training; character n-gram logistic classifiers exported to JSON; plain JavaScript inference; PWA/service worker; local SVG demo map; locally bundled QR library; optional LLM experiment outside the app (guard, Ollama harness, Qwen3 0.6B QLoRA run with MLX on a MacBook Air). Static HTTPS hosting is planned; Vercel and public GitHub links must be filled in after actual setup. Built with Claude and ChatGPT/Codex; see the contribution record.

**Evidence note:** Current app v0.4.11; 31 source-matched desktop browser checks, 34 model contrast checks and 52 known context checks. All learning/evaluation data synthetic and unreviewed. Negation scope and complex person/time combinations remain bounded.

**Links to fill in before submission:**

| Item | Real link / status |
|---|---|
| Public GitHub | **OPEN — replace with verified public URL** |
| Live HTTPS demo | **OPEN — replace with verified URL** |
| World Bank / Hack Nation demo video | **OPEN — 2–5 minutes per World Bank brief** |
| Tech video | **OPEN** |
| Team video | **OPEN** |

These placeholders are not submission links. T14 must enter the same verified links on both required platforms. Sources and claim limits: [claim check](../02_research/codex_claims_20261004.md). Exact portal field limits should be checked when filling the form.
