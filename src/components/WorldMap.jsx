import React, { memo, useRef, useEffect } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { Box, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Farbskala für Temperaturänderungen
const getTemperatureColor = (value, theme) => {
  if (value >= 4) return theme.palette.error.main;
  if (value >= 3) return theme.palette.warning.main;
  if (value >= 2) return theme.palette.warning.light;
  if (value >= 1) return theme.palette.success.light;
  return theme.palette.success.main;
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
        bgcolor: theme.palette.background.default,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        '& path': {
          transition: 'all 0.3s ease',
          outline: 'none',
        }
      }}
    >
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147
        }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent'
        }}
      >
        <ZoomableGroup center={[0, 0]} zoom={1}>
          <Geographies geography="/world-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={alpha(theme.palette.primary.main, 0.1)}
                  stroke={alpha(theme.palette.primary.main, 0.3)}
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: 'none',
                    },
                    hover: {
                      fill: alpha(theme.palette.primary.main, 0.2),
                      outline: 'none',
                      cursor: 'pointer'
                    },
                    pressed: {
                      fill: alpha(theme.palette.primary.main, 0.3),
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
                  fill={getTemperatureColor(value, theme)}
                  stroke={theme.palette.background.paper}
                  strokeWidth={2}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: `drop-shadow(0 0 4px ${alpha(getTemperatureColor(value, theme), 0.5)})`
                  }}
                />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{
                    fontFamily: theme.typography.fontFamily,
                    fill: theme.palette.text.primary,
                    fontSize: '8px',
                    fontWeight: 500,
                    filter: `drop-shadow(0 1px 2px ${alpha(theme.palette.common.black, 0.5)})`
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
