// src/hooks/useMediaQuery.ts
// এই হুকের কাজ: স্ক্রিন সাইজ চেক করা (মোবাইল/ট্যাবলেট/ডেস্কটপ)

import { useState, useEffect } from "react";

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// নির্দিষ্ট media query ম্যাচ করে কিনা
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

// নির্দিষ্ট breakpoint থেকে ছোট কিনা
export function useIsSmallerThan(breakpoint: Breakpoint): boolean {
  const maxWidth = breakpoints[breakpoint] - 1;
  return useMediaQuery(`(max-width: ${maxWidth}px)`);
}

// নির্দিষ্ট breakpoint থেকে বড় কিনা
export function useIsLargerThan(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`);
}

// সব screen size একবারে চেক
export function useScreenSize() {
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);
  const is2xl = useMediaQuery(`(min-width: ${breakpoints["2xl"]}px)`);

  return {
    isMobile: !isSm,
    isTablet: isSm && !isLg,
    isDesktop: isLg,
    isLargeDesktop: is2xl,
    breakpoints: { sm: isSm, md: isMd, lg: isLg, xl: isXl, "2xl": is2xl },
  };
}