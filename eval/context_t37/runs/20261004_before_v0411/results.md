# T37 · Begriffbezogene Verneinung

ChatGPT / Codex auf Claude-Regelbasis. 56 vor dem Fix eingefrorene synthetische Fälle (26 EN, 26 SW, 4 mixed); fachlich/sprachlich ungeprüft. Goldsets und Modellparameter erhalten.

| Prüfung | Vorher | Nachher |
|---|---|---|
| policy: erwartete Status/Dauer, zusätzliche Labels separat | 15/56 | 15/56 |
| model: erwartete Status/Dauer, zusätzliche Labels separat | 15/56 | 15/56 |
| dictionary: erwartete Status/Dauer, zusätzliche Labels separat | 15/56 | 15/56 |

52 T31-Kontextprüfungen: 52/52. Geschützte Quellen verändert: 0.

| Bestand / Pipeline | Begriffe gefunden vorher → nachher | Richtige Status | Extras vorgeschlagen / inklusive unklar | Exakte Notizen |
|---|---|---|---|---|
| known_40 / model | 58/63 → 58/63 | 58/58 → 58/58 | 1/1 → 1/1 | 35 → 35 |
| known_40 / dictionary | 46/63 → 46/63 | 46/46 → 46/46 | 0/0 → 0/0 | 24 → 24 |
| generated_400 / model | 766/870 → 766/870 | 724/766 → 724/766 | 1/5 → 1/5 | 297 → 297 |
| generated_400 / dictionary | 547/870 → 547/870 | 517/547 → 517/547 | 0/0 → 0/0 | 187 → 187 |

## Alle verbleibenden neuen Fälle

- policy, T37-EN-01: Child has cough without fever. — cough: expected stated, got denied
- policy, T37-EN-02: Child has fever without cough. — fever: expected stated, got denied
- policy, T37-EN-03: Child has cough for two days without fever. — cough: expected stated, got denied; fever: duration expected null, got 2
- policy, T37-EN-04: Child has cough for two days without fever for one week. — cough: expected stated, got denied; fever: duration expected 7, got 2
- policy, T37-EN-07: Child has no fever and cough. — cough: expected denied, got stated
- policy, T37-EN-09: Child denies fever and cough. — cough: expected denied, got stated
- policy, T37-EN-10: Child has neither fever nor cough. — cough: expected denied, got stated; fever: expected denied, got stated
- policy, T37-EN-11: Mother has cough without fever. — cough: expected other_person, got conflict
- policy, T37-EN-13: Mother says child has cough without fever. — cough: expected stated, got denied
- policy, T37-EN-14: Child has cough without fever in front of mother. — cough: expected stated, got denied
- policy, T37-EN-15: Last week child had cough without fever. — cough: expected past, got conflict
- policy, T37-EN-16: Child has no energy without fever. — weakness: expected stated, got denied
- policy, T37-EN-17: Child cannot drink without vomiting. — ds_cannot_drink: expected stated, got denied
- policy, T37-EN-18: Child has not only cough but fever. — cough: expected stated, got denied
- policy, T37-EN-19: Child is not without fever. — fever: expected conflict, got denied; fever: conflict must require choice
- policy, T37-EN-22: Child has fever absent and cough absent. — fever: expected denied, got stated; cough: expected denied, got stated
- policy, T37-EN-23: Child has cough without headache. — cough: expected stated, got denied
- policy, T37-EN-24: Child has cough without weakness. — cough: expected stated, got denied
- policy, T37-EN-25: Child has cough without fever; mother has fever. — cough: expected stated, got denied
- policy, T37-SW-01: Mtoto ana kikohozi bila homa. — cough: expected stated, got denied
- policy, T37-SW-02: Mtoto ana homa bila kikohozi. — fever: expected stated, got denied
- policy, T37-SW-03: Mtoto ana kikohozi siku mbili bila homa. — cough: expected stated, got denied; fever: duration expected null, got 2
- policy, T37-SW-04: Mtoto ana kikohozi siku mbili bila homa siku tatu. — cough: expected stated, got denied; fever: duration expected 3, got 2
- policy, T37-SW-07: Mtoto hana homa na kikohozi. — cough: expected denied, got stated
- policy, T37-SW-11: Mama ana kikohozi bila homa. — cough: expected other_person, got conflict
- policy, T37-SW-13: Mama anasema mtoto ana kikohozi bila homa. — cough: expected stated, got denied
- policy, T37-SW-14: Mtoto ana kikohozi bila homa mbele ya mama. — cough: expected stated, got denied
- policy, T37-SW-15: Wiki iliyopita mtoto alikuwa na kikohozi bila homa. — cough: expected past, got denied; fever: expected conflict, got denied; fever: conflict must require choice
- policy, T37-SW-16: Mtoto hana nguvu bila homa. — weakness: expected stated, got denied
- policy, T37-SW-17: Mtoto hawezi kunywa bila kutapika. — ds_cannot_drink: expected stated, got denied
- policy, T37-SW-18: Mtoto anakohoa hana homa. — cough: expected stated, got denied
- policy, T37-SW-19: Mtoto hakohoi ana homa. — fever: expected stated, got denied
- policy, T37-SW-20: Mtoto hajaharisha ana kikohozi. — cough: expected stated, got denied
- policy, T37-SW-21: Mtoto hatapiki ana homa. — fever: expected stated, got denied
- policy, T37-SW-22: Mtoto ana maumivu bila homa. — pain: expected stated, got denied
- policy, T37-SW-23: Mtoto ana homa bila maumivu. — fever: expected stated, got denied
- policy, T37-SW-24: Mtoto ana homa bila udhaifu. — fever: expected stated, got denied
- policy, T37-SW-25: Mtoto ana kikohozi bila homa; mama ana homa. — cough: expected stated, got denied
- policy, T37-MIXED-01: Mtoto has cough bila homa. — cough: expected stated, got denied
- policy, T37-MIXED-02: Child ana kikohozi without fever. — cough: expected stated, got denied
- policy, T37-MIXED-03: Mtoto hana homa and cough. — cough: expected denied, got stated
- model, T37-EN-01: Child has cough without fever. — cough: expected stated, got denied
- model, T37-EN-02: Child has fever without cough. — fever: expected stated, got denied
- model, T37-EN-03: Child has cough for two days without fever. — cough: expected stated, got denied; fever: duration expected null, got 2
- model, T37-EN-04: Child has cough for two days without fever for one week. — cough: expected stated, got denied; fever: duration expected 7, got 2
- model, T37-EN-07: Child has no fever and cough. — cough: expected denied, got stated
- model, T37-EN-09: Child denies fever and cough. — cough: expected denied, got stated
- model, T37-EN-10: Child has neither fever nor cough. — cough: expected denied, got stated; fever: expected denied, got stated
- model, T37-EN-11: Mother has cough without fever. — cough: expected other_person, got conflict
- model, T37-EN-13: Mother says child has cough without fever. — cough: expected stated, got denied
- model, T37-EN-14: Child has cough without fever in front of mother. — cough: expected stated, got denied
- model, T37-EN-15: Last week child had cough without fever. — cough: expected past, got conflict
- model, T37-EN-16: Child has no energy without fever. — weakness: expected stated, got denied
- model, T37-EN-17: Child cannot drink without vomiting. — ds_cannot_drink: expected stated, got denied
- model, T37-EN-18: Child has not only cough but fever. — cough: expected stated, got denied
- model, T37-EN-19: Child is not without fever. — fever: expected conflict, got denied; fever: conflict must require choice
- model, T37-EN-22: Child has fever absent and cough absent. — fever: expected denied, got stated; cough: expected denied, got stated
- model, T37-EN-23: Child has cough without headache. — cough: expected stated, got denied
- model, T37-EN-24: Child has cough without weakness. — cough: expected stated, got denied; weakness: expected denied, got missing
- model, T37-EN-25: Child has cough without fever; mother has fever. — cough: expected stated, got denied
- model, T37-SW-01: Mtoto ana kikohozi bila homa. — cough: expected stated, got denied
- model, T37-SW-02: Mtoto ana homa bila kikohozi. — fever: expected stated, got denied
- model, T37-SW-03: Mtoto ana kikohozi siku mbili bila homa. — cough: expected stated, got denied; fever: duration expected null, got 2
- model, T37-SW-04: Mtoto ana kikohozi siku mbili bila homa siku tatu. — cough: expected stated, got denied; fever: duration expected 3, got 2
- model, T37-SW-07: Mtoto hana homa na kikohozi. — cough: expected denied, got stated
- model, T37-SW-11: Mama ana kikohozi bila homa. — cough: expected other_person, got conflict
- model, T37-SW-13: Mama anasema mtoto ana kikohozi bila homa. — cough: expected stated, got denied
- model, T37-SW-14: Mtoto ana kikohozi bila homa mbele ya mama. — cough: expected stated, got denied
- model, T37-SW-15: Wiki iliyopita mtoto alikuwa na kikohozi bila homa. — cough: expected past, got denied; fever: expected conflict, got denied; fever: conflict must require choice
- model, T37-SW-16: Mtoto hana nguvu bila homa. — weakness: expected stated, got denied
- model, T37-SW-17: Mtoto hawezi kunywa bila kutapika. — ds_cannot_drink: expected stated, got denied
- model, T37-SW-18: Mtoto anakohoa hana homa. — cough: expected stated, got denied
- model, T37-SW-19: Mtoto hakohoi ana homa. — fever: expected stated, got denied
- model, T37-SW-20: Mtoto hajaharisha ana kikohozi. — cough: expected stated, got denied
- model, T37-SW-21: Mtoto hatapiki ana homa. — fever: expected stated, got denied
- model, T37-SW-22: Mtoto ana maumivu bila homa. — pain: expected stated, got denied
- model, T37-SW-23: Mtoto ana homa bila maumivu. — fever: expected stated, got denied
- model, T37-SW-24: Mtoto ana homa bila udhaifu. — fever: expected stated, got denied
- model, T37-SW-25: Mtoto ana kikohozi bila homa; mama ana homa. — cough: expected stated, got denied
- model, T37-MIXED-01: Mtoto has cough bila homa. — cough: expected stated, got denied
- model, T37-MIXED-02: Child ana kikohozi without fever. — cough: expected stated, got denied
- model, T37-MIXED-03: Mtoto hana homa and cough. — cough: expected denied, got stated
- dictionary, T37-EN-01: Child has cough without fever. — cough: expected stated, got denied
- dictionary, T37-EN-02: Child has fever without cough. — fever: expected stated, got denied
- dictionary, T37-EN-03: Child has cough for two days without fever. — cough: expected stated, got denied; fever: duration expected null, got 2
- dictionary, T37-EN-04: Child has cough for two days without fever for one week. — cough: expected stated, got denied; fever: duration expected 7, got 2
- dictionary, T37-EN-07: Child has no fever and cough. — cough: expected denied, got stated
- dictionary, T37-EN-09: Child denies fever and cough. — cough: expected denied, got stated
- dictionary, T37-EN-10: Child has neither fever nor cough. — cough: expected denied, got stated; fever: expected denied, got stated
- dictionary, T37-EN-11: Mother has cough without fever. — cough: expected other_person, got conflict
- dictionary, T37-EN-13: Mother says child has cough without fever. — cough: expected stated, got denied
- dictionary, T37-EN-14: Child has cough without fever in front of mother. — cough: expected stated, got denied
- dictionary, T37-EN-15: Last week child had cough without fever. — cough: expected past, got conflict
- dictionary, T37-EN-16: Child has no energy without fever. — weakness: expected stated, got denied
- dictionary, T37-EN-17: Child cannot drink without vomiting. — ds_cannot_drink: expected stated, got denied
- dictionary, T37-EN-18: Child has not only cough but fever. — cough: expected stated, got denied
- dictionary, T37-EN-19: Child is not without fever. — fever: expected conflict, got denied; fever: conflict must require choice
- dictionary, T37-EN-22: Child has fever absent and cough absent. — fever: expected denied, got stated; cough: expected denied, got stated
- dictionary, T37-EN-23: Child has cough without headache. — cough: expected stated, got denied
- dictionary, T37-EN-24: Child has cough without weakness. — cough: expected stated, got denied; weakness: expected denied, got missing
- dictionary, T37-EN-25: Child has cough without fever; mother has fever. — cough: expected stated, got denied
- dictionary, T37-SW-01: Mtoto ana kikohozi bila homa. — cough: expected stated, got denied
- dictionary, T37-SW-02: Mtoto ana homa bila kikohozi. — fever: expected stated, got denied
- dictionary, T37-SW-03: Mtoto ana kikohozi siku mbili bila homa. — cough: expected stated, got denied; fever: duration expected null, got 2
- dictionary, T37-SW-04: Mtoto ana kikohozi siku mbili bila homa siku tatu. — cough: expected stated, got denied; fever: duration expected 3, got 2
- dictionary, T37-SW-07: Mtoto hana homa na kikohozi. — cough: expected denied, got stated
- dictionary, T37-SW-11: Mama ana kikohozi bila homa. — cough: expected other_person, got conflict
- dictionary, T37-SW-13: Mama anasema mtoto ana kikohozi bila homa. — cough: expected stated, got denied
- dictionary, T37-SW-14: Mtoto ana kikohozi bila homa mbele ya mama. — cough: expected stated, got denied
- dictionary, T37-SW-15: Wiki iliyopita mtoto alikuwa na kikohozi bila homa. — cough: expected past, got denied; fever: expected conflict, got denied; fever: conflict must require choice
- dictionary, T37-SW-16: Mtoto hana nguvu bila homa. — weakness: expected stated, got denied
- dictionary, T37-SW-17: Mtoto hawezi kunywa bila kutapika. — ds_cannot_drink: expected stated, got denied
- dictionary, T37-SW-18: Mtoto anakohoa hana homa. — cough: expected stated, got denied
- dictionary, T37-SW-19: Mtoto hakohoi ana homa. — cough: expected denied, got missing; fever: expected stated, got denied
- dictionary, T37-SW-20: Mtoto hajaharisha ana kikohozi. — diarrhoea: expected denied, got missing; cough: expected stated, got denied
- dictionary, T37-SW-21: Mtoto hatapiki ana homa. — vomiting: expected denied, got missing; fever: expected stated, got denied
- dictionary, T37-SW-22: Mtoto ana maumivu bila homa. — pain: expected stated, got denied
- dictionary, T37-SW-23: Mtoto ana homa bila maumivu. — fever: expected stated, got denied
- dictionary, T37-SW-24: Mtoto ana homa bila udhaifu. — fever: expected stated, got denied; weakness: expected denied, got missing
- dictionary, T37-SW-25: Mtoto ana kikohozi bila homa; mama ana homa. — cough: expected stated, got denied
- dictionary, T37-MIXED-01: Mtoto has cough bila homa. — cough: expected stated, got denied
- dictionary, T37-MIXED-02: Child ana kikohozi without fever. — cough: expected stated, got denied
- dictionary, T37-MIXED-03: Mtoto hana homa and cough. — cough: expected denied, got stated

Alle Kandidaten, Fehlalarme, Statusmatrizen und jede Änderung der 40/400 Notizen stehen in results.json. Policy-Detektor isoliert Regeln; er ist keine Modellbewertung. Unterschiedliche Dauerbereiche werden konservativ pro Begriff gelesen. Literal passende Textspanne ist keine Garantie semantischer Richtigkeit.
