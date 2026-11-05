import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, Clock, Zap, AlertCircle, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { performanceMonitor, PerformanceReport } from '../utils/performanceMonitor';

interface PerformanceDashboardProps {
  lang?: 'zh' | 'en';
  onClose?: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  lang = 'zh',
  onClose,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isZh = lang === 'zh';
  const [report, setReport] = useState<PerformanceReport | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Get initial report
    setReport(performanceMonitor.generateReport());

    // Subscribe to updates
    const unsubscribe = performanceMonitor.onReport((newReport) => {
      setReport(newReport);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getScoreColor = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return isDark ? 'text-white/40' : 'text-black/40';
    if (value <= thresholds.good) return 'text-green-500';
    if (value <= thresholds.poor) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (value: number | null, thresholds: { good: number; poor: number }) => {
    if (value === null) return isZh ? '未测量' : 'Not measured';
    if (value <= thresholds.good) return isZh ? '良好' : 'Good';
    if (value <= thresholds.poor) return isZh ? '需改进' : 'Needs improvement';
    return isZh ? '差' : 'Poor';
  };

  if (!isOpen) return null;

  return (
    <div className={clsx(
      "fixed bottom-6 left-6 z-50 w-96 max-h-[80vh] rounded-2xl shadow-2xl border overflow-hidden",
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
          <Activity size={20} />
          <h3 className={clsx(
            "font-semibold",
            isDark ? "text-white" : "text-black"
          )}>
            {isZh ? '性能监控' : 'Performance Monitor'}
          </h3>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            onClose?.();
          }}
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {report && (
          <>
            {/* Web Vitals */}
            <div>
              <h4 className={clsx(
                "text-sm font-semibold mb-3",
                isDark ? "text-white" : "text-black"
              )}>
                {isZh ? '核心 Web 指标' : 'Core Web Vitals'}
              </h4>
              <div className="space-y-2">
                {/* FCP */}
                <div className={clsx(
                  "p-3 rounded-lg",
                  isDark ? "bg-white/5" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={clsx(
                      "text-xs font-medium",
                      isDark ? "text-white/80" : "text-black/80"
                    )}>
                      FCP
                    </span>
                    <span className={clsx(
                      "text-xs font-semibold",
                      getScoreColor(report.fcp, { good: 1800, poor: 3000 })
                    )}>
                      {report.fcp ? `${Math.round(report.fcp)}ms` : '-'}
                    </span>
                  </div>
                  <div className={clsx(
                    "text-xs",
                    getScoreColor(report.fcp, { good: 1800, poor: 3000 })
                  )}>
                    {getScoreLabel(report.fcp, { good: 1800, poor: 3000 })}
                  </div>
                </div>

                {/* LCP */}
                <div className={clsx(
                  "p-3 rounded-lg",
                  isDark ? "bg-white/5" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={clsx(
                      "text-xs font-medium",
                      isDark ? "text-white/80" : "text-black/80"
                    )}>
                      LCP
                    </span>
                    <span className={clsx(
                      "text-xs font-semibold",
                      getScoreColor(report.lcp, { good: 2500, poor: 4000 })
                    )}>
                      {report.lcp ? `${Math.round(report.lcp)}ms` : '-'}
                    </span>
                  </div>
                  <div className={clsx(
                    "text-xs",
                    getScoreColor(report.lcp, { good: 2500, poor: 4000 })
                  )}>
                    {getScoreLabel(report.lcp, { good: 2500, poor: 4000 })}
                  </div>
                </div>

                {/* FID */}
                <div className={clsx(
                  "p-3 rounded-lg",
                  isDark ? "bg-white/5" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={clsx(
                      "text-xs font-medium",
                      isDark ? "text-white/80" : "text-black/80"
                    )}>
                      FID
                    </span>
                    <span className={clsx(
                      "text-xs font-semibold",
                      getScoreColor(report.fid, { good: 100, poor: 300 })
                    )}>
                      {report.fid ? `${Math.round(report.fid)}ms` : '-'}
                    </span>
                  </div>
                  <div className={clsx(
                    "text-xs",
                    getScoreColor(report.fid, { good: 100, poor: 300 })
                  )}>
                    {getScoreLabel(report.fid, { good: 100, poor: 300 })}
                  </div>
                </div>

                {/* CLS */}
                <div className={clsx(
                  "p-3 rounded-lg",
                  isDark ? "bg-white/5" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={clsx(
                      "text-xs font-medium",
                      isDark ? "text-white/80" : "text-black/80"
                    )}>
                      CLS
                    </span>
                    <span className={clsx(
                      "text-xs font-semibold",
                      getScoreColor(report.cls, { good: 0.1, poor: 0.25 })
                    )}>
                      {report.cls !== null ? report.cls.toFixed(3) : '-'}
                    </span>
                  </div>
                  <div className={clsx(
                    "text-xs",
                    getScoreColor(report.cls, { good: 0.1, poor: 0.25 })
                  )}>
                    {getScoreLabel(report.cls, { good: 0.1, poor: 0.25 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Timing */}
            {report.ttfb !== null && (
              <div>
                <h4 className={clsx(
                  "text-sm font-semibold mb-3",
                  isDark ? "text-white" : "text-black"
                )}>
                  {isZh ? '导航时间' : 'Navigation Timing'}
                </h4>
                <div className={clsx(
                  "p-3 rounded-lg",
                  isDark ? "bg-white/5" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between">
                    <span className={clsx(
                      "text-xs font-medium",
                      isDark ? "text-white/80" : "text-black/80"
                    )}>
                      TTFB
                    </span>
                    <span className={clsx(
                      "text-xs font-semibold",
                      getScoreColor(report.ttfb, { good: 200, poor: 500 })
                    )}>
                      {Math.round(report.ttfb)}ms
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Metrics */}
            <div>
              <h4 className={clsx(
                "text-sm font-semibold mb-3",
                isDark ? "text-white" : "text-black"
              )}>
                {isZh ? '最近指标' : 'Recent Metrics'}
              </h4>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {report.metrics.slice(-10).reverse().map((metric, index) => (
                  <div
                    key={index}
                    className={clsx(
                      "p-2 rounded text-xs flex items-center justify-between",
                      isDark ? "bg-white/5" : "bg-gray-50"
                    )}
                  >
                    <span className={clsx(
                      isDark ? "text-white/60" : "text-black/60"
                    )}>
                      {metric.name}
                    </span>
                    <span className={clsx(
                      "font-medium",
                      isDark ? "text-white" : "text-black"
                    )}>
                      {metric.value.toFixed(metric.type === 'custom' ? 2 : 0)}
                      {metric.type === 'custom' && metric.name.includes('Memory') ? 'MB' : 'ms'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

