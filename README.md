# Klimawandel-Visualisierung

Eine interaktive Webanwendung zur Visualisierung von Klimawandelszenarien und deren Auswirkungen auf verschiedene Regionen der Welt.

## Features

- **Interaktive Weltkarte**
  - Visualisierung von Temperaturänderungen durch farbcodierte Marker
  - Zoom- und Pan-Funktionalität
  - Tooltips mit detaillierten Informationen

- **Szenario-Auswahl**
  - Optimistisch: Paris-Ziele werden erreicht (~1.5°C bis 2100)
  - Moderat: Teilweise Emissionsreduktion (~2.6°C bis 2100)
  - Pessimistisch: Business as usual (~4.1°C bis 2100)

- **Zeitliche Entwicklung**
  - Zeitleiste von 2025 bis 2100
  - Animation der Temperaturentwicklung
  - Play/Pause-Funktion für automatische Zeitfortschreitung

- **Regionale Statistiken**
  - Detaillierte Ansicht der Auswirkungen nach Regionen
  - Durchschnittliche Temperaturänderungen
  - Risikobewertung für verschiedene Gebiete

## Technologien

- React + Vite
- Material-UI für das UI-Framework
- React Simple Maps für die Kartendarstellung
- D3-Geo für geografische Berechnungen
- Chart.js für Datenvisualisierungen

## Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/ttvtimotheus/climatechange.git
   cd climatechange
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   ```

3. Entwicklungsserver starten:
   ```bash
   npm run dev
   ```

## Entwicklung

- `src/components/`: React-Komponenten
  - `Map.jsx`: Hauptkomponente mit Kartenintegration
  - `WorldMap.jsx`: 2D-Weltkarte mit react-simple-maps
  - `RegionalStats.jsx`: Seitenleiste mit regionalen Statistiken

- `src/services/`: Geschäftslogik
  - `globeService.js`: Generierung und Verarbeitung der Klimadaten

- `src/theme/`: Material-UI Theming und Styling

## Datenquellen

Die Temperaturprojektionen basieren auf verschiedenen Klimaszenarien:
- Optimistisch: Entspricht dem RCP2.6 Szenario
- Moderat: Entspricht dem RCP4.5 Szenario
- Pessimistisch: Entspricht dem RCP8.5 Szenario

## Lizenz

MIT

## Contact 📧
Timo Haseloff - [Mail](mailto:info@t-haseloff.de)

## Project Link 🔗

[https://github.com/ttvtimotheus/climatechange](https://github.com/ttvtimotheus/climatechange)
