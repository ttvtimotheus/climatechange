import React from 'react';
import { 
  Box, 
  Slider, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Paper,
  Stack,
  Chip
} from '@mui/material';
import {
  WbSunny as SunIcon,
  Opacity as WaterIcon,
  LocalFireDepartment as FireIcon,
  Storm as StormIcon
} from '@mui/icons-material';

const ClimateControls = ({ 
  onScenarioChange,
  onYearChange,
  onEnergyMixChange,
  riskLevels = { drought: 0, flooding: 0, fires: 0, storms: 0 }
}) => {
  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Klimaszenario
          </Typography>
          <FormControl fullWidth variant="outlined">
            <Select
              defaultValue="moderate"
              onChange={(e) => onScenarioChange(e.target.value)}
              sx={{ 
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <MenuItem value="optimistic">🌱 Optimistisch (Paris-Ziele erreicht)</MenuItem>
              <MenuItem value="moderate">⚖️ Moderat (teilweise Anpassung)</MenuItem>
              <MenuItem value="pessimistic">⚠️ Pessimistisch (Business as usual)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Zeitraum
          </Typography>
          <Slider
            min={2025}
            max={2100}
            step={5}
            marks
            valueLabelDisplay="auto"
            onChange={(e, value) => onYearChange(value)}
            sx={{
              color: 'primary.main',
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
                backgroundColor: '#fff',
                border: '2px solid currentColor',
                '&:hover': {
                  boxShadow: '0 0 0 8px rgba(58, 133, 137, 0.16)',
                },
              },
            }}
          />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Energiemix
          </Typography>
          <FormControl fullWidth variant="outlined">
            <Select
              defaultValue="mixed"
              onChange={(e) => onEnergyMixChange(e.target.value)}
              sx={{ 
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <MenuItem value="renewable">🌞 100% Erneuerbare Energien</MenuItem>
              <MenuItem value="mixed">⚡ Gemischter Energiemix</MenuItem>
              <MenuItem value="fossil">🏭 Überwiegend fossile Brennstoffe</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
            Aktuelle Risiken
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<SunIcon />}
              label={`Dürre: ${riskLevels.drought}%`}
              color="warning"
              variant="outlined"
            />
            <Chip
              icon={<WaterIcon />}
              label={`Überflutung: ${riskLevels.flooding}%`}
              color="info"
              variant="outlined"
            />
            <Chip
              icon={<FireIcon />}
              label={`Waldbrände: ${riskLevels.fires}%`}
              color="error"
              variant="outlined"
            />
            <Chip
              icon={<StormIcon />}
              label={`Stürme: ${riskLevels.storms}%`}
              color="default"
              variant="outlined"
            />
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ClimateControls;
