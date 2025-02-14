import React, { memo, useRef, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Farbskala für Temperaturänderungen
const getTemperatureColor = (value) => {
  if (value >= 4) return '#d73027'; // Rot - Sehr hoch
  if (value >= 3) return '#fc8d59'; // Orange - Hoch
  if (value >= 2) return '#fee08b'; // Gelb - Mittel
  if (value >= 1) return '#d9ef8b'; // Hellgrün - Niedrig
  return '#91cf60'; // Grün - Sehr niedrig
};

const WorldMap = ({ 
  data = [], 
  year,
  width = '100%',
  height = '100%'
}) => {
  const theme = useTheme();
  const mapRef = useRef();

  // Berechne optimale Kartengröße basierend auf Container
  useEffect(() => {
    if (mapRef.current) {
      const container = mapRef.current;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      // Hier könnten weitere Anpassungen erfolgen
    }
  }, []);

  return (
    <Box 
      ref={mapRef}
      sx={{ 
        width,
        height,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography="/world-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={theme.palette.background.default}
                  stroke={theme.palette.divider}
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: 'none'
                    },
                    hover: {
                      fill: theme.palette.action.hover,
                      outline: 'none'
                    },
                    pressed: {
                      outline: 'none'
                    }
                  }}
                />
              ))
            }
          </Geographies>

          {data.map(({ lat, lng, value, label }) => (
            <Marker key={label} coordinates={[lng, lat]}>
              <g transform="translate(-6, -6)">
                <circle
                  r={Math.max(4, Math.min(value * 2, 10))}
                  fill={getTemperatureColor(value)}
                  stroke={theme.palette.background.paper}
                  strokeWidth={2}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{
                    fontFamily: 'system-ui',
                    fill: theme.palette.text.primary,
                    fontSize: '8px'
                  }}
                >
                  {label}
                </text>
              </g>
              <title>{`${label}: ${value.toFixed(1)}°C`}</title>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </Box>
  );
};

export default memo(WorldMap);
