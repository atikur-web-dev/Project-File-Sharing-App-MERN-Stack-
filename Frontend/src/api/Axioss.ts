import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_CONFIG } from "../config/api.config";

/**
 * Extend request config to track retry status
 */
interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Central API instance (used across entire frontend)
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

/**
 * Endpoints where refresh should NOT happen
 */
const SKIP_REFRESH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
] as const;

/**
 * Public routes (no redirect needed)
 */
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
] as const;

// refresh state lock (prevents multiple refresh calls)
let isRefreshing = false;

// queue for requests waiting during refresh
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

/**
 * Resolve all queued requests after refresh
 */
const resolveQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve();
  });

  failedQueue = [];
};

/**
 * Check if request URL matches skip list
 */
const isSkipEndpoint = (url?: string): boolean => {
  if (!url) return false;

  return SKIP_REFRESH_ENDPOINTS.some((endpoint) =>
    url.includes(endpoint)
  );
};

/**
 * Clear auth data from client
 */
const clearAuth = () => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth:logout"));
};

/**
 * Redirect user to login safely
 */
const goToLogin = () => {
  if (typeof window === "undefined") return;

  const path = window.location.pathname;

  const isPublic = PUBLIC_ROUTES.some((route) =>
    path.includes(route)
  );

  if (!isPublic) {
    window.location.href = "/login";
  }
};

/**
 * Request interceptor (just pass-through for now)
 */
api.interceptors.request.use(
  (config) => config,
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error("Request error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor → handles auth refresh flow
 */
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle unauthorized errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // prevent infinite retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // skip refresh for auth endpoints
    if (isSkipEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    /**
     * If refresh already running,
     * queue the request instead of firing new refresh
     */
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
      // refresh token request
      await api.post("/auth/refresh");

      // retry all queued requests
      resolveQueue();

      // retry original request
      return api(originalRequest);
    } catch (err) {
      // refresh failed → logout user
      resolveQueue(err);

      clearAuth();
      goToLogin();

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);