# Interaction Feedback System

A comprehensive system for creating engaging visual feedback effects in response to user interactions.

## Features

- **Glow Effects** - Create dynamic glow effects on elements
- **Ripple Effects** - Material Design-inspired ripple animations
- **Particle Bursts** - Explosive particle animations for impactful interactions
- **3D Depth Effects** - Create depth and perspective on hover
- **Smooth Hover Effects** - Scale and glow effects for smooth transitions
- **Programmatic Control** - Trigger effects programmatically via hooks

## Installation

The interaction feedback system consists of two main parts:

1. **Utility Functions** (`utils/interactionFeedback.ts`) - Core effect implementations
2. **React Hook** (`hooks/useInteractionFeedback.ts`) - Easy integration with React components

## Usage

### Basic Usage with Hook

```tsx
import { useInteractionFeedback } from '../hooks/useInteractionFeedback';

function MyButton() {
  const feedback = useInteractionFeedback({
    enableRipple: true,
    enableGlow: true,
  });

  return (
    <button onClick={feedback.handleClick}>
      Click Me
    </button>
  );
}
```

### Ripple Effect

Creates a Material Design-inspired ripple effect that expands from the click position.

```tsx
const rippleButton = useInteractionFeedback({
  enableRipple: true,
  rippleConfig: {
    color: 'rgba(0, 255, 198, 0.4)',
    duration: 600,
    size: 200, // Optional: custom size
  },
});

<button onClick={rippleButton.handleClick}>
  Ripple Button
</button>
```

### Glow Effect

Creates a glowing effect around the element.

```tsx
const glowButton = useInteractionFeedback({
  enableGlow: true,
  glowConfig: {
    color: 'rgba(139, 92, 246, 0.6)',
    intensity: 20,
    duration: 300,
    spread: 40,
  },
});

<button onClick={glowButton.handleClick}>
  Glow Button
</button>
```

### Particle Burst

Creates an explosive particle effect radiating from the click position.

```tsx
const particleButton = useInteractionFeedback({
  enableParticles: true,
  particleConfig: {
    count: 12,
    colors: ['#00FFC6', '#FF5FD2', '#8B5CF6', '#6AA8FF'],
    duration: 800,
    spread: 100,
    size: 4,
  },
});

<button onClick={particleButton.handleClick}>
  Particle Burst
</button>
```

### 3D Depth Effect

Creates a 3D perspective effect on hover with rotation and translation.

```tsx
const depthCard = useInteractionFeedback({
  enable3D: true,
  depthConfig: {
    depth: 10,
    duration: 300,
    rotateX: 2,
    rotateY: -5,
    scale: 1.02,
  },
});

<div
  onMouseEnter={depthCard.handleMouseEnter}
  onMouseLeave={depthCard.handleMouseLeave}
>
  Hover for 3D Effect
</div>
```

### Smooth Hover Effect

Creates a smooth scale and glow effect on hover.

```tsx
const hoverCard = useInteractionFeedback({
  enable3D: false,
  hoverConfig: {
    scale: 1.05,
    glowColor: 'rgba(0, 255, 198, 0.3)',
    glowIntensity: 20,
    duration: 300,
  },
});

<div
  onMouseEnter={hoverCard.handleMouseEnter}
  onMouseLeave={hoverCard.handleMouseLeave}
>
  Hover for Smooth Effect
</div>
```

### Combined Effects

You can combine multiple effects for more impactful interactions:

```tsx
const combinedButton = useInteractionFeedback({
  enableRipple: true,
  enableGlow: true,
  enableParticles: true,
  rippleConfig: { color: 'rgba(255, 95, 210, 0.4)' },
  glowConfig: { color: 'rgba(255, 95, 210, 0.6)' },
  particleConfig: { count: 8, colors: ['#FF5FD2', '#8B5CF6'] },
});

<button onClick={combinedButton.handleClick}>
  All Effects
</button>
```

### Programmatic Triggers

You can trigger effects programmatically without user interaction:

```tsx
const feedback = useInteractionFeedback({
  enableGlow: true,
});

// Trigger glow on any element
const handleCustomAction = () => {
  const element = document.getElementById('my-element');
  if (element) {
    feedback.triggerGlow(element as HTMLElement);
  }
};

// Or trigger on the ref element
const handleAnotherAction = () => {
  feedback.triggerGlow(); // Uses elementRef.current
};
```

## API Reference

### `useInteractionFeedback(options)`

#### Options

```typescript
interface InteractionFeedbackOptions {
  enableGlow?: boolean;
  enableRipple?: boolean;
  enableParticles?: boolean;
  enable3D?: boolean;
  glowConfig?: GlowEffectConfig;
  rippleConfig?: RippleEffectConfig;
  particleConfig?: ParticleBurstConfig;
  depthConfig?: DepthEffectConfig;
  hoverConfig?: HoverEffectConfig;
}
```

#### Returns

```typescript
{
  // Event handlers
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
  handleMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
  handleMouseLeave: (event: React.MouseEvent<HTMLElement>) => void;
  
  // Programmatic triggers
  triggerGlow: (element?: HTMLElement) => void;
  triggerRipple: (element: HTMLElement, event: React.MouseEvent | MouseEvent) => void;
  triggerParticleBurst: (element: HTMLElement, event: React.MouseEvent | MouseEvent) => void;
  trigger3DDepth: (element?: HTMLElement) => void;
  reset3DDepth: (element?: HTMLElement) => void;
  
  // Element reference
  elementRef: React.MutableRefObject<HTMLElement | null>;
}
```

### Configuration Types

#### `GlowEffectConfig`

```typescript
interface GlowEffectConfig {
  color?: string;        // Default: 'rgba(0, 255, 198, 0.6)'
  intensity?: number;    // Default: 20
  duration?: number;     // Default: 300
  spread?: number;       // Default: 40
}
```

#### `RippleEffectConfig`

```typescript
interface RippleEffectConfig {
  color?: string;        // Default: 'rgba(0, 255, 198, 0.4)'
  duration?: number;     // Default: 600
  size?: number;         // Default: auto-calculated
}
```

#### `ParticleBurstConfig`

```typescript
interface ParticleBurstConfig {
  count?: number;        // Default: 12
  colors?: string[];     // Default: ['#00FFC6', '#FF5FD2', '#8B5CF6', '#6AA8FF']
  duration?: number;     // Default: 800
  spread?: number;       // Default: 100
  size?: number;         // Default: 4
}
```

#### `DepthEffectConfig`

```typescript
interface DepthEffectConfig {
  depth?: number;        // Default: 10
  duration?: number;     // Default: 300
  rotateX?: number;      // Default: 0
  rotateY?: number;      // Default: 0
  scale?: number;        // Default: 1.02
}
```

#### `HoverEffectConfig`

```typescript
interface HoverEffectConfig {
  scale?: number;        // Default: 1.05
  glowColor?: string;    // Default: 'rgba(0, 255, 198, 0.3)'
  glowIntensity?: number; // Default: 20
  duration?: number;     // Default: 300
}
```

## Accessibility

The interaction feedback system respects user preferences:

- **Reduced Motion**: All effects are automatically disabled when `prefers-reduced-motion: reduce` is set
- **Performance**: Effects are optimized for smooth 60 FPS animations
- **Non-blocking**: Effects don't interfere with normal interaction or keyboard navigation

## Performance Considerations

- Effects use CSS transforms and opacity for GPU acceleration
- Particle effects are limited in count to maintain performance
- Effects automatically clean up after completion
- Respects `prefers-reduced-motion` for accessibility

## Browser Support

- Modern browsers with CSS3 support
- Graceful degradation for older browsers
- GPU acceleration where available

## Examples

See `InteractionFeedback.example.tsx` for comprehensive examples of all effects.
