// src/contexts/AuthProvider.tsx
// এই ফাইলের কাজ: অথেনটিকেশনের আসল লজিক
// - অ্যাপ চালুর সময় ইউজার চেক করা
// - লগআউট হ্যান্ডেল করা
// - পুরো এপে ইউজার ডাটা সরবরাহ

import React, { useState, useEffect, useCallback } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";
import type { User } from "../types";
import { getCurrentUserApi, logoutApi } from "../api/authApi";

// ============================================================
// Props টাইপ
// ============================================================
interface AuthProviderProps {
  children: React.ReactNode;
}

// ============================================================
// AuthProvider কম্পোনেন্ট
// ============================================================
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ============================================================
  // অ্যাপ চালুর সময়: ব্যাকএন্ড থেকে ইউজার চেক
  // ============================================================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUserApi(); // GET /auth/me
        setUser(currentUser); // ইউজার থাকলে সেট হবে, না থাকলে null
      } catch {
        setUser(null); // এরর হলে null
      } finally {
        setIsLoading(false); // চেক শেষ
      }
    };

    checkAuth();
  }, []); // [] = শুধু প্রথমবার চলবে

  // ============================================================
  // লগআউট ফাংশন
  // ============================================================
  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutApi(); // POST /auth/logout
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setUser(null); // যাই হোক, ইউজার সরাও
    }
  }, []);

  // ============================================================
  // কনটেক্সট ভ্যালু
  // ============================================================
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null, // user থাকলে true
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};