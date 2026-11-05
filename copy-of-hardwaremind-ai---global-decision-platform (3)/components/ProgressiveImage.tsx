import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { ImageOff } from 'lucide-react';

interface ProgressiveImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  fallback?: string;
}

/**
 * ProgressiveImage - 渐进式图片加载组件
 * 先显示低质量占位图，然后加载高质量图片
 */
export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  className,
  onLoad,
  onError,
  fallback,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [imageSrc, setImageSrc] = useState<string>(placeholder || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
    setIsLoading(true);
    setImageSrc(placeholder || src);

    // Load high-quality image
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setIsLoading(false);
      onLoad?.();
    };

    img.onerror = () => {
      if (fallback) {
        const fallbackImg = new Image();
        fallbackImg.src = fallback;
        fallbackImg.onload = () => {
          setImageSrc(fallback);
          setIsLoaded(true);
          setIsLoading(false);
        };
        fallbackImg.onerror = () => {
          setHasError(true);
          setIsLoading(false);
          onError?.();
        };
      } else {
        setHasError(true);
        setIsLoading(false);
        onError?.();
      }
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholder, fallback, onLoad, onError]);

  if (hasError) {
    return (
      <div className={clsx(
        "flex items-center justify-center",
        isDark ? "bg-white/5" : "bg-gray-100",
        className
      )}>
        <ImageOff size={24} className={clsx(
          isDark ? "text-white/40" : "text-gray-400"
        )} />
      </div>
    );
  }

  return (
    <div className={clsx("relative overflow-hidden", className)}>
      {/* Placeholder/Low-quality image */}
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt={alt}
          className={clsx(
            "absolute inset-0 w-full h-full object-cover",
            isLoaded && "opacity-0 transition-opacity duration-300"
          )}
        />
      )}

      {/* High-quality image */}
      <img
        src={imageSrc}
        alt={alt}
        className={clsx(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          isLoading && "blur-sm"
        )}
        loading="lazy"
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className={clsx(
          "absolute inset-0 flex items-center justify-center",
          isDark ? "bg-black/20" : "bg-white/20"
        )}>
          <div className={clsx(
            "w-8 h-8 border-2 rounded-full animate-spin",
            isDark ? "border-white/20 border-t-white/60" : "border-gray-300 border-t-gray-600"
          )} />
        </div>
      )}
    </div>
  );
};

