import React from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { modernTheme } from './theme/modernTheme';
import ModernNavbar from './components/navbar';
import Routes from './routes';

const App = () => {
  const location = useLocation();
  
  // Pages where we don't want to show the navbar
  const hideNavbarPaths = ['/'];
  const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <ThemeProvider theme={modernTheme}>
      <CssBaseline />
      <div>
        {!shouldHideNavbar && <ModernNavbar />}
        <Routes />
      </div>
    </ThemeProvider>
  );
};

export default App;
