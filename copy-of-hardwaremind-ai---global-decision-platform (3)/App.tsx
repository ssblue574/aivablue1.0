import { useEditorialFeed } from './hooks/useEditorialFeed';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Send, X } from 'lucide-react';
import { clsx } from 'clsx';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './ThemeContext';
import { ThemeEngineProvider, useThemeEngine } from './theme';
import { Product, AppView, Language, NewsItem, UserProfile } from './data';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CompareView } from './components/CompareView';
import { ProductDetailView } from './components/ProductDetailView';
import { NewsDetailView } from './components/NewsDetailView';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';
import { useAppLogic } from './hooks/useAppLogic';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useFirstVisit } from './hooks/useFirstVisit';
import { usePrefetch } from './hooks/usePrefetch';
import { useSmartPrefetch } from './hooks/useSmartPrefetch';
import { performanceMonitor } from './utils/performanceMonitor';
import { GlobalRadarBackground } from './components/GlobalRadarBackground';
import { ScrollToTop } from './components/ScrollToTop';
import { LoadingAnimation } from './components/LoadingAnimation';
import { AIThinkingIndicator } from './components/AIThinkingIndicator';
import { DynamicInput } from './components/DynamicInput';
import { FuturisticModal } from './components/FuturisticModal';
import { ToastContainer, useToast } from './components/Toast';
import { FirstVisitGuide } from './components/FirstVisitGuide';
import { CompareBar } from './components/CompareBar';
import { ActionHistoryPanel } from './components/ActionHistoryPanel';
import { PerformanceDashboard } from './components/PerformanceDashboard';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { supabase, logEvent } from './services/supabaseService';
import { updateSEO, addStructuredData, generateOrganizationStructuredData } from './utils/seo';
import { useNotifications } from './hooks/useNotifications';
import { useAutoTheme } from './hooks/useAutoTheme';
import { useActionHistory } from './hooks/useActionHistory';
import { usePWA } from './hooks/usePWA';
import { useOfflineSync } from './hooks/useOfflineSync';
import { preventDoubleTapZoom } from './utils/touchOptimization';
import { zh } from './locales/zh';
import { en } from './locales/en';
import { WifiOff, Wifi, Search as SearchIcon, Command } from 'lucide-react';

// Lazy load large view components for better performance
const ProductsView = lazy(() => import('./components/ProductsView').then(m => ({ default: m.ProductsView })));
const KeynoteView = lazy(() => import('./components/KeynoteView').then(m => ({ default: m.KeynoteView })));
const CommunityView = lazy(() => import('./components/CommunityView').then(m => ({ default: m.CommunityView })));
const MilestonesView = lazy(() => import('./components/MilestonesView').then(m => ({ default: m.MilestonesView })));
const AdminView = lazy(() => import('./components/AdminView').then(m => ({ default: m.AdminView })));
const TrendingView = lazy(() => import('./components/TrendingView').then(m => ({ default: m.TrendingView })));
const RoundtableView = lazy(() => import('./components/RoundtableView').then(m => ({ default: m.RoundtableView })));
const LabView = lazy(() => import('./components/LabView').then(m => ({ default: m.LabView })));

// --- TRANSLATIONS ---
// --- TRANSLATIONS ---
const TRANSLATIONS = {
  zh,
  en
};

interface ProductDetailRouteProps {
  products: Product[];
  milestones: Product[];
  selectedProducts: Product[];
  toggleSelection: (product: Product) => void;
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  t: (key: any) => string;
  lang: Language;
  posts: any[];
  userPersona: 'consumer' | 'geek';
}

interface NewsDetailRouteProps {
  newsFeed: NewsItem[];
  t: (key: any) => string;
  lang: Language;
}

const ProductDetailRoute: React.FC<ProductDetailRouteProps> = ({
  products,
  milestones,
  selectedProducts,
  toggleSelection,
  favorites,
  toggleFavorite,
  t,
  lang,
  posts
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Search in both lists
  const product = products.find(p => p.id === id) || milestones.find(p => p.id === id);

  // Fallback for finding by name if ID fails (for robustness)
  const productByName = !product ? (products.find(p => p.name === id) || milestones.find(p => p.name === id)) : null;
  const targetProduct = product || productByName;

  const related = products.slice(0, 3); // Simple related logic for now

  if (!targetProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-black text-white rounded-full">Go Back</button>
      </div>
    );
  }

  return (
    <ProductDetailView
      product={targetProduct}
      related={related}
      selectedProducts={selectedProducts}
      onBack={() => {
        if (window.history.length > 1) navigate(-1);
        else navigate('/products');
      }}
      onViewProduct={(p) => navigate(`/products/${p.id}`)}
      onToggleSelect={toggleSelection}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
      t={t}
      lang={lang}
      posts={posts}
    />
  );
};

const NewsDetailRoute: React.FC<NewsDetailRouteProps> = ({ newsFeed, t, lang }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const news = newsFeed.find(n => n.id === id);

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">{lang === 'zh' ? '新闻未找到' : 'News Not Found'}</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-black text-white rounded-full">
          {lang === 'zh' ? '返回' : 'Go Back'}
        </button>
      </div>
    );
  }

  return (
    <NewsDetailView
      news={news}
      onBack={() => {
        if (window.history.length > 1) navigate(-1);
        else navigate('/');
      }}
      t={t}
      lang={lang}
    />
  );
};

const AppContent: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();

  // Auto theme switching
  useAutoTheme(true);

  // Notifications
  const notifications = useNotifications();

  // SEO optimization
  useEffect(() => {
    // Add organization structured data
    addStructuredData(generateOrganizationStructuredData());

    // Update SEO based on current route
    const updateRouteSEO = () => {
      const path = location.pathname;
      if (path === '/') {
        updateSEO({
          title: 'HardwareMind - AI-Powered Global Decision Platform',
          description: 'Discover and compare the latest hardware products with AI-powered insights',
          keywords: ['hardware', 'products', 'AI', 'comparison', 'reviews'],
          url: window.location.href,
          type: 'website',
        });
      } else if (path.startsWith('/products')) {
        updateSEO({
          title: 'Products - HardwareMind',
          description: 'Browse and compare hardware products',
          url: window.location.href,
          type: 'website',
        });
      } else if (path.startsWith('/compare')) {
        updateSEO({
          title: 'Compare Products - HardwareMind',
          description: 'Compare hardware products side by side',
          url: window.location.href,
          type: 'website',
        });
      }
    };

    updateRouteSEO();
  }, [location.pathname]);

  // Global State
  const [lang, setLang] = useState<Language>('zh');
  const [userPersona, setUserPersona] = useState<'consumer' | 'geek'>('consumer');

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authStep, setAuthStep] = useState<'email' | 'otp'>('email');
  const [authOtp, setAuthOtp] = useState('');
  const [isAuthSending, setIsAuthSending] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  // Translation Helper
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key];

  // Toast hook
  const toast = useToast();

  // Online status detection
  const { isOnline, wasOffline } = useOnlineStatus();

  // Sync Theme with DOM for Global Styles (Scrollbar, Selection)
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#000000';
    } else {
      root.setAttribute('data-theme', 'light');
      document.body.style.backgroundColor = '#f5f5f7';
    }
  }, [isDark]);

  // Global page view tracking on route change
  useEffect(() => {
    logEvent('page_view', {
      path: location.pathname,
    });
  }, [location.pathname]);

  // Handle online/offline status changes
  useEffect(() => {
    if (!isOnline) {
      toast.error(
        lang === 'zh'
          ? '网络连接已断开，部分功能可能不可用'
          : 'Network connection lost, some features may be unavailable',
        5000
      );
    } else if (wasOffline) {
      toast.success(
        lang === 'zh'
          ? '网络连接已恢复'
          : 'Network connection restored',
        3000
      );
    }
  }, [isOnline, wasOffline, lang, toast]);

  // First visit detection
  const { isFirstVisit, isLoading: isFirstVisitLoading, markVisitCompleted } = useFirstVisit();
  const [showFirstVisitGuide, setShowFirstVisitGuide] = useState(false);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);

  useEffect(() => {
    if (!isFirstVisitLoading && isFirstVisit) {
      // Show guide after a short delay
      const timer = setTimeout(() => {
        setShowFirstVisitGuide(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, isFirstVisitLoading]);

  // Route prefetching for better performance
  usePrefetch();
  
  // Smart prefetching based on user behavior
  useSmartPrefetch();

  // Initialize performance monitoring
  useEffect(() => {
    // Monitor route changes
    const unsubscribe = performanceMonitor.onReport((report) => {
      // Log performance issues in development
      if (process.env.NODE_ENV === 'development') {
        if (report.lcp && report.lcp > 4000) {
          console.warn('⚠️ LCP is slow:', report.lcp, 'ms');
        }
        if (report.fid && report.fid > 300) {
          console.warn('⚠️ FID is slow:', report.fid, 'ms');
        }
        if (report.cls && report.cls > 0.25) {
          console.warn('⚠️ CLS is high:', report.cls);
        }
      }
    });

    // Keyboard shortcut for performance dashboard (Ctrl+Shift+P)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'development' && 
          (e.ctrlKey || e.metaKey) && 
          e.shiftKey && 
          e.key === 'P') {
        e.preventDefault();
        setShowPerformanceDashboard(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Action history for undo/redo
  const actionHistory = useActionHistory();

  // PWA support
  const pwa = usePWA();
  
  // Register service worker on mount
  useEffect(() => {
    pwa.registerServiceWorker();
  }, [pwa]);

  // Offline sync
  const offlineSync = useOfflineSync(lang);

  // Optimize touch experience
  useEffect(() => {
    preventDoubleTapZoom();
  }, []);

  // Initialize auth state once on mount
  useEffect(() => {
    const initAuth = async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const meta = data.user.user_metadata || {};
        setCurrentUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: meta.name as string | undefined,
          avatarUrl: (meta.avatar_url as string) || undefined,
          bio: meta.bio as string | undefined,
        });
      }
    };
    initAuth();
  }, []);

  const {
    products,
    selectedProducts, toggleSelection,
    favorites, toggleFavorite,
    searchQuery, setSearchQuery, handleSearch, isSearching,
    isComparing, comparisonResult, runComparison,
    activeCategory, setActiveCategory, categories,
    isChatOpen, setIsChatOpen, chatMessages, chatInput, setChatInput, isChatLoading, handleSendChat, chatEndRef,
    keynoteItems, communityPosts, milestones, catalog, latestFiveProducts, handleAddPost, handleUpdatePost, handleDeletePost,
    syncStatus, lastSynced
  } = useAppLogic(lang, t, toast);

  const newsFeed = useEditorialFeed(lang);

  // Helper to handle product view navigation
  const handleViewProduct = (p: Product) => {
    navigate(`/products/${p.id}`);
    // Analytics - view product detail
    logEvent('view_product_detail', {
      productId: p.id,
      from: location.pathname,
    });
  };

  // Wrapper: require login before toggling favorites
  const handleToggleFavorite = (p: Product) => {
    if (!currentUser) {
      setAuthMessage(
        lang === 'zh'
          ? '请先登录后再使用「收藏」功能。你可以在电脑上操作，在手机上收邮件验证码。'
          : 'Please sign in to use favorites. You can operate on desktop and receive the email code on your phone.'
      );
      setAuthStep('email');
      setAuthOtp('');
      setIsAuthModalOpen(true);
      return;
    }
    toggleFavorite(p);
  };

  const handleSendLoginLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!authEmail.trim() || !supabase) {
      toast.error(lang === 'zh' ? '请输入邮箱地址' : 'Please enter your email address');
      return;
    }

    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authEmail.trim())) {
      toast.error(lang === 'zh' ? '请输入有效的邮箱地址' : 'Please enter a valid email address');
      return;
    }

    setIsAuthSending(true);
    setAuthMessage('');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        setAuthMessage(error.message);
        toast.error(
          lang === 'zh'
            ? '发送登录邮件失败，请检查邮箱地址'
            : 'Failed to send login email, please check your email address',
          4000
        );
      } else {
        setAuthMessage(
          lang === 'zh'
            ? '我们已向你的邮箱发送登录邮件，你可以在任意设备上打开邮件查看 6 位验证码。请把验证码填回这里完成登录（也可以直接点邮件里的链接在当前设备登录）。'
            : 'We have sent a sign-in email. Open it on any device, read the 6-digit code and enter it here to complete sign-in (or tap the magic link on that device).'
        );
        toast.success(
          lang === 'zh'
            ? '登录邮件已发送，请查收'
            : 'Login email sent, please check your inbox',
          3000
        );
        setAuthStep('otp');
        setAuthOtp('');
      }
    } finally {
      setIsAuthSending(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!authEmail.trim() || !authOtp.trim() || !supabase) {
      if (!authEmail.trim()) {
        toast.error(lang === 'zh' ? '请输入邮箱地址' : 'Please enter your email address');
      } else if (!authOtp.trim()) {
        toast.error(lang === 'zh' ? '请输入验证码' : 'Please enter the verification code');
      }
      return;
    }

    // 验证 OTP 格式（6位数字）
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(authOtp.trim())) {
      toast.error(lang === 'zh' ? '验证码应为 6 位数字' : 'Verification code must be 6 digits');
      return;
    }

    setIsAuthSending(true);
    setAuthMessage('');
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: authEmail.trim(),
        token: authOtp.trim(),
        type: 'email',
      });
      if (error) {
        setAuthMessage(error.message);
        toast.error(
          lang === 'zh'
            ? '验证码错误，请重新输入'
            : 'Invalid verification code, please try again',
          4000
        );
      } else if (data?.user) {
        const meta = data.user.user_metadata || {};
        setCurrentUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: meta.name as string | undefined,
          avatarUrl: (meta.avatar_url as string) || undefined,
          bio: meta.bio as string | undefined,
        });
        toast.success(
          lang === 'zh'
            ? '登录成功！'
            : 'Login successful!',
          2000
        );
        setIsAuthModalOpen(false);
        setAuthOtp('');
        setAuthMessage('');
        setAuthStep('email');
      }
    } finally {
      setIsAuthSending(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setCurrentUser(null);
    toast.info(
      lang === 'zh'
        ? '已退出登录'
        : 'Logged out successfully',
      2000
    );
  };

  const handleUpdateProfile = async (payload: { name?: string; bio?: string; avatarUrl?: string }) => {
    if (!supabase || !currentUser) return;
    const { data, error } = await supabase.auth.updateUser({
      data: {
        name: payload.name,
        bio: payload.bio,
        avatar_url: payload.avatarUrl,
      },
    });
    if (!error && data?.user) {
      const meta = data.user.user_metadata || {};
      setCurrentUser({
        id: data.user.id,
        email: data.user.email ?? '',
        name: meta.name as string | undefined,
        avatarUrl: (meta.avatar_url as string) || undefined,
        bio: meta.bio as string | undefined,
      });
    }
  };

  return (
    <div className={clsx(
      "w-screen min-h-screen overflow-x-hidden font-sans transition-colors duration-300",
      isDark ? "bg-black text-white" : "bg-[#f5f5f7] text-[#1d1d1f]"
    )}>
      {/* Skip Links for Keyboard Navigation */}
      <a
        href="#main-content"
        className={clsx(
          "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50",
          "px-4 py-2 rounded-lg font-medium transition-all",
          isDark
            ? "bg-[#00FFC6] text-black hover:bg-[#00FFC6]/90"
            : "bg-[#0071e3] text-white hover:bg-[#0077ED]",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          isDark ? "focus:ring-[#00FFC6]" : "focus:ring-[#0071e3]"
        )}
      >
        {lang === 'zh' ? '跳转到主内容' : 'Skip to main content'}
      </a>

      {/* Global & Animation Styles */}
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
        .focus\\:not-sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: 0.5rem 1rem;
          margin: 0;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }
      `}</style>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideUpFade {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-ripple {
          animation: ripple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
        }
        .page-enter {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)'}; }
      `}</style>

      <ScrollToTop />
      <GlobalRadarBackground />
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} position="top-right" />

      {/* First Visit Guide */}
      <FirstVisitGuide
        isOpen={showFirstVisitGuide}
        onClose={() => {
          setShowFirstVisitGuide(false);
          markVisitCompleted();
        }}
        lang={lang}
      />

      {/* Offline Indicator */}
      {!isOnline && (
        <div className={clsx(
          "fixed top-0 left-0 right-0 z-50 px-4 py-2 flex items-center justify-center gap-2",
          "bg-red-500/90 backdrop-blur-md text-white text-sm font-medium"
        )}>
          <WifiOff size={16} />
          <span>{lang === 'zh' ? '网络连接已断开' : 'No internet connection'}</span>
        </div>
      )}

      {/* Smart Compare Bar */}
      <CompareBar
        selectedProducts={selectedProducts}
        onToggleSelect={toggleSelection}
        onClear={() => selectedProducts.forEach(p => toggleSelection(p))}
        lang={lang}
      />

      {/* Action History Panel */}
      <ActionHistoryPanel
        actions={actionHistory.getRecentActions(10)}
        canUndo={actionHistory.canUndo}
        canRedo={actionHistory.canRedo}
        onUndo={actionHistory.undo}
        onRedo={actionHistory.redo}
        onClear={actionHistory.clearHistory}
        lang={lang === 'zh' ? 'zh' : 'en'}
      />

      {/* Performance Dashboard (Development only) */}
      {process.env.NODE_ENV === 'development' && showPerformanceDashboard && (
        <PerformanceDashboard
          lang={lang === 'zh' ? 'zh' : 'en'}
          onClose={() => setShowPerformanceDashboard(false)}
        />
      )}

      {/* PWA Install Prompt */}
      <PWAInstallPrompt lang={lang === 'zh' ? 'zh' : 'en'} />

      <Navbar
        lang={lang}
        setLang={setLang}
        userPersona={userPersona}
        setUserPersona={setUserPersona}
        selectedCount={selectedProducts.length}
        onCompare={() => { runComparison(); navigate('/compare'); }}
        onToggleChat={() => setIsChatOpen(prev => !prev)}
        t={t}
        currentUser={currentUser}
        onLoginClick={() => {
          setIsAuthModalOpen(true);
          setAuthStep('email');
          setAuthOtp('');
          setAuthMessage('');
        }}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={(query) => {
          setSearchQuery(query);
          navigate('/products');
          handleSearch(undefined, query);
        }}
      />

      <main id="main-content" className="min-h-screen pb-20 md:pb-0 relative z-10">
        <div key={location.pathname} className="page-enter">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingAnimation type="neural" size={60} />
            </div>
          }>
            <Routes>
              <Route path="/" element={
                <HomeView
                  t={t}
                  setView={(v) => navigate(v === AppView.HOME ? '/' : `/${v.toLowerCase()}`)}
                  newsFeed={newsFeed}
                  onViewNews={(news) => navigate(`/news/${news.id}`)}
                  milestones={milestones}
                  latestProducts={latestFiveProducts}
                  onViewProduct={handleViewProduct}
                />
              } />

              <Route path="/keynote" element={
                <KeynoteView t={t} keynotes={keynoteItems} />
              } />

              <Route path="/products" element={
                <ProductsView
                  t={t}
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearch={handleSearch}
                  isSearching={isSearching}
                  products={products}
                  selectedProducts={selectedProducts}
                  favorites={favorites}
                  toggleSelection={toggleSelection}
                  onViewProduct={handleViewProduct}
                  toggleFavorite={handleToggleFavorite}
                  lang={lang === 'zh' ? 'zh' : 'en'}
                  userPersona={userPersona}
                />
              } />

              <Route path="/favorites" element={
                <FavoritesView
                  t={t}
                  favorites={favorites}
                  selectedProducts={selectedProducts}
                  toggleSelection={toggleSelection}
                  onViewProduct={handleViewProduct}
                  onToggleFavorite={handleToggleFavorite}
                  lang={lang === 'zh' ? 'zh' : 'en'}
                />
              } />

              <Route path="/community" element={
                <CommunityView
                  t={t}
                  posts={communityPosts}
                  products={products}
                  onViewProduct={handleViewProduct}
                  onAddPost={handleAddPost}
                  onUpdatePost={handleUpdatePost}
                  onDeletePost={handleDeletePost}
                  currentUser={currentUser}
                  lang={lang === 'zh' ? 'zh' : 'en'}
                  syncStatus={syncStatus}
                  lastSynced={lastSynced}
                />
              } />

              <Route path="/trending" element={
                <TrendingView
                  t={t}
                  products={products}
                  onViewProduct={handleViewProduct}
                  lang={lang === 'zh' ? 'zh' : 'en'}
                />
              } />

              <Route path="/roundtable" element={
                <RoundtableView
                  t={t}
                  lang={lang === 'zh' ? 'zh' : 'en'}
                />
              } />

              <Route path="/lab" element={
                <LabView
                  t={t}
                  lang={lang === 'zh' ? 'zh' : 'en'}
                />
              } />

              <Route path="/legacy" element={
                <MilestonesView
                  t={t}
                  milestones={milestones}
                  onViewProduct={handleViewProduct}
                />
              } />

              <Route path="/compare" element={
                <CompareView
                  setView={(v) => navigate('/')} // Back to home on exit
                  isComparing={isComparing}
                  comparisonResult={comparisonResult}
                  selectedProducts={selectedProducts}
                  t={t}
                />
              } />

              <Route path="/profile" element={
                <ProfileView
                  t={t}
                  currentUser={currentUser}
                  onRequireLogin={() => {
                    setIsAuthModalOpen(true);
                    setAuthStep('email');
                    setAuthOtp('');
                    setAuthMessage('');
                  }}
                  onSave={handleUpdateProfile}
                  favoritesCount={favorites.length}
                  onOpenFavorites={() => navigate('/favorites')}
                  onLogout={handleLogout}
                  onSwitchAccount={async () => {
                    await handleLogout();
                    setIsAuthModalOpen(true);
                    setAuthStep('email');
                    setAuthOtp('');
                    setAuthMessage('');
                  }}
                />
              } />

              <Route path="/contact" element={<div className="text-center py-40"><h1 className="text-6xl font-bold">Contact Aiva</h1></div>} />
              <Route path="/admin" element={
                <AdminView
                  t={t}
                  products={products}
                  milestones={milestones}
                  posts={communityPosts}
                  onDeletePost={handleDeletePost}
                  currentUserEmail={currentUser?.email}
                />
              } />

              {/* Dynamic Product Detail Route - Supports /products/:id */}
              <Route path="/products/:id" element={
                <ProductDetailRoute
                  products={products}
                  milestones={milestones}
                  selectedProducts={selectedProducts}
                  toggleSelection={toggleSelection}
                  favorites={favorites}
                  toggleFavorite={handleToggleFavorite}
                  t={t}
                  lang={lang}
                  posts={communityPosts}
                  userPersona={userPersona}
                />
              } />

              {/* Dynamic News Detail Route - Supports /news/:id */}
              <Route path="/news/:id" element={
                <NewsDetailRoute
                  newsFeed={newsFeed}
                  t={t}
                  lang={lang}
                />
              } />

              {/* Redirect legacy enums to paths if necessary, or default to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {/* AIVA Intelligence Sidebar - Jobs Aesthetic Slide-Over */}
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-500",
          isChatOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsChatOpen(false)}
      />

      <div className={clsx(
        "fixed right-0 bottom-0 z-[60] md:z-[45] w-full md:w-[420px] shadow-[-20px_0_40px_rgba(0,0,0,0.15)] transition-transform duration-500 cubic-bezier(0.19, 1, 0.22, 1) flex flex-col overflow-hidden border-l",
        // Enhanced glassmorphic effect
        "backdrop-blur-[40px]",
        isDark
          ? "bg-[#1c1c1e]/90 border-white/10"
          : "bg-white/90 border-black/5",
        isChatOpen ? "translate-x-0" : "translate-x-full",
        "top-0 md:top-14" // Full height on mobile, Panel style on Desktop
      )}
        style={{
          boxShadow: isDark
            ? '-20px 0 40px rgba(0,0,0,0.3), 0 0 60px rgba(0, 255, 198, 0.05)'
            : '-20px 0 40px rgba(0,0,0,0.1), 0 0 60px rgba(0, 113, 227, 0.03)',
        }}
      >
        {/* Header */}
        <div className={clsx(
          "p-5 border-b flex justify-between items-center backdrop-blur-md z-10 shrink-0",
          isDark ? "border-white/5 bg-black/20" : "border-black/5 bg-white/40"
        )}>
          <div className="flex items-center gap-3">
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center shadow-sm",
              isDark ? "bg-white" : "bg-black"
            )}>
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M4 24C4 24 9 12 16 12C23 12 28 24 28 24"
                  stroke={isDark ? "black" : "white"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle
                  cx="16"
                  cy="6"
                  r="3"
                  fill={isDark ? "black" : "white"}
                />
              </svg>
            </div>
            <span className={clsx(
              "font-medium text-sm tracking-wide",
              isDark ? "text-white" : "text-black"
            )}>艾瓦</span>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className={clsx("transition-opacity hover:opacity-70", isDark ? "text-white" : "text-black")}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Chat Body */}
        <div className={clsx(
          "flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth",
          // Helper to make scrollbar invisible but functional or very thin
          "[&::-webkit-scrollbar]:w-1",
          isDark ? "[&::-webkit-scrollbar-thumb]:bg-white/10" : "[&::-webkit-scrollbar-thumb]:bg-black/5"
        )}>
          {chatMessages.map((msg, idx) => (
            <div
              key={idx}
              className={clsx(
                "flex flex-col gap-1",
                msg.role === 'user' ? "items-end" : "items-start"
              )}
              style={{
                animation: 'slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: `${idx * 0.05}s`,
                opacity: 0,
              }}
            >
              <div className={clsx(
                "max-w-[85%] px-5 py-3 text-[15px] rounded-2xl shadow-sm leading-relaxed backdrop-blur-sm",
                msg.role === 'user'
                  ? (isDark ? "bg-white text-black" : "bg-black text-white")
                  : (isDark ? "bg-[#2c2c2e] text-gray-100 border border-white/5" : "bg-white/60 text-gray-900 border border-black/5")
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {/* AI Thinking Indicator */}
          {isChatLoading && (
            <div className="flex justify-start">
              <AIThinkingIndicator
                active={true}
                message={lang === 'zh' ? '思考中...' : 'Thinking...'}
                style="neural"
                size={50}
              />
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendChat} className={clsx(
          "p-5 border-t backdrop-blur-md z-10 shrink-0",
          isDark ? "border-white/5 bg-black/20" : "border-black/5 bg-white/40"
        )}>
          <DynamicInput
            value={chatInput}
            onChange={setChatInput}
            placeholder={lang === 'zh' ? "向 Aiva 提问..." : "Ask Aiva..."}
            glowOnFocus={true}
            floatingLabel={false}
            icon={<Send size={18} />}
            disabled={isChatLoading}
          />
          <div className={clsx("text-[10px] text-center mt-3 font-medium opacity-40", isDark ? "text-white" : "text-black")}>
            {lang === 'zh' ? 'Aiva 智能助手可能出错，重要信息请核实。' : 'AIVA Intelligence may make mistakes. Check important info.'}
          </div>
        </form>
      </div>

      {/* Auth Modal */}
      <FuturisticModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthMessage('');
          setAuthStep('email');
          setAuthOtp('');
        }}
        maxWidth="md"
        showCloseButton={true}
        closeOnBackdropClick={true}
        title={lang === 'zh'
          ? (authStep === 'email' ? '使用邮箱登录 AIVA' : '输入邮箱收到的验证码')
          : (authStep === 'email' ? 'Sign in with Email' : 'Enter the code from your email')}
        subtitle={lang === 'zh' ? '登录' : 'Sign in'}
      >
        <div className="p-6 space-y-4">
          <form
            onSubmit={authStep === 'email' ? handleSendLoginLink : handleVerifyOtp}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className={clsx(
                "text-xs",
                isDark ? "text-white/70" : "text-black/70"
              )}>
                {lang === 'zh' ? '邮箱地址' : 'Email address'}
              </label>
              <input
                type="email"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className={clsx(
                  "w-full px-4 py-3 rounded-2xl border focus:outline-none text-sm",
                  isDark
                    ? "bg-black border-white/15 text-white focus:border-white/40"
                    : "bg-gray-50 border-black/10 text-black focus:border-black/40"
                )}
                placeholder={lang === 'zh' ? 'example@domain.com' : 'example@domain.com'}
                required
              />
            </div>

            {authStep === 'otp' && (
              <div className="space-y-2">
                <label className={clsx(
                  "text-xs",
                  isDark ? "text-white/70" : "text-black/70"
                )}>
                  {lang === 'zh' ? '邮箱中的 6 位验证码' : '6-digit code from your email'}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={authOtp}
                  onChange={e => setAuthOtp(e.target.value)}
                  className={clsx(
                    "w-full px-4 py-3 rounded-2xl border focus:outline-none text-sm tracking-[0.3em] text-center",
                    isDark
                      ? "bg-black border-white/15 text-white focus:border-white/40"
                      : "bg-gray-50 border-black/10 text-black focus:border-black/40"
                  )}
                  placeholder={lang === 'zh' ? '例如：123456' : 'e.g. 123456'}
                />
              </div>
            )}

            {authMessage && (
              <p className={clsx(
                "text-xs",
                isDark ? "text-white/70" : "text-black/70"
              )}>
                {authMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={isAuthSending || !authEmail.trim() || (authStep === 'otp' && !authOtp.trim())}
              className={clsx(
                "w-full py-3 rounded-2xl text-sm font-semibold transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
              )}
            >
              {isAuthSending
                ? (lang === 'zh' ? '处理中…' : 'Working…')
                : authStep === 'email'
                  ? (lang === 'zh' ? '发送登录邮件' : 'Send sign-in email')
                  : (lang === 'zh' ? '使用验证码登录' : 'Sign in with code')}
            </button>
            <p className={clsx(
              "text-[11px] leading-relaxed mt-1",
              isDark ? "text-white/40" : "text-black/40"
            )}>
              {lang === 'zh'
                ? '我们不会存储你的密码。你可以在任意设备上收邮件：要么复制邮件里的验证码回到这里登录，要么在同一设备里直接点击邮件中的链接登录。'
                : 'We never store your password. You can read the email on any device: either copy the code back here or click the magic link on that device.'}
            </p>
          </form>
        </div>
      </FuturisticModal>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeEngineProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </ThemeEngineProvider>
    </BrowserRouter>
  );
};

export default App;
