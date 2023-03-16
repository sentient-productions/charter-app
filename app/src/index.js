import ReactDOM from "react-dom/client";
import ChatApp from "./pages/ChatApp";
import Lander from "./pages/Lander";
import Login from "./pages/Login";
import Research from "./pages/Research";
import reportWebVitals from "./reportWebVitals";
import "typeface-roboto";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactGA from "react-ga4";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AccountProvider from "./contexts/account";
import ChatProvider from "./contexts/chats";

const TRACKING_ID = "G-T4PNJFPSXB";

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
  {
    path: "/samples",
    element: (
      <ChakraProvider theme={theme}>
        <Research />
      </ChakraProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AccountProvider>
    <ChatProvider>
      <GoogleOAuthProvider clientId="393331770643-ij113a8c5q541g80jorfk6578lac65b2.apps.googleusercontent.com">
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ChatProvider>
  </AccountProvider>
);

ReactGA.initialize(TRACKING_ID);
reportWebVitals();
