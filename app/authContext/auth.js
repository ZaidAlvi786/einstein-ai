"use client";
import React, { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const authData = JSON.parse(window.localStorage.getItem("enstine_auth"));
      return authData || null;
    }
    return null;
  });
  const login = (user) => {
    setUser(user);
    window.localStorage.setItem("enstine_auth", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("enstine_auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout , setUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};