import React, { memo, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';
import { Box, Tooltip, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Temperature color scale - more gradual gradient
const getTemperatureColor = (value) => {
  if (value >= 4) return '#DC2626'; // red-600
  if (value >= 3) return '#EA580C'; // orange-600
  if (value >= 2) return '#F59E0B'; // amber-500
  if (value >= 1) return '#84CC16'; // lime-500
  return '#22C55E'; // green-500
};

const WorldMap = ({ 
  data = [], 
  year,
  width = '100%',
  height = '100%'
}) => {
  const theme = useTheme();
  const mapRef = useRef();

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

          {data.map(({ lat, lng, value, label }) => {
            const color = getTemperatureColor(value);
            const size = Math.max(5, Math.min(value * 2.5 + 4, 14));
            
            return (
              <Marker key={label} coordinates={[lng, lat]}>
                <Tooltip 
                  title={`${label}: +${value.toFixed(1)}°C`}
                  arrow
                  placement="top"
                >
                  <g style={{ cursor: 'pointer' }}>
                    {/* Outer glow */}
                    <circle
                      r={size + 3}
                      fill={alpha(color, 0.2)}
                      style={{ transition: 'all 0.3s ease' }}
                    />
                    {/* Main circle */}
                    <circle
                      r={size}
                      fill={color}
                      stroke={theme.palette.background.paper}
                      strokeWidth={1.5}
                      style={{
                        transition: 'all 0.3s ease',
                        filter: `drop-shadow(0 2px 4px ${alpha(color, 0.4)})`
                      }}
                    />
                    {/* Label */}
                    <text
                      textAnchor="middle"
                      y={-size - 6}
                      style={{
                        fontFamily: theme.typography.fontFamily,
                        fill: theme.palette.text.primary,
                        fontSize: '9px',
                        fontWeight: 600,
                        filter: `drop-shadow(0 1px 2px ${alpha('#000', 0.7)})`
                      }}
                    >
                      {label}
                    </text>
                  </g>
                </Tooltip>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </Box>
  );
};

export default memo(WorldMap);
