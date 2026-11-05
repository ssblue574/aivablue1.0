# AIThinkingIndicator Component

A futuristic AI thinking indicator component that visualizes AI processing with three distinct animation styles: pulse, wave, and neural network.

## Features

- **Three Animation Styles**:
  - `pulse`: Pulsating light orb with breathing effect
  - `wave`: Ripple expansion effect emanating from center
  - `neural`: Neural network activation with nodes and connections
- **Customizable Size**: Adjustable indicator size
- **Optional Message**: Display status message below indicator
- **Theme-Aware**: Adapts colors based on light/dark theme
- **Performance Optimized**: Uses requestAnimationFrame for smooth 60fps animations
- **Canvas-Based Neural**: Neural style uses HTML5 Canvas for complex animations

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `boolean` | required | Whether the indicator is active/visible |
| `message` | `string` | `undefined` | Optional message to display below indicator |
| `style` | `'pulse' \| 'wave' \| 'neural'` | `'pulse'` | Animation style |
| `size` | `number` | `60` | Size of the indicator in pixels |
| `className` | `string` | `''` | Additional CSS classes |

## Usage

### Basic Usage

```tsx
import { AIThinkingIndicator } from './components/AIThinkingIndicator';

function MyComponent() {
  const [isThinking, setIsThinking] = useState(false);

  return (
    <AIThinkingIndicator
      active={isThinking}
      message="AI is thinking..."
    />
  );
}
```

### Different Styles

```tsx
// Pulse style (default) - smooth breathing effect
<AIThinkingIndicator
  active={true}
  style="pulse"
  message="Processing..."
/>

// Wave style - ripple expansion
<AIThinkingIndicator
  active={true}
  style="wave"
  message="Analyzing..."
/>

// Neural style - network activation
<AIThinkingIndicator
  active={true}
  style="neural"
  message="Computing..."
/>
```

### Custom Size

```tsx
// Small indicator
<AIThinkingIndicator
  active={true}
  size={40}
/>

// Large indicator
<AIThinkingIndicator
  active={true}
  size={100}
  message="Deep analysis in progress..."
/>
```

### In Chat Interface

```tsx
function ChatMessage({ isAITyping }) {
  return (
    <div className="chat-container">
      {isAITyping && (
        <div className="ai-typing-indicator">
          <AIThinkingIndicator
            active={true}
            style="pulse"
            size={40}
          />
          <span>AI is typing...</span>
        </div>
      )}
    </div>
  );
}
```

### As Loading State

```tsx
function DataVisualization({ isLoading, data }) {
  if (isLoading) {
    return (
      <div className="loading-container">
        <AIThinkingIndicator
          active={true}
          style="neural"
          message="Generating insights from your data..."
          size={80}
        />
      </div>
    );
  }

  return <Chart data={data} />;
}
```

## Animation Styles

### Pulse
- **Visual**: Pulsating light orb with radial gradient
- **Effect**: Smooth breathing animation with scale and glow
- **Best For**: General AI thinking, chat typing indicators
- **Performance**: Lightweight, CSS-based

### Wave
- **Visual**: Concentric ripples expanding from center
- **Effect**: Multiple waves with fade-out effect
- **Best For**: Processing states, data transmission
- **Performance**: Lightweight, CSS-based

### Neural
- **Visual**: Network of nodes with connecting lines
- **Effect**: Pulsating nodes with animated connections
- **Best For**: Complex AI operations, data analysis
- **Performance**: Canvas-based, slightly heavier

## Styling

The component uses inline styles and adapts to the theme context. Colors are automatically adjusted based on light/dark mode:

- **Dark Mode**: Cyan (#00FFC6) and Blue (#6AA8FF) gradients
- **Light Mode**: Blue (#0071E3) and Blue (#0077ED) gradients

## Accessibility

- Component is hidden when `active={false}` (returns null)
- Message text is readable and properly styled
- Animations respect user preferences (consider adding prefers-reduced-motion support)

## Performance Considerations

- Uses `requestAnimationFrame` for smooth 60fps animations
- Automatically cleans up animation frames on unmount
- Canvas rendering is optimized for neural style
- Inactive indicators don't consume resources (component returns null)

## Browser Support

- Modern browsers with Canvas API support (for neural style)
- CSS animations and transforms (for pulse and wave styles)
- Fallback: All styles work in browsers supporting ES6+

## Examples

See `AIThinkingIndicator.example.tsx` for comprehensive examples including:
- All three animation styles
- Different sizes
- With and without messages
- Real-world use cases (chat, loading, processing)

## Design Rationale

This component visualizes AI thinking processes to:
1. Provide user feedback during AI operations
2. Reduce perceived wait time with engaging animations
3. Reinforce the AI-native aesthetic of the platform
4. Create a consistent visual language for AI interactions

The three styles offer flexibility for different contexts:
- **Pulse**: Quick, subtle feedback
- **Wave**: Medium-intensity processing indication
- **Neural**: High-intensity, complex operation visualization
