import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Stack,
  alpha,
  Slider,
  Paper
} from '@mui/material';
import {
  Whatshot as WhatshotIcon,
  WaterDrop as WaterIcon,
  LocalFireDepartment as FireIcon,
  Storm as StormIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useLanguage } from '../contexts/LanguageContext';

const ClimateControls = ({ 
  selectedScenario = 'moderate',
  selectedYear = 2025,
  onScenarioChange,
  onYearChange,
  onEnergyMixChange,
  riskLevels = { drought: 0, flooding: 0, fires: 0, storms: 0 }
}) => {
  const theme = useTheme();
  const { t } = useLanguage();

  return (
    <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'background.paper', height: '100%' }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {t('scenarios.title')}
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={selectedScenario}
              onChange={(e) => onScenarioChange?.(e.target.value)}
              sx={{
                borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              <MenuItem value="optimistic">{t('scenarios.optimistic.label')}</MenuItem>
              <MenuItem value="moderate">{t('scenarios.moderate.label')}</MenuItem>
              <MenuItem value="pessimistic">{t('scenarios.pessimistic.label')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {t('ui.timePeriod')} - {selectedYear}
          </Typography>
          <Box sx={{ px: 1 }}>
            <Slider
              min={2025}
              max={2100}
              step={5}
              value={selectedYear}
              valueLabelDisplay="auto"
              onChange={(e, value) => onYearChange?.(value)}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': {
                  height: 16,
                  width: 16,
                  backgroundColor: '#fff',
                  border: '2px solid currentColor',
                },
                '& .MuiSlider-track': {
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  opacity: 0.3,
                },
              }}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {t('ui.energyMix')}
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              defaultValue="mixed"
              onChange={(e) => onEnergyMixChange?.(e.target.value)}
              sx={{
                borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              <MenuItem value="renewable">{t('ui.renewable')}</MenuItem>
              <MenuItem value="mixed">{t('ui.mixed')}</MenuItem>
              <MenuItem value="fossil">{t('ui.fossil')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {t('ui.currentRisks')}
          </Typography>
          <Stack spacing={1}>
            {[
              { key: 'drought', value: riskLevels.drought, icon: <WhatshotIcon fontSize="small" />, color: theme.palette.warning.main },
              { key: 'flooding', value: riskLevels.flooding, icon: <WaterIcon fontSize="small" />, color: theme.palette.info.main },
              { key: 'wildfires', value: riskLevels.fires, icon: <FireIcon fontSize="small" />, color: theme.palette.error.main },
              { key: 'storms', value: riskLevels.storms, icon: <StormIcon fontSize="small" />, color: theme.palette.secondary.main }
            ].map(({ key, value, icon, color }) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color, display: 'flex' }}>{icon}</Box>
                <Typography variant="caption" sx={{ flex: 1, color: 'text.secondary' }}>
                  {t(`ui.${key}`)}
                </Typography>
                <Box sx={{ 
                  width: 60, 
                  height: 6, 
                  bgcolor: alpha(color, 0.2), 
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: `${value}%`, 
                    height: '100%', 
                    bgcolor: color,
                    transition: 'width 0.3s ease'
                  }} />
                </Box>
                <Typography variant="caption" sx={{ width: 30, textAlign: 'right', color, fontWeight: 600 }}>
                  {value}%
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ClimateControls;
