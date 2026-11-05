# HolographicButton Component

A futuristic button component with holographic effects, dynamic glow, 3D press animations, and ripple feedback.

## Features

- **Multiple Variants**: Primary, Secondary, and Ghost styles
- **Flexible Sizing**: Small, Medium, and Large sizes
- **Dynamic Glow**: Adjustable glow intensity (0-1)
- **3D Press Effect**: Realistic button press with transform animations
- **Ripple Animation**: Optional ripple effect on click
- **Edge Highlight**: Breathing animation on top edge
- **Smooth Transitions**: Cubic-bezier easing for natural feel
- **Theme Support**: Adapts to dark/light themes
- **Accessibility**: Proper disabled states and ARIA attributes

## Usage

```tsx
import { HolographicButton } from './components/HolographicButton';

// Basic usage
<HolographicButton onClick={() => console.log('Clicked!')}>
  Click Me
</HolographicButton>

// With variants
<HolographicButton variant="primary">Primary</HolographicButton>
<HolographicButton variant="secondary">Secondary</HolographicButton>
<HolographicButton variant="ghost">Ghost</HolographicButton>

// Different sizes
<HolographicButton size="sm">Small</HolographicButton>
<HolographicButton size="md">Medium</HolographicButton>
<HolographicButton size="lg">Large</HolographicButton>

// Custom glow intensity
<HolographicButton glowIntensity={0.8}>High Glow</HolographicButton>

// Without ripple effect
<HolographicButton rippleEffect={false}>No Ripple</HolographicButton>

// Disabled state
<HolographicButton disabled>Disabled</HolographicButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `glowIntensity` | `number` | `0.5` | Glow effect intensity (0-1) |
| `rippleEffect` | `boolean` | `true` | Enable ripple animation on click |
| `onClick` | `() => void` | - | Click handler |
| `disabled` | `boolean` | `false` | Disable button interactions |
| `children` | `React.ReactNode` | - | Button content |
| `className` | `string` | `''` | Additional CSS classes |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Button type attribute |

## Visual Effects

### Variants

- **Primary**: Cyan gradient with cyan glow (dark) / Blue gradient (light)
- **Secondary**: Magenta/purple gradient with magenta glow (dark) / Pink gradient (light)
- **Ghost**: Transparent with subtle border and minimal glow

### Interactions

1. **Hover**: Increases glow intensity and slightly lifts the button
2. **Press**: Applies 3D press effect with scale and translateY
3. **Click**: Triggers ripple animation expanding from click point
4. **Breathing**: Subtle edge highlight animation when idle

### Animations

- **Transition Duration**: 300ms with cubic-bezier easing
- **Ripple Duration**: 600ms expand and fade
- **Breathing**: 3s infinite ease-in-out

## Accessibility

- Proper `disabled` attribute and styling
- `aria-disabled` for screen readers
- Keyboard navigation support
- Reduced opacity for disabled state
- `not-allowed` cursor for disabled buttons

## Theme Integration

The component automatically adapts to the current theme (dark/light) using the `useTheme` hook from `ThemeContext`. Colors, gradients, and glow effects adjust accordingly.

## Property-Based Tests

The component includes comprehensive property-based tests that validate:

- **Property 2**: Button visual specification (rounded shape, hover glow, 3D press)
- **Property 5**: Instant visual feedback within 16ms
- Hover effect smoothness
- Size configurations
- Disabled state behavior
- Glow intensity effects
- Ripple animation
- Edge highlight presence
- Content rendering
- Variant color differences

## Example

See `HolographicButton.example.tsx` for a complete interactive demo showcasing all features and combinations.

## Requirements Validation

This component validates the following requirements from the futuristic UI redesign:

- **Requirement 6.2**: Buttons use capsule shape, inner glow, and 3D press effect
- **Requirement 1.3**: Provides instant visual feedback with light effects, ripples, and particle diffusion
- **Requirement 4.1**: Visual feedback within 16ms (one frame at 60fps)
