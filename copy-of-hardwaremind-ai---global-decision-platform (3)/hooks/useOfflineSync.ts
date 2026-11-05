import { useEffect, useState, useCallback } from 'react';
import { offlineService } from '../services/offlineService';
import { useOnlineStatus } from './useOnlineStatus';
import { useToast } from '../components/Toast';

interface SyncStatus {
  isSyncing: boolean;
  pendingCount: number;
  lastSynced: Date | null;
  error: string | null;
}

/**
 * Hook for managing offline data synchronization
 */
export const useOfflineSync = (lang: 'zh' | 'en' = 'zh') => {
  const { isOnline } = useOnlineStatus();
  const toast = useToast();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isSyncing: false,
    pendingCount: 0,
    lastSynced: null,
    error: null,
  });

  // Initialize offline service
  useEffect(() => {
    offlineService.init().catch((error) => {
      console.error('Failed to initialize offline service:', error);
    });
  }, []);

  // Check pending actions count
  useEffect(() => {
    const checkPending = async () => {
      try {
        const pending = await offlineService.getPendingActions();
        setSyncStatus(prev => ({
          ...prev,
          pendingCount: pending.length,
        }));
      } catch (error) {
        console.error('Failed to check pending actions:', error);
      }
    };

    checkPending();
    const interval = setInterval(checkPending, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && syncStatus.pendingCount > 0) {
      sync();
    }
  }, [isOnline, syncStatus.pendingCount]);

  /**
   * Sync pending actions to server
   */
  const sync = useCallback(async () => {
    if (!isOnline) {
      toast?.error(
        lang === 'zh' 
          ? '网络未连接，无法同步' 
          : 'Network not connected, cannot sync',
        3000
      );
      return;
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      const pendingActions = await offlineService.getPendingActions();
      
      if (pendingActions.length === 0) {
        setSyncStatus(prev => ({
          ...prev,
          isSyncing: false,
          lastSynced: new Date(),
        }));
        return;
      }

      // Sync each action
      for (const action of pendingActions) {
        try {
          // Here you would call your actual API endpoints
          // For now, we'll just mark them as synced
          // In a real implementation, you would:
          // - Call the appropriate API endpoint
          // - Handle conflicts
          // - Update local data if needed
          
          // Example:
          // if (action.type === 'favorite') {
          //   await api.addFavorite(action.data.productId);
          // } else if (action.type === 'addPost') {
          //   await api.createPost(action.data);
          // }

          await offlineService.markActionSynced(action.id);
        } catch (error) {
          console.error(`Failed to sync action ${action.id}:`, error);
          // Don't break the loop, continue with other actions
        }
      }

      const remaining = await offlineService.getPendingActions();
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        pendingCount: remaining.length,
        lastSynced: new Date(),
      }));

      if (remaining.length === 0) {
        toast?.success(
          lang === 'zh' 
            ? '所有数据已同步' 
            : 'All data synced',
          2000
        );
      } else {
        toast?.info(
          lang === 'zh' 
            ? `已同步部分数据，${remaining.length} 项待同步` 
            : `Synced partially, ${remaining.length} items pending`,
          3000
        );
      }
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      toast?.error(
        lang === 'zh' 
          ? '同步失败，请稍后重试' 
          : 'Sync failed, please try again later',
        3000
      );
    }
  }, [isOnline, toast, lang]);

  /**
   * Force sync now
   */
  const forceSync = useCallback(() => {
    sync();
  }, [sync]);

  return {
    syncStatus,
    sync: forceSync,
    isOnline,
  };
};

