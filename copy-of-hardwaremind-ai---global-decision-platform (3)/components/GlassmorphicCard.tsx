import React, { useState } from 'react';
import { useTheme } from '../ThemeContext';

export type HoverEffect = 'lift' | 'glow' | 'scale';

interface GlassmorphicCardProps {
  blur?: number;              // Blur amount in px (default: 20)
  opacity?: number;           // Background opacity (default: 0.1)
  borderGlow?: boolean;       // Enable border glow effect (default: false)
  hoverEffect?: HoverEffect;  // Hover effect type (default: 'lift')
  children: React.ReactNode;
  className?: string;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  blur = 20,
  opacity = 0.1,
  borderGlow = false,
  hoverEffect = 'lift',
  children,
  className = '',
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Get theme-based colors
  const isDark = theme === 'dark';
  const backgroundColor = isDark 
    ? `rgba(255, 255, 255, ${opacity})`
    : `rgba(255, 255, 255, ${opacity + 0.05})`;
  
  const borderColor = isDark
    ? 'rgba(255, 255, 255, 0.18)'
    : 'rgba(0, 0, 0, 0.1)';

  // Base styles
  const baseStyles: React.CSSProperties = {
    background: backgroundColor,
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    border: `1px solid ${borderColor}`,
    borderRadius: '18px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Box shadow - inner and outer
  const boxShadow = isDark
    ? `0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
    : `0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)`;

  // Hover effect styles
  const getHoverStyles = (): React.CSSProperties => {
    if (!isHovered) return {};

    switch (hoverEffect) {
      case 'lift':
        return {
          transform: 'translateY(-8px)',
          boxShadow: isDark
            ? '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
            : '0 16px 48px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1)',
        };
      
      case 'glow':
        return {
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 255, 198, 0.3), 0 0 20px rgba(0, 255, 198, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 113, 227, 0.3), 0 0 20px rgba(0, 113, 227, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        };
      
      case 'scale':
        return {
          transform: 'scale(1.02)',
          boxShadow: isDark
            ? '0 12px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
            : '0 12px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
        };
      
      default:
        return {};
    }
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    boxShadow,
    ...getHoverStyles(),
  };

  // Border gradient glow effect
  const borderGlowStyles: React.CSSProperties = borderGlow ? {
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    padding: '2px',
    background: isDark
      ? 'linear-gradient(135deg, rgba(0, 255, 198, 0.5), rgba(255, 95, 210, 0.5))'
      : 'linear-gradient(135deg, rgba(0, 113, 227, 0.5), rgba(255, 45, 85, 0.5))',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
  } : {};

  return (
    <div
      className={`glassmorphic-card ${className}`}
      style={combinedStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {borderGlow && <div style={borderGlowStyles} />}
      {children}
    </div>
  );
};
