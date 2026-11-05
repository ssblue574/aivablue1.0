import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, ThemeEngineContextType } from './types';
import { colorPalette, animationConfig, effectConfig } from './tokens';

const ThemeEngineContext = createContext<ThemeEngineContextType | undefined>(undefined);

export const ThemeEngineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Add transition class for smooth theme switching
    root.classList.add('theme-transitioning');
    
    // Update data-theme attribute
    root.setAttribute('data-theme', theme);
    
    // Apply CSS custom properties for current theme
    const colors = colorPalette[theme];
    
    // Background colors
    root.style.setProperty('--bg-primary', colors.background[0]);
    root.style.setProperty('--bg-secondary', colors.background[1]);
    root.style.setProperty('--bg-tertiary', colors.background[2]);
    
    // Surface colors
    root.style.setProperty('--surface-primary', colors.surface[0]);
    root.style.setProperty('--surface-secondary', colors.surface[1]);
    root.style.setProperty('--surface-tertiary', colors.surface[2]);
    
    // Primary colors
    root.style.setProperty('--color-primary', colors.primary[0]);
    root.style.setProperty('--color-primary-variant', colors.primary[1]);
    root.style.setProperty('--color-primary-dark', colors.primary[2]);
    
    // Secondary colors
    root.style.setProperty('--color-secondary', colors.secondary[0]);
    root.style.setProperty('--color-secondary-variant', colors.secondary[1]);
    root.style.setProperty('--color-secondary-dark', colors.secondary[2]);
    
    // Accent colors
    root.style.setProperty('--color-accent', colors.accent[0]);
    root.style.setProperty('--color-accent-variant', colors.accent[1]);
    root.style.setProperty('--color-accent-dark', colors.accent[2]);
    
    // Glow colors
    root.style.setProperty('--glow-cyan', colors.glow.cyan);
    root.style.setProperty('--glow-magenta', colors.glow.magenta);
    root.style.setProperty('--glow-purple', colors.glow.purple);
    root.style.setProperty('--glow-blue', colors.glow.blue);
    root.style.setProperty('--glow-orange', colors.glow.orange);
    
    // Animation durations
    root.style.setProperty('--duration-fast', `${animationConfig.duration.fast}ms`);
    root.style.setProperty('--duration-normal', `${animationConfig.duration.normal}ms`);
    root.style.setProperty('--duration-slow', `${animationConfig.duration.slow}ms`);
    
    // Easing functions
    root.style.setProperty('--easing-standard', animationConfig.easing.standard);
    root.style.setProperty('--easing-decelerate', animationConfig.easing.decelerate);
    root.style.setProperty('--easing-accelerate', animationConfig.easing.accelerate);
    root.style.setProperty('--easing-sharp', animationConfig.easing.sharp);
    
    // Blur effects
    root.style.setProperty('--blur-light', `${effectConfig.blur.light}px`);
    root.style.setProperty('--blur-medium', `${effectConfig.blur.medium}px`);
    root.style.setProperty('--blur-heavy', `${effectConfig.blur.heavy}px`);
    
    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, animationConfig.duration.normal);
    
    return () => clearTimeout(timer);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('theme');
      if (!stored) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value: ThemeEngineContextType = {
    theme,
    toggleTheme,
    colors: colorPalette,
    animations: animationConfig,
    effects: effectConfig,
  };

  return (
    <ThemeEngineContext.Provider value={value}>
      {children}
    </ThemeEngineContext.Provider>
  );
};

export const useThemeEngine = () => {
  const context = useContext(ThemeEngineContext);
  if (context === undefined) {
    throw new Error('useThemeEngine must be used within a ThemeEngineProvider');
  }
  return context;
};
