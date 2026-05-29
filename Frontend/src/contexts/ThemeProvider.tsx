// src/contexts/ThemeProvider.tsx
// Purpose of this file:
// - Handle all theme-related logic
// - Save theme in localStorage
// - Add/remove dark class on the body
// - Provide theme across the entire app

import React, { useState, useEffect, useCallback } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

// Props type
interface ThemeProviderProps {
  children: React.ReactNode; // All nested components
  defaultTheme?: Theme; // Default theme (optional)
  storageKey?: string; // localStorage key name (optional)
}

// ThemeProvider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "light", // Default light theme
  storageKey = "app-theme", // localStorage key name
}) => {
  // State: current theme

  // If a function is passed into useState,
  // it only runs on the initial render

  // Here we:
  // - Check localStorage
  // - Check system theme preference
  const [theme, setThemeState] = useState<Theme>(() => {
    // SSR (Server Side Rendering) check
    // If browser is not available, return default theme
    if (typeof window === "undefined") return defaultTheme;

    // Read previously saved theme from localStorage
    const stored = localStorage.getItem(storageKey) as Theme | null;

    // Use saved theme if valid
    if (stored && (stored === "light" || stored === "dark")) {
      return stored;
    }

    // Check system dark mode preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return defaultTheme;
  });

  // Effect: add/remove dark class when theme changes
  useEffect(() => {
    const root = document.documentElement; // <html> element

    if (theme === "dark") {
      root.classList.add("dark"); // TailwindCSS dark mode ON
    } else {
      root.classList.remove("dark"); // TailwindCSS dark mode OFF
    }

    // Save theme in localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]); // Runs when theme or storageKey changes

  // Function to set theme
  // useCallback prevents unnecessary re-creation
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  // Function to toggle theme
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Context value
  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  // Wrap the entire app with ThemeContext Provider
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};