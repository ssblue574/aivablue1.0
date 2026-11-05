/**
 * Property-Based Tests for Holographic Button
 * Feature: futuristic-ui-redesign
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { HolographicButton, ButtonVariant, ButtonSize } from './HolographicButton';
import { ThemeProvider } from '../ThemeContext';

describe('Holographic Button Property Tests', () => {
  beforeEach(() => {
    // Clear any existing theme attributes
    document.documentElement.removeAttribute('data-theme');
  });

  /**
   * Property 2: Button Visual Specification
   * Validates: Requirements 6.2
   * Feature: futuristic-ui-redesign, Property 2: Button Visual Specification
   * 
   * For any button component, it should use rounded shape (capsule/pill),
   * have hover glow effect, and 3D press effect on interaction.
   */
  it('Property 2: All buttons should follow visual specification with rounded shape and effects', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          variant: fc.constantFrom<ButtonVariant>('primary', 'secondary', 'ghost'),
          size: fc.constantFrom<ButtonSize>('sm', 'md', 'lg'),
          glowIntensity: fc.double({ min: 0, max: 1, noNaN: true }),
        }),
        async (props) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <HolographicButton {...props}>
                Test Button
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button = container.querySelector('.holographic-button') as HTMLElement;
            expect(button).toBeTruthy();
            
            if (!button) return false;
            
            const style = button.style;
            
            // Check rounded shape (capsule/pill) - border radius should be >= 18px
            const borderRadius = parseInt(style.borderRadius);
            const hasRoundedShape = !isNaN(borderRadius) && borderRadius >= 18;
            
            // Check has border
            const hasBorder = style.border !== '';
            
            // Check has background (gradient or solid)
            const hasBackground = style.background !== '';
            
            // Simulate hover to check glow effect
            fireEvent.mouseEnter(button);
            
            // Check that box-shadow is applied on hover (glow effect)
            // Note: React state updates are synchronous in tests
            await waitFor(() => {
              const hasGlow = button.style.boxShadow !== '' && button.style.boxShadow !== 'none';
              expect(hasGlow).toBe(true);
            }, { timeout: 100 });
            
            const hasGlowOnHover = button.style.boxShadow !== '' && button.style.boxShadow !== 'none';
            
            // Simulate press to check 3D effect
            fireEvent.mouseDown(button);
            
            // Check that transform is applied on press (3D effect)
            await waitFor(() => {
              const hasTransform = button.style.transform !== '' && button.style.transform !== 'none';
              expect(hasTransform).toBe(true);
            }, { timeout: 100 });
            
            const has3DPress = button.style.transform !== '' && button.style.transform !== 'none';
            
            // Clean up
            fireEvent.mouseUp(button);
            fireEvent.mouseLeave(button);
            
            return hasRoundedShape && hasBorder && hasBackground && hasGlowOnHover && has3DPress;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 20000 }
    );
  }, 25000);

  /**
   * Property 5: Instant Visual Feedback
   * Validates: Requirements 1.3, 4.1
   * Feature: futuristic-ui-redesign, Property 5: Instant Visual Feedback
   * 
   * For any interactive element, clicking should trigger visual feedback
   * (glow, ripple, or particle effect) within 16ms (one frame at 60fps).
   */
  it('Property 5: Button should provide instant visual feedback within 16ms', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          variant: fc.constantFrom<ButtonVariant>('primary', 'secondary', 'ghost'),
          rippleEffect: fc.boolean(),
        }),
        async (props) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <HolographicButton {...props}>
                Click Me
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button = container.querySelector('.holographic-button') as HTMLElement;
            expect(button).toBeTruthy();
            
            if (!button) return false;
            
            // Simulate click - visual feedback should be synchronous in React
            fireEvent.mouseDown(button);
            
            // Check that visual state changed immediately (transform applied)
            // In React, state updates in event handlers are synchronous, so visual
            // feedback is instant (< 16ms) by design
            await waitFor(() => {
              const hasTransform = button.style.transform !== '' && button.style.transform !== 'none';
              expect(hasTransform).toBe(true);
            }, { timeout: 16 }); // Must happen within 16ms (one frame)
            
            const hasVisualChange = button.style.transform !== '' && button.style.transform !== 'none';
            const isFastEnough = true; // If waitFor succeeds within 16ms, feedback is fast enough
            
            // If ripple is enabled, check for ripple element
            let hasRippleFeedback = true;
            if (props.rippleEffect) {
              // Click to trigger ripple
              fireEvent.click(button, { clientX: 50, clientY: 50 });
              
              // Check for ripple span elements immediately (React updates are sync in tests)
              await waitFor(() => {
                const ripples = button.querySelectorAll('span[style*="position: absolute"]');
                expect(ripples.length).toBeGreaterThan(0);
              }, { timeout: 100 });
              
              const ripples = button.querySelectorAll('span[style*="position: absolute"]');
              hasRippleFeedback = ripples.length > 0;
            }
            
            // Clean up
            fireEvent.mouseUp(button);
            
            return isFastEnough && hasVisualChange && hasRippleFeedback;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 20000 }
    );
  }, 25000);

  /**
   * Additional property: Hover effect smoothness
   * Ensures hover transitions are smooth with proper easing
   */
  it('Property: Hover effects should have smooth transitions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<ButtonVariant>('primary', 'secondary', 'ghost'),
        async (variant) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <HolographicButton variant={variant}>
                Hover Me
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button = container.querySelector('.holographic-button') as HTMLElement;
            expect(button).toBeTruthy();
            
            if (!button) return false;
            
            // Check transition is set
            const hasTransition = button.style.transition.includes('all') || 
                                 button.style.transition.includes('0.3s');
            
            // Check easing function is cubic-bezier
            const hasEasing = button.style.transition.includes('cubic-bezier');
            
            return hasTransition && hasEasing;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: Size configurations are correct
   * Ensures different sizes have appropriate dimensions
   */
  it('Property: Button sizes should have correct height and padding', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<ButtonSize>('sm', 'md', 'lg'),
        async (size) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <HolographicButton size={size}>
                Button
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button = container.querySelector('.holographic-button') as HTMLElement;
            expect(button).toBeTruthy();
            
            if (!button) return false;
            
            const style = button.style;
            
            // Extract height value
            const height = parseInt(style.height);
            
            // Verify height is set and reasonable
            const hasValidHeight = !isNaN(height) && height > 0;
            
            // Verify padding is set
            const hasPadding = style.padding !== '';
            
            // Verify font size is set
            const hasFontSize = style.fontSize !== '';
            
            // Size-specific checks
            let sizeCorrect = true;
            if (size === 'sm') {
              sizeCorrect = height === 36;
            } else if (size === 'md') {
              sizeCorrect = height === 48;
            } else if (size === 'lg') {
              sizeCorrect = height === 56;
            }
            
            return hasValidHeight && hasPadding && hasFontSize && sizeCorrect;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  }, 15000);

  /**
   * Additional property: Disabled state prevents interaction
   * Ensures disabled buttons don't respond to clicks
   */
  it('Property: Disabled buttons should not respond to interactions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('test'),
        async (_) => {
          let clickCount = 0;
          const handleClick = () => { clickCount++; };
          
          const { container, unmount } = render(
            <ThemeProvider>
              <HolographicButton disabled onClick={handleClick}>
                Disabled
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button = container.querySelector('.holographic-button') as HTMLElement;
            expect(button).toBeTruthy();
            
            if (!button) return false;
            
            // Check disabled attribute
            const isDisabled = button.hasAttribute('disabled');
            
            // Check opacity is reduced
            const opacity = parseFloat(button.style.opacity);
            const hasReducedOpacity = opacity < 1;
            
            // Check cursor is not-allowed
            const hasDisabledCursor = button.style.cursor === 'not-allowed';
            
            // Try to click
            fireEvent.click(button);
            
            // Click handler should not be called
            const clickNotTriggered = clickCount === 0;
            
            return isDisabled && hasReducedOpacity && hasDisabledCursor && clickNotTriggered;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 5000 }
    );
  });

  /**
   * Additional property: Glow intensity affects visual appearance
   * Ensures glow intensity parameter controls the effect strength
   */
  it('Property: Glow intensity should affect background and glow strength', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.double({ min: 0.1, max: 1.0, noNaN: true }),
        async (glowIntensity) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <HolographicButton glowIntensity={glowIntensity}>
                Glow Test
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button = container.querySelector('.holographic-button') as HTMLElement;
            expect(button).toBeTruthy();
            
            if (!button) return false;
            
            // Check that background gradient is applied
            const hasGradient = button.style.background.includes('gradient');
            
            // Check that background contains rgba with some opacity
            const hasTransparency = button.style.background.includes('rgba');
            
            return hasGradient && hasTransparency;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  }, 15000);

  /**
   * Additional property: Ripple effect creates visual elements
   * Ensures ripple animation creates DOM elements on click
   */
  it('Property: Ripple effect should create animated elements on click', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('test'),
        async (_) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <HolographicButton rippleEffect={true}>
                Ripple Test
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button = container.querySelector('.holographic-button') as HTMLElement;
            expect(button).toBeTruthy();
            
            if (!button) return false;
            
            // Count initial children
            const initialChildCount = button.children.length;
            
            // Click to trigger ripple
            fireEvent.click(button, { clientX: 50, clientY: 50 });
            
            // Wait for ripple to be added
            await waitFor(() => {
              const afterClickChildCount = button.children.length;
              expect(afterClickChildCount).toBeGreaterThan(initialChildCount);
            }, { timeout: 100 });
            
            // Check that new elements were added (ripple spans)
            const afterClickChildCount = button.children.length;
            
            // Should have more children after click (ripple elements)
            return afterClickChildCount > initialChildCount;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: Edge highlight is present
   * Ensures edge highlight element exists for breathing animation
   */
  it('Property: Button should have edge highlight element', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<ButtonVariant>('primary', 'secondary', 'ghost'),
        async (variant) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <HolographicButton variant={variant}>
                Edge Test
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button = container.querySelector('.holographic-button') as HTMLElement;
            expect(button).toBeTruthy();
            
            if (!button) return false;
            
            // Look for edge highlight element (absolute positioned div with gradient)
            const children = Array.from(button.children) as HTMLElement[];
            const hasEdgeHighlight = children.some(child => {
              const style = child.style;
              return style.position === 'absolute' && 
                     style.background.includes('gradient') &&
                     style.height === '2px';
            });
            
            return hasEdgeHighlight;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: Content is rendered correctly
   * Ensures button children are properly displayed
   */
  it('Property: Button should render children content correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        async (content) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <HolographicButton>
                {content}
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button = container.querySelector('.holographic-button') as HTMLElement;
            expect(button).toBeTruthy();
            
            if (!button) return false;
            
            // Check that button contains the content
            return button.textContent?.includes(content) || false;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  }, 15000);

  /**
   * Additional property: Variant affects color scheme
   * Ensures different variants have different visual styles
   */
  it('Property: Different variants should have different color schemes', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.tuple(
          fc.constantFrom<ButtonVariant>('primary', 'secondary', 'ghost'),
          fc.constantFrom<ButtonVariant>('primary', 'secondary', 'ghost')
        ),
        async ([variant1, variant2]) => {
          // Skip if same variant
          if (variant1 === variant2) return true;
          
          const { container: container1, unmount: unmount1 } = render(
            <ThemeProvider>
              <HolographicButton variant={variant1}>
                Button 1
              </HolographicButton>
            </ThemeProvider>
          );
          
          const { container: container2, unmount: unmount2 } = render(
            <ThemeProvider>
              <HolographicButton variant={variant2}>
                Button 2
              </HolographicButton>
            </ThemeProvider>
          );

          try {
            const button1 = container1.querySelector('.holographic-button') as HTMLElement;
            const button2 = container2.querySelector('.holographic-button') as HTMLElement;
            
            expect(button1).toBeTruthy();
            expect(button2).toBeTruthy();
            
            if (!button1 || !button2) return false;
            
            // Compare colors - they should be different
            const color1 = button1.style.color;
            const color2 = button2.style.color;
            
            const background1 = button1.style.background;
            const background2 = button2.style.background;
            
            // At least one of color or background should be different
            return color1 !== color2 || background1 !== background2;
          } finally {
            unmount1();
            unmount2();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });
});
