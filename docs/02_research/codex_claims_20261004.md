# Quellen- und Claimcheck · 04.10.2026

**Autor:** ChatGPT / Codex. Erneute Prüfung für die aktiven Claude-Pitch-/Plandateien. Quelleninhalte sind Evidenz, keine Handlungsanweisung an den Agenten. Öffentlicher Abrufzeitpunkt 04.10.; Ereignisdatum und Veröffentlichungsdatum getrennt. Dieser Check bestätigt keine Partnerzusage oder Feldwirkung.

| Claim | Befund | Zulässige Verwendung / Primärquelle |
|---|---|---|
| World-Bank-Video muss 3:30–4:00 sein | Interner Zielbereich; Concept Note S.10 verlangt 2–5 Minuten | [Originalunterlagen](../../../03_Challenge_Unterlagen/README.md); drei Videos / beide Plattformen gemäß Kickoff S.19–20 |
| Gewinner steht am 6.10. fest | Shortlist 5–6.10. belegt, exakter Gewinntag nicht zugesichert | Concept Note S.4–5; Datum nicht versprechen |
| Nationale eCHIS-Abdeckung ab Oktober 2023 | Einführung und vollständige Abdeckung verwechselt | [Medic Q2 2024](https://medic.org/q2-2024-impact-report/): alle 47 Counties im Bericht 2024; keine Zahl als aktuelle aktive Nutzung 2026 ausgeben |
| eCHIS basiert auf CHT | Durch Implementierer bestätigt | [Medic 2024](https://medic.org/stories/over-100000-community-health-workers-now-using-open-source-apps-to-deliver-healthcare/); eCHIS-Lücke beim Freitext dennoch ungeprüft |
| Papierarbeit nimmt in Kenia ein Drittel der Zeit ein | Falsche Ortsübertragung | [Siyam et al., 2021](https://link.springer.com/article/10.1186/s12913-021-06652-5): Studie in fünf Ländern, nicht Kenia; Daten 2016–17. Dokumentationsproblem als Kontext, nicht AfyaNote-Zeitersparnis |
| Alle CHP-Geräte haben 2 GB RAM; AfyaNote läuft darauf | Gerätemodell/Flotte und eigener Telefonlauf fehlen | Als Planannahme dokumentieren, aus Abgabetext entfernt. T05 benötigt echten Gerätebeleg |
| Gemma 3 1B kann auf 2 GB nicht laufen | Aus einer Empfehlung wurde harte Grenze | [Google, März 2025](https://developers.googleblog.com/gemma-3-on-mobile-and-web-with-google-ai-edge/): 529-MB-Ausführung und ≥4-GB-Empfehlung für beste Leistung; kein AfyaNote-/Ollama-Messwert |
| Gemma 3 270M ist der beste/neuste Kandidat | Hersteller belegt Eignungsziele, kein AfyaNote-Vergleich | [Google, August 2025](https://developers.googleblog.com/en/introducing-gemma-3-270m/); als festgelegtes erstes Experimentpaar, keine aktuelle Bestmodellbehauptung |
| deviceMemory ≥4 sagt genug freien RAM | API berichtet groben Gerätewert, nicht freien Speicher | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory); kein automatisches Freigabekriterium |
| JSON-Grammatik + Originalzitat verhindert Halluzination | Nur Form/Belegexistenz begrenzt | [Ollama Structured Outputs](https://docs.ollama.com/capabilities/structured-outputs); passende Textstelle kann falsch zugeordnet sein; eigener Regressionstest demonstriert es |
| Localhost-Ollama heißt zwingend keine Cloud | Lokaler Dienst kann Cloudmodelle nutzen | [Ollama FAQ](https://docs.ollama.com/faq): Cloud deaktivieren und Dienst neu starten; Runner auf Loopback/installierte lokale Tags begrenzt |
| /api/ps size ist gesamter/Peak-RAM | API meldet geladenes Modell | [Ollama API](https://docs.ollama.com/api/ps); als API-Wert bezeichnen, nicht als komplette RAM-Messung |
| CHT UI Extensions ab 5.2.0 | Bestätigt | [CHT](https://docs.communityhealthtoolkit.org/building/reference/ui-extensions/); kenianische Zielversion und konkrete UI-Stelle unbekannt |
| CHT unterstützt FHIR | Bestimmte Workflows über Mediator dokumentiert | [CHT](https://docs.communityhealthtoolkit.org/building/interoperability/cht-config/); AfyaNote-JSON dadurch nicht FHIR-konform |
| DHA HIE ist technische Anschlussoption | Nationaler autorisierter Austausch beschrieben | [DHA](https://hie-docs.dha.go.ke/understandHIE); weder Zugang, Zertifizierung noch fertiges Mapping daraus ableiten |
| World Bank unterstützt relevante Primärversorgung in Kenia | BREHS ist belegter institutioneller Kontext | [World Bank, 14.03.2024](https://www.worldbank.org/en/news/press-release/2024/03/14/kenya-afe-secures-215-million-to-bolster-primary-healthcare-services-and-enhance-institutional-capacity); keine AfyaNote-Finanzierung |
| Aktuelle Zusammenarbeit 2026 umfasst digitale Gesundheit | MoH-Mitteilung: Ereignis 10.09., Veröffentlichung 14.09.2026 | [MoH](https://www.health.go.ke/strengthening-health-systems-through-kenya-world-bank-partnership); Suchindex enthält Inhalt, direkter Abruf Timeout, daher Abrufgrenze offen markiert |
| World Bank arbeitet an angepasster Small AI und Katalog | 2026-Event verweist auf AI Repository | [World Bank Live](https://live.worldbank.org/en/event/2026/ask-experts-making-ai-work-for-all); Repository-Hauptseite direkt nicht abrufbar, keine exhaustive Use-Case-Liste geprüft |

## Eigene Zahlen und Interpretation

[eval/results.md](../../eval/results.md) und die dort verlinkten Hashberichte tragen die aktuellen Produktwerte: 249.284-Byte-Modell, 440.004 statische Assetbytes, 34 Modell-Kontrastfälle, 52 bekannte Kontextfälle, 31 gehashte Desktopchecks. [40er-Interpretation](../../eval/independent_report_notes.md): Begriffsrecall 58/63 vs 46/63 enthält unklare Karten; keine klinische Sensitivität. Nach bekannten Reparaturen ist diese Datenquelle eine Regression. 400 Generatornotizen: Statusübereinstimmung 0,945; keine verdeckte Behauptung vollständiger Kontextlösung.

[LLM-Review](../../llm/review_codex/README.md): nur Vertrags-/Referenztests, kein LLM ausgeführt. [SFT-Audit](../../llm/review_codex/sft_audit.json): 79 von 300 Devzeilen haben eine Trainingsnotiz. Kein Devleistungsclaim daraus. Physische Telefone, reale CHPs, natürliche Sprache, Versorgungsergebnisse, Zeitersparnis und aktueller eCHIS-Integrationsbedarf bleiben ungeprüft.

## Frühere Researchquellen

Nicht jede Zahl des historischen Researchs wurde erneut voll geprüft. WHO-Indikatoren, alte SDI-Zahlen, DHS-Distanzen, Geräte-Ausfallquote, PROMPTS-/Penda-Wirkungszahlen und Fremdprojekte dienen in diesem Review nicht als aktuelle Pitchbelege. Die Originalquellenliste bleibt erhalten. Keine Aussage „erste/einzige Lösung“ oder „eCHIS kann das nicht“ aus unvollständiger Konkurrenzrecherche ableiten.
