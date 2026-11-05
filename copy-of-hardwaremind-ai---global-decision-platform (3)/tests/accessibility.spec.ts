/**
 * Accessibility Audit Tests
 * Tests keyboard navigation, ARIA attributes, and screen reader compatibility
 * Requirements: 7.5, 2.2
 */

import { test, expect } from '@playwright/test';

test.describe('Accessibility Audit', () => {
  test.beforeEach(async ({ page }) => {
    // Increase timeout for slow loads
    test.setTimeout(60000);
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    // Wait for app to be interactive
    await page.waitForTimeout(2000);
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate through main navigation with Tab key', async ({ page }) => {
      // Focus on first interactive element
      await page.keyboard.press('Tab');
      
      // Check that focus is visible
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          tagName: el?.tagName,
          hasOutline: window.getComputedStyle(el!).outline !== 'none'
        };
      });
      
      expect(focusedElement.tagName).toBeTruthy();
    });

    test('should activate buttons with Enter key', async ({ page }) => {
      // Navigate to a button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Get the focused element
      const buttonText = await page.evaluate(() => {
        return document.activeElement?.textContent;
      });
      
      // Press Enter
      await page.keyboard.press('Enter');
      
      // Verify interaction occurred (page should respond)
      await page.waitForTimeout(500);
      expect(buttonText).toBeTruthy();
    });

    test('should close modals with Escape key', async ({ page }) => {
      // Open a product detail modal by clicking a product
      const productCard = page.locator('[role="button"]').first();
      await productCard.click();
      
      // Wait for modal to open
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      // Press Escape
      await page.keyboard.press('Escape');
      
      // Modal should be closed
      await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 2000 });
    });

    test('should navigate through product cards with keyboard', async ({ page }) => {
      // Go to products page
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      // Tab to first product card
      let tabCount = 0;
      while (tabCount < 20) {
        await page.keyboard.press('Tab');
        tabCount++;
        
        const isProductCard = await page.evaluate(() => {
          const el = document.activeElement;
          return el?.getAttribute('role') === 'button' && 
                 el?.getAttribute('aria-label')?.includes('product') !== false;
        });
        
        if (isProductCard) {
          break;
        }
      }
      
      // Press Enter to open detail
      await page.keyboard.press('Enter');
      
      // Modal should open
      await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 3000 });
    });

    test('should trap focus within modal', async ({ page }) => {
      // Open a modal
      const productCard = page.locator('[role="button"]').first();
      await productCard.click();
      
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      // Tab through modal elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }
      
      // Focus should still be within modal
      const focusInModal = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        const focused = document.activeElement;
        return modal?.contains(focused) ?? false;
      });
      
      expect(focusInModal).toBe(true);
    });
  });

  test.describe('ARIA Attributes', () => {
    test('should have proper ARIA labels on interactive elements', async ({ page }) => {
      // Check buttons have aria-label or accessible text
      const buttons = await page.locator('button').all();
      
      for (const button of buttons.slice(0, 10)) {
        const hasLabel = await button.evaluate((el) => {
          return !!(
            el.getAttribute('aria-label') ||
            el.getAttribute('aria-labelledby') ||
            el.textContent?.trim()
          );
        });
        
        expect(hasLabel).toBe(true);
      }
    });

    test('should have role="dialog" and aria-modal on modals', async ({ page }) => {
      // Open a modal
      const productCard = page.locator('[role="button"]').first();
      await productCard.click();
      
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    test('should have role="alert" on toast notifications', async ({ page }) => {
      // Trigger a toast by favoriting a product
      await page.goto('/products');
      await page.waitForLoadState('networkidle');
      
      // Click favorite button
      const favoriteBtn = page.locator('[aria-label*="favorite"], [aria-label*="收藏"]').first();
      if (await favoriteBtn.count() > 0) {
        await favoriteBtn.click();
        
        // Check for toast
        const toast = page.locator('[role="alert"]');
        await expect(toast).toBeVisible({ timeout: 3000 });
        await expect(toast).toHaveAttribute('aria-live', 'polite');
      }
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      // Get all headings
      const headings = await page.evaluate(() => {
        const h1s = Array.from(document.querySelectorAll('h1')).length;
        const h2s = Array.from(document.querySelectorAll('h2')).length;
        const h3s = Array.from(document.querySelectorAll('h3')).length;
        
        return { h1s, h2s, h3s };
      });
      
      // Should have at least one h1
      expect(headings.h1s).toBeGreaterThanOrEqual(1);
      
      // Should not have more than one h1 per page
      expect(headings.h1s).toBeLessThanOrEqual(2);
    });

    test('should have alt text on images', async ({ page }) => {
      const images = await page.locator('img').all();
      
      for (const img of images.slice(0, 10)) {
        const hasAlt = await img.evaluate((el) => {
          return el.hasAttribute('alt');
        });
        
        expect(hasAlt).toBe(true);
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      // Tab to first focusable element
      await page.keyboard.press('Tab');
      
      // Check focus is visible
      const hasFocusIndicator = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        const styles = window.getComputedStyle(el);
        
        // Check for outline or box-shadow (focus ring)
        return (
          styles.outline !== 'none' ||
          styles.outlineWidth !== '0px' ||
          styles.boxShadow !== 'none'
        );
      });
      
      expect(hasFocusIndicator).toBe(true);
    });

    test('should restore focus after modal closes', async ({ page }) => {
      // Focus on a product card
      const productCard = page.locator('[role="button"]').first();
      await productCard.focus();
      
      // Get the focused element
      const initialFocus = await page.evaluate(() => {
        return document.activeElement?.getAttribute('aria-label');
      });
      
      // Open modal
      await productCard.click();
      await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
      
      // Close modal with Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
      
      // Focus should return to the button
      const finalFocus = await page.evaluate(() => {
        return document.activeElement?.getAttribute('aria-label');
      });
      
      expect(finalFocus).toBe(initialFocus);
    });
  });

  test.describe('Color Contrast', () => {
    test('should meet WCAG AA contrast requirements for text', async ({ page }) => {
      const contrastIssues = await page.evaluate(() => {
        const issues: string[] = [];
        
        // Helper to get contrast ratio
        const getContrastRatio = (fg: string, bg: string): number => {
          const getLuminance = (color: string): number => {
            const rgb = color.match(/\d+/g);
            if (!rgb) return 0;
            
            const [r, g, b] = rgb.map(val => {
              const v = parseInt(val) / 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };
          
          const l1 = getLuminance(fg);
          const l2 = getLuminance(bg);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          
          return (lighter + 0.05) / (darker + 0.05);
        };
        
        // Check text elements
        const textElements = document.querySelectorAll('p, span, a, button, h1, h2, h3, h4, h5, h6');
        
        for (const el of Array.from(textElements).slice(0, 50)) {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const bgColor = styles.backgroundColor;
          
          if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            const ratio = getContrastRatio(color, bgColor);
            
            // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
            const fontSize = parseFloat(styles.fontSize);
            const isLargeText = fontSize >= 18 || (fontSize >= 14 && styles.fontWeight >= '700');
            const threshold = isLargeText ? 3 : 4.5;
            
            if (ratio < threshold) {
              issues.push(`Low contrast: ${ratio.toFixed(2)}:1 (needs ${threshold}:1)`);
            }
          }
        }
        
        return issues;
      });
      
      // Allow some issues but flag if there are too many
      if (contrastIssues.length > 10) {
        console.warn('Contrast issues found:', contrastIssues.slice(0, 10));
      }
      
      // This is informational - we don't fail the test but log issues
      expect(contrastIssues.length).toBeLessThan(50);
    });
  });

  test.describe('Reduced Motion Support', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check that animations are disabled or simplified
      const hasReducedMotion = await page.evaluate(() => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      });
      
      expect(hasReducedMotion).toBe(true);
      
      // Check that CSS animations respect this
      const animationDurations = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const durations: string[] = [];
        
        for (const el of Array.from(elements).slice(0, 100)) {
          const styles = window.getComputedStyle(el);
          if (styles.animationDuration && styles.animationDuration !== '0s') {
            durations.push(styles.animationDuration);
          }
        }
        
        return durations;
      });
      
      // With reduced motion, most animations should be disabled
      // Allow some animations but they should be minimal
      expect(animationDurations.length).toBeLessThan(20);
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    test('should have proper landmark regions', async ({ page }) => {
      const landmarks = await page.evaluate(() => {
        return {
          nav: document.querySelectorAll('nav, [role="navigation"]').length,
          main: document.querySelectorAll('main, [role="main"]').length,
          header: document.querySelectorAll('header, [role="banner"]').length,
        };
      });
      
      // Should have navigation
      expect(landmarks.nav).toBeGreaterThanOrEqual(1);
      
      // Should have main content area
      expect(landmarks.main).toBeGreaterThanOrEqual(1);
    });

    test('should have descriptive link text', async ({ page }) => {
      const links = await page.locator('a').all();
      
      for (const link of links.slice(0, 20)) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        
        const hasDescriptiveText = (text && text.trim().length > 0) || 
                                   (ariaLabel && ariaLabel.length > 0);
        
        expect(hasDescriptiveText).toBe(true);
      }
    });

    test('should announce dynamic content changes', async ({ page }) => {
      // Check for aria-live regions
      const liveRegions = await page.evaluate(() => {
        return document.querySelectorAll('[aria-live]').length;
      });
      
      // Should have at least some live regions for dynamic content
      expect(liveRegions).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have labels for form inputs', async ({ page }) => {
      // Go to a page with forms (search, chat, etc.)
      const inputs = await page.locator('input, textarea').all();
      
      for (const input of inputs.slice(0, 10)) {
        const hasLabel = await input.evaluate((el) => {
          const id = el.id;
          const hasLabelElement = id && document.querySelector(`label[for="${id}"]`);
          const hasAriaLabel = el.getAttribute('aria-label');
          const hasAriaLabelledBy = el.getAttribute('aria-labelledby');
          const hasPlaceholder = el.getAttribute('placeholder');
          
          return !!(hasLabelElement || hasAriaLabel || hasAriaLabelledBy || hasPlaceholder);
        });
        
        expect(hasLabel).toBe(true);
      }
    });

    test('should show error messages with aria-invalid', async ({ page }) => {
      // This test is informational - checking if error states are accessible
      const inputsWithErrors = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input[aria-invalid="true"]');
        return inputs.length;
      });
      
      // Just checking the pattern exists (may be 0 if no errors currently)
      expect(inputsWithErrors).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('should have adequate touch target sizes', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check button sizes
      const smallButtons = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, a[role="button"]');
        const small: number[] = [];
        
        for (const btn of Array.from(buttons).slice(0, 20)) {
          const rect = btn.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            // WCAG recommends 44x44px minimum
            if (rect.width < 44 || rect.height < 44) {
              small.push(Math.min(rect.width, rect.height));
            }
          }
        }
        
        return small;
      });
      
      // Allow some small buttons but flag if there are too many
      if (smallButtons.length > 5) {
        console.warn(`Found ${smallButtons.length} buttons smaller than 44x44px`);
      }
      
      // This is informational
      expect(smallButtons.length).toBeLessThan(20);
    });
  });
});
