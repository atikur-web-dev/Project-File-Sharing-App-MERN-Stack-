// Frontend/src/config/api.config.ts
import { API_BASE_URL } from "../lib/constants";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  WITH_CREDENTIALS: true,
  HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

export const ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY_EMAIL: "/auth/verify",
    ME: "/auth/me",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  FILES: {
    UPLOAD: "/files",
    LIST: "/files",
    MY_FILES: "/files/my",
    DETAIL: "/files",
    DOWNLOAD: "/files/download",
    VIEW: "/files/view",
    DELETE: "/files",
  },
} as const;

// Dynamic ULR build helper
export const buildApiUrl = (endpoint: string, param?: string): string => {
  if (param) {
    return `${endpoint}/${param}`;
  }
  return endpoint;
};

// Full URL builder (with Base URL)
export const buildFullUrl = (endpoint: string, param?: string): string => {
  const path = buildApiUrl(endpoint, param);
  return `${API_CONFIG.BASE_URL}${path}`;
};
