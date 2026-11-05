import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook for prefetching routes and resources
 * Preloads likely next pages based on current route
 */
export const usePrefetch = () => {
  const location = useLocation();

  useEffect(() => {
    // Prefetch likely next routes based on current location
    const prefetchRoutes: Record<string, string[]> = {
      '/': ['/products', '/keynote'],
      '/products': ['/favorites', '/compare'],
      '/favorites': ['/products', '/compare'],
      '/community': ['/products', '/favorites'],
    };

    const currentPath = location.pathname;
    const routesToPrefetch = prefetchRoutes[currentPath] || [];

    // Prefetch routes using link prefetch
    routesToPrefetch.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });

    // Cleanup
    return () => {
      routesToPrefetch.forEach(route => {
        const links = document.querySelectorAll(`link[rel="prefetch"][href="${route}"]`);
        links.forEach(link => link.remove());
      });
    };
  }, [location.pathname]);
};

