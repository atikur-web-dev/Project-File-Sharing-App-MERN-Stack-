// src/contexts/ThemeContext.tsx
// Purpose of this file:
// - Create a global context for theme management
// - Only Context is created here, no logic
// - All logic will stay inside ThemeProvider.tsx

import { createContext } from "react";

// Theme type definition

// Theme can only be "light" or "dark"
export type Theme = "light" | "dark";

// Define what data and functions the context will provide
export interface ThemeContextType {
  theme: Theme; // Current theme (light/dark)
  toggleTheme: () => void; // Function to toggle theme
  setTheme: (theme: Theme) => void; // Function to set theme directly
}

// Create the context

// createContext() = built-in React function

// undefined = default value
// If used without Provider, it will throw an error
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);