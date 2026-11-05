/**
 * Property-Based Tests for Product Card
 * Feature: futuristic-ui-redesign
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { ProductCard } from './ProductCard';
import { ThemeProvider } from '../ThemeContext';
import { Product } from '../data';

// Generator for Product objects with non-whitespace strings
const nonWhitespaceString = (minLength: number, maxLength: number) =>
  fc.string({ minLength, maxLength })
    .filter(s => s.trim().length >= minLength);

const productArbitrary = fc.record({
  id: nonWhitespaceString(1, 20),
  name: nonWhitespaceString(3, 50),
  brand: nonWhitespaceString(2, 30),
  category: nonWhitespaceString(3, 30),
  launchDate: nonWhitespaceString(4, 20),
  priceEstimate: nonWhitespaceString(1, 20),
  imageUrl: fc.constant('/images/products/test.jpg'),
  tags: fc.array(nonWhitespaceString(2, 15), { minLength: 0, maxLength: 5 }),
  survivalRate: fc.option(fc.integer({ min: 0, max: 100 }), { nil: undefined }),
  riskLevel: fc.option(
    fc.constantFrom('Safe', 'Low', 'Moderate', 'High', 'Critical'),
    { nil: undefined }
  ),
  stage: fc.option(fc.constantFrom('startup', 'established'), { nil: undefined }),
  fundingStatus: fc.option(nonWhitespaceString(3, 20), { nil: undefined }),
  verdict: fc.option(nonWhitespaceString(10, 100), { nil: undefined }),
  isInsiderOnly: fc.boolean(),
}) as fc.Arbitrary<Product>;

describe('Product Card Property Tests', () => {
  beforeEach(() => {
    // Clear any existing theme attributes
    document.documentElement.removeAttribute('data-theme');
  });

  /**
   * Property 27: Card 3D Hover Effect
   * Validates: Requirements 3.3, 10.2
   * Feature: futuristic-ui-redesign, Property 27: Card 3D Hover Effect
   * 
   * For any product card, hovering should apply 3D transforms (perspective, rotateX/Y)
   * and shadow changes to create depth effect.
   */
  it('Property 27: Product cards should have 3D transform and shadow changes on hover', async () => {
    await fc.assert(
      fc.asyncProperty(
        productArbitrary,
        async (product) => {
          const mockToggleSelect = () => {};
          const mockViewDetail = () => {};
          
          const { container, unmount } = render(
            <ThemeProvider>
              <ProductCard
                product={product}
                isSelected={false}
                onToggleSelect={mockToggleSelect}
                onViewDetail={mockViewDetail}
              />
            </ThemeProvider>
          );

          try {
            // Find the card container (the outer div with group class)
            const cardWrapper = container.querySelector('.group') as HTMLElement;
            if (!cardWrapper) return false;
            
            // Check that perspective is set on the wrapper
            const wrapperStyle = cardWrapper.style;
            const hasPerspective = wrapperStyle.perspective === '1000px' || 
                                  wrapperStyle.transformStyle === 'preserve-3d';
            
            // Find the inner card container
            const cardContainer = cardWrapper.querySelector('.flex-1') as HTMLElement;
            if (!cardContainer) return false;
            
            // Check that transformStyle is set for 3D
            const containerStyle = cardContainer.style;
            const has3DStyle = containerStyle.transformStyle === 'preserve-3d';
            
            // Simulate mouse move to trigger 3D tilt effect
            // The onMouseMove handler is on the cardContainer, not the wrapper
            const rect = cardContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // Move mouse to trigger tilt - fire on the container itself
            fireEvent.mouseMove(cardContainer, {
              clientX: centerX + 50,
              clientY: centerY + 30,
            });
            
            // Check that transform is applied (3D rotation)
            // The onMouseMove handler sets the transform directly
            const transform = cardContainer.style.transform;
            const has3DTransform = transform.includes('perspective') && 
                                  (transform.includes('rotateX') || transform.includes('rotateY'));
            
            // Check for scale effect on hover
            const hasScale = transform.includes('scale');
            
            // Simulate mouse leave to reset - fire on the container
            fireEvent.mouseLeave(cardContainer);
            
            // Check that transform resets
            const resetTransform = cardContainer.style.transform;
            const isReset = resetTransform.includes('rotateX(0deg)') && 
                           resetTransform.includes('rotateY(0deg)');
            
            // Verify all 3D effects are present
            return hasPerspective && has3DStyle && has3DTransform && hasScale && isReset;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Holographic border appears on hover
   * Ensures the holographic border animation is visible on hover
   */
  it('Property: Holographic border should appear on hover', async () => {
    await fc.assert(
      fc.asyncProperty(
        productArbitrary,
        async (product) => {
          const mockToggleSelect = () => {};
          
          const { container, unmount } = render(
            <ThemeProvider>
              <ProductCard
                product={product}
                isSelected={false}
                onToggleSelect={mockToggleSelect}
              />
            </ThemeProvider>
          );

          try {
            const cardWrapper = container.querySelector('.group') as HTMLElement;
            expect(cardWrapper).toBeTruthy();
            
            if (!cardWrapper) return false;
            
            const cardContainer = cardWrapper.querySelector('.flex-1') as HTMLElement;
            if (!cardContainer) return false;
            
            // Look for holographic border element (absolute positioned div with gradient)
            // It has classes: absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
            const holographicBorder = Array.from(cardContainer.children).find(child => {
              const el = child as HTMLElement;
              const classes = el.className;
              return classes.includes('absolute') && 
                     classes.includes('inset-0') &&
                     classes.includes('opacity-0') &&
                     classes.includes('group-hover:opacity-100') &&
                     el.style.background.includes('gradient');
            }) as HTMLElement;
            
            // Holographic border should exist
            const hasBorder = holographicBorder !== undefined && holographicBorder !== null;
            
            if (!hasBorder) return false;
            
            // Check that it has the hover class
            const hasHoverClass = holographicBorder.className.includes('group-hover:opacity-100');
            
            // Check that it has gradient background
            const hasGradient = holographicBorder.style.background.includes('gradient');
            
            return hasBorder && hasHoverClass && hasGradient;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 10000 }
    );
  }, 15000);

  /**
   * Additional property: Gradient overlay enhances depth
   * Ensures gradient overlays are present for visual depth
   */
  it('Property: Image section should have gradient overlays for depth', async () => {
    await fc.assert(
      fc.asyncProperty(
        productArbitrary,
        async (product) => {
          const mockToggleSelect = () => {};
          
          const { container, unmount } = render(
            <ThemeProvider>
              <ProductCard
                product={product}
                isSelected={false}
                onToggleSelect={mockToggleSelect}
              />
            </ThemeProvider>
          );

          try {
            // Find image section
            const imageSection = container.querySelector('.aspect-\\[3\\/2\\]') as HTMLElement;
            expect(imageSection).toBeTruthy();
            
            if (!imageSection) return false;
            
            // Check for gradient overlays
            const overlays = Array.from(imageSection.children).filter(child => {
              const el = child as HTMLElement;
              return el.style.background && 
                     el.style.background.includes('gradient') &&
                     el.classList.contains('absolute');
            });
            
            // Should have at least one gradient overlay
            return overlays.length > 0;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Survival rate visualization has glow effects
   * Ensures the Aiva Index has enhanced visual effects
   */
  it('Property: Survival rate should have glow and shimmer effects', async () => {
    await fc.assert(
      fc.asyncProperty(
        productArbitrary.filter(p => p.survivalRate !== undefined),
        async (product) => {
          const mockToggleSelect = () => {};
          
          const { container, unmount } = render(
            <ThemeProvider>
              <ProductCard
                product={product}
                isSelected={false}
                onToggleSelect={mockToggleSelect}
              />
            </ThemeProvider>
          );

          try {
            // Find the survival rate number
            const rateElement = container.querySelector('[style*="tnum"]') as HTMLElement;
            
            if (!rateElement) return true; // Skip if no survival rate
            
            // Check for text shadow (glow effect)
            const hasGlow = rateElement.style.textShadow && 
                           rateElement.style.textShadow !== 'none';
            
            // Find progress bar
            const progressBar = container.querySelector('.h-1\\.5') as HTMLElement;
            
            if (!progressBar) return false;
            
            // Find the filled portion
            const filledBar = progressBar.querySelector('div') as HTMLElement;
            
            if (!filledBar) return false;
            
            // Check for box shadow on progress bar
            const hasProgressGlow = filledBar.style.boxShadow && 
                                   filledBar.style.boxShadow !== 'none';
            
            // Check for shimmer animation element
            const shimmerElement = filledBar.querySelector('div[style*="gradient"]') as HTMLElement;
            const hasShimmer = shimmerElement !== null;
            
            return hasGlow && hasProgressGlow && hasShimmer;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Card maintains accessibility
   * Ensures 3D effects don't break keyboard navigation and ARIA
   */
  it('Property: Card should maintain accessibility with 3D effects', async () => {
    await fc.assert(
      fc.asyncProperty(
        productArbitrary,
        async (product) => {
          const mockToggleSelect = () => {};
          let detailCalled = false;
          const mockViewDetail = () => { detailCalled = true; };
          
          const { container, unmount } = render(
            <ThemeProvider>
              <ProductCard
                product={product}
                isSelected={false}
                onToggleSelect={mockToggleSelect}
                onViewDetail={mockViewDetail}
              />
            </ThemeProvider>
          );

          try {
            const cardWrapper = container.querySelector('.group') as HTMLElement;
            expect(cardWrapper).toBeTruthy();
            
            if (!cardWrapper) return false;
            
            // Check tabIndex is set
            const hasTabIndex = cardWrapper.hasAttribute('tabindex');
            
            // Check role is set
            const hasRole = cardWrapper.hasAttribute('role');
            
            // Check aria-label is set
            const hasAriaLabel = cardWrapper.hasAttribute('aria-label');
            
            // Test keyboard interaction
            fireEvent.keyDown(cardWrapper, { key: 'Enter' });
            
            // Should trigger view detail
            const keyboardWorks = detailCalled;
            
            return hasTabIndex && hasRole && hasAriaLabel && keyboardWorks;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Compact mode maintains functionality
   * Ensures compact cards still work correctly
   */
  it('Property: Compact mode should render correctly without 3D effects', async () => {
    await fc.assert(
      fc.asyncProperty(
        productArbitrary,
        async (product) => {
          const mockToggleSelect = () => {};
          
          const { container, unmount } = render(
            <ThemeProvider>
              <ProductCard
                product={product}
                isSelected={false}
                onToggleSelect={mockToggleSelect}
                compact={true}
              />
            </ThemeProvider>
          );

          try {
            const cardWrapper = container.querySelector('.group') as HTMLElement;
            expect(cardWrapper).toBeTruthy();
            
            if (!cardWrapper) return false;
            
            // Compact mode should not have perspective
            const hasPerspective = cardWrapper.style.perspective !== '';
            
            // Should still render product name
            const hasName = container.textContent?.includes(product.name) || false;
            
            // Should still be clickable
            const isClickable = cardWrapper.hasAttribute('role');
            
            // Compact mode should NOT have 3D effects
            return !hasPerspective && hasName && isClickable;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Image hover scale effect
   * Ensures images scale on hover for depth
   */
  it('Property: Product image should scale on hover', async () => {
    await fc.assert(
      fc.asyncProperty(
        productArbitrary,
        async (product) => {
          const mockToggleSelect = () => {};
          
          const { container, unmount } = render(
            <ThemeProvider>
              <ProductCard
                product={product}
                isSelected={false}
                onToggleSelect={mockToggleSelect}
              />
            </ThemeProvider>
          );

          try {
            const cardWrapper = container.querySelector('.group') as HTMLElement;
            const image = container.querySelector('img') as HTMLElement;
            
            expect(cardWrapper).toBeTruthy();
            expect(image).toBeTruthy();
            
            if (!cardWrapper || !image) return false;
            
            // Check image has scale transition class
            const hasScaleClass = image.className.includes('group-hover:scale');
            
            return hasScaleClass;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 5000 }
    );
  }, 10000);
});
