import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { imagePreloader } from '../utils/imagePreloader';

interface NavigationPattern {
  route: string;
  frequency: number;
  lastVisited: number;
}

/**
 * Smart prefetching hook based on user behavior patterns
 * Predicts likely next routes and preloads resources
 */
export const useSmartPrefetch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationHistory = useRef<NavigationPattern[]>([]);
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Track navigation
    const currentRoute = location.pathname;
    const existingPattern = navigationHistory.current.find(p => p.route === currentRoute);
    
    if (existingPattern) {
      existingPattern.frequency++;
      existingPattern.lastVisited = Date.now();
    } else {
      navigationHistory.current.push({
        route: currentRoute,
        frequency: 1,
        lastVisited: Date.now(),
      });
    }

    // Keep only recent navigation history (last 50 routes)
    if (navigationHistory.current.length > 50) {
      navigationHistory.current = navigationHistory.current.slice(-50);
    }

    // Predict next likely routes
    predictAndPrefetch(currentRoute);
  }, [location.pathname]);

  /**
   * Predict likely next routes based on navigation patterns
   */
  const predictAndPrefetch = (currentRoute: string) => {
    // Find routes that were frequently visited after current route
    const transitions = navigationHistory.current
      .map((pattern, index) => {
        if (index === 0) return null;
        const prevPattern = navigationHistory.current[index - 1];
        if (prevPattern.route === currentRoute) {
          return {
            route: pattern.route,
            frequency: pattern.frequency,
            timeSince: Date.now() - pattern.lastVisited,
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{ route: string; frequency: number; timeSince: number }>;

    // Sort by frequency and recency
    transitions.sort((a, b) => {
      // Higher frequency = more likely
      const freqDiff = b.frequency - a.frequency;
      if (Math.abs(freqDiff) > 2) return freqDiff;
      
      // More recent = more likely
      return a.timeSince - b.timeSince;
    });

    // Prefetch top 2-3 likely routes
    const topRoutes = transitions.slice(0, 3);
    topRoutes.forEach(({ route }) => {
      if (!prefetchedRoutes.current.has(route) && route !== currentRoute) {
        prefetchRoute(route);
        prefetchedRoutes.current.add(route);
      }
    });

    // Also prefetch based on common navigation patterns
    prefetchCommonPatterns(currentRoute);
  };

  /**
   * Prefetch common navigation patterns
   */
  const prefetchCommonPatterns = (currentRoute: string) => {
    const commonPatterns: Record<string, string[]> = {
      '/': ['/products', '/keynote', '/community'],
      '/products': ['/compare', '/favorites'],
      '/compare': ['/products'],
      '/community': ['/products'],
      '/keynote': ['/products'],
    };

    const likelyRoutes = commonPatterns[currentRoute] || [];
    likelyRoutes.forEach(route => {
      if (!prefetchedRoutes.current.has(route)) {
        prefetchRoute(route);
        prefetchedRoutes.current.add(route);
      }
    });
  };

  /**
   * Prefetch resources for a route
   */
  const prefetchRoute = (route: string) => {
    // Prefetch route component (React lazy loading)
    // This is handled by React Router's prefetching
    
    // Prefetch images for common routes
    if (route === '/products') {
      // Prefetch product images from recent views
      const recentViews = storageService.getRecentViews();
      const images = recentViews.slice(0, 5).map(p => p.imageUrl).filter(Boolean);
      if (images.length > 0) {
        imagePreloader.preloadBatch(images, {
          priority: 'low',
          concurrency: 1,
        });
      }
    }

    // Prefetch API data (if needed)
    // This could be enhanced to prefetch data for likely routes
  };

  /**
   * Get predicted next routes
   */
  const getPredictedRoutes = (): string[] => {
    const currentRoute = location.pathname;
    const transitions = navigationHistory.current
      .map((pattern, index) => {
        if (index === 0) return null;
        const prevPattern = navigationHistory.current[index - 1];
        if (prevPattern.route === currentRoute) {
          return pattern.route;
        }
        return null;
      })
      .filter(Boolean) as string[];

    // Return unique routes sorted by frequency
    const routeFreq = new Map<string, number>();
    transitions.forEach(route => {
      routeFreq.set(route, (routeFreq.get(route) || 0) + 1);
    });

    return Array.from(routeFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([route]) => route);
  };

  return {
    getPredictedRoutes,
  };
};

