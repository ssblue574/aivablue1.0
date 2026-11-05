import React from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

interface SkeletonLoaderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  count?: number;
  animated?: boolean;
}

/**
 * SkeletonLoader - 骨架屏加载组件
 * 提供多种变体和动画效果
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width,
  height,
  className,
  variant = 'rectangular',
  count = 1,
  animated = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-lg';
      case 'card':
        return 'rounded-xl';
      default:
        return 'rounded-lg';
    }
  };

  const skeletonClasses = clsx(
    getVariantClasses(),
    animated && 'animate-pulse',
    isDark ? 'bg-white/10' : 'bg-gray-200',
    className
  );

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={skeletonClasses}
            style={index === 0 ? style : undefined}
          />
        ))}
      </>
    );
  }

  return <div className={skeletonClasses} style={style} />;
};

/**
 * ProductCardSkeleton - 产品卡片骨架屏
 */
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={clsx(
      "p-4 rounded-2xl border",
      isDark ? "bg-[#1c1c1e] border-white/10" : "bg-white border-black/10",
      className
    )}>
      <SkeletonLoader variant="rectangular" height={200} className="mb-4" />
      <SkeletonLoader variant="text" width="60%" height={20} className="mb-2" />
      <SkeletonLoader variant="text" width="40%" height={16} className="mb-4" />
      <div className="flex gap-2 mb-4">
        <SkeletonLoader variant="rectangular" width={60} height={24} />
        <SkeletonLoader variant="rectangular" width={60} height={24} />
      </div>
      <SkeletonLoader variant="text" width="100%" height={14} className="mb-2" />
      <SkeletonLoader variant="text" width="80%" height={14} />
    </div>
  );
};

/**
 * ListSkeleton - 列表骨架屏
 */
export const ListSkeleton: React.FC<{ 
  count?: number; 
  itemHeight?: number;
  className?: string;
}> = ({ count = 5, itemHeight = 60, className }) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-4">
          <SkeletonLoader variant="rectangular" height={itemHeight} />
        </div>
      ))}
    </div>
  );
};

