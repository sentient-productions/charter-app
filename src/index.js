import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from '@mui/material/styles';


const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#212121', // Set the default background color to a light gray
    },
    primary: {
      main: '#ff4400', // Use a bright, bold color for the primary theme
      // light: '#757ce8',
      // main: '#3f50b5',
      // dark: '#002884',
      // contrastText: '#fff',
    },
    secondary: {
      main: '#0044ff', // Use a cool, muted color for the secondary theme
      // light: '#ff7961',
      // main: '#f44336',
      // dark: '#ba000d',
      // contrastText: '#000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bdbdbd',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  overrides: {
   MuiButton: {
      root: {
        borderRadius: 4, // Round the edges of the button
        fontWeight: 'bold', // Use a bold font weight
        backgroundColor: '#0044ff', // Use the secondary theme color as the background
      },
    },
    MuiCard: {
      root: {
        borderRadius: 12, // Round the edges of the card
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add a subtle shadow
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
