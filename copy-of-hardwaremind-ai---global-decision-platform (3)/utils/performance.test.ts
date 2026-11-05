import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  detectPerformance,
  getParticleCount,
  getAnimationConfig,
  FPSMonitor,
  prefersReducedMotion,
  hasGPUAcceleration,
  throttle,
  debounce,
  isLowEndDevice,
  getImageQuality,
  getLoadingStrategy,
} from './performance';

describe('Performance Utilities', () => {
  describe('detectPerformance', () => {
    it('should return a valid performance level', () => {
      const level = detectPerformance();
      expect(['high', 'medium', 'low']).toContain(level);
    });
  });

  describe('getParticleCount', () => {
    it('should return full count for high performance', () => {
      const count = getParticleCount(200, 'high');
      expect(count).toBe(200);
    });

    it('should return half count for medium performance', () => {
      const count = getParticleCount(200, 'medium');
      expect(count).toBe(100);
    });

    it('should return quarter count for low performance', () => {
      const count = getParticleCount(200, 'low');
      expect(count).toBe(50);
    });
  });

  describe('getAnimationConfig', () => {
    it('should return high quality config for high performance', () => {
      const config = getAnimationConfig('high');
      expect(config.particleCount).toBe(200);
      expect(config.animationQuality).toBe('high');
      expect(config.enableBlur).toBe(true);
      expect(config.enable3D).toBe(true);
      expect(config.enableShadows).toBe(true);
      expect(config.maxFPS).toBe(60);
    });

    it('should return medium quality config for medium performance', () => {
      const config = getAnimationConfig('medium');
      expect(config.particleCount).toBe(100);
      expect(config.animationQuality).toBe('medium');
      expect(config.enableBlur).toBe(true);
      expect(config.enable3D).toBe(false);
      expect(config.enableShadows).toBe(false);
      expect(config.maxFPS).toBe(60);
    });

    it('should return low quality config for low performance', () => {
      const config = getAnimationConfig('low');
      expect(config.particleCount).toBe(50);
      expect(config.animationQuality).toBe('low');
      expect(config.enableBlur).toBe(false);
      expect(config.enable3D).toBe(false);
      expect(config.enableShadows).toBe(false);
      expect(config.maxFPS).toBe(30);
    });
  });

  describe('FPSMonitor', () => {
    it('should start and stop monitoring', () => {
      const monitor = new FPSMonitor();
      monitor.start();
      expect(monitor.getAverageFPS()).toBeGreaterThanOrEqual(0);
      monitor.stop();
    });

    it('should track FPS values', () => {
      const monitor = new FPSMonitor();
      monitor.start();
      
      // Wait a bit for frames to accumulate
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const avgFPS = monitor.getAverageFPS();
          expect(avgFPS).toBeGreaterThan(0);
          monitor.stop();
          resolve();
        }, 100);
      });
    });

    it('should reset FPS tracking', () => {
      const monitor = new FPSMonitor();
      monitor.start();
      
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          monitor.reset();
          const avgFPS = monitor.getAverageFPS();
          expect(avgFPS).toBe(0);
          monitor.stop();
          resolve();
        }, 50);
      });
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', () => {
      vi.useFakeTimers();
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });

  describe('isLowEndDevice', () => {
    it('should return a boolean', () => {
      const result = isLowEndDevice();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getImageQuality', () => {
    it('should return 1.0 for high performance', () => {
      expect(getImageQuality('high')).toBe(1.0);
    });

    it('should return 0.8 for medium performance', () => {
      expect(getImageQuality('medium')).toBe(0.8);
    });

    it('should return 0.6 for low performance', () => {
      expect(getImageQuality('low')).toBe(0.6);
    });
  });

  describe('getLoadingStrategy', () => {
    it('should return aggressive loading for high performance', () => {
      const strategy = getLoadingStrategy('high');
      expect(strategy.lazyLoad).toBe(false);
      expect(strategy.preload).toBe(true);
      expect(strategy.priority).toBe('high');
    });

    it('should return balanced loading for medium performance', () => {
      const strategy = getLoadingStrategy('medium');
      expect(strategy.lazyLoad).toBe(true);
      expect(strategy.preload).toBe(false);
      expect(strategy.priority).toBe('high');
    });

    it('should return conservative loading for low performance', () => {
      const strategy = getLoadingStrategy('low');
      expect(strategy.lazyLoad).toBe(true);
      expect(strategy.preload).toBe(false);
      expect(strategy.priority).toBe('low');
    });
  });

  describe('prefersReducedMotion', () => {
    it('should return a boolean', () => {
      const result = prefersReducedMotion();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('hasGPUAcceleration', () => {
    it('should return a boolean', () => {
      const result = hasGPUAcceleration();
      expect(typeof result).toBe('boolean');
    });
  });
});
