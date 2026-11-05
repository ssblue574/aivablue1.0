import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../ThemeContext';

export type LoadingAnimationType = 'spinner' | 'particles' | 'neural' | 'wave';

interface LoadingAnimationProps {
  type?: LoadingAnimationType;
  size?: number;           // Size in pixels (default: 80)
  color?: string;          // Custom color (uses theme color if not provided)
  message?: string;        // Optional loading message
  className?: string;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  type = 'spinner',
  size = 80,
  color,
  message,
  className = '',
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [animationProgress, setAnimationProgress] = useState(0);

  const isDark = theme === 'dark';

  // Get theme-based colors
  const primaryColor = color || (isDark ? '#00FFC6' : '#0062CC');
  const secondaryColor = isDark ? '#6AA8FF' : '#0077ED';
  const accentColor = isDark ? '#FF5FD2' : '#FF2D55';

  // Spinner animation
  useEffect(() => {
    if (type !== 'spinner') return;

    let progress = 0;
    const animate = () => {
      progress += 0.03;
      setAnimationProgress(progress);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type]);

  // Wave animation
  useEffect(() => {
    if (type !== 'wave') return;

    let progress = 0;
    const animate = () => {
      progress += 0.04;
      setAnimationProgress(progress);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type]);

  // Particles animation
  useEffect(() => {
    if (type !== 'particles' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Particle {
      angle: number;
      distance: number;
      speed: number;
      size: number;
      alpha: number;
    }

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: (i / particleCount) * Math.PI * 2,
        distance: size * 0.4,
        speed: 0.02 + Math.random() * 0.01,
        size: 3 + Math.random() * 2,
        alpha: 0.8,
      });
    }

    let progress = 0;

    const animate = () => {
      progress += 0.02;
      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;

      particles.forEach((particle, index) => {
        // Update particle position
        particle.angle += particle.speed;
        
        // Pulsing distance
        const pulse = Math.sin(progress * 2 + index * 0.5) * 0.5 + 0.5;
        const currentDistance = particle.distance * (0.3 + pulse * 0.7);
        
        const x = centerX + Math.cos(particle.angle) * currentDistance;
        const y = centerY + Math.sin(particle.angle) * currentDistance;

        // Draw particle glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 3);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(0.5, `${primaryColor}80`);
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = particle.alpha * pulse;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw particle core
        ctx.globalAlpha = particle.alpha;
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw center core
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, size * 0.15
      );
      coreGradient.addColorStop(0, primaryColor);
      coreGradient.addColorStop(1, secondaryColor);

      ctx.globalAlpha = 1;
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.1, 0, Math.PI * 2);
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type, size, primaryColor, secondaryColor]);

  // Neural network animation
  useEffect(() => {
    if (type !== 'neural' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Neural network nodes
    const nodes = [
      { x: size * 0.2, y: size * 0.3, phase: 0 },
      { x: size * 0.5, y: size * 0.2, phase: Math.PI / 3 },
      { x: size * 0.8, y: size * 0.3, phase: Math.PI * 2 / 3 },
      { x: size * 0.3, y: size * 0.7, phase: Math.PI },
      { x: size * 0.7, y: size * 0.7, phase: Math.PI * 4 / 3 },
      { x: size * 0.5, y: size * 0.5, phase: Math.PI * 5 / 3 },
    ];

    let progress = 0;

    const animate = () => {
      progress += 0.05;
      ctx.clearRect(0, 0, size, size);

      // Draw connections with animated flow
      ctx.lineWidth = 2;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (distance < size * 0.6) {
            const pulse = Math.sin(progress + nodes[i].phase + nodes[j].phase) * 0.5 + 0.5;
            
            // Create gradient along the line
            const gradient = ctx.createLinearGradient(
              nodes[i].x, nodes[i].y,
              nodes[j].x, nodes[j].y
            );
            gradient.addColorStop(0, primaryColor);
            gradient.addColorStop(0.5, secondaryColor);
            gradient.addColorStop(1, accentColor);

            ctx.globalAlpha = pulse * 0.6;
            ctx.strokeStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with pulsing effect
      nodes.forEach((node) => {
        const pulse = Math.sin(progress + node.phase) * 0.5 + 0.5;
        const radius = 4 + pulse * 4;

        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(0.5, `${primaryColor}80`);
        gradient.addColorStop(1, 'transparent');

        ctx.globalAlpha = pulse * 0.8;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.globalAlpha = 1;
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [type, size, primaryColor, secondaryColor, accentColor]);

  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  };

  // Spinner rendering
  const renderSpinner = () => {
    const rotation = animationProgress * 60; // degrees per frame

    const spinnerStyles: React.CSSProperties = {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `conic-gradient(
        from ${rotation}deg,
        transparent 0deg,
        ${primaryColor}40 90deg,
        ${secondaryColor}80 180deg,
        ${accentColor} 270deg,
        transparent 360deg
      )`,
      position: 'relative',
      animation: 'spin 1.5s linear infinite',
    };

    const innerRingStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${size * 0.7}px`,
      height: `${size * 0.7}px`,
      borderRadius: '50%',
      background: isDark ? '#0a0a0a' : '#ffffff',
    };

    const glowStyles: React.CSSProperties = {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      borderRadius: '50%',
      boxShadow: `
        0 0 ${size * 0.3}px ${primaryColor}40,
        inset 0 0 ${size * 0.2}px ${primaryColor}20
      `,
    };

    return (
      <div style={spinnerStyles}>
        <div style={glowStyles} />
        <div style={innerRingStyles} />
      </div>
    );
  };

  // Wave rendering
  const renderWave = () => {
    const waves = [0, 1, 2, 3];

    const waveContainerStyles: React.CSSProperties = {
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`,
    };

    return (
      <div style={waveContainerStyles}>
        {waves.map((index) => {
          const delay = index * 0.5;
          const progress = (animationProgress + delay) % (Math.PI * 2);
          const scale = Math.sin(progress) * 0.5 + 0.5;
          const opacity = 1 - scale;

          const waveStyles: React.CSSProperties = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${scale})`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            border: `3px solid ${primaryColor}`,
            opacity: opacity * 0.7,
            pointerEvents: 'none',
          };

          return <div key={index} style={waveStyles} />;
        })}

        {/* Center core */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${size * 0.25}px`,
            height: `${size * 0.25}px`,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            boxShadow: `
              0 0 ${size * 0.3}px ${primaryColor}80,
              0 0 ${size * 0.5}px ${primaryColor}40
            `,
          }}
        />
      </div>
    );
  };

  // Canvas-based animations (particles and neural)
  const renderCanvas = () => {
    return (
      <canvas
        ref={canvasRef}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: `drop-shadow(0 0 ${size * 0.2}px ${primaryColor}40)`,
        }}
      />
    );
  };

  // Message styles
  const messageStyles: React.CSSProperties = {
    fontSize: '14px',
    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    fontWeight: 500,
    letterSpacing: '0.02em',
    textAlign: 'center',
  };

  return (
    <div className={`loading-animation ${className}`} style={containerStyles}>
      {type === 'spinner' && renderSpinner()}
      {type === 'wave' && renderWave()}
      {(type === 'particles' || type === 'neural') && renderCanvas()}

      {message && <div style={messageStyles}>{message}</div>}
    </div>
  );
};
