/**
 * Example usage of NeuralNetworkBackground component
 * 
 * This component creates a dynamic neural network visualization with:
 * - Animated nodes with pulsing effects
 * - Dynamic connection lines between nearby nodes
 * - Mouse interaction (nodes respond to cursor)
 * - Parallax scrolling effect
 * - Performance optimization with spatial partitioning
 * - Mobile performance degradation
 */

import React from 'react';
import { NeuralNetworkBackground } from './NeuralNetworkBackground';
import { ThemeProvider } from '../ThemeContext';

// Example 1: Basic usage with default settings
export const BasicExample = () => (
  <ThemeProvider>
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <NeuralNetworkBackground />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Your Content Here</h1>
        <p>The neural network background is behind this content.</p>
      </div>
    </div>
  </ThemeProvider>
);

// Example 2: Custom density and colors
export const CustomExample = () => (
  <ThemeProvider>
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <NeuralNetworkBackground
        density={0.7}
        connectionOpacity={0.5}
        color="#FF5FD2"
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Custom Neural Network</h1>
        <p>Higher density with magenta color theme.</p>
      </div>
    </div>
  </ThemeProvider>
);

// Example 3: Non-interactive with slower animation
export const StaticExample = () => (
  <ThemeProvider>
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <NeuralNetworkBackground
        interactive={false}
        animationSpeed={0.5}
        density={0.3}
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Static Background</h1>
        <p>No mouse interaction, slower animation, lower density.</p>
      </div>
    </div>
  </ThemeProvider>
);

// Example 4: Full-featured with all options
export const FullFeaturedExample = () => (
  <ThemeProvider>
    <div style={{ position: 'relative', minHeight: '200vh' }}>
      <NeuralNetworkBackground
        density={0.8}
        connectionOpacity={0.4}
        animationSpeed={1.2}
        interactive={true}
        color="#8B5CF6"
      />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
        <h1>Full-Featured Neural Network</h1>
        <p>Scroll down to see the parallax effect!</p>
        <div style={{ marginTop: '100vh' }}>
          <h2>Parallax Effect</h2>
          <p>Notice how the background moves at a different speed.</p>
        </div>
      </div>
    </div>
  </ThemeProvider>
);
