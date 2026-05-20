// Frontend/src/api/axioss.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "../config/api.config";

// Extended request config to support retry tracking
interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Central Axios instance
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Endpoints where refresh token should NOT be triggered
const SKIP_REFRESH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
] as const;

// Routes that don't require redirect handling
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
] as const;

// refresh lock
let isRefreshing = false;

// request queue while refresh is happening
let failedQueue: Array<{
  resolve: (token?: string) => void;
  reject: (error: unknown) => void;
}> = [];

// Process queued requests after refresh
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || undefined);
    }
  });

  failedQueue = [];
};

// Check if endpoint should skip refresh
const isSkipEndpoint = (url?: string) => {
  if (!url) return false;

  return SKIP_REFRESH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

// Clear local auth state
const clearAuth = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth:logout"));
};

// Redirect to login safely
const redirectToLogin = () => {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;

  const isPublic = PUBLIC_ROUTES.some((route) => path.includes(route));

  if (!isPublic) {
    window.location.href = "/login";
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor (refresh token logic)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;
    if (!originalRequest) {
      return Promise.reject(error);
    }
    // Only handle unauthorized
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    // prevent infinite retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    // skip auth endpoints
    if (isSkipEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }
    // If refresh already running → queue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // refresh token call
      await api.post("/auth/refresh");
      // retry queued requests
      processQueue(null);
      // retry original request
      return api(originalRequest);
    } catch (err) {
      // refresh failed → logout user
      processQueue(err);
      clearAuth();
      redirectToLogin();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
