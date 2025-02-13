import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, LayerGroup, Circle, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip, IconButton, Slider, ButtonGroup, Button } from '@mui/material';
import { ThreeDRotation, Map as MapIcon, PlayArrow, Pause, TrendingUp, TrendingDown, Timeline } from '@mui/icons-material';
import GlobeComponent from './Globe';
import { generateGlobeData } from '../services/globeService';

const getRiskColor = (risk) => {
  return risk > 75 ? '#d73027' :
         risk > 50 ? '#fc8d59' :
         risk > 25 ? '#fee08b' :
                    '#91cf60';
};

const YEAR_MIN = 2025;
const YEAR_MAX = 2100;
const ANIMATION_INTERVAL = 500; // milliseconds

const SCENARIOS = {
  optimistic: {
    label: 'Optimistisch',
    icon: <TrendingDown />,
    description: 'Paris-Ziele werden erreicht'
  },
  moderate: {
    label: 'Moderat',
    icon: <Timeline />,
    description: 'Teilweise Emissionsreduktion'
  },
  pessimistic: {
    label: 'Pessimistisch',
    icon: <TrendingUp />,
    description: 'Weiter wie bisher'
  }
};

const Map = ({ 
  climateData = {},
  selectedYear = 2025,
  riskLevels = { drought: 0, flooding: 0, fires: 0, storms: 0 },
  onYearChange
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(selectedYear);
  const [scenario, setScenario] = useState('moderate');
  const [globeData, setGlobeData] = useState([]);
  
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const updateGlobeData = useCallback((year, currentScenario) => {
    const data = generateGlobeData(currentScenario, year);
    setGlobeData(data);
  }, []);

  // Handle year changes
  useEffect(() => {
    setCurrentYear(selectedYear);
    updateGlobeData(selectedYear, scenario);
  }, [selectedYear, updateGlobeData, scenario]);

  // Animation effect
  useEffect(() => {
    let animationFrame;
    
    const animate = () => {
      if (isPlaying) {
        setCurrentYear(prev => {
          const next = prev + 1;
          if (next > YEAR_MAX) {
            setIsPlaying(false);
            return YEAR_MIN;
          }
          return next;
        });
      }
    };

    if (isPlaying) {
      const interval = setInterval(animate, ANIMATION_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Update data when year changes during animation
  useEffect(() => {
    updateGlobeData(currentYear, scenario);
    if (onYearChange) {
      onYearChange(currentYear);
    }
  }, [currentYear, updateGlobeData, onYearChange, scenario]);

  const handleSliderChange = (event, newValue) => {
    setCurrentYear(newValue);
  };

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '600px' }}>
      {/* View Mode Toggle */}
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

      {/* Scenario Selector */}
      <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1000 }}>
        <ButtonGroup 
          variant="contained" 
          size="small"
          sx={{ 
            bgcolor: 'background.paper', 
            boxShadow: 2,
            '& .MuiButton-root': {
              textTransform: 'none'
            }
          }}
        >
          {Object.entries(SCENARIOS).map(([key, { label, icon, description }]) => (
            <Button
              key={key}
              onClick={() => handleScenarioChange(key)}
              variant={scenario === key ? 'contained' : 'outlined'}
              startIcon={icon}
              sx={{
                bgcolor: scenario === key ? 'primary.main' : 'background.paper'
              }}
            >
              <Tooltip title={description}>
                <span>{label}</span>
              </Tooltip>
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Globe/Map View */}
      <Box sx={{ width: '100%', height: '100%' }}>
        {viewMode === '3D' ? (
          <GlobeComponent
            data={globeData}
            year={currentYear}
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

      {/* Time Controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 2,
          boxShadow: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <IconButton onClick={handlePlayPause} color="primary">
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <Slider
          value={currentYear}
          min={YEAR_MIN}
          max={YEAR_MAX}
          onChange={handleSliderChange}
          valueLabelDisplay="on"
          valueLabelFormat={value => `${value}`}
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </Box>
  );
};

export default Map;
