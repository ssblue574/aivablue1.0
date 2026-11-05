import { test, expect } from '@playwright/test';

/**
 * Visual Regression Tests for AIVA Platform
 * 
 * These tests capture screenshots of key pages and compare them against baseline images
 * to detect unintended visual changes. The tests cover:
 * - HomeView: Main landing page with hero section and cards
 * - ProductsView: Product catalog with filters and grid
 * - KeynoteView: Video keynote player with playlist
 * 
 * Tests are run in both dark and light themes to ensure consistency.
 * 
 * Requirements: All (验证整体视觉一致性)
 */

// Helper function to wait for animations to complete
async function waitForAnimations(page: any, timeout = 500) {
  await page.waitForTimeout(timeout);
}

// Helper function to set theme
async function setTheme(page: any, theme: 'dark' | 'light') {
  await page.evaluate((themeValue) => {
    localStorage.setItem('theme', themeValue);
    document.documentElement.setAttribute('data-theme', themeValue);
  }, theme);
}

// Helper to hide dynamic content
async function hideDynamicContent(page: any) {
  await page.evaluate(() => {
    // Hide time/date elements
    const timeElements = document.querySelectorAll('[data-testid*="time"], [data-testid*="date"]');
    timeElements.forEach(el => {
      (el as HTMLElement).style.visibility = 'hidden';
    });
    
    // Disable animations for consistent screenshots
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `;
    document.head.appendChild(style);
  });
}

test.describe('Visual Regression Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set viewport to a consistent size
    await page.setViewportSize({ width: 1920, height: 1080 });
  });

  test.describe('HomeView - Critical Views', () => {
    
    test('should match baseline in dark mode', async ({ page }) => {
      await page.goto('/');
      await setTheme(page, 'dark');
      await page.reload();
      
      // Wait for page to load
      await page.waitForLoadState('domcontentloaded');
      await hideDynamicContent(page);
      await waitForAnimations(page);
      
      // Take viewport screenshot (faster than full page)
      await expect(page).toHaveScreenshot('home-view-dark.png', {
        fullPage: false,
        animations: 'disabled',
        maxDiffPixels: 200,
      });
    });

    test('should match baseline in light mode', async ({ page }) => {
      await page.goto('/');
      await setTheme(page, 'light');
      await page.reload();
      
      await page.waitForLoadState('domcontentloaded');
      await hideDynamicContent(page);
      await waitForAnimations(page);
      
      await expect(page).toHaveScreenshot('home-view-light.png', {
        fullPage: false,
        animations: 'disabled',
        maxDiffPixels: 200,
      });
    });
  });

  test.describe('ProductsView - Critical Views', () => {
    
    test('should match baseline in dark mode', async ({ page }) => {
      await page.goto('/');
      
      // Navigate to products view
      const productsLink = page.locator('text=/产品|Products/i').first();
      await productsLink.click();
      await setTheme(page, 'dark');
      
      await page.waitForLoadState('domcontentloaded');
      await hideDynamicContent(page);
      await waitForAnimations(page);
      
      await expect(page).toHaveScreenshot('products-view-dark.png', {
        fullPage: false,
        animations: 'disabled',
        maxDiffPixels: 200,
      });
    });

    test('should match baseline in light mode', async ({ page }) => {
      await page.goto('/');
      
      const productsLink = page.locator('text=/产品|Products/i').first();
      await productsLink.click();
      await setTheme(page, 'light');
      
      await page.waitForLoadState('domcontentloaded');
      await hideDynamicContent(page);
      await waitForAnimations(page);
      
      await expect(page).toHaveScreenshot('products-view-light.png', {
        fullPage: false,
        animations: 'disabled',
        maxDiffPixels: 200,
      });
    });
  });

  test.describe('KeynoteView - Critical Views', () => {
    
    test('should match baseline in dark mode', async ({ page }) => {
      await page.goto('/');
      
      // Navigate to keynote view
      const keynoteLink = page.locator('text=/主题演讲|Keynotes/i').first();
      await keynoteLink.click();
      await setTheme(page, 'dark');
      
      await page.waitForLoadState('domcontentloaded');
      await hideDynamicContent(page);
      await waitForAnimations(page);
      
      await expect(page).toHaveScreenshot('keynote-view-dark.png', {
        fullPage: false,
        animations: 'disabled',
        maxDiffPixels: 200,
      });
    });

    test('should match baseline in light mode', async ({ page }) => {
      await page.goto('/');
      
      const keynoteLink = page.locator('text=/主题演讲|Keynotes/i').first();
      await keynoteLink.click();
      await setTheme(page, 'light');
      
      await page.waitForLoadState('domcontentloaded');
      await hideDynamicContent(page);
      await waitForAnimations(page);
      
      await expect(page).toHaveScreenshot('keynote-view-light.png', {
        fullPage: false,
        animations: 'disabled',
        maxDiffPixels: 200,
      });
    });
  });

  test.describe('Responsive Design', () => {
    
    test('should match mobile viewport baseline', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      await page.goto('/');
      await setTheme(page, 'dark');
      await page.reload();
      
      await page.waitForLoadState('domcontentloaded');
      await hideDynamicContent(page);
      await waitForAnimations(page);
      
      await expect(page).toHaveScreenshot('home-view-mobile.png', {
        fullPage: false,
        animations: 'disabled',
        maxDiffPixels: 150,
      });
    });

    test('should match tablet viewport baseline', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
      await page.goto('/');
      
      const productsLink = page.locator('text=/产品|Products/i').first();
      await productsLink.click();
      await setTheme(page, 'dark');
      
      await page.waitForLoadState('domcontentloaded');
      await hideDynamicContent(page);
      await waitForAnimations(page);
      
      await expect(page).toHaveScreenshot('products-view-tablet.png', {
        fullPage: false,
        animations: 'disabled',
        maxDiffPixels: 150,
      });
    });
  });

  test.describe('Component States', () => {
    
    test('should match navbar baseline', async ({ page }) => {
      await page.goto('/');
      await setTheme(page, 'dark');
      await page.reload();
      
      await page.waitForLoadState('domcontentloaded');
      await hideDynamicContent(page);
      await waitForAnimations(page);
      
      // Screenshot navbar
      const navbar = page.locator('nav').first();
      await expect(navbar).toHaveScreenshot('navbar-dark.png', {
        animations: 'disabled',
        maxDiffPixels: 100,
      });
    });
  });
});
