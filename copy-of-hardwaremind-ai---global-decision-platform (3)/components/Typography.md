# Typography System

A comprehensive typography system with advanced text effects including gradients, glows, animated underlines, and animated numbers.

## Features

- **Responsive Typography Scale** - Fluid font sizes that adapt to screen size
- **Gradient Text** - Multiple gradient variants (cyan, magenta, purple, rainbow, gold)
- **Glowing Text** - Text with luminous shadow effects
- **Animated Underlines** - Hover effects with gradient and glow animations
- **Animated Numbers** - Smooth counting animations with easing
- **Code Display** - Monospace fonts with syntax highlighting support
- **Tabular Numbers** - Fixed-width numbers for data display
- **Accessibility** - Respects `prefers-reduced-motion`

## Components

### Typography

Main typography component with support for all text effects.

```tsx
import { Typography } from './components/Typography';

// Basic usage
<Typography variant="h1">Welcome to AIVA</Typography>

// With gradient
<Typography variant="h1" gradient="rainbow">
  Futuristic Design
</Typography>

// With glow effect
<Typography variant="h2" glow="cyan">
  AI Platform
</Typography>

// With animated underline
<Typography variant="h3" underline="gradient">
  Hover Me
</Typography>

// Combined effects
<Typography variant="h1" gradient="purple" underline="glow">
  Maximum Impact
</Typography>
```

#### Props

- `variant` - Typography scale: `display | h1 | h2 | h3 | h4 | h5 | h6 | body | bodyLarge | bodySmall | caption | code`
- `gradient` - Gradient variant: `cyan | magenta | purple | rainbow | gold | none`
- `glow` - Glow variant: `cyan | magenta | purple | blue | white | none`
- `underline` - Underline variant: `gradient | glow | expand | none`
- `as` - HTML element to render (overrides default)
- `className` - Additional CSS classes
- `children` - Content to display

### AnimatedNumber

Displays numbers with smooth counting animation.

```tsx
import { AnimatedNumber } from './components/Typography';

// Basic number
<AnimatedNumber value={1234} />

// With decimals
<AnimatedNumber value={98.5} decimals={1} />

// With prefix/suffix
<AnimatedNumber value={42000} prefix="$" suffix=" USD" />

// Custom duration
<AnimatedNumber value={100} duration={2000} />
```

#### Props

- `value` - Target number to display
- `decimals` - Number of decimal places (default: 0)
- `prefix` - Text before the number
- `suffix` - Text after the number
- `duration` - Animation duration in ms (default: 1000)
- `tabular` - Use tabular nums for fixed width (default: true)
- `className` - Additional CSS classes

### GradientText

Inline gradient text component.

```tsx
import { GradientText } from './components/Typography';

<p>
  This is <GradientText variant="cyan">gradient text</GradientText> inline.
</p>
```

### GlowText

Inline glowing text component.

```tsx
import { GlowText } from './components/Typography';

<p>
  This is <GlowText variant="magenta">glowing text</GlowText> inline.
</p>
```

### CodeBlock

Code display with syntax highlighting support.

```tsx
import { CodeBlock } from './components/Typography';

<CodeBlock
  language="typescript"
  code={`const x: number = 10;`}
/>

// With line numbers
<CodeBlock
  language="javascript"
  showLineNumbers
  code={`function hello() {
  console.log("Hello");
}`}
/>
```

#### Props

- `code` - Code string to display
- `language` - Programming language (default: 'typescript')
- `showLineNumbers` - Display line numbers (default: false)
- `className` - Additional CSS classes

## Utility Functions

### Typography Utilities

```tsx
import {
  gradientText,
  glowText,
  animatedUnderline,
  typographyScale,
  typographyPresets,
} from './utils/typography';

// Use as className
<h1 className={gradientText.rainbow}>Title</h1>
<p className={glowText.cyan}>Glowing text</p>
<a className={animatedUnderline.gradient}>Link</a>

// Typography scale
<h1 className={typographyScale.h1}>Heading</h1>

// Presets
<h1 className={typographyPresets.heroTitle}>Hero</h1>
```

### Number Animation

```tsx
import { animateNumber, easingFunctions } from './utils/typography';

const element = document.getElementById('counter');
animateNumber(element, 0, 100, 1000, {
  decimals: 2,
  prefix: '$',
  suffix: ' USD',
  easing: easingFunctions.easeOutCubic,
});
```

## Hooks

### useAnimatedNumber

React hook for animated numbers.

```tsx
import { useAnimatedNumber } from './hooks/useAnimatedNumber';

function Counter() {
  const { formattedValue, start, reset } = useAnimatedNumber(0, 100, {
    duration: 2000,
    decimals: 1,
    suffix: '%',
    easing: 'elastic',
  });

  return (
    <div>
      <div>{formattedValue}</div>
      <button onClick={start}>Start</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## CSS Classes

### Global Typography Styles

The system includes global CSS styles for standard HTML elements:

- **Headings** (`h1-h6`) - Optimized font sizes, weights, and letter spacing
- **Paragraphs** (`p`) - Comfortable line height and spacing
- **Emphasis** (`strong`, `em`) - Glowing effects in dark mode
- **Code** (`code`, `pre`) - Monospace fonts with syntax highlighting
- **Links** (`a`) - Animated underlines on hover

### Utility Classes

```css
/* Tabular numbers */
.tabular-nums

/* Gradient text */
.gradient-text
.gradient-text-rainbow

/* Glowing text */
.glow-text-cyan
.glow-text-pink
.glow-text-blue

/* Animated underline */
.underline-gradient
```

## Design Tokens

### Font Families

- **Sans-serif**: SF Pro Display, SF Pro Text, Helvetica Neue, Arial
- **Monospace**: SF Mono, Monaco, Inconsolata, Fira Code, Source Code Pro

### Typography Scale

- **Display**: 4rem - 6rem (64px - 96px)
- **H1**: 2.5rem - 4rem (40px - 64px)
- **H2**: 2rem - 3rem (32px - 48px)
- **H3**: 1.5rem - 2.25rem (24px - 36px)
- **H4**: 1.25rem - 1.75rem (20px - 28px)
- **H5**: 1.125rem - 1.5rem (18px - 24px)
- **H6**: 1rem - 1.25rem (16px - 20px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)
- **Caption**: 0.75rem (12px)

### Letter Spacing

- **Headings**: -0.022em to -0.03em (tight)
- **Body**: -0.003em (normal)
- **Captions**: 0.05em (wide)

### Line Height

- **Headings**: 1.2 (tight)
- **Body**: 1.7 (relaxed)
- **Code**: 1.5 (comfortable)

## Accessibility

### Reduced Motion

The system respects `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

### Color Contrast

All text colors meet WCAG 2.1 AA standards:

- **Dark mode**: Light text on dark backgrounds
- **Light mode**: Dark text on light backgrounds
- **Emphasis**: High contrast with glow effects

### Semantic HTML

Use appropriate HTML elements:

```tsx
// Good
<Typography variant="h1" as="h1">Title</Typography>

// Avoid
<Typography variant="h1" as="div">Title</Typography>
```

## Best Practices

### 1. Use Semantic Variants

Match typography variants to content hierarchy:

```tsx
<Typography variant="h1">Page Title</Typography>
<Typography variant="h2">Section Header</Typography>
<Typography variant="body">Content</Typography>
```

### 2. Limit Gradient Usage

Use gradients sparingly for maximum impact:

```tsx
// Good - Hero title
<Typography variant="display" gradient="rainbow">
  Welcome to AIVA
</Typography>

// Avoid - Every heading
<Typography variant="h3" gradient="rainbow">Regular Section</Typography>
```

### 3. Combine Effects Thoughtfully

Don't overuse multiple effects:

```tsx
// Good - Subtle combination
<Typography variant="h2" glow="cyan">
  Section Title
</Typography>

// Avoid - Too many effects
<Typography variant="h2" gradient="rainbow" glow="cyan" underline="glow">
  Overwhelming
</Typography>
```

### 4. Use Tabular Numbers for Data

Enable tabular nums for aligned number columns:

```tsx
<AnimatedNumber value={1234} tabular />
<AnimatedNumber value={56} tabular />
<AnimatedNumber value={7890} tabular />
```

### 5. Optimize Animation Performance

Use appropriate durations:

```tsx
// Quick feedback
<AnimatedNumber value={100} duration={500} />

// Dramatic reveal
<AnimatedNumber value={1000000} duration={2000} />
```

## Examples

See `Typography.example.tsx` for comprehensive usage examples including:

- Heading hierarchy
- Body text variants
- Gradient effects
- Glow effects
- Animated underlines
- Animated numbers
- Code display
- Real-world usage patterns

## Testing

The typography system includes comprehensive tests:

- Component rendering
- Effect application
- Number animation
- Property tests for requirements 9.1-9.5
- Accessibility compliance

Run tests:

```bash
npm test Typography.test.tsx
```

## Browser Support

- **Modern browsers**: Full support
- **Safari**: Requires `-webkit-` prefixes (included)
- **Firefox**: Full support
- **Chrome/Edge**: Full support
- **Mobile**: Optimized for touch devices
