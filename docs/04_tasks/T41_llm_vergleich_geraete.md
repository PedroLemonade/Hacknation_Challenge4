# T41 · LLM sauber vergleichen und Nutzbarkeit entscheiden

Autor: ChatGPT / Codex. Gemma-Zugang und physisches Gerät ggf. Peter.

```text
Lies aktuellen Trainingsreview und alle Runmanifeste. Bevor weitere Parameter anhand des 48er-Devstands gewählt werden, friere einen neuen, fachlich/sprachlich geprüften Test mit unabhängigen Formulierungen ein. Keine Generatorfamilie/kanonische Notiz darf im Training oder Dev vorkommen; Test-Hash/Erstellungsprozess festhalten. Auf gleichem Rechner und identischen Prompt-/Decoderbedingungen vergleichen: Basismodell, trainierter Adapter, bestehender Klassifikator, Stichwortliste und kontrolliertes JSON-Decoding als eigene Variante. Schema-, Begriffs-, Status-, Dauer-, falsche-positive-, Abstention- und komplette-Notizmetriken samt Rohantworten veröffentlichen, alle Fehler im Nenner. Nach Review neue Trainingsruns mit festen Seeds, Lernraten/Batchgrößen und Checkpointwahl nur nach Dev. Originaldata/notes_test hat fünf Notizkollisionen mit dem neuen SFT-Trainingssplit und ist kein unabhängiger LLM-Test. Gemma erst mit von Peter erfülltem Herstellerzugang separat messen; keine alternative Quelle nutzen, um Zugangsvoraussetzungen zu umgehen. Browser- oder Ollama-Konvertierung als separate Schnittstellenarbeit prüfen. Reales Zielgerät: Ladezeit, Warm/Kalt-Laufzeit, Peak-RAM, Speicherbudget, Abbruch, Offline-Neustart und menschlicher Prüfschritt. Kein automatischer Produktwechsel wegen besserer synthetischer Zahlen; Entscheidung und Grenzen dokumentieren.
```

Fertig: unabhängiger Vergleich plus begründete Geräte-/Produktentscheidung. Ohne echte Telefonmessung bleibt der Adapter ein lokales Entwicklungsartefakt.
