# Demo Arbeit · Claude · 04.10.2026

**Zusammengeführt am 4. Okt, 01:45 (v0.4.4).** Basis v0.3.1, Codex Stand von 01:17 (v0.3.3) und Claude v0.4.3 per `git merge-file`. Zwei Konfliktstellen, beide ohne Verlust gelöst:
* Eingabe Handler: Codex `replaceNote` (Fall zurücksetzen bei neuer Notiz) plus Claude Live Vorschau und Dauer Feld
* Tastatur Handler: Codex Escape mit Fokus Rückgabe, danach Claude Tastatur Prüfung
* `sw.js` vollständig von Codex übernommen (Cache pro Scope, CHECK_READY), VERSION `afyanote-v0.4.4`
Geprüft auf dem zusammengeführten Stand: `eval/e2e.py` PASS, Funktionstests Claude (Live Vorschau, Lücken, Tastatur, Sichtschutz, Suche) bestanden, axe 0 Verstöße (Test mit CSP Bypass, weil Codex eine CSP gesetzt hat). Die Patch Ordner liegen im Archiv.
**Codex:** Bitte vor weiteren Änderungen in `app/` die aktuellen Dateien neu lesen.
## Was sich in app/ geändert hat (01:00 bis 01:35)
* `app.js`
  * Live Vorschau beim Tippen (`liveHtml`, `updateLive`), übernimmt nichts
  * Karte „Ask before you leave“ (`gaps`, `gapsHtml`): fehlendes Alter und Dauer je bestätigtem, zutreffendem Begriff. Eingabe `data-dur` speichert in `state.decisions[label].dur`; im Entwurf `duration_days` plus `duration_source` (`note` oder `asked_during_visit`), nur ganze Zahlen 1 bis 365 (`validDur`)
  * Notiz Markierung nach Entscheidung (`mark.ok`, `mark.no`)
  * Tastatur im Prüfschritt (1 bis 4, Enter, X, Pfeile; `curLabel`, `nextOpen`, `state.cur`, `state.kb`)
  * Prüfschritt ab 1200 px zweispaltig (`.rv`, `.rv-side`, `.rv-main`, `#view.wide`)
  * Sichtschutz bei `visibilitychange`, Warnung bei `beforeunload` mit offenem Fall
  * Zeitstempel ohne Locale (`stamp`), Beispiel Chips und Takwimu Tabelle übersetzt
* `i18n.js`: neue Schlüssel (ex_*, not_stated, fr_*, live_*, gaps_*, gap_*, dur_asked, kbd_hint); en und sw je gleich viele Schlüssel
* `index.html`: CSS für die neuen Teile; Karten SVG `role='group'` statt `img` (axe nested-interactive)
* `eval/eval.mjs`: setzt Exit Code 1, wenn ein Kontrasttest fällt (für `.github/workflows/check.yml`)

## Nachtrag v0.4.2 (01:50)
* About Tab: Tafel „Why no large language model on the phone“ (`llmPanel`, `LLM_ROWS`), liest `navigator.deviceMemory`, Werte laut Herstellerangaben. Hintergrund: `docs/03_plan/lokales_llm.md`
* i18n: llm_* Schlüssel, en und sw je 177

## Nachtrag v0.4.3 (02:00)
* Startseite: Liste „Step 1 bis 4“ unter dem Datenschutz Hinweis (`.steps4`, Schlüssel step_word, step4_1..4)
* Einrichtungen: Trefferzahl neben der Suche („2 / 9“), Taste „/“ fokussiert die Suche (Desktop Hinweis `kbd.slash`)
* i18n: en und sw je 182 Schlüssel

## Von Codex gemessene Fehler (demo_baseline.json), noch nicht von Claude angefasst
* Neue Notiz analysiert: alte Fallnummer, Behandlung und Einwilligung bleiben stehen
* Fokus nach Neuaufbau landet auf BODY
* Ungültiges Alter wird als `null` exportiert, Einheit bleibt
* Fokus im QR Dialog landet auf BODY

Die übernimmt Codex (laut Codex Stand 01:15 bereits in Arbeit: resetCase, validAge). Claude ändert `app/` bis zur Rückmeldung nicht mehr.

## Prüfungen nach v0.4.3
`eval/e2e.py` PASS, axe 0 Verstöße (Telefon und Desktop, hell und dunkel), Parität pass, Kontrasttests 33/33.

## Nach dem Merge (02:05, v0.4.7)
* `app/index.html`: `[hidden]{display:none!important}` (Knopf „New case“ war trotz `hidden` sichtbar, weil `.btn` display setzt), Kopfzeile auf schmalen Handys einzeilig (Neuer Fall als ↺, Markenname unter 390 px ausgeblendet)
* `app/app.js`: Knopf „Check / reload local package“ nur noch, wenn Modell oder Einrichtungen fehlen oder das Offline Paket unvollständig ist
* `app/rules.js`: Alter mit Dezimalzahl („2.5 years“, „miaka 2,5“) wird nicht mehr als 5 gelesen, sondern als „unclear“; neuer Kontrasttest, jetzt 34/34. Term Kennzahlen unverändert
* README: Codex Abschnitt zum Testset übernommen, eigene doppelte Zeilen entfernt

## 02:20 · Abstimmung mit Codex
* Codex Regressionstest (`eval/demo-regression.cjs`) auf Claudes Stand gelaufen: 22 von 23 bestanden. Offen nur Codex Bereich „Explicit retry restores an evicted package“ (und danach „Missing install asset … retry visible“).
* Claude hat dabei einen eigenen Fehler aus v0.4.6 behoben: lange Statustexte („Offline package incomplete“, Swahili) schoben die Kopfzeile über den Rand. `app/index.html`: `.top-right` darf wachsen und bei Bedarf umbrechen, `max-width:65%` aufgehoben. Normalzustand bleibt einzeilig ab 360 px. Check „390 px note screen fits“ jetzt bestanden.
* `app/sw.js`: nicht angefasst. **Bitte VERSION beim Abschluss hochzählen** (mindestens v0.4.10), weil `index.html` um 02:06 geändert wurde, nachdem Codex v0.4.9 gesetzt hatte.
* Claude fasst `checkOffline`, `retryResources`, den Service Worker und den Text „fits this phone“ nicht an, bis Codex fertig meldet. Hinweis an Codex: `retryResources` wird nur beim Neuaufbau gerendert; nach `checkOffline` ohne `render()` bleibt der Knopf unsichtbar.

## 02:35 · Nach Codex Abschluss (v0.4.10)
* Desktop Stand vollständig übernommen (Codex v0.4.9 inkl. Paket Reparatur, Review `codex_demo_review.md`).
* `app/sw.js`: VERSION `afyanote-v0.4.10` wegen der Kopfzeilen Änderung in `index.html` von 02:06.
* Auf v0.4.10 geprüft: Codex `eval/demo-regression.cjs` 27/27, `eval/e2e.py` PASS, axe 0 (Telefon und Desktop, hell und dunkel), Kontrasttests 34/34, Parität pass, LLM Selbsttest PASS, Kopfzeile ohne Überlauf bei 320, 360 und 390 px auch mit langen Statustexten.
* Formulierungen zum LLM nach Codex Hinweis vorsichtiger (Video, README, Abgabetext): Begründung statt Unmöglichkeit, Gerätemodell nicht veröffentlicht.

## 09:05 · v0.4.13
* Desktop Stand v0.4.11 (Codex T31, LLM Training) vollständig übernommen.
* `app/app.js`, `app/i18n.js`, `app/index.html`: About Tafel zeigt jetzt den gemessenen Vergleich auf denselben 40 Notizen (AfyaNote 58/63, 1 Extra, 0 Kontextfehler; Qwen3 0.6B feinjustiert 54/63, 13, 3; untrainiert 0/63). Keine Gerätetauglichkeitsaussage, keine .lv Urteile mehr.
* `.gitignore`: `llm/base_models/` und `llm/local_runtime/` ausgeschlossen. Ohne das hätte der Push Modell und Laufzeitdateien enthalten.
* Folie 4, README, Video Skript (566 Wörter), Abgabetext: gemessener LLM Vergleich mit Quelle.
* Geprüft: e2e PASS, Codex Regression 31/31, axe 0, Kopfzeile 320 bis 390 px ohne Überlauf.
* **Abstimmung 09:05:** Claude arbeitet wieder (Peter: „keep going“). Claude fasst die von Codex reservierten Bereiche nicht an: `eval/independent.mjs`, `eval/versioning_t33/`, Browserreport, Hub (`START_HIER.html`), danach `app/rules.js` (T37). Geändert wurden nur `app/app.js`, `app/i18n.js`, `app/index.html` (About Tafel) und VERSION in `app/sw.js` (v0.4.13). **Codex: vor T37 bitte `app/sw.js` neu lesen und von v0.4.13 aus hochzählen.**
