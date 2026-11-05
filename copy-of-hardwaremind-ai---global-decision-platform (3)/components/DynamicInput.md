# DynamicInput Component

A futuristic input component with floating label animation, focus glow effects, particle effects, and gradient underline.

## Features

- **Floating Label Animation**: Label smoothly transitions to the top when focused or has value
- **Focus Glow Effect**: Customizable glow effect when the input is focused
- **Particle Effects**: Optional particle animation on typing (automatically generated)
- **Gradient Underline**: Animated gradient underline that expands on focus
- **Character Count**: Optional character counter with visual feedback
- **Icon Support**: Optional icon on the left side
- **Error States**: Built-in error message display with visual feedback
- **Theme Aware**: Automatically adapts to dark/light theme
- **Accessibility**: Full ARIA support and keyboard navigation

## Usage

```tsx
import { DynamicInput } from './components/DynamicInput';

function MyForm() {
  const [email, setEmail] = useState('');
  
  return (
    <DynamicInput
      label="Email Address"
      type="email"
      value={email}
      onChange={setEmail}
      required
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Label text for the input |
| `placeholder` | `string` | - | Placeholder text (shown when floatingLabel is false) |
| `type` | `string` | `'text'` | HTML input type |
| `value` | `string` | **required** | Current input value |
| `onChange` | `(value: string) => void` | **required** | Callback when value changes |
| `glowOnFocus` | `boolean` | `true` | Enable glow effect on focus |
| `floatingLabel` | `boolean` | `true` | Enable floating label animation |
| `icon` | `React.ReactNode` | - | Icon to display on the left |
| `maxLength` | `number` | - | Maximum character length |
| `showCharCount` | `boolean` | `false` | Show character counter |
| `disabled` | `boolean` | `false` | Disable the input |
| `className` | `string` | `''` | Additional CSS classes |
| `id` | `string` | - | HTML id attribute |
| `name` | `string` | - | HTML name attribute |
| `required` | `boolean` | `false` | Mark as required field |
| `error` | `string` | - | Error message to display |

## Examples

### Basic Input with Floating Label

```tsx
<DynamicInput
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  required
/>
```

### Input with Icon

```tsx
<DynamicInput
  label="Password"
  type="password"
  value={password}
  onChange={setPassword}
  icon={<LockIcon />}
/>
```

### Input with Character Count

```tsx
<DynamicInput
  label="Username"
  value={username}
  onChange={setUsername}
  maxLength={20}
  showCharCount
/>
```

### Input with Error State

```tsx
<DynamicInput
  label="Email"
  value={email}
  onChange={setEmail}
  error="Please enter a valid email address"
/>
```

### Search Input without Floating Label

```tsx
<DynamicInput
  placeholder="Search..."
  value={search}
  onChange={setSearch}
  floatingLabel={false}
  icon={<SearchIcon />}
/>
```

## Visual Effects

### Floating Label Animation
- Label starts in the center of the input
- On focus or when value exists, label smoothly transitions to the top
- Font size reduces and weight increases for better readability
- Color changes to primary color on focus

### Focus Glow Effect
- Customizable glow effect using box-shadow
- Animates smoothly on focus/blur
- Theme-aware colors (cyan for dark, blue for light)
- Can be disabled with `glowOnFocus={false}`

### Particle Effects
- Particles automatically generate on typing
- Float upward with random horizontal drift
- Fade out over ~1 second
- Uses requestAnimationFrame for smooth 60fps animation
- Automatically cleaned up when component unmounts

### Gradient Underline
- 2px gradient line at the bottom
- Scales from center on focus
- Uses primary and secondary theme colors
- Smooth cubic-bezier animation

### Character Count Animation
- Shows current/max character count
- Color changes to warning color at 90% capacity
- Positioned on the right side of input
- Smooth color transitions

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- `aria-invalid` for error states
- `aria-describedby` linking to error messages
- Required field indicator in label
- Proper focus management

## Theme Integration

The component automatically adapts to the current theme:

**Dark Theme:**
- Neon cyan primary color (#00FFC6)
- Blue secondary color (#6AA8FF)
- Semi-transparent white backgrounds
- Bright glow effects

**Light Theme:**
- Apple blue primary color (#0071E3)
- Blue secondary color (#0077ED)
- White backgrounds with subtle shadows
- Softer glow effects

## Performance

- Particle animation uses requestAnimationFrame for optimal performance
- Particles are automatically cleaned up after animation
- Minimal re-renders with proper state management
- GPU-accelerated transforms for smooth animations

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

Graceful degradation for older browsers:
- backdrop-filter falls back to solid background
- Particle effects are optional and don't affect core functionality

## Validation: Requirements 6.3

This component validates the following acceptance criteria from the requirements document:

**需求 6.3**: WHEN 用户查看输入框 THEN 系统应当使用浮动标签、动态边框和聚焦光效

✅ Floating label animation implemented
✅ Dynamic border with gradient underline
✅ Focus glow effect with customizable intensity
✅ Particle effects on typing (optional)
✅ Character count animation
✅ Theme-aware styling
✅ Full accessibility support
