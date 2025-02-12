import React from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid,
  LinearProgress,
  Tooltip,
  IconButton,
  Stack
} from '@mui/material';
import {
  TrendingUp,
  People,
  Euro,
  Agriculture,
  WaterDrop,
  WarningAmber,
  Info
} from '@mui/icons-material';

const ImpactIndicator = ({ label, value, icon: Icon, color, tooltip }) => (
  <Box sx={{ mb: 2 }}>
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
    </Stack>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: `${color}22`,
            '& .MuiLinearProgress-bar': {
              backgroundColor: color,
            },
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{value}%</Typography>
      </Box>
    </Box>
  </Box>
);

const EconomicImpact = ({ data = {} }) => {
  const {
    economicGrowth = 0,
    populationAffected = 0,
    gdpImpact = 0,
    agriculturalLoss = 0,
    waterScarcity = 0,
    disasterRisk = 0
  } = data;

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 3 }}>
        Wirtschaftliche & Soziale Auswirkungen
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ImpactIndicator
            label="Wirtschaftswachstum-Einfluss"
            value={economicGrowth}
            icon={TrendingUp}
            color="#2196f3"
            tooltip="Prognostizierte Auswirkung auf das jährliche Wirtschaftswachstum"
          />
          
          <ImpactIndicator
            label="Betroffene Bevölkerung"
            value={populationAffected}
            icon={People}
            color="#9c27b0"
            tooltip="Prozentsatz der Bevölkerung, der von Klimaauswirkungen betroffen ist"
          />
          
          <ImpactIndicator
            label="BIP-Auswirkung"
            value={gdpImpact}
            icon={Euro}
            color="#4caf50"
            tooltip="Geschätzter Einfluss auf das Bruttoinlandsprodukt"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ImpactIndicator
            label="Landwirtschaftliche Verluste"
            value={agriculturalLoss}
            icon={Agriculture}
            color="#ff9800"
            tooltip="Prognostizierte Ernteverluste und Auswirkungen auf die Landwirtschaft"
          />
          
          <ImpactIndicator
            label="Wasserknappheit"
            value={waterScarcity}
            icon={WaterDrop}
            color="#00bcd4"
            tooltip="Risiko von Wasserknappheit in betroffenen Regionen"
          />
          
          <ImpactIndicator
            label="Katastrophenrisiko"
            value={disasterRisk}
            icon={WarningAmber}
            color="#f44336"
            tooltip="Wahrscheinlichkeit von klimabedingten Naturkatastrophen"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EconomicImpact;
