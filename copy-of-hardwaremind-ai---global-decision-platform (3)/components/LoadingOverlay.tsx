import React from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  show, 
  message = '加载中...', 
  fullScreen = false 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!show) return null;

  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center z-50",
        fullScreen ? "fixed inset-0" : "absolute inset-0",
        isDark ? "bg-black/60" : "bg-white/60",
        "backdrop-blur-sm"
      )}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      {/* Spinner */}
      <div className="relative">
        {/* Outer ring */}
        <div
          className={clsx(
            "w-16 h-16 rounded-full border-4 border-t-transparent animate-spin",
            isDark ? "border-white/20" : "border-gray-300"
          )}
          style={{ animationDuration: '1s' }}
        />
        
        {/* Inner ring */}
        <div
          className={clsx(
            "absolute inset-2 rounded-full border-4 border-b-transparent animate-spin",
            isDark ? "border-[#00FFC6]" : "border-[#0071E3]"
          )}
          style={{ animationDuration: '0.75s', animationDirection: 'reverse' }}
        />
        
        {/* Center dot */}
        <div
          className={clsx(
            "absolute inset-0 m-auto w-2 h-2 rounded-full animate-pulse",
            isDark ? "bg-[#00FFC6]" : "bg-[#0071E3]"
          )}
        />
      </div>

      {/* Message */}
      {message && (
        <p
          className={clsx(
            "mt-4 text-sm font-medium",
            isDark ? "text-white/80" : "text-black/80"
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
};

// Inline loading spinner for smaller contexts
export const LoadingSpinner: React.FC<{ size?: number; className?: string }> = ({ 
  size = 20, 
  className 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      className={clsx(
        "inline-block rounded-full border-2 border-t-transparent animate-spin",
        isDark ? "border-white/40" : "border-gray-400",
        className
      )}
      style={{ 
        width: size, 
        height: size,
        animationDuration: '0.6s'
      }}
      role="status"
      aria-label="加载中"
    />
  );
};
