import React, { useState } from 'react';
import { AIThinkingIndicator } from './AIThinkingIndicator';

export const AIThinkingIndicatorExample: React.FC = () => {
  const [activeStyle, setActiveStyle] = useState<'pulse' | 'wave' | 'neural'>('pulse');
  const [isActive, setIsActive] = useState(true);
  const [showMessage, setShowMessage] = useState(true);

  return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
      <h2>AI Thinking Indicator Examples</h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setIsActive(!isActive)}>
          {isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button onClick={() => setShowMessage(!showMessage)}>
          {showMessage ? 'Hide Message' : 'Show Message'}
        </button>
        <select value={activeStyle} onChange={(e) => setActiveStyle(e.target.value as any)}>
          <option value="pulse">Pulse</option>
          <option value="wave">Wave</option>
          <option value="neural">Neural</option>
        </select>
      </div>

      {/* Pulse Style */}
      <div>
        <h3>Pulse Style</h3>
        <p>Pulsating light orb animation - smooth breathing effect</p>
        <AIThinkingIndicator
          active={isActive && activeStyle === 'pulse'}
          style="pulse"
          message={showMessage ? 'AI is thinking...' : undefined}
          size={80}
        />
      </div>

      {/* Wave Style */}
      <div>
        <h3>Wave Style</h3>
        <p>Ripple expansion effect - waves emanating from center</p>
        <AIThinkingIndicator
          active={isActive && activeStyle === 'wave'}
          style="wave"
          message={showMessage ? 'Processing your request...' : undefined}
          size={80}
        />
      </div>

      {/* Neural Style */}
      <div>
        <h3>Neural Style</h3>
        <p>Neural network activation animation - nodes and connections</p>
        <AIThinkingIndicator
          active={isActive && activeStyle === 'neural'}
          style="neural"
          message={showMessage ? 'Analyzing data...' : undefined}
          size={80}
        />
      </div>

      {/* Different Sizes */}
      <div>
        <h3>Different Sizes</h3>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <div>
            <p>Small (40px)</p>
            <AIThinkingIndicator
              active={isActive}
              style={activeStyle}
              size={40}
            />
          </div>
          <div>
            <p>Medium (60px)</p>
            <AIThinkingIndicator
              active={isActive}
              style={activeStyle}
              size={60}
            />
          </div>
          <div>
            <p>Large (100px)</p>
            <AIThinkingIndicator
              active={isActive}
              style={activeStyle}
              size={100}
            />
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <h3>Use Cases</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>Chat Interface</h4>
          <div style={{ 
            padding: '20px', 
            background: 'rgba(0, 0, 0, 0.05)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <AIThinkingIndicator
              active={isActive}
              style="pulse"
              size={40}
            />
            <span>AI is typing a response...</span>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h4>Loading State</h4>
          <div style={{ 
            padding: '40px', 
            background: 'rgba(0, 0, 0, 0.05)', 
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '15px'
          }}>
            <AIThinkingIndicator
              active={isActive}
              style="neural"
              message="Generating insights from your data..."
              size={80}
            />
          </div>
        </div>

        <div>
          <h4>Processing Indicator</h4>
          <div style={{ 
            padding: '20px', 
            background: 'rgba(0, 0, 0, 0.05)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Analyzing image content...</span>
            <AIThinkingIndicator
              active={isActive}
              style="wave"
              size={50}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
