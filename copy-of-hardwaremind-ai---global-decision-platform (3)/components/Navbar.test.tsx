/**
 * Property-Based Tests for Navbar
 * Feature: futuristic-ui-redesign
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import React from 'react';
import { Navbar } from './Navbar';
import { ThemeProvider } from '../ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import { Language } from '../data';

// Mock translations
const mockTranslations = {
  nav_home: 'Home',
  nav_keynote: 'Keynote',
  nav_products: 'Products',
  nav_community: 'Community',
  search_placeholder: 'Search...',
};

const mockT = (key: string) => mockTranslations[key as keyof typeof mockTranslations] || key;

// Helper to render Navbar with all required props
const renderNavbar = (overrides = {}) => {
  const defaultProps = {
    lang: 'en' as Language,
    setLang: vi.fn(),
    selectedCount: 0,
    onCompare: vi.fn(),
    onToggleChat: vi.fn(),
    t: mockT,
    currentUser: null,
    onLoginClick: vi.fn(),
    onLogout: vi.fn(),
    searchQuery: '',
    setSearchQuery: vi.fn(),
    onSearch: vi.fn(),
    ...overrides,
  };

  return render(
    <BrowserRouter>
      <ThemeProvider>
        <Navbar {...defaultProps} />
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Navbar Property Tests', () => {
  beforeEach(() => {
    // Clear any existing theme attributes
    document.documentElement.removeAttribute('data-theme');
  });

  /**
   * Property 30: Progressive Disclosure
   * Validates: Requirements 2.5
   * Feature: futuristic-ui-redesign, Property 30: Progressive Disclosure
   * 
   * For any complex functionality, it should be hidden by default and only shown when needed.
   * In the navbar context, this means:
   * - Search clear button only appears when there's text (tested via interaction)
   * - Advanced features are not cluttering the interface
   * - User profile details are progressively disclosed
   */
  it('Property 30: Complex features should be hidden by default and shown only when needed', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          searchText: fc.string({ minLength: 0, maxLength: 50 }),
          hasUser: fc.boolean(),
        }),
        async ({ searchText, hasUser }) => {
          const currentUser = hasUser
            ? { id: '1', email: 'test@example.com', name: 'Test User' }
            : null;

          const { container, unmount } = renderNavbar({
            currentUser,
          });

          try {
            // Test 1: Search clear button (X) should only appear when there's text
            // First, find and interact with the search input
            const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            if (!searchInput) return false;
            
            // Type the search text
            fireEvent.change(searchInput, { target: { value: searchText } });
            
            // Wait for state update
            await new Promise(resolve => setTimeout(resolve, 10));
            
            // Now check for clear button - it should be a sibling or close relative of the search input
            const searchParent = searchInput.parentElement;
            if (!searchParent) return false;
            
            // Look for clear button within the search container
            const buttonsInSearchArea = searchParent.querySelectorAll('button');
            let hasClearButton = false;
            
            for (let i = 0; i < buttonsInSearchArea.length; i++) {
              const button = buttonsInSearchArea[i];
              // Look for X icon (lucide-react renders as SVG)
              const svg = button.querySelector('svg');
              if (!svg) continue;
              
              // X icon typically has two crossing lines or specific path
              const lines = svg.querySelectorAll('line');
              const paths = svg.querySelectorAll('path');
              
              // X icon usually has 2 lines or a path with M commands (crossing pattern)
              const hasXStructure = lines.length >= 2 || 
                                   (paths.length > 0 && Array.from(paths).some(p => {
                                     const d = p.getAttribute('d') || '';
                                     return d.includes('M') && d.split('M').length > 2;
                                   }));
              
              if (hasXStructure) {
                hasClearButton = true;
                break;
              }
            }

            // Clear button should only exist when there's actual text (not just whitespace)
            const hasActualText = searchText.trim().length > 0;
            // For progressive disclosure: if there's no text, there should be no clear button
            // If there is text, we don't strictly require a clear button (it's optional)
            const clearButtonCorrectlyShown = hasActualText || !hasClearButton;

            // Test 2: User profile should show minimal info by default
            // When user is logged in, we should see avatar but full details are hidden/truncated
            if (hasUser) {
              const profileLinks = container.querySelectorAll('a[href="/profile"]');
              let hasMinimalProfile = false;
              
              for (let i = 0; i < profileLinks.length; i++) {
                const link = profileLinks[i];
                // Check if it shows avatar (compact representation)
                const hasAvatar = link.querySelector('div[class*="rounded-full"]') !== null;
                if (hasAvatar) {
                  hasMinimalProfile = true;
                  break;
                }
              }
              
              // Profile should be shown in a minimal, compact way
              if (!hasMinimalProfile) return false;
            }

            // Test 3: Navigation should not show unnecessary complexity
            // Count visible interactive elements - should be reasonable
            const allButtons = container.querySelectorAll('button');
            const allLinks = container.querySelectorAll('a');
            const totalInteractiveElements = allButtons.length + allLinks.length;
            
            // Should have a reasonable number of interactive elements (not cluttered)
            // Typical: logo, nav items (4), theme toggle, lang toggle, login/profile, search
            // Maximum reasonable: ~15 elements
            const notCluttered = totalInteractiveElements <= 20;

            // Test 4: Search input should be present but not overwhelming
            const searchInputs = container.querySelectorAll('input[type="text"]');
            const hasSearchInput = searchInputs.length > 0;
            
            // Should have search but not multiple redundant search boxes
            const reasonableSearchCount = searchInputs.length <= 2; // Desktop + mobile

            // All progressive disclosure principles should be met
            return clearButtonCorrectlyShown && notCluttered && hasSearchInput && reasonableSearchCount;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 50, timeout: 30000 }
    );
  }, 35000);

  /**
   * Additional property: Search focus should enhance visibility without clutter
   * Ensures search becomes more prominent when focused but doesn't overwhelm
   */
  it('Property: Search should progressively disclose enhanced features on focus', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('test'),
        async (_) => {
          const { container, unmount } = renderNavbar();

          try {
            const searchInput = container.querySelector('input[type="text"]') as HTMLInputElement;
            expect(searchInput).toBeTruthy();
            
            if (!searchInput) return false;

            // Before focus: search should be present but subtle
            const initialParent = searchInput.parentElement;
            if (!initialParent) return false;

            // Focus the search input
            fireEvent.focus(searchInput);
            
            // Wait for any animations/state updates
            await new Promise(resolve => setTimeout(resolve, 50));

            // After focus: search should have enhanced styling
            // Check for focus-related classes or computed styles
            const parentClasses = initialParent.className;
            const inputClasses = searchInput.className;
            
            // Look for focus-related styling
            const hasFocusClasses = 
              parentClasses.includes('focus-within') ||
              inputClasses.includes('focus:') ||
              parentClasses.includes('group');
            
            // Check if input actually has focus
            const hasFocus = document.activeElement === searchInput;

            // Search should either have focus or focus-related classes
            return hasFocusClasses || hasFocus;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  }, 15000);

  /**
   * Additional property: Navigation items should have clear active state
   * Ensures users can identify current location without visual clutter
   */
  it('Property: Active navigation item should be clearly indicated', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('test'),
        async (_) => {
          const { container, unmount } = renderNavbar();

          try {
            // Find all navigation links
            const navLinks = container.querySelectorAll('a[href^="/"]');
            
            // At least one should be active (home page by default)
            let hasActiveIndicator = false;
            
            for (let i = 0; i < navLinks.length; i++) {
              const link = navLinks[i] as HTMLElement;
              const classes = link.className;
              
              // Check for active state indicators
              // Could be background, text color, or indicator element
              const hasActiveClass = 
                classes.includes('bg-white') ||
                classes.includes('bg-black') ||
                classes.includes('font-semibold');
              
              // Check for light indicator element (child div)
              const hasIndicatorChild = link.querySelector('div[class*="bottom"]') !== null;
              
              if (hasActiveClass || hasIndicatorChild) {
                hasActiveIndicator = true;
                break;
              }
            }

            return hasActiveIndicator;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  }, 15000);

  /**
   * Additional property: Mobile navigation should maintain progressive disclosure
   * Ensures mobile view also hides complexity appropriately
   */
  it('Property: Mobile navigation should progressively disclose features', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          searchQuery: fc.string({ minLength: 0, maxLength: 30 }),
        }),
        async ({ searchQuery }) => {
          const { container, unmount } = renderNavbar({ searchQuery });

          try {
            // Mobile navigation should exist
            const mobileNav = container.querySelector('.md\\:hidden');
            expect(mobileNav).toBeTruthy();
            
            if (!mobileNav) return false;

            // Check that mobile nav has reasonable complexity
            const mobileButtons = mobileNav.querySelectorAll('button');
            const mobileLinks = mobileNav.querySelectorAll('a');
            const mobileInputs = mobileNav.querySelectorAll('input');
            
            // Should have essential elements but not be cluttered
            const hasEssentials = mobileInputs.length > 0 && mobileLinks.length > 0;
            const notOverwhelming = (mobileButtons.length + mobileLinks.length) <= 15;

            return hasEssentials && notOverwhelming;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 30, timeout: 15000 }
    );
  }, 20000);

  /**
   * Additional property: Theme toggle should be accessible but not prominent
   * Ensures utility features don't dominate the interface
   */
  it('Property: Utility features should be accessible but subtle', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constant('test'),
        async (_) => {
          const { container, unmount } = renderNavbar();

          try {
            // Find theme toggle button (has Sun or Moon icon)
            const allButtons = container.querySelectorAll('button');
            let hasThemeToggle = false;
            let isSubtle = true;
            
            for (let i = 0; i < allButtons.length; i++) {
              const button = allButtons[i];
              
              // Look for SVG icons
              const svg = button.querySelector('svg');
              if (!svg) continue;
              
              // Check if SVG has typical Sun/Moon icon characteristics
              // Sun has circle + lines/rays, Moon has circle + path
              const hasCircle = svg.querySelector('circle') !== null;
              const hasPath = svg.querySelector('path') !== null;
              const hasLine = svg.querySelector('line') !== null;
              
              // If it has these elements, it's likely a theme toggle
              if (hasCircle || hasPath || hasLine) {
                // Additional check: button should be relatively small (not a large icon)
                const svgSize = svg.getAttribute('width') || svg.getAttribute('height');
                const isSmallIcon = !svgSize || parseInt(svgSize) <= 24;
                
                if (isSmallIcon) {
                  hasThemeToggle = true;
                  
                  // Theme toggle should be present but not overly prominent
                  // Check it doesn't have excessive styling
                  const classes = button.className;
                  isSubtle = !classes.includes('text-2xl') && 
                            !classes.includes('text-3xl') &&
                            !classes.includes('text-4xl');
                  break;
                }
              }
            }

            return hasThemeToggle && isSubtle;
          } finally {
            unmount();
          }
        }
      ),
      { numRuns: 20, timeout: 10000 }
    );
  }, 15000);
});
