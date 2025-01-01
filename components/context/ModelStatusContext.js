"use client";

import React, { createContext, useState, useContext } from "react";

export const ModelStatusContext = createContext({
  textStatus: {},
  setTextStatus: () => {},
  settingModel: {},
  setSettingModel: () => {},
  toggleStatus: {},
  setToggleStatus: () => {},
  imgStatus: {},
  setImgStatus: () => {},
});

export const ModelStatusProvider = ({ children }) => {
  const [textStatus, setTextStatus] = useState([
    true,
    true,
    true,
    true,
    true,
    true,
  ]);
  const [imgStatus, setImgStatus] = useState([true, true, true, true]);
  const [settingModel, setSettingModel] = useState(false);
  const [toggleStatus, setToggleStatus] = useState(1);

  return (
    <ModelStatusContext.Provider
      value={{
        textStatus,
        settingModel,
        toggleStatus,
        imgStatus,
        setTextStatus,
        setSettingModel,
        setToggleStatus,
        setImgStatus,
      }}
    >
      {children}
    </ModelStatusContext.Provider>
  );
};

export const useModelStatus = () => {
  const context = useContext(ModelStatusContext);
  if (context === undefined) {
    throw new Error(
      `useModelStatus must be used within a ModelStatusProvider.`
    );
  }

  return context;
};