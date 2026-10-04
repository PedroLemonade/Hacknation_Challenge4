# Lokales LLM · begründete Experimententscheidung

> **Herkunft:** Claude-Grundfassung; Quellen-, Machbarkeits- und Versionsreview durch ChatGPT / Codex am 04.10.2026. Aktiver Stand: v0.4.11.

## Entscheidung
Für diese Abgabe bleibt der bestehende Klassifikator in der App. Ein optionales LLM kann später als begrenzter Extraktor oder während der Entwicklung als Vorschlagsquelle verglichen werden. Es gibt keine AfyaNote-Messung, die ein bestimmtes LLM auf CHP-Handys als brauchbar oder unbrauchbar belegt.

Der Klassifikator ist **249.284 Bytes / 243 KiB** groß. Das vollständige statische Paket enthält **440.004 Bytes**; RAM und tatsächlicher Download sind andere Größen. Laufzeiten in [eval/results.md](../../eval/results.md) sind Node-Laptopwerte. Ein 2-GB-CHP-Gerät wurde nicht getestet und das ausgerollte Gerätemodell ist nicht belegt. Einzelne Consumer-Geräte rechtfertigen keine Aussage über die ganze CHP-Flotte.

## Messung vom 4. Okt (Codex Lauf, Claude Einordnung)
Codex hat Qwen3 0.6B (INT4, 335.450.548 Bytes) auf Peters MacBook Air M2 mit 8 GB per QLoRA feinjustiert (600 Schritte, Passage ID Darstellung) und mit demselben Guard auf denselben 40 Notizen ausgewertet. Quelle: `llm/reports/20261004_selection_saved_40/results.json`, Einordnung: `docs/03_plan/codex_llm_training_review.md`.

| Gleiche 40 Notizen, 63 Begriffe | AfyaNote Klassifikator (erste, eingefrorene Auswertung) | Qwen3 0.6B ohne Training | Qwen3 0.6B feinjustiert |
|---|---|---|---|
| Größe | 249 KB | 335 MB | 335 MB plus 8,7 MB Adapter |
| Begriffe gefunden | 58/63 | 0/63 (kein gültiges JSON) | 54/63 |
| Status richtig unter gefundenen | 57/58 | n/a | 40/54 |
| Kontextfehler als „stated“ | 0 | 0 | 3 |
| Zusätzliche Begriffe | 1 | 0 | 13 |
| Notizen komplett richtig | 34/40 | 0/40 | 18/40 |
| Zeit pro Notiz | 0,06 ms (Node, Laptop CPU) | 739 ms (M2) | 748 ms (M2) |

**Folgerung für die Abgabe:** Für diese Aufgabe und diese Daten ist der kleine Klassifikator klar besser. Er bleibt in der App, das LLM bleibt ein dokumentiertes Experiment. Ein Lauf auf bekannten synthetischen Notizen, kein allgemeines Urteil über Sprachmodelle. Diese Tabelle steht auch in README, Folie 4, Video Skript, Abgabetext und im About Tab der App.

## Kandidaten sind Messkandidaten

| Kandidat | Beleg | Was daraus nicht folgt |
|---|---|---|
| Gemma 3 270M | Google nennt 270 Mio. Parameter, INT4-QAT und Extraktions-/Strukturierungsaufgaben; [Hersteller, 14.08.2025](https://developers.googleblog.com/en/introducing-gemma-3-270m/) | Keine nachgewiesene AfyaNote-/Swahili-/CHP-Leistung; nicht automatisch die beste oder neueste Wahl |
| Gemma 3 1B | Eine Google-AI-Edge-Ausführung hat 529 MB und empfiehlt mindestens 4 GB für beste Leistung; [Hersteller, 12.03.2025](https://developers.googleblog.com/gemma-3-on-mobile-and-web-with-google-ai-edge/) | Empfehlung ist keine harte technische Unmöglichkeitsgrenze; Ollama-Datei und Browser-RAM können anders sein |
| Bestehender Klassifikator | Lokale Datei, fixe Begriffe, nachvollziehbare SW/EN-Regression | Synthetischer Recall ist keine klinische Genauigkeit |

Das 2025-Kandidatenpaar bleibt ein reproduzierbarer erster Vergleich. Vor einer späteren Produktauswahl neu verfügbare Modelle, Lizenzen, Quantisierung und tatsächliche Sprachevaluierung separat prüfen. Ein größeres Modell nur bei gemessenem Zusatznutzen aufnehmen.

## Guard: notwendig, begrenzt

[llm/guard.mjs](../../llm/guard.mjs) validiert jetzt wirklich die Form: erlaubte IDs/Status, Pflichtfelder, Grenzen, wörtliches Zitat, keine zusätzlichen Felder, keine widersprüchliche Duplikatauswahl. Dauer bleibt nur mit passenden Regelbelegen. Fundstellen beziehen sich auf den Originaltext; wiederholte Zitate werden als mehrdeutig benannt. `combine()` bewahrt beide Belege und verlangt bei LLM-only/Abweichung eine Statuswahl.

**Ein exaktes Zitat garantiert keine richtige Zuordnung.** Ein LLM könnte `fever` mit dem vorhandenen Zitat „Mother has cough“ liefern. Der Guard erkennt den semantischen Fehler nicht. Grammatik/Schema verhindert keine falsche Person, Dauerzuordnung, falschen Status oder Automation Bias. Auch zwei übereinstimmende Modelle können denselben Fehler haben. Kein freier medizinischer Text und keine automatische Übernahme.

## Experimentablauf

1. Nur synthetische vorhandene Notizen, lokales installiertes Modell, Cloudfunktionen in Ollama deaktivieren. Die lokale URL allein belegt keinen lokalen Modelllauf. [Ollama-FAQ](https://docs.ollama.com/faq).
2. Erst zwei Notizen als Funktionsprobe. Dann vollständige 40 bzw. 400 bekannte Notizen, neue Runordner, identische Settings und unveränderte Goldlabels.
3. Fehler/fehlende Antworten mitzählen; Rohantworten, Laufzeit, Modelldigest, Quantisierung, Rechnerdaten und Quellhashes sichern. Loaded-model-size ist kein gemessener Peak-RAM.
4. Begriffsrecall, Statusübereinstimmung, falsche positive Aussagen, zusätzliche Kandidaten, unklare Karten und exakte Notizen separat vergleichen. Hybridrecall einschließlich offener Karten ist kein Qualitätsgewinn im fertigen Entwurf.
5. Ein neues, extern überprüftes Set vor einer Modelländerung einfrieren. Die bekannte 40er-Sammlung ist nach Reparaturen Regression, kein unberührter Abschlusstest.
6. Erst danach Browserbackend und echte Geräte prüfen. `navigator.deviceMemory` liefert einen groben, teils nicht verfügbaren Gerätewert, keinen freien RAM; [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory). Kein automatischer Modellstart nur wegen „≥4 GB“. Opt-in, Speicher-/Laufzeitprobe, Abbruch und sichere Rückfallebene planen.

Befehle und neue Reports: [LLM-Anleitung](../../llm/README.md), [T29](../04_tasks/T29_llm_messen.md). Die früheren `llm/results.*` bleiben historische Referenzausgaben. Neuer Reviewbericht: [reference_report](../../llm/review_codex/current_reference_report/results.md). Kein tatsächliches LLM wurde in diesem Review geladen.

## LLM als Lehrer und SFT

Varianten aus einem LLM sind Vorschläge zur Annotation, keine Goldlabels. Fachlich relevante SW-Bedeutung muss eine qualifizierte Person prüfen. Lehrer- und Schülerdaten brauchen getrennte Provenienz; derselbe Generator kann sonst Fehler und Evaluationserwartungen vervielfältigen.

Der vorhandene SFT-Export hat 3.000/300 Zeilen, aber **79 Devzeilen teilen ihre Notiz mit dem Training**, verteilt auf 42 unterschiedliche Notizen. [Audit](../../llm/review_codex/sft_audit.json). Das ist kein brauchbarer unabhängiger Devnachweis. T38 bereitet einen getrennten Split vor. Die bestehenden Daten wurden erhalten, nicht still neu erzeugt. Die künftige Modelldateigröße bleibt bis zur Messung offen; Fine-Tuning erhält nicht automatisch die heutige Dateigröße.
