import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "../config/api.config";

// Extend axios request config with custom retry flag
interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// A central API client , and all the FE api call will use this api instance
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

// Defining only which endpoints will not use this to refresh token
const SKIP_REFRESH_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth//reset-password",
] as const;

// These are the public routes
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
] as const;

// Tracking wether the refreshing is on going or not
let isRefreshing = false;

// Keep all the failed request in this queue (waiting room) during the Refreshing processing is ongoing
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Resolve or reject all the requests in the waiting room (failedQueue)
const processQueue = (error: Error | null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(null);
    }
  });
};

// Check if URL matches any endpoints in the list (to decided which url to skip for refreshing)
const matchesAnyEndpoint = (
  url: string | undefined,
  endpoints: readonly string[],
): boolean => {
  if (!url) return false;
  return endpoints.some((endpoint) => url.includes(endpoint));
};
// Clear client side auth data and notify the app like clear the LocalStorage and dispatch Logout event
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

// Request interceptor (here it intercept all outgoing requests)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.error("Request Interceptor Error", error);
    }
    return Promise.reject(error);
  },
);

// Response interceptor that will handle all incoming response and will intercept errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Find out the original request ( store the fail request)
    const originalRequest = error.config as RetryRequestConfig | undefined;

    // if no original request find out
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // only handle 401 unauthorized error
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinity _retry loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // skip refresh for auth related endpoints
    if (matchesAnyEndpoint(originalRequest.url, SKIP_REFRESH_ENDPOINTS)) {
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
      // get a new access token using refresh token
      await api.post("/auth/refresh");
      // retry all queue request ( resume all the request in the queue(the waiting room))
      processQueue(null);
      // Retry the original failed request
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as Error);
      // clear auth state and redirect to login
      clearClientAuthState();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
