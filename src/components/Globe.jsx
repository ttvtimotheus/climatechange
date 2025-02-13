import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Topojson data for world countries
const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries-sans-antarctica.json";

const GlobeComponent = ({ 
  data = [], 
  year,
  width = '100%',
  height = '600px'
}) => {
  const globeRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    if (globeRef.current) {
      // Auto-rotate
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  return (
    <Box sx={{ 
      width, 
      height,
      '& > div': {
        borderRadius: 2,
      }
    }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        pointsData={data}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={d => d.value * 0.1}
        pointRadius={0.5}
        pointColor={() => theme.palette.primary.main}
        pointLabel={d => `${d.label}: ${d.value.toFixed(1)}°C`}
        atmosphereColor={theme.palette.primary.main}
        atmosphereAltitude={0.15}
        width={width}
        height={height}
      />
    </Box>
  );
};

export default GlobeComponent;
