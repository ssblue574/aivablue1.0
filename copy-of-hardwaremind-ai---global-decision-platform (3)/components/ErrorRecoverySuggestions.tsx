import React from 'react';
import { Wifi, WifiOff, Database, HardDrive, Trash2, Download, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface ErrorRecoverySuggestionsProps {
  error: Error | null;
  isDark: boolean;
  lang?: 'zh' | 'en';
}

export const ErrorRecoverySuggestions: React.FC<ErrorRecoverySuggestionsProps> = ({
  error,
  isDark,
  lang = 'zh',
}) => {
  const { isOnline } = useOnlineStatus();
  const isZh = lang === 'zh';

  // Analyze error message to provide specific suggestions
  const getSuggestions = () => {
    const errorMsg = error?.message?.toLowerCase() || '';
    const suggestions: Array<{ icon: React.ReactNode; title: string; desc: string; action?: () => void }> = [];

    // Network-related errors
    if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('connection')) {
      if (!isOnline) {
        suggestions.push({
          icon: <WifiOff size={20} />,
          title: isZh ? '网络连接已断开' : 'Network Disconnected',
          desc: isZh ? '请检查您的网络连接，然后重试' : 'Please check your network connection and try again',
        });
      } else {
        suggestions.push({
          icon: <Wifi size={20} />,
          title: isZh ? '网络连接不稳定' : 'Unstable Network',
          desc: isZh ? '您的网络连接可能不稳定，请稍后重试' : 'Your network connection may be unstable, please try again later',
        });
      }
    }

    // Storage-related errors
    if (errorMsg.includes('storage') || errorMsg.includes('quota') || errorMsg.includes('localstorage')) {
      suggestions.push({
        icon: <HardDrive size={20} />,
        title: isZh ? '存储空间不足' : 'Storage Full',
        desc: isZh ? '请清理浏览器缓存或删除不需要的数据' : 'Please clear browser cache or remove unnecessary data',
        action: () => {
          try {
            localStorage.clear();
            window.location.reload();
          } catch (e) {
            console.error('Failed to clear storage:', e);
          }
        },
      });
    }

    // Database/API errors
    if (errorMsg.includes('database') || errorMsg.includes('api') || errorMsg.includes('server')) {
      suggestions.push({
        icon: <Database size={20} />,
        title: isZh ? '服务器暂时不可用' : 'Server Unavailable',
        desc: isZh ? '服务器可能正在维护，请稍后重试' : 'Server may be under maintenance, please try again later',
      });
    }

    // Default suggestions
    if (suggestions.length === 0) {
      suggestions.push({
        icon: <RefreshCw size={20} />,
        title: isZh ? '刷新页面' : 'Refresh Page',
        desc: isZh ? '尝试刷新页面以重新加载应用' : 'Try refreshing the page to reload the app',
        action: () => window.location.reload(),
      });
    }

    // Always add clear cache suggestion
    suggestions.push({
      icon: <Trash2 size={20} />,
      title: isZh ? '清除缓存' : 'Clear Cache',
      desc: isZh ? '清除浏览器缓存可能解决某些问题' : 'Clearing browser cache may resolve some issues',
      action: () => {
        if (confirm(isZh ? '确定要清除缓存吗？这将清除所有本地数据。' : 'Are you sure you want to clear cache? This will remove all local data.')) {
          try {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          } catch (e) {
            console.error('Failed to clear cache:', e);
          }
        }
      },
    });

    return suggestions;
  };

  const suggestions = getSuggestions();

  return (
    <div className="mt-6 space-y-3">
      <h3 className={clsx(
        "text-sm font-semibold mb-3",
        isDark ? "text-white" : "text-black"
      )}>
        {isZh ? '建议的解决方案' : 'Suggested Solutions'}
      </h3>
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className={clsx(
            "p-4 rounded-lg border transition-all",
            isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-gray-50 border-black/10 hover:bg-gray-100",
            suggestion.action && "cursor-pointer"
          )}
          onClick={suggestion.action}
        >
          <div className="flex items-start gap-3">
            <div className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              isDark ? "bg-white/10" : "bg-gray-100"
            )}>
              {suggestion.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={clsx(
                "text-sm font-medium mb-1",
                isDark ? "text-white" : "text-black"
              )}>
                {suggestion.title}
              </h4>
              <p className={clsx(
                "text-xs",
                isDark ? "text-white/60" : "text-black/60"
              )}>
                {suggestion.desc}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

