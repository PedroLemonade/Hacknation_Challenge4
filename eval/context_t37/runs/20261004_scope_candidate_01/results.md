# T37 · Begriffbezogene Verneinung

ChatGPT / Codex auf Claude-Regelbasis. 56 vor dem Fix eingefrorene synthetische Fälle (26 EN, 26 SW, 4 mixed); fachlich/sprachlich ungeprüft. Goldsets und Modellparameter erhalten.

| Prüfung | Vorher | Nachher |
|---|---|---|
| policy: erwartete Status/Dauer, zusätzliche Labels separat | 15/56 | 52/56 |
| model: erwartete Status/Dauer, zusätzliche Labels separat | 15/56 | 51/56 |
| dictionary: erwartete Status/Dauer, zusätzliche Labels separat | 15/56 | 47/56 |

52 T31-Kontextprüfungen: 52/52. Geschützte Quellen verändert: 0.

| Bestand / Pipeline | Begriffe gefunden vorher → nachher | Richtige Status | Extras vorgeschlagen / inklusive unklar | Exakte Notizen |
|---|---|---|---|---|
| known_40 / model | 58/63 → 58/63 | 58/58 → 57/58 | 1/1 → 1/1 | 35 → 34 |
| known_40 / dictionary | 46/63 → 46/63 | 46/46 → 46/46 | 0/0 → 0/0 | 24 → 24 |
| generated_400 / model | 766/870 → 766/870 | 724/766 → 720/766 | 1/5 → 1/5 | 297 → 294 |
| generated_400 / dictionary | 547/870 → 547/870 | 517/547 → 513/547 | 0/0 → 0/0 | 187 → 186 |

## Alle verbleibenden neuen Fälle

- policy, T37-EN-15: Last week child had cough without fever. — fever: expected conflict, got denied; fever: conflict must require choice
- policy, T37-EN-17: Child cannot drink without vomiting. — ds_cannot_drink: expected stated, got conflict; vomiting: expected denied, got conflict
- policy, T37-SW-15: Wiki iliyopita mtoto alikuwa na kikohozi bila homa. — cough: expected past, got stated; fever: expected conflict, got denied; fever: conflict must require choice
- policy, T37-SW-17: Mtoto hawezi kunywa bila kutapika. — ds_cannot_drink: expected stated, got conflict; vomiting: expected denied, got conflict
- model, T37-EN-15: Last week child had cough without fever. — fever: expected conflict, got denied; fever: conflict must require choice
- model, T37-EN-17: Child cannot drink without vomiting. — ds_cannot_drink: expected stated, got conflict; vomiting: expected denied, got conflict
- model, T37-EN-24: Child has cough without weakness. — weakness: expected denied, got missing
- model, T37-SW-15: Wiki iliyopita mtoto alikuwa na kikohozi bila homa. — cough: expected past, got stated; fever: expected conflict, got denied; fever: conflict must require choice
- model, T37-SW-17: Mtoto hawezi kunywa bila kutapika. — ds_cannot_drink: expected stated, got conflict; vomiting: expected denied, got conflict
- dictionary, T37-EN-15: Last week child had cough without fever. — fever: expected conflict, got denied; fever: conflict must require choice
- dictionary, T37-EN-17: Child cannot drink without vomiting. — ds_cannot_drink: expected stated, got conflict; vomiting: expected denied, got conflict
- dictionary, T37-EN-24: Child has cough without weakness. — weakness: expected denied, got missing
- dictionary, T37-SW-15: Wiki iliyopita mtoto alikuwa na kikohozi bila homa. — cough: expected past, got stated; fever: expected conflict, got denied; fever: conflict must require choice
- dictionary, T37-SW-17: Mtoto hawezi kunywa bila kutapika. — ds_cannot_drink: expected stated, got conflict; vomiting: expected denied, got conflict
- dictionary, T37-SW-19: Mtoto hakohoi ana homa. — cough: expected denied, got missing
- dictionary, T37-SW-20: Mtoto hajaharisha ana kikohozi. — diarrhoea: expected denied, got missing
- dictionary, T37-SW-21: Mtoto hatapiki ana homa. — vomiting: expected denied, got missing
- dictionary, T37-SW-24: Mtoto ana homa bila udhaifu. — weakness: expected denied, got missing

Alle Kandidaten, Fehlalarme, Statusmatrizen und jede Änderung der 40/400 Notizen stehen in results.json. Policy-Detektor isoliert Regeln; er ist keine Modellbewertung. Unterschiedliche Dauerbereiche werden konservativ pro Begriff gelesen. Literal passende Textspanne ist keine Garantie semantischer Richtigkeit.
