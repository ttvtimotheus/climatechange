import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    warning: {
      main: '#ED6C02',
      light: '#FF9800',
      dark: '#E65100',
    },
    info: {
      main: '#0288D1',
      light: '#03A9F4',
      dark: '#01579B',
    },
    success: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
      dark: alpha('#1A2027', 0.04),
    },
    text: {
      primary: '#1A2027',
      secondary: '#3E5060',
      disabled: alpha('#1A2027', 0.38),
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(26, 32, 39, 0.05)',
    '0px 4px 8px rgba(26, 32, 39, 0.1)',
    '0px 8px 16px rgba(26, 32, 39, 0.1)',
    '0px 12px 24px rgba(26, 32, 39, 0.1)',
    '0px 16px 32px rgba(26, 32, 39, 0.1)',
    '0px 20px 40px rgba(26, 32, 39, 0.1)',
    '0px 24px 48px rgba(26, 32, 39, 0.1)',
    '0px 28px 56px rgba(26, 32, 39, 0.1)',
    '0px 32px 64px rgba(26, 32, 39, 0.1)',
    '0px 36px 72px rgba(26, 32, 39, 0.1)',
    '0px 40px 80px rgba(26, 32, 39, 0.1)',
    '0px 44px 88px rgba(26, 32, 39, 0.1)',
    '0px 48px 96px rgba(26, 32, 39, 0.1)',
    '0px 52px 104px rgba(26, 32, 39, 0.1)',
    '0px 56px 112px rgba(26, 32, 39, 0.1)',
    '0px 60px 120px rgba(26, 32, 39, 0.1)',
    '0px 64px 128px rgba(26, 32, 39, 0.1)',
    '0px 68px 136px rgba(26, 32, 39, 0.1)',
    '0px 72px 144px rgba(26, 32, 39, 0.1)',
    '0px 76px 152px rgba(26, 32, 39, 0.1)',
    '0px 80px 160px rgba(26, 32, 39, 0.1)',
    '0px 84px 168px rgba(26, 32, 39, 0.1)',
    '0px 88px 176px rgba(26, 32, 39, 0.1)',
    '0px 92px 184px rgba(26, 32, 39, 0.1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 8px rgba(26, 32, 39, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(26, 32, 39, 0.1)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: alpha('#1A2027', 0.95),
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
      },
    },
  },
});

export default theme;
