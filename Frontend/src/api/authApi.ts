// Frontend/src/api/authApi.ts
import { api } from "./axios";
import type {
  ApiResponse,
  User,
  RegisterFormData,
  LoginFormData,
  UpdateProfileData,
  ChangePasswordData,
} from "../types";

// Shared auth response type
type UserAuthResponse = ApiResponse<{ user: User }>;

// Extract user from API response
const extractUser = (
  res: { data: UserAuthResponse },
  errorMsg: string,
): User => {
  if (res.data.success && res.data.data?.user) {
    return res.data.data.user;
  }

  throw new Error(res.data.message || errorMsg);
};

export const registerApi = async (
  data: RegisterFormData,
): Promise<User> => {
  const res = await api.post<UserAuthResponse>("/auth/register", data);

  return extractUser(res, "Registration failed");
};

export const loginApi = async (
  data: LoginFormData,
): Promise<User> => {
  const res = await api.post<UserAuthResponse>("/auth/login", data);

  return extractUser(res, "Login failed");
};

export const logoutApi = async (): Promise<void> => {
  await api.post<ApiResponse<void>>("/auth/logout");
};

export const getCurrentUserApi = async (): Promise<User | null> => {
  try {
    const res = await api.get<UserAuthResponse>("/auth/me");

    return res.data.data?.user || null;
  } catch {
    return null;
  }
};

export const verifyEmailApi = async (
  token: string,
): Promise<{ success: boolean; message: string }> => {
  const res = await api.get<ApiResponse<void>>(`/auth/verify/${token}`);

  return {
    success: res.data.success,
    message: res.data.message || "Verification completed",
  };
};

export const updateProfileApi = async (
  data: UpdateProfileData,
): Promise<User> => {
  const res = await api.put<UserAuthResponse>("/auth/profile", data);

  return extractUser(res, "Profile update failed");
};

export const changePasswordApi = async (
  data: ChangePasswordData,
): Promise<void> => {
  await api.post<ApiResponse<void>>("/auth/change-password", data);
};

export const requestPasswordResetApi = async (
  email: string,
): Promise<void> => {
  await api.post<ApiResponse<void>>("/auth/forgot-password", {
    email,
  });
};

export const resetPasswordApi = async (
  token: string,
  newPassword: string,
): Promise<void> => {
  await api.post<ApiResponse<void>>("/auth/reset-password", {
    token,
    newPassword,
  });
};