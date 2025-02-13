import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayerGroup, Circle, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { ThreeDRotation, Map as MapIcon } from '@mui/icons-material';
import Globe from './Globe';
import { generateGlobeData } from '../services/globeService';

const getRiskColor = (risk) => {
  return risk > 75 ? '#d73027' :
         risk > 50 ? '#fc8d59' :
         risk > 25 ? '#fee08b' :
                    '#91cf60';
};

const Map = ({ 
  climateData = {},
  selectedYear = 2025,
  riskLevels = { drought: 0, flooding: 0, fires: 0, storms: 0 }
}) => {
  const [cities, setCities] = useState([
    { name: 'Berlin', coords: [52.5200, 13.4050], population: 3.7 },
    { name: 'Hamburg', coords: [53.5511, 9.9937], population: 1.8 },
    { name: 'München', coords: [48.1351, 11.5820], population: 1.5 },
    { name: 'Köln', coords: [50.9375, 6.9603], population: 1.1 },
    { name: 'Frankfurt', coords: [50.1109, 8.6821], population: 0.75 },
  ]);

  // Simulierte Überflutungszonen (vereinfacht)
  const floodZones = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { risk: 'high' },
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [8.6821, 53.5511],
            [9.9937, 53.5511],
            [9.9937, 54.0000],
            [8.6821, 54.0000],
            [8.6821, 53.5511]
          ]]
        }
      }
    ]
  };

  const [viewMode, setViewMode] = useState('3D');
  
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const globeData = generateGlobeData('moderate', selectedYear);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '600px' }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewModeChange}
          aria-label="view mode"
          size="small"
          sx={{ bgcolor: 'background.paper', boxShadow: 2 }}
        >
          <ToggleButton value="3D" aria-label="3D view">
            <Tooltip title="3D Globe View">
              <ThreeDRotation />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="2D" aria-label="2D view">
            <Tooltip title="2D Map View">
              <MapIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ width: '100%', height: '100%' }}>
        {viewMode === '3D' ? (
          <Globe
            data={globeData}
            year={selectedYear}
            width="100%"
            height="600px"
          />
        ) : (
          <MapContainer
            center={[51.1657, 10.4515]}
            zoom={6}
            style={{ height: '100%', width: '100%', borderRadius: '12px' }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Risiko-Overlays für Städte */}
            <LayerGroup>
              {cities.map((city) => (
                <Circle
                  key={city.name}
                  center={city.coords}
                  radius={city.population * 10000}
                  pathOptions={{
                    color: getRiskColor(riskLevels.drought),
                    fillColor: getRiskColor(riskLevels.drought),
                    fillOpacity: 0.4
                  }}
                >
                  <Popup>
                    <div style={{ padding: '10px' }}>
                      <h3 style={{ margin: '0 0 10px 0' }}>{city.name}</h3>
                      <p style={{ margin: '5px 0' }}>Bevölkerung: {city.population}M</p>
                      <p style={{ margin: '5px 0' }}>Risiko-Level:</p>
                      <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>Dürre: {riskLevels.drought}%</li>
                        <li>Überflutung: {riskLevels.flooding}%</li>
                        <li>Waldbrände: {riskLevels.fires}%</li>
                        <li>Stürme: {riskLevels.storms}%</li>
                      </ul>
                    </div>
                  </Popup>
                </Circle>
              ))}
            </LayerGroup>

            {/* Überflutungszonen */}
            <GeoJSON
              data={floodZones}
              style={() => ({
                color: '#1a237e',
                weight: 1,
                fillColor: '#3949ab',
                fillOpacity: 0.3
              })}
            />
          </MapContainer>
        )}
      </Box>
    </Box>
  );
};

export default Map;
