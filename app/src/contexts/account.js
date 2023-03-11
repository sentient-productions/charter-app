import React, { useState, useEffect } from "react";

// inspired by https://github.com/upmostly/react-context-example/blob/master/src/Contexts/PostProvider.js

export const AccountContext = React.createContext({});
const AccountProvider = ({ children }) => {
  const [credentials, setCredentials] = useState(() => {
    // Try to get the value from local storage
    const storedValue = window.localStorage.getItem("charterCreds");
    // Return the stored value, or a default value if it doesn't exist
    return storedValue ? JSON.parse(storedValue) : {};
  });

  // Update the value in local storage whenever it changes
  useEffect(() => {
    window.localStorage.setItem("charterCreds", JSON.stringify(credentials));
  }, [credentials]);

  return (
    <AccountContext.Provider value={{ credentials, setCredentials }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
