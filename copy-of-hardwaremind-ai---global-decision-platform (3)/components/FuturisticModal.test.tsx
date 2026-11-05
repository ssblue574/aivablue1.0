import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FuturisticModal } from './FuturisticModal';
import { ThemeProvider } from '../ThemeContext';

// Helper to render with theme
const renderWithTheme = (ui: React.ReactElement, theme: 'dark' | 'light' = 'dark') => {
  return render(
    <ThemeProvider initialTheme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('FuturisticModal', () => {
  let originalBodyOverflow: string;

  beforeEach(() => {
    originalBodyOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    document.body.style.overflow = originalBodyOverflow;
  });

  it('should render when isOpen is true', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </FuturisticModal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render when isOpen is false', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal isOpen={false} onClose={onClose}>
        <div>Modal Content</div>
      </FuturisticModal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should render title and subtitle when provided', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal
        isOpen={true}
        onClose={onClose}
        title="Test Title"
        subtitle="Test Subtitle"
      >
        <div>Content</div>
      </FuturisticModal>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose} title="Test">
        <div>Content</div>
      </FuturisticModal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when backdrop is clicked and closeOnBackdropClick is true', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose} closeOnBackdropClick={true}>
        <div>Content</div>
      </FuturisticModal>
    );

    // Click the backdrop by finding the dialog and clicking its parent
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.parentElement as HTMLElement;
    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onClose when backdrop is clicked and closeOnBackdropClick is false', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose} closeOnBackdropClick={false}>
        <div>Content</div>
      </FuturisticModal>
    );

    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.parentElement as HTMLElement;
    fireEvent.click(backdrop);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should not call onClose when modal content is clicked', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </FuturisticModal>
    );

    const content = screen.getByText('Modal Content');
    fireEvent.click(content);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('should call onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </FuturisticModal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should not show close button when showCloseButton is false', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose} showCloseButton={false} title="Test">
        <div>Content</div>
      </FuturisticModal>
    );

    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('should prevent body scroll when modal is open', () => {
    const onClose = vi.fn();
    const { rerender } = renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose}>
        <div>Content</div>
      </FuturisticModal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <ThemeProvider>
        <FuturisticModal isOpen={false} onClose={onClose}>
          <div>Content</div>
        </FuturisticModal>
      </ThemeProvider>
    );

    expect(document.body.style.overflow).toBe('');
  });

  it('should apply custom className', () => {
    const onClose = vi.fn();
    const { container } = renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose} className="custom-class">
        <div>Content</div>
      </FuturisticModal>
    );

    const modal = container.querySelector('.custom-class');
    expect(modal).toBeInTheDocument();
  });

  it('should apply correct max-width class', () => {
    const onClose = vi.fn();
    const { container } = renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose} maxWidth="xl">
        <div>Content</div>
      </FuturisticModal>
    );

    const modal = container.querySelector('.max-w-xl');
    expect(modal).toBeInTheDocument();
  });

  it('should have proper ARIA attributes', () => {
    const onClose = vi.fn();
    const { container } = renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose} title="Test Title">
        <div>Content</div>
      </FuturisticModal>
    );

    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('should render in light theme', () => {
    const onClose = vi.fn();
    renderWithTheme(
      <FuturisticModal isOpen={true} onClose={onClose} title="Test">
        <div>Content</div>
      </FuturisticModal>,
      'light'
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should handle animation states correctly', async () => {
    const onClose = vi.fn();
    const { rerender } = renderWithTheme(
      <FuturisticModal isOpen={false} onClose={onClose}>
        <div>Content</div>
      </FuturisticModal>
    );

    // Initially not rendered
    expect(screen.queryByText('Content')).not.toBeInTheDocument();

    // Open modal
    rerender(
      <ThemeProvider>
        <FuturisticModal isOpen={true} onClose={onClose}>
          <div>Content</div>
        </FuturisticModal>
      </ThemeProvider>
    );

    // Should be rendered
    expect(screen.getByText('Content')).toBeInTheDocument();

    // Close modal
    rerender(
      <ThemeProvider>
        <FuturisticModal isOpen={false} onClose={onClose}>
          <div>Content</div>
        </FuturisticModal>
      </ThemeProvider>
    );

    // Should still be in DOM during animation
    expect(screen.getByText('Content')).toBeInTheDocument();

    // After animation completes, should be removed
    await waitFor(
      () => {
        expect(screen.queryByText('Content')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });
});
