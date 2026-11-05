/**
 * Accessibility Utilities
 * Provides functions for checking and ensuring accessibility compliance
 */

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 formula
 */
export const getRelativeLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Parse hex color to RGB
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Calculate contrast ratio between two colors
 * Returns a value between 1 and 21
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return 0;
  }

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if contrast ratio meets WCAG AA standard
 * AA requires 4.5:1 for normal text, 3:1 for large text
 */
export const meetsWCAG_AA = (
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  const threshold = isLargeText ? 3 : 4.5;
  return ratio >= threshold;
};

/**
 * Check if contrast ratio meets WCAG AAA standard
 * AAA requires 7:1 for normal text, 4.5:1 for large text
 */
export const meetsWCAG_AAA = (
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  const threshold = isLargeText ? 4.5 : 7;
  return ratio >= threshold;
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if user prefers high contrast
 */
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
};

/**
 * Get recommended text color for a background
 * Returns either black or white based on luminance
 */
export const getAccessibleTextColor = (backgroundColor: string): string => {
  const rgb = hexToRgb(backgroundColor);
  if (!rgb) return '#000000';

  const luminance = getRelativeLuminance(rgb.r, rgb.g, rgb.b);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Validate color contrast for a set of color pairs
 * Returns an array of validation results
 */
export interface ColorPairValidation {
  foreground: string;
  background: string;
  ratio: number;
  meetsAA: boolean;
  meetsAAA: boolean;
  isLargeText: boolean;
}

export const validateColorPairs = (
  pairs: Array<{ foreground: string; background: string; isLargeText?: boolean }>
): ColorPairValidation[] => {
  return pairs.map(({ foreground, background, isLargeText = false }) => {
    const ratio = getContrastRatio(foreground, background);
    return {
      foreground,
      background,
      ratio,
      meetsAA: meetsWCAG_AA(foreground, background, isLargeText),
      meetsAAA: meetsWCAG_AAA(foreground, background, isLargeText),
      isLargeText,
    };
  });
};

/**
 * Generate an accessibility report for the current theme
 */
export const generateAccessibilityReport = (theme: 'dark' | 'light'): {
  theme: string;
  colorPairs: ColorPairValidation[];
  summary: {
    total: number;
    passAA: number;
    passAAA: number;
    failAA: number;
  };
} => {
  const darkModePairs = [
    { foreground: '#FFFFFF', background: '#050505', isLargeText: false }, // Body text
    { foreground: '#00FFC6', background: '#050505', isLargeText: false }, // Primary accent
    { foreground: '#FF5FD2', background: '#050505', isLargeText: false }, // Secondary accent
    { foreground: '#6AA8FF', background: '#050505', isLargeText: false }, // Blue accent
    { foreground: '#FFFFFF', background: '#0a0a0f', isLargeText: false }, // Surface text
    { foreground: '#00FFC6', background: '#111111', isLargeText: false }, // Card accent
  ];

  const lightModePairs = [
    { foreground: '#000000', background: '#f6f7fb', isLargeText: false }, // Body text
    { foreground: '#0062CC', background: '#f6f7fb', isLargeText: false }, // Primary accent (improved)
    { foreground: '#6D28D9', background: '#f6f7fb', isLargeText: false }, // Purple accent (improved)
    { foreground: '#000000', background: '#ffffff', isLargeText: false }, // Surface text
    { foreground: '#0062CC', background: '#ffffff', isLargeText: false }, // Card accent
  ];

  const pairs = theme === 'dark' ? darkModePairs : lightModePairs;
  const colorPairs = validateColorPairs(pairs);

  const summary = {
    total: colorPairs.length,
    passAA: colorPairs.filter(p => p.meetsAA).length,
    passAAA: colorPairs.filter(p => p.meetsAAA).length,
    failAA: colorPairs.filter(p => !p.meetsAA).length,
  };

  return {
    theme,
    colorPairs,
    summary,
  };
};
