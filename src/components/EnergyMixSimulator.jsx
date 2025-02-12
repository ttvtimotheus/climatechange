import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Slider,
  Box,
  Grid,
  Tooltip,
  IconButton,
  Stack
} from '@mui/material';
import {
  WbSunny,
  Air,
  Water,
  LocalFireDepartment,
  Power,
  Info
} from '@mui/icons-material';

const EnergySource = ({ 
  icon: Icon, 
  label, 
  value, 
  onChange, 
  color,
  tooltip,
  disabled = false
}) => (
  <Box sx={{ mb: 3 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
      <Icon sx={{ color }} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Tooltip title={tooltip}>
        <IconButton size="small">
          <Info fontSize="small" />
        </IconButton>
      </Tooltip>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ ml: 'auto' }}
      >
        {value}%
      </Typography>
    </Stack>
    <Slider
      value={value}
      onChange={onChange}
      disabled={disabled}
      sx={{
        color: color,
        '& .MuiSlider-thumb': {
          height: 24,
          width: 24,
          backgroundColor: '#fff',
          border: '2px solid currentColor',
          '&:hover': {
            boxShadow: '0 0 0 8px ${color}22',
          },
        },
      }}
    />
  </Box>
);

const EnergyMixSimulator = ({ onEnergyMixChange }) => {
  const [energyMix, setEnergyMix] = useState({
    solar: 20,
    wind: 20,
    hydro: 10,
    nuclear: 20,
    fossil: 30
  });

  const handleEnergyChange = (source) => (event, newValue) => {
    const oldValue = energyMix[source];
    const difference = newValue - oldValue;
    
    // Berechne die Anpassung für die anderen Quellen
    const remainingSources = Object.keys(energyMix).filter(key => key !== source);
    const totalRemaining = remainingSources.reduce((sum, key) => sum + energyMix[key], 0);
    
    const newMix = { ...energyMix };
    newMix[source] = newValue;
    
    // Verteile die Differenz proportional auf die anderen Quellen
    remainingSources.forEach(key => {
      const proportion = energyMix[key] / totalRemaining;
      newMix[key] = Math.max(0, energyMix[key] - (difference * proportion));
    });
    
    // Runde die Werte
    Object.keys(newMix).forEach(key => {
      newMix[key] = Math.round(newMix[key]);
    });
    
    setEnergyMix(newMix);
    onEnergyMixChange(newMix);
  };

  const calculateCO2Impact = () => {
    const co2Factors = {
      solar: 0.1,
      wind: 0.1,
      hydro: 0.2,
      nuclear: 0.5,
      fossil: 10
    };
    
    return Object.entries(energyMix).reduce((total, [source, percentage]) => {
      return total + (percentage * co2Factors[source]);
    }, 0);
  };

  const co2Impact = calculateCO2Impact();

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
        Energiemix-Simulator
      </Typography>

      <EnergySource
        icon={WbSunny}
        label="Solarenergie"
        value={energyMix.solar}
        onChange={handleEnergyChange('solar')}
        color="#ffd700"
        tooltip="Photovoltaik und Solarthermie"
      />

      <EnergySource
        icon={Air}
        label="Windenergie"
        value={energyMix.wind}
        onChange={handleEnergyChange('wind')}
        color="#81d4fa"
        tooltip="On- und Offshore Windkraft"
      />

      <EnergySource
        icon={Water}
        label="Wasserkraft"
        value={energyMix.hydro}
        onChange={handleEnergyChange('hydro')}
        color="#4fc3f7"
        tooltip="Wasserkraftwerke und Gezeitenkraft"
      />

      <EnergySource
        icon={Power}
        label="Kernenergie"
        value={energyMix.nuclear}
        onChange={handleEnergyChange('nuclear')}
        color="#9575cd"
        tooltip="Kernkraftwerke"
      />

      <EnergySource
        icon={LocalFireDepartment}
        label="Fossile Brennstoffe"
        value={energyMix.fossil}
        onChange={handleEnergyChange('fossil')}
        color="#ff7043"
        tooltip="Kohle, Öl und Erdgas"
      />

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          CO₂-Auswirkung des aktuellen Energiemix:
        </Typography>
        <Box sx={{ 
          width: '100%', 
          height: 8, 
          bgcolor: '#e0e0e0', 
          borderRadius: 4,
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            width: `${Math.min(100, (co2Impact / 8) * 100)}%`,
            height: '100%',
            bgcolor: co2Impact > 4 ? '#f44336' : co2Impact > 2 ? '#ff9800' : '#4caf50',
            transition: 'width 0.3s ease-in-out, background-color 0.3s ease-in-out'
          }} />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {co2Impact.toFixed(1)} CO₂-Äquivalent-Einheiten
        </Typography>
      </Box>
    </Paper>
  );
};

export default EnergyMixSimulator;
