import { useState, useCallback, useRef, useEffect } from 'react';

interface UndoAction<T> {
  type: string;
  data: T;
  timestamp: number;
}

/**
 * Hook for undo/redo functionality
 * 
 * @param maxHistory Maximum number of actions to keep in history (default: 10)
 */
export const useUndo = <T = any>(maxHistory: number = 10) => {
  const [history, setHistory] = useState<UndoAction<T>[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addAction = useCallback((type: string, data: T) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      const newAction: UndoAction<T> = {
        type,
        data,
        timestamp: Date.now(),
      };
      const updated = [...newHistory, newAction].slice(-maxHistory);
      setCurrentIndex(updated.length - 1);
      return updated;
    });
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex >= 0) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    history,
    currentIndex,
  };
};

