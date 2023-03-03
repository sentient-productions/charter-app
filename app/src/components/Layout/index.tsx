import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import useAuth from "../../hooks/useAuth";
import Navbar from "../Navbar";
import RedditNavbar from "../Navbar/index_reddit";
import AuthModal from "../Modal/Auth";

const Layout: React.FC = ({ children }) => {
  // useAuth(); // will implement later at end of tutorial

  return (
    <>
      <Navbar />
      {/* <RedditNavbar /> */}
      {children}
    </>
  );
};

export default Layout;
