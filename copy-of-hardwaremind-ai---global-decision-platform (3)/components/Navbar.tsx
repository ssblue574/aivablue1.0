import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Sun, Moon, Radar, FileText, Sparkles, Users, User, Search, X, CircuitBoard } from 'lucide-react';
import { AppView, Language, UserProfile } from '../data';
import { useTheme } from '../ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
    lang: Language;
    setLang: (lang: Language) => void;
    selectedCount: number;
    onCompare: () => void;
    onToggleChat: () => void;
    t: (key: any) => string;
    currentUser: UserProfile | null;
    onLoginClick: () => void;
    onLogout: () => void;
    searchQuery?: string;
    setSearchQuery?: (query: string) => void;
    onSearch?: (query: string) => void;
    userPersona: 'consumer' | 'geek';
    setUserPersona: (p: 'consumer' | 'geek') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    lang,
    setLang,
    selectedCount,
    onCompare,
    onToggleChat,
    t,
    currentUser,
    onLoginClick,
    onLogout,
    searchQuery = '',
    setSearchQuery,

    onSearch,
    userPersona,
    setUserPersona
}) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [globalSearchQuery, setGlobalSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const location = useLocation();

    // 快捷键 "/" 聚焦搜索框
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // 如果用户正在输入（在input/textarea中），不触发
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }
            // 按下 "/" 键聚焦搜索框
            if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);
    const isHomePage = location.pathname === '/';
    const userInitial = currentUser
        ? (currentUser.name?.charAt(0).toUpperCase() || currentUser.email.charAt(0).toUpperCase())
        : '';
    const userDisplayName = currentUser
        ? (currentUser.name && currentUser.name.trim().length > 0
            ? currentUser.name
            : currentUser.email.split('@')[0])
        : '';

    // Redesigned icons mapping (Profile entry removed; use avatar as single entry point)
    const navItems = [
        { path: '/', id: AppView.HOME, label: t('nav_home'), icon: Radar },
        { path: '/keynote', id: AppView.KEYNOTE, label: t('nav_keynote'), icon: FileText },
        { path: '/products', id: AppView.PRODUCTS, label: t('nav_products'), icon: Sparkles },
        { path: '/lab', id: AppView.LAB, label: t('nav_lab'), icon: CircuitBoard },
        { path: '/community', id: AppView.COMMUNITY, label: t('nav_community'), icon: Users },
    ];

    const isCurrent = (path: string) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            {/* Top Navbar - Futuristic Style: Enhanced Blur & Floating Effect */}
            <nav className={clsx(
                "sticky top-0 z-50 w-full transition-all duration-500 relative overflow-hidden",
                // Add floating effect with transform
                "transform translate-y-0"
            )}>
                {/* Enhanced background with stronger blur and glow */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className={clsx(
                        "absolute inset-0 transition-all duration-500",
                        // Enhanced backdrop blur (30px)
                        "backdrop-blur-[30px] backdrop-saturate-150",
                        isDark
                            ? "bg-[#0a0a0f]/80 border-b border-white/10"
                            : "bg-white/70 border-b border-gray-200/50"
                    )}>
                        {/* Floating shadow effect */}
                        <div className={clsx(
                            "absolute inset-0 transition-opacity duration-500",
                            isDark
                                ? "shadow-[0_8px_32px_rgba(0,255,198,0.08)]"
                                : "shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                        )} />
                        {/* Subtle top glow line */}
                        <div className={clsx(
                            "absolute top-0 left-0 right-0 h-[1px] transition-opacity duration-500",
                            isDark
                                ? "bg-gradient-to-r from-transparent via-[#00FFC6]/20 to-transparent"
                                : "bg-gradient-to-r from-transparent via-[#0071E3]/10 to-transparent"
                        )} />
                    </div>
                </div>
                {/* Desktop Navigation */}
                <div className="hidden md:block relative z-10">
                    <div className="max-w-7xl mx-auto px-8 h-14 flex items-center justify-between">
                        {/* LOGO - Click to Toggle Chat */}
                        <button
                            className="group cursor-pointer flex items-center gap-3 bg-transparent border-none p-0"
                            onClick={onToggleChat}
                            aria-label={lang === 'zh' ? '打开 AI 助手' : 'Open AI Assistant'}
                            type="button"
                        >
                            <div className="relative w-8 h-8 flex items-center justify-center">
                                {/* Breathing Glow Effect - Slow & Smooth */}
                                <div
                                    className={clsx(
                                        "absolute inset-0 rounded-full blur-md",
                                        isDark ? "bg-white/20" : "opacity-0"
                                    )}
                                    style={{
                                        animation: 'pulse 4s ease-in-out infinite',
                                        opacity: 0.5
                                    }}
                                />

                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                                    <path
                                        d="M4 24C4 24 9 12 16 12C23 12 28 24 28 24"
                                        stroke={isDark ? "white" : "black"}
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        className="transition-all duration-500"
                                    />
                                    <circle
                                        cx="16"
                                        cy="6"
                                        r="3"
                                        fill={isDark ? "white" : "black"}
                                        className="transition-all duration-500 group-hover:scale-125"
                                    />
                                </svg>
                            </div>
                            <span
                                className={clsx(
                                    "text-xl font-extralight tracking-[0.15em] transition-all duration-300 relative",
                                    isDark
                                        ? "text-white bg-gradient-to-r from-white via-white/90 to-white bg-clip-text"
                                        : "text-black bg-gradient-to-r from-black via-black/90 to-black bg-clip-text",
                                    "group-hover:tracking-[0.2em] group-hover:opacity-80"
                                )}
                                style={{
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                                    letterSpacing: '0.15em',
                                    fontWeight: 200
                                }}
                                aria-hidden="true"
                            >
                                <span className="relative">
                                    AIVA
                                    <span className={clsx(
                                        "absolute -bottom-0.5 left-0 right-0 h-px opacity-30 transition-opacity duration-300",
                                        isDark ? "bg-gradient-to-r from-transparent via-white to-transparent" : "bg-gradient-to-r from-transparent via-black to-transparent",
                                        "group-hover:opacity-50"
                                    )} />
                                </span>
                            </span>
                        </button>

                        {/* Global Search - Desktop with Dynamic Expand Animation */}
                        <div className="flex-1 max-w-md mx-8">
                            <div className="relative group">
                                <Search size={16} className={clsx(
                                    "absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300",
                                    isDark ? "text-white/40 group-focus-within:text-[#00FFC6]" : "text-black/40 group-focus-within:text-[#0071E3]"
                                )} />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={globalSearchQuery}
                                    onChange={(e) => {
                                        setGlobalSearchQuery(e.target.value);
                                        if (setSearchQuery) setSearchQuery(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && globalSearchQuery.trim()) {
                                            e.preventDefault();
                                            if (onSearch) {
                                                onSearch(globalSearchQuery);
                                            } else {
                                                navigate(`/products?q=${encodeURIComponent(globalSearchQuery)}`);
                                            }
                                        }
                                        if (e.key === 'Escape') {
                                            setGlobalSearchQuery('');
                                            if (setSearchQuery) setSearchQuery('');
                                            searchInputRef.current?.blur();
                                        }
                                    }}
                                    placeholder={t('search_placeholder')}
                                    className={clsx(
                                        "w-full pl-10 pr-4 py-2 rounded-full text-sm transition-all duration-300",
                                        "focus:outline-none",
                                        isDark
                                            ? "bg-white/5 border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-[#00FFC6]/50 focus:shadow-[0_0_16px_rgba(0,255,198,0.15)]"
                                            : "bg-gray-100 border border-gray-200 text-black placeholder-gray-400 focus:bg-white focus:border-[#0071E3]/50 focus:shadow-[0_0_12px_rgba(0,113,227,0.1)]",
                                        // Dynamic expand on focus
                                        "focus:scale-[1.02]"
                                    )}
                                    aria-label={t('search_placeholder')}
                                />
                                {globalSearchQuery && (
                                    <button
                                        onClick={() => {
                                            setGlobalSearchQuery('');
                                            if (setSearchQuery) setSearchQuery('');
                                        }}
                                        className={clsx(
                                            "absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110",
                                            isDark ? "text-white/40 hover:text-white/60" : "text-gray-400 hover:text-gray-600"
                                        )}
                                    >
                                        <X size={14} />
                                    </button>
                                )}

                                {/* Focus glow ring */}
                                <div className={clsx(
                                    "absolute inset-0 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none",
                                    isDark
                                        ? "shadow-[0_0_20px_rgba(0,255,198,0.2)]"
                                        : "shadow-[0_0_16px_rgba(0,113,227,0.15)]"
                                )} />
                            </div>
                        </div>

                        {/* Center Navigation with Light Effect Indicators */}
                        <div className="flex items-center gap-2">
                            {navItems.map(item => {
                                const isActive = isCurrent(item.path);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={clsx(
                                            "relative flex items-center gap-2 px-4 py-2 rounded-full text-base font-light transition-all duration-300 group",
                                            isActive
                                                ? (isDark
                                                    ? "bg-white/15 text-white backdrop-blur-sm"
                                                    : "bg-black/10 text-black backdrop-blur-sm")
                                                : (isDark
                                                    ? "text-white/80 hover:text-white hover:bg-white/8"
                                                    : "text-black/70 hover:text-black hover:bg-black/5")
                                        )}
                                    >
                                        <Icon
                                            size={18}
                                            strokeWidth={isActive ? 2.5 : 1.5}
                                        />
                                        <span>{item.label}</span>

                                        {/* Light effect indicator for active state */}
                                        {isActive && (
                                            <div className={clsx(
                                                "absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-[2px] rounded-full transition-all duration-300",
                                                isDark
                                                    ? "bg-gradient-to-r from-transparent via-[#00FFC6] to-transparent shadow-[0_0_8px_rgba(0,255,198,0.6)]"
                                                    : "bg-gradient-to-r from-transparent via-[#0071E3] to-transparent shadow-[0_0_6px_rgba(0,113,227,0.4)]"
                                            )} />
                                        )}

                                        {/* Hover glow effect */}
                                        <div className={clsx(
                                            "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                                            isDark
                                                ? "shadow-[inset_0_0_12px_rgba(0,255,198,0.1)]"
                                                : "shadow-[inset_0_0_12px_rgba(0,113,227,0.08)]"
                                        )} />
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-6">
                            <button
                                onClick={toggleTheme}
                                className={clsx(
                                    "transition-colors duration-300 p-2 rounded-lg",
                                    isDark ? "text-white/80 hover:text-white" : "text-black/80 hover:text-black"
                                )}
                                aria-label={isDark ? (lang === 'zh' ? '切换到浅色模式' : 'Switch to light mode') : (lang === 'zh' ? '切换到深色模式' : 'Switch to dark mode')}
                                type="button"
                            >
                                {isDark ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
                            </button>

                            {currentUser ? (
                                <Link
                                    to="/profile"
                                    className={clsx(
                                        "flex items-center gap-2 px-2 py-1.5 rounded-full text-xs font-medium border transition-colors",
                                        isDark
                                            ? "border-white/30 text-white/80 hover:bg-white/10"
                                            : "border-black/20 text-black/80 hover:bg-black/5"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold",
                                        isDark ? "bg-white text-black" : "bg-black text-white"
                                    )}>
                                        {userInitial}
                                    </div>
                                    <span className="hidden sm:inline max-w-[120px] truncate">
                                        {userDisplayName}
                                    </span>
                                </Link>
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className={clsx(
                                        "px-3.5 py-2 rounded-full text-xs font-medium border transition-colors",
                                        isDark
                                            ? "border-white/40 text-white hover:bg-white/10"
                                            : "border-black/20 text-black hover:bg-black/5"
                                    )}
                                >
                                    {lang === 'zh' ? '登录' : 'Sign in'}
                                </button>
                            )}

                            <button
                                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                                className={clsx(
                                    "text-sm font-light px-2 py-1.5 rounded-full transition-colors duration-300",
                                    isDark ? "text-white/80 hover:text-white bg-white/5" : "text-black/80 hover:text-black bg-black/5"
                                )}
                                aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
                                type="button"
                            >
                                {lang === 'zh' ? 'EN' : '中'}
                            </button>

                            {/* 对比功能暂时保留在后台逻辑中，不在导航上重点展示 */}
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation - Optimized Touch Experience */}
                <div className="md:hidden relative z-10">
                    {/* Mobile Global Search with Enhanced Touch Targets */}
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10">
                        <div className="relative group">
                            <Search size={16} className={clsx(
                                "absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300",
                                isDark ? "text-white/40 group-focus-within:text-[#00FFC6]" : "text-black/40 group-focus-within:text-[#0071E3]"
                            )} />
                            <input
                                type="text"
                                value={globalSearchQuery}
                                onChange={(e) => {
                                    setGlobalSearchQuery(e.target.value);
                                    if (setSearchQuery) setSearchQuery(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && globalSearchQuery.trim()) {
                                        e.preventDefault();
                                        if (onSearch) {
                                            onSearch(globalSearchQuery);
                                        } else {
                                            navigate(`/products?q=${encodeURIComponent(globalSearchQuery)}`);
                                        }
                                    }
                                    if (e.key === 'Escape') {
                                        setGlobalSearchQuery('');
                                        if (setSearchQuery) setSearchQuery('');
                                    }
                                }}
                                placeholder={t('search_placeholder')}
                                className={clsx(
                                    "w-full pl-10 pr-10 py-2.5 rounded-full text-sm transition-all duration-300",
                                    "focus:outline-none",
                                    // Enhanced touch target size (44px minimum)
                                    "min-h-[44px]",
                                    isDark
                                        ? "bg-white/5 border border-white/10 text-white placeholder-white/40 focus:bg-white/10 focus:border-[#00FFC6]/50 focus:shadow-[0_0_12px_rgba(0,255,198,0.15)]"
                                        : "bg-gray-100 border border-gray-200 text-black placeholder-gray-400 focus:bg-white focus:border-[#0071E3]/50 focus:shadow-[0_0_10px_rgba(0,113,227,0.1)]"
                                )}
                            />
                            {globalSearchQuery && (
                                <button
                                    onClick={() => {
                                        setGlobalSearchQuery('');
                                        if (setSearchQuery) setSearchQuery('');
                                    }}
                                    className={clsx(
                                        "absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
                                        // Enhanced touch target
                                        "p-2 -m-2",
                                        isDark ? "text-white/40 active:text-white/60" : "text-gray-400 active:text-gray-600"
                                    )}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Top Bar */}
                    <div className="flex items-center justify-between w-full px-4 h-11 transition-all duration-500 relative z-10">
                        {/* LOGO - Click to Toggle Chat */}
                        <button
                            className="group cursor-pointer flex items-center gap-2 bg-transparent border-none p-0"
                            onClick={() => {
                                onToggleChat();
                                setMobileMenuOpen(false);
                            }}
                            aria-label={lang === 'zh' ? '打开 AI 助手' : 'Open AI Assistant'}
                            type="button"
                        >
                            <div className="relative w-6 h-6 flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                                    <path
                                        d="M4 24C4 24 9 12 16 12C23 12 28 24 28 24"
                                        stroke={isDark ? "white" : "black"}
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        className="transition-all duration-500"
                                    />
                                    <circle
                                        cx="16"
                                        cy="6"
                                        r="3"
                                        fill={isDark ? "white" : "black"}
                                        className="transition-all duration-500 group-hover:scale-125"
                                    />
                                </svg>
                            </div>
                            <span
                                className={clsx(
                                    "text-lg font-extralight tracking-[0.12em] transition-all duration-300 relative",
                                    isDark
                                        ? "text-white bg-gradient-to-r from-white via-white/90 to-white bg-clip-text"
                                        : "text-black bg-gradient-to-r from-black via-black/90 to-black bg-clip-text",
                                    "group-hover:tracking-[0.15em] group-hover:opacity-80"
                                )}
                                style={{
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
                                    letterSpacing: '0.12em',
                                    fontWeight: 200
                                }}
                                aria-hidden="true"
                            >
                                <span className="relative">
                                    AIVA
                                    <span className={clsx(
                                        "absolute -bottom-0.5 left-0 right-0 h-px opacity-30 transition-opacity duration-300",
                                        isDark ? "bg-gradient-to-r from-transparent via-white to-transparent" : "bg-gradient-to-r from-transparent via-black to-transparent",
                                        "group-hover:opacity-50"
                                    )} />
                                </span>
                            </span>
                        </button>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            {/* Persona Toggle */}
                            <button
                                onClick={() => setUserPersona(userPersona === 'consumer' ? 'geek' : 'consumer')}
                                className={clsx(
                                    "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                                    userPersona === 'geek'
                                        ? "bg-green-500/10 text-green-500 border-green-500/50"
                                        : isDark ? "border-white/20 text-white/60" : "border-black/20 text-black/60"
                                )}
                                title={lang === 'zh' ? '切换身份：普通用户 / 极客模式' : 'Toggle Persona: Consumer / Geek'}
                            >
                                {userPersona === 'geek' ? 'GEEK' : 'USER'}
                            </button>

                            <button
                                onClick={toggleTheme}
                                className={clsx(
                                    "transition-colors duration-300 p-2 rounded-full",
                                    isDark ? "text-white/90 hover:bg-white/10" : "text-black/90 hover:bg-black/5"
                                )}
                                aria-label={isDark ? (lang === 'zh' ? '切换到浅色模式' : 'Switch to light mode') : (lang === 'zh' ? '切换到深色模式' : 'Switch to dark mode')}
                                type="button"
                            >
                                {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
                            </button>

                            <button
                                onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                                className={clsx(
                                    "text-xs font-light px-2.5 py-1.5 rounded-full",
                                    isDark ? "text-white/90 hover:bg-white/10" : "text-black/90 hover:bg-black/5"
                                )}
                                aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
                                type="button"
                            >
                                {lang === 'zh' ? 'EN' : '中'}
                            </button>

                            {currentUser ? (
                                <Link
                                    to="/profile"
                                    className={clsx(
                                        "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium border",
                                        isDark
                                            ? "border-white/30 text-white/80"
                                            : "border-black/20 text-black/80"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold",
                                        isDark ? "bg-white text-black" : "bg-black text-white"
                                    )}>
                                        {userInitial}
                                    </div>
                                </Link>
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-full text-[11px] font-medium border",
                                        isDark
                                            ? "border-white/40 text-white hover:bg-white/10"
                                            : "border-black/20 text-black hover:bg-black/5"
                                    )}
                                >
                                    {lang === 'zh' ? '登录' : 'Sign in'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Navigation Bar - Enhanced Touch Feedback */}
                    <div className={clsx(
                        "w-full overflow-x-auto transition-all duration-500 relative z-10",
                        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    )}>
                        <div className="flex items-center justify-start min-w-max px-4 py-3 gap-1">
                            {navItems.map(item => {
                                const isActive = isCurrent(item.path);
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                        }}
                                        className={clsx(
                                            "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                            // Enhanced touch target (44px minimum)
                                            "min-h-[44px]",
                                            // Active state with glow
                                            isActive
                                                ? (isDark
                                                    ? "bg-white/15 text-white font-semibold shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                                                    : "bg-black/10 text-black font-semibold shadow-[0_0_8px_rgba(0,0,0,0.05)]")
                                                : (isDark
                                                    ? "text-white/70 active:text-white/90 active:bg-white/12"
                                                    : "text-black/70 active:text-black/90 active:bg-black/12"),
                                            // Touch feedback
                                            "active:scale-95"
                                        )}
                                    >
                                        <Icon
                                            size={16}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                        <span>{item.label}</span>

                                        {/* Light indicator for active state on mobile */}
                                        {isActive && (
                                            <div className={clsx(
                                                "absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1/3 h-[2px] rounded-full",
                                                isDark
                                                    ? "bg-gradient-to-r from-transparent via-[#00FFC6] to-transparent"
                                                    : "bg-gradient-to-r from-transparent via-[#0071E3] to-transparent"
                                            )} />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};