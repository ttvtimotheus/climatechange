import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Stack,
  Chip,
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
  onScenarioChange,
  onYearChange,
  onEnergyMixChange,
  riskLevels = { drought: 0, flooding: 0, fires: 0, storms: 0 }
}) => {
  const theme = useTheme();
  const { t } = useLanguage();

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper' }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            {t('scenarios.title')}
          </Typography>
          <FormControl fullWidth variant="outlined">
            <Select
              defaultValue="moderate"
              onChange={(e) => onScenarioChange?.(e.target.value)}
              sx={{
                borderRadius: 2,
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
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            {t('ui.timePeriod')}
          </Typography>
          <Box sx={{ px: 2 }}>
            <Slider
              min={2025}
              max={2100}
              step={5}
              defaultValue={2025}
              valueLabelDisplay="auto"
              marks
              onChange={(e, value) => onYearChange?.(value)}
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
                '& .MuiSlider-track': {
                  height: 4,
                },
                '& .MuiSlider-rail': {
                  height: 4,
                  opacity: 0.2,
                },
                '& .MuiSlider-mark': {
                  backgroundColor: '#bfbfbf',
                  height: 8,
                  width: 1,
                  '&.MuiSlider-markActive': {
                    opacity: 1,
                    backgroundColor: 'currentColor',
                  },
                },
              }}
            />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            {t('ui.energyMix')}
          </Typography>
          <FormControl fullWidth variant="outlined">
            <Select
              defaultValue="mixed"
              onChange={(e) => onEnergyMixChange?.(e.target.value)}
              sx={{
                borderRadius: 2,
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
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            {t('ui.currentRisks')}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
            <Chip
              icon={<WhatshotIcon />}
              label={`${t('ui.drought')}: ${riskLevels.drought}%`}
              sx={{
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: theme.palette.warning.main,
                '& .MuiChip-icon': {
                  color: theme.palette.warning.main
                }
              }}
            />
            <Chip
              icon={<WaterIcon />}
              label={`${t('ui.flooding')}: ${riskLevels.flooding}%`}
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.1),
                color: theme.palette.info.main,
                '& .MuiChip-icon': {
                  color: theme.palette.info.main
                }
              }}
            />
            <Chip
              icon={<FireIcon />}
              label={`${t('ui.wildfires')}: ${riskLevels.fires}%`}
              sx={{
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                '& .MuiChip-icon': {
                  color: theme.palette.error.main
                }
              }}
            />
            <Chip
              icon={<StormIcon />}
              label={`${t('ui.storms')}: ${riskLevels.storms}%`}
              sx={{
                bgcolor: alpha(theme.palette.secondary.main, 0.1),
                color: theme.palette.secondary.main,
                '& .MuiChip-icon': {
                  color: theme.palette.secondary.main
                }
              }}
            />
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ClimateControls;
