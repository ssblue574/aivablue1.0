import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className={clsx(
        "fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg transition-all duration-300",
        "hover:scale-110 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        isDark
          ? "bg-white/10 backdrop-blur-md text-white hover:bg-white/20 focus:ring-[#00FFC6] border border-white/20"
          : "bg-white text-black hover:bg-gray-50 focus:ring-[#0071E3] border border-gray-200 shadow-xl"
      )}
      aria-label="返回顶部"
      title="返回顶部"
    >
      <ArrowUp size={20} strokeWidth={2} />
    </button>
  );
};
