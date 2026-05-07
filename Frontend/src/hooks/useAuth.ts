// src/hooks/useAuth.ts
// এই হুকের কাজ: AuthContext থেকে সহজে ইউজার ডাটা নেওয়া

import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  // Provider এর বাইরে ব্যবহার করলে এরর দেবে
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider. " +
      "Wrap your app with <AuthProvider> in the component tree."
    );
  }

  return context;
};