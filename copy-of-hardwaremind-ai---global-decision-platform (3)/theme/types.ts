// Theme System Types
export type Theme = 'dark' | 'light';

export interface GlowColors {
  cyan: string;      // #00FFC6
  magenta: string;   // #FF5FD2
  purple: string;    // #8B5CF6
  blue: string;      // #6AA8FF
  orange: string;    // #FF4D00
}

export interface ColorPalette {
  dark: {
    background: string[];      // Gradient backgrounds
    surface: string[];          // Surface colors
    primary: string[];          // Primary colors (cyan)
    secondary: string[];        // Secondary colors (magenta)
    accent: string[];           // Accent colors (purple)
    glow: GlowColors;          // Glow effects
  };
  light: {
    background: string[];
    surface: string[];
    primary: string[];
    secondary: string[];
    accent: string[];
    glow: GlowColors;
  };
}

export interface AnimationConfig {
  duration: {
    fast: number;      // 150ms
    normal: number;    // 300ms
    slow: number;      // 600ms
  };
  easing: {
    standard: string;  // cubic-bezier(0.4, 0, 0.2, 1)
    decelerate: string; // cubic-bezier(0, 0, 0.2, 1)
    accelerate: string; // cubic-bezier(0.4, 0, 1, 1)
    sharp: string;     // cubic-bezier(0.4, 0, 0.6, 1)
    elastic: string;   // cubic-bezier(0.68, -0.55, 0.265, 1.55)
    smooth: string;    // cubic-bezier(0.25, 0.46, 0.45, 0.94)
    emphasized: string; // cubic-bezier(0.05, 0.7, 0.1, 1.0)
  };
}

export interface EffectConfig {
  blur: {
    light: number;     // 10px
    medium: number;    // 20px
    heavy: number;     // 40px
  };
  glow: {
    subtle: string;    // 0 0 10px rgba(...)
    medium: string;    // 0 0 20px rgba(...)
    intense: string;   // 0 0 40px rgba(...)
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface ThemeConfig {
  id: string;
  name: string;
  colors: ColorPalette;
  animations: AnimationConfig;
  effects: EffectConfig;
}

export interface ThemeEngineContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: ColorPalette;
  animations: AnimationConfig;
  effects: EffectConfig;
}
