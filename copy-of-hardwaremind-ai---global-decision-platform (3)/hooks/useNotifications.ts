import { useEffect, useState, useCallback } from 'react';
import { useToast } from '../components/Toast';

export type NotificationPermission = 'default' | 'granted' | 'denied';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
  silent?: boolean;
}

/**
 * Hook for managing browser notifications
 */
export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setIsSupported('Notification' in window);
    
    if (isSupported) {
      setPermission(Notification.permission as NotificationPermission);
    }
  }, [isSupported]);

  /**
   * Request notification permission
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      toast?.error('您的浏览器不支持通知功能', 3000);
      return false;
    }

    if (permission === 'granted') {
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermission);
      
      if (result === 'granted') {
        toast?.success('通知权限已授予', 2000);
        return true;
      } else {
        toast?.info('通知权限已拒绝', 2000);
        return false;
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      toast?.error('请求通知权限失败', 3000);
      return false;
    }
  }, [isSupported, permission, toast]);

  /**
   * Show notification
   */
  const showNotification = useCallback(async (
    options: NotificationOptions
  ): Promise<void> => {
    if (!isSupported) {
      // Fallback to toast
      toast?.info(`${options.title}: ${options.body}`, 5000);
      return;
    }

    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        // Fallback to toast
        toast?.info(`${options.title}: ${options.body}`, 5000);
        return;
      }
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192.png',
        badge: options.badge || '/icon-192.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction,
        silent: options.silent,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Failed to show notification:', error);
      // Fallback to toast
      toast?.info(`${options.title}: ${options.body}`, 5000);
    }
  }, [isSupported, permission, requestPermission, toast]);

  /**
   * Show product notification
   */
  const notifyProduct = useCallback(async (
    product: { name: string; id: string; imageUrl?: string },
    message: string
  ) => {
    await showNotification({
      title: product.name,
      body: message,
      icon: product.imageUrl,
      tag: `product-${product.id}`,
      data: { productId: product.id, url: `/products/${product.id}` },
    });
  }, [showNotification]);

  /**
   * Show comparison notification
   */
  const notifyComparison = useCallback(async (
    productCount: number,
    message: string
  ) => {
    await showNotification({
      title: '产品对比',
      body: message,
      tag: 'comparison',
      data: { url: '/compare' },
    });
  }, [showNotification]);

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    notifyProduct,
    notifyComparison,
  };
};

