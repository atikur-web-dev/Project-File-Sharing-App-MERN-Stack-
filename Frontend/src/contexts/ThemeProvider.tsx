// src/contexts/ThemeProvider.tsx
// এই ফাইলের কাজ: থিম পরিবর্তনের সব লজিক
// - localStorage এ থিম সংরক্ষণ
// - body তে dark ক্লাস যোগ/বাদ
// - পুরো এপে থিম সরবরাহ

import React, { useState, useEffect, useCallback } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

// ============================================================
// Props টাইপ
// ============================================================
interface ThemeProviderProps {
  children: React.ReactNode;        // ভিতরের সব কম্পোনেন্ট
  defaultTheme?: Theme;             // ডিফল্ট থিম (optional)
  storageKey?: string;              // localStorage এর কী (optional)
}

// ============================================================
// ThemeProvider কম্পোনেন্ট
// ============================================================
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = "light",        // ডিফল্ট হালকা
  storageKey = "app-theme",      // localStorage এর নাম
}) => {
  // ============================================================
  // স্টেট: বর্তমান থিম
  // ============================================================
  // useState-এর ভিতরে ফাংশন দিলে শুধু প্রথমবার কল হয়
  // এখানে আমরা localStorage চেক করি + সিস্টেম প্রেফারেন্স চেক করি
  const [theme, setThemeState] = useState<Theme>(() => {
    // SSR (Server Side Rendering) চেক - ব্রাউজার না থাকলে ডিফল্ট
    if (typeof window === "undefined") return defaultTheme;

    // localStorage থেকে আগের থিম পড়া
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored && (stored === "light" || stored === "dark")) {
      return stored; // localStorage এ থাকলে সেটাই ব্যবহার
    }

    // সিস্টেম প্রেফারেন্স চেক (ডিভাইসের ডার্ক মোড সেটিং)
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }

    return defaultTheme;
  });

  // ============================================================
  // ইফেক্ট: থিম চেঞ্জ হলে body তে dark ক্লাস যোগ/বাদ
  // ============================================================
  useEffect(() => {
    const root = document.documentElement; // <html> element

    if (theme === "dark") {
      root.classList.add("dark");  // TailwindCSS dark mode ON
    } else {
      root.classList.remove("dark"); // TailwindCSS dark mode OFF
    }

    // localStorage-এ থিম সংরক্ষণ
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]); // theme বা storageKey চেঞ্জ হলে চলবে

  // ============================================================
  // থিম সেট করার ফাংশন (মেমোাইজড যাতে বারবার তৈরি না হয়)
  // ============================================================
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  // ============================================================
  // থিম টগল করার ফাংশন
  // ============================================================
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // ============================================================
  // কনটেক্সট ভ্যালু
  // ============================================================
  const value = {
    theme,
    toggleTheme,
    setTheme,
  };

  // ============================================================
  // Provider দিয়ে পুরো এপ wrap
  // ============================================================
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};