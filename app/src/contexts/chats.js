import React, { useState, useEffect } from "react";

// inspired by https://github.com/upmostly/react-context-example/blob/master/src/Contexts/PostProvider.js

export const ChatsContext = React.createContext({});
const ChatsProvider = ({ children }) => {
  const [chats, setChats] = useState(() => {
    // Try to get the value from local storage
    const storedValue = window.localStorage.getItem("charterChats");
    // Return the stored value, or a default value if it doesn't exist
    return storedValue ? JSON.parse(storedValue) : {};
  });

  // Update the value in local storage whenever it changes
  useEffect(() => {
    window.localStorage.setItem("charterChats", JSON.stringify(chats));
  }, [chats]);

  return (
    <ChatsContext.Provider value={{ chats, setChats }}>
      {children}
    </ChatsContext.Provider>
  );
};

export default ChatsProvider;
