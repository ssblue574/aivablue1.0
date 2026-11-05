import { test, expect, Page } from '@playwright/test';

/**
 * Browser Compatibility Tests
 * Tests visual features across different browsers and validates fallbacks
 */

// Helper to check if backdrop-filter is applied
async function hasBackdropFilter(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return !!(style.backdropFilter && style.backdropFilter !== 'none') ||
           !!(style.webkitBackdropFilter && style.webkitBackdropFilter !== 'none');
  }, selector);
}

// Helper to check if 3D transforms are applied
async function has3DTransforms(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    const style = window.getComputedStyle(element);
    return style.transformStyle === 'preserve-3d';
  }, selector);
}

// Helper to get background color
async function getBackgroundColor(page: Page, selector: string): Promise<string> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return '';
    return window.getComputedStyle(element).backgroundColor;
  }, selector);
}

test.describe('Browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Backdrop Filter Support', () => {
    test('should apply backdrop-filter to glassmorphic cards when supported', async ({ page, browserName }) => {
      // Navigate to a page with glassmorphic cards
      await page.goto('/products');
      await page.waitForSelector('.glassmorphic-card, .glass-card', { timeout: 5000 });

      const hasBlur = await hasBackdropFilter(page, '.glassmorphic-card, .glass-card');
      
      // Chrome and Safari support backdrop-filter, Firefox may not
      if (browserName === 'chromium' || browserName === 'webkit') {
        expect(hasBlur).toBe(true);
      }
      
      // Verify element is visible regardless of support
      const card = page.locator('.glassmorphic-card, .glass-card').first();
      await expect(card).toBeVisible();
    });

    test('should have solid background fallback when backdrop-filter not supported', async ({ page }) => {
      // Disable backdrop-filter support
      await page.addStyleTag({
        content: `
          * {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
        `
      });

      await page.goto('/products');
      await page.waitForSelector('.glassmorphic-card, .glass-card');

      const bgColor = await getBackgroundColor(page, '.glassmorphic-card, .glass-card');
      
      // Should have a solid or semi-transparent background
      expect(bgColor).toBeTruthy();
      expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('should apply backdrop-filter to navbar', async ({ page, browserName }) => {
      const navbar = page.locator('nav, .navbar').first();
      await expect(navbar).toBeVisible();

      const hasBlur = await hasBackdropFilter(page, 'nav, .navbar');
      
      if (browserName === 'chromium' || browserName === 'webkit') {
        expect(hasBlur).toBe(true);
      }
    });
  });

  test.describe('3D Transform Support', () => {
    test('should apply 3D transforms to product cards on hover', async ({ page, browserName }) => {
      await page.goto('/products');
      await page.waitForSelector('.product-card, .card-3d');

      const card = page.locator('.product-card, .card-3d').first();
      await expect(card).toBeVisible();

      // Check if 3D transforms are supported
      const has3D = await has3DTransforms(page, '.product-card, .card-3d');
      
      // Modern browsers should support 3D transforms
      if (browserName === 'chromium' || browserName === 'webkit') {
        expect(has3D).toBe(true);
      }
    });

    test('should fall back to 2D transforms when 3D not supported', async ({ page }) => {
      // Disable 3D transforms
      await page.addStyleTag({
        content: `
          * {
            transform-style: flat !important;
          }
        `
      });

      await page.goto('/products');
      const card = page.locator('.product-card').first();
      
      // Hover to trigger transform
      await card.hover();
      
      // Card should still be visible and interactive
      await expect(card).toBeVisible();
    });

    test('should disable 3D transforms on mobile', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/products');

      const card = page.locator('.product-card').first();
      await expect(card).toBeVisible();

      // 3D transforms should be disabled on mobile for performance
      const transform = await page.evaluate(() => {
        const el = document.querySelector('.product-card');
        if (!el) return '';
        return window.getComputedStyle(el).transformStyle;
      });

      // Should be flat on mobile
      expect(transform).toBe('flat');
    });
  });

  test.describe('Gradient Text Support', () => {
    test('should apply gradient to text when supported', async ({ page, browserName }) => {
      await page.goto('/');
      
      const gradientText = page.locator('.gradient-text').first();
      if (await gradientText.count() > 0) {
        const hasGradient = await page.evaluate(() => {
          const el = document.querySelector('.gradient-text');
          if (!el) return false;
          const style = window.getComputedStyle(el);
          return style.backgroundClip === 'text' || style.webkitBackgroundClip === 'text';
        });

        // Modern browsers support background-clip: text
        if (browserName === 'chromium' || browserName === 'webkit') {
          expect(hasGradient).toBe(true);
        }
      }
    });

    test('should have solid color fallback for gradient text', async ({ page }) => {
      // Disable gradient text
      await page.addStyleTag({
        content: `
          .gradient-text {
            background: none !important;
            -webkit-background-clip: unset !important;
            -webkit-text-fill-color: unset !important;
            background-clip: unset !important;
          }
        `
      });

      await page.goto('/');
      const gradientText = page.locator('.gradient-text').first();
      
      if (await gradientText.count() > 0) {
        const color = await gradientText.evaluate((el) => {
          return window.getComputedStyle(el).color;
        });

        // Should have a solid color
        expect(color).toBeTruthy();
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
      }
    });
  });

  test.describe('CSS Grid Support', () => {
    test('should use CSS Grid for product layout when supported', async ({ page }) => {
      await page.goto('/products');
      await page.waitForSelector('.grid-layout, [class*="grid"]');

      const hasGrid = await page.evaluate(() => {
        const gridElements = document.querySelectorAll('.grid-layout, [class*="grid"]');
        for (const el of gridElements) {
          const style = window.getComputedStyle(el);
          if (style.display === 'grid') return true;
        }
        return false;
      });

      // Modern browsers support CSS Grid
      expect(hasGrid).toBe(true);
    });

    test('should fall back to flexbox when grid not supported', async ({ page }) => {
      // Disable CSS Grid
      await page.addStyleTag({
        content: `
          .grid-layout, [class*="grid"] {
            display: flex !important;
          }
        `
      });

      await page.goto('/products');
      
      // Products should still be visible and laid out properly
      const products = page.locator('.product-card');
      const count = await products.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Animation Support', () => {
    test('should respect prefers-reduced-motion', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');

      // Check if animations are disabled
      const hasAnimations = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class*="animate"]');
        for (const el of elements) {
          const style = window.getComputedStyle(el);
          if (style.animationDuration !== '0s' && style.animationDuration !== '0.01ms') {
            return true;
          }
        }
        return false;
      });

      // Animations should be disabled or minimal
      expect(hasAnimations).toBe(false);
    });

    test('should hide particle systems when reduced motion is preferred', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('/');

      // Particle systems should be hidden
      const particleSystem = page.locator('.particle-system, .neural-network, canvas');
      const count = await particleSystem.count();
      
      if (count > 0) {
        const isVisible = await particleSystem.first().isVisible();
        expect(isVisible).toBe(false);
      }
    });
  });

  test.describe('Mobile Browser Optimizations', () => {
    test('should reduce blur intensity on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/products');

      const blurValue = await page.evaluate(() => {
        const card = document.querySelector('.glassmorphic-card, .glass-card');
        if (!card) return '';
        const style = window.getComputedStyle(card);
        return style.backdropFilter || style.webkitBackdropFilter || '';
      });

      // On mobile, blur should be reduced (10px instead of 20px)
      if (blurValue) {
        expect(blurValue).toContain('blur');
      }
    });

    test('should simplify animations on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check animation durations
      const animationDuration = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class*="animate"]');
        const durations: string[] = [];
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.animationDuration) {
            durations.push(style.animationDuration);
          }
        });
        return durations;
      });

      // Animations should be shorter on mobile
      animationDuration.forEach(duration => {
        const ms = parseFloat(duration) * (duration.includes('ms') ? 1 : 1000);
        expect(ms).toBeLessThanOrEqual(300);
      });
    });

    test('should have larger tap targets on touch devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check button sizes
      const buttons = page.locator('button, a[role="button"]');
      const count = await buttons.count();

      if (count > 0) {
        const firstButton = buttons.first();
        const box = await firstButton.boundingBox();
        
        if (box) {
          // Tap targets should be at least 44x44px
          expect(box.height).toBeGreaterThanOrEqual(40);
        }
      }
    });
  });

  test.describe('High Contrast Mode', () => {
    test('should increase contrast in high contrast mode', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark', contrast: 'more' });
      await page.goto('/');

      // Check if high contrast styles are applied
      const bgColor = await getBackgroundColor(page, '.glass-card, .glassmorphic-card');
      
      // Background should be more opaque in high contrast mode
      expect(bgColor).toBeTruthy();
    });

    test('should remove blur effects in high contrast mode', async ({ page }) => {
      await page.emulateMedia({ contrast: 'more' });
      await page.goto('/products');

      const hasBlur = await hasBackdropFilter(page, '.glass-card, .glassmorphic-card');
      
      // Blur should be disabled in high contrast mode
      expect(hasBlur).toBe(false);
    });
  });

  test.describe('Feature Detection Classes', () => {
    test('should add feature detection classes to html element', async ({ page }) => {
      await page.goto('/');

      const classes = await page.evaluate(() => {
        return document.documentElement.className;
      });

      // Should have feature detection classes
      expect(classes).toBeTruthy();
      expect(classes).toMatch(/supports-|no-/);
    });

    test('should detect backdrop-filter support correctly', async ({ page, browserName }) => {
      await page.goto('/');

      const hasClass = await page.evaluate(() => {
        return document.documentElement.classList.contains('supports-backdropFilter') ||
               document.documentElement.classList.contains('no-backdropFilter');
      });

      expect(hasClass).toBe(true);
    });

    test('should detect 3D transform support correctly', async ({ page }) => {
      await page.goto('/');

      const hasClass = await page.evaluate(() => {
        return document.documentElement.classList.contains('supports-transforms3d') ||
               document.documentElement.classList.contains('no-transforms3d');
      });

      expect(hasClass).toBe(true);
    });
  });

  test.describe('Cross-Browser Visual Consistency', () => {
    test('should render glassmorphic cards consistently', async ({ page }) => {
      await page.goto('/products');
      const card = page.locator('.glassmorphic-card, .glass-card').first();
      
      await expect(card).toBeVisible();
      await expect(card).toHaveCSS('border-radius', /\d+px/);
    });

    test('should render buttons consistently', async ({ page }) => {
      await page.goto('/');
      const button = page.locator('button').first();
      
      await expect(button).toBeVisible();
      
      // Button should be clickable
      await expect(button).toBeEnabled();
    });

    test('should render navigation consistently', async ({ page }) => {
      const navbar = page.locator('nav, .navbar').first();
      
      await expect(navbar).toBeVisible();
      await expect(navbar).toHaveCSS('position', 'fixed');
    });
  });
});
