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
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Farbskala für Temperaturänderungen
const getTemperatureColor = (value) => {
  if (value >= 4) return '#d73027'; // Rot - Sehr hoch
  if (value >= 3) return '#fc8d59'; // Orange - Hoch
  if (value >= 2) return '#fee08b'; // Gelb - Mittel
  if (value >= 1) return '#d9ef8b'; // Hellgrün - Niedrig
  return '#91cf60'; // Grün - Sehr niedrig
};

// Regionen-Gruppierung
const REGIONS = {
  'Nordeuropa': ['Berlin', 'London', 'Moscow'],
  'Südeuropa': ['Paris'],
  'Nordamerika': ['New York'],
  'Asien': ['Tokyo', 'Beijing'],
  'Südliche Hemisphäre': ['Sydney', 'Rio', 'Cape Town']
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
      cities: citiesData
    };
  });

  return (
    <Paper
      sx={{
        width: 300,
        maxHeight: '100%',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 2
      }}
    >
      <Typography variant="h6" gutterBottom>
        Regionale Auswirkungen {year}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Temperaturänderung seit 2025
      </Typography>

      <List>
        {regionalData.map(({ region, avgTemperature, cities }) => (
          <React.Fragment key={region}>
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">
                  {region}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Box sx={{ flex: 1, mr: 1 }}>
                    <Tooltip title={`${avgTemperature.toFixed(1)}°C`}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((avgTemperature / 5) * 100, 100)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getTemperatureColor(avgTemperature)
                          }
                        }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {avgTemperature.toFixed(1)}°C
                  </Typography>
                </Box>
                <List dense>
                  {cities.map(city => (
                    <ListItem key={city.label} dense>
                      <ListItemText
                        primary={city.label}
                        secondary={`${city.value.toFixed(1)}°C`}
                        secondaryTypographyProps={{
                          component: 'span',
                          sx: { color: getTemperatureColor(city.value) }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default RegionalStats;
