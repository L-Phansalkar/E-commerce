import React from 'react';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material';

// Thermal Vision Theme for Women Fish & Me
export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0040', // thermal red
    },
    secondary: {
      main: '#00ffff', // thermal cyan
    },
    warning: {
      main: '#ffff00', // thermal yellow
    },
    background: {
      default: '#0a0020', // deep space
      paper: 'rgba(10, 0, 32, 0.8)', // translucent thermal black
    },
    text: {
      primary: '#00ffff', // thermal cyan
      secondary: '#ffff00', // thermal yellow
    },
    error: {
      main: '#ff0040', // thermal red
    },
    success: {
      main: '#00ff40', // thermal green
    },
    info: {
      main: '#0080ff', // thermal blue
    }
  },
  typography: {
    fontFamily: 'Orbitron, monospace',
    h1: {
      fontFamily: 'Press Start 2P, monospace',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      fontSize: '2.5rem',
      fontWeight: 400,
    },
    h2: {
      fontFamily: 'Press Start 2P, monospace',
      textTransform: 'uppercase',
      letterSpacing: '3px',
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h3: {
      fontFamily: 'Orbitron, monospace',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    h4: {
      fontFamily: 'Orbitron, monospace',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    h5: {
      fontFamily: 'Orbitron, monospace',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    h6: {
      fontFamily: 'Orbitron, monospace',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    body1: {
      fontFamily: 'VT323, monospace',
      fontSize: '1.1rem',
      lineHeight: 1.4,
    },
    body2: {
      fontFamily: 'VT323, monospace',
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    button: {
      fontFamily: 'Orbitron, monospace',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '2px',
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #ff0040, #ff6600)',
          border: 'none',
          color: 'white',
          fontFamily: 'Orbitron, monospace',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          borderRadius: '8px',
          boxShadow: '0 0 20px #ff0040',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff6600, #ffff00)',
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 30px #ff6600',
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 0, 32, 0.8)',
          border: '2px solid #ff0040',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 20px #ff6600',
          transition: 'all 0.4s ease',
          '&:hover': {
            transform: 'translateY(-10px) scale(1.02)',
            boxShadow: '0 20px 40px #ff0040',
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 0, 32, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '2px solid #ff0040',
          boxShadow: '0 0 30px #ff6600',
        }
      }
    }
  }
});

import {Navbar} from './components';
import Routes from './routes';

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <div>
        {/* Add scanlines overlay */}
        <div className="thermal-scanlines"></div>
        <Navbar />
        <Routes />
      </div>
    </ThemeProvider>
  );
};

export default App;
