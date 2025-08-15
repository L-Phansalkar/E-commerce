// client/theme/modernTheme.js
import { createTheme } from '@mui/material/styles';

export const modernTheme = createTheme({
  palette: {
    primary: {
      main: '#1a1a1a', // Clean dark for text and borders
      light: '#333333',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2563eb', // Clean blue accent
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa', // Very light gray background
      paper: '#ffffff', // Pure white for cards/surfaces
    },
    text: {
      primary: '#1a1a1a', // Dark text for readability
      secondary: '#6b7280', // Medium gray for secondary text
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    divider: '#f3f4f6',
    action: {
      hover: 'rgba(0, 0, 0, 0.02)',
      selected: 'rgba(37, 99, 235, 0.08)',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // More modern rounded corners
  },
  spacing: 8,
  shadows: [
    'none',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
    '0 0 0 1px rgba(0, 0, 0, 0.05)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#fafafa',
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #f3f4f6',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          padding: '10px 20px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        outlined: {
          borderColor: '#e5e7eb',
          color: '#1a1a1a',
          '&:hover': {
            borderColor: '#1a1a1a',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 16,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  },
});