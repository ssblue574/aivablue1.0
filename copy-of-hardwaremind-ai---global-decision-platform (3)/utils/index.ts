// Animation Utilities - Main Export
export {
  easing,
  prefersReducedMotion,
  getAnimationDuration,
  springPresets,
  lerp,
  clamp,
  mapRange,
  requestAnimFrame,
  cancelAnimFrame,
} from './animation';

export type {
  SpringConfig,
} from './animation';

// Performance Utilities - Main Export
export {
  detectPerformance,
  getParticleCount,
  getAnimationConfig,
  FPSMonitor,
  hasGPUAcceleration,
  throttle,
  debounce,
  requestIdleCallback,
  cancelIdleCallback,
  measureRenderTime,
  isLowEndDevice,
  getImageQuality,
  getLoadingStrategy,
} from './performance';

export type {
  PerformanceLevel,
  AnimationQualityConfig,
  LoadingStrategy,
} from './performance';

// Interaction Feedback Utilities
export {
  createGlowEffect,
  createRippleEffect,
  createParticleBurst,
  create3DDepthEffect,
  reset3DDepthEffect,
  createSmoothHoverEffect,
  resetSmoothHoverEffect,
} from './interactionFeedback';

export type {
  GlowEffectConfig,
  RippleEffectConfig,
  ParticleBurstConfig,
  DepthEffectConfig,
  HoverEffectConfig,
} from './interactionFeedback';

// Typography Utilities
export {
  gradientText,
  glowText,
  animatedUnderline,
  typographyScale,
  animateNumber,
  easingFunctions,
  formatTabularNumber,
  createGradientText,
  createGlowText,
  applyAnimatedUnderline,
  typographyPresets,
} from './typography';

// Accessibility Utilities
export {
  getRelativeLuminance,
  hexToRgb,
  getContrastRatio,
  meetsWCAG_AA,
  meetsWCAG_AAA,
  prefersHighContrast,
  getAccessibleTextColor,
  validateColorPairs,
  generateAccessibilityReport,
} from './accessibility';

export type {
  ColorPairValidation,
} from './accessibility';

// Performance Hints Utilities
export {
  getGPUAcceleratedStyles,
  applyWillChange,
  removeWillChange,
  optimizeForAnimation,
} from './performanceHints';

// Browser Compatibility Utilities
export {
  supportsBackdropFilter,
  supports3DTransforms,
  supportsWebP,
  supportsCSSGrid,
  supportsCustomProperties,
  supportsIntersectionObserver,
  supportsWebAnimations,
  detectBrowserFeatures,
  addFeatureClasses,
  getBrowserInfo,
  logCompatibilityReport,
} from './browserCompat';

export type {
  BrowserFeatures,
} from './browserCompat';
