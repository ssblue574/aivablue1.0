/**
 * Enhanced Search Suggestions Algorithm
 * Provides intelligent, context-aware search suggestions
 */

import { Product } from '../data/types';
import { storageService } from '../services/storageService';
import { offlineService } from '../services/offlineService';

interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'brand' | 'tag' | 'history' | 'popular';
  score: number;
  metadata?: {
    productId?: string;
    category?: string;
    brand?: string;
    tag?: string;
  };
}

interface SearchContext {
  recentSearches: string[];
  recentViews: Product[];
  favorites: Product[];
  currentQuery: string;
}

/**
 * Generate intelligent search suggestions
 */
export async function generateSearchSuggestions(
  query: string,
  products: Product[],
  maxResults: number = 10
): Promise<SearchSuggestion[]> {
  if (!query.trim()) {
    return getDefaultSuggestions(products, maxResults);
  }

  const context = await getSearchContext();
  const normalizedQuery = query.toLowerCase().trim();
  const suggestions: SearchSuggestion[] = [];

  // 1. Exact product name matches (highest priority)
  products.forEach(product => {
    const name = product.name.toLowerCase();
    if (name.includes(normalizedQuery)) {
      const score = calculateRelevanceScore(product, normalizedQuery, context, 'exact');
      suggestions.push({
        text: product.name,
        type: 'product',
        score,
        metadata: { productId: product.id },
      });
    }
  });

  // 2. Brand matches
  const brands = new Set(products.map(p => p.brand).filter(Boolean));
  brands.forEach(brand => {
    if (brand.toLowerCase().includes(normalizedQuery)) {
      const brandProducts = products.filter(p => p.brand === brand);
      const avgScore = brandProducts.reduce((sum, p) => 
        sum + calculateRelevanceScore(p, normalizedQuery, context, 'brand'), 0
      ) / brandProducts.length;
      
      suggestions.push({
        text: brand,
        type: 'brand',
        score: avgScore * 0.8, // Slightly lower than product matches
        metadata: { brand },
      });
    }
  });

  // 3. Category matches
  const categories = new Set(products.map(p => p.category).filter(Boolean));
  categories.forEach(category => {
    if (category.toLowerCase().includes(normalizedQuery)) {
      const categoryProducts = products.filter(p => p.category === category);
      const avgScore = categoryProducts.reduce((sum, p) => 
        sum + calculateRelevanceScore(p, normalizedQuery, context, 'category'), 0
      ) / categoryProducts.length;
      
      suggestions.push({
        text: category,
        type: 'category',
        score: avgScore * 0.7,
        metadata: { category },
      });
    }
  });

  // 4. Tag matches
  products.forEach(product => {
    product.tags?.forEach(tag => {
      if (tag.toLowerCase().includes(normalizedQuery)) {
        const score = calculateRelevanceScore(product, normalizedQuery, context, 'tag');
        suggestions.push({
          text: tag,
          type: 'tag',
          score: score * 0.6,
          metadata: { tag, productId: product.id },
        });
      }
    });
  });

  // 5. Search history matches
  const searchHistory = storageService.getSearchHistory();
  searchHistory.forEach((historyItem: string) => {
    if (historyItem.toLowerCase().includes(normalizedQuery)) {
      suggestions.push({
        text: historyItem,
        type: 'history',
        score: 0.5,
      });
    }
  });

  // 6. Popular searches (if query is short)
  if (normalizedQuery.length <= 2) {
    const popularSearches = getPopularSearches(products);
    popularSearches.forEach(search => {
      if (search.toLowerCase().startsWith(normalizedQuery)) {
        suggestions.push({
          text: search,
          type: 'popular',
          score: 0.4,
        });
      }
    });
  }

  // Remove duplicates and sort by score
  const uniqueSuggestions = removeDuplicates(suggestions);
  return uniqueSuggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

/**
 * Calculate relevance score for a product
 */
function calculateRelevanceScore(
  product: Product,
  query: string,
  context: SearchContext,
  matchType: 'exact' | 'brand' | 'category' | 'tag'
): number {
  let score = 0;

  // Base score by match type
  switch (matchType) {
    case 'exact':
      score = product.name.toLowerCase() === query ? 100 : 80;
      break;
    case 'brand':
      score = 60;
      break;
    case 'category':
      score = 50;
      break;
    case 'tag':
      score = 40;
      break;
  }

  // Boost if in recent views
  if (context.recentViews.some(p => p.id === product.id)) {
    score += 20;
  }

  // Boost if favorited
  if (context.favorites.some(p => p.id === product.id)) {
    score += 15;
  }

  // Boost by rating
  if (product.rating) {
    score += product.rating / 10;
  }

  // Boost by review count (popularity)
  if (product.reviewCount) {
    score += Math.min(10, product.reviewCount / 10);
  }

  // Boost if recently released
  if (product.releaseDate) {
    const releaseDate = new Date(product.releaseDate);
    const daysSinceRelease = (Date.now() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceRelease < 90) {
      score += 5;
    }
  }

  return score;
}

/**
 * Get search context from user behavior
 */
async function getSearchContext(): Promise<SearchContext> {
  const recentSearches = storageService.getSearchHistory();
  const recentViews = storageService.getRecentViews();
  const favorites = storageService.getFavorites();

  // Also try to get from offline storage
  try {
    const offlineFavorites = await offlineService.getFavorites();
    if (offlineFavorites.length > 0) {
      // Merge with localStorage favorites
      const merged = [...favorites];
      offlineFavorites.forEach(fav => {
        if (!merged.find(p => p.id === fav.id)) {
          merged.push(fav);
        }
      });
      return {
        recentSearches,
        recentViews,
        favorites: merged,
        currentQuery: '',
      };
    }
  } catch (error) {
    console.warn('Failed to load offline favorites:', error);
  }

  return {
    recentSearches,
    recentViews,
    favorites,
    currentQuery: '',
  };
}

/**
 * Get default suggestions when query is empty
 */
function getDefaultSuggestions(products: Product[], maxResults: number): SearchSuggestion[] {
  const suggestions: SearchSuggestion[] = [];

  // Popular products
  const popularProducts = products
    .filter(p => p.rating && p.rating >= 80)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  popularProducts.forEach(product => {
    suggestions.push({
      text: product.name,
      type: 'product',
      score: product.rating || 0,
      metadata: { productId: product.id },
    });
  });

  // Popular categories
  const categoryCounts = new Map<string, number>();
  products.forEach(p => {
    if (p.category) {
      categoryCounts.set(p.category, (categoryCounts.get(p.category) || 0) + 1);
    }
  });

  Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .forEach(([category]) => {
      suggestions.push({
        text: category,
        type: 'category',
        score: 30,
        metadata: { category },
      });
    });

  // Search history
  const searchHistory = storageService.getSearchHistory();
  searchHistory.slice(0, 3).forEach((historyItem: string) => {
    suggestions.push({
      text: historyItem,
      type: 'history',
      score: 20,
    });
  });

  return suggestions.slice(0, maxResults);
}

/**
 * Get popular searches based on product data
 */
function getPopularSearches(products: Product[]): string[] {
  const searches: string[] = [];

  // Popular brands
  const brandCounts = new Map<string, number>();
  products.forEach(p => {
    if (p.brand) {
      brandCounts.set(p.brand, (brandCounts.get(p.brand) || 0) + 1);
    }
  });

  Array.from(brandCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([brand]) => {
      searches.push(brand);
    });

  // Popular product names
  products
    .filter(p => p.rating && p.rating >= 75)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5)
    .forEach(p => {
      searches.push(p.name);
    });

  return searches;
}

/**
 * Remove duplicate suggestions
 */
function removeDuplicates(suggestions: SearchSuggestion[]): SearchSuggestion[] {
  const seen = new Set<string>();
  return suggestions.filter(suggestion => {
    const key = suggestion.text.toLowerCase();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Cache search suggestions
 */
export async function cacheSearchSuggestions(
  query: string,
  suggestions: SearchSuggestion[]
): Promise<void> {
  const cacheKey = `search_suggestions_${query.toLowerCase()}`;
  await offlineService.cacheResponse(cacheKey, suggestions, 3600000); // Cache for 1 hour
}

/**
 * Get cached search suggestions
 */
export async function getCachedSearchSuggestions(
  query: string
): Promise<SearchSuggestion[] | null> {
  const cacheKey = `search_suggestions_${query.toLowerCase()}`;
  return await offlineService.getCachedResponse(cacheKey);
}

