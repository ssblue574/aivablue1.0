/**
 * Performance Monitoring Utility
 * Tracks and analyzes application performance metrics
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  type: 'navigation' | 'resource' | 'custom' | 'web-vital';
}

export interface PerformanceReport {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
  metrics: PerformanceMetric[];
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private reportCallbacks: Array<(report: PerformanceReport) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    // Monitor Web Vitals
    if ('PerformanceObserver' in window) {
      this.observeWebVitals();
      this.observeNavigationTiming();
      this.observeResourceTiming();
    }

    // Monitor custom metrics
    this.observeCustomMetrics();
  }

  /**
   * Observe Web Vitals (Core Web Vitals)
   */
  private observeWebVitals() {
    // FCP - First Contentful Paint
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.addMetric({
              name: 'FCP',
              value: entry.startTime,
              timestamp: Date.now(),
              type: 'web-vital',
            });
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch (e) {
      console.warn('FCP observer not supported:', e);
    }

    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.addMetric({
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          timestamp: Date.now(),
          type: 'web-vital',
        });
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      console.warn('LCP observer not supported:', e);
    }

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          this.addMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            timestamp: Date.now(),
            type: 'web-vital',
          });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      console.warn('FID observer not supported:', e);
    }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.addMetric({
              name: 'CLS',
              value: clsValue,
              timestamp: Date.now(),
              type: 'web-vital',
            });
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      console.warn('CLS observer not supported:', e);
    }
  }

  /**
   * Observe Navigation Timing
   */
  private observeNavigationTiming() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        
        // TTFB - Time to First Byte
        const ttfb = nav.responseStart - nav.requestStart;
        this.addMetric({
          name: 'TTFB',
          value: ttfb,
          timestamp: Date.now(),
          type: 'navigation',
        });

        // DNS Lookup Time
        const dnsTime = nav.domainLookupEnd - nav.domainLookupStart;
        this.addMetric({
          name: 'DNS',
          value: dnsTime,
          timestamp: Date.now(),
          type: 'navigation',
        });

        // Connection Time
        const connectTime = nav.connectEnd - nav.connectStart;
        this.addMetric({
          name: 'Connect',
          value: connectTime,
          timestamp: Date.now(),
          type: 'navigation',
        });

        // DOM Content Loaded
        const domContentLoaded = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
        this.addMetric({
          name: 'DOMContentLoaded',
          value: domContentLoaded,
          timestamp: Date.now(),
          type: 'navigation',
        });

        // Load Time
        const loadTime = nav.loadEventEnd - nav.loadEventStart;
        this.addMetric({
          name: 'Load',
          value: loadTime,
          timestamp: Date.now(),
          type: 'navigation',
        });
      }
    }
  }

  /**
   * Observe Resource Timing
   */
  private observeResourceTiming() {
    if ('PerformanceObserver' in window) {
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
            // Only track slow resources (> 1s)
            const duration = entry.responseEnd - entry.startTime;
            if (duration > 1000) {
              this.addMetric({
                name: `Resource: ${entry.name.split('/').pop()}`,
                value: duration,
                timestamp: Date.now(),
                type: 'resource',
              });
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (e) {
        console.warn('Resource observer not supported:', e);
      }
    }
  }

  /**
   * Observe custom metrics
   */
  private observeCustomMetrics() {
    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setInterval(() => {
        this.addMetric({
          name: 'Memory Used',
          value: memory.usedJSHeapSize / 1048576, // Convert to MB
          timestamp: Date.now(),
          type: 'custom',
        });
      }, 30000); // Every 30 seconds
    }
  }

  /**
   * Add a custom metric
   */
  addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }

    // Trigger callbacks
    this.reportCallbacks.forEach(callback => {
      try {
        callback(this.generateReport());
      } catch (e) {
        console.error('Error in performance callback:', e);
      }
    });
  }

  /**
   * Measure a custom operation
   */
  measure(name: string, fn: () => void | Promise<void>): void;
  measure<T>(name: string, fn: () => T | Promise<T>): T | Promise<T>;
  measure(name: string, fn: () => any): any {
    const start = performance.now();
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        this.addMetric({
          name,
          value: duration,
          timestamp: Date.now(),
          type: 'custom',
        });
      });
    } else {
      const duration = performance.now() - start;
      this.addMetric({
        name,
        value: duration,
        timestamp: Date.now(),
        type: 'custom',
      });
      return result;
    }
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const webVitals = this.metrics.filter(m => m.type === 'web-vital');
    const navigation = this.metrics.filter(m => m.type === 'navigation');

    return {
      fcp: webVitals.find(m => m.name === 'FCP')?.value || null,
      lcp: webVitals.find(m => m.name === 'LCP')?.value || null,
      fid: webVitals.find(m => m.name === 'FID')?.value || null,
      cls: webVitals.find(m => m.name === 'CLS')?.value || null,
      ttfb: navigation.find(m => m.name === 'TTFB')?.value || null,
      metrics: [...this.metrics],
      timestamp: Date.now(),
    };
  }

  /**
   * Get metrics by type
   */
  getMetrics(type?: PerformanceMetric['type']): PerformanceMetric[] {
    if (type) {
      return this.metrics.filter(m => m.type === type);
    }
    return [...this.metrics];
  }

  /**
   * Get average metric value by name
   */
  getAverageMetric(name: string): number | null {
    const matchingMetrics = this.metrics.filter(m => m.name === name);
    if (matchingMetrics.length === 0) return null;
    
    const sum = matchingMetrics.reduce((acc, m) => acc + m.value, 0);
    return sum / matchingMetrics.length;
  }

  /**
   * Subscribe to performance reports
   */
  onReport(callback: (report: PerformanceReport) => void) {
    this.reportCallbacks.push(callback);
    return () => {
      const index = this.reportCallbacks.indexOf(callback);
      if (index > -1) {
        this.reportCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Clear all metrics
   */
  clear() {
    this.metrics = [];
  }

  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.reportCallbacks = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

