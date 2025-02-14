import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Tooltip,
  Card,
  alpha,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Regionen-Gruppierung
const REGIONS = {
  'Nordeuropa': ['Berlin', 'London', 'Moscow'],
  'Südeuropa': ['Paris', 'Madrid', 'Rom'],
  'Nordamerika': ['New York', 'Los Angeles', 'Toronto'],
  'Asien': ['Tokyo', 'Beijing', 'Seoul'],
  'Südliche Hemisphäre': ['Sydney', 'Rio', 'Cape Town']
};

const getTemperatureColor = (value, theme) => {
  if (value >= 4) return theme.palette.error.main;
  if (value >= 3) return theme.palette.warning.main;
  if (value >= 2) return theme.palette.warning.light;
  if (value >= 1) return theme.palette.success.light;
  return theme.palette.success.main;
};

const getRiskLevel = (value) => {
  if (value >= 4) return 'Extrem hoch';
  if (value >= 3) return 'Sehr hoch';
  if (value >= 2) return 'Hoch';
  if (value >= 1) return 'Moderat';
  return 'Niedrig';
};

const RegionalStats = ({ data = [], year }) => {
  const theme = useTheme();

  // Gruppiere Daten nach Regionen
  const regionalData = Object.entries(REGIONS).map(([region, cities]) => {
    const citiesData = data.filter(d => cities.includes(d.label));
    const avgTemperature = citiesData.reduce((sum, d) => sum + d.value, 0) / citiesData.length;
    
    return {
      region,
      avgTemperature,
      cities: citiesData,
      riskLevel: getRiskLevel(avgTemperature)
    };
  });

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        bgcolor: 'background.paper',
        borderRadius: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          Regionale Auswirkungen
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Temperaturänderung seit 2025
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', px: 2 }}>
        {regionalData.map(({ region, avgTemperature, cities, riskLevel }) => (
          <Card
            key={region}
            sx={{
              mb: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: 1,
              borderColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              }
            }}
          >
            <Box sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {region}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: alpha(getTemperatureColor(avgTemperature, theme), 0.1),
                    color: getTemperatureColor(avgTemperature, theme),
                    fontWeight: 500
                  }}
                >
                  {riskLevel}
                </Typography>
              </Stack>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Durchschnitt:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: getTemperatureColor(avgTemperature, theme), fontWeight: 600 }}
                  >
                    {avgTemperature.toFixed(1)}°C
                  </Typography>
                </Box>
                <Tooltip title={`${avgTemperature.toFixed(1)}°C`}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((avgTemperature / 5) * 100, 100)}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getTemperatureColor(avgTemperature, theme),
                        borderRadius: 3,
                      }
                    }}
                  />
                </Tooltip>
              </Box>

              <Stack spacing={1}>
                {cities.map(city => (
                  <Box
                    key={city.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.common.white, 0.03),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.common.white, 0.05),
                      }
                    }}
                  >
                    <Typography variant="body2">
                      {city.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: getTemperatureColor(city.value, theme),
                        fontWeight: 500
                      }}
                    >
                      {city.value.toFixed(1)}°C
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Card>
        ))}
      </List>
    </Paper>
  );
};

export default RegionalStats;
