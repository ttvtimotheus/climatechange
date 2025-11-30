import React from 'react';
import { 
  IconButton, 
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <Tooltip title={t('ui.languageSelect')}>
      <IconButton
        onClick={toggleLanguage}
        size="small"
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          px: 1.5,
          py: 0.5,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
          {language.toUpperCase()}
        </Typography>
      </IconButton>
    </Tooltip>
  );
};

export default LanguageSelector;
