/**
 * Property-Based Tests for Glassmorphic Card
 * Feature: futuristic-ui-redesign
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { GlassmorphicCard, HoverEffect } from './GlassmorphicCard';
import { ThemeProvider } from '../ThemeContext';

describe('Glassmorphic Card Property Tests', () => {
  beforeEach(() => {
    // Clear any existing theme attributes
    document.documentElement.removeAttribute('data-theme');
  });

  /**
   * Property 1: Glassmorphic Effect Consistency
   * Validates: Requirements 6.1
   * 
   * For any card component, it should apply backdrop-filter blur effect,
   * semi-transparent background, and subtle border gradient.
   */
  it('Property 1: All cards should have consistent glassmorphic effects', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          blur: fc.integer({ min: 10, max: 40 }),
          opacity: fc.double({ min: 0.05, max: 0.2, noNaN: true }),
          borderGlow: fc.boolean(),
          hoverEffect: fc.constantFrom<HoverEffect>('lift', 'glow', 'scale'),
        }),
        async (props) => {
          // Skip if opacity is invalid
          if (isNaN(props.opacity)) return true;
          
          const { container, unmount } = render(
            <ThemeProvider>
              <GlassmorphicCard {...props}>
                <div>Test Content</div>
              </GlassmorphicCard>
            </ThemeProvider>
          );

          try {
            const card = container.querySelector('.glassmorphic-card');
            expect(card).toBeTruthy();
            
            if (!card) return false;
            
            const style = (card as HTMLElement).style;
            
            // Check backdrop-filter is applied
            const hasBackdropFilter = 
              style.backdropFilter.includes('blur') || 
              style.WebkitBackdropFilter.includes('blur');
            
            // Check background has transparency (rgba)
            const hasTransparentBg = style.background.includes('rgba');
            
            // Check border is set
            const hasBorder = style.border !== '';
            
            // Check border radius is applied
            const hasBorderRadius = style.borderRadius !== '';
            
            // All glassmorphic properties should be present
            return hasBackdropFilter && hasTransparentBg && hasBorder && hasBorderRadius;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 20000 }
    );
  }, 25000);

  /**
   * Property 21: Design Consistency
   * Validates: Requirements 2.3
   * 
   * For any card component, it should use unified border radius (12-24px range)
   * and spacing system (4px multiples).
   */
  it('Property 21: All cards should use consistent border radius', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          blur: fc.integer({ min: 10, max: 40 }),
          opacity: fc.double({ min: 0.05, max: 0.2, noNaN: true }),
        }),
        async (props) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <GlassmorphicCard {...props}>
                <div>Test Content</div>
              </GlassmorphicCard>
            </ThemeProvider>
          );

          try {
            const card = container.querySelector('.glassmorphic-card');
            expect(card).toBeTruthy();
            
            if (!card) return false;
            
            const style = (card as HTMLElement).style;
            const borderRadius = style.borderRadius;
            
            // Extract numeric value from border radius (e.g., "18px" -> 18)
            const radiusValue = parseInt(borderRadius);
            
            // Verify border radius is in the expected range (12-24px)
            const isInRange = radiusValue >= 12 && radiusValue <= 24;
            
            // Verify it's a valid number
            const isValid = !isNaN(radiusValue);
            
            return isValid && isInRange;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 20000 }
    );
  }, 25000);

  /**
   * Additional property: Hover effects are smooth and consistent
   * Ensures all hover effects apply proper transitions
   */
  it('Property: Hover effects should apply smooth transitions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom<HoverEffect>('lift', 'glow', 'scale'),
        async (hoverEffect) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <GlassmorphicCard hoverEffect={hoverEffect}>
                <div>Test Content</div>
              </GlassmorphicCard>
            </ThemeProvider>
          );

          try {
            const card = container.querySelector('.glassmorphic-card') as HTMLElement;
            expect(card).toBeTruthy();
            
            if (!card) return false;
            
            // Check transition is set
            const hasTransition = card.style.transition.includes('all');
            
            // Simulate hover
            fireEvent.mouseEnter(card);
            
            // Wait for state update (reduced from 50ms to 10ms)
            await new Promise(resolve => setTimeout(resolve, 10));
            
            // Check that style changes on hover
            const styleAfterHover = card.style;
            
            // Different hover effects should apply different transforms/shadows
            const hasTransform = styleAfterHover.transform !== '';
            const hasBoxShadow = styleAfterHover.boxShadow !== '';
            
            // At least one of these should be applied on hover
            const hasHoverEffect = hasTransform || hasBoxShadow;
            
            return hasTransition && hasHoverEffect;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Border glow appears on hover when enabled
   * Ensures border glow effect is properly implemented
   */
  it('Property: Border glow should appear on hover when enabled', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('test'),
        async (_) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <GlassmorphicCard borderGlow={true}>
                <div>Test Content</div>
              </GlassmorphicCard>
            </ThemeProvider>
          );

          try {
            const card = container.querySelector('.glassmorphic-card') as HTMLElement;
            expect(card).toBeTruthy();
            
            if (!card) return false;
            
            // Check for border glow element (child div with gradient)
            const children = card.children;
            let hasBorderGlowElement = false;
            
            for (let i = 0; i < children.length; i++) {
              const child = children[i] as HTMLElement;
              const style = child.style;
              
              // Border glow element has gradient background and absolute positioning
              if (style.position === 'absolute' && style.background.includes('gradient')) {
                hasBorderGlowElement = true;
                break;
              }
            }
            
            return hasBorderGlowElement;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 5000 }
    );
  });

  /**
   * Additional property: Blur amount is correctly applied
   * Ensures the blur parameter controls backdrop-filter correctly
   */
  it('Property: Blur amount should be correctly applied to backdrop-filter', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 10, max: 40 }),
        async (blurAmount) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <GlassmorphicCard blur={blurAmount}>
                <div>Test Content</div>
              </GlassmorphicCard>
            </ThemeProvider>
          );

          try {
            const card = container.querySelector('.glassmorphic-card') as HTMLElement;
            expect(card).toBeTruthy();
            
            if (!card) return false;
            
            const style = card.style;
            
            // Check backdrop-filter contains the blur value
            const backdropFilter = style.backdropFilter || style.WebkitBackdropFilter;
            
            // Extract blur value from backdrop-filter (e.g., "blur(20px)" -> 20)
            const blurMatch = backdropFilter.match(/blur\((\d+)px\)/);
            
            if (!blurMatch) return false;
            
            const appliedBlur = parseInt(blurMatch[1]);
            
            // Verify the applied blur matches the requested blur
            return appliedBlur === blurAmount;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50, timeout: 10000 }
    );
  });

  /**
   * Additional property: Opacity is correctly applied to background
   * Ensures the opacity parameter controls background transparency
   */
  it('Property: Opacity should be correctly applied to background', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.double({ min: 0.05, max: 0.2, noNaN: true }),
        async (opacityValue) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <GlassmorphicCard opacity={opacityValue}>
                <div>Test Content</div>
              </GlassmorphicCard>
            </ThemeProvider>
          );

          try {
            const card = container.querySelector('.glassmorphic-card') as HTMLElement;
            expect(card).toBeTruthy();
            
            if (!card) return false;
            
            const style = card.style;
            const background = style.background;
            
            // Extract opacity from rgba (e.g., "rgba(255, 255, 255, 0.1)" -> 0.1)
            const opacityMatch = background.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/);
            
            if (!opacityMatch) return false;
            
            const appliedOpacity = parseFloat(opacityMatch[1]);
            
            // Verify the applied opacity is close to requested (allow small floating point error)
            // Note: In light mode, we add 0.05 to opacity, so we need to account for that
            const tolerance = 0.06; // Allow for the +0.05 adjustment in light mode
            return Math.abs(appliedOpacity - opacityValue) <= tolerance;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Component renders children correctly
   * Ensures content is properly rendered inside the card
   */
  it('Property: Card should render children content correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (content) => {
          const { container, unmount } = render(
            <ThemeProvider>
              <GlassmorphicCard>
                <div data-testid="content">{content}</div>
              </GlassmorphicCard>
            </ThemeProvider>
          );

          try {
            const contentElement = container.querySelector('[data-testid="content"]');
            expect(contentElement).toBeTruthy();
            
            if (!contentElement) return false;
            
            // Verify content is rendered
            return contentElement.textContent === content;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);
});
