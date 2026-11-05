import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../ThemeContext';

export type ThinkingStyle = 'pulse' | 'wave' | 'neural';

interface AIThinkingIndicatorProps {
  active: boolean;
  message?: string;
  style?: ThinkingStyle;
  size?: number;           // Size in pixels (default: 60)
  className?: string;
}

export const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({
  active,
  message,
  style = 'pulse',
  size = 60,
  className = '',
}) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [animationProgress, setAnimationProgress] = useState(0);

  const isDark = theme === 'dark';

  // Colors based on theme
  const primaryColor = isDark ? '#00FFC6' : '#0071E3';
  const secondaryColor = isDark ? '#6AA8FF' : '#0077ED';
  const accentColor = isDark ? '#FF5FD2' : '#FF2D55';

  // Pulse animation
  useEffect(() => {
    if (!active || style !== 'pulse') return;

    let progress = 0;
    const animate = () => {
      progress += 0.02;
      setAnimationProgress(progress);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, style]);

  // Wave animation
  useEffect(() => {
    if (!active || style !== 'wave') return;

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
  }, [active, style]);

  // Neural network animation
  useEffect(() => {
    if (!active || style !== 'neural' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    
    // Set canvas size first (before getting context)
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      // Canvas context not available (e.g., in test environment)
      // Canvas element will still be rendered but without animation
      return;
    }

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

      // Draw connections
      ctx.strokeStyle = isDark ? 'rgba(0, 255, 198, 0.3)' : 'rgba(0, 113, 227, 0.3)';
      ctx.lineWidth = 1.5;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (distance < size * 0.6) {
            const pulse = Math.sin(progress + nodes[i].phase + nodes[j].phase) * 0.5 + 0.5;
            ctx.globalAlpha = pulse * 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(progress + node.phase) * 0.5 + 0.5;
        const radius = 3 + pulse * 3;

        // Glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 3);
        gradient.addColorStop(0, isDark ? `rgba(0, 255, 198, ${pulse * 0.8})` : `rgba(0, 113, 227, ${pulse * 0.8})`);
        gradient.addColorStop(1, 'rgba(0, 255, 198, 0)');
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = isDark ? primaryColor : secondaryColor;
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
  }, [active, style, size, isDark, primaryColor, secondaryColor]);

  if (!active) return null;

  // Container styles
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  };

  // Pulse style rendering
  const renderPulse = () => {
    const pulse = Math.sin(animationProgress) * 0.5 + 0.5;
    const scale = 0.8 + pulse * 0.2;

    const pulseStyles: React.CSSProperties = {
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${primaryColor}40, ${secondaryColor}20, transparent)`,
      boxShadow: `
        0 0 ${20 + pulse * 20}px ${primaryColor}60,
        0 0 ${40 + pulse * 40}px ${primaryColor}40,
        0 0 ${60 + pulse * 60}px ${primaryColor}20
      `,
      transform: `scale(${scale})`,
      transition: 'transform 0.1s ease-out',
      position: 'relative',
    };

    const coreStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: `${size * 0.4}px`,
      height: `${size * 0.4}px`,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
      boxShadow: `0 0 ${10 + pulse * 10}px ${primaryColor}`,
    };

    return (
      <div style={pulseStyles}>
        <div style={coreStyles} />
      </div>
    );
  };

  // Wave style rendering
  const renderWave = () => {
    const waves = [0, 1, 2];

    const waveContainerStyles: React.CSSProperties = {
      position: 'relative',
      width: `${size}px`,
      height: `${size}px`,
    };

    return (
      <div style={waveContainerStyles}>
        {waves.map((index) => {
          const delay = index * 0.4;
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
            border: `2px solid ${primaryColor}`,
            opacity: opacity * 0.6,
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
            width: `${size * 0.3}px`,
            height: `${size * 0.3}px`,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            boxShadow: `0 0 20px ${primaryColor}`,
          }}
        />
      </div>
    );
  };

  // Neural style rendering
  const renderNeural = () => {
    return (
      <canvas
        ref={canvasRef}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          filter: 'drop-shadow(0 0 10px rgba(0, 255, 198, 0.3))',
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
    <div className={`ai-thinking-indicator ${className}`} style={containerStyles}>
      {style === 'pulse' && renderPulse()}
      {style === 'wave' && renderWave()}
      {style === 'neural' && renderNeural()}
      
      {message && <div style={messageStyles}>{message}</div>}
    </div>
  );
};
