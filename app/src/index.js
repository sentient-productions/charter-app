import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Helmet } from "react-helmet";
import { NAME } from './constants';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      // default: '#232023' // Set the default background color to a light gray
      // default: '#18151A', // Set the default background color to a light gray
      paper: '#000000'
    },
    primary: {
      main: '#C70039' // Use a bright, bold color for the primary theme
    },
    secondary: {
      main: '#FF5733' // Use a cool, muted color for the secondary theme
    },
    text: {
      primary: '#ffffff',
      secondary: '#bdbdbd'
    }
  },
  typography: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: 4, // Round the edges of the button
        fontWeight: 'bold', // Use a bold font weight
        backgroundColor: '#0044ff' // Use the secondary theme color as the background
      }
    },
  }
});

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <title>{NAME} | AI Powered Data Wrangling </title>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"/>
    </Helmet>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
