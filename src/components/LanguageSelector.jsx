import React from 'react';
import { 
  IconButton, 
  Tooltip
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <Tooltip title={t('ui.languageSelect')} placement="left">
      <IconButton
        onClick={toggleLanguage}
        sx={{
          position: 'fixed',
          right: 16,
          top: 16,
          bgcolor: 'background.paper',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'background.paper',
          },
        }}
      >
        <LanguageIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LanguageSelector;
