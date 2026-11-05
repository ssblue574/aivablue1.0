import React, { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

export type TransitionType = 'fade' | 'slide' | 'scale' | 'spatial';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  duration?: number;
  delay?: number;
  className?: string;
}

/**
 * PageTransition - 流体页面过渡动画组件
 * 
 * 提供多种过渡效果：
 * - fade: 淡入淡出
 * - slide: 位移动画
 * - scale: 缩放效果
 * - spatial: 空间转换（3D 效果）
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 500,
  delay = 0,
  className
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 延迟后触发入场动画
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all ease-out';
    const durationClass = `duration-[${duration}ms]`;

    switch (type) {
      case 'fade':
        return clsx(
          baseClasses,
          durationClass,
          isVisible ? 'opacity-100' : 'opacity-0'
        );
      
      case 'slide':
        return clsx(
          baseClasses,
          durationClass,
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        );
      
      case 'scale':
        return clsx(
          baseClasses,
          durationClass,
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        );
      
      case 'spatial':
        return clsx(
          baseClasses,
          durationClass,
          isVisible 
            ? 'opacity-100 translate-z-0 rotate-x-0' 
            : 'opacity-0 translate-z-[-50px] rotate-x-[5deg]'
        );
      
      default:
        return baseClasses;
    }
  };

  return (
    <div 
      className={clsx(
        getTransitionClasses(),
        className
      )}
      style={{
        transformStyle: type === 'spatial' ? 'preserve-3d' : undefined,
        perspective: type === 'spatial' ? '1000px' : undefined,
      }}
    >
      {children}
    </div>
  );
};

/**
 * RouteTransition - 路由切换过渡包装器
 * 
 * 用于包装路由组件，提供页面切换时的过渡效果
 */
interface RouteTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
  type?: TransitionType;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  transitionKey,
  type = 'slide'
}) => {
  return (
    <PageTransition key={transitionKey} type={type} duration={600}>
      {children}
    </PageTransition>
  );
};

/**
 * StaggeredTransition - 交错入场动画
 * 
 * 为子元素提供交错的入场动画效果
 */
interface StaggeredTransitionProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  type?: TransitionType;
}

export const StaggeredTransition: React.FC<StaggeredTransitionProps> = ({
  children,
  staggerDelay = 100,
  type = 'slide'
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <PageTransition
          type={type}
          delay={index * staggerDelay}
          duration={500}
        >
          {child}
        </PageTransition>
      ))}
    </>
  );
};
