import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CommunityView } from './CommunityView';
import { ThemeProvider } from '../ThemeContext';

describe('CommunityView Integration', () => {
  const mockT = (key: string) => key;
  const mockPosts = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Test User',
      productId: 'prod1',
      productName: 'Test Product',
      productImage: '/test.jpg',
      rating: 5,
      title: 'Great product!',
      content: 'This is a test review',
      images: [],
      createdAt: '2024-01-01',
      helpfulCount: 10,
      isVerifiedPurchase: true,
    },
  ];
  const mockProducts = [
    {
      id: 'prod1',
      name: 'Test Product',
      imageUrl: '/test.jpg',
      description: 'Test description',
      price: 99,
      rating: 4.5,
      category: 'test',
      releaseDate: '2024-01-01',
      manufacturer: 'Test Co',
    },
  ];
  const mockUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com',
  };

  it('renders community view with GlassmorphicCard for posts', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <CommunityView
            t={mockT}
            posts={mockPosts}
            products={mockProducts}
            currentUser={mockUser}
          />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check if post content is rendered (using getAllByText since it appears in spotlight too)
    expect(screen.getAllByText('Great product!').length).toBeGreaterThan(0);
    expect(screen.getAllByText('This is a test review').length).toBeGreaterThan(0);
  });

  it('renders with glassmorphic card styling', () => {
    const { container } = render(
      <BrowserRouter>
        <ThemeProvider>
          <CommunityView
            t={mockT}
            posts={mockPosts}
            products={mockProducts}
            currentUser={mockUser}
          />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check if glassmorphic-card class is present
    const cards = container.querySelectorAll('.glassmorphic-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('renders interaction buttons with feedback', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <CommunityView
            t={mockT}
            posts={mockPosts}
            products={mockProducts}
            currentUser={mockUser}
          />
        </ThemeProvider>
      </BrowserRouter>
    );

    // Check if interaction buttons are present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
