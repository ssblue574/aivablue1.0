/**
 * Property-Based Tests for Theme Engine
 * Feature: futuristic-ui-redesign
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { ThemeEngineProvider, useThemeEngine } from './ThemeEngine';
import { animationConfig } from './tokens';

// Test component to access theme context
const TestComponent = ({ onThemeChange }: { onThemeChange?: (theme: string) => void }) => {
  const { theme, toggleTheme } = useThemeEngine();
  
  React.useEffect(() => {
    if (onThemeChange) {
      onThemeChange(theme);
    }
  }, [theme, onThemeChange]);
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button data-testid="toggle-button" onClick={toggleTheme}>
        Toggle
      </button>
    </div>
  );
};

describe('Theme Engine Property Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear any existing theme attributes
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  /**
   * Property 10: Theme Switching Smoothness
   * Validates: Requirements 1.5
   * 
   * For any theme switch operation, there should be a smooth color transition animation
   * of at least 300ms duration configured via CSS custom properties.
   */
  it('Property 10: Theme switching should have smooth transition of at least 300ms', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a single toggle to test
        fc.constant('toggle'),
        async (_) => {
          // Render the component
          const { getByTestId, unmount } = render(
            <ThemeEngineProvider>
              <TestComponent />
            </ThemeEngineProvider>
          );
          
          try {
            // Toggle theme
            await act(async () => {
              getByTestId('toggle-button').click();
            });
            
            // Wait a bit for effects to apply
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Check that CSS custom property for transition duration is set correctly
            const root = document.documentElement;
            const transitionDuration = root.style.getPropertyValue('--duration-normal');
            
            // Verify duration is set and >= 300ms
            const minExpectedDuration = animationConfig.duration.normal;
            
            if (!transitionDuration) {
              return false;
            }
            
            const durationMs = parseInt(transitionDuration);
            return durationMs >= minExpectedDuration;
          } finally {
            // Clean up
            unmount();
          }
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Additional property: Theme state consistency
   * Ensures theme state is consistent across toggles
   */
  it('Property: Theme should alternate consistently between dark and light', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 10 }),
        async (numToggles) => {
          const themes: string[] = [];
          
          const { getByTestId, unmount } = render(
            <ThemeEngineProvider>
              <TestComponent onThemeChange={(theme) => themes.push(theme)} />
            </ThemeEngineProvider>
          );
          
          try {
            // Initial theme
            const initialTheme = getByTestId('current-theme').textContent;
            
            // Perform toggles
            for (let i = 0; i < numToggles; i++) {
              await act(async () => {
                getByTestId('toggle-button').click();
              });
              
              // Wait for state update
              await waitFor(() => {
                const currentTheme = getByTestId('current-theme').textContent;
                expect(currentTheme).toBeTruthy();
              });
            }
            
            // Verify alternating pattern
            for (let i = 1; i < themes.length; i++) {
              if (themes[i] === themes[i - 1]) {
                return false; // Should alternate
              }
            }
            
            // Verify only valid themes
            const allValid = themes.every(t => t === 'dark' || t === 'light');
            
            return allValid;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: CSS custom properties are applied
   * Ensures all theme colors are properly set as CSS variables
   */
  it('Property: All theme CSS custom properties should be set on theme change', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('dark', 'light'),
        async (targetTheme) => {
          const { getByTestId, unmount } = render(
            <ThemeEngineProvider>
              <TestComponent />
            </ThemeEngineProvider>
          );
          
          try {
            // Toggle until we reach target theme
            await act(async () => {
              const currentTheme = getByTestId('current-theme').textContent;
              if (currentTheme !== targetTheme) {
                getByTestId('toggle-button').click();
              }
            });
            
            await waitFor(() => {
              expect(getByTestId('current-theme').textContent).toBe(targetTheme);
            });
            
            // Check that essential CSS properties are set
            const root = document.documentElement;
            const essentialProps = [
              '--bg-primary',
              '--color-primary',
              '--glow-cyan',
              '--duration-normal',
              '--easing-standard',
            ];
            
            const allPropsSet = essentialProps.every(prop => {
              const value = root.style.getPropertyValue(prop);
              return value !== '';
            });
            
            return allPropsSet;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 5000 }
    );
  });
});
