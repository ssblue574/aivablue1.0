import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '../ThemeContext';
import { prefersReducedMotion, clamp } from '../utils/animation';
import { detectPerformance } from '../utils/performance';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface NeuralNetworkBackgroundProps {
  density?: number;           // Node density (0-1), default 0.5
  connectionOpacity?: number; // Connection line opacity, default 0.3
  animationSpeed?: number;    // Animation speed multiplier, default 1
  interactive?: boolean;      // Mouse interaction enabled, default true
  color?: string;            // Primary color, default theme color
}

export const NeuralNetworkBackground: React.FC<NeuralNetworkBackgroundProps> = ({
  density = 0.5,
  connectionOpacity = 0.3,
  animationSpeed = 1,
  interactive = true,
  color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animationFrameRef = useRef<number | undefined>(undefined);
  const scrollYRef = useRef(0);
  
  const { theme } = useTheme();
  const [performanceLevel, setPerformanceLevel] = useState<'high' | 'medium' | 'low'>('high');
  const reducedMotion = prefersReducedMotion();

  // Determine node count based on performance and density
  const getNodeCount = useCallback(() => {
    const baseCount = {
      high: 150,
      medium: 100,
      low: 50,
    }[performanceLevel];
    
    return Math.floor(baseCount * density);
  }, [performanceLevel, density]);

  // Get theme-based color
  const getColor = useCallback(() => {
    if (color) return color;
    return theme === 'dark' ? '#00FFC6' : '#0071E3';
  }, [color, theme]);

  // Initialize nodes with spatial distribution
  const initializeNodes = useCallback((width: number, height: number) => {
    const nodeCount = getNodeCount();
    const nodes: Node[] = [];
    
    // Use grid-based initialization for better distribution
    const cols = Math.ceil(Math.sqrt(nodeCount * (width / height)));
    const rows = Math.ceil(nodeCount / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    
    for (let i = 0; i < nodeCount; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      // Add randomness within cell
      const x = col * cellWidth + Math.random() * cellWidth;
      const y = row * cellHeight + Math.random() * cellHeight;
      
      nodes.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5 * animationSpeed,
        vy: (Math.random() - 0.5) * 0.5 * animationSpeed,
        radius: 2 + Math.random() * 2,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }
    
    nodesRef.current = nodes;
  }, [getNodeCount, animationSpeed]);

  // Spatial partitioning for performance optimization
  const getSpatialGrid = useCallback((nodes: Node[], width: number, height: number) => {
    const cellSize = 150; // Connection threshold
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);
    const grid: Node[][][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => [])
    );
    
    nodes.forEach(node => {
      const col = Math.floor(node.x / cellSize);
      const row = Math.floor(node.y / cellSize);
      if (row >= 0 && row < rows && col >= 0 && col < cols) {
        grid[row][col].push(node);
      }
    });
    
    return { grid, cellSize, cols, rows };
  }, []);

  // Draw connections between nearby nodes
  const drawConnections = useCallback((
    ctx: CanvasRenderingContext2D,
    nodes: Node[],
    width: number,
    height: number,
    primaryColor: string
  ) => {
    const connectionThreshold = 150;
    const { grid, cellSize, cols, rows } = getSpatialGrid(nodes, width, height);
    
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 1;
    
    // Only check neighboring cells for connections
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellNodes = grid[row][col];
        
        // Check current cell and neighboring cells
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const neighborRow = row + dr;
            const neighborCol = col + dc;
            
            if (
              neighborRow >= 0 && neighborRow < rows &&
              neighborCol >= 0 && neighborCol < cols
            ) {
              const neighborNodes = grid[neighborRow][neighborCol];
              
              cellNodes.forEach(node1 => {
                neighborNodes.forEach(node2 => {
                  if (node1 === node2) return;
                  
                  const dx = node2.x - node1.x;
                  const dy = node2.y - node1.y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  
                  if (distance < connectionThreshold) {
                    const opacity = (1 - distance / connectionThreshold) * connectionOpacity;
                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.moveTo(node1.x, node1.y);
                    ctx.lineTo(node2.x, node2.y);
                    ctx.stroke();
                  }
                });
              });
            }
          }
        }
      }
    }
    
    ctx.globalAlpha = 1;
  }, [connectionOpacity, getSpatialGrid]);

  // Draw nodes with pulsing animation
  const drawNodes = useCallback((
    ctx: CanvasRenderingContext2D,
    nodes: Node[],
    primaryColor: string
  ) => {
    nodes.forEach(node => {
      // Pulsing effect
      const pulseScale = 0.8 + Math.sin(node.pulsePhase) * 0.2;
      const radius = node.radius * pulseScale;
      
      // Glow effect
      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, radius * 3
      );
      gradient.addColorStop(0, primaryColor);
      gradient.addColorStop(0.5, primaryColor.replace(')', ', 0.5)').replace('rgb', 'rgba'));
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Core node
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  // Update node positions and handle mouse interaction
  const updateNodes = useCallback((
    nodes: Node[],
    width: number,
    height: number,
    mouse: { x: number; y: number; active: boolean }
  ) => {
    nodes.forEach(node => {
      // Update pulse phase
      node.pulsePhase += node.pulseSpeed * animationSpeed;
      
      // Mouse interaction
      if (interactive && mouse.active) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 200) {
          const force = (200 - distance) / 200;
          node.vx += (dx / distance) * force * 0.1;
          node.vy += (dy / distance) * force * 0.1;
        }
      }
      
      // Update position
      node.x += node.vx;
      node.y += node.vy;
      
      // Boundary wrapping
      if (node.x < 0) node.x = width;
      if (node.x > width) node.x = 0;
      if (node.y < 0) node.y = height;
      if (node.y > height) node.y = 0;
      
      // Damping
      node.vx *= 0.99;
      node.vy *= 0.99;
    });
  }, [interactive, animationSpeed]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const primaryColor = getColor();
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Apply parallax effect based on scroll
    const parallaxOffset = scrollYRef.current * 0.3;
    ctx.save();
    ctx.translate(0, -parallaxOffset);
    
    // Update and draw
    if (!reducedMotion) {
      updateNodes(nodesRef.current, width, height, mouseRef.current);
    }
    
    drawConnections(ctx, nodesRef.current, width, height, primaryColor);
    drawNodes(ctx, nodesRef.current, primaryColor);
    
    ctx.restore();
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [getColor, reducedMotion, updateNodes, drawConnections, drawNodes]);

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
    
    // Reinitialize nodes with new dimensions
    initializeNodes(rect.width, rect.height);
  }, [initializeNodes]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!interactive) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, [interactive]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  // Handle scroll for parallax
  const handleScroll = useCallback(() => {
    scrollYRef.current = window.scrollY;
  }, []);

  // Initialize
  useEffect(() => {
    const level = detectPerformance();
    setPerformanceLevel(level);
  }, []);

  // Setup canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Start animation
    if (!reducedMotion) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      // Draw static frame for reduced motion
      animate();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    handleResize,
    handleScroll,
    handleMouseMove,
    handleMouseLeave,
    animate,
    interactive,
    reducedMotion,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{
        width: '100%',
        height: '100%',
        willChange: reducedMotion ? 'auto' : 'transform, opacity',
      }}
    />
  );
};
