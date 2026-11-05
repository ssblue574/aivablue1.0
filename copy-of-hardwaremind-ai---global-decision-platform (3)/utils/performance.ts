// Performance Utilities for AIVA Platform

/**
 * Performance level detection
 */
export type PerformanceLevel = 'high' | 'medium' | 'low';

/**
 * Detect device performance capabilities
 * Based on CPU cores, memory, and device characteristics
 */
export const detectPerformance = (): PerformanceLevel => {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check memory (if available)
  const memory = (performance as any).memory;
  const memoryLimit = memory?.jsHeapSizeLimit || 0;
  
  // Check device pixel ratio (higher = more pixels to render)
  const dpr = window.devicePixelRatio || 1;
  
  // Check if mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  // High performance: 8+ cores, 4GB+ memory, desktop
  if (cores >= 8 && memoryLimit > 4000000000 && !isMobile) {
    return 'high';
  }
  
  // Medium performance: 4+ cores, not too high DPR
  if (cores >= 4 && dpr <= 2) {
    return 'medium';
  }
  
  // Low performance: everything else (mobile, low-end devices)
  return 'low';
};

/**
 * Get particle count based on performance level
 */
export const getParticleCount = (
  baseCount: number,
  performanceLevel: PerformanceLevel
): number => {
  const multipliers = {
    high: 1.0,
    medium: 0.5,
    low: 0.25,
  };
  
  return Math.floor(baseCount * multipliers[performanceLevel]);
};

/**
 * Animation quality configuration based on performance
 */
export interface AnimationQualityConfig {
  particleCount: number;
  animationQuality: 'high' | 'medium' | 'low';
  enableBlur: boolean;
  enable3D: boolean;
  enableShadows: boolean;
  maxFPS: number;
}

/**
 * Get optimal animation configuration based on performance level
 */
export const getAnimationConfig = (
  performanceLevel: PerformanceLevel
): AnimationQualityConfig => {
  switch (performanceLevel) {
    case 'high':
      return {
        particleCount: 200,
        animationQuality: 'high',
        enableBlur: true,
        enable3D: true,
        enableShadows: true,
        maxFPS: 60,
      };
    case 'medium':
      return {
        particleCount: 100,
        animationQuality: 'medium',
        enableBlur: true,
        enable3D: false,
        enableShadows: false,
        maxFPS: 60,
      };
    case 'low':
      return {
        particleCount: 50,
        animationQuality: 'low',
        enableBlur: false,
        enable3D: false,
        enableShadows: false,
        maxFPS: 30,
      };
  }
};

/**
 * FPS Monitor for tracking animation performance
 */
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private rafId: number | null = null;
  private callback?: (fps: number) => void;
  
  /**
   * Start monitoring FPS
   * @param callback Called with average FPS every frame
   */
  start(callback?: (fps: number) => void) {
    this.callback = callback;
    
    const measure = () => {
      const now = performance.now();
      const delta = now - this.lastTime;
      const fps = 1000 / delta;
      
      // Keep last 60 frames for averaging
      this.frames.push(fps);
      if (this.frames.length > 60) {
        this.frames.shift();
      }
      
      this.lastTime = now;
      
      // Call callback with average FPS
      if (this.callback) {
        const avgFPS = this.getAverageFPS();
        this.callback(avgFPS);
      }
      
      this.rafId = requestAnimationFrame(measure);
    };
    
    this.rafId = requestAnimationFrame(measure);
  }
  
  /**
   * Stop monitoring FPS
   */
  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  /**
   * Get average FPS from recent frames
   */
  getAverageFPS(): number {
    if (this.frames.length === 0) return 0;
    const sum = this.frames.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.frames.length);
  }
  
  /**
   * Get minimum FPS from recent frames
   */
  getMinFPS(): number {
    if (this.frames.length === 0) return 0;
    return Math.round(Math.min(...this.frames));
  }
  
  /**
   * Get maximum FPS from recent frames
   */
  getMaxFPS(): number {
    if (this.frames.length === 0) return 0;
    return Math.round(Math.max(...this.frames));
  }
  
  /**
   * Reset the monitor
   */
  reset() {
    this.frames = [];
    this.lastTime = performance.now();
  }
  
  /**
   * Check if performance is good (>= 55 FPS)
   */
  isPerformanceGood(): boolean {
    return this.getAverageFPS() >= 55;
  }
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if GPU acceleration is available
 */
export const hasGPUAcceleration = (): boolean => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return !!gl;
};

/**
 * Throttle function execution
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Debounce function execution
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Request idle callback with fallback
 */
export const requestIdleCallback =
  (window as any).requestIdleCallback ||
  function (cb: IdleRequestCallback) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };

/**
 * Cancel idle callback with fallback
 */
export const cancelIdleCallback =
  (window as any).cancelIdleCallback ||
  function (id: number) {
    clearTimeout(id);
  };

/**
 * Measure component render time
 */
export const measureRenderTime = (componentName: string, callback: () => void) => {
  const start = performance.now();
  callback();
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 16) {
    // Warn if render takes longer than one frame (16ms at 60fps)
    console.warn(`${componentName} render took ${duration.toFixed(2)}ms`);
  }
  
  return duration;
};

/**
 * Check if device is low-end
 */
export const isLowEndDevice = (): boolean => {
  const performance = detectPerformance();
  return performance === 'low';
};

/**
 * Get optimal image quality based on performance
 */
export const getImageQuality = (performanceLevel: PerformanceLevel): number => {
  switch (performanceLevel) {
    case 'high':
      return 1.0; // Full quality
    case 'medium':
      return 0.8; // 80% quality
    case 'low':
      return 0.6; // 60% quality
  }
};

/**
 * Adaptive loading strategy
 */
export interface LoadingStrategy {
  lazyLoad: boolean;
  preload: boolean;
  priority: 'high' | 'low';
}

export const getLoadingStrategy = (
  performanceLevel: PerformanceLevel
): LoadingStrategy => {
  switch (performanceLevel) {
    case 'high':
      return {
        lazyLoad: false,
        preload: true,
        priority: 'high',
      };
    case 'medium':
      return {
        lazyLoad: true,
        preload: false,
        priority: 'high',
      };
    case 'low':
      return {
        lazyLoad: true,
        preload: false,
        priority: 'low',
      };
  }
};
