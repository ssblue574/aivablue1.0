/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'dark-bg': {
          primary: '#050505',
          secondary: '#0a0a0f',
          tertiary: '#0b0d13',
        },
        'dark-surface': {
          primary: 'rgba(255, 255, 255, 0.05)',
          secondary: 'rgba(255, 255, 255, 0.08)',
          tertiary: 'rgba(255, 255, 255, 0.12)',
        },
        // Light theme colors
        'light-bg': {
          primary: '#FFFFFF',
          secondary: '#F6F7FB',
          tertiary: '#EEF0F5',
        },
        'light-surface': {
          primary: 'rgba(0, 0, 0, 0.02)',
          secondary: 'rgba(0, 0, 0, 0.04)',
          tertiary: 'rgba(0, 0, 0, 0.08)',
        },
        // Primary colors
        primary: {
          DEFAULT: 'var(--color-primary)',
          variant: 'var(--color-primary-variant)',
          dark: 'var(--color-primary-dark)',
        },
        // Secondary colors
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          variant: 'var(--color-secondary-variant)',
          dark: 'var(--color-secondary-dark)',
        },
        // Accent colors
        accent: {
          DEFAULT: 'var(--color-accent)',
          variant: 'var(--color-accent-variant)',
          dark: 'var(--color-accent-dark)',
        },
        // Glow colors
        glow: {
          cyan: 'var(--glow-cyan)',
          magenta: 'var(--glow-magenta)',
          purple: 'var(--glow-purple)',
          blue: 'var(--glow-blue)',
          orange: 'var(--glow-orange)',
        },
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
        '32': '128px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '18px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', '"Monaco"', '"Inconsolata"', '"Fira Code"', '"Droid Sans Mono"', '"Source Code Pro"', 'monospace'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.6' }],
        'base': ['16px', { lineHeight: '1.7' }],
        'lg': ['18px', { lineHeight: '1.7' }],
        'xl': ['20px', { lineHeight: '1.6' }],
        '2xl': ['24px', { lineHeight: '1.5' }],
        '3xl': ['30px', { lineHeight: '1.4' }],
        '4xl': ['36px', { lineHeight: '1.3' }],
        '5xl': ['48px', { lineHeight: '1.2' }],
        '6xl': ['60px', { lineHeight: '1.1' }],
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
      fontFeatureSettings: {
        'numeric': '"tnum" 1',
        'ligatures': '"liga" 1, "calt" 1',
        'kerning': '"kern" 1',
      },
      backdropBlur: {
        light: '10px',
        medium: '20px',
        heavy: '40px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px var(--glow-cyan)',
        'glow-magenta': '0 0 20px var(--glow-magenta)',
        'glow-purple': '0 0 20px var(--glow-purple)',
        'glow-subtle': '0 0 10px rgba(0, 255, 198, 0.3)',
        'glow-medium': '0 0 20px rgba(0, 255, 198, 0.5)',
        'glow-intense': '0 0 40px rgba(0, 255, 198, 0.7)',
        'sm': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'lg': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'xl': '0 16px 64px rgba(0, 0, 0, 0.25)',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '600ms',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'decelerate': 'cubic-bezier(0, 0, 0.2, 1)',
        'accelerate': 'cubic-bezier(0.4, 0, 1, 1)',
        'sharp': 'cubic-bezier(0.4, 0, 0.6, 1)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}
