import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../ThemeContext';

interface DynamicInputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  glowOnFocus?: boolean;      // Focus glow effect (default: true)
  floatingLabel?: boolean;    // Floating label animation (default: true)
  icon?: React.ReactNode;
  maxLength?: number;
  showCharCount?: boolean;    // Show character count (default: false)
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  error?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export const DynamicInput: React.FC<DynamicInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  glowOnFocus = true,
  floatingLabel = true,
  icon,
  maxLength,
  showCharCount = false,
  disabled = false,
  className = '',
  id,
  name,
  required = false,
  error,
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const particleIdRef = useRef(0);
  const animationFrameRef = useRef<number>();

  const isDark = theme === 'dark';
  const hasValue = value.length > 0;
  const shouldFloatLabel = floatingLabel && (isFocused || hasValue);

  // Generate particles on typing
  useEffect(() => {
    if (!isFocused || disabled) return;

    const generateParticle = () => {
      if (!inputRef.current) return;

      const rect = inputRef.current.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = rect.height;

      const particle: Particle = {
        id: particleIdRef.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: -2 - Math.random() * 2,
        life: 1,
        maxLife: 60, // 60 frames = ~1 second at 60fps
      };

      setParticles(prev => [...prev, particle]);
    };

    // Generate particle on value change
    if (value.length > 0) {
      generateParticle();
    }
  }, [value, isFocused, disabled]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles(prev => {
        return prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1 / p.maxLife,
          }))
          .filter(p => p.life > 0);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length > 0]);

  // Colors based on theme
  const primaryColor = isDark ? '#00FFC6' : '#0071E3';
  const secondaryColor = isDark ? '#6AA8FF' : '#0077ED';
  const errorColor = isDark ? '#FF5FD2' : '#FF2D55';
  const textColor = isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)';
  const labelColor = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)';
  const borderColor = error
    ? errorColor
    : isFocused
    ? primaryColor
    : isDark
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(0, 0, 0, 0.15)';

  // Container styles
  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
  };

  // Input wrapper styles
  const wrapperStyles: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: isDark
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.8)',
    borderRadius: '12px',
    border: `2px solid ${borderColor}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  // Glow effect
  const glowStyles: React.CSSProperties = glowOnFocus && isFocused && !error
    ? {
        boxShadow: isDark
          ? `0 0 20px ${primaryColor}40, 0 0 40px ${primaryColor}20, 0 4px 16px rgba(0, 0, 0, 0.3)`
          : `0 0 20px ${primaryColor}30, 0 0 40px ${primaryColor}15, 0 4px 16px rgba(0, 0, 0, 0.1)`,
      }
    : error
    ? {
        boxShadow: isDark
          ? `0 0 20px ${errorColor}40, 0 4px 16px rgba(0, 0, 0, 0.3)`
          : `0 0 20px ${errorColor}30, 0 4px 16px rgba(0, 0, 0, 0.1)`,
      }
    : {};

  // Input styles
  const inputStyles: React.CSSProperties = {
    flex: 1,
    padding: floatingLabel && label ? '24px 16px 8px 16px' : '12px 16px',
    paddingLeft: icon ? '48px' : '16px',
    paddingRight: showCharCount && maxLength ? '60px' : '16px',
    fontSize: '16px',
    color: textColor,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Label styles
  const labelStyles: React.CSSProperties = {
    position: 'absolute',
    left: icon ? '48px' : '16px',
    top: shouldFloatLabel ? '8px' : '50%',
    transform: shouldFloatLabel ? 'translateY(0)' : 'translateY(-50%)',
    fontSize: shouldFloatLabel ? '12px' : '16px',
    color: error ? errorColor : isFocused ? primaryColor : labelColor,
    pointerEvents: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: shouldFloatLabel ? 600 : 400,
    letterSpacing: shouldFloatLabel ? '0.02em' : '0',
  };

  // Icon styles
  const iconStyles: React.CSSProperties = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: isFocused ? primaryColor : labelColor,
    transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Character count styles
  const charCountStyles: React.CSSProperties = {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '12px',
    color: maxLength && value.length > maxLength * 0.9 ? errorColor : labelColor,
    fontWeight: 500,
    transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Gradient underline styles
  const underlineStyles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: error
      ? errorColor
      : `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
    transform: isFocused ? 'scaleX(1)' : 'scaleX(0)',
    transformOrigin: 'center',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  // Error message styles
  const errorStyles: React.CSSProperties = {
    marginTop: '8px',
    fontSize: '12px',
    color: errorColor,
    paddingLeft: '16px',
    fontWeight: 500,
  };

  // Particle styles
  const getParticleStyle = (particle: Particle): React.CSSProperties => ({
    position: 'absolute',
    left: particle.x,
    top: particle.y,
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${primaryColor}, ${secondaryColor})`,
    opacity: particle.life,
    pointerEvents: 'none',
    boxShadow: `0 0 8px ${primaryColor}`,
  });

  return (
    <div style={containerStyles} className={className}>
      <div style={{ ...wrapperStyles, ...glowStyles }}>
        {/* Icon */}
        {icon && <div style={iconStyles}>{icon}</div>}

        {/* Floating Label */}
        {floatingLabel && label && (
          <label htmlFor={id} style={labelStyles}>
            {label}
            {required && ' *'}
          </label>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={floatingLabel ? '' : placeholder}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          style={inputStyles}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {/* Character Count */}
        {showCharCount && maxLength && (
          <div style={charCountStyles}>
            {value.length}/{maxLength}
          </div>
        )}

        {/* Gradient Underline */}
        <div style={underlineStyles} />

        {/* Particles */}
        {particles.map((particle) => (
          <div key={particle.id} style={getParticleStyle(particle)} />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div id={`${id}-error`} style={errorStyles} role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
