# Theme Engine - Futuristic UI Design System

## Overview

This theme engine provides a comprehensive design system for the AIVA platform's futuristic UI redesign. It includes color palettes, animation configurations, design tokens, and smooth theme switching capabilities.

## Features

### 1. Enhanced Theme Engine (`ThemeEngine.tsx`)
- **Dual Theme Support**: Dark and light modes with smooth transitions
- **System Preference Detection**: Automatically detects user's system theme preference
- **LocalStorage Persistence**: Remembers user's theme choice
- **CSS Custom Properties**: Dynamic theme variables for easy styling
- **Smooth Transitions**: 300ms transition animations when switching themes

### 2. Design Tokens (`tokens.ts`)
- **Color Palette**: Comprehensive color system for both dark and light themes
  - Dark: Deep blacks with neon cyan, magenta, and purple accents
  - Light: Pure whites with Apple-style blue, pink, and purple accents
- **Animation Config**: Standardized durations (fast: 150ms, normal: 300ms, slow: 600ms)
- **Easing Functions**: Professional cubic-bezier curves for natural motion
- **Effect Config**: Blur, glow, and shadow presets
- **Spacing System**: 4px-based spacing scale
- **Border Radius**: Consistent corner radius values
- **Typography**: Font families, sizes, weights, and spacing

### 3. Animation Utilities (`utils/animation.ts`)
- **Easing Functions**: Pre-defined easing curves for animations
- **Performance Detection**: Automatically detects device capabilities (high/medium/low)
- **FPS Monitor**: Real-time frame rate monitoring
- **Reduced Motion Support**: Respects user's motion preferences
- **Spring Presets**: Physics-based animation configurations
- **Math Utilities**: lerp, clamp, mapRange for smooth interpolations
- **GPU Detection**: Checks for hardware acceleration support
- **Adaptive Configuration**: Adjusts animation quality based on performance

### 4. Tailwind CSS Integration
- **Custom Color Palette**: Extended Tailwind with theme colors
- **Design Token Integration**: All tokens available as Tailwind utilities
- **Custom Shadows**: Glow effects and depth shadows
- **Backdrop Blur**: Light, medium, and heavy blur utilities
- **Transition Utilities**: Custom timing functions and durations

## Usage

### Basic Setup

```tsx
import { ThemeEngineProvider } from './theme';

function App() {
  return (
    <ThemeEngineProvider>
      <YourApp />
    </ThemeEngineProvider>
  );
}
```

### Using the Theme Hook

```tsx
import { useThemeEngine } from './theme';

function MyComponent() {
  const { theme, toggleTheme, colors, animations } = useThemeEngine();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### Using CSS Custom Properties

```css
.my-element {
  background-color: var(--bg-primary);
  color: var(--color-primary);
  transition: all var(--duration-normal) var(--easing-standard);
  box-shadow: var(--glow-cyan);
}
```

### Using Tailwind Classes

```tsx
<div className="bg-primary text-white shadow-glow-cyan rounded-xl">
  Futuristic Card
</div>
```

### Using Animation Utilities

```tsx
import { detectPerformance, getAnimationConfig, FPSMonitor } from './utils';

// Detect device performance
const performance = detectPerformance(); // 'high' | 'medium' | 'low'

// Get optimal animation config
const config = getAnimationConfig(performance);

// Monitor FPS
const monitor = new FPSMonitor();
monitor.start((fps) => {
  console.log(`Current FPS: ${fps}`);
});
```

## Testing

The theme engine includes comprehensive property-based tests that verify:

1. **Property 10: Theme Switching Smoothness** - Validates that theme transitions have a minimum duration of 300ms
2. **Theme State Consistency** - Ensures themes alternate correctly between dark and light
3. **CSS Custom Properties** - Verifies all theme variables are properly set

Run tests with:
```bash
npm test -- theme/ThemeEngine.test.tsx
```

## File Structure

```
theme/
├── ThemeEngine.tsx       # Main theme provider and context
├── types.ts              # TypeScript type definitions
├── tokens.ts             # Design tokens (colors, spacing, etc.)
├── theme.css             # CSS custom properties and utilities
├── index.ts              # Public exports
└── README.md             # This file

utils/
├── animation.ts          # Animation utilities and helpers
└── index.ts              # Public exports

tailwind.config.js        # Tailwind CSS configuration
postcss.config.js         # PostCSS configuration
```

## Design Principles

1. **Extreme Minimalism**: Inspired by Jobs-era Apple design
2. **Futuristic Tech**: Neural networks, particles, holographic effects
3. **AI-Native**: Visualizes AI thinking processes
4. **Smooth & Responsive**: 60 FPS animations, instant feedback
5. **Unique & Bold**: Distinctive visual language

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Performance

- GPU-accelerated animations
- Automatic performance detection and degradation
- Reduced motion support
- Optimized for 60 FPS

## Accessibility

- WCAG 2.1 AA compliant color contrast
- Respects `prefers-reduced-motion`
- Keyboard navigation support
- Screen reader compatible
