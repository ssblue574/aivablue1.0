import React from 'react';
import { Cloud, CloudOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

export type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline';

interface SyncStatusIndicatorProps {
  status: SyncStatus;
  lastSynced?: Date;
  errorMessage?: string;
  lang?: 'zh' | 'en';
  className?: string;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  status,
  lastSynced,
  errorMessage,
  lang = 'zh',
  className,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isZh = lang === 'zh';

  const getStatusConfig = () => {
    switch (status) {
      case 'synced':
        return {
          icon: CheckCircle2,
          color: isDark ? 'text-green-400' : 'text-green-600',
          bg: isDark ? 'bg-green-500/20' : 'bg-green-50',
          border: isDark ? 'border-green-500/50' : 'border-green-500/50',
          text: isZh ? '已同步' : 'Synced',
        };
      case 'syncing':
        return {
          icon: Loader2,
          color: isDark ? 'text-blue-400' : 'text-blue-600',
          bg: isDark ? 'bg-blue-500/20' : 'bg-blue-50',
          border: isDark ? 'border-blue-500/50' : 'border-blue-500/50',
          text: isZh ? '同步中...' : 'Syncing...',
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: isDark ? 'text-red-400' : 'text-red-600',
          bg: isDark ? 'bg-red-500/20' : 'bg-red-50',
          border: isDark ? 'border-red-500/50' : 'border-red-500/50',
          text: isZh ? '同步失败' : 'Sync failed',
        };
      case 'offline':
        return {
          icon: CloudOff,
          color: isDark ? 'text-gray-400' : 'text-gray-600',
          bg: isDark ? 'bg-gray-500/20' : 'bg-gray-50',
          border: isDark ? 'border-gray-500/50' : 'border-gray-500/50',
          text: isZh ? '离线模式' : 'Offline',
        };
      default:
        return {
          icon: Cloud,
          color: isDark ? 'text-white/40' : 'text-black/40',
          bg: isDark ? 'bg-white/5' : 'bg-gray-50',
          border: isDark ? 'border-white/10' : 'border-black/10',
          text: '',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const formatLastSynced = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return isZh ? '刚刚' : 'Just now';
    if (minutes < 60) return isZh ? `${minutes} 分钟前` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return isZh ? `${hours} 小时前` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return isZh ? `${days} 天前` : `${days}d ago`;
  };

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium',
        config.bg,
        config.border,
        config.color,
        className
      )}
      title={errorMessage || (lastSynced ? formatLastSynced(lastSynced) : '')}
    >
      <Icon
        size={14}
        className={clsx(
          status === 'syncing' && 'animate-spin'
        )}
      />
      <span>{config.text}</span>
      {lastSynced && status === 'synced' && (
        <span className={clsx(
          'text-[10px]',
          isDark ? 'text-white/40' : 'text-black/40'
        )}>
          {formatLastSynced(lastSynced)}
        </span>
      )}
    </div>
  );
};

