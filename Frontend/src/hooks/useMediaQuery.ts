// src/hooks/useMediaQuery.ts
// Purpose of this hook: Detect screen size (mobile/tablet/desktop)

import { useState, useEffect } from "react";

export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Check whether a specific media query matches
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

// Check if the screen width is smaller than a specific breakpoint
export function useIsSmallerThan(breakpoint: Breakpoint): boolean {
  const maxWidth = breakpoints[breakpoint] - 1;
  return useMediaQuery(`(max-width: ${maxWidth}px)`);
}

// Check if the screen width is larger than or equal to a specific breakpoint
export function useIsLargerThan(breakpoint: Breakpoint): boolean {
  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]}px)`);
}

// Get all screen size information at once
export function useScreenSize() {
  const isSm = useMediaQuery(`(min-width: ${breakpoints.sm}px)`);
  const isMd = useMediaQuery(`(min-width: ${breakpoints.md}px)`);
  const isLg = useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
  const isXl = useMediaQuery(`(min-width: ${breakpoints.xl}px)`);
  const is2xl = useMediaQuery(`(min-width: ${breakpoints["2xl"]}px)`);

  return {
    isMobile: !isSm,          // Screen width below the "sm" breakpoint
    isTablet: isSm && !isLg,  // Between "sm" and "lg" breakpoints
    isDesktop: isLg,          // "lg" breakpoint and above
    isLargeDesktop: is2xl,    // "2xl" breakpoint and above

    breakpoints: {
      sm: isSm,
      md: isMd,
      lg: isLg,
      xl: isXl,
      "2xl": is2xl,
    },
  };
}