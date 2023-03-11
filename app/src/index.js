import ReactDOM from "react-dom/client";
import ChatApp from "./pages/ChatApp";
import Lander from "./pages/Lander";
import Login from "./pages/Login";
import reportWebVitals from "./reportWebVitals";
import "typeface-roboto";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactGA from "react-ga4";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AccountProvider from "./contexts/account";

const TRACKING_ID = "G-T4PNJFPSXB"; // OUR_TRACKING_ID

// 2. Call `extendTheme` and pass your custom values
// 2. Add your color mode config
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
  styles: {
    global: (props) => ({
      body: {
        color: "black",
        bg: "black",
      },
    }),
  },
};

// 3. extend the theme
const theme = extendTheme({ config });

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ChakraProvider theme={theme}>
        <Lander />
      </ChakraProvider>
    ),
  },
  {
    path: "/login",
    element: (
      <ChakraProvider theme={theme}>
        <Login />
      </ChakraProvider>
    ),
  },
  {
    path: "/chat",
    element: (
      <ChakraProvider theme={theme}>
        <ChatApp />
      </ChakraProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AccountProvider>
    <GoogleOAuthProvider clientId="393331770643-ij113a8c5q541g80jorfk6578lac65b2.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </AccountProvider>
);

ReactGA.initialize(TRACKING_ID);
reportWebVitals();
