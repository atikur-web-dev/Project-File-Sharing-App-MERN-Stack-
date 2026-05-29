// src/config/theme.config.ts
// Purpose of this file: Keep all theme-related configurations in one place
// Theme Types
export const THEME = {
  LIGHT: "light" as const,
  DARK: "dark" as const,
  SYSTEM: "system" as const,
};

export type Theme = (typeof THEME)[keyof typeof THEME];

// Theme Configuration
export const THEME_CONFIG = {
  // Local storage key
  STORAGE_KEY: "app-theme",

  // Default theme
  DEFAULT: THEME.LIGHT,

  // CSS class for dark mode
  DARK_CLASS: "dark",
} as const;