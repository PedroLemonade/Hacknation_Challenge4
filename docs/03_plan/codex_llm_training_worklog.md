# LLM-Training · ChatGPT / Codex · 04.10.2026

Status: abgeschlossen, Reservierung freigegeben. Peter hat ausdrücklich Fortsetzung des LLM-Trainings beauftragt; dies erweitert T38 um einen tatsächlichen lokalen Entwicklungsversuch.

Reserviert: llm/export_sft.py, neue llm/sft_runs/, llm/training_codex/, llm/training_runs/, llm/base_models/ und llm/local_runtime/; eigene neue Trainingsdokumente/T39–T41 sowie LLM-README, T38-Status, Herkunft/Hub/INDEX und .gitignore. Keine App- oder Klassifikatoränderung. Alte SFT/Outputs/Reports/Worklogs bleiben erhalten.

Grundlage: Claude-Toolkit und Lexikon. Splitreparatur, Trainingseinrichtung, neue Prüfungen und Trainingslauf durch ChatGPT/Codex. Basismodell von Qwen/Alibaba, nicht von einem der beiden Assistenten.

8 GiB physischer RAM; keine laufende Ollama-Instanz, keine MLX-/Torch-Trainingsbibliothek vorgefunden. Isolierte MLX-Umgebung geplant. Gemma ist zugangsbeschränkt; Qwen3 0.6B als erster lokaler Messkandidat. Kein Patientendatensatz.

## Erster Datenstand und tatsächliche Runs

Sicherung: 90_Archiv/04_LLM_Training_20261004/manifest.json; ursprünglicher Claude-Exporter und README erhalten, 90 App-/Daten-/Trainings-/Eval-/alten LLM-Dateien gehasht. Isolierte MLX-LM 0.31.2-Umgebung und offizieller Qwen-Commit mit Lizenz/HF-Tokenverzicht; keine globalen Pakete verändert. Katalog schließt .venv und .cache aus; CI um neue daten-/modellfreie Vertragstests ergänzt.

family_v03: 3.000/300 kanonisch eindeutige Notizen, keine Familienüberschneidung, 6.346 geprüfte Targetitems; 195 ausgewählte Reviewfälle. Erster Auditoraufruf vergaß die erforderliche Begriffsliste und scheiterte auf allen Notizen. Fehlerbericht erhalten; korrigierter Audit_guard_v2 besteht vollständig. Generator-Ausnahmen und fehlende Statuszellen ausdrücklich dokumentiert. Nachträglicher Overlapcheck ohne Datenänderung: 0/40 Second-author-Notizen, aber 5/400 ursprüngliche Generator-Testnotizen im Training.

Echter Run v01: 400 Updates, 8.668.615-Byte-Adapter, 48 eingefrorene Devnotizen. Alle Antworten items:[]; 0/116 Begriffe. V02: weitere 400 Updates, exklusives Ende der Lossmaske nach reproduziertem Padding-Grenzfehler in installierter MLX-LM-Version. Optimizer neu; 1/116 Begriff, Status falsch, Zitate meist erfunden. Beide Läufe und Modelldateien bleiben als Fehlversuche nachvollziehbar. Acht Trainingsbeispiele diagnostisch geprüft: geringe Teacher-Forced-Loss verdeckt falsche Labels/Status/Quotes bei freier Generierung. Nicht als Testgüte ausgegeben.

V03/selection_v01: eigene Passage-ID-Repräsentation, exakt gleiche Quellnotizen/Labels, alle Targets lösen sich an Originalgold zurück. Neues Training ab unverändertem Qwen-Basismodell, keine Übernahme des gescheiterten Quote-Adapters. Quote wird aus gewählter Originalpassage rekonstruiert; semantisch falsche Auswahl bleibt möglich. 600 Schritte, Batch 2 geplant. Neue Scorerversion prüft vollständige Quellenpassage gesondert. Ergebnisse werden erst nach tatsächlichem Abschluss eingetragen.

## Abschluss

Alle drei Programme abgeschlossen, neue Adapter/Checkpoints gespeichert, alter Bestand erhalten. Passage-ID-Run: 600 Updates Batch 2, 973,31 s Training, 1,766 GB MLX-Allocatorpeak. 48 bekannte Devnotizen: 76/116 Begriffe, 54/76 passende Status, 28 Extras, 10/48 komplett mit Dauer/Quelle; SW 0/19 komplett. Gespeicherter Adapter erfolgreich neu geladen: vollständig 40/40 Antworten, 54/63 Begriffe, 40/54 Status, 13 Extras, 18/40 nach der engeren Term-/Statusmetrik. Unveränderter Klassifikator auf demselben 40er-Gold besser. Keine App-Anbindung.

Neue Auswahlantworten erlauben ausschließlich vorhandene IDs; Quellenzitat wird rekonstruiert. Der neue Scorer weist selection_error vollständig zurück, auch wenn eine nichtkonforme Rohantwort zufällig dem alten Quote-Schema ähneln würde. Zukünftiger Runner verhindert diesen Fallback zusätzlich mit invalid_selection; der tatsächliche Run-Snapshot und die eingefrorenen Rohantworten sind erhalten. Der neue Runner beschreibt den tatsächlich verwendeten nummerierten-Passagenprompt korrekt; die vorherige Planbeschreibung ist als Erratum im Run-README offengelegt.

45 neue Vertrags-/Tokenisierungschecks; neue Syntax/YAML gelesen, aktuelle Run-/Snapshot-/Daten-/Adapterhashes geprüft. Herkunft, Übersichten und vier neue Taskpakete aktualisiert. T38/T39/T42 erledigt als Daten-/Trainings-/Experimentaufgaben; T40 qualifizierter Review und T41 unabhängiger Test/Telefon offen. Keine Veröffentlichung, Übertragung echter Notizen, Commits, Pushes oder Modelländerung in der App.
