import { useMemo } from 'react';
import { Product } from '../data/types';
import { storageService } from '../services/storageService';

interface UserBehavior {
  viewedProducts: string[];
  favoritedProducts: string[];
  comparedProducts: string[];
  searchQueries: string[];
  categories: string[];
}

/**
 * Hook for personalized product recommendations
 * Analyzes user behavior to provide relevant product suggestions
 */
export const usePersonalizedRecommendations = (
  products: Product[],
  userPersona?: 'consumer' | 'geek'
) => {
  const userBehavior = useMemo(() => {
    const recentViews = storageService.getRecentViews();
    const favorites = storageService.getFavorites();
    const searchHistory = storageService.getSearchHistory();
    
    // Get compared products from selected products (if available)
    const comparedProducts: string[] = []; // Could be enhanced with actual comparison history
    
    return {
      viewedProducts: recentViews.map(p => p.id),
      favoritedProducts: favorites.map(p => p.id),
      comparedProducts,
      searchQueries: searchHistory.map(s => s.query?.toLowerCase()).filter(Boolean) as string[],
      categories: [
        ...recentViews.map(p => p.category).filter(Boolean),
        ...favorites.map(p => p.category).filter(Boolean),
      ] as string[],
    };
  }, []);

  const recommendations = useMemo(() => {
    if (products.length === 0) return [];

    // Calculate relevance score for each product
    const scoredProducts = products
      .filter(product => product.name && product.brand) // 跳过无效产品
      .map(product => {
      let score = 0;
      const productTags = (product.tags || []).map(t => t?.toLowerCase()).filter(Boolean) as string[];
      const productCategory = product.category?.toLowerCase() || '';
      const productName = product.name?.toLowerCase() || '';
      const productBrand = product.brand?.toLowerCase() || '';

      // 1. Category preference (based on viewed/favorited categories)
      const categoryFrequency = userBehavior.categories.filter(
        c => c.toLowerCase() === productCategory
      ).length;
      score += categoryFrequency * 10;

      // 2. Tag matching (based on search queries and viewed products)
      userBehavior.searchQueries.forEach(query => {
        if (productName.includes(query) || productBrand.includes(query)) {
          score += 15;
        }
        productTags.forEach(tag => {
          if (tag.includes(query)) {
            score += 8;
          }
        });
      });

      // 3. Similarity to viewed products
      userBehavior.viewedProducts.forEach(viewedId => {
        const viewedProduct = products.find(p => p.id === viewedId);
        if (viewedProduct) {
          // Same category
          if (viewedProduct.category === product.category) {
            score += 5;
          }
          // Similar tags
          const viewedTags = (viewedProduct.tags || []).map(t => t?.toLowerCase()).filter(Boolean) as string[];
          const commonTags = productTags.filter(t => viewedTags.includes(t));
          score += commonTags.length * 3;
          // Similar price range (within 30%)
          if (viewedProduct.price && product.price) {
            const priceDiff = Math.abs(viewedProduct.price - product.price) / viewedProduct.price;
            if (priceDiff < 0.3) {
              score += 5;
            }
          }
        }
      });

      // 4. Favorited products similarity
      userBehavior.favoritedProducts.forEach(favId => {
        const favProduct = products.find(p => p.id === favId);
        if (favProduct) {
          if (favProduct.category === product.category) {
            score += 8;
          }
          const favTags = (favProduct.tags || []).map(t => t?.toLowerCase()).filter(Boolean) as string[];
          const commonTags = productTags.filter(t => favTags.includes(t));
          score += commonTags.length * 5;
        }
      });

      // 5. User persona preferences
      if (userPersona === 'geek') {
        // Geeks prefer high-tech features, latest products
        if (product.tags?.some(t => ['AI', 'latest', 'innovative', 'cutting-edge'].includes(t))) {
          score += 10;
        }
        // Higher ratings preferred
        if (product.rating && product.rating >= 80) {
          score += 5;
        }
      } else {
        // Consumers prefer popular, well-reviewed products
        if (product.reviewCount && product.reviewCount > 10) {
          score += 8;
        }
        if (product.rating && product.rating >= 75) {
          score += 5;
        }
      }

      // 6. Recency bonus (newer products get slight boost)
      if (product.releaseDate) {
        const releaseDate = new Date(product.releaseDate);
        const daysSinceRelease = (Date.now() - releaseDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceRelease < 90) {
          score += 3;
        }
      }

      // 7. Avoid already viewed/favorited products (unless they're highly relevant)
      if (userBehavior.viewedProducts.includes(product.id)) {
        score *= 0.7; // Reduce score but don't eliminate
      }
      if (userBehavior.favoritedProducts.includes(product.id)) {
        score *= 0.5; // Further reduce if already favorited
      }

      return {
        product,
        score,
      };
    });

    // Sort by score and return top recommendations
    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 12) // Top 12 recommendations
      .map(item => item.product);
  }, [products, userBehavior, userPersona]);

  return {
    recommendations,
    userBehavior,
  };
};

