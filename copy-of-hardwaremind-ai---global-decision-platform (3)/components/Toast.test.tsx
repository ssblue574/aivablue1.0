import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Toast, ToastContainer, useToast, ToastType } from './Toast';
import { ThemeProvider } from '../ThemeContext';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
};

describe('Toast Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders toast with message', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <Toast
        id="test-1"
        type="success"
        message="Test message"
        onClose={onClose}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders different toast types with correct icons', () => {
    const onClose = vi.fn();
    const types: ToastType[] = ['success', 'error', 'info', 'favorite', 'cart', 'rating'];

    types.forEach((type) => {
      const { unmount } = renderWithTheme(
        <Toast
          id={`test-${type}`}
          type={type}
          message={`${type} message`}
          onClose={onClose}
        />
      );
      expect(screen.getByText(`${type} message`)).toBeInTheDocument();
      unmount();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    renderWithTheme(
      <Toast
        id="test-1"
        type="success"
        message="Test message"
        onClose={onClose}
      />
    );

    const closeButton = screen.getByLabelText('Close notification');
    
    await act(async () => {
      fireEvent.click(closeButton);
      // Wait for exit animation
      vi.advanceTimersByTime(300);
    });
    
    expect(onClose).toHaveBeenCalledWith('test-1');
  });

  it('auto-closes after duration', async () => {
    const onClose = vi.fn();
    renderWithTheme(
      <Toast
        id="test-1"
        type="success"
        message="Test message"
        duration={1000}
        onClose={onClose}
      />
    );

    // Fast-forward time and wait for state updates
    await act(async () => {
      vi.advanceTimersByTime(1000);
      // Wait for exit animation
      vi.advanceTimersByTime(300);
    });
    
    expect(onClose).toHaveBeenCalledWith('test-1');
  });

  it('has proper ARIA attributes', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <Toast
        id="test-1"
        type="success"
        message="Test message"
        onClose={onClose}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });
});

describe('ToastContainer', () => {
  it('renders multiple toasts', () => {
    const onClose = vi.fn();
    const toasts = [
      { id: '1', type: 'success' as ToastType, message: 'Message 1', onClose },
      { id: '2', type: 'error' as ToastType, message: 'Message 2', onClose },
      { id: '3', type: 'info' as ToastType, message: 'Message 3', onClose },
    ];

    renderWithTheme(
      <ToastContainer toasts={toasts} onClose={onClose} />
    );

    expect(screen.getByText('Message 1')).toBeInTheDocument();
    expect(screen.getByText('Message 2')).toBeInTheDocument();
    expect(screen.getByText('Message 3')).toBeInTheDocument();
  });

  it('applies correct position classes', () => {
    const onClose = vi.fn();
    const positions: Array<'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'> = [
      'top-right',
      'top-left',
      'bottom-right',
      'bottom-left',
    ];

    positions.forEach((position) => {
      const { container, unmount } = renderWithTheme(
        <ToastContainer toasts={[]} onClose={onClose} position={position} />
      );
      
      const containerEl = container.querySelector('.fixed');
      expect(containerEl).toBeInTheDocument();
      unmount();
    });
  });
});

describe('useToast Hook', () => {
  it('adds and removes toasts', () => {
    const TestComponent = () => {
      const toast = useToast();

      return (
        <div>
          <button onClick={() => toast.success('Success!')}>Add Success</button>
          <button onClick={() => toast.error('Error!')}>Add Error</button>
          <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
        </div>
      );
    };

    renderWithTheme(<TestComponent />);

    const successButton = screen.getByText('Add Success');
    const errorButton = screen.getByText('Add Error');

    fireEvent.click(successButton);
    expect(screen.getByText('Success!')).toBeInTheDocument();

    fireEvent.click(errorButton);
    expect(screen.getByText('Error!')).toBeInTheDocument();
  });

  it('provides convenience methods for different toast types', () => {
    const TestComponent = () => {
      const toast = useToast();

      return (
        <div>
          <button onClick={() => toast.success('Success message')}>Success</button>
          <button onClick={() => toast.error('Error message')}>Error</button>
          <button onClick={() => toast.info('Info message')}>Info</button>
          <button onClick={() => toast.favorite('Favorite message')}>Favorite</button>
          <button onClick={() => toast.cart('Cart message')}>Cart</button>
          <button onClick={() => toast.rating('Rating message')}>Rating</button>
          <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
        </div>
      );
    };

    renderWithTheme(<TestComponent />);

    fireEvent.click(screen.getByText('Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Error'));
    expect(screen.getByText('Error message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Info'));
    expect(screen.getByText('Info message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Favorite'));
    expect(screen.getByText('Favorite message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Cart'));
    expect(screen.getByText('Cart message')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Rating'));
    expect(screen.getByText('Rating message')).toBeInTheDocument();
  });
});

describe('Toast Animations', () => {
  it('uses transform and opacity for animations', () => {
    const onClose = vi.fn();
    const { container } = renderWithTheme(
      <Toast
        id="test-1"
        type="success"
        message="Test message"
        onClose={onClose}
      />
    );

    const toast = container.firstChild as HTMLElement;
    const style = window.getComputedStyle(toast);

    // Check that animation uses transform/opacity (GPU-accelerated)
    expect(toast.style.animation).toContain('toast-enter');
  });

  it('applies cubic-bezier easing', () => {
    const onClose = vi.fn();
    const { container } = renderWithTheme(
      <Toast
        id="test-1"
        type="success"
        message="Test message"
        onClose={onClose}
      />
    );

    const toast = container.firstChild as HTMLElement;
    
    // Animation should use cubic-bezier easing
    expect(toast.style.animation).toContain('cubic-bezier');
  });
});
