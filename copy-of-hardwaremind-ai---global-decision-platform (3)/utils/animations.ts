/**
 * Animation Utilities
 * Provides consistent animation classes and utilities
 */

import { clsx } from 'clsx';

export type AnimationPreset = 
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'bounce'
  | 'none';

export interface AnimationOptions {
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
}

const durationMap = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
};

const easingMap = {
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

/**
 * Get animation classes for a preset
 */
export const getAnimationClasses = (
  preset: AnimationPreset,
  options: AnimationOptions = {}
): string => {
  const {
    duration = 'normal',
    delay = 0,
    easing = 'ease-out',
  } = options;

  const durationValue = durationMap[duration];
  const easingValue = easingMap[easing];
  const delayValue = `${delay}ms`;

  const baseTransition = `transition-all duration-[${durationValue}] ease-[${easingValue}] delay-[${delayValue}]`;

  switch (preset) {
    case 'fade':
      return `${baseTransition} opacity-0 animate-[fadeIn_${durationValue}_${easingValue}_forwards]`;
    case 'slideUp':
      return `${baseTransition} translate-y-4 opacity-0 animate-[slideUp_${durationValue}_${easingValue}_forwards]`;
    case 'slideDown':
      return `${baseTransition} -translate-y-4 opacity-0 animate-[slideDown_${durationValue}_${easingValue}_forwards]`;
    case 'slideLeft':
      return `${baseTransition} translate-x-4 opacity-0 animate-[slideLeft_${durationValue}_${easingValue}_forwards]`;
    case 'slideRight':
      return `${baseTransition} -translate-x-4 opacity-0 animate-[slideRight_${durationValue}_${easingValue}_forwards]`;
    case 'scale':
      return `${baseTransition} scale-95 opacity-0 animate-[scaleIn_${durationValue}_${easingValue}_forwards]`;
    case 'bounce':
      return `${baseTransition} animate-[bounceIn_${durationValue}_${easingValue}_forwards]`;
    case 'none':
      return '';
    default:
      return baseTransition;
  }
};

/**
 * Stagger animation delay for list items
 */
export const getStaggerDelay = (index: number, baseDelay: number = 50): number => {
  return index * baseDelay;
};

/**
 * Page transition animation
 */
export const pageTransitionClasses = (isEntering: boolean): string => {
  return clsx(
    'transition-all duration-300 ease-out',
    isEntering 
      ? 'opacity-0 translate-y-4 animate-[fadeInUp_300ms_ease-out_forwards]'
      : 'opacity-100 translate-y-0'
  );
};

/**
 * Card hover animation
 */
export const cardHoverClasses = (): string => {
  return 'transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg';
};

/**
 * Button press animation
 */
export const buttonPressClasses = (): string => {
  return 'transition-transform duration-75 active:scale-95';
};

/**
 * Loading pulse animation
 */
export const loadingPulseClasses = (): string => {
  return 'animate-pulse';
};

/**
 * Shimmer animation for skeleton loaders
 */
export const shimmerClasses = (): string => {
  return 'animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]';
};

