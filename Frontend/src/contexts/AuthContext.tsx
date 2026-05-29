// src/contexts/AuthContext.tsx
// Purpose of this file: Create a global authentication context
// So the entire app knows whether the user is logged in or not

import { createContext } from "react";
import type { User } from "../types";

// What will be available inside the context
export interface AuthContextType {
  user: User | null; // User data (null = not logged in)
  isLoading: boolean; // Whether data is loading (during initial auth check)
  isAuthenticated: boolean; // Whether user is logged in (user !== null)
  setUser: (user: User | null) => void; // Function to update user
  logout: () => Promise<void>; // Logout function
}

// Default values (used if there is no Provider)
const defaultAuthContextValue: AuthContextType = {
  user: null,
  isLoading: true, // Initially true = "checking authentication"
  isAuthenticated: false,
  setUser: () => {},
  logout: async () => {},
};

// Create context
export const AuthContext =
  createContext<AuthContextType>(defaultAuthContextValue);