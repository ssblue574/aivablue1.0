import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '../ThemeContext';
import { prefersReducedMotion, clamp } from '../utils/animation';
import { detectPerformance, getParticleCount } from '../utils/performance';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

export type ParticleBehavior = 'float' | 'flow' | 'burst';

interface ParticleSystemProps {
  count?: number;                    // Particle count (will be adjusted by performance)
  speed?: number;                    // Movement speed multiplier
  size?: [number, number];           // Size range [min, max]
  color?: string[];                  // Color array for gradient
  behavior?: ParticleBehavior;       // Behavior mode
  className?: string;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  count = 100,
  speed = 1,
  size = [2, 6],
  color,
  behavior = 'float',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  
  const { theme } = useTheme();
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const reducedMotion = prefersReducedMotion();

  // Get performance-adjusted particle count
  const getAdjustedParticleCount = useCallback(() => {
    return getParticleCount(count, performanceLevel);
  }, [count, performanceLevel]);

  // Get theme-based colors
  const getColors = useCallback((): string[] => {
    if (color && color.length > 0) return color;
    
    if (theme === 'dark') {
      return ['#00FFC6', '#FF5FD2', '#8B5CF6', '#6AA8FF'];
    } else {
      return ['#0071E3', '#FF2D55', '#5E5CE6', '#00D4AA'];
    }
  }, [color, theme]);

  // Initialize particles based on behavior
  const initializeParticles = useCallback((width: number, height: number) => {
    const particleCount = getAdjustedParticleCount();
    const colors = getColors();
    const particles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      const particleColor = colors[Math.floor(Math.random() * colors.length)];
      const particleSize = size[0] + Math.random() * (size[1] - size[0]);
      
      let particle: Particle;
      
      switch (behavior) {
        case 'float':
          // Floating particles - slow, random movement
          particle = {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3 * speed,
            vy: (Math.random() - 0.5) * 0.3 * speed,
            size: particleSize,
            life: 1,
            maxLife: 1,
            color: particleColor,
            alpha: 0.3 + Math.random() * 0.4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
          };
          break;
          
        case 'flow':
          // Flowing particles - directional movement (bottom to top)
          particle = {
            x: Math.random() * width,
            y: height + Math.random() * 100,
            vx: (Math.random() - 0.5) * 0.5 * speed,
            vy: -(0.5 + Math.random() * 1.5) * speed,
            size: particleSize,
            life: 1,
            maxLife: 1,
            color: particleColor,
            alpha: 0.4 + Math.random() * 0.4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.03,
          };
          break;
          
        case 'burst':
          // Burst particles - explosive from center
          const centerX = width / 2;
          const centerY = height / 2;
          const angle = Math.random() * Math.PI * 2;
          const velocity = 1 + Math.random() * 3;
          
          particle = {
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * velocity * speed,
            vy: Math.sin(angle) * velocity * speed,
            size: particleSize,
            life: 1,
            maxLife: 1,
            color: particleColor,
            alpha: 0.8,
            rotation: angle,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
          };
          break;
      }
      
      particles.push(particle);
    }
    
    particlesRef.current = particles;
  }, [behavior, getParticleCount, getColors, size, speed]);

  // Update particle positions and lifecycle
  const updateParticles = useCallback((
    particles: Particle[],
    width: number,
    height: number,
    deltaTime: number
  ) => {
    const colors = getColors();
    
    particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      particle.rotation += particle.rotationSpeed * deltaTime;
      
      // Behavior-specific updates
      switch (behavior) {
        case 'float':
          // Wrap around edges
          if (particle.x < -particle.size) particle.x = width + particle.size;
          if (particle.x > width + particle.size) particle.x = -particle.size;
          if (particle.y < -particle.size) particle.y = height + particle.size;
          if (particle.y > height + particle.size) particle.y = -particle.size;
          
          // Subtle size pulsing
          particle.alpha = 0.3 + Math.sin(Date.now() * 0.001 + index) * 0.2;
          break;
          
        case 'flow':
          // Respawn at bottom when reaching top
          if (particle.y < -particle.size) {
            particle.y = height + particle.size;
            particle.x = Math.random() * width;
            particle.color = colors[Math.floor(Math.random() * colors.length)];
          }
          
          // Wrap horizontally
          if (particle.x < -particle.size) particle.x = width + particle.size;
          if (particle.x > width + particle.size) particle.x = -particle.size;
          
          // Fade based on position
          particle.alpha = clamp(1 - particle.y / height, 0.2, 0.8);
          break;
          
        case 'burst':
          // Decrease life over time
          particle.life -= 0.01 * deltaTime;
          
          // Apply gravity
          particle.vy += 0.05 * deltaTime;
          
          // Fade out as life decreases
          particle.alpha = clamp(particle.life, 0, 1);
          
          // Respawn when dead
          if (particle.life <= 0) {
            const centerX = width / 2;
            const centerY = height / 2;
            const angle = Math.random() * Math.PI * 2;
            const velocity = 1 + Math.random() * 3;
            
            particle.x = centerX;
            particle.y = centerY;
            particle.vx = Math.cos(angle) * velocity * speed;
            particle.vy = Math.sin(angle) * velocity * speed;
            particle.life = 1;
            particle.alpha = 0.8;
            particle.color = colors[Math.floor(Math.random() * colors.length)];
            particle.rotation = angle;
          }
          break;
      }
      
      // Size variation based on life (for burst mode)
      if (behavior === 'burst') {
        const baseSize = size[0] + Math.random() * (size[1] - size[0]);
        particle.size = baseSize * particle.life;
      }
    });
  }, [behavior, getColors, size, speed]);

  // Draw particles
  const drawParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    particles: Particle[]
  ) => {
    particles.forEach(particle => {
      if (particle.alpha <= 0) return;
      
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      
      // Translate to particle position
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      // Create gradient for glow effect
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 2);
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(0.5, particle.color + '80'); // 50% opacity
      gradient.addColorStop(1, 'transparent');
      
      // Draw glow
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw core particle
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    });
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw particles
    if (!reducedMotion) {
      // Use fixed delta time for consistent animation
      const deltaTime = 1;
      updateParticles(particlesRef.current, width, height, deltaTime);
    }
    
    drawParticles(ctx, particlesRef.current);
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [reducedMotion, updateParticles, drawParticles]);

  // Handle canvas resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    // Reinitialize particles with new dimensions
    initializeParticles(rect.width, rect.height);
  }, [initializeParticles]);

  // Initialize performance detection
  useEffect(() => {
    const level = detectPerformance();
    setPerformanceLevel(level);
  }, []);

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Start animation
    if (!reducedMotion) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // Draw static frame for reduced motion
      animate();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleResize, animate, reducedMotion]);

  // Re-initialize when behavior or count changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    initializeParticles(rect.width, rect.height);
  }, [behavior, count, initializeParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        width: '100%',
        height: '100%',
        willChange: reducedMotion ? 'auto' : 'transform, opacity',
      }}
    />
  );
};
