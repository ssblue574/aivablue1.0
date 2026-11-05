import React from 'react';
import { LoadingAnimation } from './LoadingAnimation';

/**
 * LoadingAnimation Component Examples
 * 
 * Demonstrates the four different loading animation types:
 * - spinner: Gradient ring rotation animation
 * - particles: Particle aggregation animation
 * - neural: Neural network pulsing effect
 * - wave: Ripple expansion animation
 */

export const LoadingAnimationExamples: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '60px',
      background: '#0a0a0a',
      minHeight: '100vh',
    }}>
      <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '20px' }}>
        LoadingAnimation Component Examples
      </h1>

      {/* Spinner Type */}
      <div>
        <h2 style={{ color: '#00FFC6', marginBottom: '20px' }}>Spinner Type</h2>
        <p style={{ color: '#999', marginBottom: '20px' }}>
          Gradient ring rotation animation with conic gradient
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Default</p>
            <LoadingAnimation type="spinner" />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>With Message</p>
            <LoadingAnimation 
              type="spinner" 
              message="Loading content..."
            />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Custom Size</p>
            <LoadingAnimation 
              type="spinner" 
              size={120}
              message="Processing..."
            />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Custom Color</p>
            <LoadingAnimation 
              type="spinner" 
              color="#FF5FD2"
              message="Syncing data..."
            />
          </div>
        </div>
      </div>

      {/* Particles Type */}
      <div>
        <h2 style={{ color: '#00FFC6', marginBottom: '20px' }}>Particles Type</h2>
        <p style={{ color: '#999', marginBottom: '20px' }}>
          Particle aggregation animation with orbiting particles
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Default</p>
            <LoadingAnimation type="particles" />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>With Message</p>
            <LoadingAnimation 
              type="particles" 
              message="Gathering data..."
            />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Custom Size</p>
            <LoadingAnimation 
              type="particles" 
              size={100}
              message="Analyzing..."
            />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Custom Color</p>
            <LoadingAnimation 
              type="particles" 
              color="#8B5CF6"
              message="Compiling..."
            />
          </div>
        </div>
      </div>

      {/* Neural Type */}
      <div>
        <h2 style={{ color: '#00FFC6', marginBottom: '20px' }}>Neural Type</h2>
        <p style={{ color: '#999', marginBottom: '20px' }}>
          Neural network pulsing effect with connected nodes
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Default</p>
            <LoadingAnimation type="neural" />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>With Message</p>
            <LoadingAnimation 
              type="neural" 
              message="AI thinking..."
            />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Custom Size</p>
            <LoadingAnimation 
              type="neural" 
              size={120}
              message="Processing neural network..."
            />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Custom Color</p>
            <LoadingAnimation 
              type="neural" 
              color="#6AA8FF"
              message="Training model..."
            />
          </div>
        </div>
      </div>

      {/* Wave Type */}
      <div>
        <h2 style={{ color: '#00FFC6', marginBottom: '20px' }}>Wave Type</h2>
        <p style={{ color: '#999', marginBottom: '20px' }}>
          Ripple expansion animation with concentric waves
        </p>
        <div style={{ 
          display: 'flex', 
          gap: '40px', 
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Default</p>
            <LoadingAnimation type="wave" />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>With Message</p>
            <LoadingAnimation 
              type="wave" 
              message="Broadcasting..."
            />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Custom Size</p>
            <LoadingAnimation 
              type="wave" 
              size={100}
              message="Connecting..."
            />
          </div>
          <div>
            <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>Custom Color</p>
            <LoadingAnimation 
              type="wave" 
              color="#FF2D55"
              message="Transmitting..."
            />
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <h2 style={{ color: '#00FFC6', marginBottom: '20px' }}>Common Use Cases</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}>
          <div style={{
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Page Loading</h3>
            <LoadingAnimation 
              type="spinner" 
              size={60}
              message="Loading page..."
            />
          </div>

          <div style={{
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Data Processing</h3>
            <LoadingAnimation 
              type="particles" 
              size={60}
              message="Processing data..."
            />
          </div>

          <div style={{
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>AI Operations</h3>
            <LoadingAnimation 
              type="neural" 
              size={60}
              message="AI analyzing..."
            />
          </div>

          <div style={{
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}>
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Network Activity</h3>
            <LoadingAnimation 
              type="wave" 
              size={60}
              message="Connecting..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimationExamples;
