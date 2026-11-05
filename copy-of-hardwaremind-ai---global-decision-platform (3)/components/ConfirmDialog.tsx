import React from 'react';
import { AlertTriangle, Trash2, X, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { FuturisticModal } from './FuturisticModal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: React.ReactNode;
  lang?: 'zh' | 'en';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'warning',
  icon,
  lang = 'zh',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isZh = lang === 'zh';

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          iconBg: isDark ? 'bg-red-500/20' : 'bg-red-50',
          iconColor: 'text-red-500',
          confirmBg: isDark ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700',
          confirmText: 'text-white',
        };
      case 'warning':
        return {
          iconBg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-50',
          iconColor: 'text-yellow-500',
          confirmBg: isDark ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-yellow-600 hover:bg-yellow-700',
          confirmText: 'text-white',
        };
      default:
        return {
          iconBg: isDark ? 'bg-blue-500/20' : 'bg-blue-50',
          iconColor: 'text-blue-500',
          confirmBg: isDark ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700',
          confirmText: 'text-white',
        };
    }
  };

  const styles = getVariantStyles();
  const DefaultIcon = variant === 'danger' ? Trash2 : AlertTriangle;

  return (
    <FuturisticModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      closeOnBackdropClick={true}
    >
      <div className="p-6 space-y-6">
        {/* Icon and Message */}
        <div className="flex items-start gap-4">
          <div className={clsx(
            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
            styles.iconBg
          )}>
            {icon || <DefaultIcon size={24} className={styles.iconColor} />}
          </div>
          <div className="flex-1">
            <p className={clsx(
              "leading-relaxed",
              isDark ? "text-white/90" : "text-black/90"
            )}>
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={clsx(
              "flex-1 px-6 py-3 rounded-xl font-medium transition-all border",
              "hover:scale-105 active:scale-95",
              isDark
                ? "bg-transparent border-white/20 text-white hover:bg-white/10"
                : "bg-transparent border-black/20 text-black hover:bg-black/10"
            )}
          >
            {cancelText || (isZh ? '取消' : 'Cancel')}
          </button>
          <button
            onClick={handleConfirm}
            className={clsx(
              "flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
              "hover:scale-105 active:scale-95",
              styles.confirmBg,
              styles.confirmText
            )}
          >
            <Check size={18} />
            {confirmText || (isZh ? '确认' : 'Confirm')}
          </button>
        </div>
      </div>
    </FuturisticModal>
  );
};

