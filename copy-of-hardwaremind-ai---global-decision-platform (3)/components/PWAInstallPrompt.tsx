import React, { useState, useEffect } from 'react';
import { Download, X, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { usePWA } from '../hooks/usePWA';

interface PWAInstallPromptProps {
  lang?: 'zh' | 'en';
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  lang = 'zh',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isZh = lang === 'zh';
  const { isInstallable, isInstalled, install, updateAvailable, update } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if dismissed, installed, or not installable
  if (dismissed || isInstalled || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Store dismissal in localStorage
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Check if user previously dismissed
  useEffect(() => {
    const wasDismissed = localStorage.getItem('pwa-install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  if (updateAvailable) {
    return (
      <div className={clsx(
        "fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50",
        "p-4 rounded-2xl shadow-2xl border",
        isDark
          ? "bg-[#1c1c1e] border-white/10"
          : "bg-white border-black/10"
      )}>
        <div className="flex items-start gap-3">
          <div className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
            isDark ? "bg-blue-500/20" : "bg-blue-50"
          )}>
            <RefreshCw size={20} className="text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={clsx(
              "font-semibold mb-1",
              isDark ? "text-white" : "text-black"
            )}>
              {isZh ? '更新可用' : 'Update Available'}
            </h3>
            <p className={clsx(
              "text-sm mb-3",
              isDark ? "text-white/60" : "text-black/60"
            )}>
              {isZh 
                ? '新版本已可用，点击更新以获取最新功能' 
                : 'A new version is available. Click update to get the latest features'}
            </p>
            <button
              onClick={update}
              className={clsx(
                "px-4 py-2 rounded-lg font-medium transition-all",
                isDark
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              )}
            >
              {isZh ? '更新' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(
      "fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50",
      "p-4 rounded-2xl shadow-2xl border",
      isDark
        ? "bg-[#1c1c1e] border-white/10"
        : "bg-white border-black/10"
    )}>
      <div className="flex items-start gap-3">
        <div className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
          isDark ? "bg-[#00FFC6]/20" : "bg-[#00FFC6]/10"
        )}>
          <Download size={20} className="text-[#00FFC6]" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={clsx(
            "font-semibold mb-1",
            isDark ? "text-white" : "text-black"
          )}>
            {isZh ? '安装应用' : 'Install App'}
          </h3>
          <p className={clsx(
            "text-sm mb-3",
            isDark ? "text-white/60" : "text-black/60"
          )}>
            {isZh 
              ? '将 HardwareMind 安装到您的设备，以便更快访问和离线使用' 
              : 'Install HardwareMind on your device for faster access and offline use'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className={clsx(
                "px-4 py-2 rounded-lg font-medium transition-all flex-1",
                isDark
                  ? "bg-[#00FFC6] text-black hover:bg-[#00FFC6]/90"
                  : "bg-[#0071e3] text-white hover:bg-[#0077ED]"
              )}
            >
              {isZh ? '安装' : 'Install'}
            </button>
            <button
              onClick={handleDismiss}
              className={clsx(
                "p-2 rounded-lg transition-all",
                isDark
                  ? "hover:bg-white/10 text-white"
                  : "hover:bg-black/10 text-black"
              )}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

