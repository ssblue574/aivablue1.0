import { useEffect, useState } from 'react';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  screenReader: boolean;
}

/**
 * Hook for managing accessibility settings
 */
export const useAccessibility = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'normal',
    screenReader: false,
  });

  useEffect(() => {
    // Detect user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Detect screen reader
    const hasScreenReader = 
      'speechSynthesis' in window ||
      'webkitSpeechSynthesis' in window ||
      navigator.userAgent.includes('NVDA') ||
      navigator.userAgent.includes('JAWS') ||
      navigator.userAgent.includes('VoiceOver');

    setSettings({
      reducedMotion: prefersReducedMotion,
      highContrast: prefersHighContrast,
      fontSize: 'normal',
      screenReader: hasScreenReader,
    });

    // Listen for preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastMediaQuery = window.matchMedia('(prefers-contrast: high)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    motionMediaQuery.addEventListener('change', handleMotionChange);
    contrastMediaQuery.addEventListener('change', handleContrastChange);

    return () => {
      motionMediaQuery.removeEventListener('change', handleMotionChange);
      contrastMediaQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  /**
   * Update font size
   */
  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setSettings(prev => ({ ...prev, fontSize: size }));
    document.documentElement.setAttribute('data-font-size', size);
  };

  /**
   * Toggle high contrast
   */
  const toggleHighContrast = () => {
    setSettings(prev => {
      const newValue = !prev.highContrast;
      document.documentElement.setAttribute('data-high-contrast', String(newValue));
      return { ...prev, highContrast: newValue };
    });
  };

  /**
   * Announce to screen readers
   */
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return {
    settings,
    setFontSize,
    toggleHighContrast,
    announce,
  };
};

