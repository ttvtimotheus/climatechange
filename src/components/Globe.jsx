import React, { useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Farbskala für Temperaturänderungen
const getTemperatureColor = (value) => {
  if (value >= 4) return '#d73027'; // Rot - Sehr hoch
  if (value >= 3) return '#fc8d59'; // Orange - Hoch
  if (value >= 2) return '#fee08b'; // Gelb - Mittel
  if (value >= 1) return '#d9ef8b'; // Hellgrün - Niedrig
  return '#91cf60'; // Grün - Sehr niedrig
};

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
      
      // Optimale Startposition
      globeRef.current.pointOfView({ lat: 40, lng: 0, altitude: 2.5 });
    }
  }, []);

  // Bereite HTML für Popup vor
  const getTooltipContent = ({ label, value, lat, lng }) => {
    const region = lat > 0 ? 'Nördliche' : 'Südliche';
    const severity = value >= 4 ? 'Extrem hoch' :
                    value >= 3 ? 'Sehr hoch' :
                    value >= 2 ? 'Hoch' :
                    value >= 1 ? 'Moderat' :
                    'Niedrig';

    return `
      <div style="
        font-family: Arial, sans-serif;
        background: ${theme.palette.background.paper};
        color: ${theme.palette.text.primary};
        padding: 10px;
        border-radius: 4px;
        min-width: 150px;
      ">
        <div style="font-weight: bold; margin-bottom: 5px;">
          ${label}
        </div>
        <div style="color: ${theme.palette.text.secondary}; font-size: 0.9em; margin-bottom: 5px;">
          ${region} Hemisphäre
        </div>
        <div style="margin-bottom: 5px;">
          Temperaturänderung: <span style="color: ${getTemperatureColor(value)}; font-weight: bold;">
            ${value.toFixed(1)}°C
          </span>
        </div>
        <div style="font-size: 0.9em; color: ${theme.palette.text.secondary};">
          Risiko-Level: ${severity}
        </div>
      </div>
    `;
  };

  // Optimiere Punkt-Darstellung
  const pointsData = useMemo(() => {
    return data.map(point => ({
      ...point,
      size: Math.max(0.5, Math.min(point.value, 5)) * 0.5,
      color: getTemperatureColor(point.value)
    }));
  }, [data]);

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
        pointsData={pointsData}
        pointLat="lat"
        pointLng="lng"
        pointAltitude={d => d.size * 0.1}
        pointRadius="size"
        pointColor="color"
        pointLabel={getTooltipContent}
        atmosphereColor={theme.palette.primary.main}
        atmosphereAltitude={0.15}
        width={width}
        height={height}
      />
    </Box>
  );
};

export default GlobeComponent;
