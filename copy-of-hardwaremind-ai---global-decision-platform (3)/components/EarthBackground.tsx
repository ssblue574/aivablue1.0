import React, { useMemo } from 'react';

/**
 * EarthBackground - Neural Data Tunnel / Digital Wormhole
 * 
 * Visual: Glowing particles streaming like fiber optics through darkness
 * Metaphor: AIVA connecting global information at light speed
 * Palette: Deep black + Silver/White particles
 */

export const EarthBackground: React.FC = () => {
  // Generate particle streams
  const particles = useMemo(() => {
    const streams: Array<{
      id: number;
      x: number;
      y: number;
      size: number;
      blur: number;
      duration: number;
      delay: number;
      color: string;
      opacity: number;
      angle: number;
    }> = [];
    
    const colors = [
      'rgba(255, 255, 255, 1)',    // Pure White (Primary)
      'rgba(220, 220, 230, 1)',    // Silver
      'rgba(200, 200, 210, 1)',    // Light Silver
      'rgba(180, 185, 195, 1)',    // Cool Silver
      'rgba(240, 240, 245, 1)',    // Bright Silver
      'rgba(160, 170, 180, 1)',    // Steel Gray
    ];
    
    for (let i = 0; i < 80; i++) {
      streams.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        blur: Math.random() > 0.7 ? 0 : 1 + Math.random() * 3, // Some sharp, some blurred
        duration: 2 + Math.random() * 4,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 0.4 + Math.random() * 0.6,
        angle: -30 + Math.random() * 60, // Converging toward center
      });
    }
    return streams;
  }, []);

  // Generate speed lines
  const speedLines = useMemo(() => {
    const lines: Array<{
      id: number;
      x: number;
      y: number;
      length: number;
      thickness: number;
      duration: number;
      delay: number;
      blur: number;
    }> = [];
    
    for (let i = 0; i < 30; i++) {
      lines.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        length: 50 + Math.random() * 150,
        thickness: 1 + Math.random() * 2,
        duration: 1 + Math.random() * 2,
        delay: Math.random() * 3,
        blur: Math.random() > 0.5 ? 0 : 1 + Math.random() * 2,
      });
    }
    return lines;
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#000000] pointer-events-none">
      
      {/* === DEEP SPACE BASE === */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at 50% 50%, rgba(30, 30, 35, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse 60% 60% at 30% 70%, rgba(25, 25, 30, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse 50% 50% at 70% 30%, rgba(35, 35, 40, 0.3) 0%, transparent 50%),
            #000000
          `,
        }}
      />

      {/* === TUNNEL VORTEX CENTER === */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Central Glow - The "Singularity" */}
        <div 
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: `
              radial-gradient(circle, rgba(255, 255, 255, 0.25) 0%, rgba(200, 200, 210, 0.12) 30%, transparent 70%)
            `,
            filter: 'blur(40px)',
            animation: 'pulseCore 4s ease-in-out infinite',
          }}
        />
        
        {/* Inner Core */}
        <div 
          className="absolute w-[80px] h-[80px] rounded-full"
          style={{
            background: `
              radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(220, 220, 230, 0.6) 30%, transparent 70%)
            `,
            filter: 'blur(10px)',
            animation: 'pulseCore 3s ease-in-out infinite 0.5s',
          }}
        />
        
        {/* Concentric Rings */}
        {[1, 2, 3, 4].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border"
            style={{
              width: `${100 + ring * 80}px`,
              height: `${100 + ring * 80}px`,
              borderColor: `rgba(255, 255, 255, ${0.12 - ring * 0.025})`,
              animation: `expandRing ${3 + ring}s ease-out infinite ${ring * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* === PARTICLE STREAMS === */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              opacity: p.opacity,
              filter: `blur(${p.blur}px)`,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color.replace('1)', '0.5)')}`,
              animation: `streamToCenter ${p.duration}s linear infinite ${p.delay}s`,
              transformOrigin: 'center center',
            }}
          />
        ))}
      </div>

      {/* === SPEED LINES (Fiber Optic Trails) === */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {speedLines.map((line) => (
          <div
            key={line.id}
            className="absolute"
            style={{
              left: `${line.x}%`,
              top: `${line.y}%`,
              width: `${line.length}px`,
              height: `${line.thickness}px`,
              background: `linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.7) 20%, rgba(220, 220, 230, 0.9) 50%, rgba(255, 255, 255, 0.7) 80%, transparent 100%)`,
              filter: `blur(${line.blur}px)`,
              opacity: 0,
              transform: 'translateX(-100%)',
              animation: `speedLine ${line.duration}s ease-in-out infinite ${line.delay}s`,
            }}
          />
        ))}
      </div>

      {/* === NEURAL NETWORK CONNECTIONS === */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <defs>
          <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        {/* Neural connection lines radiating from center */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * Math.PI / 180;
          const x2 = 50 + Math.cos(angle) * 50;
          const y2 = 50 + Math.sin(angle) * 50;
          return (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="url(#neuralGrad)"
              strokeWidth="1"
              style={{
                animation: `pulseLine 2s ease-in-out infinite ${i * 0.15}s`,
              }}
            />
          );
        })}
      </svg>

      {/* === DATA GRID === */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 70%)',
          animation: 'gridPulse 4s ease-in-out infinite',
        }}
      />

      {/* === AMBIENT GLOW CLOUDS === */}
      <div 
        className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, transparent 60%)',
          filter: 'blur(80px)',
          animation: 'floatCloud 20s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200, 200, 210, 0.06) 0%, transparent 60%)',
          filter: 'blur(100px)',
          animation: 'floatCloud 25s ease-in-out infinite reverse',
        }}
      />

      {/* === SCANNING BEAM === */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%)',
          animation: 'scanBeam 6s ease-in-out infinite',
        }}
      />

      {/* === DEPTH BLUR OVERLAY (Far Particles) === */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />

      {/* === VIGNETTE === */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.9) 100%)',
        }}
      />
      
      {/* === CONTENT PROTECTION OVERLAY === */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      />

      {/* === CSS ANIMATIONS === */}
      <style>{`
        @keyframes pulseCore {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes expandRing {
          0% { transform: scale(0.8); opacity: 0.3; }
          100% { transform: scale(2); opacity: 0; }
        }
        
        @keyframes streamToCenter {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translate(
              calc((50vw - 50%) * 0.8),
              calc((50vh - 50%) * 0.8)
            ) scale(0.3);
            opacity: 0;
          }
        }
        
        @keyframes speedLine {
          0% {
            transform: translateX(-100%) scaleX(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(100vw) scaleX(1.5);
            opacity: 0;
          }
        }
        
        @keyframes pulseLine {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.4; }
        }
        
        @keyframes gridPulse {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.05; }
        }
        
        @keyframes floatCloud {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -20px); }
        }
        
        @keyframes scanBeam {
          0%, 100% { transform: translateX(-50%) rotate(-30deg); opacity: 0; }
          25% { opacity: 0.4; }
          50% { transform: translateX(-50%) rotate(30deg); opacity: 0.6; }
          75% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};
