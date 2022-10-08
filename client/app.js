import React from 'react';
import {blue, pink} from '@mui/material/colors';
import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@mui/material';

export const appTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#283593',
    },
    secondary: {
      main: '#fbc02d',
    },
    warning: {
      main: '#ad1457',
    },
    background: {
      default: pink,
      paper: '#ffb74d',
    },
  },
  typography: {
    fontFamily: 'PT Sans Caption',
  },
});
import {Navbar} from './components';
import Routes from './routes';

const App = () => {
  return (
    <ThemeProvider theme={appTheme}>
      <div>
        <Navbar />
        <Routes />
      </div>
    </ThemeProvider>
  );
};

export default App;
