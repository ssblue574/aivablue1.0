import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * usePageTransition - 页面过渡状态管理 Hook
 * 
 * 管理页面过渡的状态和时机
 */
export const usePageTransition = (duration: number = 500) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
    }
  }, [location, displayLocation]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isTransitioning, location, duration]);

  return {
    isTransitioning,
    displayLocation,
    location
  };
};

/**
 * useRouteTransition - 路由过渡动画 Hook
 * 
 * 提供路由切换时的过渡动画控制
 */
export const useRouteTransition = () => {
  const location = useLocation();
  const [isEntering, setIsEntering] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // 页面进入动画
    setIsEntering(true);
    setIsExiting(false);

    const enterTimer = setTimeout(() => {
      setIsEntering(false);
    }, 600);

    return () => {
      clearTimeout(enterTimer);
      // 页面退出动画
      setIsExiting(true);
    };
  }, [location.pathname]);

  return {
    isEntering,
    isExiting,
    transitionKey: location.pathname
  };
};

/**
 * useSpatialTransition - 空间转换动画 Hook
 * 
 * 提供 3D 空间转换效果的控制
 */
export const useSpatialTransition = () => {
  const [depth, setDepth] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const triggerSpatialTransition = useCallback((
    targetDepth: number = -50,
    targetRotateX: number = 5,
    targetRotateY: number = 0,
    duration: number = 600
  ) => {
    // 退出动画
    setDepth(targetDepth);
    setRotateX(targetRotateX);
    setRotateY(targetRotateY);

    // 进入动画
    setTimeout(() => {
      setDepth(0);
      setRotateX(0);
      setRotateY(0);
    }, duration / 2);
  }, []);

  const spatialStyle = {
    transform: `translateZ(${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
  };

  return {
    spatialStyle,
    triggerSpatialTransition
  };
};

/**
 * useFluidTransition - 流体过渡动画 Hook
 * 
 * 提供平滑的流体过渡效果
 */
export const useFluidTransition = (duration: number = 500) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startTransition = useCallback(() => {
    setIsAnimating(true);
    setProgress(0);

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      
      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [duration]);

  // 缓动函数：cubic-bezier(0.23, 1, 0.32, 1)
  const easedProgress = useCallback((t: number) => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  return {
    isAnimating,
    progress,
    easedProgress: easedProgress(progress),
    startTransition
  };
};
