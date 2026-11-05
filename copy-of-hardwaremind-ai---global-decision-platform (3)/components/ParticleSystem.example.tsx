import React from 'react';
import { ParticleSystem } from './ParticleSystem';

/**
 * Example usage of ParticleSystem component
 * 
 * This file demonstrates the three behavior modes:
 * - float: Slow, random floating particles (like dust)
 * - flow: Directional flowing particles (like data streams)
 * - burst: Explosive particles from center (for interactions)
 */

export const ParticleSystemExamples: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gray-900">
      <div className="container mx-auto p-8 space-y-12">
        <h1 className="text-4xl font-bold text-white mb-8">
          ParticleSystem Examples
        </h1>

        {/* Float Behavior */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Float Behavior
          </h2>
          <p className="text-gray-400">
            Slow, random floating particles - perfect for ambient background effects
          </p>
          <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
            <ParticleSystem
              behavior="float"
              count={100}
              speed={1}
              size={[2, 6]}
              color={['#00FFC6', '#FF5FD2', '#8B5CF6']}
            />
          </div>
        </section>

        {/* Flow Behavior */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Flow Behavior
          </h2>
          <p className="text-gray-400">
            Directional flowing particles - simulates data streams or energy flow
          </p>
          <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
            <ParticleSystem
              behavior="flow"
              count={80}
              speed={1.5}
              size={[3, 8]}
              color={['#00FFC6', '#6AA8FF']}
            />
          </div>
        </section>

        {/* Burst Behavior */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Burst Behavior
          </h2>
          <p className="text-gray-400">
            Explosive particles from center - great for interaction feedback
          </p>
          <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
            <ParticleSystem
              behavior="burst"
              count={120}
              speed={2}
              size={[2, 5]}
              color={['#FF5FD2', '#FF4D00', '#8B5CF6']}
            />
          </div>
        </section>

        {/* Performance Comparison */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Performance Adaptation
          </h2>
          <p className="text-gray-400">
            The system automatically adjusts particle count based on device performance
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative h-64 bg-black rounded-lg overflow-hidden">
              <div className="absolute top-2 left-2 text-white text-sm z-10">
                High Performance (100%)
              </div>
              <ParticleSystem
                behavior="float"
                count={200}
                speed={1}
                size={[2, 6]}
              />
            </div>
            <div className="relative h-64 bg-black rounded-lg overflow-hidden">
              <div className="absolute top-2 left-2 text-white text-sm z-10">
                Medium Performance (60%)
              </div>
              <ParticleSystem
                behavior="float"
                count={120}
                speed={1}
                size={[2, 6]}
              />
            </div>
            <div className="relative h-64 bg-black rounded-lg overflow-hidden">
              <div className="absolute top-2 left-2 text-white text-sm z-10">
                Low Performance (30%)
              </div>
              <ParticleSystem
                behavior="float"
                count={60}
                speed={1}
                size={[2, 6]}
              />
            </div>
          </div>
        </section>

        {/* Custom Colors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Custom Color Schemes
          </h2>
          <p className="text-gray-400">
            Customize particle colors to match your brand or theme
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-64 bg-black rounded-lg overflow-hidden">
              <div className="absolute top-2 left-2 text-white text-sm z-10">
                Warm Colors
              </div>
              <ParticleSystem
                behavior="float"
                count={100}
                speed={0.8}
                size={[3, 7]}
                color={['#FF4D00', '#FF6B00', '#FF8800']}
              />
            </div>
            <div className="relative h-64 bg-black rounded-lg overflow-hidden">
              <div className="absolute top-2 left-2 text-white text-sm z-10">
                Cool Colors
              </div>
              <ParticleSystem
                behavior="flow"
                count={100}
                speed={1.2}
                size={[3, 7]}
                color={['#00FFC6', '#00E5B0', '#00CCB3']}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ParticleSystemExamples;
