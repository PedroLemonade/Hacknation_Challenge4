# Video-Skripte · belegbarer aktueller Stand

> **Herkunft:** Claude-Grundfassung, durch ChatGPT / Codex am 04.10.2026 auf v0.4.11 und belegbare Aussagen überarbeitet. Alte Medien bleiben erhalten.

Die markierten Bildhinweise nicht vorlesen. Tempo und tatsächliche Länge beim Aufnehmen messen. World-Bank-Pflichtbereich **2–5 Minuten**, interner Zielbereich etwa 3:30–4:00. Dieses Skript behauptet keinen bereits bestandenen Telefon-Test. Alle Fälle fiktiv.

## 1 · World Bank / Demo-Video

### Problem und Hypothese

[Folie 1]
Hi, I'm Peter. This is AfyaNote, a prototype for community health promoters in Kenya.
Because of this tool, we aim to let a health promoter turn a short Swahili visit note into a reviewed referral draft during the household visit, rather than reconstruct it later. We know the documentation burden is real from a five-country primary care study, although Kenya was not part of it. Whether AfyaNote saves time is still a question for a pilot.
Kenya already has eCHIS. Our next step is to establish where this workflow could add value inside that existing system.

### AI und Grenzen

[Folie 2]
The classifier is about a quarter of a megabyte. It runs locally and proposes ten fixed documentation terms from Swahili, English or mixed text. On forty synthetic notes written by a second AI author, it finds 58 of 63 terms; a phrase dictionary finds 46. Those notes are now a known regression set. This is feasibility evidence, not clinical accuracy.
We also tried the obvious alternative and fine tuned a 0.6 billion parameter language model on the same synthetic data. It is more than a thousand times larger. On the same forty notes it found 54 terms, added 13 wrong ones and showed three symptoms as present that the note had excluded or given to someone else. For this job, small and checkable works better.
We do not generate medical narratives. Every proposal has original evidence and needs a human decision. Rules handle specific patterns of negation, another person and past events, but do not understand every sentence.

### Demo

[Aktuelle v0.4.11-Aufnahme. Ohne T05: Desktop mit simulierter Netzunterbrechung zeigen.]
Here is the current browser demo. Its offline restart has been checked in a desktop browser with network access disabled. A physical target-phone test is still pending.
[Nach bestandenem T05 nur diesen Absatz ersetzen: Gerät/OS nennen und den tatsächlichen Flugmodus-Neustart zeigen.]

[Swahili-Beispiel → Vorschläge]
The note says: Mtoto wa miaka miwili ana homa siku tatu na anakohoa. Hawezi kunywa tangu jana. Hana kuhara.
AfyaNote proposes fever for three days, cough, and not able to drink since yesterday. Diarrhoea is marked denied. Age is two years. The health promoter checks each quote and confirms or rejects each item. A fixed danger-sign term gives a neutral reminder to check her protocol, without deciding urgency.

[Fehlende Dauer → vier Tage als während des Besuchs erfragt eintragen]
Cough duration is missing. She asks the family and records four days, marked as information asked during the visit.
[Hard case → Auswahlpflicht]
With conflicting fever statements, the app asks her to choose. It does not resolve the conflict for her.
[Ergänzen → Karte → Einwilligung → Entwurf/QR]
She adds case details, selects a facility and consents to handover. These map entries are fictional. The result is a draft oriented on section A of MOH 100, with open fields left open. A file or QR can deliberately carry it to the recipient. The app itself does not upload the case text.

### Einbettung und persönlicher Abschluss

[Folie 3, dann 4]
The intended place is at the end of a household visit, while questions can still be answered. We must test whether it reduces work, including review and transfer, instead of adding another form.
The stack is a static web app, a scikit-learn classifier exported to JSON, JavaScript and a service worker. Static assets total about 440 kilobytes; that is not a RAM measurement.
For me, localizing AI means fitting the language, device and workflow, and showing where it stops. Our data is synthetic. Native-language and clinical review are still missing. Kikuyu is unsupported, and some negation and person patterns still fail. The next step is to review those cases with health promoters and a receiving clinician. Small, checkable, local. Thank you.

## 2 · Techvideo, etwa zwei Minuten

1. Zeige Repo: training/data/app/eval; Claude-Grundmodell und gemeinsame Demo nachvollziehbar kennzeichnen.
2. Zeichen-n-Gramme 2–4, 10 logistische Klassifikatoren, 3.000 Features, 5.000 synthetische Trainingspassagen, Devschwellen. Modellgröße 249.284 Bytes.
3. Parität: 16 Fixtures, maximale Abweichung etwa 4,9e-7; Node-Laptop, keine Smartphone-Laufzeit daraus ableiten.
4. Aktuelle eval/results.md: Passage-F1 getrennt von Begriffsrecall und Kontextstatus. **34/34** Modell-Kontrasttests, **52/52 bekannte Kontextfälle**. 400 Generatornotizen: Statusübereinstimmung sank nach konservativer Personenpolitik auf 0,945; Grund zeigen.
5. Bekannter Fehler: „Child has cough without fever“; Negationsbereich noch offen. Keine Aussage „alle Kontextfehler gelöst“.
6. 31 gehashte Desktopchecks, Export-/Prüfgates und Offline-Paket.
7. LLM Vergleich außerhalb der App: Qwen3 0.6B (INT4, 335 MB) per QLoRA auf dem MacBook Air M2 feinjustiert, gleicher Guard, gleiche 40 Notizen: 54/63 Begriffe, 13 Extra, 3 Kontextfehler als „stated“, 18/40 exakt, etwa 0,75 s pro Notiz. Klassifikator: 58/63, 1 Extra, 0, 34/40. Bericht `llm/reports/20261004_selection_saved_40/`.

## 3 · Teamvideo, 30–45 Sekunden

Hi, I'm Peter. I built this hackathon prototype with support from Claude and ChatGPT/Codex. Claude supplied the initial model and interface. ChatGPT/Codex added critical reviews, regression cases and fixes. My focus is making AI useful in an existing workflow, with evidence and a human decision at every step.

Persönliche Ausbildungs-/Arbeitgeber-/Hubangaben nur ergänzen, wenn Peter sie selbst bestätigt. Alte Angaben sind keine geprüfte Biografie und kein Beleg einer Arbeitgeberbeteiligung.
