// src/hooks/useTheme.ts
// এই হুকের কাজ: ThemeContext থেকে সহজে থিম ডাটা নেওয়া

import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};