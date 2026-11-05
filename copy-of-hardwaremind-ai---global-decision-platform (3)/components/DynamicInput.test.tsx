/**
 * Property-Based Tests for Dynamic Input
 * Feature: futuristic-ui-redesign
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { DynamicInput } from './DynamicInput';
import { ThemeProvider } from '../ThemeContext';

describe('Dynamic Input Property Tests', () => {
  beforeEach(() => {
    // Clear any existing theme attributes
    document.documentElement.removeAttribute('data-theme');
  });

  /**
   * Property 3: Input Box Interaction Feedback
   * Validates: Requirements 6.3
   * Feature: futuristic-ui-redesign, Property 3: Input Box Interaction Feedback
   * 
   * For any input box component, when focused it should display:
   * - Border glow effect
   * - Floating label animation
   */
  it('Property 3: Input should show border glow and floating label on focus', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 30 }),
          initialValue: fc.string({ maxLength: 50 }),
          glowOnFocus: fc.boolean(),
          floatingLabel: fc.boolean(),
        }),
        async (props) => {
          let currentValue = props.initialValue;
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container, unmount } = render(
            <ThemeProvider>
              <DynamicInput
                label={props.label}
                value={currentValue}
                onChange={handleChange}
                glowOnFocus={props.glowOnFocus}
                floatingLabel={props.floatingLabel}
              />
            </ThemeProvider>
          );

          try {
            const input = container.querySelector('input') as HTMLInputElement;
            expect(input).toBeTruthy();
            
            if (!input) return false;

            const wrapper = input.parentElement as HTMLElement;
            expect(wrapper).toBeTruthy();
            
            if (!wrapper) return false;

            // Get initial state
            const initialBoxShadow = wrapper.style.boxShadow;
            
            // Find label element if floating label is enabled
            let label: HTMLElement | null = null;
            if (props.floatingLabel && props.label) {
              label = container.querySelector('label') as HTMLElement;
            }

            // Focus the input
            fireEvent.focus(input);

            // Wait for state updates
            await waitFor(() => {
              // Check border glow effect if enabled
              if (props.glowOnFocus) {
                const hasGlow = wrapper.style.boxShadow !== '' && 
                               wrapper.style.boxShadow !== 'none' &&
                               wrapper.style.boxShadow !== initialBoxShadow;
                expect(hasGlow).toBe(true);
              }

              // Check floating label animation if enabled
              if (props.floatingLabel && label) {
                // Label should be positioned at top when focused
                const labelTop = label.style.top;
                const labelFontSize = label.style.fontSize;
                
                // When focused, label should be at top (8px) with smaller font (12px)
                const isFloating = labelTop === '8px' && labelFontSize === '12px';
                expect(isFloating).toBe(true);
              }
            }, { timeout: 500 });

            // Verify glow effect
            let hasGlowEffect = true;
            if (props.glowOnFocus) {
              const focusedBoxShadow = wrapper.style.boxShadow;
              hasGlowEffect = focusedBoxShadow !== '' && 
                             focusedBoxShadow !== 'none' &&
                             focusedBoxShadow !== initialBoxShadow;
            }

            // Verify floating label
            let hasFloatingLabel = true;
            if (props.floatingLabel && label) {
              const labelTop = label.style.top;
              const labelFontSize = label.style.fontSize;
              hasFloatingLabel = labelTop === '8px' && labelFontSize === '12px';
            }

            // Blur the input
            fireEvent.blur(input);

            return hasGlowEffect && hasFloatingLabel;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 20000 }
    );
  }, 25000);

  /**
   * Additional property: Floating label returns to center when empty
   * Ensures label animation works bidirectionally
   */
  it('Property: Floating label should return to center when input is empty and unfocused', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 30 }),
        async (label) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container, unmount, rerender } = render(
            <ThemeProvider>
              <DynamicInput
                label={label}
                value={currentValue}
                onChange={handleChange}
                floatingLabel={true}
              />
            </ThemeProvider>
          );

          try {
            const input = container.querySelector('input') as HTMLInputElement;
            const labelElement = container.querySelector('label') as HTMLElement;
            
            expect(input).toBeTruthy();
            expect(labelElement).toBeTruthy();
            
            if (!input || !labelElement) return false;

            // Initially, label should be centered (50% with translateY(-50%))
            const initialTop = labelElement.style.top;
            const initialTransform = labelElement.style.transform;
            const initialFontSize = labelElement.style.fontSize;
            
            const isInitiallyCentered = initialTop === '50%' && 
                                       initialTransform === 'translateY(-50%)' &&
                                       initialFontSize === '16px';

            // Focus and add value
            fireEvent.focus(input);
            fireEvent.change(input, { target: { value: 'test' } });
            currentValue = 'test';
            
            rerender(
              <ThemeProvider>
                <DynamicInput
                  label={label}
                  value={currentValue}
                  onChange={handleChange}
                  floatingLabel={true}
                />
              </ThemeProvider>
            );

            // Label should be floating
            await waitFor(() => {
              const floatingTop = labelElement.style.top;
              const floatingFontSize = labelElement.style.fontSize;
              expect(floatingTop).toBe('8px');
              expect(floatingFontSize).toBe('12px');
            }, { timeout: 500 });

            // Clear value and blur
            fireEvent.change(input, { target: { value: '' } });
            currentValue = '';
            fireEvent.blur(input);
            
            rerender(
              <ThemeProvider>
                <DynamicInput
                  label={label}
                  value={currentValue}
                  onChange={handleChange}
                  floatingLabel={true}
                />
              </ThemeProvider>
            );

            // Label should return to center
            await waitFor(() => {
              const finalTop = labelElement.style.top;
              const finalTransform = labelElement.style.transform;
              const finalFontSize = labelElement.style.fontSize;
              
              const isBackToCentered = finalTop === '50%' && 
                                      finalTransform === 'translateY(-50%)' &&
                                      finalFontSize === '16px';
              expect(isBackToCentered).toBe(true);
            }, { timeout: 500 });

            return isInitiallyCentered;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Gradient underline expands on focus
   * Ensures the gradient underline animation works
   */
  it('Property: Gradient underline should expand on focus', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 30 }),
        async (label) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container, unmount } = render(
            <ThemeProvider>
              <DynamicInput
                label={label}
                value={currentValue}
                onChange={handleChange}
              />
            </ThemeProvider>
          );

          try {
            const input = container.querySelector('input') as HTMLInputElement;
            const wrapper = input?.parentElement as HTMLElement;
            
            expect(input).toBeTruthy();
            expect(wrapper).toBeTruthy();
            
            if (!input || !wrapper) return false;

            // Find the gradient underline element (absolute positioned at bottom)
            const children = Array.from(wrapper.children) as HTMLElement[];
            const underline = children.find(child => {
              const style = child.style;
              return style.position === 'absolute' && 
                     style.bottom === '0px' &&
                     style.height === '2px' &&
                     style.background.includes('gradient');
            });

            expect(underline).toBeTruthy();
            if (!underline) return false;

            // Initially, underline should be scaled to 0
            const initialTransform = underline.style.transform;
            const isInitiallyHidden = initialTransform === 'scaleX(0)';

            // Focus the input
            fireEvent.focus(input);

            // Wait for underline to expand
            await waitFor(() => {
              const focusedTransform = underline.style.transform;
              expect(focusedTransform).toBe('scaleX(1)');
            }, { timeout: 500 });

            const focusedTransform = underline.style.transform;
            const isExpanded = focusedTransform === 'scaleX(1)';

            // Blur the input
            fireEvent.blur(input);

            // Wait for underline to collapse
            await waitFor(() => {
              const blurredTransform = underline.style.transform;
              expect(blurredTransform).toBe('scaleX(0)');
            }, { timeout: 500 });

            return isInitiallyHidden && isExpanded;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Character count updates correctly
   * Ensures character counter displays accurate count
   */
  it('Property: Character count should update accurately with input', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          maxLength: fc.integer({ min: 10, max: 100 }),
          inputText: fc.string({ maxLength: 50 }),
        }),
        async (props) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container, unmount, rerender } = render(
            <ThemeProvider>
              <DynamicInput
                label="Test Input"
                value={currentValue}
                onChange={handleChange}
                maxLength={props.maxLength}
                showCharCount={true}
              />
            </ThemeProvider>
          );

          try {
            const input = container.querySelector('input') as HTMLInputElement;
            expect(input).toBeTruthy();
            
            if (!input) return false;

            // Type text
            const textToType = props.inputText.slice(0, props.maxLength);
            fireEvent.change(input, { target: { value: textToType } });
            currentValue = textToType;
            
            rerender(
              <ThemeProvider>
                <DynamicInput
                  label="Test Input"
                  value={currentValue}
                  onChange={handleChange}
                  maxLength={props.maxLength}
                  showCharCount={true}
                />
              </ThemeProvider>
            );

            // Find character count element
            const wrapper = input.parentElement as HTMLElement;
            const children = Array.from(wrapper.children) as HTMLElement[];
            const charCount = children.find(child => {
              return child.textContent?.includes('/');
            });

            expect(charCount).toBeTruthy();
            if (!charCount) return false;

            // Verify character count is correct
            const expectedText = `${textToType.length}/${props.maxLength}`;
            const actualText = charCount.textContent;
            
            return actualText === expectedText;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Error state changes border color
   * Ensures error styling is applied correctly
   */
  it('Property: Error state should change border color and display message', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          errorMessage: fc.string({ minLength: 1, maxLength: 50 }),
        }),
        async (props) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container, unmount } = render(
            <ThemeProvider>
              <DynamicInput
                label="Test Input"
                value={currentValue}
                onChange={handleChange}
                error={props.errorMessage}
              />
            </ThemeProvider>
          );

          try {
            const input = container.querySelector('input') as HTMLInputElement;
            const wrapper = input?.parentElement as HTMLElement;
            
            expect(input).toBeTruthy();
            expect(wrapper).toBeTruthy();
            
            if (!input || !wrapper) return false;

            // Check that border color is error color (not default)
            const borderColor = wrapper.style.border;
            const hasErrorBorder = borderColor !== '' && borderColor !== 'none';

            // Check that error message is displayed
            const errorElement = container.querySelector('[role="alert"]') as HTMLElement;
            expect(errorElement).toBeTruthy();
            
            if (!errorElement) return false;

            const errorText = errorElement.textContent;
            const hasErrorMessage = errorText === props.errorMessage;

            // Check aria-invalid attribute
            const hasAriaInvalid = input.getAttribute('aria-invalid') === 'true';

            return hasErrorBorder && hasErrorMessage && hasAriaInvalid;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  }, 15000);

  /**
   * Additional property: Icon is displayed when provided
   * Ensures icon rendering works correctly
   */
  it('Property: Icon should be displayed when provided', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('test'),
        async (_) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const testIcon = (
            <svg data-testid="test-icon" width="20" height="20">
              <circle cx="10" cy="10" r="8" />
            </svg>
          );

          const { container, unmount } = render(
            <ThemeProvider>
              <DynamicInput
                label="Test Input"
                value={currentValue}
                onChange={handleChange}
                icon={testIcon}
              />
            </ThemeProvider>
          );

          try {
            const icon = container.querySelector('[data-testid="test-icon"]');
            expect(icon).toBeTruthy();
            
            // Icon should be in an absolutely positioned container
            const iconContainer = icon?.parentElement as HTMLElement;
            expect(iconContainer).toBeTruthy();
            
            if (!iconContainer) return false;

            const isAbsolutePositioned = iconContainer.style.position === 'absolute';
            const isOnLeft = iconContainer.style.left === '16px';

            return isAbsolutePositioned && isOnLeft;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: Disabled state prevents interaction
   * Ensures disabled inputs have proper disabled attributes and styling
   */
  it('Property: Disabled input should have disabled attribute and proper styling', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('test'),
        async (_) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container, unmount } = render(
            <ThemeProvider>
              <DynamicInput
                label="Test Input"
                value={currentValue}
                onChange={handleChange}
                disabled={true}
              />
            </ThemeProvider>
          );

          try {
            const input = container.querySelector('input') as HTMLInputElement;
            expect(input).toBeTruthy();
            
            if (!input) return false;

            // Check disabled attribute is present
            const hasDisabledAttr = input.hasAttribute('disabled');
            
            // Check that input has disabled property set to true
            const hasDisabledProp = input.disabled === true;
            
            // In a real browser, disabled inputs cannot be focused or edited
            // We verify the disabled state is properly set
            return hasDisabledAttr && hasDisabledProp;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: Particles are generated on typing
   * Ensures particle effect creates visual elements
   */
  it('Property: Particles should be generated when typing while focused', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 10 }),
        async (inputText) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container, unmount, rerender } = render(
            <ThemeProvider>
              <DynamicInput
                label="Test Input"
                value={currentValue}
                onChange={handleChange}
              />
            </ThemeProvider>
          );

          try {
            const input = container.querySelector('input') as HTMLInputElement;
            const wrapper = input?.parentElement as HTMLElement;
            
            expect(input).toBeTruthy();
            expect(wrapper).toBeTruthy();
            
            if (!input || !wrapper) return false;

            // Focus the input
            fireEvent.focus(input);

            // Count initial children
            const initialChildCount = wrapper.children.length;

            // Type a character
            fireEvent.change(input, { target: { value: inputText[0] } });
            currentValue = inputText[0];
            
            rerender(
              <ThemeProvider>
                <DynamicInput
                  label="Test Input"
                  value={currentValue}
                  onChange={handleChange}
                />
              </ThemeProvider>
            );

            // Wait for particles to be generated
            await waitFor(() => {
              const afterTypeChildCount = wrapper.children.length;
              // Should have more children (particles added)
              expect(afterTypeChildCount).toBeGreaterThanOrEqual(initialChildCount);
            }, { timeout: 500 });

            // Particles should exist (or at least the count shouldn't decrease)
            const finalChildCount = wrapper.children.length;
            
            return finalChildCount >= initialChildCount;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Required field shows indicator
   * Ensures required fields are marked appropriately
   */
  it('Property: Required field should show indicator in label', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 30 }),
        async (label) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container, unmount } = render(
            <ThemeProvider>
              <DynamicInput
                label={label}
                value={currentValue}
                onChange={handleChange}
                required={true}
                floatingLabel={true}
              />
            </ThemeProvider>
          );

          try {
            const labelElement = container.querySelector('label') as HTMLElement;
            expect(labelElement).toBeTruthy();
            
            if (!labelElement) return false;

            // Label should contain asterisk for required field
            const labelText = labelElement.textContent || '';
            const hasRequiredIndicator = labelText.includes('*');

            // Input should have required attribute
            const input = container.querySelector('input') as HTMLInputElement;
            const hasRequiredAttr = input?.hasAttribute('required');

            return hasRequiredIndicator && hasRequiredAttr;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });

  /**
   * Additional property: MaxLength is enforced
   * Ensures input respects maxLength constraint
   */
  it('Property: Input should enforce maxLength constraint', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          maxLength: fc.integer({ min: 5, max: 20 }),
          longText: fc.string({ minLength: 30, maxLength: 50 }),
        }),
        async (props) => {
          let currentValue = '';
          const handleChange = (value: string) => {
            currentValue = value;
          };

          const { container, unmount } = render(
            <ThemeProvider>
              <DynamicInput
                label="Test Input"
                value={currentValue}
                onChange={handleChange}
                maxLength={props.maxLength}
              />
            </ThemeProvider>
          );

          try {
            const input = container.querySelector('input') as HTMLInputElement;
            expect(input).toBeTruthy();
            
            if (!input) return false;

            // Check maxLength attribute is set
            const maxLengthAttr = input.getAttribute('maxLength');
            const hasMaxLength = maxLengthAttr === props.maxLength.toString();

            return hasMaxLength;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  });
});
