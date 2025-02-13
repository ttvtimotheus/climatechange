import React, { useEffect, useRef, useState } from 'react';
import GlobeGL from 'globe.gl';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Globe = ({ 
  data, 
  year, 
  onGlobeReady,
  width = '100%',
  height = '600px'
}) => {
  const globeRef = useRef();
  const containerRef = useRef();
  const theme = useTheme();
  const [isGlobeReady, setIsGlobeReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const globe = GlobeGL()(containerRef.current)
      .backgroundColor('rgba(0,0,0,0)')
      .width(containerRef.current.clientWidth)
      .height(parseInt(height))
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .atmosphereColor(theme.palette.primary.main)
      .atmosphereAltitude(0.15)
      .onGlobeReady(() => {
        setIsGlobeReady(true);
        if (onGlobeReady) onGlobeReady();
      });

    globeRef.current = globe;

    // Handle window resize
    const handleResize = () => {
      globe.width(containerRef.current.clientWidth);
    };
    window.addEventListener('resize', handleResize);

    // Auto-rotate
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [height, onGlobeReady, theme.palette.primary.main]);

  // Update data points when data or year changes
  useEffect(() => {
    if (!globeRef.current || !isGlobeReady || !data) return;

    const points = data.map(point => ({
      lat: point.lat,
      lng: point.lng,
      size: point.value * 0.5,
      color: theme.palette.primary.main,
      label: `${point.label}: ${point.value.toFixed(1)}°C`
    }));

    globeRef.current
      .pointsData(points)
      .pointAltitude('size')
      .pointColor('color')
      .pointLabel('label')
      .pointRadius(0.5)
      .pointResolution(32);
  }, [data, year, isGlobeReady, theme.palette.primary.main]);

  return (
    <Box 
      ref={containerRef} 
      sx={{ 
        width, 
        height,
        '& > canvas': {
          borderRadius: 2,
        }
      }} 
    />
  );
};

export default Globe;
