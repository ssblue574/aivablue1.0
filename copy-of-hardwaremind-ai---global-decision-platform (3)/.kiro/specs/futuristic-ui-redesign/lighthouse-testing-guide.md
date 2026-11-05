# Lighthouse Testing Guide

## Overview

This guide provides step-by-step instructions for running Lighthouse audits and measuring Core Web Vitals to validate the performance optimizations implemented in Task 30.

## Prerequisites

- Chrome browser (latest version)
- Production build of the application
- Local server running

## Part 1: Building and Running Production Build

### Step 1: Build the Application

```bash
npm run build
```

Expected output:
- Main bundle: ~730 KB (180 KB gzipped)
- Vendor chunks properly split
- CSS optimized and code-split

### Step 2: Preview Production Build

```bash
npm run preview
```

The application should be available at `http://localhost:4173`

## Part 2: Running Lighthouse Audit

### Step 1: Open Chrome DevTools

1. Navigate to `http://localhost:4173`
2. Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
3. Click on the "Lighthouse" tab

### Step 2: Configure Lighthouse

**Desktop Audit:**
- Mode: Navigation (default)
- Device: Desktop
- Categories: 
  - ✅ Performance
  - ✅ Accessibility
  - ✅ Best Practices
  - ✅ SEO

**Mobile Audit:**
- Mode: Navigation (default)
- Device: Mobile
- Categories: Same as above

### Step 3: Run the Audit

1. Click "Analyze page load"
2. Wait for the audit to complete (30-60 seconds)
3. Review the results

### Step 4: Target Scores

**Performance (Target: 90+)**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Total Blocking Time: < 300ms
- Cumulative Layout Shift: < 0.1
- Speed Index: < 3.0s

**Accessibility (Target: 90+)**
- Color contrast: WCAG AA compliant
- ARIA attributes: Properly implemented
- Keyboard navigation: Fully functional
- Screen reader: Compatible

## Part 3: Measuring Core Web Vitals

### Using Chrome DevTools Performance Panel

1. Open DevTools (F12)
2. Navigate to "Performance" tab
3. Click the record button (⚫)
4. Perform typical user interactions:
   - Navigate between pages
   - Scroll through product lists
   - Open/close modals
   - Hover over cards
5. Stop recording
6. Analyze the results

### Key Metrics to Check

**First Contentful Paint (FCP)**
- Target: < 1.5s
- Look for: First paint event in timeline
- Good: Green indicator
- Needs improvement: Orange indicator
- Poor: Red indicator

**Largest Contentful Paint (LCP)**
- Target: < 2.5s
- Look for: Largest element rendered
- Usually: Hero image or main content

**First Input Delay (FID)**
- Target: < 100ms
- Look for: Time between user interaction and response
- Measure: Click on buttons, links

**Cumulative Layout Shift (CLS)**
- Target: < 0.1
- Look for: Layout shift events in timeline
- Check: Images, fonts, dynamic content

### Using Performance Monitor

1. Open Command Palette:
   - Mac: `Cmd+Shift+P`
   - Windows: `Ctrl+Shift+P`
2. Type "Show Performance Monitor"
3. Monitor real-time metrics:
   - CPU usage
   - JS heap size
   - DOM nodes
   - JS event listeners
   - Layouts/sec
   - Style recalcs/sec

## Part 4: Testing Animation Performance

### FPS Monitoring

1. Open Performance Monitor (see above)
2. Navigate to pages with animations:
   - Home page (neural network background)
   - Products page (card hover effects)
   - Keynotes page (video player)
3. Perform interactions:
   - Scroll smoothly
   - Hover over cards
   - Open/close modals
4. Monitor FPS:
   - Target: 60 FPS
   - Acceptable: 55+ FPS
   - Poor: < 50 FPS

### Scroll Performance Test

1. Open Performance panel
2. Start recording
3. Scroll through long pages:
   - Products list
   - Community feed
   - Keynotes playlist
4. Stop recording
5. Check FPS graph:
   - Should be consistently near 60 FPS
   - No significant drops
   - No long tasks blocking main thread

## Part 5: Mobile Performance Testing

### Using Chrome DevTools Device Emulation

1. Open DevTools
2. Click device toolbar icon (or `Cmd+Shift+M`)
3. Select device:
   - iPhone 12 Pro
   - Pixel 5
   - iPad Pro
4. Test with throttling:
   - Network: Fast 3G
   - CPU: 4x slowdown
5. Run Lighthouse audit with mobile settings

### Expected Mobile Performance

- Performance score: 85+ (slightly lower than desktop)
- Animations: Simplified on low-end devices
- Images: Lazy loaded
- Interactions: Touch-optimized

## Part 6: Network Performance Testing

### Throttling Test

1. Open DevTools Network panel
2. Select throttling profile:
   - Fast 3G
   - Slow 3G
   - Offline (for testing offline behavior)
3. Reload page
4. Measure:
   - Time to interactive
   - Total load time
   - Number of requests
   - Total transfer size

### Expected Results

**Fast 3G:**
- Time to interactive: < 5s
- Total requests: < 50
- Total size: < 2MB

**Slow 3G:**
- Time to interactive: < 10s
- Progressive loading visible
- Critical content loads first

## Part 7: Image Loading Performance

### Lazy Loading Verification

1. Open DevTools Network panel
2. Filter by "Img"
3. Scroll through pages
4. Verify:
   - Images load only when near viewport
   - Loading states visible
   - No layout shifts

### Image Optimization Check

1. Check image sizes in Network panel
2. Verify:
   - Product images: < 150KB each
   - Keynote images: < 120KB each
   - News images: < 100KB each
3. Check formats:
   - JPG for photos
   - PNG for graphics with transparency

## Part 8: Bundle Size Analysis

### Analyzing Bundle Composition

1. Build with source maps:
   ```bash
   npm run build -- --sourcemap
   ```

2. Use bundle analyzer (if installed):
   ```bash
   npx vite-bundle-visualizer
   ```

3. Check chunk sizes:
   - Main bundle: ~730 KB
   - React vendor: ~46 KB
   - Three vendor: ~186 KB
   - Charts vendor: ~324 KB

### Expected Improvements

- 44% reduction in main bundle size
- Proper code splitting
- Lazy loading for route components
- Vendor chunks cached separately

## Part 9: Accessibility Testing

### Keyboard Navigation Test

1. Tab through all interactive elements
2. Verify:
   - Focus indicators visible
   - Logical tab order
   - All buttons/links accessible
   - Modals can be closed with Escape

### Screen Reader Test

**Mac (VoiceOver):**
1. Enable: `Cmd+F5`
2. Navigate with `Ctrl+Option+Arrow keys`
3. Verify:
   - All content announced
   - ARIA labels present
   - Semantic HTML used

**Windows (NVDA):**
1. Download and install NVDA
2. Start NVDA
3. Navigate with arrow keys
4. Verify same as above

### Color Contrast Test

1. Install axe DevTools extension
2. Run audit
3. Check for contrast issues
4. Target: WCAG AA compliance (4.5:1 for normal text)

## Part 10: Reporting Results

### Create Performance Report

Document the following:

1. **Lighthouse Scores**
   - Performance: ___/100
   - Accessibility: ___/100
   - Best Practices: ___/100
   - SEO: ___/100

2. **Core Web Vitals**
   - FCP: ___ms
   - LCP: ___ms
   - FID: ___ms
   - CLS: ___

3. **Animation Performance**
   - Average FPS: ___
   - Minimum FPS: ___
   - Scroll performance: ✅/❌

4. **Bundle Sizes**
   - Main bundle: ___KB (___KB gzipped)
   - Total size: ___KB (___KB gzipped)

5. **Issues Found**
   - List any issues
   - Severity: High/Medium/Low
   - Recommendations

### Success Criteria

✅ Performance score: 90+
✅ Accessibility score: 90+
✅ FPS: 55+ consistently
✅ Bundle size: < 800KB main bundle
✅ LCP: < 2.5s
✅ CLS: < 0.1

## Troubleshooting

### Low Performance Score

**Possible causes:**
- Large images not optimized
- Too many render-blocking resources
- Long JavaScript execution time

**Solutions:**
- Compress images further
- Implement more aggressive code splitting
- Defer non-critical JavaScript

### Low Accessibility Score

**Possible causes:**
- Missing ARIA labels
- Poor color contrast
- Keyboard navigation issues

**Solutions:**
- Add proper ARIA attributes
- Adjust color palette
- Implement focus management

### Low FPS

**Possible causes:**
- Too many particles
- Complex animations
- Inefficient rendering

**Solutions:**
- Reduce particle count
- Simplify animations
- Use CSS transforms instead of position changes

## Conclusion

After completing all tests, you should have:
- Comprehensive performance metrics
- Identified bottlenecks
- Validation of optimizations
- Action items for further improvements

The optimizations implemented in Task 30 should result in:
- ✅ 44% reduction in bundle size
- ✅ Proper code splitting
- ✅ Lazy loading for images and routes
- ✅ Optimized animation performance
- ✅ Better Core Web Vitals
