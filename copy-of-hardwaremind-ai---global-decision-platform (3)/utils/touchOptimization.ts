/**
 * Touch Optimization Utilities
 * Enhances mobile touch experience with better gestures and feedback
 */

/**
 * Detect if device supports touch
 */
export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get touch coordinates from event
 */
export const getTouchCoordinates = (e: TouchEvent | React.TouchEvent): { x: number; y: number } => {
  const touch = e.touches[0] || e.changedTouches[0];
  return {
    x: touch.clientX,
    y: touch.clientY,
  };
};

/**
 * Swipe gesture detection
 */
interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance in pixels
  velocityThreshold?: number; // Minimum velocity
}

export const useSwipeGesture = (config: SwipeConfig) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocityThreshold = 0.3,
  } = config;

  let startX = 0;
  let startY = 0;
  let startTime = 0;

  const handleTouchStart = (e: TouchEvent | React.TouchEvent) => {
    const touch = getTouchCoordinates(e);
    startX = touch.x;
    startY = touch.y;
    startTime = Date.now();
  };

  const handleTouchEnd = (e: TouchEvent | React.TouchEvent) => {
    const touch = getTouchCoordinates(e);
    const deltaX = touch.x - startX;
    const deltaY = touch.y - startY;
    const deltaTime = Date.now() - startTime;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    if (distance < threshold || velocity < velocityThreshold) {
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
};

/**
 * Long press detection
 */
export const useLongPress = (
  callback: () => void,
  delay: number = 500
) => {
  let timeoutId: NodeJS.Timeout | null = null;

  const handleTouchStart = () => {
    timeoutId = setTimeout(() => {
      callback();
    }, delay);
  };

  const handleTouchEnd = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
  };
};

/**
 * Add haptic feedback for touch interactions
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
 * Optimize touch target size (minimum 44x44px)
 */
export const ensureTouchTargetSize = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const minSize = 44; // iOS/Android recommended minimum

  if (rect.width < minSize || rect.height < minSize) {
    const padding = Math.max(0, (minSize - rect.width) / 2, (minSize - rect.height) / 2);
    element.style.padding = `${padding}px`;
  }
};

/**
 * Prevent double-tap zoom on iOS
 */
export const preventDoubleTapZoom = () => {
  let lastTouchEnd = 0;
  
  document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
};

