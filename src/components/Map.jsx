import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  IconButton, 
  Slider,
  ButtonGroup,
  Button,
  Tooltip
} from '@mui/material';
import { 
  PlayArrow, 
  Pause,
  TrendingUp,
  TrendingDown,
  Timeline
} from '@mui/icons-material';
import WorldMap from './WorldMap';
import RegionalStats from './RegionalStats';
import { generateGlobeData } from '../services/globeService';

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

const Map = ({ selectedYear = 2025, onYearChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(selectedYear);
  const [scenario, setScenario] = useState('moderate');
  const [globeData, setGlobeData] = useState([]);

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

      {/* Main Content */}
      <Box sx={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        gap: 2
      }}>
        {/* Regional Stats */}
        <Box sx={{ 
          display: { xs: 'none', md: 'block' },
          height: '100%',
          overflowY: 'auto'
        }}>
          <RegionalStats data={globeData} year={currentYear} />
        </Box>

        {/* Map */}
        <Box sx={{ flexGrow: 1, height: '100%' }}>
          <WorldMap
            data={globeData}
            year={currentYear}
            width="100%"
            height="600px"
          />
        </Box>
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
