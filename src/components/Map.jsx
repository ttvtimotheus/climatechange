import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  IconButton, 
  Slider,
  ButtonGroup,
  Button,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  PlayArrow, 
  Pause,
  TrendingUp,
  TrendingDown,
  Timeline,
  Menu as MenuIcon
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isStatsOpen, setIsStatsOpen] = useState(!isMobile);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(selectedYear);
  const [scenario, setScenario] = useState('moderate');
  const [globeData, setGlobeData] = useState([]);

  const updateGlobeData = useCallback((year, currentScenario) => {
    const data = generateGlobeData(currentScenario, year);
    setGlobeData(data);
  }, []);

  useEffect(() => {
    setCurrentYear(selectedYear);
    updateGlobeData(selectedYear, scenario);
  }, [selectedYear, updateGlobeData, scenario]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentYear(prev => {
          const next = prev + 1;
          if (next > YEAR_MAX) {
            setIsPlaying(false);
            return YEAR_MIN;
          }
          return next;
        });
      }, ANIMATION_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

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

  const toggleStats = () => {
    setIsStatsOpen(prev => !prev);
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh',
      bgcolor: theme.palette.background.default,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header mit Szenario-Auswahl */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        {isMobile && (
          <IconButton onClick={toggleStats} color="primary">
            <MenuIcon />
          </IconButton>
        )}
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

      {/* Hauptbereich mit Karte und Statistiken */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* RegionalStats Sidebar */}
        <Box sx={{ 
          width: 300,
          height: '100%',
          position: isMobile ? 'absolute' : 'relative',
          left: 0,
          top: 0,
          transform: isStatsOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          overflowY: 'auto'
        }}>
          <RegionalStats data={globeData} year={currentYear} />
        </Box>

        {/* Karte */}
        <Box sx={{ 
          flex: 1,
          height: '100%',
          position: 'relative'
        }}>
          <WorldMap
            data={globeData}
            year={currentYear}
          />
        </Box>
      </Box>

      {/* Zeitleiste */}
      <Box sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <IconButton 
          onClick={handlePlayPause} 
          color="primary"
          sx={{ 
            bgcolor: 'action.hover',
            '&:hover': {
              bgcolor: 'action.selected'
            }
          }}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <Slider
          value={currentYear}
          min={YEAR_MIN}
          max={YEAR_MAX}
          onChange={handleSliderChange}
          valueLabelDisplay="on"
          valueLabelFormat={value => `${value}`}
          sx={{ 
            flex: 1,
            '& .MuiSlider-valueLabel': {
              bgcolor: 'primary.main'
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default Map;
