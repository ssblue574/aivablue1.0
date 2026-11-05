import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface HolographicButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  glowIntensity?: number;     // 0-1, default: 0.5
  rippleEffect?: boolean;     // default: true
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const HolographicButton: React.FC<HolographicButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glowIntensity = 0.5,
  rippleEffect = true,
  onClick,
  disabled = false,
  children,
  className = '',
  type = 'button',
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleIdRef = useRef(0);

  const isDark = theme === 'dark';

  // Size configurations
  const sizeConfig = {
    sm: {
      padding: '8px 16px',
      fontSize: '14px',
      height: '36px',
      borderRadius: '18px',
    },
    md: {
      padding: '12px 24px',
      fontSize: '16px',
      height: '48px',
      borderRadius: '24px',
    },
    lg: {
      padding: '16px 32px',
      fontSize: '18px',
      height: '56px',
      borderRadius: '28px',
    },
  };

  // Variant-based colors
  const getVariantStyles = () => {
    const intensity = glowIntensity;
    
    if (variant === 'primary') {
      return {
        background: isDark
          ? `linear-gradient(135deg, rgba(0, 255, 198, ${0.2 * intensity}), rgba(106, 168, 255, ${0.15 * intensity}))`
          : `linear-gradient(135deg, rgba(0, 113, 227, ${0.8 * intensity}), rgba(0, 119, 237, ${0.9 * intensity}))`,
        border: isDark
          ? '1px solid rgba(0, 255, 198, 0.3)'
          : '1px solid rgba(0, 113, 227, 0.4)',
        color: isDark ? '#00FFC6' : '#FFFFFF',
        glowColor: isDark ? 'rgba(0, 255, 198, 0.4)' : 'rgba(0, 113, 227, 0.5)',
      };
    } else if (variant === 'secondary') {
      return {
        background: isDark
          ? `linear-gradient(135deg, rgba(255, 95, 210, ${0.2 * intensity}), rgba(139, 92, 246, ${0.15 * intensity}))`
          : `linear-gradient(135deg, rgba(255, 45, 85, ${0.8 * intensity}), rgba(255, 55, 95, ${0.9 * intensity}))`,
        border: isDark
          ? '1px solid rgba(255, 95, 210, 0.3)'
          : '1px solid rgba(255, 45, 85, 0.4)',
        color: isDark ? '#FF5FD2' : '#FFFFFF',
        glowColor: isDark ? 'rgba(255, 95, 210, 0.4)' : 'rgba(255, 45, 85, 0.5)',
      };
    } else {
      // ghost
      return {
        background: 'transparent',
        border: isDark
          ? '1px solid rgba(255, 255, 255, 0.2)'
          : '1px solid rgba(0, 0, 0, 0.15)',
        color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
        glowColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      };
    }
  };

  const variantStyles = getVariantStyles();
  const config = sizeConfig[size];

  // Base button styles
  const baseStyles: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: config.padding,
    fontSize: config.fontSize,
    height: config.height,
    borderRadius: config.borderRadius,
    background: variantStyles.background,
    border: variantStyles.border,
    color: variantStyles.color,
    fontWeight: 600,
    letterSpacing: '0.02em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.5 : 1,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  };

  // Breathing animation keyframes
  useEffect(() => {
    if (disabled) return;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes holographic-breathe {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [disabled]);

  // Hover and press effects
  const getInteractionStyles = (): React.CSSProperties => {
    if (disabled) return {};

    const styles: React.CSSProperties = {};

    if (isHovered) {
      styles.boxShadow = `
        0 0 20px ${variantStyles.glowColor},
        0 0 40px ${variantStyles.glowColor},
        0 8px 24px rgba(0, 0, 0, 0.3)
      `;
      styles.transform = 'translateY(-2px)';
    }

    if (isPressed) {
      styles.transform = 'translateY(1px) scale(0.98)';
      styles.boxShadow = `
        0 0 10px ${variantStyles.glowColor},
        0 2px 8px rgba(0, 0, 0, 0.2)
      `;
    }

    return styles;
  };

  // Handle ripple effect
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (rippleEffect && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = rippleIdRef.current++;

      setRipples(prev => [...prev, { id, x, y }]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 600);
    }

    onClick?.();
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...getInteractionStyles(),
  };

  // Edge highlight styles
  const edgeHighlightStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: `linear-gradient(90deg, transparent, ${variantStyles.color}, transparent)`,
    opacity: isHovered ? 0.8 : 0.3,
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    animation: disabled ? 'none' : 'holographic-breathe 3s ease-in-out infinite',
  };

  // Glow layer styles
  const glowLayerStyles: React.CSSProperties = {
    position: 'absolute',
    inset: '-2px',
    borderRadius: config.borderRadius,
    background: `radial-gradient(circle at 50% 50%, ${variantStyles.glowColor}, transparent 70%)`,
    opacity: isHovered ? 0.6 : 0,
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
    filter: 'blur(8px)',
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      className={`holographic-button ${className}`}
      style={combinedStyles}
      onClick={handleClick}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        if (!disabled) {
          setIsHovered(false);
          setIsPressed(false);
        }
      }}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      onFocus={() => !disabled && setIsHovered(true)}
      onBlur={() => {
        if (!disabled) {
          setIsHovered(false);
          setIsPressed(false);
        }
      }}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {/* Glow layer */}
      <div style={glowLayerStyles} />
      
      {/* Edge highlight */}
      <div style={edgeHighlightStyles} />
      
      {/* Content */}
      <span style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
      
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          style={{
            position: 'absolute',
            left: ripple.x,
            top: ripple.y,
            width: '0',
            height: '0',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${variantStyles.color}40, transparent)`,
            transform: 'translate(-50%, -50%)',
            animation: 'ripple-expand 0.6s ease-out',
            pointerEvents: 'none',
          }}
        />
      ))}
      
      <style>{`
        @keyframes ripple-expand {
          from {
            width: 0;
            height: 0;
            opacity: 1;
          }
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};
