import React, { useState, useEffect, useRef } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string; // 备用图片 URL
  showErrorIcon?: boolean; // 是否显示错误图标
}

/**
 * Optimized Image Component with lazy loading and intersection observer
 * 
 * Features:
 * - Lazy loading by default
 * - Intersection observer for better performance
 * - Loading states with blur effect
 * - Error handling with fallback
 * - Responsive sizing
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  priority = false,
  onLoad,
  onError,
  fallbackSrc,
  showErrorIcon = true,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    // Skip intersection observer for priority images
    if (priority) {
      setIsInView(true);
      return;
    }

    // Use intersection observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    retryCountRef.current = 0; // Reset retry count on success
    onLoad?.();
  };

  const handleError = () => {
    // 如果有备用图片且未超过重试次数，尝试使用备用图片
    if (fallbackSrc && retryCountRef.current === 0 && currentSrc === src) {
      retryCountRef.current = 1;
      setCurrentSrc(fallbackSrc);
      return;
    }
    
    // 如果已经尝试过备用图片或没有备用图片，显示错误状态
    setHasError(true);
    onError?.();
  };

  // 当 src 改变时重置状态
  useEffect(() => {
    if (src !== currentSrc) {
      setCurrentSrc(src);
      setIsLoaded(false);
      setHasError(false);
      retryCountRef.current = 0;
    }
  }, [src, currentSrc]);

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        className
      )}
      style={{ width, height }}
    >
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className={clsx(
          "absolute inset-0 flex items-center justify-center",
          isDark ? "bg-white/5" : "bg-gray-100"
        )}>
          <Loader2 size={24} className={clsx(
            "animate-spin",
            isDark ? "text-white/30" : "text-gray-400"
          )} />
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className={clsx(
          "absolute inset-0 flex flex-col items-center justify-center gap-2",
          isDark ? "bg-white/5" : "bg-gray-100"
        )}>
          {showErrorIcon && (
            <ImageOff size={32} className={clsx(
              isDark ? "text-white/30" : "text-gray-400"
            )} />
          )}
          <span className={clsx(
            "text-xs text-center px-4",
            isDark ? "text-white/50" : "text-gray-500"
          )}>
            {alt || 'Image failed to load'}
          </span>
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          loading={loading}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={clsx(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          // Performance hints
          decoding="async"
          // Prevent layout shift
          style={{
            aspectRatio: width && height ? `${width} / ${height}` : undefined,
          }}
        />
      )}
    </div>
  );
};
