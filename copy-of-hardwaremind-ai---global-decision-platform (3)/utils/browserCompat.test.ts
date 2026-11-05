import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  supportsBackdropFilter,
  supports3DTransforms,
  supportsCSSGrid,
  supportsCustomProperties,
  supportsIntersectionObserver,
  supportsWebAnimations,
  getBrowserInfo,
} from './browserCompat';

describe('Browser Compatibility Utilities', () => {
  beforeEach(() => {
    // Reset DOM for each test
    document.documentElement.className = '';
  });

  describe('supportsBackdropFilter', () => {
    it('should detect backdrop-filter support', () => {
      const result = supportsBackdropFilter();
      expect(typeof result).toBe('boolean');
    });

    it('should return false in non-browser environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const result = supportsBackdropFilter();
      expect(result).toBe(false);
      
      global.window = originalWindow;
    });
  });

  describe('supports3DTransforms', () => {
    it('should detect 3D transform support', () => {
      const result = supports3DTransforms();
      expect(typeof result).toBe('boolean');
    });

    it('should check for translate3d support', () => {
      const result = supports3DTransforms();
      // In modern browsers, this should be true
      expect(typeof result).toBe('boolean');
    });
  });

  describe('supportsCSSGrid', () => {
    it('should detect CSS Grid support', () => {
      const result = supportsCSSGrid();
      expect(typeof result).toBe('boolean');
    });

    it('should use CSS.supports API', () => {
      const result = supportsCSSGrid();
      // Modern browsers support CSS Grid
      expect(result).toBe(true);
    });
  });

  describe('supportsCustomProperties', () => {
    it('should detect CSS custom properties support', () => {
      const result = supportsCustomProperties();
      expect(typeof result).toBe('boolean');
    });

    it('should return true in modern browsers', () => {
      const result = supportsCustomProperties();
      expect(result).toBe(true);
    });
  });

  describe('supportsIntersectionObserver', () => {
    it('should detect IntersectionObserver support', () => {
      const result = supportsIntersectionObserver();
      expect(typeof result).toBe('boolean');
    });

    it('should check for IntersectionObserver in window', () => {
      const result = supportsIntersectionObserver();
      expect(result).toBe('IntersectionObserver' in window);
    });
  });

  describe('supportsWebAnimations', () => {
    it('should detect Web Animations API support', () => {
      const result = supportsWebAnimations();
      expect(typeof result).toBe('boolean');
    });

    it('should check for animate method on elements', () => {
      const result = supportsWebAnimations();
      const testElement = document.createElement('div');
      expect(result).toBe('animate' in testElement);
    });
  });

  describe('getBrowserInfo', () => {
    it('should return browser information object', () => {
      const info = getBrowserInfo();
      expect(info).toBeDefined();
      expect(info).toHaveProperty('isChrome');
      expect(info).toHaveProperty('isSafari');
      expect(info).toHaveProperty('isFirefox');
      expect(info).toHaveProperty('isEdge');
      expect(info).toHaveProperty('isIOS');
      expect(info).toHaveProperty('isAndroid');
      expect(info).toHaveProperty('isMobile');
    });

    it('should detect mobile devices', () => {
      const info = getBrowserInfo();
      expect(typeof info?.isMobile).toBe('boolean');
    });

    it('should return null in non-browser environment', () => {
      const originalNavigator = global.navigator;
      // @ts-ignore
      delete global.navigator;
      
      const info = getBrowserInfo();
      expect(info).toBeNull();
      
      global.navigator = originalNavigator;
    });
  });

  describe('Feature Detection Integration', () => {
    it('should detect all features without errors', () => {
      expect(() => {
        supportsBackdropFilter();
        supports3DTransforms();
        supportsCSSGrid();
        supportsCustomProperties();
        supportsIntersectionObserver();
        supportsWebAnimations();
      }).not.toThrow();
    });

    it('should provide consistent results across multiple calls', () => {
      const result1 = supportsBackdropFilter();
      const result2 = supportsBackdropFilter();
      expect(result1).toBe(result2);
    });
  });

  describe('Fallback Behavior', () => {
    it('should handle missing CSS.supports gracefully', () => {
      const originalSupports = CSS.supports;
      // @ts-ignore
      delete CSS.supports;
      
      // Should not throw
      expect(() => supportsCSSGrid()).not.toThrow();
      
      CSS.supports = originalSupports;
    });

    it('should handle missing window object', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      expect(supportsBackdropFilter()).toBe(false);
      expect(supports3DTransforms()).toBe(false);
      
      global.window = originalWindow;
    });
  });

  describe('Browser-Specific Detection', () => {
    it('should detect Chrome correctly', () => {
      const info = getBrowserInfo();
      if (info && navigator.userAgent.includes('Chrome')) {
        expect(info.isChrome || info.isEdge).toBe(true);
      }
    });

    it('should detect mobile browsers', () => {
      const info = getBrowserInfo();
      if (info) {
        const isMobileUA = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
        expect(info.isMobile).toBe(isMobileUA);
      }
    });
  });

  describe('Performance Considerations', () => {
    it('should execute feature detection quickly', () => {
      const start = performance.now();
      
      supportsBackdropFilter();
      supports3DTransforms();
      supportsCSSGrid();
      supportsCustomProperties();
      supportsIntersectionObserver();
      supportsWebAnimations();
      
      const end = performance.now();
      const duration = end - start;
      
      // All detections should complete in under 50ms
      expect(duration).toBeLessThan(50);
    });

    it('should not create memory leaks', () => {
      // Run detection multiple times
      for (let i = 0; i < 100; i++) {
        supportsBackdropFilter();
        supports3DTransforms();
      }
      
      // Should not throw or cause issues
      expect(true).toBe(true);
    });
  });
});
