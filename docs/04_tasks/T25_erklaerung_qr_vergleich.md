# T25 · Erklärung, QR Übergabe, Live Vergleich (erledigt durch Claude)
**Status:** erledigt am 4. Okt, 00:40

* **Wörter hinter dem Vorschlag:** Jede Karte zeigt die 1 bis 3 Wörter mit dem größten Anteil am Modellscore (exakte Zerlegung des linearen Scores, keine Schätzung). Hervorgehoben in der Textstelle.
* **Messung:** „Analysed on this device in X ms · no network used“ im Prüfschritt.
* **QR Übergabe ohne Netz:** nach Prüfung und Einwilligung „Show QR for handover“. Die Klinik scannt mit irgendeiner Handykamera und bekommt den Entwurf als Text (getestet: QR wird dekodiert, 730 Zeichen). Bibliothek: QR Code Generator von Kazuhiko Arase, MIT, liegt lokal in app/vendor.
* **About Tab:** Ablauf in 4 Schritten und Live Vergleich „small model vs keyword list“ mit eigenen Eingaben.
* **Offline Anzeige:** Bei fehlender Verbindung zeigt die Kopfzeile „✈ No connection, all works“.
* Clips und Screenshots neu erzeugt (`demo_compare_1080p.mp4` neu).
