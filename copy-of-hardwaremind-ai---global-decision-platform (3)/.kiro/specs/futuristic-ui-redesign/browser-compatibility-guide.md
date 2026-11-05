# Browser Compatibility Guide

## Quick Reference

This guide provides practical information for developers working with the browser compatibility system.

## Feature Detection

### Automatic Detection

Feature detection runs automatically on app initialization. Check the console in development mode to see the compatibility report:

```javascript
🔍 Browser Compatibility Report
Browser: { isChrome: true, isSafari: false, isFirefox: false, ... }
Features: { 
  backdropFilter: true,
  transforms3d: true,
  webp: true,
  cssGrid: true,
  customProperties: true,
  intersectionObserver: true,
  webAnimations: true
}
✅ All features supported!
```

### Manual Detection

You can manually check feature support in your components:

```typescript
import { 
  supportsBackdropFilter,
  supports3DTransforms,
  getBrowserInfo 
} from './utils/browserCompat';

// Check specific feature
if (supportsBackdropFilter()) {
  // Use advanced blur effects
} else {
  // Use solid backgrounds
}

// Get browser info
const browser = getBrowserInfo();
if (browser?.isMobile) {
  // Apply mobile optimizations
}
```

## Using Feature Classes

The system automatically adds feature detection classes to the `<html>` element. Use these in your CSS:

```css
/* Default styles (fallback) */
.my-component {
  background: rgba(0, 0, 0, 0.9);
}

/* Enhanced styles when backdrop-filter is supported */
.supports-backdropFilter .my-component {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
}

/* Alternative styles when backdrop-filter is NOT supported */
.no-backdropFilter .my-component {
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.1);
}
```

## CSS @supports Queries

Use `@supports` for progressive enhancement:

```css
/* Fallback */
.card {
  transform: translateY(-8px);
}

/* Enhanced when 3D transforms are supported */
@supports (transform: perspective(1000px)) {
  .card {
    transform: perspective(1000px) rotateX(2deg) translateY(-10px);
  }
}
```

## Common Patterns

### Glassmorphism with Fallback

```css
.glass-card {
  /* Fallback: solid background */
  background: rgba(17, 17, 17, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

@supports (backdrop-filter: blur(20px)) {
  .glass-card {
    /* Enhanced: blur effect */
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
  }
}
```

### 3D Transforms with Fallback

```css
.card-3d {
  /* Fallback: 2D transform */
  transition: transform 0.3s ease;
}

.card-3d:hover {
  transform: translateY(-8px) scale(1.02);
}

@supports (transform: perspective(1000px)) {
  .card-3d {
    /* Enhanced: 3D transform */
    transform-style: preserve-3d;
  }
  
  .card-3d:hover {
    transform: perspective(1000px) rotateX(2deg) rotateY(-5deg) translateY(-10px);
  }
}
```

### Gradient Text with Fallback

```css
.gradient-text {
  /* Fallback: solid color */
  color: #00FFC6;
}

@supports (background-clip: text) or (-webkit-background-clip: text) {
  .gradient-text {
    /* Enhanced: gradient */
    background: linear-gradient(135deg, #00FFC6, #FF5FD2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
}
```

## Mobile Optimizations

### Automatic Optimizations

The system automatically applies mobile optimizations:

```css
@media (max-width: 768px) {
  /* Reduced blur intensity */
  .glass-card {
    backdrop-filter: blur(10px) !important;
  }
  
  /* Disabled 3D transforms */
  .card-3d {
    transform-style: flat !important;
  }
  
  /* Faster animations */
  * {
    animation-duration: 0.2s !important;
  }
}
```

### Touch Device Optimizations

```css
@media (hover: none) and (pointer: coarse) {
  /* Remove hover effects on touch devices */
  .card:hover {
    transform: none !important;
  }
  
  /* Larger tap targets */
  button {
    min-height: 44px;
    min-width: 44px;
  }
}
```

## Accessibility

### Reduced Motion

Always respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Hide decorative animations */
  .particle-system,
  .neural-network {
    display: none;
  }
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  .glass-card {
    /* More opaque backgrounds */
    background: rgba(0, 0, 0, 0.95) !important;
    border: 2px solid rgba(255, 255, 255, 0.5) !important;
  }
  
  /* Remove blur effects */
  * {
    backdrop-filter: none !important;
  }
}
```

## Browser-Specific Issues

### Safari

Safari requires `-webkit-` prefixes for some features:

```css
.glass-card {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px); /* Safari */
}

.gradient-text {
  background-clip: text;
  -webkit-background-clip: text; /* Safari */
  -webkit-text-fill-color: transparent; /* Safari */
}
```

Safari may have rendering issues with backdrop-filter. Add hardware acceleration:

```css
.glass-card {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
}
```

### Firefox

Firefox doesn't support `backdrop-filter` yet (as of 2024). The fallback CSS handles this:

```css
@-moz-document url-prefix() {
  .glass-card {
    background: rgba(17, 17, 17, 0.9) !important;
  }
}
```

### Edge

Modern Edge (Chromium-based) supports all features. Legacy Edge may need fallbacks for 3D transforms.

## Testing

### Manual Testing Checklist

Test your changes in:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android)

### Automated Testing

Run the E2E tests:

```bash
# Start dev server
npm run dev

# In another terminal, run tests
npm run test:visual
```

Run specific browser compatibility tests:

```bash
npx playwright test tests/browser-compatibility.spec.ts
```

### Testing Reduced Motion

In Chrome DevTools:
1. Open DevTools (F12)
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "prefers-reduced-motion: reduce"

### Testing High Contrast

In Chrome DevTools:
1. Open DevTools (F12)
2. Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows)
3. Type "Emulate CSS prefers-contrast"
4. Select "prefers-contrast: more"

## Performance Tips

### Use GPU Acceleration

```css
.animated-element {
  /* Trigger GPU acceleration */
  transform: translateZ(0);
  will-change: transform;
}
```

### Optimize Blur Effects

```css
/* Desktop: full blur */
.glass-card {
  backdrop-filter: blur(20px);
}

/* Mobile: reduced blur */
@media (max-width: 768px) {
  .glass-card {
    backdrop-filter: blur(10px);
  }
}
```

### Simplify Animations on Mobile

```css
@media (max-width: 768px) {
  .animated-element {
    /* Shorter duration */
    animation-duration: 0.2s !important;
    
    /* Simpler animation */
    animation-name: simple-fade !important;
  }
}
```

## Debugging

### Check Feature Support

Open the browser console and run:

```javascript
// Check backdrop-filter support
CSS.supports('backdrop-filter', 'blur(10px)')

// Check 3D transform support
CSS.supports('transform', 'perspective(1000px)')

// Check gradient text support
CSS.supports('background-clip', 'text')
```

### View Applied Classes

Check the `<html>` element classes:

```javascript
console.log(document.documentElement.className);
// Output: "supports-backdropFilter supports-transforms3d supports-cssGrid ..."
```

### View Compatibility Report

The compatibility report is logged automatically in development mode. Check the console on page load.

## Common Issues

### Issue: Blur effects not working

**Cause**: Browser doesn't support `backdrop-filter`

**Solution**: Fallback CSS is automatically applied. Verify `theme/browserFallbacks.css` is imported.

### Issue: 3D transforms look flat

**Cause**: `transform-style: preserve-3d` not supported or disabled on mobile

**Solution**: This is intentional on mobile for performance. Desktop should work fine.

### Issue: Animations too fast/slow

**Cause**: Device performance or reduced motion preference

**Solution**: System automatically adjusts. Check `prefers-reduced-motion` setting.

### Issue: Text gradient not showing

**Cause**: Browser doesn't support `background-clip: text`

**Solution**: Fallback to solid color is automatic. Verify fallback CSS is loaded.

## Best Practices

1. **Always provide fallbacks**: Never rely solely on advanced features
2. **Test across browsers**: Use real devices when possible
3. **Respect user preferences**: Honor reduced motion and high contrast
4. **Optimize for mobile**: Reduce complexity on mobile devices
5. **Use feature detection**: Check support before using advanced features
6. **Monitor performance**: Ensure 60 FPS across devices
7. **Keep fallbacks simple**: Fallbacks should be fast and reliable
8. **Document browser requirements**: Be clear about minimum browser versions

## Resources

- [Can I Use](https://caniuse.com/) - Browser support tables
- [MDN Web Docs](https://developer.mozilla.org/) - Feature documentation
- [Playwright](https://playwright.dev/) - Cross-browser testing
- [CSS @supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) - Feature queries

## Support Matrix

| Feature | Chrome 90+ | Firefox 88+ | Safari 14+ | Edge 90+ |
|---------|-----------|-------------|-----------|----------|
| backdrop-filter | ✅ | ❌ (fallback) | ✅ | ✅ |
| 3D transforms | ✅ | ✅ | ✅ | ✅ |
| gradient text | ✅ | ✅ | ✅ | ✅ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Custom Properties | ✅ | ✅ | ✅ | ✅ |
| Web Animations | ✅ | ✅ | ✅ | ✅ |

---

**Last Updated**: December 14, 2024
**Maintained By**: Development Team
