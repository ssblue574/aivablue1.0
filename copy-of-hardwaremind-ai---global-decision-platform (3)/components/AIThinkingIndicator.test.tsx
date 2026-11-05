/**
 * Property-Based Tests for AI Thinking Indicator
 * Feature: futuristic-ui-redesign
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { AIThinkingIndicator, ThinkingStyle } from './AIThinkingIndicator';
import { ThemeProvider } from '../ThemeContext';

describe('AI Thinking Indicator Property Tests', () => {
  beforeEach(() => {
    // Clear any existing theme attributes
    document.documentElement.removeAttribute('data-theme');
  });

  /**
   * Property 7: AI Interaction Visualization
   * Validates: Requirements 3.2
   * Feature: futuristic-ui-redesign, Property 7: AI Interaction Visualization
   * 
   * For any AI assistant interaction, the system should display pulsating light effects,
   * thinking animation, or intelligent response indicator to visualize the AI thinking process.
   */
  it('Property 7: AI indicator should display visual thinking animation when active', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          style: fc.constantFrom<ThinkingStyle>('pulse', 'wave', 'neural'),
          size: fc.integer({ min: 40, max: 120 }),
          message: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
        }),
        async (props) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style={props.style}
                size={props.size}
                message={props.message}
              />
            </ThemeProvider>
          );

          try {
            const indicator = container.querySelector('.ai-thinking-indicator') as HTMLElement;
            expect(indicator).toBeTruthy();
            
            if (!indicator) return false;

            // Verify indicator is visible (not hidden)
            const isVisible = indicator.style.display !== 'none';

            // Check for visual elements based on style
            let hasVisualAnimation = false;

            if (props.style === 'pulse') {
              // Pulse style should have a pulsating orb with radial gradient
              await waitFor(() => {
                const pulseElement = indicator.querySelector('[style*="radial-gradient"]') as HTMLElement;
                expect(pulseElement).toBeTruthy();
              }, { timeout: 500 });

              const pulseElement = indicator.querySelector('[style*="radial-gradient"]') as HTMLElement;
              hasVisualAnimation = pulseElement !== null;

              // Should have box-shadow for glow effect
              if (pulseElement) {
                const hasGlow = pulseElement.style.boxShadow !== '' && 
                               pulseElement.style.boxShadow !== 'none';
                hasVisualAnimation = hasVisualAnimation && hasGlow;
              }
            } else if (props.style === 'wave') {
              // Wave style should have multiple ripple elements
              await waitFor(() => {
                const waveElements = indicator.querySelectorAll('[style*="border"]');
                expect(waveElements.length).toBeGreaterThan(0);
              }, { timeout: 500 });

              const waveElements = indicator.querySelectorAll('[style*="border"]');
              hasVisualAnimation = waveElements.length >= 3; // Should have at least 3 waves

              // Waves should have border styling
              if (waveElements.length > 0) {
                const firstWave = waveElements[0] as HTMLElement;
                const hasBorder = firstWave.style.border !== '' && 
                                 firstWave.style.border !== 'none';
                hasVisualAnimation = hasVisualAnimation && hasBorder;
              }
            } else if (props.style === 'neural') {
              // Neural style should have a canvas element
              await waitFor(() => {
                const canvas = indicator.querySelector('canvas');
                expect(canvas).toBeTruthy();
              }, { timeout: 500 });

              const canvas = indicator.querySelector('canvas') as HTMLCanvasElement;
              hasVisualAnimation = canvas !== null;

              // Canvas should have proper dimensions
              if (canvas) {
                const hasSize = canvas.width > 0 && canvas.height > 0;
                hasVisualAnimation = hasVisualAnimation && hasSize;
              }
            }

            // If message is provided, it should be displayed
            let hasMessage = true;
            if (props.message) {
              const messageElement = Array.from(indicator.children).find(
                child => child.textContent === props.message
              );
              hasMessage = messageElement !== undefined;
            }

            return isVisible && hasVisualAnimation && hasMessage;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50, timeout: 30000 }
    );
  }, 35000);

  /**
   * Additional property: Inactive indicator should not render
   * Ensures component returns null when not active
   */
  it('Property: Inactive indicator should not render any elements', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<ThinkingStyle>('pulse', 'wave', 'neural'),
        async (style) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={false}
                style={style}
                message="This should not appear"
              />
            </ThemeProvider>
          );

          try {
            // When inactive, component should return null
            const indicator = container.querySelector('.ai-thinking-indicator');
            
            // Should not find the indicator element
            return indicator === null;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: Size prop affects visual dimensions
   * Ensures size parameter controls the indicator size
   */
  it('Property: Size prop should control indicator dimensions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          style: fc.constantFrom<ThinkingStyle>('pulse', 'wave'),  // Exclude neural due to jsdom canvas limitations
          size: fc.integer({ min: 40, max: 120 }),
        }),
        async (props) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style={props.style}
                size={props.size}
              />
            </ThemeProvider>
          );

          try {
            const indicator = container.querySelector('.ai-thinking-indicator') as HTMLElement;
            expect(indicator).toBeTruthy();
            
            if (!indicator) return false;

            let hasSizeApplied = false;

            if (props.style === 'pulse') {
              const pulseElement = indicator.querySelector('[style*="radial-gradient"]') as HTMLElement;
              if (pulseElement) {
                const width = parseInt(pulseElement.style.width);
                const height = parseInt(pulseElement.style.height);
                hasSizeApplied = width === props.size && height === props.size;
              }
            } else if (props.style === 'wave') {
              const waveContainer = indicator.querySelector('[style*="position: relative"]') as HTMLElement;
              if (waveContainer) {
                const width = parseInt(waveContainer.style.width);
                const height = parseInt(waveContainer.style.height);
                hasSizeApplied = width === props.size && height === props.size;
              }
            }

            return hasSizeApplied;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Message is displayed when provided
   * Ensures optional message appears correctly
   */
  it('Property: Message should be displayed when provided', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (message) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style="pulse"
                message={message}
              />
            </ThemeProvider>
          );

          try {
            const indicator = container.querySelector('.ai-thinking-indicator') as HTMLElement;
            expect(indicator).toBeTruthy();
            
            if (!indicator) return false;

            // Find message element
            const messageElement = Array.from(indicator.children).find(
              child => child.textContent === message
            ) as HTMLElement;

            expect(messageElement).toBeTruthy();
            
            if (!messageElement) return false;

            // Message should have proper styling
            const hasTextStyling = messageElement.style.fontSize !== '' &&
                                  messageElement.style.color !== '';

            // Message should be centered
            const isCentered = messageElement.style.textAlign === 'center';

            return hasTextStyling && isCentered;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Different styles produce different visuals
   * Ensures each style has unique visual characteristics
   */
  it('Property: Different styles should produce distinct visual elements', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.constantFrom<ThinkingStyle>('pulse', 'wave', 'neural'),
          fc.constantFrom<ThinkingStyle>('pulse', 'wave', 'neural')
        ),
        async ([style1, style2]) => {
          // Skip if same style
          if (style1 === style2) return true;

          const { container: container1, unmount: unmount1 } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style={style1}
                size={60}
              />
            </ThemeProvider>
          );

          const { container: container2, unmount: unmount2 } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style={style2}
                size={60}
              />
            </ThemeProvider>
          );

          try {
            const indicator1 = container1.querySelector('.ai-thinking-indicator') as HTMLElement;
            const indicator2 = container2.querySelector('.ai-thinking-indicator') as HTMLElement;

            expect(indicator1).toBeTruthy();
            expect(indicator2).toBeTruthy();

            if (!indicator1 || !indicator2) return false;

            // Check for style-specific elements
            const hasCanvas1 = indicator1.querySelector('canvas') !== null;
            const hasCanvas2 = indicator2.querySelector('canvas') !== null;

            const hasRadialGradient1 = indicator1.querySelector('[style*="radial-gradient"]') !== null;
            const hasRadialGradient2 = indicator2.querySelector('[style*="radial-gradient"]') !== null;

            const hasBorderElements1 = indicator1.querySelectorAll('[style*="border"]').length > 0;
            const hasBorderElements2 = indicator2.querySelectorAll('[style*="border"]').length > 0;

            // Different styles should have different element types
            const isDifferent = 
              hasCanvas1 !== hasCanvas2 ||
              hasRadialGradient1 !== hasRadialGradient2 ||
              hasBorderElements1 !== hasBorderElements2;

            return isDifferent;
          } finally {
            unmount1();
            unmount2();
          }
        }
      ),
      { numRuns: 20, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Pulse style has glow effect
   * Ensures pulse animation includes box-shadow glow
   */
  it('Property: Pulse style should have glowing effect', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 40, max: 100 }),
        async (size) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style="pulse"
                size={size}
              />
            </ThemeProvider>
          );

          try {
            const indicator = container.querySelector('.ai-thinking-indicator') as HTMLElement;
            expect(indicator).toBeTruthy();
            
            if (!indicator) return false;

            await waitFor(() => {
              const pulseElement = indicator.querySelector('[style*="radial-gradient"]') as HTMLElement;
              expect(pulseElement).toBeTruthy();
            }, { timeout: 500 });

            const pulseElement = indicator.querySelector('[style*="radial-gradient"]') as HTMLElement;
            
            if (!pulseElement) return false;

            // Should have box-shadow for glow
            const hasBoxShadow = pulseElement.style.boxShadow !== '' && 
                                pulseElement.style.boxShadow !== 'none';

            // Should have radial gradient background
            const hasRadialGradient = pulseElement.style.background.includes('radial-gradient');

            // Should be circular
            const isCircular = pulseElement.style.borderRadius === '50%';

            return hasBoxShadow && hasRadialGradient && isCircular;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  }, 15000);

  /**
   * Additional property: Wave style has multiple ripples
   * Ensures wave animation creates multiple expanding circles
   */
  it('Property: Wave style should have multiple ripple elements', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('test'),
        async (_) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style="wave"
                size={60}
              />
            </ThemeProvider>
          );

          try {
            const indicator = container.querySelector('.ai-thinking-indicator') as HTMLElement;
            expect(indicator).toBeTruthy();
            
            if (!indicator) return false;

            await waitFor(() => {
              const waveElements = indicator.querySelectorAll('[style*="border"]');
              expect(waveElements.length).toBeGreaterThan(0);
            }, { timeout: 500 });

            // Should have multiple wave elements (at least 3)
            const waveElements = indicator.querySelectorAll('[style*="border"]');
            const hasMultipleWaves = waveElements.length >= 3;

            // Each wave should be circular
            let allCircular = true;
            waveElements.forEach((wave) => {
              const element = wave as HTMLElement;
              if (element.style.borderRadius !== '50%') {
                allCircular = false;
              }
            });

            // Should have a center core
            const centerCore = Array.from(indicator.querySelectorAll('[style*="background"]')).find(
              el => {
                const element = el as HTMLElement;
                return element.style.background.includes('gradient') &&
                       element.style.borderRadius === '50%';
              }
            );
            const hasCenterCore = centerCore !== undefined;

            return hasMultipleWaves && allCircular && hasCenterCore;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: Neural style uses canvas
   * Ensures neural animation is canvas-based
   * Note: jsdom doesn't fully support canvas, so we only check for canvas element presence
   */
  it('Property: Neural style should use canvas for rendering', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 50, max: 100 }),
        async (size) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style="neural"
                size={size}
              />
            </ThemeProvider>
          );

          try {
            const indicator = container.querySelector('.ai-thinking-indicator') as HTMLElement;
            expect(indicator).toBeTruthy();
            
            if (!indicator) return false;

            await waitFor(() => {
              const canvas = indicator.querySelector('canvas');
              expect(canvas).toBeTruthy();
            }, { timeout: 500 });

            const canvas = indicator.querySelector('canvas') as HTMLCanvasElement;
            
            if (!canvas) return false;

            // Canvas should have proper dimensions
            const hasWidth = canvas.width === size;
            const hasHeight = canvas.height === size;

            // Note: jsdom doesn't implement getContext(), so we skip context check
            // In a real browser, canvas would have 2d context available

            return hasWidth && hasHeight;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  }, 15000);

  /**
   * Additional property: Container has proper layout
   * Ensures indicator container uses flexbox for centering
   */
  it('Property: Container should use flexbox for proper layout', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<ThinkingStyle>('pulse', 'wave', 'neural'),
        async (style) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style={style}
                message="Test message"
              />
            </ThemeProvider>
          );

          try {
            const indicator = container.querySelector('.ai-thinking-indicator') as HTMLElement;
            expect(indicator).toBeTruthy();
            
            if (!indicator) return false;

            // Container should use flexbox
            const hasFlex = indicator.style.display === 'flex';

            // Should be column direction (animation above message)
            const isColumn = indicator.style.flexDirection === 'column';

            // Should center items
            const isCentered = indicator.style.alignItems === 'center';

            return hasFlex && isColumn && isCentered;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: Class name is applied
   * Ensures custom className prop is respected
   */
  it('Property: Custom className should be applied to container', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate valid CSS class names (alphanumeric, dash, underscore)
        fc.string({ minLength: 1, maxLength: 30 })
          .filter(s => /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(s)),
        async (className) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <AIThinkingIndicator
                active={true}
                style="pulse"
                className={className}
              />
            </ThemeProvider>
          );

          try {
            // Find by base class first
            const indicator = container.querySelector('.ai-thinking-indicator') as HTMLElement;
            
            expect(indicator).toBeTruthy();
            
            if (!indicator) return false;

            // Should have both base class and custom class
            const hasBaseClass = indicator.classList.contains('ai-thinking-indicator');
            const hasCustomClass = indicator.classList.contains(className);

            return hasBaseClass && hasCustomClass;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });
});
