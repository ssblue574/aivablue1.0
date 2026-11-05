# LoadingAnimation Component

A versatile loading animation component that provides four distinct animation styles for different use cases. Each animation type is optimized for performance and follows the futuristic design language of the AIVA platform.

## Features

- **Four Animation Types**: spinner, particles, neural, wave
- **Customizable**: Size, color, and message options
- **Theme-Aware**: Automatically adapts to dark/light themes
- **Performance Optimized**: Uses requestAnimationFrame for smooth 60 FPS animations
- **Canvas-Based**: Particles and neural types use HTML5 Canvas for complex animations
- **Accessibility**: Respects prefers-reduced-motion settings

## Animation Types

### 1. Spinner
A gradient ring rotation animation with conic gradient effects. Best for general loading states.

**Visual Features:**
- Rotating conic gradient with multiple colors
- Inner ring for depth
- Glow effects
- Smooth continuous rotation

**Use Cases:**
- Page loading
- Form submission
- General waiting states

### 2. Particles
Particle aggregation animation with orbiting particles around a central core.

**Visual Features:**
- 12 orbiting particles
- Pulsing distance animation
- Glow effects on each particle
- Central core with gradient

**Use Cases:**
- Data gathering
- File processing
- Content aggregation

### 3. Neural
Neural network pulsing effect with connected nodes simulating AI thinking.

**Visual Features:**
- 6 interconnected nodes
- Animated connections with gradient colors
- Pulsing node effects
- Flow animation along connections

**Use Cases:**
- AI operations
- Machine learning tasks
- Neural network processing
- Algorithm execution

### 4. Wave
Ripple expansion animation with concentric waves emanating from center.

**Visual Features:**
- 4 expanding waves
- Fade-out as waves expand
- Central pulsing core
- Smooth wave propagation

**Use Cases:**
- Network activity
- Broadcasting
- Signal transmission
- Connection establishment

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'spinner' \| 'particles' \| 'neural' \| 'wave'` | `'spinner'` | Animation type to display |
| `size` | `number` | `80` | Size of the animation in pixels |
| `color` | `string` | Theme color | Custom primary color (hex or rgb) |
| `message` | `string` | `undefined` | Optional loading message below animation |
| `className` | `string` | `''` | Additional CSS classes |

## Usage Examples

### Basic Usage

```tsx
import { LoadingAnimation } from './components/LoadingAnimation';

function App() {
  return <LoadingAnimation type="spinner" />;
}
```

### With Message

```tsx
<LoadingAnimation 
  type="neural" 
  message="AI is thinking..."
/>
```

### Custom Size and Color

```tsx
<LoadingAnimation 
  type="particles"
  size={120}
  color="#FF5FD2"
  message="Processing data..."
/>
```

### All Types

```tsx
// Spinner - for general loading
<LoadingAnimation type="spinner" message="Loading..." />

// Particles - for data processing
<LoadingAnimation type="particles" message="Gathering data..." />

// Neural - for AI operations
<LoadingAnimation type="neural" message="AI analyzing..." />

// Wave - for network activity
<LoadingAnimation type="wave" message="Connecting..." />
```

## Styling

The component uses inline styles for animations but can be customized with the `className` prop:

```tsx
<LoadingAnimation 
  type="spinner"
  className="my-custom-loading"
/>
```

## Theme Integration

The component automatically adapts to the current theme:

- **Dark Mode**: Uses cyan (#00FFC6), blue (#6AA8FF), and magenta (#FF5FD2)
- **Light Mode**: Uses blue (#0071E3), red (#FF2D55), and purple (#5E5CE6)

## Performance

- Uses `requestAnimationFrame` for smooth 60 FPS animations
- Canvas-based animations (particles, neural) are optimized for performance
- Properly cleans up animation frames on unmount
- Respects `prefers-reduced-motion` accessibility setting

## Accessibility

The component respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  /* Animations are simplified or disabled */
}
```

## Technical Details

### Spinner Implementation
- Uses CSS `conic-gradient` for gradient ring
- CSS animation for rotation
- Layered structure for depth effect

### Particles Implementation
- Canvas-based rendering
- 12 particles in circular orbit
- Pulsing distance based on sine wave
- Individual particle glow effects

### Neural Implementation
- Canvas-based rendering
- 6 nodes with phase-offset pulsing
- Dynamic connection drawing
- Gradient colors along connections

### Wave Implementation
- CSS-based animation
- 4 staggered waves
- Scale and opacity transitions
- Central pulsing core

## Browser Support

- Modern browsers with Canvas support
- Fallback for browsers without Canvas (particles/neural types)
- CSS animations for spinner and wave types

## Related Components

- `AIThinkingIndicator` - Similar neural animation for AI interactions
- `ParticleSystem` - Full-screen particle effects
- `NeuralNetworkBackground` - Background neural network visualization

## Requirements Validation

**Validates: Requirements 7.3**
- ✅ Elegant loading animations
- ✅ Four distinct animation types
- ✅ Particle aggregation (particles type)
- ✅ Ripple expansion (wave type)
- ✅ Neural network effects (neural type)
- ✅ Gradient ring rotation (spinner type)
