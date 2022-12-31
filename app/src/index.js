import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet';
import * as ReactDOMClient from 'react-dom/client';
// Local
import Wrangler from './wrangler/Wrangler';
import Solver from './solver/Solver';
import Root from './Root';

import { NAME } from './constants';
// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   RouterProvider,
// } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
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
    fontFamily: 'Roboto',
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
    }
  }
});

const router = <Router>
      {/* <> */}
      <Routes>
        <Route exact path="/" element={<Wrangler />} />
        <Route path="/wrangler" element={<Wrangler />} />
        <Route path="/solver" element={<Solver />} />
      {/* ... etc. */}
      </Routes>
    </Router>


const root = ReactDOMClient.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Helmet>
      <title>{NAME} | AI Powered Data Wrangling </title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
        rel="stylesheet"
      />
    </Helmet>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {router}
    </ThemeProvider>
  </React.StrictMode>
  );
