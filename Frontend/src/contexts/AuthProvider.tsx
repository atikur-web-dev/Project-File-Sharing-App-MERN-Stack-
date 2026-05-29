// src/contexts/AuthProvider.tsx
// Purpose of this file:
// - Handle the main authentication logic
// - Check user authentication when the app starts
// - Handle logout
// - Provide user data across the entire app

import React, { useState, useEffect, useCallback } from "react";
import { AuthContext, type AuthContextType } from "./AuthContext";
import type { User } from "../types";
import { getCurrentUserApi, logoutApi } from "../api/authApi";

// Type for AuthProvider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication when the app starts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUserApi(); // GET /auth/me
        setUser(currentUser); // Set user if logged in, otherwise null
      } catch {
        setUser(null); // Set null if request fails
      } finally {
        setIsLoading(false); // Authentication check completed
      }
    };

    checkAuth();
  }, []); // Runs only once on initial render

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutApi(); // POST /auth/logout
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      setUser(null); // Remove user data no matter what happens
    }
  }, []);

  // Context value
  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null, // true if user exists
    setUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};