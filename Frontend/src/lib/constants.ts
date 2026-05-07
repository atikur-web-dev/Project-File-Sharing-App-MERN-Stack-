// Website Introduction
export const APP_NAME = "File-Sharing-App";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION = "Secure file sharing platform for everyone";

// API Configuration
// 1. Backend URL
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// 2. API Endpoints
export const API_ENDPOINTS = {
  // about authentication endpoints
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY_EMAIL: "/auth/verify",
    ME: "/auth/me",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  // about file related endpoints
  FILES: {
    UPLOAD: "/files",
    LIST: "/files",
    MY_FILES: "/files/my",
    DETAIL: "/files",
    DOWNLOAD: "/files/download",
    VIEW: "/files/view",
    DELETE: "/files",
  },
} as const; // here const refer this is fully constant and no one will be able to change its value

// File Configuration
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1025, // 5MB
  MAX_FILE_SIZE_MB: 5, // (5MB) just for readability
  MAX_FILES_PER_UPLOAD: 5, // A user can upload 5 files at a time
  ALLOWED_MIME_TYPES: [
    "images/jpeg",
    "images/jpg",
    "images/png",
    "images/gif",
    "images/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/json",
  ] as const,
} as const;

// pagination configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE: 1, // it means 1st page,
  DEFAULT_LIMIT: 10, // each page 10 ta item carry korbe,
  MAX_LIMIT: 100, // EACH PAGE MAX 100 ITEMS
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
} as const;

// Tost notification configuration
export const TOAST_CONFIG = {
  DURATION: {
    SHORT: 2000, // for short time notification
    NORMAL: 3000, // normal time
    LONG: 5000, // long time
    PERSISTENT: Infinity, // infinity
  },
} as const;

// Validation pattern configuration
export const VALIDATION_PATTERNS = {
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
} as const;

// Validation message to showa users
export const VALIDATION_MESSAGE = {
  PASSWORD: "'Password must contain uppercase, lowercase, special characters",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  EMAIL_INVALID: "Please enter a valid email address",
  REQUIRED_FIELD: "This field is required",
  DISPLAY_NAME_MIN: "Display name must be at least 8 characters",
  DISPLAY_NAME_MAX: "Display Name cannot exceed 60 characters",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ANALYTICS: "/analytics",
  SHARE: "/share",
  PREVIEW: "/preview",
  NOT_FOUND: "/404",
} as const;

// Local storage key
export const STORAGE_KEY = {
  THEME: "theme", // dark / light theme
  USER_PREFERENCES: "user-preferences", // user ar pochondo
  AUTH_TOKEN: "auth-token", // auth token if i want to keep it in local storage
} as const;

// Error message configuration
export const ERROR_MESSAGE = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Your session has expired. Please login again.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  FILE_TOO_LARGE: `File size exceeds ${FILE_CONFIG.MAX_FILE_SIZE_MB}MB limit.`,
  UNSUPPORTED_FILE_TYPE: "This file type is not supported.",
  UPLOAD_FAILED: "File upload failed. Please try again.",
  DELETE_FAILED: "Failed to delete file. Please try again.",
};
