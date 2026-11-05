import React, { useState } from 'react';
import { Accessibility, X, Type, Contrast, Volume2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { useAccessibility } from '../hooks/useAccessibility';

interface AccessibilityPanelProps {
  lang?: 'zh' | 'en';
  onClose?: () => void;
  inline?: boolean; // If true, render as inline component instead of fixed position
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  lang = 'zh',
  onClose,
  inline = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isZh = lang === 'zh';
  const { settings, setFontSize, toggleHighContrast, announce } = useAccessibility();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className={clsx(
      inline 
        ? "w-full rounded-2xl border overflow-hidden"
        : "fixed bottom-6 right-6 z-50 w-80 max-h-[80vh] rounded-2xl shadow-2xl border overflow-hidden",
      "flex flex-col",
      isDark
        ? "bg-[#1c1c1e] border-white/10"
        : "bg-white border-black/10"
    )}>
      {/* Header */}
      <div className={clsx(
        "flex items-center justify-between p-4 border-b",
        isDark ? "border-white/10" : "border-black/10"
      )}>
        <div className="flex items-center gap-2">
          <Accessibility size={20} />
          <h3 className={clsx(
            "font-semibold",
            isDark ? "text-white" : "text-black"
          )}>
            {isZh ? '无障碍设置' : 'Accessibility Settings'}
          </h3>
        </div>
        <button
          onClick={handleClose}
          className={clsx(
            "p-1.5 rounded-lg transition-all",
            isDark
              ? "hover:bg-white/10 text-white"
              : "hover:bg-black/10 text-black"
          )}
          aria-label={isZh ? '关闭' : 'Close'}
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Font Size */}
        <div>
          <label className={clsx(
            "text-sm font-medium mb-2 block flex items-center gap-2",
            isDark ? "text-white" : "text-black"
          )}>
            <Type size={16} />
            {isZh ? '字体大小' : 'Font Size'}
          </label>
          <div className="flex gap-2">
            {(['normal', 'large', 'xlarge'] as const).map((size) => (
              <button
                key={size}
                onClick={() => {
                  setFontSize(size);
                  announce(isZh ? `字体大小已设置为${size === 'normal' ? '正常' : size === 'large' ? '大' : '超大'}` : `Font size set to ${size}`);
                }}
                className={clsx(
                  "flex-1 px-4 py-2 rounded-lg font-medium transition-all",
                  settings.fontSize === size
                    ? isDark
                      ? "bg-[#00FFC6] text-black"
                      : "bg-[#0071e3] text-white"
                    : isDark
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : "bg-gray-100 text-black hover:bg-gray-200"
                )}
              >
                {size === 'normal' ? (isZh ? '正常' : 'Normal') :
                 size === 'large' ? (isZh ? '大' : 'Large') :
                 (isZh ? '超大' : 'X-Large')}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div>
          <label className={clsx(
            "text-sm font-medium mb-2 block flex items-center gap-2",
            isDark ? "text-white" : "text-black"
          )}>
            <Contrast size={16} />
            {isZh ? '高对比度' : 'High Contrast'}
          </label>
          <button
            onClick={() => {
              toggleHighContrast();
              announce(settings.highContrast 
                ? (isZh ? '高对比度已关闭' : 'High contrast disabled')
                : (isZh ? '高对比度已开启' : 'High contrast enabled')
              );
            }}
            className={clsx(
              "w-full px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-between",
              settings.highContrast
                ? isDark
                  ? "bg-[#00FFC6] text-black"
                  : "bg-[#0071e3] text-white"
                : isDark
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-gray-100 text-black hover:bg-gray-200"
            )}
          >
            <span>{isZh ? '高对比度模式' : 'High Contrast Mode'}</span>
            <span className={clsx(
              "w-12 h-6 rounded-full relative transition-all",
              settings.highContrast
                ? isDark ? "bg-black/30" : "bg-white/30"
                : isDark ? "bg-white/20" : "bg-black/20"
            )}>
              <span className={clsx(
                "absolute top-1 left-1 w-4 h-4 rounded-full transition-all",
                settings.highContrast
                  ? "translate-x-6 bg-white"
                  : "translate-x-0 bg-white/60"
              )} />
            </span>
          </button>
        </div>

        {/* Screen Reader Info */}
        {settings.screenReader && (
          <div className={clsx(
            "p-3 rounded-lg flex items-start gap-2",
            isDark ? "bg-blue-500/20" : "bg-blue-50"
          )}>
            <Volume2 size={16} className={clsx(
              "mt-0.5",
              isDark ? "text-blue-400" : "text-blue-600"
            )} />
            <div>
              <p className={clsx(
                "text-sm font-medium mb-1",
                isDark ? "text-blue-300" : "text-blue-900"
              )}>
                {isZh ? '屏幕阅读器已检测到' : 'Screen Reader Detected'}
              </p>
              <p className={clsx(
                "text-xs",
                isDark ? "text-blue-400/80" : "text-blue-700"
              )}>
                {isZh 
                  ? '我们已优化了屏幕阅读器支持' 
                  : 'We have optimized screen reader support'}
              </p>
            </div>
          </div>
        )}

        {/* Reduced Motion Info */}
        {settings.reducedMotion && (
          <div className={clsx(
            "p-3 rounded-lg",
            isDark ? "bg-white/5" : "bg-gray-50"
          )}>
            <p className={clsx(
              "text-xs",
              isDark ? "text-white/60" : "text-black/60"
            )}>
              {isZh 
                ? '已检测到减少动画偏好，动画已优化' 
                : 'Reduced motion preference detected, animations optimized'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

