import { useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext';

/**
 * Hook for automatic theme switching based on system preference
 */
export const useAutoTheme = (enabled: boolean = true) => {
  const { theme, setTheme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (!enabled) return;

    // Get initial system theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newTheme);
      setTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [enabled, setTheme]);

  return {
    systemTheme,
    isAutoMode: enabled,
  };
};

