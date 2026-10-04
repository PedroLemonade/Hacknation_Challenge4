# T34 · Sprach- und Fachreview vorbereiten

ChatGPT / Codex, 04.10.2026. **Vorbereitung abgeschlossen; niemand hat diese Daten menschlich freigegeben.** [Manifest](packet_20261004_v0416/manifest.json), [Reviewer A](packet_20261004_v0416/reviewer_A.jsonl), [Reviewer B](packet_20261004_v0416/reviewer_B.jsonl), [getrennter KI-Entwurf](packet_20261004_v0416/ai_focal_draft_NOT_GOLD.jsonl).

120 fiktive Notizen: je 40 Englisch, Swahili und gemischt; 10 Kontextgruppen. 30 sprachliche Grundfamilien mit je vier Kontextvarianten: **120 Zeilen sind keine 120 unabhängigen Beobachtungen**. Bereits bekannte T31/T37-Notiztexte sind im Manifest ausgewiesen. Keine exakte kanonisierte Überlappung zu 40/400 Notizen oder den 3.000 SFT-Trainingsnotizen. Verwandte Muster können trotzdem vorkommen. Neue Modellvorhersagen wurden nicht erzeugt. Dieses Paket ist Kandidatenmaterial für Reviewer, kein freigegebenes oder bislang unbekanntes externes Goldset.

## Durchführung

1. Peter organisiert zwei qualifizierte, voneinander unabhängige Reviewer für die tatsächlich verwendeten Swahili-Varianten und die Dokumentationsaufgabe; niemand wurde angeschrieben. Beide erhalten ausschließlich ihre eigene Datei und diese Anleitung, keine Modellantworten und keinen KI-Entwurf.
2. Erst Natürlichkeit und beabsichtigte Bedeutung prüfen. Künstliche, mehrdeutige oder dialektabhängige Formulierungen als `unresolved` markieren. Lokale Formen dürfen ergänzt werden, mit nachvollziehbarer Version. Keine AI-Draftlabels als Wahrheit übernehmen.
3. **Alle** relevanten Erwähnungen annotieren: feste Term-ID, Betroffener (`patient/other/unresolved`), berichtende Person, Negation, Zeitbezug, exakt passende Textspanne, explizite Dauer, Alterswert/Einheit oder unklar. Nicht Erwähntes bleibt nicht dokumentiert. Kein Diagnose-/Dringlichkeitslabel.
4. Offsets sind **UTF-16-Codeeinheiten**, wie JavaScript `slice`, nicht UTF-8-Bytes. `start` eingeschlossen, `end` ausgeschlossen. Bei Emoji unterscheiden sie sich von Python-Zeichenindizes. Originalnotiz erhalten; Korrekturtext separat speichern.
5. `review.status`: `accepted`, `corrected` oder `unresolved`; eigene Reviewerkennung, Datum, Anmerkung und vollständige `items` ergänzen. Ein `accepted` ohne vollständig geprüfte Items ist keine Goldfreigabe.
6. Andere Person plus Verneinung, Vergangenheit plus Verneinung und mehrdeutige Betroffene bleiben getrennte Dimensionen. Der aktuelle App-Export kann sie nur durch Auswahl reduzieren. Beispiel „cannot drink without vomiting“ ist eine bedingte Konstruktion; nicht mechanisch „vomiting denied“ annotieren.
7. Beide Rückgaben getrennt erhalten. Adjudikator prüft Konflikte, hält Gründe und Versionswechsel fest. Keine Personkennungen in den Produktdaten; hier nur künstliche IDs.

Der KI-Entwurf enthält absichtlich **nur einen fokalen Beispielterm**, nicht alle Befunde, und keine vollständigen Zeit-/Subjektbelege. Er darf nicht als Auswertungsgold benutzt werden. Das reduziert die Gefahr, dass unvollständige KI-Erwartungen einen Test scheinbar schlechter oder besser machen.

## Auswertungsplan nach tatsächlicher Freigabe

Modell und Regeln sind im Manifest eingefroren. Vorhersagen erst gegen vollständig adjudizierte Daten; Änderungen danach erzeugen einen neuen bekannten Regressionstest. Bericht mit Recall inklusive unklarer Kandidaten, Statusgüte unter gefundenen Begriffen, falschen bestätigbaren Zuständen, Extras, Dauer, exakten Belegen, Auswahlaufwand. Nach Sprache und Kontextgruppe getrennt; zusätzlich Konfusionsmatrix. Unsicherheit mittels Bootstrap **über 30 Familien**, alle Varianten einer Familie zusammen resamplen. Keine engen Konfidenzintervalle aus 120 scheinbar unabhängigen Zeilen. Reviewerübereinstimmung erst aus tatsächlichen Rückgaben, nicht jetzt berechnen.

[Sprachreview T08](../../docs/04_tasks/T08_swahili_gegenlesen.md), [LLM-Review T40](../../docs/04_tasks/T40_llm_annotation_abstention.md), [neuer Modell-/Gerätevergleich T41](../../docs/04_tasks/T41_llm_vergleich_geraete.md).
