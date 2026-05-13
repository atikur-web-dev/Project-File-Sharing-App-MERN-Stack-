import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_CONFIG } from "../config/api.config";

// Extend axios request config with custom retry flag
interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Auth endpoints that should not trigger token refresh
const SKIP_REFRESH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
] as const;

// Public routes where redirect is not needed
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
] as const;

// Global refresh state
let isRefreshing = false;

// Requests waiting for refresh to complete
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Resolve or reject all queued requests
const processQueue = (error: Error | null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(null);
    }
  });

  failedQueue = [];
};

// Check if URL matches any endpoint in the list
const matchesAnyEndpoint = (
  url: string | undefined,
  endpoints: readonly string[],
): boolean => {
  if (!url) return false;
  return endpoints.some((endpoint) => url.includes(endpoint));
};

// Clear client-side auth data and notify the app
const clearClientAuthState = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth:logout"));
};

// Redirect to login if current route is protected
const redirectToLogin = (): void => {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    currentPath.includes(route),
  );

  if (!isPublicRoute) {
    window.location.href = "/login";
  }
};

// Request interceptor (currently passes config unchanged)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error("Request Interceptor Error:", error);
    }

    return Promise.reject(error);
  },
);

// Response interceptor handles automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    // No original request config available
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401 Unauthorized
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Skip refresh for auth-related endpoints
    if (
      matchesAnyEndpoint(originalRequest.url, SKIP_REFRESH_ENDPOINTS)
    ) {
      return Promise.reject(error);
    }

    // If refresh is already running, wait in queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((queueError) => Promise.reject(queueError));
    }

    // Start refresh process
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Get a new access token using refresh token
      await api.post("/auth/refresh");

      // Retry all queued requests
      processQueue(null);

      // Retry the original failed request
      return api(originalRequest);
    } catch (refreshError) {
      // Reject all queued requests
      processQueue(refreshError as Error);

      // Clear auth state and redirect to login
      clearClientAuthState();
      redirectToLogin();

      return Promise.reject(refreshError);
    } finally {
      // Reset refresh state
      isRefreshing = false;
    }
  },
);