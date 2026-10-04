# UI Referenzen aus Peters eigenen Trainern

Quellen: „Straßburg Gutschein“ (index.html, mit interaktiver Karte) und „Managing Digital Media · Exam Trainer“. Übernommen wurden nur Layout und Bedienmuster, keine Inhalte und kein Look.

| Muster in der Referenz | Umsetzung in AfyaNote |
|---|---|
| Untere Tab Leiste (Start, Karte, Plan, Mehr) | 3 Tabs: Visit, Facilities, About |
| Seitenleiste mit Fortschrittsring und Kapiteln (Desktop) | Ab 960 px Seitenleiste mit Ring, Navigation und den 4 Schritten |
| Hero Karte mit Hauptaktion und Kacheln darunter | Hero mit Notizfeld und Beispielen, 4 Kacheln (offline, Modellgröße, Begriffe, 0 B gesendet) |
| Fortschrittsbalken „0 von 12 geöffnet“ | „x / n checked“ im Prüfschritt |
| Große Antwortzeilen im Quiz | Status als große Auswahl Chips (Stated, Denied, Other person, Past), Bestätigen und Ablehnen als zwei große Knöpfe |
| Karte mit Pins, Suche, Filter Chips, Detail Panel | Offline Schema Karte der Einrichtungen (Ringe 2/5/10/15 km), Suche, Filter, Liste nach Entfernung, Detail Blatt mit „Use as link facility“ |
| MDM Exam Trainer: Tastatur im Fast Quiz (1 bis 4 wählt, Enter weiter, Eingabefelder ausgenommen) | Prüfschritt am Desktop: 1 bis 4 setzt den Status, Enter bestätigt, X lehnt ab, Pfeile wechseln die Karte. Aktuelle Karte blau umrandet |
| MDM Exam Trainer: breites Dashboard, Inhalt in zwei Spalten | Ab 1200 px Prüfschritt zweispaltig: Notiz bleibt links stehen, Karten rechts |
| MDM Exam Trainer: visibilitychange und beforeunload (Lernzeit) | Anderer Zweck: Inhalt wird unscharf, wenn die App im Hintergrund ist, und Warnung vor dem Schließen eines offenen Falls |
| Sofortiges Feedback nach jeder Antwort | Live Vorschau beim Tippen (nichts übernommen) und Notiz Markierung grün / durchgestrichen je Entscheidung |

## Bewusst anders
* Kein Leaflet und keine Kartenkacheln aus dem Netz: alles muss offline laufen. Die Karte ist eine schematische SVG aus Koordinaten.
* Heller Grundton für Nutzung draußen, Dunkelmodus folgt dem System.
* Keine Musik, keine Animationen, keine Emoji Navigation.
