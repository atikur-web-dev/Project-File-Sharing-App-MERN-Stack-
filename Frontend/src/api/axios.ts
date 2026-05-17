import { API_CONFIG } from "../config/api.config";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// adding customs _retry property in RequestConfig
interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry: boolean;
}

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

const SKIP_REFRESH_ENDPOINTS = [
  "auth/login",
  "auth/register",
  "auth/refresh",
  "auth/verify",
  "auth/forgot-password",
  "auth/reset-password",
] as const;

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const resolveQueue = (error: unknown = null) => {
  failedQueue.forEach((Promise) => {
    if (error) {
      Promise.reject(error);
    } else {
      Promise.resolve();
    }
  });
  failedQueue = [];
};

const isSkipEndpointsMatch = (url?: string): boolean => {
  if (!url) return false;
  return SKIP_REFRESH_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth : logout"));
};

const goToLogin = () => {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  const isPublic = PUBLIC_ROUTES.some((route) => path.includes(route));
  if (!isPublic) {
    window.location.href = "/login";
  }
};

api.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;
    if (!originalRequest) {
      return Promise.reject(error);
    }
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    if (isSkipEndpointsMatch(originalRequest.url)) {
      return Promise.reject(error);
    }
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
      await api.post("/auth/refresh")
      resolveQueue();
      return api(originalRequest)
    } catch (err) {
      resolveQueue(err)
      clearAuth();
      goToLogin();
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  },
);
