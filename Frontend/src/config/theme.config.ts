// src/config/theme.config.ts
// এই ফাইলের কাজ: থিম সম্পর্কিত সব কনফিগারেশন এক জায়গায় রাখা

// ============================================================
// থিম টাইপ
// ============================================================
export const THEME = {
  LIGHT: "light" as const,
  DARK: "dark" as const,
  SYSTEM: "system" as const,
};

export type Theme = (typeof THEME)[keyof typeof THEME];

// ============================================================
// থিম কনফিগারেশন
// ============================================================
export const THEME_CONFIG = {
  // লোকাল স্টোরেজ কী
  STORAGE_KEY: "app-theme",

  // ডিফল্ট থিম
  DEFAULT: THEME.LIGHT,

  // ডার্ক মোডের জন্য CSS ক্লাস
  DARK_CLASS: "dark",
} as const;