// useInteractionFeedback Hook
// Provides a unified interface for interaction feedback effects

import { useCallback, useRef } from 'react';
import {
  createGlowEffect,
  createRippleEffect,
  createParticleBurst,
  create3DDepthEffect,
  reset3DDepthEffect,
  createSmoothHoverEffect,
  resetSmoothHoverEffect,
  GlowEffectConfig,
  RippleEffectConfig,
  ParticleBurstConfig,
  DepthEffectConfig,
  HoverEffectConfig,
} from '../utils/interactionFeedback';

export interface InteractionFeedbackOptions {
  enableGlow?: boolean;
  enableRipple?: boolean;
  enableParticles?: boolean;
  enable3D?: boolean;
  glowConfig?: GlowEffectConfig;
  rippleConfig?: RippleEffectConfig;
  particleConfig?: ParticleBurstConfig;
  depthConfig?: DepthEffectConfig;
  hoverConfig?: HoverEffectConfig;
}

export const useInteractionFeedback = (options: InteractionFeedbackOptions = {}) => {
  const {
    enableGlow = false,
    enableRipple = true,
    enableParticles = false,
    enable3D = false,
    glowConfig = {},
    rippleConfig = {},
    particleConfig = {},
    depthConfig = {},
    hoverConfig = {},
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);

  /**
   * Handle click with feedback effects
   */
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const element = event.currentTarget;
      elementRef.current = element;

      if (enableGlow) {
        createGlowEffect(element, glowConfig);
      }

      if (enableRipple) {
        createRippleEffect(element, event, rippleConfig);
      }

      if (enableParticles) {
        createParticleBurst(element, event, particleConfig);
      }
    },
    [enableGlow, enableRipple, enableParticles, glowConfig, rippleConfig, particleConfig]
  );

  /**
   * Handle mouse enter with hover effects
   */
  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const element = event.currentTarget;
      elementRef.current = element;

      if (enable3D) {
        create3DDepthEffect(element, depthConfig);
      } else {
        createSmoothHoverEffect(element, hoverConfig);
      }
    },
    [enable3D, depthConfig, hoverConfig]
  );

  /**
   * Handle mouse leave to reset effects
   */
  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const element = event.currentTarget;

      if (enable3D) {
        reset3DDepthEffect(element, depthConfig.duration);
      } else {
        resetSmoothHoverEffect(element, hoverConfig.duration);
      }
    },
    [enable3D, depthConfig.duration, hoverConfig.duration]
  );

  /**
   * Trigger glow effect programmatically
   */
  const triggerGlow = useCallback(
    (element?: HTMLElement) => {
      const target = element || elementRef.current;
      if (target) {
        createGlowEffect(target, glowConfig);
      }
    },
    [glowConfig]
  );

  /**
   * Trigger ripple effect programmatically
   */
  const triggerRipple = useCallback(
    (element: HTMLElement, event: React.MouseEvent | MouseEvent) => {
      createRippleEffect(element, event, rippleConfig);
    },
    [rippleConfig]
  );

  /**
   * Trigger particle burst programmatically
   */
  const triggerParticleBurst = useCallback(
    (element: HTMLElement, event: React.MouseEvent | MouseEvent) => {
      createParticleBurst(element, event, particleConfig);
    },
    [particleConfig]
  );

  /**
   * Trigger 3D depth effect programmatically
   */
  const trigger3DDepth = useCallback(
    (element?: HTMLElement) => {
      const target = element || elementRef.current;
      if (target) {
        create3DDepthEffect(target, depthConfig);
      }
    },
    [depthConfig]
  );

  /**
   * Reset 3D depth effect programmatically
   */
  const reset3DDepth = useCallback(
    (element?: HTMLElement) => {
      const target = element || elementRef.current;
      if (target) {
        reset3DDepthEffect(target, depthConfig.duration);
      }
    },
    [depthConfig.duration]
  );

  return {
    // Event handlers for easy integration
    handleClick,
    handleMouseEnter,
    handleMouseLeave,
    
    // Programmatic triggers
    triggerGlow,
    triggerRipple,
    triggerParticleBurst,
    trigger3DDepth,
    reset3DDepth,
    
    // Ref for accessing the element
    elementRef,
  };
};
