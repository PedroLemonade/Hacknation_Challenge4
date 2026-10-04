# Passage-ID-SFT: selection_v01

Daten: Claude-Lexikon, Codex-Familiensplit; Repräsentation und Implementierung: ChatGPT/Codex. Basierend auf [family_v03](../20261004_family_v03/README.md), exakt dieselben 3.000/300 Notizen mit unveränderten Labels. [Ableitungsmanifest](manifest.json).

Eingabe: Originalnotiz in nummerierte Passagen zerlegen, jede Passage mit ihrem exakten Text. Ausgabe: `term`, `status`, `clause_id`, `duration_days`. Der Resolver prüft IDs, Felder, Duplikate und Typen und holt den Beleg aus der Originalnotiz. Danach gilt weiterhin der bestehende Guard, insbesondere für Dauer. Das verhindert erfundene Belegstrings durch Konstruktion, aber keine semantisch falsche Auswahl. Ein vorhandener Cough-Beleg kann weiterhin fälschlich als fever bezeichnet werden. Quellen-IDs bleiben in Rohantworten erhalten.

Alle Zielantworten lösen sich exakt in die bereits geprüften Originaltargets auf. [Audit](audit_guard_v2.json). Familien-/Notizsplit und Grenzen werden aus dem Quellstand übernommen. Es gibt keine zusätzliche Sprach-/Fachvalidierung und keine App-Anbindung. Semikolon, Punkt mit Leerzeichen/Ende und Zeilenwechsel sind begrenzte Trennmuster; keine allgemeine Satz-/Rollenanalyse. Wiederholte Zitate oder mehrdeutige Personen brauchen separate Auswahlpflicht.
