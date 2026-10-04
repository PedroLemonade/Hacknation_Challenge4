# LLM-Training: überprüfter Stand und nächste Entscheidungen

**ChatGPT/Codex, 04.10.2026.** Claude bereitete Lexikon, erste SFT-Daten, Prompt, Schema und LLM-Werkzeuge vor. Ich habe Daten-/Splitprobleme behoben, eine lokale Trainingsumgebung eingerichtet und tatsächliche QLoRA-Runs durchgeführt. Basismodell: Qwen/Alibaba. Es wird kein Anthropic-Claude-Modell trainiert. App v0.4.11 und ihr bestehender Claude-Klassifikator bleiben unverändert.

## Ergebnisstatus

**Drei echte Trainingsläufe abgeschlossen.** Die direkten Quote-Experimente sind unbrauchbar. Der engere Passage-ID-Adapter extrahiert erstmals Begriffe, macht aber zu viele semantische Fehler für einen Produktwechsel. Auf dem bekannten 48er-Dev-Ausschnitt 76/116 Begriffe, 54/76 passende Status, 28 zusätzliche Begriffe und 10/48 vollständig passende Notizen mit Dauer/Quelle. Auf den vollständigen 40 bekannten Regressionen nach erneutem Laden der gespeicherten Gewichte: 54/63 Begriffe, 40/54 Status passend, 13 zusätzliche Begriffe, 18/40 exakt nach der vorhandenen Term-/Statusmetrik. Der unveränderte Klassifikator erreicht auf demselben 40er-Gold 58/63 Begriffe, 58/58 Status, eine zusätzliche Karte und 35/40 exakte Notizen. [Adapter-Devvergleich](../../llm/training_runs/20261004_qwen3_06b_selection_v01/comparison.md), [gespeicherter Adapter/40er-Vergleich](../../llm/reports/20261004_selection_saved_40/README.md), [Klassifikatorreferenz](../../llm/review_codex/current_reference_report/results.md). Kein Browser-/Handy-/Feldmodell freigegeben.

## Was an Claudes Trainingsvorbereitung repariert wurde

Der historische 3.000/300-Export hat 42 gleiche Train/Dev-Notizen, verteilt auf 79 Devzeilen. [Alter Audit](../../llm/review_codex/sft_audit.json). Originaldateien und ursprünglicher Generator gesichert; neue Verarbeitung schreibt nur in neue Runordner. [Sicherung](../../../90_Archiv/04_LLM_Training_20261004/manifest.json).

[family_v03](../../llm/sft_runs/20261004_family_v03/README.md) enthält 3.000/300 unterschiedliche kanonisierte Notizen und getrennte Satz-/Subjekt-/Ablenk-/Dauerfamilien. Kein kanonischer Notiz- oder Familienüberlapp. Alle 6.346 Targetitems bestehen Form, Originalzitat und Dauerprüfung; [Audit](../../llm/sft_runs/20261004_family_v03/audit_guard_v2.json). Vollständige Payloadreproduktion mit gleichem Seed bytegleich; [Nachweis](../../llm/sft_runs/20261004_family_v03/deterministic_reproduction.json).

Lexikon-Singletons werden ausdrücklich als geteilte Phrase ausgewiesen: dort sind nur Vorlagen und Subjekte getrennt. Wörter und Morpheme können auch sonst gemeinsam sein. Dev ist ein bekannter synthetischer Entwicklungssplit, kein unabhängiger Sprachtest. Bereits vergangene Formulierungen, uneindeutige Rollen und Gefahrzeichen-Proxies wie Trinkverweigerung statt Unfähigkeit wurden konservativ ausgeschlossen. Vier Status können andere Person + Vergangenheit/Negation und ungelöste Bezüge nicht gleichzeitig darstellen. Diese Fälle wurden nicht zu falscher Eindeutigkeit gezwungen. Die Ausschlüsse sind dokumentiert, keine Fachfreigabe.

[195 Reviewfälle](../../llm/sft_runs/20261004_family_v03/audit_guard_v2_review_packet.md) decken Sprach-/Term-/Status-/Dauerzellen ab. Der erste neue Auditoraufruf scheiterte durch einen fehlenden Begriffsliste-Parameter; Fehlerreport erhalten, korrigierter Audit vollständig bestanden. Das war ein Werkzeugfehler, kein nachträgliches Umetikettieren der Daten.

Der Generator benutzt keine bestehenden Test-/Goldsets als Quelle. Ein nachgelagerter Vergleich findet dennoch 5/400 alte Generatornotizen im Training und 0/40 bekannte Second-author-Notizen. [Overlapcheck](../../llm/sft_runs/20261004_family_v03/external_overlap_check.json). Die fünf Kollisionen wurden nicht anhand der Testlabels nachträglich aus Daten entfernt; das alte 400er-Set bleibt ausdrücklich Regression. Auch der 40er-Stand ist bekannt und sprachlich/fachlich ungeprüft.

## Tatsächliches Training statt bloßer Export

[Lokaler Modell-Snapshot](../../llm/base_models/qwen3_06b_official_20261004/manifest.json): offizielles Qwen3-0.6B, Commit c1899de289a04d12100db370d81485cdf75e47ca, Apache-2.0-Datei erhalten. Originaldateien 1.519.207.673 Bytes, lokal konvertiertes INT4-Paket 346.929.206 Bytes einschließlich Tokenizer. Dies sind Datei-, keine RAMgrößen. Qwen wurde als kleiner, direkt zugänglicher Vergleich gewählt. [Anbieter-Modellkarte](https://huggingface.co/Qwen/Qwen3-0.6B). Gemma 3 270M bleibt Claudes Kandidat; dessen explizite Hersteller-Zugangsbestätigung wurde nicht stellvertretend übernommen. [Google-Zugangshinweis](https://huggingface.co/google/gemma-3-270m-it).

Der Rechner meldet Apple M2 und 8 GiB physischen RAM. Isolierte MLX 0.32.3/MLX-LM 0.31.2-Laufzeit, fester Bibliotheks-Lock, keine globalen Paketänderungen. Nach Download/Umwandlung verwenden Training/Inference nur lokale Pfade, Offline-Einstellungen, keine Cloudtracker und kein remote code. Damit ist kein vollständiger Netzwerk-Audit des Rechners behauptet. Bibliotheken sind Drittanbieter-Code. [Runtime](../../llm/local_runtime/README.md). [MLX-LM-LoRA-Dokumentation](https://github.com/ml-explore/mlx-lm/blob/main/mlx_lm/LORA.md).

LoRA: letzte 12 von 28 Layern, Rank 8, Scale 16, 2.162.688 trainierbare Parameter; Adapter jeweils 8.668.615 Bytes. Basismodell und App-Modell werden nicht überschrieben. System-/Notizprefix ist beim Trainieren und Generieren exakt gleich, Qwen thinking deaktiviert. Loss nur für Antwort und EOS. Keine Zeile still gekürzt. Greedy/Temperatur 0 wurde als reproduzierbare Versuchsbedingung gewählt; Qwens Modellkarte empfiehlt für non-thinking andere Samplingwerte. Das ist eine Begrenzung dieses Versuchs, keine Behauptung optimaler Settings.

## Fehlversuche bewusst erhalten

[Direkte Quote-Ausgabe v01](../../llm/training_runs/20261004_qwen3_06b_qlora_v01/comparison.md): 400 Updates, Batch 1, LR 2e-4, knapp 393 Sekunden Training. Auf 48 vor dem Training eingefrorenen Devnotizen alle Adapterantworten leer: 0/116 Begriffe. Alle Antworten formal gültig; 2/48 exakte Notizen sind ausschließlich echte Leernotizen. Kein Erfolg trotz gesunkener Loss.

[Quote-Ausgabe v02](../../llm/training_runs/20261004_qwen3_06b_qlora_v02/comparison.md): weitere 400 Updates, insgesamt 800; nur 1/116 Begriff, falscher Status. Zitate/Termduplikate meist zurückgewiesen. AdamW-Momente wurden beim Fortsetzen nicht wiederhergestellt; dies ist eine Weitertrainingsphase mit frischem Optimizer, kein exakter Resume. [Manifest](../../llm/training_runs/20261004_qwen3_06b_qlora_v02/manifest.json).

Die installierte Lossmaske schloss den ersten Paddingtoken ein. Ein reproduzierbarer Test mit Prefixlänge 2 und Gesamtlänge 6 ergibt 5 überwachte Token statt der 4 tatsächlichen Antwort-/EOS-Token. Der eigene Loss verwendet ein exklusives Ende. [Versionierte Herstellerquelle](https://github.com/ml-explore/mlx-lm/blob/v0.31.2/mlx_lm/tuner/trainer.py), [lokaler Test](../../llm/training_codex/test_tokenization.py). Diese Korrektur behob den semantischen Fehler nicht. Keine Ursachenzuschreibung der Zitatfehler allein an Padding.

[Acht Trainingsbeispiele diagnostisch geprüft](../../llm/training_runs/20261004_qwen3_06b_qlora_v02/training_fit_diagnostic.json): Teacher-Forced-CE etwa 0,1–0,38, trotzdem falsche Labels, stated statt denied/other_person, wiederholte Terms und erfundene Textteile beim freien Generieren. Das zeigt, weshalb Gesamt-Loss und Syntax nicht als Extraktionsgüte dienen dürfen. Diagnose am Trainingsmaterial, kein Testscore.

## Engerer Passage-ID-Versuch

[selection_v01](../../llm/sft_runs/20261004_selection_v01/README.md) verwendet exakt dieselben Notizen/Goldlabels. Eingabe sind nummerierte Originalpassagen. Zielantwort enthält term/status/clause_id/duration_days; der Resolver kopiert den Originalspan. Alle abgeleiteten Targets lösen sich exakt in das ursprüngliche Gold zurück. Kein neues klinisches Gold erstellt.

Unbekannte IDs, Zusatzfelder, doppelte Begriffe und falsche Typen werden verworfen; Dauer bleibt zusätzlich beim bestehenden Guard. Eine richtige Quellen-ID garantiert kein richtiges Symptom oder Subjekt. Deshalb zählt der neue Scorer die passende Goldpassage separat. Freie Zitatformulierung wird aus der Modellaufgabe entfernt. Begrenzte Satztrennung und Vierstatusschema bleiben Grenzen.

Der Versuch startet erneut vom Basismodell: 600 Updates, Batch 2, LR 1e-4, Seed 7072, Dev-Auswahlseed 7070. Er übernimmt keine Gewichte der gescheiterten direkten Extraktoren. Die 48er-Auswahl bleibt Entwicklung; mehrere Repräsentationen/Settings wurden anhand bekannter Devbefunde gewählt. Dadurch wird sie erst recht kein unabhängiger Abschlusstest.

## Endgültiger Passage-ID-Befund

600 Updates × Batch 2, also 1.200 Trainingsbeispiele verarbeitet; keine vollständige Epoche der 3.000 Notizen. Training 973,31 Sekunden. 2.162.688 LoRA-Parameter, Adapter 8.668.615 Bytes. MLX-Allocatorpeak 1,766 GB bis Trainingsende; andere Prozess-/OS-Allokationen fehlen. Nach Download war der Lauf lokal/offline ohne Cloudtracker. [Manifest](../../llm/training_runs/20261004_qwen3_06b_selection_v01/manifest.json).

| Bekannter Dev-Ausschnitt | Notizen | Begriffe / Gold | Status passend / gefunden | Extra | Vollständig inkl. Dauer/Quelle |
|---|---|---|---|---|---|
| EN | 18 | 30/41 | 25/30 | 5 | 9/18 |
| SW | 19 | 25/42 | 15/25 | 18 | 0/19 |
| Mixed | 11 | 21/33 | 14/21 | 5 | 1/11 |

Alle 76 passenden Begriffe sind an ihre korrekte Goldpassage gebunden. Das behebt die freie Zitaterfindung, aber nicht Statusverwechslungen und zusätzliche Labels: 32 falsche positive stated-Vorschläge auf 48 Notizen. Drei ungültige Auswahlantworten vollständig zurückgewiesen; elf nicht belegte Dauern entfernt. 13/23 Golddauern korrekt erfasst. Nur 10/48 komplette Notizen, einschließlich Quelle und Dauer. Quelle: [vollständiger JSON-Report mit jedem Fehler](../../llm/training_runs/20261004_qwen3_06b_selection_v01/comparison.json).

Die 40er-Regressionsmetrik „exact notes“ prüft Term/Status, **nicht** korrekte Dauer oder semantische Belegzuordnung. Sie darf nicht mit der strengeren 48er-Komplettmetrik gleichgesetzt werden. Der eigene Development-Scorer und die bestehende 40er-Auswertung bleiben getrennt. Hybrid-Vergleich erzeugt 31 unklare Karten bei dieser 40er-Regression; ein möglicher Recallgewinn bedeutet nicht, dass der fertige Entwurf besser wird.

45 neue Vertrags-/Tokenisierungsprüfungen (12 Split, 13 Auswahlbindung, 12 Scorerszenarien, 8 lokale Token-/Losschecks), vollständige bytegleiche Reproduktion und gehashte Quellen; [Prüfnachweise](../../llm/training_codex/verification_20261004/tests.json). Die früheren 63 O03-Vertragschecks betreffen unveränderte Guard-/Scorer-/Runnerquellen, keine zusätzliche LLM-Güte. CI-Konfiguration erweitert und YAML/Syntax gelesen, GitHub-Job nicht ausgeführt.

**Entscheidung:** App-Klassifikator für die aktuelle Demo behalten. Passage-ID-Adapter als reproduzierbaren Forschungsstand sichern, keine automatische Übernahme/medizinischen Texte. Besonders die SW-Fehler verhindern eine seriöse Einsatzbehauptung. Vor weiteren Qualitätsclaims T40-Review und ein neuer unabhängiger Test. Gegenwärtig kann weiteres Training nur Entwicklung sein. Kein Modellvergleich zwischen den Repräsentationen als kausale Ablation: Prompt, Batch, Lernrate, Seed und Updates änderten sich ebenfalls.

## Nacharbeit als kopierbare Aufgaben

- [T38](../04_tasks/T38_sft_split_review.md): Daten-/Splitreparatur, tatsächlich ausgeführt.
- [T39](../04_tasks/T39_llm_trainingsversuch.md): nachvollziehbares lokales Training und gespeicherte Adapterprüfung.
- [T40](../04_tasks/T40_llm_annotation_abstention.md): qualifizierte Annotation und darstellbare Unsicherheit.
- [T41](../04_tasks/T41_llm_vergleich_geraete.md): unabhängiger Vergleich, sinnvolle weitere Modell-/Geräteprüfung.
- [T42](../04_tasks/T42_llm_passagen_auswahl.md): Passage-ID-Ansatz und getrennte Quellenwahlmessung.

Skripte/Hashes/Anleitungen liegen im aktiven gemeinsamen Ordner, nicht in privaten Arbeitskopien. Claude-/Codex-/Qwen-Beiträge werden getrennt bezeichnet. Historische Ergebnisse und bestehende Appprüfungen bleiben erhalten.
