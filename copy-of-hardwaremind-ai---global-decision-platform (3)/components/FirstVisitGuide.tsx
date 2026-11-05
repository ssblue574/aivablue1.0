import React, { useEffect, useState } from 'react';
import { X, Sparkles, Search, Heart, Zap, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';
import { createPortal } from 'react-dom';

interface FirstVisitGuideProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'zh' | 'en';
}

export const FirstVisitGuide: React.FC<FirstVisitGuideProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isZh = lang === 'zh';
  const [currentStep, setCurrentStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const steps = [
    {
      icon: Sparkles,
      title: isZh ? '欢迎来到 Aiva' : 'Welcome to Aiva',
      description: isZh
        ? '发现全球最新硬件产品，获取 AI 驱动的购买建议'
        : 'Discover the latest hardware products worldwide with AI-powered buying advice',
    },
    {
      icon: Search,
      title: isZh ? '智能搜索' : 'Smart Search',
      description: isZh
        ? '使用 Ctrl+K 或 / 快速搜索产品，支持搜索历史和智能建议'
        : 'Press Ctrl+K or / to search quickly, with search history and smart suggestions',
    },
    {
      icon: Heart,
      title: isZh ? '收藏与对比' : 'Favorites & Compare',
      description: isZh
        ? '收藏喜欢的产品，选择最多 3 款进行 AI 对比分析'
        : 'Save favorite products and compare up to 3 items with AI analysis',
    },
    {
      icon: Zap,
      title: isZh ? '快捷键' : 'Keyboard Shortcuts',
      description: isZh
        ? 'Ctrl+H 首页 | Ctrl+P 产品 | Ctrl+F 收藏 | Esc 关闭弹窗'
        : 'Ctrl+H Home | Ctrl+P Products | Ctrl+F Favorites | Esc Close',
    },
  ];

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
      aria-describedby="guide-description"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* Guide Card */}
      <div
        className={clsx(
          'relative max-w-md w-full rounded-2xl p-8 border shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-300',
          isDark ? 'bg-[#1c1c1e] border-white/10' : 'bg-white border-black/10'
        )}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className={clsx(
            'absolute top-4 right-4 p-2 rounded-lg transition-all',
            'hover:scale-110 active:scale-95',
            isDark
              ? 'text-white/60 hover:text-white hover:bg-white/10'
              : 'text-black/60 hover:text-black hover:bg-black/10'
          )}
          aria-label={isZh ? '关闭' : 'Close'}
        >
          <X size={20} />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={clsx(
                'h-1.5 rounded-full transition-all',
                index === currentStep
                  ? isDark
                    ? 'bg-[#00FFC6] w-8'
                    : 'bg-[#0071E3] w-8'
                  : isDark
                  ? 'bg-white/20 w-1.5'
                  : 'bg-black/20 w-1.5'
              )}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Icon */}
        <div
          className={clsx(
            'w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto',
            isDark ? 'bg-[#00FFC6]/20' : 'bg-[#0071E3]/20'
          )}
        >
          <Icon
            size={32}
            className={isDark ? 'text-[#00FFC6]' : 'text-[#0071E3]'}
          />
        </div>

        {/* Content */}
        <h2
          id="guide-title"
          className={clsx(
            'text-2xl font-bold text-center mb-3',
            isDark ? 'text-white' : 'text-black'
          )}
        >
          {currentStepData.title}
        </h2>
        <p
          id="guide-description"
          className={clsx(
            'text-center mb-8 leading-relaxed',
            isDark ? 'text-white/70' : 'text-black/70'
          )}
        >
          {currentStepData.description}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className={clsx(
                'flex-1 px-6 py-3 rounded-xl font-medium transition-all border',
                isDark
                  ? 'bg-transparent border-white/20 text-white hover:bg-white/10'
                  : 'bg-transparent border-black/20 text-black hover:bg-black/10'
              )}
            >
              {isZh ? '上一步' : 'Previous'}
            </button>
          )}
          <button
            onClick={handleNext}
            className={clsx(
              'flex-1 px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2',
              'hover:scale-105 active:scale-95',
              isDark
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-black text-white hover:bg-black/90'
            )}
          >
            {currentStep === steps.length - 1
              ? isZh
                ? '开始使用'
                : 'Get Started'
              : isZh
              ? '下一步'
              : 'Next'}
            {currentStep < steps.length - 1 && <ArrowRight size={18} />}
          </button>
        </div>

        {/* Skip Link */}
        <button
          onClick={handleSkip}
          className={clsx(
            'w-full mt-4 text-sm text-center transition-colors',
            isDark ? 'text-white/50 hover:text-white' : 'text-black/50 hover:text-black'
          )}
        >
          {isZh ? '跳过引导' : 'Skip guide'}
        </button>
      </div>
    </div>,
    document.body
  );
};

