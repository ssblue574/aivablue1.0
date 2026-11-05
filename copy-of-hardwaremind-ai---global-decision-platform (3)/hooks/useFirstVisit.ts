import { useState, useEffect } from 'react';

const FIRST_VISIT_KEY = 'aiva_first_visit_completed';

/**
 * Hook to detect and manage first visit state
 * Returns whether this is the first visit and a function to mark it as completed
 */
export const useFirstVisit = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
    setIsFirstVisit(!hasVisited);
    setIsLoading(false);
  }, []);

  const markVisitCompleted = () => {
    localStorage.setItem(FIRST_VISIT_KEY, 'true');
    setIsFirstVisit(false);
  };

  return {
    isFirstVisit,
    isLoading,
    markVisitCompleted,
  };
};

