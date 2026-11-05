// Interaction Feedback Utility Functions

import { easing, prefersReducedMotion } from './animation';

/**
 * Glow Effect Configuration
 */
export interface GlowEffectConfig {
  color?: string;
  intensity?: number;
  duration?: number;
  spread?: number;
}

/**
 * Create a glow effect on an element
 */
export const createGlowEffect = (
  element: HTMLElement,
  config: GlowEffectConfig = {}
): void => {
  if (prefersReducedMotion()) return;

  const {
    color = 'rgba(0, 255, 198, 0.6)',
    intensity = 20,
    duration = 300,
    spread = 40,
  } = config;

  const originalBoxShadow = element.style.boxShadow;
  const glowShadow = `0 0 ${intensity}px ${spread}px ${color}`;

  element.style.transition = `box-shadow ${duration}ms ${easing.decelerate}`;
  element.style.boxShadow = glowShadow;

  setTimeout(() => {
    element.style.boxShadow = originalBoxShadow;
  }, duration);
};

/**
 * Ripple Effect Configuration
 */
export interface RippleEffectConfig {
  color?: string;
  duration?: number;
  size?: number;
}

/**
 * Create a ripple effect at the click position
 */
export const createRippleEffect = (
  element: HTMLElement,
  event: React.MouseEvent | MouseEvent,
  config: RippleEffectConfig = {}
): void => {
  if (prefersReducedMotion()) return;

  const {
    color = 'rgba(0, 255, 198, 0.4)',
    duration = 600,
    size,
  } = config;

  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Calculate ripple size based on element dimensions
  const rippleSize = size || Math.max(rect.width, rect.height) * 2;

  // Create ripple element
  const ripple = document.createElement('span');
  ripple.style.position = 'absolute';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = '0';
  ripple.style.height = '0';
  ripple.style.borderRadius = '50%';
  ripple.style.backgroundColor = color;
  ripple.style.transform = 'translate(-50%, -50%)';
  ripple.style.pointerEvents = 'none';
  ripple.style.zIndex = '9999';
  ripple.style.opacity = '1';

  // Ensure parent has position context
  const originalPosition = element.style.position;
  if (!originalPosition || originalPosition === 'static') {
    element.style.position = 'relative';
  }

  // Ensure overflow is hidden
  const originalOverflow = element.style.overflow;
  element.style.overflow = 'hidden';

  element.appendChild(ripple);

  // Animate ripple
  requestAnimationFrame(() => {
    ripple.style.transition = `width ${duration}ms ${easing.decelerate}, height ${duration}ms ${easing.decelerate}, opacity ${duration}ms ${easing.decelerate}`;
    ripple.style.width = `${rippleSize}px`;
    ripple.style.height = `${rippleSize}px`;
    ripple.style.opacity = '0';
  });

  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
    // Restore original styles
    if (!originalPosition || originalPosition === 'static') {
      element.style.position = originalPosition;
    }
    element.style.overflow = originalOverflow;
  }, duration);
};

/**
 * Particle Burst Configuration
 */
export interface ParticleBurstConfig {
  count?: number;
  colors?: string[];
  duration?: number;
  spread?: number;
  size?: number;
}

/**
 * Create a particle burst effect at the specified position
 */
export const createParticleBurst = (
  element: HTMLElement,
  event: React.MouseEvent | MouseEvent,
  config: ParticleBurstConfig = {}
): void => {
  if (prefersReducedMotion()) return;

  const {
    count = 12,
    colors = ['#00FFC6', '#FF5FD2', '#8B5CF6', '#6AA8FF'],
    duration = 800,
    spread = 100,
    size = 4,
  } = config;

  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Ensure parent has position context
  const originalPosition = element.style.position;
  if (!originalPosition || originalPosition === 'static') {
    element.style.position = 'relative';
  }

  // Create particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    const angle = (Math.PI * 2 * i) / count;
    const velocity = spread * (0.5 + Math.random() * 0.5);
    const color = colors[Math.floor(Math.random() * colors.length)];

    particle.style.position = 'absolute';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = color;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

    element.appendChild(particle);

    // Animate particle
    const endX = x + Math.cos(angle) * velocity;
    const endY = y + Math.sin(angle) * velocity;

    requestAnimationFrame(() => {
      particle.style.transition = `transform ${duration}ms ${easing.decelerate}, opacity ${duration}ms ${easing.decelerate}`;
      particle.style.transform = `translate(${endX - x}px, ${endY - y}px)`;
      particle.style.opacity = '0';
    });

    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
      // Restore original position if needed
      if (!originalPosition || originalPosition === 'static') {
        element.style.position = originalPosition;
      }
    }, duration);
  }
};

/**
 * 3D Depth Effect Configuration
 */
export interface DepthEffectConfig {
  depth?: number;
  duration?: number;
  rotateX?: number;
  rotateY?: number;
  scale?: number;
}

/**
 * Create a 3D depth effect on hover
 */
export const create3DDepthEffect = (
  element: HTMLElement,
  config: DepthEffectConfig = {}
): void => {
  if (prefersReducedMotion()) return;

  const {
    depth = 10,
    duration = 300,
    rotateX = 0,
    rotateY = 0,
    scale = 1.02,
  } = config;

  element.style.transition = `transform ${duration}ms ${easing.decelerate}, box-shadow ${duration}ms ${easing.decelerate}`;
  element.style.transformStyle = 'preserve-3d';
  element.style.transform = `
    perspective(1000px)
    translateZ(${depth}px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY}deg)
    scale(${scale})
  `;
  element.style.boxShadow = `0 ${depth * 2}px ${depth * 4}px rgba(0, 0, 0, 0.3)`;
};

/**
 * Reset 3D depth effect
 */
export const reset3DDepthEffect = (
  element: HTMLElement,
  duration: number = 300
): void => {
  element.style.transition = `transform ${duration}ms ${easing.decelerate}, box-shadow ${duration}ms ${easing.decelerate}`;
  element.style.transform = 'perspective(1000px) translateZ(0) rotateX(0) rotateY(0) scale(1)';
  element.style.boxShadow = '';
};

/**
 * Smooth hover effect with scale and glow
 */
export interface HoverEffectConfig {
  scale?: number;
  glowColor?: string;
  glowIntensity?: number;
  duration?: number;
}

export const createSmoothHoverEffect = (
  element: HTMLElement,
  config: HoverEffectConfig = {}
): void => {
  if (prefersReducedMotion()) return;

  const {
    scale = 1.05,
    glowColor = 'rgba(0, 255, 198, 0.3)',
    glowIntensity = 20,
    duration = 300,
  } = config;

  element.style.transition = `transform ${duration}ms ${easing.decelerate}, box-shadow ${duration}ms ${easing.decelerate}`;
  element.style.transform = `scale(${scale})`;
  element.style.boxShadow = `0 0 ${glowIntensity}px ${glowIntensity / 2}px ${glowColor}`;
};

export const resetSmoothHoverEffect = (
  element: HTMLElement,
  duration: number = 300
): void => {
  element.style.transition = `transform ${duration}ms ${easing.decelerate}, box-shadow ${duration}ms ${easing.decelerate}`;
  element.style.transform = 'scale(1)';
  element.style.boxShadow = '';
};
