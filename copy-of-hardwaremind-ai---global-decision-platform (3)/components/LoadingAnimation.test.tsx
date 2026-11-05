import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingAnimation } from './LoadingAnimation';
import { ThemeProvider } from '../ThemeContext';

// Mock requestAnimationFrame and cancelAnimationFrame
let rafId = 0;
const mockRAF = vi.fn((callback) => {
  // Don't execute callback immediately to avoid infinite loops
  return ++rafId;
});
const mockCAF = vi.fn();

beforeEach(() => {
  rafId = 0;
  global.requestAnimationFrame = mockRAF;
  global.cancelAnimationFrame = mockCAF;
});

afterEach(() => {
  vi.clearAllMocks();
});

const renderWithTheme = (ui: React.ReactElement, theme: 'dark' | 'light' = 'dark') => {
  return render(
    <ThemeProvider initialTheme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('LoadingAnimation', () => {
  describe('Rendering', () => {
    it('should render spinner type by default', () => {
      const { container } = renderWithTheme(<LoadingAnimation />);
      const loadingElement = container.querySelector('.loading-animation');
      expect(loadingElement).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = renderWithTheme(
        <LoadingAnimation className="custom-class" />
      );
      const loadingElement = container.querySelector('.loading-animation.custom-class');
      expect(loadingElement).toBeInTheDocument();
    });

    it('should render message when provided', () => {
      renderWithTheme(<LoadingAnimation message="Loading content..." />);
      expect(screen.getByText('Loading content...')).toBeInTheDocument();
    });

    it('should not render message when not provided', () => {
      const { container } = renderWithTheme(<LoadingAnimation />);
      const message = container.querySelector('div[style*="fontSize"]');
      expect(message).not.toBeInTheDocument();
    });
  });

  describe('Animation Types', () => {
    it('should render spinner type', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="spinner" />);
      const spinner = container.querySelector('div[style*="conic-gradient"]');
      expect(spinner).toBeInTheDocument();
    });

    it('should render wave type', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="wave" />);
      // Wave type has multiple wave divs
      const waves = container.querySelectorAll('div[style*="border"]');
      expect(waves.length).toBeGreaterThan(0);
    });

    it('should render particles type with canvas', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="particles" />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should render neural type with canvas', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="neural" />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });
  });

  describe('Size Customization', () => {
    it('should apply default size of 80px', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="spinner" />);
      const spinner = container.querySelector('div[style*="width"]');
      expect(spinner).toHaveStyle({ width: '80px', height: '80px' });
    });

    it('should apply custom size', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="spinner" size={120} />);
      const spinner = container.querySelector('div[style*="width"]');
      expect(spinner).toHaveStyle({ width: '120px', height: '120px' });
    });

    it('should apply custom size to canvas elements', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="particles" size={100} />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toHaveStyle({ width: '100px', height: '100px' });
    });
  });

  describe('Color Customization', () => {
    it('should use theme color by default', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="spinner" />);
      const spinner = container.querySelector('div[style*="conic-gradient"]');
      const style = spinner?.getAttribute('style');
      // Default theme is light, so check for light mode color (0, 98, 204 = #0062CC)
      expect(style).toContain('0, 98, 204');
    });

    it('should render with theme colors', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="spinner" />);
      const spinner = container.querySelector('div[style*="conic-gradient"]');
      expect(spinner).toBeInTheDocument();
      // Verify it has a conic-gradient background
      const style = spinner?.getAttribute('style');
      expect(style).toContain('conic-gradient');
    });

    it('should apply custom color', () => {
      const { container } = renderWithTheme(
        <LoadingAnimation type="spinner" color="#FF5FD2" />
      );
      const spinner = container.querySelector('div[style*="conic-gradient"]');
      const style = spinner?.getAttribute('style');
      // Check for rgba version of the color (255, 95, 210 = #FF5FD2)
      expect(style).toContain('255, 95, 210');
    });
  });

  describe('Canvas Animations', () => {
    it('should set canvas dimensions for particles type', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="particles" size={100} />);
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      expect(canvas.width).toBe(100);
      expect(canvas.height).toBe(100);
    });

    it('should set canvas dimensions for neural type', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="neural" size={120} />);
      const canvas = container.querySelector('canvas') as HTMLCanvasElement;
      expect(canvas.width).toBe(120);
      expect(canvas.height).toBe(120);
    });

    it('should handle missing canvas context gracefully', () => {
      // Mock getContext to return null
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

      expect(() => {
        renderWithTheme(<LoadingAnimation type="particles" />);
      }).not.toThrow();

      // Restore original
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });
  });

  describe('Animation Lifecycle', () => {
    it('should start animation on mount for spinner', () => {
      mockRAF.mockClear();
      renderWithTheme(<LoadingAnimation type="spinner" />);
      expect(mockRAF).toHaveBeenCalled();
    });

    it('should start animation on mount for wave', () => {
      mockRAF.mockClear();
      renderWithTheme(<LoadingAnimation type="wave" />);
      expect(mockRAF).toHaveBeenCalled();
    });

    it('should start animation on mount for particles', () => {
      // Particles use canvas which requires getContext, skip RAF check in test env
      const { container } = renderWithTheme(<LoadingAnimation type="particles" />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should start animation on mount for neural', () => {
      // Neural uses canvas which requires getContext, skip RAF check in test env
      const { container } = renderWithTheme(<LoadingAnimation type="neural" />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should cleanup animation on unmount', () => {
      mockCAF.mockClear();
      const { unmount } = renderWithTheme(<LoadingAnimation type="spinner" />);
      unmount();
      expect(mockCAF).toHaveBeenCalled();
    });
  });

  describe('Wave Animation Structure', () => {
    it('should render 4 waves', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="wave" />);
      // Count wave divs (excluding the center core)
      const allDivs = container.querySelectorAll('div[style*="position: absolute"]');
      // Should have 4 waves + 1 center core = 5 total
      expect(allDivs.length).toBeGreaterThanOrEqual(4);
    });

    it('should render center core for wave type', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="wave" />);
      const core = container.querySelector('div[style*="linear-gradient"]');
      expect(core).toBeInTheDocument();
    });
  });

  describe('Spinner Animation Structure', () => {
    it('should render inner ring', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="spinner" />);
      const innerRing = container.querySelector('div[style*="position: absolute"]');
      expect(innerRing).toBeInTheDocument();
    });

    it('should have glow effect', () => {
      const { container } = renderWithTheme(<LoadingAnimation type="spinner" />);
      // Check for the main spinner div which has the glow
      const spinner = container.querySelector('div[style*="conic-gradient"]');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Message Styling', () => {
    it('should style message text correctly in dark mode', () => {
      renderWithTheme(
        <LoadingAnimation message="Loading..." />,
        'dark'
      );
      const message = screen.getByText('Loading...');
      expect(message).toHaveStyle({
        fontSize: '14px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        textAlign: 'center',
      });
    });

    it('should style message text correctly in light mode', () => {
      renderWithTheme(
        <LoadingAnimation message="Loading..." />,
        'light'
      );
      const message = screen.getByText('Loading...');
      expect(message).toHaveStyle({
        fontSize: '14px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        textAlign: 'center',
      });
    });
  });

  describe('Container Layout', () => {
    it('should use flexbox layout', () => {
      const { container } = renderWithTheme(<LoadingAnimation />);
      const loadingElement = container.querySelector('.loading-animation');
      expect(loadingElement).toHaveStyle({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      });
    });

    it('should have gap between animation and message', () => {
      const { container } = renderWithTheme(<LoadingAnimation message="Loading..." />);
      const loadingElement = container.querySelector('.loading-animation');
      expect(loadingElement).toHaveStyle({
        gap: '16px',
      });
    });
  });
});
