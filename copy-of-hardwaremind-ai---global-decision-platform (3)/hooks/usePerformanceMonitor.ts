import { useEffect, useState, useCallback } from 'react';
import { FPSMonitor, detectPerformance, PerformanceLevel } from '../utils/performance';

interface PerformanceMetrics {
  fps: number;
  performanceLevel: PerformanceLevel;
  isGoodPerformance: boolean;
}

/**
 * Hook to monitor application performance
 * 
 * Features:
 * - Real-time FPS monitoring
 * - Performance level detection
 * - Automatic quality adjustment
 * 
 * @param enabled - Whether to enable monitoring (default: true in development)
 * @returns Performance metrics and control functions
 */
export const usePerformanceMonitor = (enabled: boolean = import.meta.env.DEV) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    performanceLevel: 'high',
    isGoodPerformance: true,
  });
  const [monitor] = useState(() => new FPSMonitor());

  useEffect(() => {
    if (!enabled) return;

    // Detect initial performance level
    const performanceLevel = detectPerformance();
    setMetrics((prev) => ({ ...prev, performanceLevel }));

    // Start FPS monitoring
    monitor.start((fps) => {
      setMetrics((prev) => ({
        ...prev,
        fps,
        isGoodPerformance: fps >= 55,
      }));
    });

    return () => {
      monitor.stop();
    };
  }, [enabled, monitor]);

  const reset = useCallback(() => {
    monitor.reset();
  }, [monitor]);

  return {
    ...metrics,
    reset,
  };
};

/**
 * Hook to track Core Web Vitals
 * 
 * Tracks:
 * - First Contentful Paint (FCP)
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 */
export const useCoreWebVitals = () => {
  const [vitals, setVitals] = useState<{
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
  }>({});

  useEffect(() => {
    // Track FCP
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcp = entries.find((entry) => entry.name === 'first-contentful-paint');
      if (fcp) {
        setVitals((prev) => ({ ...prev, fcp: fcp.startTime }));
      }
    });

    // Track LCP
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        setVitals((prev) => ({ ...prev, lcp: lastEntry.startTime }));
      }
    });

    // Track FID
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.processingStart && entry.startTime) {
          const fid = entry.processingStart - entry.startTime;
          setVitals((prev) => ({ ...prev, fid }));
        }
      });
    });

    // Track CLS
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          setVitals((prev) => ({ ...prev, cls: clsValue }));
        }
      });
    });

    try {
      fcpObserver.observe({ entryTypes: ['paint'] });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // PerformanceObserver not supported
      console.warn('PerformanceObserver not supported', e);
    }

    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return vitals;
};

/**
 * Hook to log performance metrics to console (development only)
 */
export const usePerformanceLogger = () => {
  const { fps, performanceLevel, isGoodPerformance } = usePerformanceMonitor();
  const vitals = useCoreWebVitals();

  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const interval = setInterval(() => {
      console.group('📊 Performance Metrics');
      console.log(`FPS: ${fps.toFixed(1)} ${isGoodPerformance ? '✅' : '⚠️'}`);
      console.log(`Performance Level: ${performanceLevel}`);
      if (vitals.fcp) console.log(`FCP: ${vitals.fcp.toFixed(2)}ms`);
      if (vitals.lcp) console.log(`LCP: ${vitals.lcp.toFixed(2)}ms`);
      if (vitals.fid) console.log(`FID: ${vitals.fid.toFixed(2)}ms`);
      if (vitals.cls) console.log(`CLS: ${vitals.cls.toFixed(4)}`);
      console.groupEnd();
    }, 5000); // Log every 5 seconds

    return () => clearInterval(interval);
  }, [fps, performanceLevel, isGoodPerformance, vitals]);
};
