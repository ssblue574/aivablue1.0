# Toast Component

A futuristic notification system for displaying completion animations and user feedback.

## Features

- **Multiple Types**: Success, error, info, favorite, cart, and rating notifications
- **Smooth Animations**: Uses cubic-bezier easing for natural motion
- **Auto-dismiss**: Configurable duration with progress bar
- **Accessible**: ARIA labels and keyboard support
- **Themed**: Adapts to dark/light mode
- **Glow Effects**: Holographic borders and pulse animations

## Usage

### Basic Usage with Hook

```tsx
import { useToast, ToastContainer } from './components/Toast';

function MyComponent() {
  const toast = useToast();

  const handleAction = () => {
    toast.success('Action completed successfully!');
  };

  return (
    <>
      <button onClick={handleAction}>Do Something</button>
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </>
  );
}
```

### Toast Types

```tsx
// Success notification
toast.success('Product added to favorites!');

// Error notification
toast.error('Failed to process request');

// Info notification
toast.info('New features available');

// Favorite action
toast.favorite('Added to your favorites');

// Cart action
toast.cart('Added to cart');

// Rating action
toast.rating('Thank you for your rating!');
```

### Custom Duration

```tsx
// Show for 5 seconds instead of default 3
toast.success('Saved successfully', 5000);
```

### Toast Container Positions

```tsx
<ToastContainer 
  toasts={toast.toasts} 
  onClose={toast.removeToast}
  position="top-right" // or "top-left", "bottom-right", "bottom-left", "top-center", "bottom-center"
/>
```

## Integration Examples

### With Favorite Toggle

```tsx
const handleToggleFavorite = (product: Product) => {
  toggleFavorite(product);
  
  if (isFavorite(product)) {
    toast.favorite(`Removed ${product.name} from favorites`);
  } else {
    toast.favorite(`Added ${product.name} to favorites`);
  }
};
```

### With Form Submission

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await submitForm(data);
    toast.success('Form submitted successfully!');
  } catch (error) {
    toast.error('Failed to submit form. Please try again.');
  }
};
```

### With Purchase Action

```tsx
const handlePurchase = async (product: Product) => {
  try {
    await purchaseProduct(product);
    toast.cart(`${product.name} added to cart!`);
  } catch (error) {
    toast.error('Purchase failed. Please try again.');
  }
};
```

## Animation Details

The Toast component uses optimized animations:

- **Entry**: `cubic-bezier(0, 0, 0.2, 1)` - Deceleration curve
- **Exit**: `cubic-bezier(0.4, 0, 1, 1)` - Acceleration curve
- **Transform-based**: Uses `transform` and `opacity` for 60fps performance
- **GPU-accelerated**: Leverages hardware acceleration

## Accessibility

- ARIA live regions for screen readers
- Keyboard dismissible
- Focus management
- High contrast support

## Performance

- Minimal re-renders
- CSS animations (GPU-accelerated)
- Automatic cleanup
- No layout thrashing (uses transform/opacity only)
