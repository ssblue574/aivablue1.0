// Example usage of the Interaction Feedback System

import React from 'react';
import { useInteractionFeedback } from '../hooks/useInteractionFeedback';

export const InteractionFeedbackExample: React.FC = () => {
  // Example 1: Ripple effect on click
  const rippleButton = useInteractionFeedback({
    enableRipple: true,
    rippleConfig: {
      color: 'rgba(0, 255, 198, 0.4)',
      duration: 600,
    },
  });

  // Example 2: Glow effect on click
  const glowButton = useInteractionFeedback({
    enableGlow: true,
    glowConfig: {
      color: 'rgba(139, 92, 246, 0.6)',
      intensity: 20,
      duration: 300,
      spread: 40,
    },
  });

  // Example 3: Particle burst on click
  const particleButton = useInteractionFeedback({
    enableParticles: true,
    particleConfig: {
      count: 12,
      colors: ['#00FFC6', '#FF5FD2', '#8B5CF6', '#6AA8FF'],
      duration: 800,
      spread: 100,
    },
  });

  // Example 4: 3D depth effect on hover
  const depthCard = useInteractionFeedback({
    enable3D: true,
    depthConfig: {
      depth: 10,
      duration: 300,
      rotateX: 2,
      rotateY: -5,
      scale: 1.02,
    },
  });

  // Example 5: Combined effects
  const combinedButton = useInteractionFeedback({
    enableRipple: true,
    enableGlow: true,
    enableParticles: true,
    rippleConfig: { color: 'rgba(255, 95, 210, 0.4)' },
    glowConfig: { color: 'rgba(255, 95, 210, 0.6)' },
    particleConfig: { count: 8, colors: ['#FF5FD2', '#8B5CF6'] },
  });

  // Example 6: Smooth hover effect
  const hoverCard = useInteractionFeedback({
    enable3D: false,
    hoverConfig: {
      scale: 1.05,
      glowColor: 'rgba(0, 255, 198, 0.3)',
      glowIntensity: 20,
      duration: 300,
    },
  });

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-gray-900 to-black min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-8">
        Interaction Feedback System Examples
      </h1>

      {/* Ripple Effect */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-cyan-400">1. Ripple Effect</h2>
        <button
          onClick={rippleButton.handleClick}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-medium relative overflow-hidden"
        >
          Click for Ripple Effect
        </button>
      </div>

      {/* Glow Effect */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-purple-400">2. Glow Effect</h2>
        <button
          onClick={glowButton.handleClick}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium"
        >
          Click for Glow Effect
        </button>
      </div>

      {/* Particle Burst */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-pink-400">3. Particle Burst</h2>
        <button
          onClick={particleButton.handleClick}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-medium relative"
        >
          Click for Particle Burst
        </button>
      </div>

      {/* 3D Depth Effect */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-blue-400">4. 3D Depth Effect (Hover)</h2>
        <div
          onMouseEnter={depthCard.handleMouseEnter}
          onMouseLeave={depthCard.handleMouseLeave}
          className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Hover over me</h3>
          <p className="text-gray-300">
            This card will lift and tilt in 3D space when you hover over it.
          </p>
        </div>
      </div>

      {/* Combined Effects */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gradient bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
          5. Combined Effects
        </h2>
        <button
          onClick={combinedButton.handleClick}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white rounded-full font-medium relative overflow-hidden"
        >
          Click for All Effects
        </button>
      </div>

      {/* Smooth Hover */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-green-400">6. Smooth Hover Effect</h2>
        <div
          onMouseEnter={hoverCard.handleMouseEnter}
          onMouseLeave={hoverCard.handleMouseLeave}
          className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl border border-white/10"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Smooth Scale & Glow</h3>
          <p className="text-gray-300">
            This card smoothly scales up and glows when you hover over it.
          </p>
        </div>
      </div>

      {/* Programmatic Triggers */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-yellow-400">7. Programmatic Triggers</h2>
        <div className="flex gap-4">
          <button
            onClick={() => {
              const btn = document.getElementById('target-element');
              if (btn) rippleButton.triggerGlow(btn as HTMLElement);
            }}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg font-medium"
          >
            Trigger Glow
          </button>
          <div
            id="target-element"
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium"
          >
            Target Element
          </div>
        </div>
      </div>
    </div>
  );
};
