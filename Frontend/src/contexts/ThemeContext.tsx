// src/contexts/ThemeContext.tsx
// এই ফাইলের কাজ: থিম সম্পর্কিত গ্লোবাল কনটেক্সট তৈরি করা
// এখানে শুধু Context Create করা হয় - কোনো লজিক নেই
// লজিক থাকবে ThemeProvider.tsx ফাইলে

import { createContext } from "react";

// ============================================================
// থিমের টাইপ ডেফিনিশন
// ============================================================
// Theme: শুধু "light" অথবা "dark" হতে পারে
export type Theme = "light" | "dark";

// ============================================================
// কনটেক্সটে কী কী ডাটা আর ফাংশন থাকবে
// ============================================================
export interface ThemeContextType {
  theme: Theme;              // বর্তমান থিম (light/dark)
  toggleTheme: () => void;   // থিম টগল করার ফাংশন
  setTheme: (theme: Theme) => void; // সরাসরি থিম সেট করার ফাংশন
}

// ============================================================
// কনটেক্সট তৈরি
// ============================================================
// createContext() - React এর বিল্ট-ইন ফাংশন
// undefined - ডিফল্ট ভ্যালু (Provider ছাড়া ব্যবহার করলে এরর দেবে)
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);