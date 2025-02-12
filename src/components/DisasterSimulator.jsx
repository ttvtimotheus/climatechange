import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Whatshot,
  WaterDrop,
  Storm,
  Grass,
  Warning,
  Info
} from '@mui/icons-material';

const DisasterCard = ({ 
  title, 
  probability, 
  severity, 
  icon: Icon, 
  color,
  description,
  affectedRegions
}) => (
  <Card 
    elevation={0} 
    sx={{ 
      bgcolor: 'background.default',
      height: '100%',
      position: 'relative',
      overflow: 'visible'
    }}
  >
    <CardContent>
      <Box 
        sx={{ 
          position: 'absolute',
          top: -20,
          left: 16,
          bgcolor: color,
          borderRadius: '50%',
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Icon sx={{ color: 'white' }} />
      </Box>

      <Box sx={{ ml: 5, mt: 1 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Wahrscheinlichkeit
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={probability}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: `${color}22`,
                '& .MuiLinearProgress-bar': {
                  bgcolor: color
                }
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {probability}%
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Schweregrad
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={severity}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: `${color}22`,
                '& .MuiLinearProgress-bar': {
                  bgcolor: color
                }
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {severity}%
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Betroffene Regionen:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {affectedRegions.map((region, index) => (
                <Chip 
                  key={index}
                  label={region}
                  size="small"
                  sx={{ 
                    bgcolor: `${color}22`,
                    color: color,
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </CardContent>
  </Card>
);

const DisasterSimulator = ({ temperature, year }) => {
  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    // Berechne Katastrophenwahrscheinlichkeiten basierend auf Temperatur
    const calculateDisasters = () => [
      {
        title: 'Hitzewellen',
        probability: Math.min(100, Math.round(temperature * 20)),
        severity: Math.min(100, Math.round(temperature * 15)),
        icon: Whatshot,
        color: '#f44336',
        description: 'Längere und intensivere Hitzewellen mit Temperaturen über 40°C',
        affectedRegions: ['Süddeutschland', 'Rheinland', 'Brandenburg']
      },
      {
        title: 'Überflutungen',
        probability: Math.min(100, Math.round(temperature * 15)),
        severity: Math.min(100, Math.round(temperature * 18)),
        icon: WaterDrop,
        color: '#2196f3',
        description: 'Starkregen und Flusshochwasser mit erhöhtem Überschwemmungsrisiko',
        affectedRegions: ['Norddeutschland', 'Rheinland', 'Alpenvorland']
      },
      {
        title: 'Stürme',
        probability: Math.min(100, Math.round(temperature * 12)),
        severity: Math.min(100, Math.round(temperature * 16)),
        icon: Storm,
        color: '#ff9800',
        description: 'Zunehmende Häufigkeit und Intensität von Stürmen und Orkanen',
        affectedRegions: ['Küstenregionen', 'Norddeutsche Tiefebene']
      },
      {
        title: 'Dürren',
        probability: Math.min(100, Math.round(temperature * 18)),
        severity: Math.min(100, Math.round(temperature * 20)),
        icon: Grass,
        color: '#795548',
        description: 'Langanhaltende Trockenperioden mit Auswirkungen auf Landwirtschaft',
        affectedRegions: ['Ostdeutschland', 'Brandenburg', 'Sachsen-Anhalt']
      }
    ];

    setDisasters(calculateDisasters());
  }, [temperature]);

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Naturkatastrophen-Prognose
        </Typography>
        <Typography variant="body2" color="text.secondary">
          für {year}
        </Typography>
        <Tooltip title="Prognose basierend auf aktuellen Klimamodellen und historischen Daten">
          <IconButton size="small">
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {disasters.map((disaster, index) => (
          <Grid item xs={12} md={6} key={index}>
            <DisasterCard {...disaster} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default DisasterSimulator;
