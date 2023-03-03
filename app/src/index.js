import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'typeface-roboto'
import { ChakraBaseProvider } from '@chakra-ui/react'
import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
// 2. Add your color mode config
const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
  styles: {
    global: (props) => ({
      body: {
        color: 'black',
        bg: 'black',
      },
    }),
  },
}

// 3. extend the theme
const theme = extendTheme({ config })


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraBaseProvider theme={theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraBaseProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



