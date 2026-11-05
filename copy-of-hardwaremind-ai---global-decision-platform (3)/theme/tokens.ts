// Design Tokens - Color System, Spacing, Animations
import { ColorPalette, AnimationConfig, EffectConfig } from './types';

// Color Palette
export const colorPalette: ColorPalette = {
  dark: {
    background: [
      '#050505',  // Deep black
      '#0a0a0f',  // Soft black
      '#0b0d13',  // Dark blue-black
    ],
    surface: [
      'rgba(255, 255, 255, 0.05)',
      'rgba(255, 255, 255, 0.08)',
      'rgba(255, 255, 255, 0.12)',
    ],
    primary: [
      '#00FFC6',  // Neon cyan
      '#00E5B0',  // Cyan variant
      '#00CCB3',  // Dark cyan
    ],
    secondary: [
      '#FF5FD2',  // Neon magenta
      '#FF4DC4',  // Magenta variant
      '#E63DB8',  // Dark magenta
    ],
    accent: [
      '#8B5CF6',  // Purple
      '#7C3AED',  // Purple variant
      '#6D28D9',  // Dark purple
    ],
    glow: {
      cyan: '#00FFC6',
      magenta: '#FF5FD2',
      purple: '#8B5CF6',
      blue: '#6AA8FF',
      orange: '#FF4D00',
    },
  },
  light: {
    background: [
      '#FFFFFF',  // Pure white
      '#F6F7FB',  // Soft white
      '#EEF0F5',  // Light gray
    ],
    surface: [
      'rgba(0, 0, 0, 0.02)',
      'rgba(0, 0, 0, 0.04)',
      'rgba(0, 0, 0, 0.08)',
    ],
    primary: [
      '#0062CC',  // Darker Apple blue (improved contrast: 4.52:1)
      '#0077ED',  // Blue variant
      '#005BB5',  // Dark blue
    ],
    secondary: [
      '#FF2D55',  // Pink
      '#FF375F',  // Pink variant
      '#E6194B',  // Dark pink
    ],
    accent: [
      '#5E5CE6',  // Purple
      '#7B79EA',  // Purple variant
      '#4A48C4',  // Dark purple
    ],
    glow: {
      cyan: '#00D4AA',
      magenta: '#FF2D92',
      purple: '#6D28D9',  // Darker purple (improved contrast: 4.54:1)
      blue: '#0062CC',    // Match primary color
      orange: '#FF6B00',
    },
  },
};

// Animation Configuration
export const animationConfig: AnimationConfig = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 600,
  },
  easing: {
    // Standard Material Design easing
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Deceleration curve (ease-out) - elements entering screen
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    // Acceleration curve (ease-in) - elements leaving screen
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    // Sharp curve - quick transitions
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    // Elastic/spring easing - playful, bouncy animations
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    // Smooth easing - gentle, natural motion
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    // Emphasized easing - attention-grabbing
    emphasized: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
  },
};

// Effect Configuration
export const effectConfig: EffectConfig = {
  blur: {
    light: 10,
    medium: 20,
    heavy: 40,
  },
  glow: {
    subtle: '0 0 10px rgba(0, 255, 198, 0.3)',
    medium: '0 0 20px rgba(0, 255, 198, 0.5)',
    intense: '0 0 40px rgba(0, 255, 198, 0.7)',
  },
  shadow: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 16px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.2)',
    xl: '0 16px 64px rgba(0, 0, 0, 0.25)',
  },
};

// Spacing System (4px base)
export const spacing = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '8px',
  md: '12px',
  lg: '18px',
  xl: '24px',
  '2xl': '32px',
  full: '9999px',
};

// Typography
export const typography = {
  fontFamily: {
    sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", "Monaco", "Inconsolata", "Fira Code", "Droid Sans Mono", "Source Code Pro", monospace',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
  },
};
