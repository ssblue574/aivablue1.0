import { useEffect, useRef, useState } from 'react';
import { animateNumber, easingFunctions } from '../utils/typography';

interface UseAnimatedNumberOptions {
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  easing?: keyof typeof easingFunctions;
  startOnMount?: boolean;
}

/**
 * Hook for animating number values with smooth transitions
 * 
 * @example
 * const { value, start } = useAnimatedNumber(0, 100, { duration: 2000 });
 * 
 * @param initialValue - Starting number
 * @param targetValue - Ending number
 * @param options - Animation configuration
 */
export function useAnimatedNumber(
  initialValue: number,
  targetValue: number,
  options: UseAnimatedNumberOptions = {}
) {
  const {
    duration = 1000,
    decimals = 0,
    prefix = '',
    suffix = '',
    easing = 'easeOutCubic',
    startOnMount = true,
  } = options;

  const [value, setValue] = useState(initialValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | null>(null);

  const start = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    const startTime = performance.now();
    const range = targetValue - initialValue;
    const easingFn = easingFunctions[easing];

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      const current = initialValue + range * easedProgress;

      setValue(current);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const reset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setValue(initialValue);
    setIsAnimating(false);
  };

  useEffect(() => {
    if (startOnMount) {
      start();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startOnMount]);

  const formattedValue = `${prefix}${value.toFixed(decimals)}${suffix}`;

  return {
    value,
    formattedValue,
    isAnimating,
    start,
    reset,
  };
}

/**
 * Hook for animating multiple numbers in sequence
 */
export function useAnimatedNumberSequence(
  numbers: Array<{ initial: number; target: number; options?: UseAnimatedNumberOptions }>,
  sequenceDelay: number = 100
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const startSequence = () => {
    setCurrentIndex(0);
    setIsComplete(false);
  };

  useEffect(() => {
    if (currentIndex < numbers.length && !isComplete) {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        if (currentIndex === numbers.length - 1) {
          setIsComplete(true);
        }
      }, sequenceDelay);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, numbers.length, sequenceDelay, isComplete]);

  return {
    currentIndex,
    isComplete,
    startSequence,
  };
}
