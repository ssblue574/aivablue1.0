/**
 * Micro-interaction utilities for enhanced UX
 * Provides smooth, delightful animations and feedback
 */

import { clsx } from 'clsx';

/**
 * Ripple effect on click
 */
export const rippleEffect = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.className = 'absolute rounded-full bg-white/30 pointer-events-none animate-ripple';

  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
};

/**
 * Magnetic hover effect for buttons
 */
export const magneticHover = (
  event: React.MouseEvent<HTMLElement>,
  strength: number = 0.3
) => {
  const button = event.currentTarget;
  const rect = button.getBoundingClientRect();
  const x = event.clientX - (rect.left + rect.width / 2);
  const y = event.clientY - (rect.top + rect.height / 2);

  button.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
};

export const magneticLeave = (event: React.MouseEvent<HTMLElement>) => {
  const button = event.currentTarget;
  button.style.transform = 'translate(0, 0)';
};

/**
 * Shake animation for errors
 */
export const shakeAnimation = (element: HTMLElement) => {
  element.classList.add('animate-shake');
  setTimeout(() => {
    element.classList.remove('animate-shake');
  }, 500);
};

/**
 * Pulse animation for important elements
 */
export const pulseAnimation = (element: HTMLElement, duration: number = 1000) => {
  element.classList.add('animate-pulse');
  setTimeout(() => {
    element.classList.remove('animate-pulse');
  }, duration);
};

/**
 * Smooth scroll to element with offset
 */
export const smoothScrollTo = (
  elementId: string,
  offset: number = 0,
  behavior: ScrollBehavior = 'smooth'
) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  }
};

/**
 * Confetti effect for celebrations
 */
export const createConfetti = (
  container: HTMLElement,
  count: number = 50,
  colors: string[] = ['#00FFC6', '#0071e3', '#FF6B6B', '#FFD93D', '#6BCF7F']
) => {
  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    const size = Math.random() * 10 + 5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = color;
    confetti.style.position = 'absolute';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = '-10px';
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.opacity = '0.8';
    
    container.appendChild(confetti);

    const animationDuration = Math.random() * 2 + 1;
    const xMovement = (Math.random() - 0.5) * 200;
    
    confetti.animate(
      [
        {
          transform: 'translateY(0) translateX(0) rotate(0deg)',
          opacity: 1,
        },
        {
          transform: `translateY(${window.innerHeight}px) translateX(${xMovement}px) rotate(360deg)`,
          opacity: 0,
        },
      ],
      {
        duration: animationDuration * 1000,
        easing: 'cubic-bezier(0.5, 0, 0.5, 1)',
      }
    ).onfinish = () => {
      confetti.remove();
    };
  }
};

/**
 * Haptic feedback (if supported)
 */
export const hapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30,
    };
    navigator.vibrate(patterns[type]);
  }
};

/**
 * Success celebration animation
 */
export const celebrateSuccess = (element: HTMLElement) => {
  // Pulse animation
  pulseAnimation(element, 800);
  
  // Confetti if container is available
  const container = document.body;
  createConfetti(container, 30);
  
  // Haptic feedback
  hapticFeedback('light');
};

/**
 * Error feedback animation
 */
export const showErrorFeedback = (element: HTMLElement) => {
  shakeAnimation(element);
  hapticFeedback('medium');
};

/**
 * Loading spinner with progress
 */
export const createProgressSpinner = (
  container: HTMLElement,
  progress: number = 0
): HTMLElement => {
  const spinner = document.createElement('div');
  spinner.className = 'relative w-16 h-16';
  
  const circle = document.createElement('div');
  circle.className = 'absolute inset-0 rounded-full border-4 border-transparent border-t-current';
  circle.style.animation = 'spin 1s linear infinite';
  
  const progressCircle = document.createElement('div');
  progressCircle.className = 'absolute inset-0 rounded-full border-4 border-transparent border-r-current';
  progressCircle.style.clipPath = `polygon(0 0, 100% 0, 100% ${100 - progress}%, 0 ${100 - progress}%)`;
  
  spinner.appendChild(circle);
  spinner.appendChild(progressCircle);
  container.appendChild(spinner);
  
  return spinner;
};

