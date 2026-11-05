import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { clsx } from 'clsx';
import { ErrorRecoverySuggestions } from './ErrorRecoverySuggestions';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // You could also log to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
    
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  }

  private handleReload = () => {
    window.location.reload();
  }

  private handleGoHome = () => {
    window.location.href = '/';
  }

  public render() {
    if (this.state.hasError) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                     document.body.style.backgroundColor === '#000000';
      
      return (
        <div className={clsx(
          "min-h-screen flex flex-col items-center justify-center p-6",
          isDark ? "bg-black text-white" : "bg-[#f5f5f7] text-black"
        )}>
          <div className={clsx(
            "max-w-2xl w-full rounded-2xl p-8 border",
            isDark ? "bg-[#1c1c1e] border-white/10" : "bg-white border-black/10"
          )}>
            {/* Error Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isDark ? "bg-red-500/20" : "bg-red-50"
              )}>
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <div>
                <h1 className={clsx(
                  "text-2xl font-bold",
                  isDark ? "text-white" : "text-black"
                )}>
                  出现错误
                </h1>
                <p className={clsx(
                  "text-sm mt-1",
                  isDark ? "text-white/60" : "text-black/60"
                )}>
                  应用遇到了一个问题
                </p>
              </div>
            </div>

            {/* Error Message */}
            <div className={clsx(
              "p-4 rounded-lg mb-6",
              isDark ? "bg-white/5" : "bg-gray-50"
            )}>
              <p className={clsx(
                "text-sm font-medium mb-2",
                isDark ? "text-white" : "text-black"
              )}>
                错误信息：
              </p>
              <p className={clsx(
                "text-sm",
                isDark ? "text-white/80" : "text-black/80"
              )}>
                {this.state.error?.message || '未知错误'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={this.handleReset}
                className={clsx(
                  "flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                  "hover:scale-105 active:scale-95",
                  isDark 
                    ? "bg-white text-black hover:bg-white/90" 
                    : "bg-black text-white hover:bg-black/90"
                )}
              >
                <RefreshCw size={18} />
                重试
              </button>
              <button
                onClick={this.handleReload}
                className={clsx(
                  "flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border",
                  "hover:scale-105 active:scale-95",
                  isDark 
                    ? "bg-transparent border-white/20 text-white hover:bg-white/10" 
                    : "bg-transparent border-black/20 text-black hover:bg-black/10"
                )}
              >
                <RefreshCw size={18} />
                重新加载页面
              </button>
              <button
                onClick={this.handleGoHome}
                className={clsx(
                  "flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border",
                  "hover:scale-105 active:scale-95",
                  isDark 
                    ? "bg-transparent border-white/20 text-white hover:bg-white/10" 
                    : "bg-transparent border-black/20 text-black hover:bg-black/10"
                )}
              >
                <Home size={18} />
                返回首页
              </button>
            </div>

            {/* Error Details (Collapsible) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={clsx(
                "mt-6 p-4 rounded-lg border",
                isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-black/10"
              )}>
                <summary className={clsx(
                  "cursor-pointer font-medium mb-3 flex items-center gap-2",
                  isDark ? "text-white/80" : "text-black/80"
                )}>
                  <Bug size={16} />
                  错误详情（开发模式）
                </summary>
                <pre className={clsx(
                  "text-xs p-4 rounded overflow-auto max-h-64",
                  isDark ? "bg-black/50 text-red-400" : "bg-gray-100 text-red-600"
                )}>
                  {this.state.error.stack}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      Component Stack:
                      {'\n'}
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}

            {/* Recovery Suggestions */}
            <ErrorRecoverySuggestions 
              error={this.state.error}
              isDark={isDark}
              lang="zh"
            />

            {/* Help Text */}
            <p className={clsx(
              "text-xs text-center mt-6",
              isDark ? "text-white/40" : "text-black/40"
            )}>
              如果问题持续存在，请刷新页面或联系支持团队
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
