# Nächste Sitzung · kopierbare Aufträge

Von **ChatGPT / Codex**, 04.10.2026. Ausgangspunkt: gemeinsame Demo v0.4.17. Verbindliche Abschlüsse stehen im [BACKLOG](../../BACKLOG.md), Belege im [Fortsetzungsreview](codex_continuation_review.md). Nicht die alte Uhrzeitspalte als aktuellen Kalender verwenden. Der Kickoff nennt für Sonntag, 04.10., 09:00 ET die Abgabe; das entspricht 15:00 Berlin. Die spätere Finalistenrunde ist eine andere Frist.

## Zuerst: bereits geleistete Arbeit erkennen

T33 und T37 sind implementiert; keine neue Negationsreparatur unter derselben ID anfangen. T34, T35 und T36 sind als Material bzw. lokaler Mock fertig; menschliche Reviews, echter Systemanschluss und tatsächliche Probe sind damit nicht erledigt. T38/T39/T42 umfassen drei echte lokale Trainingsläufe. T47 ist ein weiterer separat gestarteter Lauf: zuerst Log/Manifest prüfen, niemals einen zweiten Prozess für denselben Versuch starten. T43/T44 enthalten die aktuelle Browseraufnahme und die vertiefte Prüfung. Fehlruns bleiben als nachvollziehbare Entwicklung erhalten.

```text
Arbeite im Ordner /Users/peter/Desktop/Challenge 4/01_Working_Demo_AfyaNote. Lies AGENTS.md, BACKLOG.md, docs/03_plan/codex_continuation_review.md, docs/03_plan/codex_continuation_worklog.md und den letzten Claude-Worklog. Vergleiche App-Version und Quellhashes mit aktuellen Berichten. Prüfe T47-Log und Abschlussmanifest vor neuen Trainingsjobs. Erledigte Tasks nicht erneut umsetzen. Nimm genau das nächste noch ausführbare Aufgabenpaket, erhalte historische Daten/Belege, dokumentiere deinen tatsächlichen Beitrag und aktualisiere Hub und Herkunftskatalog erst nach der Umsetzung. Keine fehlenden menschlichen Prüfungen als abgeschlossen melden, kein Commit/Push/Deployment oder externe Nachricht.
```

## Priorität vor der Abgabe: Peter

1. [T02](../04_tasks/T02_lokal_starten.md): selbst durchklicken, Originalnotiz und Prüfentscheidungen nachvollziehen. Automatisierte Browserchecks ersetzen diese Bedienung nicht.
2. [T05](../04_tasks/T05_handy_offline_test.md): tatsächlich auf dem Telefon laden, Cachebereitschaft abwarten, Flugmodus und WiFi aus, App schließen/neu öffnen und neue fiktive Notiz prüfen. Bildschirm/OS/Browser und Fehler dokumentieren. `localhost` auf dem Telefon zeigt nicht auf diesen Mac.
3. [T08](../04_tasks/T08_swahili_gegenlesen.md): qualifizierte Sprachprüfung. Eine KI kann Reviewfragen und Dateien vorbereiten, keine Muttersprachlerfreigabe ersetzen.
4. [T11](../04_tasks/T11_folien.md), [T12](../04_tasks/T12_videos_aufnehmen.md), [T14](../04_tasks/T14_abgabe.md), [T15](../04_tasks/T15_schlusskontrolle.md): echte Stimme, echter Handybeleg, aktuelle Folien, beide Abgabewege und Plattformanforderungen prüfen. Der neue 75,56-Sekunden-Browserclip hat keine Stimme. Lokal gespeicherte Dateien sind noch keine Einreichung.

## Die nächste technische Arbeit

| Paket | Inhalt | Bedingung / Ergebnis |
|---|---|---|
| [T47](../04_tasks/T47_llm_kontrollierte_epoche.md) | Kontrollierter 1.500-Update-Versuch | Bereits gestartet; Abschluss/Fehlerlog prüfen, gleiche 48 Devnotizen gegen 600 Updates vergleichen |
| [T50](../04_tasks/T50_lokales_releasepaket.md) | Lokales Demo-ZIP ohne Trainingsruntime | Passende Quellhashes; keine Veröffentlichung |
| [T52](../04_tasks/T52_pitch_aktueller_nachweis.md) | Claude-Pitch mit neuesten Belegen abgleichen | Aktuelle Claude-Dateien zuerst lesen; Baseline und Regression unterscheiden |
| [T46](../04_tasks/T46_kontext_restfaelle.md) | Neue Modalitäts-/Zeit-/Dauerfälle | Vor Fix einfrieren; zweifelhafte T37-KI-Annotation erhalten |
| [T48](../04_tasks/T48_llm_ablations_eval.md) | Format-/Semantikablation, alle 300 Devnotizen | Keine Goldlabels im Prompt; fresh-only Antworten und feste Nenner |
| [T54](../04_tasks/T54_cache_update_konflikte.md) | Versionswechsel während offenem Fall | Eigene temporäre Serverwurzel; keine beiläufige Fallpersistenz |

Nach T47 kein automatischer weiterer Trainingssweep. Zuerst prüfen, ob Format, Status und Extras besser werden. Niedrigere Trainingsloss allein beantwortet die Machbarkeit nicht. Bleiben falsche Patientenbezüge oder viele Extras, hat T45/T40 mit menschlicher Annotation Vorrang vor noch mehr Updates.

## Danach: menschlicher und institutioneller Anschluss

| Paket | Vorbereitung vorhanden | Noch tatsächlich erforderlich |
|---|---|---|
| [T45](../04_tasks/T45_review_import_adjudikation.md) | 120 Notizen, zwei blinde Reviewerdateien, separate KI-Fokaldrafts | Zwei echte qualifizierte Reviews und menschliche Adjudikation |
| [T36](../04_tasks/T36_pilot_bedienprobe.md) | Leitfaden, sechs Fälle, leere Messvorlage | Tatsächliche CHP-/Empfängerprobe, Zustimmung und geeignete Vergleichsfälle |
| [T51](../04_tasks/T51_partner_schnittstellenvertrag.md) | Lokaler Validator/Mock, Mappingfragen | Aktuelles Formular, CHT/eCHIS-Version, Identität/Auth/Consent/Retention-Vertrag |
| [T49](../04_tasks/T49_handy_llm_runtime.md) | Laufzeitarchitektur und gemessene Mac-Experimente | Reales Telefon und kompatibles Telefonartefakt; MLX-Dateien laufen nicht einfach im Browser |
| [T53](../04_tasks/T53_qr_kamera_interop.md) | Lokale QR-Ausgabe und Browserprüfung | Tatsächliches Kamera-Decoding und Empfängerworkflow |
| [T55](../04_tasks/T55_artefakt_retention.md) | Dateikatalog mit Herkunft und Hashes | Größensortierte Aufbewahrungsentscheidung; keine automatische Löschung |

## Gute Übergabe zwischen Claude und ChatGPT

Neue reine Programme/Dokumente nennen ihren Ersteller. Änderungen an Claude-Grunddateien bleiben gemeinsame Arbeit. Basismodellgewichte sind Qwen/Alibaba; das App-Klassifikatormodell und sein ursprüngliches Training stammen von Claude. Ein durch Codex erzeugtes Screenshot zeigt die gemeinsame App und macht sie nicht zu einer rein von Codex geschriebenen App.

Vor paralleler Dateiänderung Worklog und tatsächliche Änderungszeiten prüfen. Peter hatte Claude zunächst als inaktiv bezeichnet; ein neuer Claude-Worklog um 09:05 belegt später wieder Arbeit am About-/Pitchvergleich. Diese neuen Beiträge wurden erhalten. Das ist ein Grund, aktuelle Dateien erneut einzulesen, kein Anlass zum Doppelstart oder zum Rücksetzen auf eine alte Kopie.
