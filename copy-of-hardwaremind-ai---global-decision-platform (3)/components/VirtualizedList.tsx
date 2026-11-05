import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

/**
 * VirtualizedList - 虚拟滚动列表组件
 * 用于优化长列表性能，只渲染可见区域的项目
 */
export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className,
  onScroll,
}: VirtualizedListProps<T>) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    const startWithOverscan = Math.max(0, start - overscan);
    
    return {
      start: startWithOverscan,
      end,
      visibleStart: start,
      visibleEnd: Math.min(start + Math.ceil(containerHeight / itemHeight), items.length),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange.start, visibleRange.end]);

  // Calculate total height
  const totalHeight = items.length * itemHeight;
  
  // Calculate offset for visible items
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "overflow-auto",
        className
      )}
      style={{
        height: containerHeight,
        overflowY: 'auto',
      }}
      onScroll={handleScroll}
    >
      {/* Spacer for items before visible range */}
      <div style={{ height: offsetY }} />

      {/* Visible items */}
      <div>
        {visibleItems.map((item, index) => {
          const actualIndex = visibleRange.start + index;
          return (
            <div
              key={actualIndex}
              style={{
                height: itemHeight,
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>

      {/* Spacer for items after visible range */}
      <div style={{ height: totalHeight - offsetY - visibleItems.length * itemHeight }} />
    </div>
  );
}

/**
 * Hook for virtualized list with dynamic item heights
 */
export function useVirtualizedList<T>(
  items: T[],
  containerHeight: number,
  estimatedItemHeight: number
) {
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  const [scrollTop, setScrollTop] = useState(0);

  const getItemHeight = useCallback((index: number) => {
    return itemHeights.get(index) || estimatedItemHeight;
  }, [itemHeights, estimatedItemHeight]);

  const setItemHeight = useCallback((index: number, height: number) => {
    setItemHeights(prev => {
      const next = new Map(prev);
      next.set(index, height);
      return next;
    });
  }, []);

  // Calculate cumulative heights for efficient scrolling
  const cumulativeHeights = useMemo(() => {
    const heights: number[] = [0];
    for (let i = 0; i < items.length; i++) {
      heights.push(heights[i] + getItemHeight(i));
    }
    return heights;
  }, [items.length, getItemHeight]);

  const visibleRange = useMemo(() => {
    let start = 0;
    let end = items.length;

    // Binary search for start
    let low = 0;
    let high = items.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (cumulativeHeights[mid] < scrollTop) {
        start = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    // Find end
    const viewportBottom = scrollTop + containerHeight;
    for (let i = start; i < items.length; i++) {
      if (cumulativeHeights[i] > viewportBottom) {
        end = i;
        break;
      }
    }

    return { start, end };
  }, [scrollTop, containerHeight, cumulativeHeights, items.length]);

  return {
    visibleRange,
    setScrollTop,
    getItemHeight,
    setItemHeight,
    totalHeight: cumulativeHeights[items.length],
    offsetY: cumulativeHeights[visibleRange.start],
  };
}

