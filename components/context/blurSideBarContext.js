"use client";

import React, { createContext, useState, useContext } from "react";

const BlurSideBarContext = createContext({
  blurSideBar: Boolean,
  setBlurSideBar: (value) => {}, 
});

export const BlurSideBarProvider = ({ children }) => {
  const [blurSideBar, setBlurSideBar] = useState(false);

  return (
    <BlurSideBarContext.Provider value={{ blurSideBar, setBlurSideBar }}>
      {children}
    </BlurSideBarContext.Provider>
  );
};

export const useBlurSideBar = () => {
  const context = useContext(BlurSideBarContext);
  if (!context) {
    throw new Error("useBlurSideBar must be used within a BlurSideBarProvider");
  }
  return context;
};
