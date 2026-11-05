import React from 'react';
import { HolographicButton } from './HolographicButton';
import { ThemeProvider } from '../ThemeContext';
import { ThemeEngineProvider } from '../theme/ThemeEngine';

/**
 * Example usage of HolographicButton component
 * 
 * This file demonstrates all variants, sizes, and features of the HolographicButton.
 */
export const HolographicButtonExample: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemeEngineProvider>
        <div style={{ padding: '40px', minHeight: '100vh', background: '#0a0a0f' }}>
          <h1 style={{ color: '#fff', marginBottom: '40px', fontSize: '32px' }}>
            Holographic Button Examples
          </h1>

          {/* Variants */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#00FFC6', marginBottom: '20px', fontSize: '24px' }}>
              Variants
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <HolographicButton variant="primary">
                Primary Button
              </HolographicButton>
              <HolographicButton variant="secondary">
                Secondary Button
              </HolographicButton>
              <HolographicButton variant="ghost">
                Ghost Button
              </HolographicButton>
            </div>
          </section>

          {/* Sizes */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#00FFC6', marginBottom: '20px', fontSize: '24px' }}>
              Sizes
            </h2>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <HolographicButton size="sm">
                Small
              </HolographicButton>
              <HolographicButton size="md">
                Medium
              </HolographicButton>
              <HolographicButton size="lg">
                Large
              </HolographicButton>
            </div>
          </section>

          {/* Glow Intensity */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#00FFC6', marginBottom: '20px', fontSize: '24px' }}>
              Glow Intensity
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <HolographicButton glowIntensity={0.3}>
                Low Glow (0.3)
              </HolographicButton>
              <HolographicButton glowIntensity={0.5}>
                Medium Glow (0.5)
              </HolographicButton>
              <HolographicButton glowIntensity={1.0}>
                High Glow (1.0)
              </HolographicButton>
            </div>
          </section>

          {/* States */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#00FFC6', marginBottom: '20px', fontSize: '24px' }}>
              States
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <HolographicButton>
                Normal
              </HolographicButton>
              <HolographicButton disabled>
                Disabled
              </HolographicButton>
            </div>
          </section>

          {/* Ripple Effect */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#00FFC6', marginBottom: '20px', fontSize: '24px' }}>
              Ripple Effect
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <HolographicButton rippleEffect={true}>
                With Ripple
              </HolographicButton>
              <HolographicButton rippleEffect={false}>
                Without Ripple
              </HolographicButton>
            </div>
          </section>

          {/* Interactive Demo */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ color: '#00FFC6', marginBottom: '20px', fontSize: '24px' }}>
              Interactive Demo
            </h2>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <HolographicButton 
                variant="primary"
                onClick={() => alert('Primary clicked!')}
              >
                Click Me
              </HolographicButton>
              <HolographicButton 
                variant="secondary"
                onClick={() => console.log('Secondary clicked')}
              >
                Log to Console
              </HolographicButton>
              <HolographicButton 
                variant="ghost"
                size="lg"
                onClick={() => alert('Large ghost button!')}
              >
                Large Ghost
              </HolographicButton>
            </div>
          </section>

          {/* All Combinations */}
          <section>
            <h2 style={{ color: '#00FFC6', marginBottom: '20px', fontSize: '24px' }}>
              All Combinations
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {(['primary', 'secondary', 'ghost'] as const).map(variant => 
                (['sm', 'md', 'lg'] as const).map(size => (
                  <HolographicButton 
                    key={`${variant}-${size}`}
                    variant={variant}
                    size={size}
                  >
                    {variant} {size}
                  </HolographicButton>
                ))
              )}
            </div>
          </section>
        </div>
      </ThemeEngineProvider>
    </ThemeProvider>
  );
};

export default HolographicButtonExample;
