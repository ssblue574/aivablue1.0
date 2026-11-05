import { useState, useCallback, useRef, useEffect } from 'react';

export interface Action {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  undo: () => void;
  redo: () => void;
}

interface ActionHistoryState {
  past: Action[];
  present: Action | null;
  future: Action[];
}

const MAX_HISTORY_SIZE = 50;

/**
 * Hook for managing action history with undo/redo functionality
 * Supports multiple action types and maintains a history stack
 */
export const useActionHistory = () => {
  const [history, setHistory] = useState<ActionHistoryState>({
    past: [],
    present: null,
    future: [],
  });

  const canUndo = history.past.length > 0 || history.present !== null;
  const canRedo = history.future.length > 0;

  /**
   * Add a new action to history
   */
  const addAction = useCallback((action: Action) => {
    setHistory(prev => {
      const newPast = prev.present
        ? [...prev.past.slice(-MAX_HISTORY_SIZE + 1), prev.present]
        : prev.past.slice(-MAX_HISTORY_SIZE + 1);

      return {
        past: newPast,
        present: action,
        future: [], // Clear future when new action is added
      };
    });
  }, []);

  /**
   * Undo the last action
   */
  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory(prev => {
      if (prev.present) {
        // Undo current action
        prev.present.undo();

        // Move present to future, move last past to present
        const newPast = [...prev.past];
        const newPresent = newPast.pop() || null;
        const newFuture = [prev.present, ...prev.future];

        return {
          past: newPast,
          present: newPresent,
          future: newFuture,
        };
      } else if (prev.past.length > 0) {
        // Undo last past action
        const newPast = [...prev.past];
        const actionToUndo = newPast.pop()!;
        actionToUndo.undo();

        return {
          past: newPast,
          present: actionToUndo,
          future: prev.future,
        };
      }

      return prev;
    });
  }, [canUndo]);

  /**
   * Redo the last undone action
   */
  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory(prev => {
      if (prev.future.length > 0) {
        const actionToRedo = prev.future[0];
        actionToRedo.redo();

        const newFuture = prev.future.slice(1);
        const newPresent = actionToRedo;
        const newPast = prev.present
          ? [...prev.past, prev.present]
          : prev.past;

        return {
          past: newPast,
          present: newPresent,
          future: newFuture,
        };
      }

      return prev;
    });
  }, [canRedo]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory({
      past: [],
      present: null,
      future: [],
    });
  }, []);

  /**
   * Get the last N actions for display
   */
  const getRecentActions = useCallback((count: number = 10): Action[] => {
    const allActions: Action[] = [];
    if (history.present) {
      allActions.push(history.present);
    }
    allActions.push(...history.past.slice(-count));
    return allActions.reverse();
  }, [history]);

  return {
    addAction,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    getRecentActions,
    historySize: history.past.length + (history.present ? 1 : 0),
  };
};

