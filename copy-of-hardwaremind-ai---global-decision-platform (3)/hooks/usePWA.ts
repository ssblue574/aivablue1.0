import { useState, useEffect } from 'react';

interface PWAInstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Hook for PWA installation and management
 */
export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    let updateIntervalId: number | null = null;
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Check if running as PWA
    if ((window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as PWAInstallPrompt);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            setUpdateAvailable(true);
          });

          // Check for updates periodically
          updateIntervalId = window.setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        }
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (updateIntervalId !== null) {
        clearInterval(updateIntervalId);
      }
    };
  }, []);

  /**
   * Install the PWA
   */
  const install = async (): Promise<boolean> => {
    if (!installPrompt) {
      return false;
    }

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        setInstallPrompt(null);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to install PWA:', error);
      return false;
    }
  };

  /**
   * Update the service worker
   */
  const update = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        setUpdateAvailable(false);
      }
    }
  };

  /**
   * Register service worker
   */
  const registerServiceWorker = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    updateAvailable,
    install,
    update,
    registerServiceWorker,
  };
};

