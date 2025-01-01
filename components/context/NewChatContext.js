"use client";

import React, { createContext, useState, useContext } from "react";

export const NewChatContext = createContext({
  newChatData: [],
  setNewChatData: () => []
});

export const NewChatProvider = ({ children }) => {
  
  const [newChatData, setNewChatData] = useState([]);
  return (
    <NewChatContext.Provider
      value={{
        newChatData,
        setNewChatData
      }}
    >
      {children}
    </NewChatContext.Provider>
  );
};

export const useNewChat = () => {
  const context = useContext(NewChatContext);
  if (context === undefined) {
    throw new Error(
      `useNewChat must be used within a NewChatProvider.`
    );
  }
  return context;
};
