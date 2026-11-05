import React from 'react';
import { GlassmorphicCard } from './GlassmorphicCard';

export const GlassmorphicCardExample: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white mb-8">Glassmorphic Card Examples</h1>
        
        {/* Basic Card */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Basic Card</h2>
          <GlassmorphicCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-2">Basic Glassmorphic Card</h3>
            <p className="text-gray-300">
              This is a basic glassmorphic card with default settings. It features a semi-transparent
              background with backdrop blur effect.
            </p>
          </GlassmorphicCard>
        </div>

        {/* Hover Effects */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Hover Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassmorphicCard hoverEffect="lift" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Lift Effect</h3>
              <p className="text-gray-300">Hover to see the card lift up</p>
            </GlassmorphicCard>

            <GlassmorphicCard hoverEffect="glow" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Glow Effect</h3>
              <p className="text-gray-300">Hover to see the glow effect</p>
            </GlassmorphicCard>

            <GlassmorphicCard hoverEffect="scale" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Scale Effect</h3>
              <p className="text-gray-300">Hover to see the scale effect</p>
            </GlassmorphicCard>
          </div>
        </div>

        {/* Border Glow */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Border Glow</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassmorphicCard borderGlow hoverEffect="lift" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">With Border Glow</h3>
              <p className="text-gray-300">
                Hover to see the animated gradient border glow effect
              </p>
            </GlassmorphicCard>

            <GlassmorphicCard borderGlow hoverEffect="glow" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Glow + Border</h3>
              <p className="text-gray-300">
                Combining glow effect with border gradient
              </p>
            </GlassmorphicCard>
          </div>
        </div>

        {/* Custom Blur and Opacity */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Custom Blur & Opacity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassmorphicCard blur={10} opacity={0.05} className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Light Blur</h3>
              <p className="text-gray-300">blur: 10px, opacity: 0.05</p>
            </GlassmorphicCard>

            <GlassmorphicCard blur={20} opacity={0.1} className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Medium Blur</h3>
              <p className="text-gray-300">blur: 20px, opacity: 0.1</p>
            </GlassmorphicCard>

            <GlassmorphicCard blur={40} opacity={0.15} className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Heavy Blur</h3>
              <p className="text-gray-300">blur: 40px, opacity: 0.15</p>
            </GlassmorphicCard>
          </div>
        </div>

        {/* Complex Content */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">Complex Content</h2>
          <GlassmorphicCard borderGlow hoverEffect="lift" className="p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Product Card</h3>
                <p className="text-gray-300 mb-4">
                  This demonstrates how the glassmorphic card can be used for complex content
                  like product cards, profile cards, or feature highlights.
                </p>
                <div className="flex space-x-4">
                  <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
                    Learn More
                  </button>
                  <button className="px-4 py-2 border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>
    </div>
  );
};
