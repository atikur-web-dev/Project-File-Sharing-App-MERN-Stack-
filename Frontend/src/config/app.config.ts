// Frontend/src/config/app.config.ts
import { APP_NAME, APP_VERSION, APP_DESCRIPTION } from "../lib/constants";

export const APP_CONFIG = {
  NAME: APP_NAME,
  VERSION: APP_VERSION,
  DESCRIPTION: APP_DESCRIPTION,
  URL: import.meta.env.VITE_APP_URL || "http://localhost:3000",
  MODE: import.meta.env.VITE_APP_MODE || "development",
  DEBUG: import.meta.env.VITE_ENABLE_DEBUG === "true",
  ANALYTICS_ENABLED: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
} as const;

export const THEME_CONFIG = {
  THEMES: {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
  } as const,

  STORAGE_KEY: "app-theme",
  DEFAULT_THEME: "light",
} as const;

export const DATE_CONFIG = {
  FORMATS: {
    SHORT: "short",
    LONG: "long",
    DATETIME: "datetime",
    TIME: "time",
    RELATIVE: "relative",
  } as const,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
} as const;

export const FILE_LIMITS = {
  MAX_SIZE_MB: 5,
  MAX_FILES_PER_UPLOAD: 5,
  ALLOWED_EXTENSIONS: [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".json",
  ],
} as const;
