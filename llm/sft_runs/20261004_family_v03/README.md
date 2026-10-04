# Neuer SFT-Datenstand: family_v03

Claude-Lexikon und ursprüngliche SFT-Idee; Generatorreparatur und Datenlauf durch ChatGPT/Codex am 04.10.2026. Alle Beispiele synthetisch und ohne qualifizierten Sprach-/Fachreview.

3.000 kanonisch eindeutige Trainingsnotizen, 300 eindeutige Devnotizen. `valid.jsonl` ist eine bytegleiche MLX-Kopie von `dev.jsonl`, kein weiterer Testsplit. Train/Dev-Notiz- und Familienüberlappung jeweils null; alle 6.346 Targetitems bestehen den strikten Guard einschließlich Dauer. [Endgültiger Audit](audit_guard_v2.json), [Manifest](manifest.json).

Train/Dev-Formulierungspools werden vor dem Sampling aufgeteilt: bei mehreren Formulierungen die letzte für Dev; bei Singleton-Pools wird die Phrase geteilt, aber Satzvorlagen und explizite Subjekte bleiben getrennt. Auch Ablenktexte, Dauer- und Vergangenheitsformen sind getrennt. Geteilte Wörter/Morpheme sind möglich. Dies belegt keinen unabhängigen Sprachtest. Die Singleton-Ausnahmen und fehlenden Zellen stehen im Manifest.

Inhaltsänderungen gegenüber Claude: jeder Satz mit eigenem Subjekt; keine Rollen-/Zeit-/Negationskombination, die das Vierstatusschema nicht ausdrücken kann; unklare Vergangenheits-/Gefahrzeichen-Proxies ausgeschlossen. `hana nguvu` bleibt positives weakness, `hawezi kunywa` positives inability. Positive Trinkfähigkeit/Wachheit sind leere Kontrasttargets; ausdrücklich „no convulsions“ darf denied sein. Das ist vom bisherigen Klassifikator-Gold abweichend und nicht klinisch validiert.

[Reviewpaket: 195 Fälle](audit_guard_v2_review_packet.md), [editierbare Datensätze](audit_guard_v2_review_packet.jsonl). Originalpakete erhalten, Korrekturen in einer neuen Datei dokumentieren. Ein fachlich korrektes Datenpaket braucht weiterhin qualifizierte Annotatoren.

`audit.json` und das ältere `review_packet.*` sind ein fehlgeschlagener erster Auditversuch: der neue Auditor hatte die erforderliche Begriffsliste beim Guard-Aufruf vergessen. Die Daten waren unverändert; mit repariertem Auditor ist `audit_guard_v2.json` die maßgebliche Prüfung. Dieser Befund bleibt sichtbar.

Der Generator liest keine originalen Test-/Goldsets und schreibt keine alten SFT-Dateien. Die historischen Claude-Daten unter `../sft/` bleiben bytegleich, einschließlich ihres belegten Overlaps.
