import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, 
  IconButton, 
  Slider,
  ButtonGroup,
  Button,
  Tooltip,
  useTheme,
  useMediaQuery,
  Typography,
  Chip,
  alpha
} from '@mui/material';
import { 
  PlayArrow, 
  Pause,
  TrendingUp,
  TrendingDown,
  Timeline,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import WorldMap from './WorldMap';
import RegionalStats from './RegionalStats';
import { generateGlobeData } from '../services/globeService';
import { useLanguage } from '../contexts/LanguageContext';

const YEAR_MIN = 2025;
const YEAR_MAX = 2100;
const ANIMATION_INTERVAL = 300;

const SCENARIOS = {
  optimistic: {
    icon: <TrendingDown fontSize="small" />,
    color: '#10B981'
  },
  moderate: {
    icon: <Timeline fontSize="small" />,
    color: '#F59E0B'
  },
  pessimistic: {
    icon: <TrendingUp fontSize="small" />,
    color: '#EF4444'
  }
};

const Map = ({ 
  selectedYear = 2025, 
  selectedScenario = 'moderate',
  onYearChange,
  onScenarioChange 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentYear, setCurrentYear] = useState(selectedYear);
  const { t } = useLanguage();

  // Generate globe data based on scenario and year
  const globeData = useMemo(() => {
    return generateGlobeData(selectedScenario, currentYear);
  }, [selectedScenario, currentYear]);

  useEffect(() => {
    setCurrentYear(selectedYear);
  }, [selectedYear]);

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
    if (onYearChange && currentYear !== selectedYear) {
      onYearChange(currentYear);
    }
  }, [currentYear, onYearChange, selectedYear]);

  const handleSliderChange = (event, newValue) => {
    setCurrentYear(newValue);
  };

  const handlePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const handleScenarioChange = (newScenario) => {
    if (onScenarioChange) {
      onScenarioChange(newScenario);
    }
  };

  const toggleStats = () => {
    setIsStatsOpen(prev => !prev);
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      bgcolor: theme.palette.background.default,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Main area with map */}
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Regional Stats Sidebar */}
        <Box sx={{ 
          width: 280,
          height: '100%',
          position: 'absolute',
          left: 0,
          top: 0,
          transform: isStatsOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1000,
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          overflowY: 'auto',
          boxShadow: isStatsOpen ? 4 : 0
        }}>
          <RegionalStats data={globeData} year={currentYear} />
        </Box>

        {/* Toggle Stats Button */}
        <IconButton 
          onClick={toggleStats}
          size="small"
          sx={{
            position: 'absolute',
            left: isStatsOpen ? 280 : 0,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1001,
            bgcolor: 'background.paper',
            borderRadius: '0 8px 8px 0',
            boxShadow: 2,
            transition: 'left 0.3s ease',
            '&:hover': {
              bgcolor: 'action.hover',
            }
          }}
        >
          {isStatsOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>

        {/* Map */}
        <Box sx={{ 
          flex: 1,
          height: '100%',
          position: 'relative'
        }}>
          <WorldMap
            data={globeData}
            year={currentYear}
          />

          {/* Scenario Selection */}
          <Box sx={{ 
            position: 'absolute',
            top: 12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex',
            gap: 1
          }}>
            {Object.entries(SCENARIOS).map(([key, { icon, color }]) => (
              <Tooltip key={key} title={t(`scenarios.${key}.description`)}>
                <Chip
                  icon={icon}
                  label={t(`scenarios.${key}.label`)}
                  onClick={() => handleScenarioChange(key)}
                  size="small"
                  sx={{
                    bgcolor: selectedScenario === key 
                      ? alpha(color, 0.2)
                      : alpha(theme.palette.background.paper, 0.9),
                    color: selectedScenario === key ? color : 'text.primary',
                    border: 1,
                    borderColor: selectedScenario === key ? color : 'divider',
                    fontWeight: selectedScenario === key ? 600 : 400,
                    backdropFilter: 'blur(8px)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(color, 0.15),
                    },
                    '& .MuiChip-icon': {
                      color: selectedScenario === key ? color : 'text.secondary'
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Timeline */}
      <Box sx={{
        p: 1.5,
        px: 2,
        bgcolor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(8px)',
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <IconButton 
          onClick={handlePlayPause} 
          size="small"
          sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
        </IconButton>

        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
          {YEAR_MIN}
        </Typography>
        
        <Slider
          value={currentYear}
          min={YEAR_MIN}
          max={YEAR_MAX}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          sx={{ 
            flex: 1,
            '& .MuiSlider-thumb': {
              width: 14,
              height: 14,
            },
            '& .MuiSlider-track': {
              height: 4,
            },
            '& .MuiSlider-rail': {
              height: 4,
              opacity: 0.3
            }
          }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 35 }}>
          {YEAR_MAX}
        </Typography>
        
        <Chip 
          label={currentYear} 
          size="small" 
          color="primary"
          sx={{ fontWeight: 600, minWidth: 60 }}
        />
      </Box>
    </Box>
  );
};

export default Map;
