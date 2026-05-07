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


// POST /api/v1/auth/register (New user Register)

export const registerApi = async (data: RegisterFormData): Promise<User> => {
  const response = await api.post<ApiResponse<{ user: User }>>(
    "/auth/register",
    data,
  );

  if (response.data.success && response.data.data?.user) {
    return response.data.data.user;
  }

  throw new Error(response.data.message || "Registration failed");
};


// POST /api/v1/auth/login (User Login)

export const loginApi = async (data: LoginFormData): Promise<User> => {
  const response = await api.post<ApiResponse<{ user: User }>>(
    "/auth/login",
    data,
  );

  if (response.data.success && response.data.data?.user) {
    return response.data.data.user;
  }

  throw new Error(response.data.message || "Login failed");
};


// POST /api/v1/auth/logout (User Logout)

export const logoutApi = async (): Promise<void> => {
  await api.post("/auth/logout");
};


// GET /api/v1/auth/me (Current User info)

export const getCurrentUserApi = async (): Promise<User | null> => {
  try {
    const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");

    if (response.data.success && response.data.data?.user) {
      return response.data.data.user;
    }

    return null;
  } catch {
    return null; // কুকি না থাকলে বা টোকেন invalid হলে null ফেরত দেবে
  }
};


// GET /api/v1/auth/verify/:token (Email Verification)
export const verifyEmailApi = async (
  token: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await api.get<ApiResponse>(`/auth/verify/${token}`);

  return {
    success: response.data.success,
    message: response.data.message,
  };
};


// PUT /api/v1/auth/profile (Profile Update)

export const updateProfileApi = async (
  data: UpdateProfileData,
): Promise<User> => {
  const response = await api.put<ApiResponse<{ user: User }>>(
    "/auth/profile",
    data,
  );

  if (response.data.success && response.data.data?.user) {
    return response.data.data.user;
  }

  throw new Error(response.data.message || "Profile update failed");
};

// ============================================================
// POST /api/v1/auth/change-password (পাসওয়ার্ড পরিবর্তন)
// ============================================================
export const changePasswordApi = async (
  data: ChangePasswordData,
): Promise<void> => {
  const response = await api.post<ApiResponse>("/auth/change-password", data);

  if (!response.data.success) {
    throw new Error(response.data.message || "Password change failed");
  }
};

// ============================================================
// POST /api/v1/auth/forgot-password (পাসওয়ার্ড রিসেট রিকোয়েস্ট)
// ============================================================
export const requestPasswordResetApi = async (email: string): Promise<void> => {
  const response = await api.post<ApiResponse>("/auth/forgot-password", {
    email,
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "Password reset request failed");
  }
};

// ============================================================
// POST /api/v1/auth/reset-password (নতুন পাসওয়ার্ড সেট)
// ============================================================
export const resetPasswordApi = async (
  token: string,
  newPassword: string,
): Promise<void> => {
  const response = await api.post<ApiResponse>("/auth/reset-password", {
    token,
    newPassword,
  });

  if (!response.data.success) {
    throw new Error(response.data.message || "Password reset failed");
  }
};
