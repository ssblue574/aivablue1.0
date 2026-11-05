# FuturisticModal Component

A unified modal component with glassmorphic effects, holographic borders, and smooth animations. This component provides a consistent modal experience across the AIVA platform with futuristic visual effects.

## Features

- **Glassmorphic Background**: Semi-transparent background with backdrop blur effect
- **Holographic Border**: Animated gradient border that rotates through colors
- **Edge Glow**: Pulsing glow effect around the modal edges
- **Deep Shadows**: Multi-layered shadows for depth perception
- **Smooth Animations**: Scale and opacity transitions for open/close
- **Keyboard Support**: ESC key to close
- **Accessibility**: Proper ARIA attributes and focus management
- **Body Scroll Lock**: Prevents background scrolling when modal is open
- **Theme Support**: Adapts to dark and light themes
- **Flexible Sizing**: Multiple max-width options

## Usage

### Basic Modal

```tsx
import { FuturisticModal } from './components/FuturisticModal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <FuturisticModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome"
        subtitle="This is a futuristic modal"
      >
        <div className="p-6">
          <p>Your content goes here</p>
        </div>
      </FuturisticModal>
    </>
  );
}
```

### Form Modal

```tsx
<FuturisticModal
  isOpen={isOpen}
  onClose={onClose}
  title="Contact Form"
  maxWidth="md"
>
  <form className="p-6 space-y-4">
    <input type="email" placeholder="Email" />
    <textarea placeholder="Message" />
    <button type="submit">Send</button>
  </form>
</FuturisticModal>
```

### Confirmation Modal

```tsx
<FuturisticModal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Action"
  subtitle="This cannot be undone"
  maxWidth="sm"
  closeOnBackdropClick={false}
>
  <div className="p-6 space-y-4">
    <p>Are you sure you want to proceed?</p>
    <div className="flex gap-3">
      <button onClick={onClose}>Cancel</button>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  </div>
</FuturisticModal>
```

### Minimal Modal (No Header)

```tsx
<FuturisticModal
  isOpen={isOpen}
  onClose={onClose}
  showCloseButton={false}
>
  <div className="p-8 text-center">
    <h3>Success!</h3>
    <p>Your action was completed.</p>
    <button onClick={onClose}>Continue</button>
  </div>
</FuturisticModal>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Controls modal visibility |
| `onClose` | `() => void` | required | Callback when modal should close |
| `children` | `React.ReactNode` | required | Modal content |
| `title` | `string` | `undefined` | Modal title (shown in header) |
| `subtitle` | `string` | `undefined` | Modal subtitle (shown below title) |
| `maxWidth` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '4xl' \| '7xl'` | `'lg'` | Maximum width of modal |
| `showCloseButton` | `boolean` | `true` | Show/hide close button in header |
| `closeOnBackdropClick` | `boolean` | `true` | Allow closing by clicking backdrop |
| `className` | `string` | `''` | Additional CSS classes for modal container |

## Max Width Options

- `sm`: 384px (24rem)
- `md`: 448px (28rem)
- `lg`: 512px (32rem) - Default
- `xl`: 576px (36rem)
- `2xl`: 672px (42rem)
- `4xl`: 896px (56rem)
- `7xl`: 1280px (80rem)

## Visual Effects

### Glassmorphic Background
The modal uses a semi-transparent background with backdrop blur for a modern glassmorphic effect:
- Dark theme: White overlay with 5-10% opacity
- Light theme: White overlay with 90-95% opacity
- Backdrop blur: 40px with 180% saturation

### Holographic Border
An animated gradient border that rotates through three color positions:
- Cyan → Magenta → Purple (dark theme)
- Blue → Pink → Purple (light theme)
- Animation duration: 4 seconds
- Smooth linear rotation

### Edge Glow
A pulsing radial gradient glow at the top edge:
- Cyan glow in dark theme
- Blue glow in light theme
- Pulse animation: 3 seconds
- Blur: 12px

### Deep Shadows
Multi-layered shadows for depth:
- Primary shadow: 16px blur, 64px spread
- Glow shadow: 40px spread with theme color
- Inset highlight: Top edge highlight

## Animations

### Open Animation
- Scale: 0.95 → 1.0
- Opacity: 0 → 1
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

### Close Animation
- Scale: 1.0 → 0.95
- Opacity: 1 → 0
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

## Accessibility

- **ARIA Attributes**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- **Keyboard Navigation**: ESC key closes modal
- **Focus Management**: Traps focus within modal when open
- **Body Scroll Lock**: Prevents background scrolling
- **Screen Reader Support**: Proper labeling and structure

## Theme Support

The component automatically adapts to the current theme:

### Dark Theme
- Background: White overlay (5-10% opacity)
- Border: White (18% opacity)
- Text: White
- Glow: Cyan (#00FFC6)
- Shadows: Deep black with cyan accent

### Light Theme
- Background: White overlay (90-95% opacity)
- Border: Black (10% opacity)
- Text: Black
- Glow: Blue (#0071E3)
- Shadows: Soft black with blue accent

## Best Practices

1. **Content Padding**: Add padding to your content (e.g., `p-6`)
2. **Max Height**: For scrollable content, use `max-h-[70vh] overflow-y-auto`
3. **Button Placement**: Place action buttons at the bottom with consistent spacing
4. **Title Length**: Keep titles concise (1-5 words)
5. **Subtitle Usage**: Use subtitles for additional context, not instructions
6. **Close Behavior**: Use `closeOnBackdropClick={false}` for critical actions
7. **Size Selection**: Choose appropriate `maxWidth` based on content

## Examples

See `FuturisticModal.example.tsx` for complete working examples including:
- Basic modal
- Form modal with inputs
- Confirmation dialog
- Large content modal with scrolling
- Minimal modal without header

## Related Components

- `GlassmorphicCard`: For card-style glassmorphic effects
- `HolographicButton`: For consistent button styling in modals
- `DynamicInput`: For form inputs in modals
- `LoadingAnimation`: For loading states in modals

## Requirements Validation

This component satisfies requirement **6.5** from the design specification:

> WHEN 用户查看模态框 THEN 系统应当使用全息投影效果、深度阴影和边缘光晕

The component implements:
- ✅ Glassmorphic background with backdrop blur
- ✅ Holographic border with animated gradient
- ✅ Deep shadows (shadow-2xl + custom glow)
- ✅ Edge glow effect with pulse animation
- ✅ Open/close animations with scale and opacity
- ✅ Theme-aware styling
- ✅ Accessibility features
