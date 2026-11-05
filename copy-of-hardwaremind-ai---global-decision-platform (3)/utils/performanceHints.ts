/**
 * Performance Hints Utilities
 * 
 * Provides utilities for optimizing rendering performance
 * through CSS hints and best practices
 */

/**
 * Get CSS properties for GPU-accelerated animations
 */
export const getGPUAcceleratedStyles = () => ({
  transform: 'translateZ(0)',
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
});

/**
 * Apply will-change hint to an element
 * Should be used sparingly and removed after animation
 */
export const applyWillChange = (
  element: HTMLElement,
  properties: string[]
) => {
  element.style.willChange = properties.join(', ');
};

/**
 * Remove will-change hint from an element
 */
export const removeWillChange = (element: HTMLElement) => {
  element.style.willChange = 'auto';
};

/**
 * Optimize element for animation
 */
export const optimizeForAnimation = (element: HTMLElement) => {
  element.style.transform = 'translateZ(0)';
  element.style.backfaceVisibility = 'hidden';
};
