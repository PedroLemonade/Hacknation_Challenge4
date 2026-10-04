# Selbstreview und aktueller Nachweisstand

> **Herkunft:** Claude-Grundfassung; Quellen-, Machbarkeits- und Versionsreview durch ChatGPT / Codex am 04.10.2026. Aktiver Stand: v0.4.11.

Der ursprüngliche Claude-Selbstreview bezog sich auf v0.4.1 und spätere Nachträge. Er bleibt in der [Sicherung](../../../90_Archiv/03_Claude_Review_20261004/docs/03_plan/self_review.md) erhalten. Frühere Aussagen „keine Funde offen“ und neue Sätze würden stets dem Patienten zugeordnet, gelten für den aktuellen Stand nicht.

| Prüffrage | Aktueller Befund | Nachweis / Grenze |
|---|---|---|
| Export ohne alle Entscheidungen oder Einwilligung | Gesperrt, zusätzlich im Handler geprüft | [31 Browserchecks](../../eval/demo_regression_results.json), Hashes passen zu v0.4.11 |
| Fallwechsel / ungültiges Alter / Dialogfokus / Offline-Reparatur | Im gemeinsamen Stand repariert | [Demo-Review](codex_demo_review.md) |
| Offline-Neustart | Desktop mit simulierter Netzunterbrechung bestanden | Kein physischer Telefon-Test; T05 |
| Fallnotiz an Server senden | Kein entsprechender App-Sendeweg in geprüftem Stand | Statische Paketabrufe gehen an Host; bewusste Exporte/QR/Druck können weitergegeben werden |
| Keine dauerhafte Falldatenhistorie | App speichert Fälle im RAM; nur `afya_lang` als Präferenz | Kein Schutz vor Screenshot, Browser/OS-Kopie, Download oder entsperrtem Bildschirm |
| Andere Person / Bericht / Begleitung | Bekannte Muster repariert; 52/52 bekannte Kontextfälle | Modell-/Fachvalidierung nicht daraus ableiten; [T31](codex_context_review.md) |
| Verneinung | **Bekannter Fehler offen:** „Child has cough without fever“ verneint beide Begriffe | T37; nicht als allgemeine korrekte Negationsbehandlung beschreiben |
| Kombination Person + Vergangenheit + Verneinung | Auswahlpflicht bei begrenzten Kombinationen | Ein Exportstatus repräsentiert nicht alle Dimensionen |
| Übersetzung | Gleiche Schlüsselmenge ist Vollständigkeit im Code | Kein Nachweis natürlicher oder medizinisch richtiger Sprache; T08 |
| Barrierefreiheit | Claude berichtet frühere axe-Prüfungen | Kein neuer axe-Lauf in diesem Review; Tastatur-/Layoutchecks ersetzen kein Fach-Audit |
| CI | Syntax, Parität, 34 Kontrasttests, LLM-Vertragsprüfungen und Speicher-Suche | Nicht ausgeführt auf GitHub; kein Browser-/Telefon-/Sprach-/Security-Audit im Workflow |
| Optionaler LLM-Guard | 31/31 Vertragschecks, 13 Scorerchecks, 11 Mock-Runnerchecks | [Berichte](../../llm/review_codex/README.md); kein LLM ausgeführt; passende Zitate können falsch interpretiert sein |

## Freigabe für die Hackathon-Demo

Fiktive Notizen verwenden, Grenzen im Pitch zeigen, aktuelle Version nennen und fremde Personen/Verneinungen nicht pauschal als gelöst darstellen. Eine Demo-Freigabe ist keine Freigabe für Patientenversorgung. Vor Pilot: Sprach-/Fachreview, reale Geräte, geeigneter Betreiber und geprüfter Übergabeablauf.
