# T31 Kontextregression · ChatGPT / Codex

52 synthetische Fälle, vor dem Fix eingefroren; 26 Englisch, 26 Swahili. Sprach-/Fachreview: nein. Bekannte Muster nach Reparatur, keine unabhängige Validierung.

## Regelprüfung und echte Pipeline getrennt

Regelprüfung mit festem Test-Termdetektor: **26/52 → 52/52**. Der Testdetektor misst keine Modellgüte.

- Ausgelieferte model-Pipeline: 26/52 → 52/52 erwartete Kontextstatus erfüllt; zusätzliche Kandidaten sind nicht Teil dieser Quote. Fehlstellen und Rohkandidaten in results.json.
- Ausgelieferte dictionary-Pipeline: 26/52 → 52/52 erwartete Kontextstatus erfüllt; zusätzliche Kandidaten sind nicht Teil dieser Quote. Fehlstellen und Rohkandidaten in results.json.

## Bekannte 40 Notizen als Regression

| Pipeline | Begriffe gefunden vorher → nachher | Korrekte Status vorher → nachher | Zusätzlich vorgeschlagene Begriffe vorher → nachher |
|---|---|---|---|
| model | 58/63 → 58/63 | 57/58 → 58/58 | 1 → 1 |
| dictionary | 46/63 → 46/63 | 45/46 → 46/46 | 0 → 0 |

### Jede Status-/Prüfänderung


**model**

- codex-independent-11: [{"label":"ds_convulsions","assertion":"other_person","field":"suggested"}] → [{"label":"ds_convulsions","assertion":"stated","field":"suggested"}]. Fehler vorher: ds_convulsions: expected stated, got other_person; nachher: keine.

**dictionary**

- codex-independent-11: [{"label":"ds_convulsions","assertion":"other_person","field":"suggested"}] → [{"label":"ds_convulsions","assertion":"stated","field":"suggested"}]. Fehler vorher: ds_convulsions: expected stated, got other_person; nachher: keine.

## Verbleibende Fallfehler


## Bestehende 400 Generatornotizen: Verschlechterungen offenlegen

Der alte Generator setzt das Subjekt nach Satzgrenzen implizit wieder auf den Patienten. Nach einer anderen Person ist das jetzt ausdrücklich ungeklärt und verlangt eine menschliche Auswahl. Die unveränderten alten Goldlabels bewerten diese konservative Änderung als Fehler; die Statusquote sinkt. Dies ist keine Verbesserung aller Kennzahlen und keine extern bestätigte Korrektur der Goldlabels.

| Pipeline | Gefundene Begriffe | Korrekte Status vorher → nachher | Statusquote vorher → nachher | Geänderte Notizen |
|---|---|---|---|---|
| model | 766/870 | 765 → 724 | 0.999 → 0.945 | 32 |
| dictionary | 547/870 | 547 → 517 | 1.000 → 0.945 | 24 |

### Jede geänderte Generatornotiz


**model**

- train_note_19: the mother vomiting everything for 1 week; stomach pain since yesterday
  Vorher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_vomits_everything","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_vomits_everything","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: pain: expected stated, got conflict.
- train_note_21: neighbour very sleepy; vomiting everything since yesterday; Amani: no cough x3 days
  Vorher: [{"label":"ds_lethargic","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_vomits_everything","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"ds_lethargic","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"ds_vomits_everything","assertion":"conflict","field":"unclear"},{"label":"cough","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_vomits_everything: expected stated, got conflict; vomiting: expected stated, got conflict; cough: expected denied, got conflict.
- train_note_36: mama kutapika mara moja; hawezi kuamka; mtoto wa Noor: alipata degedege
  Vorher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_lethargic","assertion":"stated","field":"suggested"},{"label":"ds_convulsions","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_lethargic","assertion":"conflict","field":"unclear"},{"label":"ds_convulsions","assertion":"stated","field":"suggested"}]. Fehler vorher: keine; nachher: ds_lethargic: expected stated, got conflict.
- train_note_50: Amani: anaugua homa; baba kikohozi kikali siku 4; degedege wiki iliyopita
  Vorher: [{"label":"fever","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_convulsions","assertion":"past","field":"suggested"}]. Nachher: [{"label":"fever","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_convulsions","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_convulsions: expected past, got conflict.
- train_note_57: neighbour coughing x2 days; throwing up last week; grandmother very weak for 1 week
  Vorher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"past","field":"suggested"},{"label":"weakness","assertion":"other_person","field":"suggested"}]. Nachher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"weakness","assertion":"other_person","field":"suggested"}]. Fehler vorher: keine; nachher: vomiting: expected past, got conflict.
- train_note_65: the child cannot drink last week; father diarrhea 2 days; Amani no energy last month
  Vorher: [{"label":"ds_cannot_drink","assertion":"past","field":"suggested"},{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"past","field":"suggested"}]. Nachher: [{"label":"ds_cannot_drink","assertion":"past","field":"suggested"},{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: weakness: expected past, got conflict.
- train_note_85: the mother unable to breastfeed; high fever last week
  Vorher: [{"label":"ds_cannot_drink","assertion":"other_person","field":"suggested"},{"label":"fever","assertion":"past","field":"suggested"}]. Nachher: [{"label":"ds_cannot_drink","assertion":"other_person","field":"suggested"},{"label":"fever","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: fever: expected past, got conflict.
- train_note_87: the mother stomach pain; vomiting everything
  Vorher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_vomits_everything","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"ds_vomits_everything","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_vomits_everything: expected stated, got conflict; vomiting: expected stated, got conflict.
- train_note_105: jirani kifafa tangu juzi. maumivu wiki iliyopita
  Vorher: [{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"past","field":"suggested"}]. Nachher: [{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: pain: expected past, got conflict.
- train_note_110: grandmother pain. Amani throwing up. baby no cough 4 days
  Vorher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"cough","assertion":"denied","field":"suggested"}]. Fehler vorher: keine; nachher: vomiting: expected stated, got conflict.
- train_note_113: msichana kutapika; mama mwili ulikuwa unatetemeka kwa siku mbili; mnyonge
  Vorher: [{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: weakness: expected stated, got conflict.
- train_note_143: the mother weak 2 days. no vomiting
  Vorher: [{"label":"weakness","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"weakness","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: vomiting: expected denied, got conflict.
- train_note_155: neighbour bad cough x1 days. father throws up everything. Amani not able to drink
  Vorher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_vomits_everything","assertion":"other_person","field":"suggested"},{"label":"ds_cannot_drink","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_vomits_everything","assertion":"other_person","field":"suggested"},{"label":"ds_cannot_drink","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_cannot_drink: expected stated, got conflict.
- train_note_157: father throwing up. diarrhea for 1 week. baby: cannot drink
  Vorher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"stated","field":"suggested"},{"label":"ds_cannot_drink","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"conflict","field":"unclear"},{"label":"ds_cannot_drink","assertion":"stated","field":"suggested"}]. Fehler vorher: keine; nachher: diarrhoea: expected stated, got conflict.
- train_note_159: mama maumivu. Amani: kutapika mara moja. kuharisha
  Vorher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"diarrhoea","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"diarrhoea","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: vomiting: expected stated, got conflict; diarrhoea: expected stated, got conflict.
- train_note_167: baba anaugua homa siku 1; amechoka sana tangu jana
  Vorher: [{"label":"fever","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"fever","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: weakness: expected stated, got conflict.
- train_note_180: neighbour diarrhea. Amani vomiting everything
  Vorher: [{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_vomits_everything","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"ds_vomits_everything","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_vomits_everything: expected stated, got conflict; vomiting: expected stated, got conflict.
- heldout_note_8: bibi anakataa kunyonya tangu jana; hana kuhara siku moja
  Vorher: [{"label":"ds_cannot_drink","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"ds_cannot_drink","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: diarrhoea: expected denied, got conflict.
- heldout_note_14: mama yake amelegea sana kwa siku tatu. Amani tumbo haliumi. Amani: anakohowa mwezi uliopita
  Vorher: [{"label":"ds_lethargic","assertion":"other_person","field":"unclear"},{"label":"pain","assertion":"denied","field":"suggested"},{"label":"cough","assertion":"past","field":"suggested"}]. Nachher: [{"label":"ds_lethargic","assertion":"other_person","field":"unclear"},{"label":"pain","assertion":"conflict","field":"unclear"},{"label":"cough","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: pain: expected denied, got conflict; cough: expected past, got conflict.
- heldout_note_17: father drowsy and floppy 3 days. vomits last month
  Vorher: [{"label":"vomiting","assertion":"past","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"conflict","field":"unclear"}]. Fehler vorher: missed ds_lethargic; nachher: missed ds_lethargic; vomiting: expected past, got conflict.
- heldout_note_57: mama degedge; Amani hakohoi; hawezi kunywa chochote
  Vorher: [{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"cough","assertion":"denied","field":"suggested"},{"label":"ds_cannot_drink","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"cough","assertion":"conflict","field":"unclear"},{"label":"ds_cannot_drink","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: cough: expected denied, got conflict; ds_cannot_drink: expected stated, got conflict.
- heldout_note_85: father dry cough 5 days. had a fit for 3 days. Amani: letargic
  Vorher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_convulsions","assertion":"stated","field":"unclear"},{"label":"ds_lethargic","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_convulsions","assertion":"conflict","field":"unclear"},{"label":"ds_lethargic","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_convulsions: expected stated, got conflict; ds_lethargic: expected stated, got conflict.
- heldout_note_86: jirani kichwa kinamuuma. Amani: ana homa za usiku
  Vorher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"fever","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"fever","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: fever: expected stated, got conflict.
- heldout_note_93: grandmother diarhea since yesterday. Amani not weak
  Vorher: [{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: weakness: expected denied, got conflict.
- heldout_note_99: msichana hana kikohozi siku 4. mama kichwa kinamuuma. alishikwa na degedege
  Vorher: [{"label":"cough","assertion":"denied","field":"suggested"},{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"ds_convulsions","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"cough","assertion":"denied","field":"suggested"},{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"ds_convulsions","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_convulsions: expected stated, got conflict.
- heldout_note_111: feels weak last month. the mother vomitting. does not have fever
  Vorher: [{"label":"weakness","assertion":"past","field":"suggested"},{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"fever","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"weakness","assertion":"past","field":"suggested"},{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"fever","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: fever: expected denied, got conflict.
- heldout_note_112: child has a fever; grandmother vomitting for 3 days; coughs at night
  Vorher: [{"label":"fever","assertion":"stated","field":"suggested"},{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"cough","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"fever","assertion":"stated","field":"suggested"},{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"cough","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: cough: expected stated, got conflict.
- heldout_note_120: jirani homma wiki moja. anaumwa na tumbo wiki iliyopita
  Vorher: [{"label":"fever","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"past","field":"unclear"}]. Nachher: [{"label":"fever","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: pain: expected past, got conflict.
- heldout_note_121: mama alitapika tangu jana; kuendesha mara nyingi; mvulana: tumbo haliumi
  Vorher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"stated","field":"suggested"},{"label":"pain","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"conflict","field":"unclear"},{"label":"pain","assertion":"denied","field":"suggested"}]. Fehler vorher: keine; nachher: diarrhoea: expected stated, got conflict.
- heldout_note_166: father vomitting for 1 days. not weak. no diarrhoea
  Vorher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"denied","field":"suggested"},{"label":"diarrhoea","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"conflict","field":"unclear"},{"label":"diarrhoea","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: weakness: expected denied, got conflict; diarrhoea: expected denied, got conflict.
- heldout_note_189: msichana anaharisha maji. bibi alikohoa usiku siku moja. anakataa kunyonya
  Vorher: [{"label":"diarrhoea","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_cannot_drink","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"diarrhoea","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_cannot_drink","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_cannot_drink: expected stated, got conflict.
- heldout_note_196: amelegea sana; mama tapika; haharishi siku mbili
  Vorher: [{"label":"ds_lethargic","assertion":"stated","field":"suggested"},{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"ds_lethargic","assertion":"stated","field":"suggested"},{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: diarrhoea: expected denied, got conflict.

**dictionary**

- train_note_19: the mother vomiting everything for 1 week; stomach pain since yesterday
  Vorher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_vomits_everything","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_vomits_everything","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: pain: expected stated, got conflict.
- train_note_21: neighbour very sleepy; vomiting everything since yesterday; Amani: no cough x3 days
  Vorher: [{"label":"ds_lethargic","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_vomits_everything","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"ds_lethargic","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"ds_vomits_everything","assertion":"conflict","field":"unclear"},{"label":"cough","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_vomits_everything: expected stated, got conflict; vomiting: expected stated, got conflict; cough: expected denied, got conflict.
- train_note_36: mama kutapika mara moja; hawezi kuamka; mtoto wa Noor: alipata degedege
  Vorher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_lethargic","assertion":"stated","field":"suggested"},{"label":"ds_convulsions","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"ds_lethargic","assertion":"conflict","field":"unclear"},{"label":"ds_convulsions","assertion":"stated","field":"suggested"}]. Fehler vorher: keine; nachher: ds_lethargic: expected stated, got conflict.
- train_note_50: Amani: anaugua homa; baba kikohozi kikali siku 4; degedege wiki iliyopita
  Vorher: [{"label":"fever","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_convulsions","assertion":"past","field":"suggested"}]. Nachher: [{"label":"fever","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_convulsions","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_convulsions: expected past, got conflict.
- train_note_57: neighbour coughing x2 days; throwing up last week; grandmother very weak for 1 week
  Vorher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"past","field":"suggested"},{"label":"weakness","assertion":"other_person","field":"suggested"}]. Nachher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"weakness","assertion":"other_person","field":"suggested"}]. Fehler vorher: keine; nachher: vomiting: expected past, got conflict.
- train_note_65: the child cannot drink last week; father diarrhea 2 days; Amani no energy last month
  Vorher: [{"label":"ds_cannot_drink","assertion":"past","field":"suggested"},{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"past","field":"suggested"}]. Nachher: [{"label":"ds_cannot_drink","assertion":"past","field":"suggested"},{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: weakness: expected past, got conflict.
- train_note_85: the mother unable to breastfeed; high fever last week
  Vorher: [{"label":"ds_cannot_drink","assertion":"other_person","field":"suggested"},{"label":"fever","assertion":"past","field":"suggested"}]. Nachher: [{"label":"ds_cannot_drink","assertion":"other_person","field":"suggested"},{"label":"fever","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: fever: expected past, got conflict.
- train_note_87: the mother stomach pain; vomiting everything
  Vorher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_vomits_everything","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"ds_vomits_everything","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_vomits_everything: expected stated, got conflict; vomiting: expected stated, got conflict.
- train_note_105: jirani kifafa tangu juzi. maumivu wiki iliyopita
  Vorher: [{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"past","field":"suggested"}]. Nachher: [{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"pain","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: pain: expected past, got conflict.
- train_note_110: grandmother pain. Amani throwing up. baby no cough 4 days
  Vorher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"cough","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"cough","assertion":"denied","field":"suggested"}]. Fehler vorher: keine; nachher: vomiting: expected stated, got conflict.
- train_note_113: msichana kutapika; mama mwili ulikuwa unatetemeka kwa siku mbili; mnyonge
  Vorher: [{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_convulsions","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: weakness: expected stated, got conflict.
- train_note_143: the mother weak 2 days. no vomiting
  Vorher: [{"label":"weakness","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"weakness","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: vomiting: expected denied, got conflict.
- train_note_155: neighbour bad cough x1 days. father throws up everything. Amani not able to drink
  Vorher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_vomits_everything","assertion":"other_person","field":"suggested"},{"label":"ds_cannot_drink","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"cough","assertion":"other_person","field":"suggested"},{"label":"ds_vomits_everything","assertion":"other_person","field":"suggested"},{"label":"ds_cannot_drink","assertion":"conflict","field":"unclear"}]. Fehler vorher: missed vomiting; nachher: missed vomiting; ds_cannot_drink: expected stated, got conflict.
- train_note_157: father throwing up. diarrhea for 1 week. baby: cannot drink
  Vorher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"stated","field":"suggested"},{"label":"ds_cannot_drink","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"vomiting","assertion":"other_person","field":"suggested"},{"label":"diarrhoea","assertion":"conflict","field":"unclear"},{"label":"ds_cannot_drink","assertion":"stated","field":"suggested"}]. Fehler vorher: keine; nachher: diarrhoea: expected stated, got conflict.
- train_note_159: mama maumivu. Amani: kutapika mara moja. kuharisha
  Vorher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"diarrhoea","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"pain","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"diarrhoea","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: vomiting: expected stated, got conflict; diarrhoea: expected stated, got conflict.
- train_note_167: baba anaugua homa siku 1; amechoka sana tangu jana
  Vorher: [{"label":"fever","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"fever","assertion":"other_person","field":"suggested"},{"label":"weakness","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: weakness: expected stated, got conflict.
- train_note_180: neighbour diarrhea. Amani vomiting everything
  Vorher: [{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"stated","field":"suggested"},{"label":"ds_vomits_everything","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"diarrhoea","assertion":"other_person","field":"suggested"},{"label":"vomiting","assertion":"conflict","field":"unclear"},{"label":"ds_vomits_everything","assertion":"conflict","field":"unclear"}]. Fehler vorher: keine; nachher: ds_vomits_everything: expected stated, got conflict; vomiting: expected stated, got conflict.
- heldout_note_8: bibi anakataa kunyonya tangu jana; hana kuhara siku moja
  Vorher: [{"label":"diarrhoea","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"diarrhoea","assertion":"conflict","field":"unclear"}]. Fehler vorher: missed ds_cannot_drink; nachher: missed ds_cannot_drink; diarrhoea: expected denied, got conflict.
- heldout_note_57: mama degedge; Amani hakohoi; hawezi kunywa chochote
  Vorher: [{"label":"ds_cannot_drink","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"ds_cannot_drink","assertion":"conflict","field":"unclear"}]. Fehler vorher: missed ds_convulsions; missed cough; nachher: missed ds_convulsions; missed cough; ds_cannot_drink: expected stated, got conflict.
- heldout_note_86: jirani kichwa kinamuuma. Amani: ana homa za usiku
  Vorher: [{"label":"fever","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"fever","assertion":"conflict","field":"unclear"}]. Fehler vorher: missed pain; nachher: missed pain; fever: expected stated, got conflict.
- heldout_note_93: grandmother diarhea since yesterday. Amani not weak
  Vorher: [{"label":"weakness","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"weakness","assertion":"conflict","field":"unclear"}]. Fehler vorher: missed diarrhoea; nachher: missed diarrhoea; weakness: expected denied, got conflict.
- heldout_note_99: msichana hana kikohozi siku 4. mama kichwa kinamuuma. alishikwa na degedege
  Vorher: [{"label":"cough","assertion":"denied","field":"suggested"},{"label":"ds_convulsions","assertion":"stated","field":"suggested"}]. Nachher: [{"label":"cough","assertion":"denied","field":"suggested"},{"label":"ds_convulsions","assertion":"conflict","field":"unclear"}]. Fehler vorher: missed pain; nachher: missed pain; ds_convulsions: expected stated, got conflict.
- heldout_note_111: feels weak last month. the mother vomitting. does not have fever
  Vorher: [{"label":"weakness","assertion":"past","field":"suggested"},{"label":"fever","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"weakness","assertion":"past","field":"suggested"},{"label":"fever","assertion":"conflict","field":"unclear"}]. Fehler vorher: missed vomiting; nachher: missed vomiting; fever: expected denied, got conflict.
- heldout_note_166: father vomitting for 1 days. not weak. no diarrhoea
  Vorher: [{"label":"weakness","assertion":"denied","field":"suggested"},{"label":"diarrhoea","assertion":"denied","field":"suggested"}]. Nachher: [{"label":"weakness","assertion":"conflict","field":"unclear"},{"label":"diarrhoea","assertion":"conflict","field":"unclear"}]. Fehler vorher: missed vomiting; nachher: missed vomiting; weakness: expected denied, got conflict; diarrhoea: expected denied, got conflict.

Geschützte Modell-/Trainings-/Daten-/Raw-Ergebnis-/v0.4.10-Mediendateien geändert: 0.

Regeln vorher: `08e97cbbbfceeebbf41ca45afb21b8c7a4f36badcfc819258f9d6809cd971349`

Regeln nachher: `0a0733a55a9dad4731898072d598180bb4e399edc0b28e91fe558a52afb88ebd`

Fälle: `280ff516c8bcd3762441858502a796a097c51d3edec211834a03464eda37fd8b`

Modell: `fdc100ac4dbad796bf9a4994835838c0dbd1adbae14ccf576cf0b2d0f7e28659`

Reproduktion: `node eval/context_t31/run.mjs`. Dies schreibt ausschließlich neue T31-Berichte; die ursprünglichen 40er-Notizen, Goldlabels und eingefrorenen Ergebnisse werden nicht überschrieben.
