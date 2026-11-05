import React, { useState } from 'react';
import { History, Undo2, Redo2, X, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { Action } from '../hooks/useActionHistory';

interface ActionHistoryPanelProps {
  actions: Action[];
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear?: () => void;
  lang?: 'zh' | 'en';
}

export const ActionHistoryPanel: React.FC<ActionHistoryPanelProps> = ({
  actions,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  lang = 'zh',
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isZh = lang === 'zh';
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 10) return isZh ? '刚刚' : 'Just now';
    if (seconds < 60) return isZh ? `${seconds}秒前` : `${seconds}s ago`;
    if (minutes < 60) return isZh ? `${minutes}分钟前` : `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return isZh ? `${hours}小时前` : `${hours}h ago`;
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "fixed bottom-20 right-6 z-40 p-3 rounded-full shadow-lg transition-all",
          "hover:scale-110 active:scale-95",
          isDark
            ? "bg-[#1c1c1e] text-white border border-white/10 hover:bg-[#2c2c2e]"
            : "bg-white text-black border border-black/10 hover:bg-gray-50",
          "flex items-center justify-center"
        )}
        aria-label={isZh ? '操作历史' : 'Action History'}
        title={isZh ? '操作历史' : 'Action History'}
      >
        <History size={20} />
        {actions.length > 0 && (
          <span className={clsx(
            "absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center",
            isDark ? "bg-[#00FFC6] text-black" : "bg-[#0071e3] text-white"
          )}>
            {actions.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className={clsx(
          "fixed bottom-20 right-6 z-50 w-80 max-h-96 rounded-2xl shadow-2xl border overflow-hidden",
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
              <History size={18} />
              <h3 className={clsx(
                "font-semibold",
                isDark ? "text-white" : "text-black"
              )}>
                {isZh ? '操作历史' : 'Action History'}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={clsx(
                  "p-1.5 rounded-lg transition-all",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/10 text-black"
                )}
                title={isZh ? '撤销' : 'Undo'}
              >
                <Undo2 size={16} />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={clsx(
                  "p-1.5 rounded-lg transition-all",
                  "disabled:opacity-30 disabled:cursor-not-allowed",
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/10 text-black"
                )}
                title={isZh ? '重做' : 'Redo'}
              >
                <Redo2 size={16} />
              </button>
              {onClear && (
                <button
                  onClick={onClear}
                  className={clsx(
                    "p-1.5 rounded-lg transition-all",
                    isDark
                      ? "hover:bg-white/10 text-white"
                      : "hover:bg-black/10 text-black"
                  )}
                  title={isZh ? '清空历史' : 'Clear History'}
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "p-1.5 rounded-lg transition-all",
                  isDark
                    ? "hover:bg-white/10 text-white"
                    : "hover:bg-black/10 text-black"
                )}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Actions List */}
          <div className="flex-1 overflow-y-auto">
            {actions.length === 0 ? (
              <div className={clsx(
                "p-8 text-center",
                isDark ? "text-white/40" : "text-black/40"
              )}>
                <History size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {isZh ? '暂无操作历史' : 'No action history'}
                </p>
              </div>
            ) : (
              <div className="p-2">
                {actions.map((action, index) => (
                  <div
                    key={action.id}
                    className={clsx(
                      "p-3 rounded-lg mb-1 transition-all cursor-pointer",
                      index === 0
                        ? isDark
                          ? "bg-white/10"
                          : "bg-black/5"
                        : isDark
                        ? "hover:bg-white/5"
                        : "hover:bg-black/5"
                    )}
                    onClick={() => {
                      // Click to undo/redo to this point
                      // This is a simplified version - could be enhanced
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={clsx(
                          "text-sm font-medium mb-1",
                          isDark ? "text-white" : "text-black"
                        )}>
                          {action.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Clock size={12} className={clsx(
                            isDark ? "text-white/40" : "text-black/40"
                          )} />
                          <span className={clsx(
                            "text-xs",
                            isDark ? "text-white/40" : "text-black/40"
                          )}>
                            {formatTime(action.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

