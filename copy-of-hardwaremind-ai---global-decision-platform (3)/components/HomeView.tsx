import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { ChevronRight, ArrowUpRight, Clock, Calendar, ExternalLink, Radar, Rocket, Brain, Sparkles, Globe, Zap, TrendingUp, Users, Eye, Radio, Target, Lightbulb, Award, Play, ChevronDown, ShoppingBag, History, User, Star, Search, X, ArrowUp, Mail, Building2, Briefcase, Newspaper, MapPin, Twitter, Linkedin, Github } from 'lucide-react';
import { clsx } from 'clsx';
import { AppView, NewsItem, Product } from '../data';
import { useTheme } from '../ThemeContext';
import { EarthBackground } from './EarthBackground';
import { storageService } from '../services/storageService';
import { GlassmorphicCard } from './GlassmorphicCard';
import { PageTransition } from './PageTransition';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { preloadHomepageImages } from '../utils/imagePreloader';

// Fix for custom element
const SplineViewer = 'spline-viewer' as any;

interface HomeViewProps {
    t: (key: any) => string;
    setView: (view: AppView) => void;
    newsFeed: NewsItem[];
    onViewNews: (news: NewsItem) => void;
    milestones: Product[];
    /** 首页「最近 5 款」横条；来源 data/homeShowcase.ts，不是发现新品全量列表 */
    latestProducts: Product[];
    onViewProduct?: (product: Product) => void;
    minimalUI?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ t, setView, newsFeed, onViewNews, milestones, latestProducts, onViewProduct, minimalUI = false }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const minimal = minimalUI;
    const prefersReducedMotion = useReducedMotion();
    const [greeting, setGreeting] = useState('');
    const [dateString, setDateString] = useState('');
    const [activeValuePillar, setActiveValuePillar] = useState(0);
    const [showCoreValues, setShowCoreValues] = useState(false);

    // 简短文案工具：用于首页新品卡片的一句话定位
    const summarize = useCallback((text: string | undefined, max: number) => {
        if (!text) return '';
        if (text.length <= max) return text;
        return text.slice(0, max).trim() + '…';
    }, []);

    // 检查是否为高评分（>=80）
    const isHighScore = useCallback((score: number | undefined | null): boolean => {
        if (score === undefined || score === null) return false;
        const numScore = Number(score);
        return !isNaN(numScore) && numScore >= 80;
    }, []);

    // 展开/收起状态
    const [expandedStartups, setExpandedStartups] = useState(false);
    const [expandedNews, setExpandedNews] = useState(false);
    const [expandedMilestones, setExpandedMilestones] = useState(false);
    const [recentViews, setRecentViews] = useState<Product[]>([]);
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Load recent views on mount
    useEffect(() => {
        const views = storageService.getRecentViews();
        setRecentViews(views);
    }, []);

    // Preload critical images for homepage
    useEffect(() => {
        if (latestProducts.length > 0) {
            preloadHomepageImages(latestProducts);
        }
    }, [latestProducts]);

    // 监听滚动显示返回顶部按钮
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Track product views
    const handleViewProductWithTracking = useCallback((product: Product) => {
        if (onViewProduct) {
            storageService.addRecentView(product);
            const updatedViews = storageService.getRecentViews();
            setRecentViews(updatedViews);
            onViewProduct(product);
        }
    }, [onViewProduct]);

    // 通用时间窗口判断：仅用于前端展示时效控制
    const isWithinDays = (dateStr: string | undefined, days: number) => {
        if (!dateStr) return true;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return true; // 无法解析的日期不过滤，防止误伤
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        if (diff < 0) return true; // 未来事件（预告）保留
        return diff <= days * 24 * 60 * 60 * 1000;
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hour = now.getHours();
            const lang = t('home_date_format') === 'zh-CN' ? 'zh-CN' : 'en-US';

            if (hour < 12) setGreeting(t('home_greeting_morning'));
            else if (hour < 18) setGreeting(t('home_greeting_afternoon'));
            else setGreeting(t('home_greeting_evening'));

            setDateString(now.toLocaleDateString(lang, { weekday: 'long', month: 'long', day: 'numeric' }));
        };

        updateTime();
        const timer = setInterval(updateTime, 60000);
        return () => clearInterval(timer);
    }, [t]);

    // Auto-rotate value pillars
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveValuePillar(prev => (prev + 1) % 3);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // 大牌关键词（用于初创雷达排除）
    const bigBrandKeywords = useMemo(
        () => [
            // EN brands
            'apple', 'google', 'microsoft', 'amazon', 'meta', 'facebook',
            'tesla', 'openai', 'nvidia', 'amd', 'intel', 'qualcomm',
            'huawei', 'xiaomi', 'oppo', 'vivo', 'oneplus', 'lenovo',
            'hp', 'dell', 'ibm', 'broadcom', 'samsung', 'lg', 'sony',
            'panasonic', 'sharp', 'asus', 'acer', 'msi', 'honor', 'meizu',
            'motorola', 'snap', 'snapchat', 'spectacles', 'galaxy',
            'surface', 'windows',
            // CN brand names / transliterations
            '苹果', '谷歌', '微软', '亚马逊', '特斯拉', '英伟达', '英特尔',
            '高通', '华为', '小米', '三星', '索尼', '联想', '华硕', '戴尔',
            '惠普', '摩托罗拉', '魅族', '荣耀', '欧珀', '维沃', '一加',
            '博通', '爱立信', '诺基亚', '联发科', '骁龙', '高通骁龙'
        ],
        []
    );

    const isBigBrandStory = useCallback((item?: NewsItem) => {
        if (!item) return false;
        const text = `${item.title || ''} ${item.description || ''}`.toLowerCase();
        return bigBrandKeywords.some(keyword => text.includes(keyword));
    }, [bigBrandKeywords]);

    // 初创雷达：优先显示产品相关的内容，确保至少17个，不足时自动放宽时间窗口，且排除大牌
    const startupStories = useMemo(() => {
        const productCategories = [
            'Product Launch', 'Product Teaser', 'Software Update', 'Feature Drop',
            'Milestone', 'Hardware Leak', 'Crowdfunding', 'Update',
            '新品发布', '新品预告', '软件更新', '功能发布',
            '里程碑', '硬件爆料', '众筹', '产品更新'
        ];

        const buildList = (days?: number) => {
            const base = (newsFeed || []).filter(item => {
                if (!item || item.stage !== 'startup') return false;
                if (isBigBrandStory(item)) return false; // 排除大牌
                return days ? isWithinDays(item.date, days) : true;
            });

            const productStartups = base.filter(item => productCategories.includes(item.category));
            const otherStartups = base.filter(item => !productCategories.includes(item.category));
            return [...productStartups, ...otherStartups];
        };

        let combined = buildList(90);
        if (combined.length < 17) combined = buildList(180);
        if (combined.length < 17) combined = buildList(); // 无时间限制兜底

        return combined.slice(0, 17); // 严格保留 17 条
    }, [newsFeed]);

    // 深度情报：显示新闻和热点（不含初创雷达内容），不足时放宽时间窗口并允许更多类别
    const latestIntel = useMemo(() => {
        if (!newsFeed || newsFeed.length === 0) return [];

        const productCategories = [
            'Product Launch', 'Product Teaser', 'Crowdfunding',
            '新品发布', '新品预告', '众筹'
        ];

        const buildList = (days?: number, allowProduct = false, includeStartup = false) => {
            return newsFeed.filter(item => {
                if (!item) return false;
                if (!includeStartup && item.stage === 'startup') return false;
                if (!allowProduct && productCategories.includes(item.category)) return false;
                if (days && !isWithinDays(item.date, days)) return false;
                return true;
            });
        };

        let newsItems = buildList(30, false, false);
        if (newsItems.length < 15) {
            newsItems = buildList(90, false, false);
        }
        if (newsItems.length < 15) {
            newsItems = buildList(120, true, false); // 允许产品类，但仍排除 startup
        }
        if (newsItems.length < 15) {
            newsItems = buildList(undefined, true, true); // 全量兜底
        }

        return newsItems.slice(0, 17); // 严格保留 17 条
    }, [newsFeed]);

    // Random 20 milestones for expansion support
    const displayedMilestones = useMemo(() => {
        if (!milestones || milestones.length === 0) return [];
        const shuffled = [...milestones].filter(m => m != null).sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 20);
    }, [milestones]);


    // 获取产品创始人信息
    const getFounder = (product: Product): string | null => {
        const founderMap: Record<string, string> = {
            'Apple': 'Steve Jobs',
            'Microsoft': 'Bill Gates',
            'Amazon': 'Jeff Bezos',
            'Google': 'Larry Page & Sergey Brin',
            'Facebook': 'Mark Zuckerberg',
            'Tesla': 'Elon Musk',
            'Sony': 'Akio Morita',
            'Nintendo': 'Fusajiro Yamauchi',
            'IBM': 'Thomas J. Watson',
            'Intel': 'Robert Noyce & Gordon Moore',
            'HP': 'Bill Hewlett & Dave Packard',
            'Dell': 'Michael Dell',
            'Adobe': 'John Warnock & Charles Geschke',
            'Zoom': 'Eric Yuan',
            'Netflix': 'Reed Hastings',
            'Spotify': 'Daniel Ek',
            'Airbnb': 'Brian Chesky',
            'Uber': 'Travis Kalanick',
            'Twitter': 'Jack Dorsey',
            'Snapchat': 'Evan Spiegel',
            'Pixar': 'Ed Catmull & Alvy Ray Smith',
            'RIM': 'Mike Lazaridis',
            'Polaroid': 'Edwin Land',
            'Taito': 'Michael Kogan',
        };
        return founderMap[product.brand] || null;
    };

    // Three Core Value Pillars
    const valuePillars = [
        {
            id: 'curator',
            icon: Target,
            title: t('core_value_1_title'),
            subtitle: t('core_value_1_subtitle'),
            description: t('core_value_1_desc'),
            color: '#00FFC6',
            stats: [
                { label: t('core_value_1_stat1_label'), value: '2,847' },
                { label: t('core_value_1_stat2_label'), value: '99%' },
            ]
        },
        {
            id: 'launchpad',
            icon: ShoppingBag,
            title: t('core_value_2_title'),
            subtitle: t('core_value_2_subtitle'),
            description: t('core_value_2_desc'),
            color: '#FF4D00',
            stats: [
                { label: t('core_value_2_stat1_label'), value: '150+' },
                { label: t('core_value_2_stat2_label'), value: '100%' },
            ]
        },
        {
            id: 'brain',
            icon: Brain,
            title: t('core_value_3_title'),
            subtitle: t('core_value_3_subtitle'),
            description: t('core_value_3_desc'),
            color: '#8B5CF6',
            stats: [
                { label: t('core_value_3_stat1_label'), value: '50K+' },
                { label: t('core_value_3_stat2_label'), value: '94%' },
            ]
        }
    ];

    return (
        <div className={clsx("animate-fade-in pb-20 min-h-screen relative z-10", isDark ? "bg-black" : "bg-[#fafafa]")}>
            {/* Global Animated Background for Dark Mode - Fixed Position */}
            {isDark && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <EarthBackground />
                </div>
            )}

            {/* CSS Animations for heavy storm clouds */}
            <style>{`
                @keyframes stormCloudFlow1 {
                    0% { background-position: 0% 0%; transform: translate(0, 0) scale(1); }
                    20% { background-position: 25% 20%; transform: translate(2%, 3%) scale(1.005); }
                    40% { background-position: 50% 40%; transform: translate(0%, 5%) scale(1.01); }
                    60% { background-position: 75% 60%; transform: translate(-2%, 4%) scale(1.008); }
                    80% { background-position: 50% 80%; transform: translate(-1%, 2%) scale(1.002); }
                    100% { background-position: 0% 100%; transform: translate(0, 0) scale(1); }
                }
                @keyframes stormCloudFlow2 {
                    0% { background-position: 100% 100%; transform: translate(0, 0) scale(1); }
                    25% { background-position: 75% 75%; transform: translate(-3%, -2%) scale(0.998); }
                    50% { background-position: 50% 50%; transform: translate(-5%, -1%) scale(0.995); }
                    75% { background-position: 25% 25%; transform: translate(-2%, 1%) scale(0.998); }
                    100% { background-position: 100% 0%; transform: translate(0, 0) scale(1); }
                }
                @keyframes stormCloudFlow3 {
                    0% { background-position: 50% 50%; transform: translate(0, 0) scale(1); }
                    20% { background-position: 30% 35%; transform: translate(3%, 2%) scale(1.01); }
                    40% { background-position: 70% 65%; transform: translate(-2%, 4%) scale(1.015); }
                    60% { background-position: 50% 80%; transform: translate(-3%, 1%) scale(1.008); }
                    80% { background-position: 30% 50%; transform: translate(2%, -1%) scale(0.998); }
                    100% { background-position: 50% 50%; transform: translate(0, 0) scale(1); }
                }
                @keyframes stormCloudFlow4 {
                    0% { background-position: 0% 0%; transform: translate(0, 0) scale(1); }
                    50% { background-position: 100% 100%; transform: translate(1%, 1%) scale(1.002); }
                    100% { background-position: 0% 0%; transform: translate(0, 0) scale(1); }
                }
                @keyframes stormCloudFlow5 {
                    0% { background-position: 100% 0%; transform: translate(0, 0) scale(1); }
                    33% { background-position: 50% 33%; transform: translate(-1%, 1%) scale(1.001); }
                    66% { background-position: 0% 66%; transform: translate(1%, -1%) scale(0.999); }
                    100% { background-position: 100% 100%; transform: translate(0, 0) scale(1); }
                }
            `}</style>

            {/* === HERO SECTION === */}
            <div
                className={clsx(
                    "relative z-10 w-full min-h-[100vh] flex flex-col justify-center overflow-hidden",
                    isDark ? "bg-transparent" : "hero-gradient-light"
                )}
            >
                {/* Background for Light Mode Only */}
                {!isDark && <EarthBackground />}

                {/* CSS Animations */}
                <style>{`
                    @keyframes rotateEarth {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    
                    @keyframes rotateStars {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg);
                        }
                    }
                    
                    @keyframes rotateStars2 {
                        0% {
                            transform: rotate(0deg);
                        }
                        100% {
                            transform: rotate(-360deg);
                        }
                    }
                    
                    @keyframes rotateMoon {
                        0% {
                            transform: rotate(0deg) translateX(200px) rotate(0deg);
                        }
                        100% {
                            transform: rotate(360deg) translateX(200px) rotate(-360deg);
                        }
                    }
                    
                    @keyframes rotateSlow {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes pulseSun {
                        0%, 100% { transform: scale(1); filter: brightness(1); }
                        50% { transform: scale(1.08); filter: brightness(1.15); }
                    }
                    
                    @keyframes floatMoon {
                        0%, 100% { transform: translateY(0) translateX(0); }
                        25% { transform: translateY(-12px) translateX(8px); }
                        50% { transform: translateY(0) translateX(15px); }
                        75% { transform: translateY(12px) translateX(8px); }
                    }
                    
                    @keyframes shootingStar {
                        0%, 85%, 100% { opacity: 0; transform: rotate(-35deg) translateX(0); }
                        88% { opacity: 1; }
                        93% { opacity: 1; transform: rotate(-35deg) translateX(250px); }
                        95% { opacity: 0; transform: rotate(-35deg) translateX(300px); }
                    }
                    
                    @keyframes twinkle {
                        0%, 100% { opacity: 0.2; }
                        50% { opacity: 1; }
                    }
                `}</style>

                <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-28 md:pt-36 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
                        {/* Left Column - Text Content */}
                        <div className="text-left space-y-6">
                            {/* Top Badge - First to appear */}
                            <PageTransition 
                                type={prefersReducedMotion ? 'fade' : 'slide'} 
                                delay={prefersReducedMotion ? 0 : 100}
                                duration={prefersReducedMotion ? 300 : 600}
                            >
                                <div className="flex items-center justify-start">
                                    <div className={clsx(
                                        "inline-flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md",
                                        isDark ? "bg-white/10 border-white/20" : "bg-white/70 border-black/5"
                                    )}>
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFC6] opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFC6]"></span>
                                        </span>
                                        <span className={clsx(
                                            "text-xs font-semibold uppercase tracking-[0.18em]",
                                            isDark ? "text-white/80" : "text-black/70"
                                        )}>
                                            {t('hero_badge')}
                                        </span>
                                    </div>
                                </div>
                            </PageTransition>

                            {/* Main Headline - Second to appear */}
                            <PageTransition 
                                type={prefersReducedMotion ? 'fade' : 'slide'} 
                                delay={prefersReducedMotion ? 0 : 250}
                                duration={prefersReducedMotion ? 300 : 700}
                            >
                                <h1
                                    className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-[1.1] text-white"
                                    style={{
                                        fontFamily: '"Noto Serif SC", "Source Han Serif SC", "Songti SC", Georgia, serif',
                                        fontWeight: 300,
                                        letterSpacing: '0.02em',
                                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 16px rgba(0, 0, 0, 0.6)'
                                    }}
                                >
                                    {t('hero_title')}
                                </h1>
                            </PageTransition>

                            {/* Subtitle - Third to appear */}
                            <PageTransition 
                                type={prefersReducedMotion ? 'fade' : 'slide'} 
                                delay={prefersReducedMotion ? 0 : 400}
                                duration={prefersReducedMotion ? 300 : 700}
                            >
                                <p
                                    className="text-lg md:text-xl leading-relaxed max-w-xl text-white"
                                    style={{
                                        fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
                                        fontWeight: 300,
                                        letterSpacing: '0.04em',
                                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.7), 0 2px 8px rgba(0, 0, 0, 0.5)'
                                    }}
                                >
                                    {t('hero_subtitle')}
                                </p>
                            </PageTransition>

                            {/* CTA Buttons - Fourth to appear */}
                            <PageTransition 
                                type={prefersReducedMotion ? 'fade' : 'slide'} 
                                delay={prefersReducedMotion ? 0 : 550}
                                duration={prefersReducedMotion ? 300 : 700}
                            >
                                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                                    <button
                                        onClick={() => setView(AppView.PRODUCTS)}
                                        className={clsx(
                                            "group relative px-8 py-4 text-sm sm:text-base font-semibold rounded-full neo-button",
                                            "bg-gradient-to-r from-[#00c7b0] via-[#0f7bff] to-[#0044ff] text-white",
                                            "shadow-[0_0_32px_rgba(0,136,255,0.38)] hover:shadow-[0_14px_48px_rgba(0,136,255,0.45)]",
                                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00ffc6] focus-visible:ring-offset-2",
                                            isDark ? "focus-visible:ring-offset-black" : "focus-visible:ring-offset-white"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Radar size={18} />
                                            {t('hero_cta')}
                                            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setView(AppView.KEYNOTE)}
                                        className={clsx(
                                            "px-8 py-4 font-semibold rounded-full text-sm sm:text-base transition-all neo-button",
                                            isDark
                                                ? "text-white border border-white/20"
                                                : "text-black border border-black/10 bg-white/80"
                                        )}
                                    >
                                        <span className="flex items-center gap-2">
                                            <Play size={16} />
                                            {t('home_read_more')}
                                        </span>
                                    </button>
                                </div>
                            </PageTransition>

                            {/* Core Values Button - Fifth to appear */}
                            <PageTransition 
                                type={prefersReducedMotion ? 'fade' : 'slide'} 
                                delay={prefersReducedMotion ? 0 : 700}
                                duration={prefersReducedMotion ? 300 : 600}
                            >
                                <button
                                    onClick={() => {
                                        if (!showCoreValues) {
                                            setShowCoreValues(true);
                                            setTimeout(() => {
                                                const element = document.getElementById('core-values');
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }
                                            }, 100);
                                        } else {
                                            setShowCoreValues(false);
                                        }
                                    }}
                                    className="group inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
                                >
                                    <Sparkles size={14} className="text-white/40 group-hover:text-[#00FFC6] transition-colors" />
                                    <span className="text-sm">
                                        {t('core_values_badge')}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className={clsx(
                                            "transition-transform duration-300",
                                            showCoreValues ? "rotate-180" : ""
                                        )}
                                        strokeWidth={1.5}
                                    />
                                </button>
                            </PageTransition>
                        </div>

                        {/* Right Column - Stats/Visual Element */}
                        <div className="hidden lg:flex flex-col items-end justify-center space-y-6">
                            {/* Elegant Stats Cards */}
                            <PageTransition 
                                type={prefersReducedMotion ? 'fade' : 'scale'} 
                                delay={prefersReducedMotion ? 0 : 400}
                                duration={prefersReducedMotion ? 300 : 800}
                            >
                                <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                    <div className={clsx("p-5 rounded-2xl", isDark ? "glass-card" : "glass-card-light")}>
                                        <div className={clsx("text-3xl font-light mb-1", isDark ? "text-white" : "text-black")} style={{ fontFamily: '"Noto Serif SC", serif' }}>2,847</div>
                                        <div className={clsx("text-xs uppercase tracking-wider", isDark ? "text-white/50" : "text-gray-600")}>
                                            {t('stats_projects_tracked')}
                                        </div>
                                    </div>
                                    <div className={clsx("p-5 rounded-2xl", isDark ? "glass-card" : "glass-card-light")}>
                                        <div className={clsx("text-3xl font-light mb-1", isDark ? "text-white" : "text-black")} style={{ fontFamily: '"Noto Serif SC", serif' }}>150+</div>
                                        <div className={clsx("text-xs uppercase tracking-wider", isDark ? "text-white/50" : "text-gray-600")}>
                                            {t('stats_global_channels')}
                                        </div>
                                    </div>
                                    <div className={clsx("p-5 rounded-2xl", isDark ? "glass-card" : "glass-card-light")}>
                                        <div className={clsx("text-3xl font-light mb-1", isDark ? "text-white" : "text-black")} style={{ fontFamily: '"Noto Serif SC", serif' }}>99%</div>
                                        <div className={clsx("text-xs uppercase tracking-wider", isDark ? "text-white/50" : "text-gray-600")}>
                                            {t('stats_noise_reduction')}
                                        </div>
                                    </div>
                                    <div className="p-5 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
                                        <div className="text-3xl font-light text-white mb-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>24/7</div>
                                        <div className="text-xs text-white/40 uppercase tracking-wider">
                                            {t('stats_realtime_monitor')}
                                        </div>
                                    </div>
                                </div>
                            </PageTransition>

                            {/* Subtle Tagline */}
                            <PageTransition 
                                type={prefersReducedMotion ? 'fade' : 'slide'} 
                                delay={prefersReducedMotion ? 0 : 700}
                                duration={prefersReducedMotion ? 300 : 600}
                            >
                                <p className="text-sm text-white/30 text-right max-w-xs" style={{ fontFamily: '"Noto Sans SC", sans-serif', letterSpacing: '0.05em' }}>
                                    {t('stats_tagline')}
                                </p>
                            </PageTransition>
                        </div>
                    </div>
                </div>

                {/* Smooth transition from dark hero to content area */}
                <div className={clsx(
                    "absolute bottom-0 left-0 right-0 h-16 z-20",
                    isDark
                        ? "bg-gradient-to-t from-black via-black/80 to-transparent"
                        : "bg-gradient-to-t from-[#fafafa] via-[#fafafa]/80 to-transparent"
                )} />
            </div>

            {/* === RECENT VIEWS SECTION === */}
            {recentViews.length > 0 && (
                <section className={clsx("py-8 border-b relative z-10", isDark ? "bg-transparent border-white/5" : "bg-transparent border-black/5")}>
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
                                <div>
                                    <h2 className={clsx("text-2xl font-bold tracking-tight mb-1", isDark ? "text-white" : "text-black")}>
                                        {t('recent_views_title')}
                                    </h2>
                                    <p className={clsx("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
                                        {t('recent_views_subtitle')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    storageService.clearRecentViews();
                                    setRecentViews([]);
                                }}
                                className={clsx(
                                    "text-xs font-medium px-3 py-1.5 rounded-lg transition-all",
                                    isDark
                                        ? "text-white/50 hover:text-white hover:bg-white/5"
                                        : "text-gray-500 hover:text-black hover:bg-gray-100"
                                )}
                            >
                                {t('recent_views_clear')}
                            </button>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory sm:snap-none -mx-4 px-4 sm:mx-0 sm:px-0">
                            {recentViews.slice(0, 5).map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleViewProductWithTracking(product)}
                                    className={clsx(
                                        "group flex-shrink-0 w-56 rounded-xl border overflow-hidden backdrop-blur-sm text-left hover:-translate-y-1 hover:shadow-xl transition-all snap-start",
                                        isDark
                                            ? "bg-[#111]/80 border-white/10 hover:border-purple-500/50"
                                            : "bg-white/90 border-black/10 hover:border-purple-500/30 shadow-sm"
                                    )}
                                >
                                    <div className="relative w-full h-32 bg-gray-100 dark:bg-white/5 overflow-hidden">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-1 bg-purple-500/90 backdrop-blur-sm text-white text-[10px] font-bold rounded">
                                            <History size={10} className="inline mr-1" />
                                            {t('recent_views_viewed')}
                                        </div>
                                    </div>
                                    <div className="px-3 py-2.5 space-y-1">
                                        {product.brand && product.brand.trim().length > 0 && (
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/50 font-medium">
                                                {product.brand}
                                            </div>
                                        )}
                                        <div className={clsx("text-sm font-bold line-clamp-2 leading-snug group-hover:text-purple-500 transition-colors", isDark ? "text-white" : "text-black")}>
                                            {product.name}
                                        </div>
                                        <div className={clsx(
                                            "text-[11px] leading-snug line-clamp-2 mb-1",
                                            isDark ? "text-white/70" : "text-gray-700"
                                        )}>
                                            {summarize(
                                                product.localizedDescription?.strategy || product.description,
                                                55
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-white/10">
                                            <span className={clsx("text-[10px] flex items-center gap-1", isDark ? "text-white/50" : "text-gray-500")}>
                                                <Calendar size={9} />
                                                {product.launchDate}
                                            </span>
                                            <span className={clsx("text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all", isDark ? "text-purple-400" : "text-purple-600")}>
                                                {t('recent_views_view')}
                                                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* === THREE CORE VALUE PILLARS === */}
            {showCoreValues && (
                <section id="core-values" className="py-24 relative overflow-hidden animate-fade-in z-10">
                    {/* Jobs-Inspired Minimalist Background with Future AI Elements */}
                    <div className={clsx("absolute inset-0 z-0 overflow-hidden", isDark ? "opacity-0" : "")}>
                        {/* Base - Elegant Minimal Gradient (Jobs Style) - Only for Light Mode */}
                        <div className={clsx(
                            "absolute inset-0",
                            isDark
                                ? "bg-transparent"
                                : "bg-gradient-to-b from-[#fafafa] via-[#ffffff] to-[#f5f5f7]"
                        )} />

                        {/* Subtle Grid Pattern - Very Light (Tech Feel) */}
                        <div
                            className="absolute inset-0 opacity-[0.03]"
                            style={{
                                backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), 
                                             linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
                                backgroundSize: '80px 80px',
                            }}
                        />

                        {/* Soft Glow Points - Future AI Elements (Very Subtle) */}
                        <div
                            className={clsx(
                                "absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.08]",
                                isDark ? "bg-white" : "bg-black"
                            )}
                            style={{
                                animation: 'gentlePulse 8s ease-in-out infinite',
                            }}
                        />
                        <div
                            className={clsx(
                                "absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.06]",
                                isDark ? "bg-white" : "bg-black"
                            )}
                            style={{
                                animation: 'gentlePulse 10s ease-in-out infinite',
                                animationDelay: '2s',
                            }}
                        />
                        <div
                            className={clsx(
                                "absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05]",
                                isDark ? "bg-white" : "bg-black"
                            )}
                            style={{
                                animation: 'gentlePulse 12s ease-in-out infinite',
                                animationDelay: '4s',
                            }}
                        />

                        {/* Subtle Particle Points - AI Intelligence (Minimal) */}
                        <div className="absolute inset-0">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={`particle-${i}`}
                                    className={clsx(
                                        "absolute rounded-full",
                                        isDark ? "bg-white" : "bg-black"
                                    )}
                                    style={{
                                        width: `${Math.random() * 1.5 + 0.5}px`,
                                        height: `${Math.random() * 1.5 + 0.5}px`,
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        opacity: Math.random() * 0.3 + 0.1,
                                        animation: `particleFade ${Math.random() * 4 + 3}s ease-in-out infinite`,
                                        animationDelay: `${Math.random() * 2}s`
                                    }}
                                />
                            ))}
                        </div>

                        {/* Elegant Overlay - Jobs Refinement */}
                        <div className={clsx(
                            "absolute inset-0",
                            isDark
                                ? "bg-gradient-to-b from-transparent via-transparent to-black/5"
                                : "bg-gradient-to-b from-transparent via-transparent to-white/10"
                        )} />
                    </div>

                    {/* CSS Animations */}
                    <style>{`
                    @keyframes gentlePulse {
                        0%, 100% { opacity: 0.08; transform: scale(1); }
                        50% { opacity: 0.12; transform: scale(1.05); }
                    }
                    @keyframes particleFade {
                        0%, 100% { opacity: 0.1; transform: scale(1); }
                        50% { opacity: 0.3; transform: scale(1.2); }
                    }
                `}</style>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                        {/* Section Header */}
                        <div className="text-center mb-16 relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setShowCoreValues(false)}
                                className={clsx(
                                    "absolute top-0 right-0 p-2 rounded-full transition-all duration-300 hover:scale-110",
                                    isDark
                                        ? "text-white/60 hover:text-white hover:bg-white/10"
                                        : "text-black/60 hover:text-black hover:bg-black/10"
                                )}
                                aria-label={t('close')}
                            >
                                <ChevronDown
                                    size={20}
                                    className="rotate-180"
                                    strokeWidth={1.5}
                                />
                            </button>

                            <div className={clsx(
                                "inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6",
                                isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
                            )}>
                                <Sparkles size={14} className="text-[#00FFC6]" />
                                <span className={clsx("text-xs font-bold uppercase tracking-[0.2em]", isDark ? "text-white/60" : "text-black/60")}>
                                    {t('core_values_badge')}
                                </span>
                            </div>
                            <h2 className={clsx("text-4xl md:text-5xl font-bold mb-4", isDark ? "text-white" : "text-black")}>
                                {t('core_values_title')}
                            </h2>
                            <p className={clsx("text-lg max-w-2xl mx-auto", isDark ? "text-white/50" : "text-black/50")}>
                                {t('core_values_subtitle')}
                            </p>
                        </div>

                        {/* Value Pillars Grid */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {valuePillars.map((pillar, index) => {
                                const Icon = pillar.icon;
                                const isActive = activeValuePillar === index;
                                return (
                                    <div
                                        key={pillar.id}
                                        onClick={() => setActiveValuePillar(index)}
                                        className={clsx(
                                            "group relative p-8 rounded-3xl border cursor-pointer transition-all duration-500",
                                            isDark
                                                ? "bg-[#111] border-white/10 hover:border-white/20"
                                                : "bg-white border-black/10 hover:border-black/20 shadow-sm hover:shadow-lg",
                                            isActive && "ring-2",
                                        )}
                                        style={{
                                            '--pillar-color': pillar.color,
                                            ringColor: isActive ? pillar.color : 'transparent'
                                        } as React.CSSProperties}
                                    >
                                        {/* Icon */}
                                        <div
                                            className={clsx(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
                                                isActive ? "scale-110" : ""
                                            )}
                                            style={{ backgroundColor: `${pillar.color}20` }}
                                        >
                                            <Icon size={28} style={{ color: pillar.color }} />
                                        </div>

                                        {/* Title */}
                                        <h3 className={clsx("text-2xl font-bold mb-2", isDark ? "text-white" : "text-black")}>
                                            {pillar.title}
                                        </h3>
                                        <p className="text-sm mb-4" style={{ color: pillar.color }}>
                                            {pillar.subtitle}
                                        </p>

                                        {/* Description */}
                                        <p className={clsx(
                                            "text-sm leading-relaxed mb-6",
                                            isDark ? "text-white/60" : "text-black/60"
                                        )}>
                                            {pillar.description}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex gap-6">
                                            {pillar.stats.map(stat => (
                                                <div key={stat.label}>
                                                    <div className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-black")}>
                                                        {stat.value}
                                                    </div>
                                                    <div className={clsx("text-xs uppercase tracking-wider", isDark ? "text-white/40" : "text-black/40")}>
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Active Indicator */}
                                        <div
                                            className={clsx(
                                                "absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500",
                                                isActive ? "w-20 opacity-100" : "w-0 opacity-0"
                                            )}
                                            style={{ backgroundColor: pillar.color }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pillar Navigation Dots */}
                        <div className="flex justify-center gap-2 mt-8">
                            {valuePillars.map((pillar, index) => (
                                <button
                                    key={pillar.id}
                                    onClick={() => setActiveValuePillar(index)}
                                    className={clsx(
                                        "w-2 h-2 rounded-full transition-all duration-300",
                                        activeValuePillar === index
                                            ? "w-8"
                                            : (isDark ? "bg-white/20 hover:bg-white/40" : "bg-black/20 hover:bg-black/40")
                                    )}
                                    style={{
                                        backgroundColor: activeValuePillar === index ? pillar.color : undefined
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* === LATEST 5 PRODUCTS STRIP（配置：data/homeShowcase.ts） === */}
            {latestProducts && latestProducts.length > 0 && (
                <section className={clsx("py-8 border-b relative z-10", isDark ? "bg-transparent border-white/5" : "bg-transparent border-black/5")}>
                    <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-gradient-to-b from-[#00FFC6] to-[#00D9B8] rounded-full" />
                                <div>
                                    <h2 className={clsx("text-2xl font-bold tracking-tight mb-1", isDark ? "text-white" : "text-black")}>
                                        {t('home_date_format') === 'zh-CN' ? '最近发布的 5 款新品' : 'Latest 5 Products'}
                                    </h2>
                                    <p className={clsx("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
                                        {t('home_date_format') === 'zh-CN' ? '精选最新发布的智能硬件产品' : 'Curated latest hardware releases'}
                                    </p>
                                </div>
                            </div>
                            {onViewProduct && (
                                <button
                                    onClick={() => setView(AppView.PRODUCTS)}
                                    className={clsx(
                                        "text-sm font-medium flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all",
                                        isDark
                                            ? "text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
                                            : "text-black/70 hover:text-black bg-gray-100 hover:bg-gray-200"
                                    )}
                                >
                                    {t('products_section_all')} <ChevronRight size={14} />
                                </button>
                            )}
                        </div>
                        {/* 手机端：默认显示两个完整卡片，第三个露出一部分 */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory sm:snap-none -mx-4 px-4 sm:mx-0 sm:px-0">
                            {latestProducts.slice(0, 5).map((product, index) => (
                                <button
                                    key={product.id}
                                    onClick={() => handleViewProductWithTracking(product)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleViewProductWithTracking(product);
                                        }
                                    }}
                                    className={clsx(
                                        "group flex-shrink-0 w-56 rounded-xl overflow-hidden text-left hover:-translate-y-1 hover:shadow-xl transition-all snap-start",
                                        "focus:outline-none focus:ring-2 focus:ring-[#00FFC6] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                                        index === latestProducts.slice(0, 5).length - 1 ? "sm:mr-0 mr-16" : "",
                                        isDark ? "glass-card" : "glass-card-light"
                                    )}
                                    aria-label={`${product.name} - ${t('home_date_format') === 'zh-CN' ? '查看详情' : 'View details'}`}
                                >
                                    <div className="relative w-full h-32 bg-gray-100 dark:bg-white/5 overflow-hidden">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const fallback = target.parentElement?.querySelector('.image-fallback') as HTMLElement;
                                                if (fallback) fallback.style.display = 'flex';
                                            }}
                                        />
                                        {/* 图片加载失败占位符 */}
                                        <div className="image-fallback hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                            <Sparkles size={24} className="text-gray-400 dark:text-gray-500" />
                                        </div>
                                        {/* 推荐评分标签 */}
                                        {product.recommendScore !== undefined && product.recommendScore >= 80 && (
                                            <div className="absolute top-2 right-2 px-2 py-1 bg-[#FF4D00] text-white text-[10px] font-bold rounded-md flex items-center gap-1 z-10">
                                                <Star size={10} fill="white" />
                                                {product.recommendScore}
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-3 py-2.5 space-y-1">
                                        {product.brand && product.brand.trim().length > 0 && (
                                            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-white/50 font-medium">
                                                {product.brand}
                                            </div>
                                        )}
                                        <div className={clsx("text-sm font-bold line-clamp-2 leading-snug group-hover:text-[#FF4D00] transition-colors", isDark ? "text-white" : "text-black")}>
                                            {product.name}
                                        </div>
                                        {/* 一句话：这是什么 · 适合谁 */}
                                        <div className={clsx(
                                            "text-[11px] leading-snug line-clamp-2 mb-1",
                                            isDark ? "text-white/70" : "text-gray-700"
                                        )}>
                                            {summarize(
                                                product.localizedDescription?.strategy || product.description,
                                                55
                                            ) || (t('home_date_format') === 'zh-CN'
                                                ? '智能硬件新品，具体定位可在详情页查看。'
                                                : 'New intelligent hardware – see details in the product page.')}
                                        </div>
                                        {/* 一句话：值得一提的亮点 */}
                                        {product.features && product.features.length > 0 && (
                                            <div className={clsx(
                                                "text-[10px] leading-snug line-clamp-1 flex items-center gap-1",
                                                isDark ? "text-white/60" : "text-gray-600"
                                            )}>
                                                <Zap size={10} className="text-[#FF4D00]" />
                                                <span>{product.features[0]}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-white/10">
                                            <span className={clsx("text-[10px] flex items-center gap-1", isDark ? "text-white/50" : "text-gray-500")}>
                                                <Calendar size={9} />
                                                {product.launchDate}
                                            </span>
                                            <span className={clsx("text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all", isDark ? "text-[#00FFC6]" : "text-[#2563EB]")}>
                                                {t('home_date_format') === 'zh-CN' ? '查看' : 'View'}
                                                <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* === STARTUP SPOTLIGHT (Product Hunt / Mid-End Style) === */}
            <section className={clsx("py-12 border-b relative z-10", isDark ? "bg-transparent border-white/5" : "bg-transparent border-black/5")}>
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-8 bg-gradient-to-b from-[#FF4D00] to-[#E64600] rounded-full" />
                                <h2 className={clsx("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-black")}>
                                    {t('home_section_startups')}
                                </h2>
                                <span className={clsx(
                                    "px-3 py-1 rounded-full text-xs font-medium",
                                    isDark ? "bg-[#FF4D00]/20 text-[#FF4D00]" : "bg-[#FF4D00]/10 text-[#FF4D00]"
                                )}>
                                    {startupStories.length} {t('home_date_format') === 'zh-CN' ? '个' : 'items'}
                                </span>
                            </div>
                            <p className={clsx("text-sm", isDark ? "text-white/60" : "text-gray-600")}>
                                {t('home_date_format') === 'zh-CN'
                                    ? '聚焦近 90 天最值得关注的新品与项目，AI 智能推荐评分 80+ 的产品将突出显示'
                                    : 'Highlights from the most interesting launches in the last 90 days. Products with AI recommendation score 80+ are highlighted'}
                            </p>
                        </div>
                        <button
                            onClick={() => setView(AppView.PRODUCTS)}
                            className={clsx(
                                "text-sm font-medium flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all",
                                isDark
                                    ? "text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
                                    : "text-black/70 hover:text-black bg-gray-100 hover:bg-gray-200"
                            )}
                        >
                            {t('products_section_all')} <ChevronRight size={16} />
                        </button>
                    </div>

                    {/* 初创雷达 - 左右分栏 + 展开后下方网格 */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* 左侧大卡片 - 始终显示 */}
                        {startupStories.length > 0 && (
                            <GlassmorphicCard
                                hoverEffect="lift"
                                borderGlow={true}
                                className={clsx(
                                    "group flex flex-col overflow-hidden cursor-pointer w-full lg:w-[40%] lg:flex-shrink-0 transition-all duration-300 hover:-translate-y-1",
                                    "focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                )}
                            >
                                <article
                                    onClick={() => onViewNews(startupStories[0])}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onViewNews(startupStories[0]);
                                        }
                                    }}
                                    tabIndex={0}
                                    aria-label={`${startupStories[0].title} - ${t('home_date_format') === 'zh-CN' ? '查看详情' : 'View details'}`}
                                    className="flex flex-col h-full"
                                >
                                <div className="relative w-full">
                                    <div style={{ aspectRatio: '4/3' }} className="overflow-hidden bg-gray-100 dark:bg-white/5">
                                        <img
                                            src={startupStories[0].imageUrl}
                                            alt={startupStories[0].title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const fallback = target.parentElement?.querySelector('.image-fallback') as HTMLElement;
                                                if (fallback) fallback.style.display = 'flex';
                                            }}
                                        />
                                        <div className="image-fallback hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                            <Rocket size={32} className="text-gray-400 dark:text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className={clsx("p-4", isDark ? "bg-[#111]" : "bg-white")}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-[#FF4D00] text-white text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1"><Rocket size={10} />{startupStories[0].category}</span>
                                        <span className={clsx("text-[10px]", isDark ? "text-white/50" : "text-gray-500")}>{startupStories[0].date}</span>
                                    </div>
                                    <h3 className={clsx("text-base sm:text-lg font-bold leading-snug mb-2 group-hover:text-[#FF4D00] transition-colors", isDark ? "text-white" : "text-gray-900")}>{startupStories[0].title}</h3>
                                    <p className={clsx("text-xs sm:text-sm line-clamp-2 mb-3", isDark ? "text-white/60" : "text-gray-600")}>{startupStories[0].description}</p>
                                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200 dark:border-white/10">
                                        <div className="flex items-center gap-2"><Zap size={14} className="text-[#FF4D00]" /><span className={clsx("text-xs font-medium", isDark ? "text-white/50" : "text-gray-500")}>{t('home_date_format') === 'zh-CN' ? '热门新品' : 'Hot Launch'}</span></div>
                                        <span className={clsx("text-xs font-medium flex items-center gap-1", isDark ? "text-white/50 group-hover:text-[#FF4D00]" : "text-gray-500 group-hover:text-[#FF4D00]")}>{t('home_date_format') === 'zh-CN' ? '查看详情' : 'View'} <ArrowUpRight size={12} /></span>
                                    </div>
                                </div>
                                </article>
                            </GlassmorphicCard>
                        )}
                        {/* 右侧小卡片网格 - 默认6个，根据评分调整大小 */}
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 auto-rows-fr gap-3">
                            {startupStories.slice(1, 7).map((item, index) => {
                                const mobileHidden = index > 1 ? 'hidden sm:block' : '';
                                const isValidHighScore = isHighScore(item.recommendScore);
                                const sizeClass = isValidHighScore ? 'scale-110 z-10' : '';
                                const borderClass = isValidHighScore ? 'ring-2 ring-[#FF4D00] ring-opacity-50' : '';
                                return (
                                    <div key={item.id} className={clsx("relative", mobileHidden)}>
                                        <GlassmorphicCard
                                            hoverEffect="glow"
                                            borderGlow={isValidHighScore}
                                            className={clsx(
                                                "group overflow-hidden cursor-pointer w-full h-full transition-all duration-300 hover:-translate-y-1",
                                                sizeClass,
                                                borderClass
                                            )}
                                        >
                                            <article
                                                onClick={() => onViewNews(item)}
                                                className="h-full flex flex-col"
                                            >
                                            <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                                                <div style={{ aspectRatio: '3/2' }}>
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        loading="lazy"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const fallback = target.parentElement?.parentElement?.querySelector('.image-fallback') as HTMLElement;
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="image-fallback hidden absolute inset-0 items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                                                        <Rocket size={24} className="text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-2.5">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className="px-1.5 py-0.5 bg-[#FF4D00] text-white text-[8px] font-bold uppercase rounded flex items-center gap-1"><Rocket size={8} />{item.category}</span>
                                                    {item.recommendScore !== undefined && item.recommendScore >= 80 && (
                                                        <span className="px-1.5 py-0.5 bg-[#FF4D00]/20 text-[#FF4D00] text-[8px] font-bold rounded flex items-center gap-0.5">
                                                            <Star size={7} fill="currentColor" />
                                                            {item.recommendScore}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className={clsx("text-[11px] sm:text-[12px] font-bold leading-snug line-clamp-2 group-hover:text-[#FF4D00] transition-colors mb-1", isDark ? "text-white" : "text-gray-900")}>{item.title}</h3>
                                                <p className={clsx("text-[9px] line-clamp-2 mb-2 leading-snug", isDark ? "text-white/60" : "text-gray-600")}>{item.description}</p>
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-gray-100 dark:border-white/5">
                                                    <div className="flex items-center gap-1 text-[9px] text-gray-400"><Clock size={9} /><span>{item.date}</span></div>
                                                    <span className="text-gray-300 dark:text-white/20">·</span>
                                                    <span className={clsx("text-[9px] font-medium flex items-center gap-0.5", isDark ? "text-[#FF4D00]/70" : "text-[#FF4D00]")}>{t('home_date_format') === 'zh-CN' ? '查看' : 'View'} <ArrowUpRight size={9} /></span>
                                                </div>
                                            </div>
                                            </article>
                                        </GlassmorphicCard>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* 展开后：下方更多卡片，根据评分调整大小 */}
                    {expandedStartups && startupStories.length > 7 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 auto-rows-fr gap-3">
                            {startupStories.slice(7, 17).map((item) => {
                                const isValidHighScore = isHighScore(item.recommendScore);
                                const sizeClass = isValidHighScore ? 'scale-110 z-10' : '';
                                const borderClass = isValidHighScore ? 'ring-2 ring-[#FF4D00] ring-opacity-50' : '';
                                return (
                                    <div key={item.id} className="relative">
                                        <GlassmorphicCard
                                            hoverEffect="glow"
                                            borderGlow={isValidHighScore}
                                            className={clsx(
                                                "group overflow-hidden cursor-pointer w-full h-full transition-all duration-300 hover:-translate-y-1",
                                                sizeClass,
                                                borderClass
                                            )}
                                        >
                                            <article
                                                onClick={() => onViewNews(item)}
                                                className="h-full flex flex-col"
                                            >
                                            <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                                                <div style={{ aspectRatio: '3/2' }}><img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                                            </div>
                                            <div className="p-2.5">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <span className="px-1.5 py-0.5 bg-[#FF4D00] text-white text-[8px] font-bold uppercase rounded flex items-center gap-1"><Rocket size={8} />{item.category}</span>
                                                </div>
                                                <h3 className={clsx("text-[11px] sm:text-[12px] font-bold leading-snug line-clamp-2 group-hover:text-[#FF4D00] transition-colors mb-1", isDark ? "text-white" : "text-gray-900")}>{item.title}</h3>
                                                <p className={clsx("text-[9px] line-clamp-1 mb-2", isDark ? "text-white/60" : "text-gray-600")}>{item.description}</p>
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-gray-100 dark:border-white/5">
                                                    <div className="flex items-center gap-1 text-[9px] text-gray-400"><Clock size={9} /><span>{item.date}</span></div>
                                                    <span className="text-gray-300 dark:text-white/20">·</span>
                                                    <span className={clsx("text-[9px] font-medium flex items-center gap-0.5", isDark ? "text-[#FF4D00]/70" : "text-[#FF4D00]")}>{t('home_date_format') === 'zh-CN' ? '查看' : 'View'} <ArrowUpRight size={9} /></span>
                                                </div>
                                            </div>
                                            </article>
                                        </GlassmorphicCard>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* 展开/收起按钮 */}
                    {startupStories.length > 7 && (
                        <button
                            onClick={() => setExpandedStartups(!expandedStartups)}
                            className={clsx(
                                "w-full mt-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2",
                                isDark
                                    ? "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                            )}
                        >
                            <span>{expandedStartups
                                ? (t('home_date_format') === 'zh-CN' ? '收起' : 'Show Less')
                                : (t('home_date_format') === 'zh-CN' ? '展开更多' : 'Show More')
                            }</span>
                            <ChevronDown size={16} className={clsx("transition-transform", expandedStartups && "rotate-180")} />
                        </button>
                    )}
                </div>
            </section>

            {/* === LATEST INTEL (Toutiao / News Feed Style) === */}
            <section className={clsx("py-8 relative z-10", isDark ? "bg-transparent" : "bg-transparent")}>
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                    {/* Full Width News Feed - No Sidebar */}
                    <div>
                        {/* Header - Toutiao Style Nav */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-gray-100 dark:border-white/5 pb-4 gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
                                    <h2 className={clsx("text-2xl font-bold tracking-tight", isDark ? "text-white" : "text-[#222]")}>
                                        {t('home_section_latest')}
                                    </h2>
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-xs font-medium",
                                        isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-500/10 text-blue-600"
                                    )}>
                                        {latestIntel.length} {t('home_date_format') === 'zh-CN' ? '条' : 'items'}
                                    </span>
                                </div>
                                <p className={clsx("text-sm", isDark ? "text-white/60" : "text-gray-600")}>
                                    {t('home_date_format') === 'zh-CN'
                                        ? '只展示近 30 天内的深度情报和重点新闻，为您提供战略洞察'
                                        : 'Only showing key intel and headlines from the last 30 days, providing strategic insights'}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 text-sm font-medium">
                                <span className={clsx("cursor-pointer px-3 py-1.5 rounded-lg font-bold transition-all", isDark ? "bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30" : "bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/20")}>{t('home_date_format') === 'zh-CN' ? '推荐' : 'For You'}</span>
                                <span className={clsx("cursor-pointer px-3 py-1.5 rounded-lg transition-all", isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-gray-100 text-gray-600")}>{t('home_date_format') === 'zh-CN' ? '热点' : 'Hot'}</span>
                                <span className={clsx("cursor-pointer px-3 py-1.5 rounded-lg transition-all", isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-gray-100 text-gray-600")}>{t('home_date_format') === 'zh-CN' ? '科技' : 'Tech'}</span>
                                <span className={clsx("cursor-pointer px-3 py-1.5 rounded-lg transition-all", isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-gray-100 text-gray-600")}>AI</span>
                                <span className={clsx("cursor-pointer px-3 py-1.5 rounded-lg transition-all", isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-gray-100 text-gray-600")}>{t('home_date_format') === 'zh-CN' ? '硬件' : 'Gadgets'}</span>
                            </div>
                        </div>

                        {/* 深度情报 - 左右分栏 + 展开后下方网格 */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* 左侧大卡片 - 始终显示 */}
                            {latestIntel.length > 0 && (
                                <GlassmorphicCard
                                    hoverEffect="lift"
                                    borderGlow={true}
                                    className="group overflow-hidden cursor-pointer w-full lg:w-[40%] lg:flex-shrink-0 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <article onClick={() => onViewNews(latestIntel[0])} className="flex flex-col h-full">
                                    <div className="relative w-full">
                                        <div style={{ aspectRatio: '4/3' }} className="overflow-hidden bg-gray-100 dark:bg-white/5">
                                            <img src={latestIntel[0].imageUrl} alt={latestIntel[0].title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                        </div>
                                    </div>
                                    <div className={clsx("p-4", isDark ? "bg-[#111]" : "bg-white")}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-1 bg-[#FF4D00] text-white text-[10px] font-bold rounded flex items-center gap-1"><Award size={10} />{t('home_date_format') === 'zh-CN' ? '头条' : 'Top'}</span>
                                            <span className={clsx("px-2 py-1 text-[10px] rounded", isDark ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700")}>{latestIntel[0].category}</span>
                                        </div>
                                        <h3 className={clsx("text-base sm:text-lg font-bold leading-snug mb-2 group-hover:text-[#FF4D00] transition-colors", isDark ? "text-white" : "text-gray-900")}>{latestIntel[0].title}</h3>
                                        <p className={clsx("text-xs sm:text-sm line-clamp-2 mb-3", isDark ? "text-white/60" : "text-gray-600")}>{latestIntel[0].description}</p>
                                        <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200 dark:border-white/10">
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400"><span className={clsx("font-medium", isDark ? "text-white/40" : "text-gray-500")}>TechCrunch</span><span>·</span><span>{latestIntel[0].date}</span></div>
                                            <span className={clsx("text-xs font-medium flex items-center gap-1", isDark ? "text-white/50 group-hover:text-[#FF4D00]" : "text-gray-500 group-hover:text-[#FF4D00]")}>{t('home_date_format') === 'zh-CN' ? '阅读' : 'Read'} <ArrowUpRight size={12} /></span>
                                        </div>
                                    </div>
                                    </article>
                                </GlassmorphicCard>
                            )}
                            {/* 右侧小卡片网格 - 默认6个 */}
                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {latestIntel.slice(1, 7).map((news, index) => {
                                    const mobileHidden = index > 1 ? 'hidden sm:block' : '';
                                    const sources = ['TechCrunch', '36Kr', 'The Verge', 'Bloomberg', 'Wired'];
                                    return (
                                        <GlassmorphicCard
                                            key={news.id}
                                            hoverEffect="glow"
                                            borderGlow={news.recommendScore !== undefined && news.recommendScore >= 80}
                                            className={clsx("group overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1", mobileHidden)}
                                        >
                                            <article onClick={() => onViewNews(news)} className="h-full flex flex-col">
                                            <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                                                <div style={{ aspectRatio: '3/2' }}><img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /></div>
                                            </div>
                                            <div className="p-2.5">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className={clsx("px-1.5 py-0.5 rounded text-[8px] font-medium", isDark ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700")}>{news.category}</span>
                                                    {news.recommendScore !== undefined && news.recommendScore >= 80 && (
                                                        <span className="px-1.5 py-0.5 bg-[#FF4D00]/20 text-[#FF4D00] text-[8px] font-bold rounded flex items-center gap-0.5">
                                                            <Star size={7} fill="currentColor" />
                                                            {news.recommendScore}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className={clsx("text-[11px] sm:text-[12px] font-bold leading-snug line-clamp-2 group-hover:text-[#FF4D00] transition-colors mb-1", isDark ? "text-white" : "text-gray-900")}>{news.title}</h3>
                                                <p className={clsx("text-[9px] line-clamp-2 mb-2 leading-snug", isDark ? "text-white/60" : "text-gray-600")}>{news.description}</p>
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-gray-100 dark:border-white/5">
                                                    <span className={clsx("text-[9px] font-medium", isDark ? "text-white/50" : "text-gray-500")}>{sources[index % 5]}</span>
                                                    <span className="text-gray-300 dark:text-white/20">·</span>
                                                    <span className="text-[9px] text-gray-400">{news.date}</span>
                                                    <span className={clsx("ml-auto text-[9px] font-medium flex items-center gap-0.5", isDark ? "text-[#FF4D00]/70" : "text-[#FF4D00]")}><ArrowUpRight size={9} /></span>
                                                </div>
                                            </div>
                                            </article>
                                        </GlassmorphicCard>
                                    );
                                })}
                            </div>
                        </div>
                        {/* 展开后：下方更多卡片 */}
                        {expandedNews && latestIntel.length > 7 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {latestIntel.slice(7, 17).map((news, index) => {
                                    const sources = ['TechCrunch', '36Kr', 'The Verge', 'Bloomberg', 'Wired'];
                                    return (
                                        <GlassmorphicCard
                                            key={news.id}
                                            hoverEffect="glow"
                                            className="group overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                                        >
                                            <article onClick={() => onViewNews(news)} className="h-full flex flex-col">
                                            <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                                                <div style={{ aspectRatio: '3/2' }}><img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /></div>
                                            </div>
                                            <div className="p-2.5">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <span className={clsx("px-1.5 py-0.5 rounded text-[8px] font-medium", isDark ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700")}>{news.category}</span>
                                                </div>
                                                <h3 className={clsx("text-[11px] sm:text-[12px] font-bold leading-snug line-clamp-2 group-hover:text-[#FF4D00] transition-colors mb-1", isDark ? "text-white" : "text-gray-900")}>{news.title}</h3>
                                                <p className={clsx("text-[9px] line-clamp-1 mb-2", isDark ? "text-white/60" : "text-gray-600")}>{news.description}</p>
                                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-gray-100 dark:border-white/5">
                                                    <span className={clsx("text-[9px] font-medium", isDark ? "text-white/50" : "text-gray-500")}>{sources[(index + 7) % 5]}</span>
                                                    <span className="text-gray-300 dark:text-white/20">·</span>
                                                    <span className="text-[9px] text-gray-400">{news.date}</span>
                                                    <span className={clsx("ml-auto text-[9px] font-medium flex items-center gap-0.5", isDark ? "text-[#FF4D00]/70" : "text-[#FF4D00]")}><ArrowUpRight size={9} /></span>
                                                </div>
                                            </div>
                                            </article>
                                        </GlassmorphicCard>
                                    );
                                })}
                            </div>
                        )}

                        {/* 展开/收起按钮 */}
                        {latestIntel.length > 7 && (
                            <button
                                onClick={() => setExpandedNews(!expandedNews)}
                                className={clsx(
                                    "w-full mt-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2",
                                    isDark
                                        ? "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <span>{expandedNews
                                    ? (t('home_date_format') === 'zh-CN' ? '收起' : 'Show Less')
                                    : (t('home_date_format') === 'zh-CN' ? '展开更多' : 'Show More')
                                }</span>

                                <ChevronDown size={16} className={clsx("transition-transform", expandedNews && "rotate-180")} />
                            </button>
                        )}
                    </div>

                    {/* Trending Tags - Inline with news */}
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <span className={clsx("text-sm font-medium flex items-center gap-2", isDark ? "text-white/60" : "text-gray-500")}>
                            <TrendingUp size={14} className="text-[#FF4D00]" />
                            {t('home_section_trending')}:
                        </span>
                        {['AI Pin', 'Rabbit R1', 'Vision Pro', 'Figure 01', 'B100', 'Sora', 'Groq', 'GPT-5', 'Llama 3'].map(tag => (
                            <span
                                key={tag}
                                className={clsx(
                                    "px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors border",
                                    isDark
                                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                                        : "bg-gray-100 border-transparent hover:bg-gray-200 text-gray-700"
                                )}
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* === CLASSIC MILESTONES SECTION === */}
            <section className="py-24 relative overflow-hidden z-10">
                {/* Jobs-Inspired Minimalist Background with Future AI Elements */}
                <div className={clsx("absolute inset-0 z-0 overflow-hidden", isDark ? "opacity-0" : "")}>
                    {/* Base - Elegant Minimal Gradient (Jobs Style) - Only for Light Mode */}
                    <div className={clsx(
                        "absolute inset-0",
                        isDark
                            ? "bg-transparent"
                            : "bg-gradient-to-b from-[#fafafa] via-[#ffffff] to-[#f5f5f7]"
                    )} />

                    {/* Subtle Grid Pattern - Very Light (Tech Feel) */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px), 
                                             linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)`,
                            backgroundSize: '80px 80px',
                        }}
                    />

                    {/* Soft Glow Points - Future AI Elements (Very Subtle) */}
                    <div
                        className={clsx(
                            "absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.08]",
                            isDark ? "bg-white" : "bg-black"
                        )}
                        style={{
                            animation: 'gentlePulse 8s ease-in-out infinite',
                        }}
                    />
                    <div
                        className={clsx(
                            "absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.06]",
                            isDark ? "bg-white" : "bg-black"
                        )}
                        style={{
                            animation: 'gentlePulse 10s ease-in-out infinite',
                            animationDelay: '2s',
                        }}
                    />
                    <div
                        className={clsx(
                            "absolute top-1/2 right-1/3 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05]",
                            isDark ? "bg-white" : "bg-black"
                        )}
                        style={{
                            animation: 'gentlePulse 12s ease-in-out infinite',
                            animationDelay: '4s',
                        }}
                    />

                    {/* Subtle Particle Points - AI Intelligence (Minimal) */}
                    <div className="absolute inset-0">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div
                                key={`particle-intel-${i}`}
                                className={clsx(
                                    "absolute rounded-full",
                                    isDark ? "bg-white" : "bg-black"
                                )}
                                style={{
                                    width: `${Math.random() * 1.5 + 0.5}px`,
                                    height: `${Math.random() * 1.5 + 0.5}px`,
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    opacity: Math.random() * 0.3 + 0.1,
                                    animation: `particleFade ${Math.random() * 4 + 3}s ease-in-out infinite`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* Elegant Overlay - Jobs Refinement */}
                    <div className={clsx(
                        "absolute inset-0",
                        isDark
                            ? "bg-gradient-to-b from-transparent via-transparent to-black/5"
                            : "bg-gradient-to-b from-transparent via-transparent to-white/10"
                    )} />
                </div>
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
                                    <History size={20} className="text-[#8B5CF6]" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B5CF6]">
                                    {t('home_date_format') === 'zh-CN' ? '经典回顾' : 'Classic Milestones'}
                                </span>
                            </div>
                            <h2 className={clsx("text-3xl md:text-4xl font-bold", isDark ? "text-white" : "text-black")}>
                                {t('home_date_format') === 'zh-CN' ? '改变世界的硬件' : 'Hardware That Changed the World'}
                            </h2>
                            <p className={clsx("text-sm mt-2", isDark ? "text-white/50" : "text-black/50")}>
                                {t('home_date_format') === 'zh-CN'
                                    ? '回顾那些定义了科技历史的经典产品'
                                    : 'Revisiting the classic products that defined tech history'}
                            </p>
                        </div>
                        <button
                            onClick={() => setView(AppView.LEGACY)}
                            className={clsx(
                                "group flex items-center gap-2 px-6 py-3 rounded-full border transition-all hover:scale-105",
                                isDark
                                    ? "border-white/20 text-white hover:bg-white/10"
                                    : "border-black/20 text-black hover:bg-black/5"
                            )}
                        >
                            <span className="text-sm font-medium">
                                {t('home_date_format') === 'zh-CN' ? '查看全部' : 'View All'}
                            </span>
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* 经典回顾 - 左右分栏 + 展开后下方网格 */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* 左侧大卡片 - 始终显示 */}
                        {displayedMilestones.length > 0 && (
                            <GlassmorphicCard
                                hoverEffect="lift"
                                borderGlow={true}
                                className="group overflow-hidden cursor-pointer w-full lg:w-[40%] lg:flex-shrink-0 transition-all duration-300 hover:-translate-y-1"
                            >
                                <article onClick={() => onViewProduct && onViewProduct(displayedMilestones[0])} className="flex flex-col h-full">
                                <div className="relative w-full">
                                    <div style={{ aspectRatio: '4/3' }} className="overflow-hidden bg-gray-100 dark:bg-white/5">
                                        <img src={displayedMilestones[0].imageUrl} alt={displayedMilestones[0].name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                    </div>
                                </div>
                                <div className={clsx("p-4", isDark ? "bg-[#111]" : "bg-white")}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-[#8B5CF6] text-white text-[10px] font-bold rounded">{displayedMilestones[0].launchDate.split('-')[0]}</span>
                                        <span className={clsx("px-2 py-1 text-[10px] rounded", isDark ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700")}>{displayedMilestones[0].category || (t('home_date_format') === 'zh-CN' ? '经典产品' : 'Classic')}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="text-xs uppercase tracking-wider text-[#8B5CF6] font-bold">{displayedMilestones[0].brand}</div>
                                        {getFounder(displayedMilestones[0]) && (
                                            <div className={clsx("text-[10px] flex items-center gap-1", isDark ? "text-white/60" : "text-gray-500")}>
                                                <User size={10} className="text-[#8B5CF6]" />
                                                <span>{getFounder(displayedMilestones[0])}</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className={clsx("text-base sm:text-lg font-bold leading-snug mb-2 group-hover:text-[#8B5CF6] transition-colors", isDark ? "text-white" : "text-gray-900")}>{displayedMilestones[0].name}</h3>
                                    <p className={clsx("text-xs sm:text-sm line-clamp-2 mb-3", isDark ? "text-white/60" : "text-gray-600")}>
                                        {displayedMilestones[0].legacyImpact || displayedMilestones[0].description || (t('home_date_format') === 'zh-CN'
                                            ? '改变世界的经典产品'
                                            : 'A product that changed the world')}
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-200 dark:border-white/10">
                                        <div className="flex items-center gap-2"><History size={14} className="text-[#8B5CF6]" /><span className={clsx("text-xs font-medium", isDark ? "text-white/50" : "text-gray-500")}>{t('home_date_format') === 'zh-CN' ? '经典回顾' : 'Classic'}</span></div>
                                        <span className={clsx("text-xs font-medium flex items-center gap-1", isDark ? "text-white/50 group-hover:text-[#8B5CF6]" : "text-gray-500 group-hover:text-[#8B5CF6]")}>{t('home_date_format') === 'zh-CN' ? '了解更多' : 'Learn'} <ArrowUpRight size={12} /></span>
                                    </div>
                                </div>
                                </article>
                            </GlassmorphicCard>
                        )}
                        {/* 右侧小卡片网格 - 默认6个 */}
                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {displayedMilestones.slice(1, 7).map((milestone, index) => {
                                const mobileHidden = index > 1 ? 'hidden sm:block' : '';
                                return (
                                    <GlassmorphicCard
                                        key={milestone.id}
                                        hoverEffect="glow"
                                        className={clsx("group overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1", mobileHidden)}
                                    >
                                        <article onClick={() => onViewProduct && onViewProduct(milestone)} className="h-full flex flex-col">
                                        <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                                            <div style={{ aspectRatio: '3/2' }}><img src={milestone.imageUrl} alt={milestone.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" /></div>
                                        </div>
                                        <div className="p-2.5">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="px-1.5 py-0.5 bg-[#8B5CF6] text-white text-[8px] font-bold rounded">{milestone.launchDate.split('-')[0]}</span>
                                                <span className={clsx("px-1.5 py-0.5 text-[8px] rounded", isDark ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700")}>{milestone.category || 'Classic'}</span>
                                            </div>
                                            <h3 className={clsx("text-[11px] sm:text-[12px] font-bold leading-snug line-clamp-2 group-hover:text-[#8B5CF6] transition-colors mb-1", isDark ? "text-white" : "text-gray-900")}>{milestone.name}</h3>
                                            <p className={clsx("text-[9px] line-clamp-1 mb-1.5", isDark ? "text-white/60" : "text-gray-600")}>
                                                {milestone.legacyImpact || milestone.description || (t('home_date_format') === 'zh-CN'
                                                    ? '改变世界的经典产品'
                                                    : 'A classic that changed the world')}
                                            </p>
                                            {getFounder(milestone) && (
                                                <div className={clsx("text-[8px] flex items-center gap-1 mb-1.5", isDark ? "text-white/50" : "text-gray-500")}>
                                                    <User size={8} className="text-[#8B5CF6]" />
                                                    <span className="line-clamp-1">{getFounder(milestone)}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-gray-100 dark:border-white/5">
                                                <span className={clsx("text-[9px] font-medium", isDark ? "text-[#8B5CF6]/70" : "text-[#8B5CF6]")}>{milestone.brand}</span>
                                                <span className="text-gray-300 dark:text-white/20">·</span>
                                                <span className="text-[9px] text-gray-400 flex items-center gap-1"><History size={9} />{milestone.launchDate.split('-')[0]}</span>
                                                <span className={clsx("ml-auto text-[9px] font-medium flex items-center gap-0.5", isDark ? "text-[#8B5CF6]/70" : "text-[#8B5CF6]")}><ArrowUpRight size={9} /></span>
                                            </div>
                                        </div>
                                        </article>
                                    </GlassmorphicCard>
                                );
                            })}
                        </div>
                    </div>
                    {/* 展开后：下方更多卡片 */}
                    {expandedMilestones && displayedMilestones.length > 7 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {displayedMilestones.slice(7, 17).map((milestone) => (
                                <GlassmorphicCard
                                    key={milestone.id}
                                    hoverEffect="glow"
                                    className="group overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                                >
                                    <article onClick={() => onViewProduct && onViewProduct(milestone)} className="h-full flex flex-col">
                                    <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                                        <div style={{ aspectRatio: '3/2' }}><img src={milestone.imageUrl} alt={milestone.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                                    </div>
                                    <div className="p-2.5">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="px-1.5 py-0.5 bg-[#8B5CF6] text-white text-[8px] font-bold rounded">{milestone.launchDate.split('-')[0]}</span>
                                            <span className={clsx("px-1.5 py-0.5 text-[8px] rounded", isDark ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700")}>{milestone.category || 'Classic'}</span>
                                        </div>
                                        <h3 className={clsx("text-[11px] sm:text-[12px] font-bold leading-snug line-clamp-2 group-hover:text-[#8B5CF6] transition-colors mb-1", isDark ? "text-white" : "text-gray-900")}>{milestone.name}</h3>
                                        <p className={clsx("text-[9px] line-clamp-1 mb-1.5", isDark ? "text-white/60" : "text-gray-600")}>
                                            {milestone.legacyImpact || milestone.description || (t('home_date_format') === 'zh-CN'
                                                ? '改变世界的经典产品'
                                                : 'A classic that changed the world')}
                                        </p>
                                        {getFounder(milestone) && (
                                            <div className={clsx("text-[8px] flex items-center gap-1 mb-1.5", isDark ? "text-white/50" : "text-gray-500")}>
                                                <User size={8} className="text-[#8B5CF6]" />
                                                <span className="line-clamp-1">{getFounder(milestone)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-gray-100 dark:border-white/5">
                                            <span className={clsx("text-[9px] font-medium", isDark ? "text-[#8B5CF6]/70" : "text-[#8B5CF6]")}>{milestone.brand}</span>
                                            <span className="text-gray-300 dark:text-white/20">·</span>
                                            <span className="text-[9px] text-gray-400 flex items-center gap-1"><History size={9} />{milestone.launchDate.split('-')[0]}</span>
                                            <span className={clsx("ml-auto text-[9px] font-medium flex items-center gap-0.5", isDark ? "text-[#8B5CF6]/70" : "text-[#8B5CF6]")}><ArrowUpRight size={9} /></span>
                                        </div>
                                    </div>
                                    </article>
                                </GlassmorphicCard>
                            ))}
                        </div>
                    )}

                    {/* 展开/收起按钮 */}
                    {displayedMilestones.length > 7 && (
                        <button
                            onClick={() => setExpandedMilestones(!expandedMilestones)}
                            className={clsx(
                                "w-full mt-6 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2",
                                isDark
                                    ? "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                            )}
                        >
                            <span>{expandedMilestones
                                ? (t('home_date_format') === 'zh-CN' ? '收起' : 'Show Less')
                                : (t('home_date_format') === 'zh-CN' ? '展开更多' : 'Show More')
                            }</span>
                            <ChevronDown size={16} className={clsx("transition-transform", expandedMilestones && "rotate-180")} />
                        </button>
                    )}
                </div>
            </section>

            {/* === CONTACT SECTION (Jobs / Apple Philosophy) === */}
            <section className={clsx(
                "py-24 relative overflow-hidden z-10",
                minimal
                    ? (isDark ? "bg-transparent" : "bg-white")
                    : (isDark ? "bg-transparent" : "bg-[#f5f5f7]")
            )}>
                <div className="max-w-[980px] mx-auto px-6 relative">
                    
                    {/* Top: The Statement */}
                    <div className="mb-20 text-left">
                         <h2 className={clsx(
                            "text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight",
                            isDark ? "text-white" : "text-[#1d1d1f]"
                        )}>
                            {t('home_date_format') === 'zh-CN' 
                                ? '连接全球创新，赋能每一次决策。' 
                                : 'Connecting global innovation, empowering every decision.'}
                        </h2>
                        <p className={clsx("mt-6 text-lg font-light max-w-2xl", isDark ? "text-white/70" : "text-[#1d1d1f]/70")}>
                            {t('home_date_format') === 'zh-CN'
                                ? '我们构建智能桥梁，让前沿科技不再遥不可及，让未来的样子现在就清晰可见。'
                                : 'We build intelligent bridges, making frontier technology accessible and the future visible today.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 border-t border-gray-200/10 md:border-none pt-10 md:pt-0">
                        {/* Column 1: Aiva Address */}
                        <div className="col-span-2 md:col-span-1 space-y-3">
                            <span className="font-semibold text-xs tracking-wide uppercase text-[#86868b]">
                                HardwareMind
                            </span>
                            <div className={clsx("text-xs leading-relaxed", isDark ? "text-[#a1a1a6]" : "text-[#424245]")}>
                                <p>3000 El Camino Real</p>
                                <p>Palo Alto, CA 94306</p>
                            </div>
                        </div>

                        {/* Column 2: Connect */}
                        <div className="space-y-3">
                            <span className="font-semibold text-xs tracking-wide uppercase text-[#86868b]">
                                {t('home_date_format') === 'zh-CN' ? '联系' : 'Contact'}
                            </span>
                            <ul className="space-y-2 text-xs">
                                <li><a href="mailto:partners@hardwaremind.ai" className={clsx("hover:underline block py-1", isDark ? "text-[#f5f5f7]" : "text-[#424245]")}>{t('home_date_format') === 'zh-CN' ? '商务合作' : 'Partnerships'}</a></li>
                                <li><a href="mailto:press@hardwaremind.ai" className={clsx("hover:underline block py-1", isDark ? "text-[#f5f5f7]" : "text-[#424245]")}>{t('home_date_format') === 'zh-CN' ? '媒体联络' : 'Press Info'}</a></li>
                                <li><a href="mailto:invest@hardwaremind.ai" className={clsx("hover:underline block py-1", isDark ? "text-[#f5f5f7]" : "text-[#424245]")}>{t('home_date_format') === 'zh-CN' ? '投资者' : 'Investors'}</a></li>
                            </ul>
                        </div>

                        {/* Column 3: Platform */}
                        <div className="space-y-3">
                            <span className="font-semibold text-xs tracking-wide uppercase text-[#86868b]">
                                {t('home_date_format') === 'zh-CN' ? '探索' : 'Explore'}
                            </span>
                            <ul className="space-y-2 text-xs">
                                <li><a href="#" className={clsx("hover:underline block py-1", isDark ? "text-[#f5f5f7]" : "text-[#424245]")}>{t('home_date_format') === 'zh-CN' ? '全球雷达' : 'Global Radar'}</a></li>
                                <li><a href="#" className={clsx("hover:underline block py-1", isDark ? "text-[#f5f5f7]" : "text-[#424245]")}>{t('home_date_format') === 'zh-CN' ? '发布快讯' : 'Keynotes'}</a></li>
                                <li><a href="#" className={clsx("hover:underline block py-1", isDark ? "text-[#f5f5f7]" : "text-[#424245]")}>{t('home_date_format') === 'zh-CN' ? '社区' : 'Community'}</a></li>
                            </ul>
                        </div>

                         {/* Column 4: Legal / Social */}
                         <div className="space-y-3">
                            <span className="font-semibold text-xs tracking-wide uppercase text-[#86868b]">
                                {t('home_date_format') === 'zh-CN' ? '关注' : 'Social'}
                            </span>
                            <ul className="space-y-2 text-xs">
                                <li><a href="#" className={clsx("hover:underline block py-1", isDark ? "text-[#f5f5f7]" : "text-[#424245]")}>X (Twitter)</a></li>
                                <li><a href="#" className={clsx("hover:underline block py-1", isDark ? "text-[#f5f5f7]" : "text-[#424245]")}>LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Copyright */}
                    <div className={clsx("mt-10 pt-6 border-t text-[11px]", isDark ? "border-[#424245] text-[#86868b]" : "border-[#d2d2d7] text-[#86868b]")}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                            <p>Copyright © 2025 HardwareMind AI Inc. All rights reserved.</p>
                            <div className="flex gap-4">
                                <a href="#" className={clsx("hover:underline", isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]")}>Privacy Policy</a>
                                <span className="border-r border-gray-500/30 h-3 my-auto"></span>
                                <a href="#" className={clsx("hover:underline", isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]")}>Terms of Use</a>
                                <span className="border-r border-gray-500/30 h-3 my-auto"></span>
                                <a href="#" className={clsx("hover:underline", isDark ? "text-[#f5f5f7]" : "text-[#1d1d1f]")}>Site Map</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 返回顶部按钮 */}
            {showBackToTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                    }}
                    className={clsx(
                        "fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg transition-all duration-300",
                        "focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                        isDark
                            ? "bg-[#FF4D00] text-white hover:bg-[#E64600] hover:scale-110"
                            : "bg-[#FF4D00] text-white hover:bg-[#E64600] hover:scale-110"
                    )}
                    aria-label={t('home_date_format') === 'zh-CN' ? '返回顶部' : 'Back to top'}
                >
                    <ArrowUp size={20} />
                </button>
            )}
        </div>
    );
};
