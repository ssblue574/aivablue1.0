// Animation Utility Functions

/**
 * Easing Functions
 * Based on Robert Penner's easing equations
 */
export const easing = {
  // Standard easing
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Deceleration curve (ease-out)
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  
  // Acceleration curve (ease-in)
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  
  // Sharp curve
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  
  // Elastic easing for spring-like animations
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Smooth easing
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

/**
 * Performance Detection
 * Detects device performance capabilities
 */
export type PerformanceLevel = 'high' | 'medium' | 'low';

export const detectPerformance = (): PerformanceLevel => {
  // Check hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 2;
  
  // Check memory (if available)
  const memory = (performance as any).memory;
  const memoryLimit = memory?.jsHeapSizeLimit || 0;
  
  // Check device pixel ratio
  const dpr = window.devicePixelRatio || 1;
  
  // High performance: 8+ cores, 4GB+ memory
  if (cores >= 8 && memoryLimit > 4000000000) {
    return 'high';
  }
  
  // Medium performance: 4+ cores
  if (cores >= 4 && dpr <= 2) {
    return 'medium';
  }
  
  // Low performance: everything else
  return 'low';
};

/**
 * FPS Monitor
 * Monitors frame rate for performance tracking
 */
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private rafId: number | null = null;
  
  start(callback?: (fps: number) => void) {
    const measure = () => {
      const now = performance.now();
      const delta = now - this.lastTime;
      const fps = 1000 / delta;
      
      this.frames.push(fps);
      if (this.frames.length > 60) {
        this.frames.shift();
      }
      
      this.lastTime = now;
      
      if (callback) {
        const avgFPS = this.getAverageFPS();
        callback(avgFPS);
      }
      
      this.rafId = requestAnimationFrame(measure);
    };
    
    this.rafId = requestAnimationFrame(measure);
  }
  
  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  getAverageFPS(): number {
    if (this.frames.length === 0) return 0;
    const sum = this.frames.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.frames.length);
  }
  
  reset() {
    this.frames = [];
    this.lastTime = performance.now();
  }
}

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user preference
 */
export const getAnimationDuration = (duration: number): number => {
  return prefersReducedMotion() ? 1 : duration;
};

/**
 * Create a spring animation config
 */
export interface SpringConfig {
  tension: number;
  friction: number;
  mass: number;
}

export const springPresets = {
  default: { tension: 170, friction: 26, mass: 1 },
  gentle: { tension: 120, friction: 14, mass: 1 },
  wobbly: { tension: 180, friction: 12, mass: 1 },
  stiff: { tension: 210, friction: 20, mass: 1 },
  slow: { tension: 280, friction: 60, mass: 1 },
  molasses: { tension: 280, friction: 120, mass: 1 },
};

/**
 * Interpolate between two values
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Map a value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
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
 * Get optimal animation config based on performance
 */
export interface AnimationQualityConfig {
  particleCount: number;
  animationQuality: 'high' | 'medium' | 'low';
  enableBlur: boolean;
  enable3D: boolean;
}

export const getAnimationConfig = (
  performance: PerformanceLevel
): AnimationQualityConfig => {
  switch (performance) {
    case 'high':
      return {
        particleCount: 200,
        animationQuality: 'high',
        enableBlur: true,
        enable3D: true,
      };
    case 'medium':
      return {
        particleCount: 100,
        animationQuality: 'medium',
        enableBlur: true,
        enable3D: false,
      };
    case 'low':
      return {
        particleCount: 50,
        animationQuality: 'low',
        enableBlur: false,
        enable3D: false,
      };
  }
};

/**
 * Request animation frame with fallback
 */
export const requestAnimFrame = (() => {
  return (
    window.requestAnimationFrame ||
    (window as any).webkitRequestAnimationFrame ||
    (window as any).mozRequestAnimationFrame ||
    function (callback: FrameRequestCallback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

/**
 * Cancel animation frame with fallback
 */
export const cancelAnimFrame = (() => {
  return (
    window.cancelAnimationFrame ||
    (window as any).webkitCancelAnimationFrame ||
    (window as any).mozCancelAnimationFrame ||
    function (id: number) {
      window.clearTimeout(id);
    }
  );
})();
