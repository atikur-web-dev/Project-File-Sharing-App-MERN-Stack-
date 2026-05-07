// src/contexts/AuthContext.tsx
// এই ফাইলের কাজ: অথেনটিকেশন সম্পর্কিত গ্লোবাল কনটেক্সট তৈরি করা
// পুরো এপ জানে ইউজার লগইন আছে কিনা

import { createContext } from "react";
import type { User } from "../types";

// ============================================================
// কনটেক্সটে কী কী থাকবে
// ============================================================
export interface AuthContextType {
  user: User | null;              // ইউজার ডাটা (null = লগইন করা নেই)
  isLoading: boolean;             // লোড হচ্ছে কিনা (প্রথমবার চেক করার সময়)
  isAuthenticated: boolean;       // লগইন আছে কিনা (user !== null)
  setUser: (user: User | null) => void; // ইউজার সেট করার ফাংশন
  logout: () => Promise<void>;    // লগআউট ফাংশন
}

// ============================================================
// ডিফল্ট ভ্যালু (Provider ছাড়া থাকলে ব্যবহার হবে)
// ============================================================
const defaultAuthContextValue: AuthContextType = {
  user: null,
  isLoading: true,       // প্রথমে true - "চেক করছি"
  isAuthenticated: false,
  setUser: () => {},
  logout: async () => {},
};

// ============================================================
// কনটেক্সট তৈরি
// ============================================================
export const AuthContext = createContext<AuthContextType>(defaultAuthContextValue);