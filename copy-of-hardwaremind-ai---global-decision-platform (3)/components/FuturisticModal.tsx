import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface FuturisticModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
}

export const FuturisticModal: React.FC<FuturisticModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  maxWidth = 'lg',
  showCloseButton = true,
  closeOnBackdropClick = true,
  className = '',
}) => {
  const { theme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const isDark = theme === 'dark';
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Delay unmounting to allow exit animation
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Focus trap and focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Store the element that had focus before modal opened
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Get all focusable elements in the modal
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // Focus the first element
      if (firstElement) {
        setTimeout(() => firstElement.focus(), 100);
      }
      
      // Handle tab key for focus trap
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (focusableElements.length === 0) return;
          
          if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
        // Restore focus to the element that had it before modal opened
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen && !isAnimating) return null;

  // Max width configurations
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '7xl': 'max-w-7xl',
  };

  // Backdrop styles
  const backdropStyles: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Modal container styles with glassmorphic effect
  const modalStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    borderRadius: '24px',
    background: isDark
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9))',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: isDark
      ? '1px solid rgba(255, 255, 255, 0.18)'
      : '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: isDark
      ? '0 16px 64px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 255, 198, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 16px 64px rgba(0, 0, 0, 0.15), 0 0 40px rgba(0, 113, 227, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    transform: isOpen ? 'scale(1)' : 'scale(0.95)',
    opacity: isOpen ? 1 : 0,
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
  };

  // Holographic border gradient effect
  const holographicBorderStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    padding: '2px',
    background: isDark
      ? 'linear-gradient(135deg, rgba(0, 255, 198, 0.6), rgba(106, 168, 255, 0.4), rgba(255, 95, 210, 0.5))'
      : 'linear-gradient(135deg, rgba(0, 113, 227, 0.6), rgba(0, 119, 237, 0.4), rgba(255, 45, 85, 0.5))',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: 1,
    pointerEvents: 'none',
    animation: 'holographic-border-rotate 4s linear infinite',
  };

  // Edge glow effect
  const edgeGlowStyles: React.CSSProperties = {
    position: 'absolute',
    inset: '-4px',
    borderRadius: 'inherit',
    background: isDark
      ? 'radial-gradient(circle at 50% 0%, rgba(0, 255, 198, 0.3), transparent 60%)'
      : 'radial-gradient(circle at 50% 0%, rgba(0, 113, 227, 0.2), transparent 60%)',
    opacity: 0.8,
    pointerEvents: 'none',
    filter: 'blur(12px)',
    animation: 'edge-glow-pulse 3s ease-in-out infinite',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <style>{`
        @keyframes holographic-border-rotate {
          0% {
            background: linear-gradient(135deg, ${isDark ? 'rgba(0, 255, 198, 0.6), rgba(106, 168, 255, 0.4), rgba(255, 95, 210, 0.5)' : 'rgba(0, 113, 227, 0.6), rgba(0, 119, 237, 0.4), rgba(255, 45, 85, 0.5)'});
          }
          33% {
            background: linear-gradient(135deg, ${isDark ? 'rgba(255, 95, 210, 0.5), rgba(0, 255, 198, 0.6), rgba(106, 168, 255, 0.4)' : 'rgba(255, 45, 85, 0.5), rgba(0, 113, 227, 0.6), rgba(0, 119, 237, 0.4)'});
          }
          66% {
            background: linear-gradient(135deg, ${isDark ? 'rgba(106, 168, 255, 0.4), rgba(255, 95, 210, 0.5), rgba(0, 255, 198, 0.6)' : 'rgba(0, 119, 237, 0.4), rgba(255, 45, 85, 0.5), rgba(0, 113, 227, 0.6)'});
          }
          100% {
            background: linear-gradient(135deg, ${isDark ? 'rgba(0, 255, 198, 0.6), rgba(106, 168, 255, 0.4), rgba(255, 95, 210, 0.5)' : 'rgba(0, 113, 227, 0.6), rgba(0, 119, 237, 0.4), rgba(255, 45, 85, 0.5)'});
          }
        }

        @keyframes edge-glow-pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <div style={backdropStyles} onClick={handleBackdropClick}>
        <div
          ref={modalRef}
          className={`${maxWidthClasses[maxWidth]} ${className}`}
          style={modalStyles}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Holographic border gradient */}
          <div style={holographicBorderStyles} />
          
          {/* Edge glow */}
          <div style={edgeGlowStyles} />

          {/* Header */}
          {(title || subtitle || showCloseButton) && (
            <div
              className={`relative z-10 flex items-start justify-between p-6 border-b ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}
            >
              <div className="flex-1">
                {title && (
                  <h2
                    id="modal-title"
                    className={`text-2xl font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-black'
                    }`}
                  >
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p
                    className={`mt-1 text-sm ${
                      isDark ? 'text-white/60' : 'text-black/60'
                    }`}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={`ml-4 p-2 rounded-full transition-all ${
                    isDark
                      ? 'text-white/60 hover:text-white hover:bg-white/10'
                      : 'text-black/60 hover:text-black hover:bg-black/5'
                  }`}
                  aria-label="Close modal"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};
