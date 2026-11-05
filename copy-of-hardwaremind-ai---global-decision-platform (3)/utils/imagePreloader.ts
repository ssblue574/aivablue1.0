/**
 * Image Preloader Utility
 * Preloads critical images for better perceived performance
 */

interface PreloadOptions {
  priority?: 'high' | 'low';
  crossOrigin?: 'anonymous' | 'use-credentials';
}

class ImagePreloader {
  private preloadedImages = new Set<string>();
  private preloadQueue: string[] = [];

  /**
   * Preload a single image
   */
  preload(src: string, options: PreloadOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      // Skip if already preloaded
      if (this.preloadedImages.has(src)) {
        resolve();
        return;
      }

      const img = new Image();
      
      if (options.crossOrigin) {
        img.crossOrigin = options.crossOrigin;
      }

      img.onload = () => {
        this.preloadedImages.add(src);
        resolve();
      };

      img.onerror = () => {
        // Don't reject - just log and continue
        console.warn(`Failed to preload image: ${src}`);
        resolve();
      };

      // Set priority hint
      if (options.priority === 'high') {
        (img as any).fetchPriority = 'high';
      }

      img.src = src;
    });
  }

  /**
   * Preload multiple images with concurrency limit
   */
  async preloadBatch(
    sources: string[],
    options: PreloadOptions & { concurrency?: number } = {}
  ): Promise<void> {
    const { concurrency = 3, ...preloadOptions } = options;
    const queue = [...sources];
    const inProgress = new Set<Promise<void>>();

    while (queue.length > 0 || inProgress.size > 0) {
      // Start new preloads up to concurrency limit
      while (inProgress.size < concurrency && queue.length > 0) {
        const src = queue.shift()!;
        const promise = this.preload(src, preloadOptions).finally(() => {
          inProgress.delete(promise);
        });
        inProgress.add(promise);
      }

      // Wait for at least one to complete
      if (inProgress.size > 0) {
        await Promise.race(Array.from(inProgress));
      }
    }
  }

  /**
   * Check if image is already preloaded
   */
  isPreloaded(src: string): boolean {
    return this.preloadedImages.has(src);
  }

  /**
   * Clear preload cache
   */
  clear(): void {
    this.preloadedImages.clear();
  }
}

export const imagePreloader = new ImagePreloader();

/**
 * Preload critical images for homepage
 */
export const preloadHomepageImages = (products: Array<{ imageUrl: string }>) => {
  // Preload first 5 product images (above the fold)
  const criticalImages = products.slice(0, 5).map(p => p.imageUrl).filter(Boolean);
  
  if (criticalImages.length > 0) {
    imagePreloader.preloadBatch(criticalImages, {
      priority: 'high',
      concurrency: 2, // Load 2 at a time to avoid blocking
    });
  }
};

/**
 * Preload images for a specific route
 */
export const preloadRouteImages = (route: string, images: string[]) => {
  // Use low priority for route prefetching
  imagePreloader.preloadBatch(images, {
    priority: 'low',
    concurrency: 1,
  });
};

