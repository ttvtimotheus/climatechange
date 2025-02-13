import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const GlobeComponent = ({ 
  data = [], 
  year,
  width = '100%',
  height = '600px'
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      width, 
      height,
      '& > svg': {
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper
      }
    }}>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => (
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
            <circle
              r={Math.max(4, value * 2)}
              fill={theme.palette.primary.main}
              fillOpacity={0.7}
              stroke={theme.palette.primary.dark}
              strokeWidth={1}
            />
          </Marker>
        ))}
      </ComposableMap>
    </Box>
  );
};

export default GlobeComponent;
