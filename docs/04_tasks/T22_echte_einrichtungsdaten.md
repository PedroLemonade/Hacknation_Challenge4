# T22 · Optional: echte Einrichtungsdaten statt Demo Liste
**Wo:** Codex (braucht Internet) · **Dauer:** 30 bis 45 Min · **Verbrauch:** Codex mittel · **Nur wenn alles Pflicht erledigt ist**

Warum: Echte Daten machen die Karte glaubwürdiger (Datengrundlage 15 %). Risiko: Lizenz, Datenqualität, Zeit.

## Prompt
```text
Read AGENTS.md. Optional task, do not touch the model or the rules.
Replace app/facilities.json with real public health facilities for ONE ward or sub county in Murang'a County, Kenya.
Sources in this order: Kenya Master Health Facility List (kmhfr.health.go.ke) public export, else healthsites.io (ODbL, attribution required).
Keep the same JSON format (origin, facilities[] with id, name, type, kephLevel, lat, lon). Map types to:
dispensary, health_centre, hospital_l4, hospital_l5. Keep at most 15 facilities within 15 km of the origin.
Set origin to a neutral point (ward centre), not a real community health unit, and name it "Demo origin (ward centre)".
Set "note" to the source, download date and licence. Add the source with licence to README (Data table).
Update the facilities hint text in app/i18n.js: "Public facility list (source, date). Straight line distance."
Bump VERSION in app/sw.js. Run python3 eval/e2e.py if Playwright is available. Do not commit.
```

## Fertig wenn
Karte zeigt echte Einrichtungen, Quelle und Lizenz im README, App läuft offline.
