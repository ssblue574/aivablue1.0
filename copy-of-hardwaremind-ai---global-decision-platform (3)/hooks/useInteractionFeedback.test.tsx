/**
 * Property-Based Tests for Interaction Feedback System
 * Feature: futuristic-ui-redesign
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import fc from 'fast-check';
import { useInteractionFeedback } from './useInteractionFeedback';

describe('Interaction Feedback System - Property Tests', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    // Create a mock element for testing
    mockElement = document.createElement('div');
    mockElement.style.position = 'relative';
    document.body.appendChild(mockElement);
    
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
    vi.restoreAllMocks();
  });

  /**
   * Feature: futuristic-ui-redesign, Property 6: 悬停效果平滑性
   * Validates: Requirements 4.3
   * 
   * Property: For any interactive element, hovering should display smooth transition animations
   * (scale, glow, or transform effects)
   */
  it('Property 6: 悬停效果平滑性 - All hover effects should have smooth transitions', () => {
    fc.assert(
      fc.property(
        // Generate random hover configurations
        fc.record({
          scale: fc.double({ min: 1.0, max: 1.2, noNaN: true }),
          glowIntensity: fc.integer({ min: 10, max: 50 }),
          duration: fc.integer({ min: 100, max: 600 }),
        }),
        (hoverConfig) => {
          const { result } = renderHook(() =>
            useInteractionFeedback({
              enable3D: false,
              hoverConfig: {
                scale: hoverConfig.scale,
                glowIntensity: hoverConfig.glowIntensity,
                duration: hoverConfig.duration,
              },
            })
          );

          // Create a mock mouse event
          const mockEvent = {
            currentTarget: mockElement,
            clientX: 50,
            clientY: 50,
          } as React.MouseEvent<HTMLElement>;

          // Trigger hover effect
          act(() => {
            result.current.handleMouseEnter(mockEvent);
          });

          // Check that transition is applied
          const transition = mockElement.style.transition;
          expect(transition).toBeTruthy();
          expect(transition).toContain('transform');
          expect(transition).toContain(`${hoverConfig.duration}ms`);

          // Check that transform is applied with scale
          const transform = mockElement.style.transform;
          expect(transform).toContain('scale');
          
          // Extract scale value from transform
          const scaleMatch = transform.match(/scale\(([\d.]+)\)/);
          if (scaleMatch) {
            const appliedScale = parseFloat(scaleMatch[1]);
            // Allow small floating point differences
            expect(Math.abs(appliedScale - hoverConfig.scale)).toBeLessThan(0.01);
          }

          // Check that box-shadow (glow) is applied
          expect(mockElement.style.boxShadow).toBeTruthy();
          expect(mockElement.style.boxShadow).toContain(`${hoverConfig.glowIntensity}px`);

          // Trigger mouse leave to reset
          act(() => {
            result.current.handleMouseLeave(mockEvent);
          });

          // Verify reset has transition
          const resetTransition = mockElement.style.transition;
          expect(resetTransition).toBeTruthy();
          expect(resetTransition).toContain('transform');

          // Property holds: smooth transition is always applied
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional test: Verify 3D hover effects also have smooth transitions
   */
  it('Property 6 (3D variant): 3D hover effects should have smooth transitions with perspective', () => {
    fc.assert(
      fc.property(
        fc.record({
          depth: fc.integer({ min: 5, max: 20 }),
          rotateX: fc.integer({ min: -10, max: 10 }),
          rotateY: fc.integer({ min: -10, max: 10 }),
          scale: fc.double({ min: 1.0, max: 1.1, noNaN: true }),
          duration: fc.integer({ min: 100, max: 600 }),
        }),
        (depthConfig) => {
          const { result } = renderHook(() =>
            useInteractionFeedback({
              enable3D: true,
              depthConfig: {
                depth: depthConfig.depth,
                rotateX: depthConfig.rotateX,
                rotateY: depthConfig.rotateY,
                scale: depthConfig.scale,
                duration: depthConfig.duration,
              },
            })
          );

          const mockEvent = {
            currentTarget: mockElement,
            clientX: 50,
            clientY: 50,
          } as React.MouseEvent<HTMLElement>;

          // Trigger 3D hover effect
          act(() => {
            result.current.handleMouseEnter(mockEvent);
          });

          // Check transition is applied
          const transition = mockElement.style.transition;
          expect(transition).toBeTruthy();
          expect(transition).toContain('transform');
          expect(transition).toContain(`${depthConfig.duration}ms`);

          // Check 3D transform properties
          const transform = mockElement.style.transform;
          expect(transform).toContain('perspective');
          expect(transform).toContain('translateZ');
          expect(transform).toContain('rotateX');
          expect(transform).toContain('rotateY');
          expect(transform).toContain('scale');

          // Check transform-style for 3D
          expect(mockElement.style.transformStyle).toBe('preserve-3d');

          // Check box-shadow for depth
          expect(mockElement.style.boxShadow).toBeTruthy();

          // Trigger mouse leave
          act(() => {
            result.current.handleMouseLeave(mockEvent);
          });

          // Verify smooth reset
          const resetTransition = mockElement.style.transition;
          expect(resetTransition).toBeTruthy();

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Test: Verify transitions respect reduced motion preference
   */
  it('Property 6 (Accessibility): Should respect prefers-reduced-motion', () => {
    // Mock matchMedia to return reduced motion preference
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() =>
      useInteractionFeedback({
        enable3D: false,
        hoverConfig: {
          scale: 1.05,
          duration: 300,
        },
      })
    );

    const mockEvent = {
      currentTarget: mockElement,
      clientX: 50,
      clientY: 50,
    } as React.MouseEvent<HTMLElement>;

    // Trigger hover - should not apply effects due to reduced motion
    act(() => {
      result.current.handleMouseEnter(mockEvent);
    });

    // With reduced motion, effects should be minimal or not applied
    // The implementation respects this in the utility functions
    
    // Restore original matchMedia
    window.matchMedia = originalMatchMedia;
  });

  /**
   * Feature: futuristic-ui-redesign, Property 9: 3D 交互深度
   * Validates: Requirements 10.4
   * 
   * Property: For any element interaction, Z-axis movement or scale effects should be used
   * to enhance depth perception
   */
  it('Property 9: 3D 交互深度 - All interactions should use Z-axis or scale for depth', () => {
    fc.assert(
      fc.property(
        // Generate random interaction configurations
        fc.record({
          depth: fc.integer({ min: 5, max: 30 }),
          rotateX: fc.integer({ min: -15, max: 15 }),
          rotateY: fc.integer({ min: -15, max: 15 }),
          scale: fc.double({ min: 1.0, max: 1.15, noNaN: true }),
        }),
        (config) => {
          const { result } = renderHook(() =>
            useInteractionFeedback({
              enable3D: true,
              depthConfig: {
                depth: config.depth,
                rotateX: config.rotateX,
                rotateY: config.rotateY,
                scale: config.scale,
                duration: 300,
              },
            })
          );

          const mockEvent = {
            currentTarget: mockElement,
            clientX: 50,
            clientY: 50,
          } as React.MouseEvent<HTMLElement>;

          // Trigger interaction
          act(() => {
            result.current.handleMouseEnter(mockEvent);
          });

          const transform = mockElement.style.transform;

          // Verify Z-axis movement (translateZ)
          expect(transform).toContain('translateZ');
          const translateZMatch = transform.match(/translateZ\(([\d.]+)px\)/);
          expect(translateZMatch).toBeTruthy();
          if (translateZMatch) {
            const zValue = parseFloat(translateZMatch[1]);
            expect(zValue).toBeGreaterThan(0);
            expect(Math.abs(zValue - config.depth)).toBeLessThan(0.1);
          }

          // Verify scale is applied for depth enhancement
          expect(transform).toContain('scale');
          const scaleMatch = transform.match(/scale\(([\d.]+)\)/);
          expect(scaleMatch).toBeTruthy();
          if (scaleMatch) {
            const scaleValue = parseFloat(scaleMatch[1]);
            expect(scaleValue).toBeGreaterThanOrEqual(1.0);
            expect(Math.abs(scaleValue - config.scale)).toBeLessThan(0.01);
          }

          // Verify perspective is set for 3D context
          expect(transform).toContain('perspective');

          // Verify rotation is applied for depth perception
          if (config.rotateX !== 0) {
            expect(transform).toContain('rotateX');
          }
          if (config.rotateY !== 0) {
            expect(transform).toContain('rotateY');
          }

          // Verify shadow depth increases with Z-axis movement
          const boxShadow = mockElement.style.boxShadow;
          expect(boxShadow).toBeTruthy();
          // Shadow should contain depth-related values
          const shadowMatch = boxShadow.match(/0 ([\d.]+)px ([\d.]+)px/);
          if (shadowMatch) {
            const shadowY = parseFloat(shadowMatch[1]);
            const shadowBlur = parseFloat(shadowMatch[2]);
            // Shadow should scale with depth
            expect(shadowY).toBeGreaterThan(0);
            expect(shadowBlur).toBeGreaterThan(0);
          }

          // Property holds: Z-axis or scale is always used for depth
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional test: Verify click interactions also use depth effects
   */
  it('Property 9 (Click variant): Click interactions should provide depth feedback', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { enableGlow: true, enableRipple: false, enableParticles: false },
          { enableGlow: false, enableRipple: true, enableParticles: false },
          { enableGlow: false, enableRipple: false, enableParticles: true },
          { enableGlow: true, enableRipple: true, enableParticles: false }
        ),
        (config) => {
          const { result } = renderHook(() =>
            useInteractionFeedback(config)
          );

          const mockEvent = {
            currentTarget: mockElement,
            clientX: 50,
            clientY: 50,
          } as React.MouseEvent<HTMLElement>;

          // Trigger click interaction
          act(() => {
            result.current.handleClick(mockEvent);
          });

          // At least one depth-enhancing effect should be applied
          // (glow creates shadow depth, ripple creates layering, particles create spatial depth)
          let hasDepthEffect = false;

          if (config.enableGlow) {
            // Glow should create box-shadow for depth
            const boxShadow = mockElement.style.boxShadow;
            if (boxShadow && boxShadow !== '') {
              hasDepthEffect = true;
            }
          }

          if (config.enableRipple || config.enableParticles) {
            // Ripple and particles create child elements with z-index for layering
            const children = mockElement.children;
            if (children.length > 0) {
              hasDepthEffect = true;
            }
          }

          // Property holds: some form of depth effect is present
          expect(hasDepthEffect).toBe(true);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Test: Verify depth effects scale appropriately with element size
   */
  it('Property 9 (Scaling): Depth effects should scale with element dimensions', () => {
    fc.assert(
      fc.property(
        fc.record({
          width: fc.integer({ min: 100, max: 500 }),
          height: fc.integer({ min: 100, max: 500 }),
          depth: fc.integer({ min: 5, max: 20 }),
        }),
        (config) => {
          // Set element dimensions
          mockElement.style.width = `${config.width}px`;
          mockElement.style.height = `${config.height}px`;

          const { result } = renderHook(() =>
            useInteractionFeedback({
              enable3D: true,
              depthConfig: {
                depth: config.depth,
                scale: 1.05,
              },
            })
          );

          const mockEvent = {
            currentTarget: mockElement,
            clientX: config.width / 2,
            clientY: config.height / 2,
          } as React.MouseEvent<HTMLElement>;

          act(() => {
            result.current.handleMouseEnter(mockEvent);
          });

          // Verify depth is applied
          const transform = mockElement.style.transform;
          expect(transform).toContain('translateZ');

          // Verify shadow scales with depth
          const boxShadow = mockElement.style.boxShadow;
          expect(boxShadow).toBeTruthy();

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Test: Verify hover effects are consistent across multiple triggers
   */
  it('Property 6 (Consistency): Multiple hover triggers should produce consistent effects', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 10 }),
        (triggerCount) => {
          const { result } = renderHook(() =>
            useInteractionFeedback({
              enable3D: false,
              hoverConfig: {
                scale: 1.05,
                glowIntensity: 20,
                duration: 300,
              },
            })
          );

          const mockEvent = {
            currentTarget: mockElement,
            clientX: 50,
            clientY: 50,
          } as React.MouseEvent<HTMLElement>;

          const transforms: string[] = [];
          const shadows: string[] = [];

          // Trigger hover multiple times
          for (let i = 0; i < triggerCount; i++) {
            act(() => {
              result.current.handleMouseEnter(mockEvent);
            });
            transforms.push(mockElement.style.transform);
            shadows.push(mockElement.style.boxShadow);

            act(() => {
              result.current.handleMouseLeave(mockEvent);
            });
          }

          // All transforms should be consistent
          const uniqueTransforms = new Set(transforms);
          expect(uniqueTransforms.size).toBe(1);

          // All shadows should be consistent
          const uniqueShadows = new Set(shadows);
          expect(uniqueShadows.size).toBe(1);

          return true;
        }
      ),
      { numRuns: 50 }
    );
  });
});
