import React, { useEffect, useState } from 'react';
import { X, Check, AlertCircle, Info, Heart, ShoppingCart, Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

export type ToastType = 'success' | 'error' | 'info' | 'favorite' | 'cart' | 'rating';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const getToastIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return Check;
    case 'error':
      return AlertCircle;
    case 'info':
      return Info;
    case 'favorite':
      return Heart;
    case 'cart':
      return ShoppingCart;
    case 'rating':
      return Star;
    default:
      return Info;
  }
};

const getToastColors = (type: ToastType, isDark: boolean) => {
  switch (type) {
    case 'success':
      return {
        bg: isDark ? 'bg-green-500/20' : 'bg-green-50',
        border: 'border-green-500/50',
        text: isDark ? 'text-green-400' : 'text-green-700',
        icon: isDark ? 'text-green-400' : 'text-green-600',
        glow: '0 0 20px rgba(34, 197, 94, 0.3)',
      };
    case 'error':
      return {
        bg: isDark ? 'bg-red-500/20' : 'bg-red-50',
        border: 'border-red-500/50',
        text: isDark ? 'text-red-400' : 'text-red-700',
        icon: isDark ? 'text-red-400' : 'text-red-600',
        glow: '0 0 20px rgba(239, 68, 68, 0.3)',
      };
    case 'favorite':
      return {
        bg: isDark ? 'bg-pink-500/20' : 'bg-pink-50',
        border: 'border-pink-500/50',
        text: isDark ? 'text-pink-400' : 'text-pink-700',
        icon: isDark ? 'text-pink-400' : 'text-pink-600',
        glow: '0 0 20px rgba(236, 72, 153, 0.3)',
      };
    case 'cart':
      return {
        bg: isDark ? 'bg-blue-500/20' : 'bg-blue-50',
        border: 'border-blue-500/50',
        text: isDark ? 'text-blue-400' : 'text-blue-700',
        icon: isDark ? 'text-blue-400' : 'text-blue-600',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
      };
    case 'rating':
      return {
        bg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-50',
        border: 'border-yellow-500/50',
        text: isDark ? 'text-yellow-400' : 'text-yellow-700',
        icon: isDark ? 'text-yellow-400' : 'text-yellow-600',
        glow: '0 0 20px rgba(234, 179, 8, 0.3)',
      };
    default:
      return {
        bg: isDark ? 'bg-white/10' : 'bg-gray-50',
        border: 'border-white/20',
        text: isDark ? 'text-white' : 'text-gray-700',
        icon: isDark ? 'text-white' : 'text-gray-600',
        glow: '0 0 20px rgba(255, 255, 255, 0.1)',
      };
  }
};

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const Icon = getToastIcon(type);
  const colors = getToastColors(type, isDark);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - (100 / (duration / 50));
        return newProgress > 0 ? newProgress : 0;
      });
    }, 50);

    // Auto-close timer
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [id, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <div
      className={clsx(
        'relative flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg',
        'transition-all duration-300',
        colors.bg,
        colors.border,
        isExiting
          ? 'opacity-0 translate-x-full scale-95'
          : 'opacity-100 translate-x-0 scale-100'
      )}
      style={{
        boxShadow: colors.glow,
        animation: isExiting
          ? 'toast-exit 300ms cubic-bezier(0.4, 0, 1, 1) forwards'
          : 'toast-enter 300ms cubic-bezier(0, 0, 0.2, 1) forwards',
      }}
      role="alert"
      aria-live="polite"
    >
      {/* Icon with pulse animation */}
      <div className="flex-shrink-0 relative">
        <Icon
          size={20}
          className={clsx(colors.icon, 'relative z-10')}
          strokeWidth={2.5}
        />
        {/* Pulse effect for success/favorite */}
        {(type === 'success' || type === 'favorite') && (
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              backgroundColor: colors.icon.includes('green')
                ? 'rgba(34, 197, 94, 0.3)'
                : 'rgba(236, 72, 153, 0.3)',
            }}
          />
        )}
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className={clsx('text-sm font-medium', colors.text)}>{message}</p>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className={clsx(
          'flex-shrink-0 p-1 rounded-lg transition-all duration-200',
          'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20',
          colors.icon
        )}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      >
        <div
          className="h-full transition-all duration-50 ease-linear"
          style={{
            width: `${progress}%`,
            backgroundColor: colors.icon.includes('green')
              ? '#22c55e'
              : colors.icon.includes('red')
              ? '#ef4444'
              : colors.icon.includes('pink')
              ? '#ec4899'
              : colors.icon.includes('blue')
              ? '#3b82f6'
              : colors.icon.includes('yellow')
              ? '#eab308'
              : '#ffffff',
            boxShadow: `0 0 10px ${
              colors.icon.includes('green')
                ? 'rgba(34, 197, 94, 0.5)'
                : colors.icon.includes('red')
                ? 'rgba(239, 68, 68, 0.5)'
                : colors.icon.includes('pink')
                ? 'rgba(236, 72, 153, 0.5)'
                : colors.icon.includes('blue')
                ? 'rgba(59, 130, 246, 0.5)'
                : colors.icon.includes('yellow')
                ? 'rgba(234, 179, 8, 0.5)'
                : 'rgba(255, 255, 255, 0.3)'
            }`,
          }}
        />
      </div>
    </div>
  );
};

// Toast Container Component
export interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right',
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={clsx(
        'fixed z-50 flex flex-col gap-3 pointer-events-none',
        positionClasses[position]
      )}
      style={{ maxWidth: '420px', width: '100%' }}
    >
      <div className="flex flex-col gap-3 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </div>
    </div>
  );
};

// Hook for managing toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (
    type: ToastType,
    message: string,
    duration?: number
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastProps = {
      id,
      type,
      message,
      duration,
      onClose: removeToast,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const success = (message: string, duration?: number) =>
    addToast('success', message, duration);
  
  const error = (message: string, duration?: number) =>
    addToast('error', message, duration);
  
  const info = (message: string, duration?: number) =>
    addToast('info', message, duration);
  
  const favorite = (message: string, duration?: number) =>
    addToast('favorite', message, duration);
  
  const cart = (message: string, duration?: number) =>
    addToast('cart', message, duration);
  
  const rating = (message: string, duration?: number) =>
    addToast('rating', message, duration);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    favorite,
    cart,
    rating,
  };
};
