/**
 * Data Export Utilities
 * Export user data in various formats
 */

import { Product, CommunityPost } from '../data/types';
import { storageService } from '../services/storageService';

export type ExportFormat = 'json' | 'csv' | 'txt';

/**
 * Export favorites to JSON
 */
export function exportFavoritesToJSON(): string {
  const favorites = storageService.getFavorites();
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    favorites: favorites.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      priceEstimate: p.priceEstimate,
      rating: p.rating,
      imageUrl: p.imageUrl,
    })),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Export favorites to CSV
 */
export function exportFavoritesToCSV(): string {
  const favorites = storageService.getFavorites();
  const headers = ['ID', 'Name', 'Brand', 'Category', 'Price', 'Rating', 'Image URL'];
  const rows = favorites.map(p => [
    p.id,
    `"${p.name}"`,
    `"${p.brand || ''}"`,
    `"${p.category || ''}"`,
    `"${p.priceEstimate || ''}"`,
    p.rating?.toString() || '',
    `"${p.imageUrl || ''}"`,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Export favorites to TXT
 */
export function exportFavoritesToTXT(): string {
  const favorites = storageService.getFavorites();
  const lines = [
    'HardwareMind Favorites Export',
    `Export Date: ${new Date().toLocaleString()}`,
    '',
    ...favorites.map((p, index) => [
      `${index + 1}. ${p.name}`,
      `   Brand: ${p.brand || 'N/A'}`,
      `   Category: ${p.category || 'N/A'}`,
      `   Price: ${p.priceEstimate || 'N/A'}`,
      `   Rating: ${p.rating || 'N/A'}`,
      '',
    ].join('\n')),
  ];

  return lines.join('\n');
}

/**
 * Export community posts
 */
export function exportPostsToJSON(): string {
  const posts = storageService.getPosts();
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    posts: posts.map(p => ({
      id: p.id,
      title: p.title,
      content: p.content,
      rating: p.rating,
      productId: p.productId,
      createdAt: p.createdAt,
      helpfulCount: p.helpfulCount,
    })),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Download data as file
 */
export function downloadData(
  content: string,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export all user data
 */
export async function exportAllUserData(format: ExportFormat = 'json'): Promise<void> {
  const favorites = storageService.getFavorites();
  const posts = storageService.getPosts();
  const searchHistory = storageService.getSearchHistory();
  const recentViews = storageService.getRecentViews();

  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    favorites: favorites.length,
    posts: posts.length,
    searchHistory: searchHistory.length,
    recentViews: recentViews.length,
    data: {
      favorites,
      posts,
      searchHistory,
      recentViews,
    },
  };

  const content = format === 'json' 
    ? JSON.stringify(data, null, 2)
    : format === 'csv'
    ? exportFavoritesToCSV()
    : exportFavoritesToTXT();

  const mimeTypes = {
    json: 'application/json',
    csv: 'text/csv',
    txt: 'text/plain',
  };

  downloadData(
    content,
    `hardwaremind-export-${new Date().toISOString().split('T')[0]}.${format}`,
    mimeTypes[format]
  );
}

