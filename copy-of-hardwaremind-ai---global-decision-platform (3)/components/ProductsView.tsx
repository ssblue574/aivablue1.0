import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Search, ChevronRight, X, ChevronDown, ChevronUp, ArrowUpDown, CheckSquare, Square, SlidersHorizontal, Cpu, Home, Gamepad2, Watch, HeartPulse, Speaker, Camera, LayoutGrid, Bot, Sprout, Sparkles, Car, Factory, Zap, GraduationCap, Store, Shield, Dumbbell, UtensilsCrossed, Briefcase, Leaf, PawPrint } from 'lucide-react';
import { clsx } from 'clsx';
import { Product, AivaRiskLevel, PRODUCT_TYPES, ProductTypeId, matchesProductType, countProductsByType, pickTypeCover } from '../data';
import { ProductCard } from './ProductCard';
import { GlassmorphicCard } from './GlassmorphicCard';
import { useTheme } from '../ThemeContext';
import { storageService } from '../services/storageService';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { detectPerformance } from '../utils/performance';
import { usePersonalizedRecommendations } from '../hooks/usePersonalizedRecommendations';
import { generateSearchSuggestions, getCachedSearchSuggestions, cacheSearchSuggestions } from '../utils/searchSuggestions';
import { useNavigate } from 'react-router-dom';

interface ProductsViewProps {
    t: (key: any) => string;
    categories: string[];
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e?: React.FormEvent) => void;
    isSearching: boolean;
    /** 鍙戠幇鏂板搧鍏ㄩ噺鍒楄〃锛屾潵鑷?getLatestDrops()锛涗笌棣栭〉 latestProducts 鏃犲叧 */
    products: Product[];
    selectedProducts: Product[];
    favorites?: Product[];
    toggleFavorite?: (product: Product) => void;
    toggleSelection: (product: Product) => void;
    onViewProduct: (product: Product) => void;
    hideFilters?: boolean;
    hideBuyButton?: boolean;
    heroTitle?: string;
    lang?: string;
    userPersona?: unknown;
}

type SortOption = 'latest' | 'price-low' | 'price-high' | 'popular' | 'survival-high' | 'name-asc' | 'name-desc';

interface FilterState {
    priceRange: [number, number] | null;
    brands: string[];
    riskLevels: AivaRiskLevel[];
    stages: string[];
    survivalRateRange: [number, number] | null;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
    t,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    handleSearch,
    isSearching,
    products,
    selectedProducts,
    favorites = [],
    toggleSelection,
    onViewProduct,
    toggleFavorite,
    hideFilters = false,
    hideBuyButton = false,
    heroTitle,
    lang = 'en',
    userPersona
}) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isZh = lang === 'zh';
    const prefersReducedMotion = useReducedMotion();
    const performanceLevel = useMemo(() => detectPerformance(), []);
    const [lastFilters, setLastFilters] = useState<FilterState | null>(null);

    const [sortBy, setSortBy] = useState<SortOption>('latest');
    const [showFilters, setShowFilters] = useState(false);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        priceRange: null,
        brands: [],
        riskLevels: [],
        stages: [],
        survivalRateRange: null
    });
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [batchMode, setBatchMode] = useState(false);
    const [productsLoaded, setProductsLoaded] = useState(false);
    const [selectedTypeId, setSelectedTypeId] = useState<ProductTypeId>('digital');
    const [visibleCount, setVisibleCount] = useState(12);
    const [typesExpanded, setTypesExpanded] = useState(false);
    const [marqueePaused, setMarqueePaused] = useState(false);

    const [searchHistory, setSearchHistory] = useState<string[]>(storageService.getSearchHistory());
    
    // 鏇存柊鎼滅储鍘嗗彶
    useEffect(() => {
        setSearchHistory(storageService.getSearchHistory());
    }, [searchQuery]); // 褰撴悳绱㈡煡璇㈡敼鍙樻椂鏇存柊鍘嗗彶
    
    // 鐑棬鎼滅储锛堝彲浠ヤ粠鏁版嵁涓彁鍙栵級
    const popularSearches = useMemo(() => [
        'Apple Ring', 'Rabbit R1', 'Humane AI Pin', 'Prophetic', 'Rewind Pendant'
    ], []);

    // 鑾峰彇鎵€鏈夊搧鐗屽拰浠锋牸鑼冨洿
    const availableBrands = useMemo(() => {
        const brands = new Set(products.map(p => p.brand).filter(Boolean));
        return Array.from(brands).sort();
    }, [products]);

    const priceRange = useMemo(() => {
        const prices = products
            .map(p => {
                const priceStr = p.priceEstimate?.replace(/[^0-9]/g, '') || '0';
                return parseInt(priceStr) || 0;
            })
            .filter(p => p > 0);
        if (prices.length === 0) return [0, 10000];
        return [Math.min(...prices), Math.max(...prices)];
    }, [products]);

    const survivalRateRange = useMemo(() => {
        const rates = products
            .map(p => typeof p.survivalRate === 'number' ? p.survivalRate : -1)
            .filter(r => r >= 0);
        if (rates.length === 0) return [0, 100] as [number, number];
        return [Math.min(...rates), Math.max(...rates)] as [number, number];
    }, [products]);

    const selectedType = useMemo(
        () => PRODUCT_TYPES.find((t) => t.id === selectedTypeId) || PRODUCT_TYPES[0],
        [selectedTypeId]
    );

    const typeStats = useMemo(
        () =>
            PRODUCT_TYPES.map((type) => ({
                type,
                count: countProductsByType(products, type),
                cover: pickTypeCover(products, type),
            })),
        [products]
    );

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...products];

        // Type bucket filter (数码 / 家用 / 玩具 ...)
        filtered = filtered.filter((p) => matchesProductType(p, selectedType));

        // Legacy category chips (if parent still passes a concrete category)
        const allLabels = ['全部', 'All', 'All Products', categories[0]];
        if (activeCategory && !allLabels.includes(activeCategory)) {
            filtered = filtered.filter((p) => p.category === activeCategory);
        }

        if (filters.brands.length > 0) {
            filtered = filtered.filter(p => p.brand && filters.brands.includes(p.brand));
        }

        if (filters.riskLevels.length > 0) {
            filtered = filtered.filter(p => filters.riskLevels.includes(p.riskLevel as AivaRiskLevel));
        }

        if (filters.stages.length > 0) {
            filtered = filtered.filter(p => {
                if (filters.stages.includes('startup') && p.stage === 'startup') return true;
                if (filters.stages.includes('crowdfunding') && p.fundingStatus) return true;
                if (filters.stages.includes('released') && p.releaseStatus === 'released') return true;
                return false;
            });
        }

        if (filters.priceRange) {
            filtered = filtered.filter(p => {
                const priceStr = p.priceEstimate?.replace(/[^0-9]/g, '') || '0';
                const price = parseInt(priceStr) || 0;
                return price >= filters.priceRange![0] && price <= filters.priceRange![1];
            });
        }

        if (filters.survivalRateRange) {
            filtered = filtered.filter(p => {
                const rate = typeof p.survivalRate === 'number' ? p.survivalRate : 0;
                return rate >= filters.survivalRateRange![0] && rate <= filters.survivalRateRange![1];
            });
        }

        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low': {
                    const priceA = parseInt(a.priceEstimate?.replace(/[^0-9]/g, '') || '0') || 0;
                    const priceB = parseInt(b.priceEstimate?.replace(/[^0-9]/g, '') || '0') || 0;
                    return priceA - priceB;
                }
                case 'price-high': {
                    const priceA2 = parseInt(a.priceEstimate?.replace(/[^0-9]/g, '') || '0') || 0;
                    const priceB2 = parseInt(b.priceEstimate?.replace(/[^0-9]/g, '') || '0') || 0;
                    return priceB2 - priceA2;
                }
                case 'name-asc':
                    return (a.name || '').localeCompare(b.name || '');
                case 'name-desc':
                    return (b.name || '').localeCompare(a.name || '');
                case 'popular': {
                    const scoreA = (typeof a.recommendScore === 'number' ? a.recommendScore : (a.survivalRate ?? 0));
                    const scoreB = (typeof b.recommendScore === 'number' ? b.recommendScore : (b.survivalRate ?? 0));
                    return scoreB - scoreA;
                }
                case 'survival-high':
                    return (b.survivalRate ?? 0) - (a.survivalRate ?? 0);
                case 'latest':
                default: {
                    const dateA = new Date(a.launchDate || '').getTime();
                    const dateB = new Date(b.launchDate || '').getTime();
                    const safeA = Number.isFinite(dateA) ? dateA : Number.NEGATIVE_INFINITY;
                    const safeB = Number.isFinite(dateB) ? dateB : Number.NEGATIVE_INFINITY;
                    return safeB - safeA;
                }
            }
        });

        return filtered;
    }, [products, filters, sortBy, selectedType, activeCategory, categories]);

    useEffect(() => {
        setVisibleCount(12);
    }, [selectedTypeId, sortBy, filters, searchQuery]);

    // Personalized recommendations
    const { recommendations } = usePersonalizedRecommendations(products, userPersona);

    // Spotlight: newest in current type
    const spotlightProduct = useMemo(() => {
        if (searchQuery) return null;
        return filteredAndSortedProducts[0] || null;
    }, [filteredAndSortedProducts, searchQuery]);

    const gridProducts = useMemo(() => {
        const rest = spotlightProduct
            ? filteredAndSortedProducts.filter(p => p.id !== spotlightProduct.id)
            : filteredAndSortedProducts;
        return rest.slice(0, Math.max(0, visibleCount - (spotlightProduct ? 1 : 0)));
    }, [filteredAndSortedProducts, spotlightProduct, visibleCount]);

    const hasMoreProducts = filteredAndSortedProducts.length > visibleCount;

    const typeIconMap: Record<ProductTypeId, React.ReactNode> = {
        all: <LayoutGrid size={16} />,
        digital: <Cpu size={16} />,
        robotics: <Bot size={16} />,
        home: <Home size={16} />,
        agriculture: <Sprout size={16} />,
        beauty: <Sparkles size={16} />,
        health: <HeartPulse size={16} />,
        wearable: <Watch size={16} />,
        mobility: <Car size={16} />,
        industrial: <Factory size={16} />,
        energy: <Zap size={16} />,
        education: <GraduationCap size={16} />,
        retail: <Store size={16} />,
        security: <Shield size={16} />,
        sports: <Dumbbell size={16} />,
        food: <UtensilsCrossed size={16} />,
        audio: <Speaker size={16} />,
        camera: <Camera size={16} />,
        play: <Gamepad2 size={16} />,
        office: <Briefcase size={16} />,
        environment: <Leaf size={16} />,
        pets: <PawPrint size={16} />,
    };

    const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
    
    useEffect(() => {
        const loadSuggestions = async () => {
            if (!searchQuery || searchQuery.length < 2) {
                setSearchSuggestions([]);
                return;
            }

            // Try to get from cache first
            const cached = await getCachedSearchSuggestions(searchQuery);
            if (cached) {
                setSearchSuggestions(cached.map(s => s.text));
                return;
            }

            // Generate new suggestions
            const suggestions = await generateSearchSuggestions(searchQuery, products, 10);
            setSearchSuggestions(suggestions.map(s => s.text));
            
            // Cache the suggestions
            await cacheSearchSuggestions(searchQuery, suggestions);
        };

        loadSuggestions();
    }, [searchQuery, products]);

    // 澶勭悊鎼滅储
    const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            storageService.addSearchHistory(searchQuery.trim());
            handleSearch(e);
        }
    }, [searchQuery, handleSearch]);

    const clearAllFilters = () => {
        // 淇濆瓨褰撳墠绛涢€夌姸鎬佺敤浜庢挙閿€
        setLastFilters({ ...filters });
        setFilters({
            priceRange: null,
            brands: [],
            riskLevels: [],
            stages: [],
            survivalRateRange: null
        });
    };
    
    const restoreFilters = () => {
        if (lastFilters) {
            setFilters(lastFilters);
            setLastFilters(null);
        }
    };

    const hasActiveFilters = filters.brands.length > 0 || 
                             filters.riskLevels.length > 0 || 
                             filters.stages.length > 0 || 
                             filters.priceRange !== null ||
                             filters.survivalRateRange !== null;

    // Trigger animation when products change
    useEffect(() => {
        setProductsLoaded(false);
        const timer = setTimeout(() => {
            setProductsLoaded(true);
        }, 50);
        return () => clearTimeout(timer);
    }, [filteredAndSortedProducts.length, activeCategory, sortBy]);

    const chipScrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(1);

    const updateScrollProgress = () => {
        const el = chipScrollRef.current;
        if (!el) {
            setScrollProgress(1);
            return;
        }
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) {
            setScrollProgress(1);
            return;
        }
        setScrollProgress(el.scrollLeft / maxScroll);
    };

    useEffect(() => {
        updateScrollProgress();
    }, [categories]);

    const handleWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
        const el = chipScrollRef.current;
        if (!el) return;
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            el.scrollBy({ left: event.deltaY, behavior: 'smooth' });
        }
    };

    // 浼樺寲鐨勯鏋跺睆缁勪欢
    const SkeletonCard = () => (
        <div className="space-y-2.5">
            <div className={clsx(
                "w-full aspect-[4/3] rounded-xl overflow-hidden relative",
                isDark ? "bg-white/5" : "bg-[#e8e8ed]"
            )}>
                <div className={clsx(
                    "absolute inset-0 animate-pulse",
                    isDark ? "bg-gradient-to-br from-white/5 to-white/10" : "bg-gradient-to-br from-gray-200 to-gray-300"
                )} />
            </div>
            <div className="space-y-1.5 px-0.5">
                <div className={clsx("h-2.5 rounded w-1/3", isDark ? "bg-white/10" : "bg-gray-200")} />
                <div className={clsx("h-4 rounded w-4/5", isDark ? "bg-white/10" : "bg-gray-200")} />
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <div className={clsx("h-6 rounded", isDark ? "bg-white/10" : "bg-gray-200")} />
                    <div className={clsx("h-6 rounded", isDark ? "bg-white/10" : "bg-gray-200")} />
                    <div className={clsx("h-6 rounded", isDark ? "bg-white/10" : "bg-gray-200")} />
                </div>
            </div>
        </div>
    );

    const EmptyState = () => {
        const hasSearchQuery = searchQuery.trim().length > 0;
        const suggestions = hasSearchQuery ? [
            isZh ? '尝试更通用的关键词' : 'Try more general keywords',
            isZh ? '检查拼写是否正确' : 'Check spelling',
            isZh ? '使用品牌名称搜索' : 'Search by brand name',
        ] : [
            isZh ? '浏览所有产品' : 'Browse all products',
            isZh ? '查看热门产品' : 'View popular products',
        ];

        return (
            <div className="flex flex-col items-center justify-center py-20 md:py-40 px-4" role="status" aria-live="polite">
                <div className={clsx("w-24 h-24 rounded-full flex items-center justify-center mb-6", isDark ? "bg-white/5" : "bg-gray-100")}>
                    <Search size={32} className={clsx(isDark ? "text-white/20" : "text-gray-400")} aria-hidden="true" />
                </div>
                <h3 className={clsx("text-xl font-medium mb-2", isDark ? "text-white" : "text-gray-900")}>
                    {hasSearchQuery
                        ? (isZh ? '未找到相关产品' : 'No products found')
                        : (isZh ? '暂无产品' : 'No products available')}
                </h3>
                <p className={clsx("text-sm mb-6 text-center max-w-md font-light", isDark ? "text-white/60" : "text-gray-500")}>
                    {hasSearchQuery
                        ? (isZh
                            ? '试试调整筛选条件或搜索其他关键词'
                            : 'Try adjusting your filters or search for different keywords')
                        : (isZh
                            ? '请尝试调整筛选条件或查看其他分类'
                            : 'Please try adjusting filters or browse other categories')}
                </p>

                <div className="mb-6 space-y-2">
                    {suggestions.map((suggestion, idx) => (
                        <div key={idx} className={clsx(
                            "text-xs px-3 py-1.5 rounded-full",
                            isDark ? "bg-white/5 text-white/60" : "bg-gray-100 text-gray-600"
                        )}>
                            {suggestion}
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className={clsx(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                                isDark
                                    ? "bg-white text-black hover:bg-white/90"
                                    : "bg-black text-white hover:bg-black/90"
                            )}
                        >
                            {isZh ? '清除所有筛选' : 'Clear all filters'}
                        </button>
                    )}
                    {hasSearchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                handleSearch();
                            }}
                            className={clsx(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all border",
                                isDark
                                    ? "bg-transparent text-white/80 border-white/20 hover:border-white/40 hover:text-white"
                                    : "bg-transparent text-black/80 border-black/20 hover:border-black/40 hover:text-black"
                            )}
                        >
                            {isZh ? '清除搜索' : 'Clear search'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    // Calculate animation configuration based on performance
    const animationConfig = useMemo(() => {
        if (prefersReducedMotion) {
            return {
                enabled: false,
                staggerDelay: 0,
                duration: 0
            };
        }

        switch (performanceLevel) {
            case 'high':
                return {
                    enabled: true,
                    staggerDelay: 50, // 50ms between each item
                    duration: 400
                };
            case 'medium':
                return {
                    enabled: true,
                    staggerDelay: 30, // 30ms between each item
                    duration: 300
                };
            case 'low':
                return {
                    enabled: false, // Disable animations on low-end devices
                    staggerDelay: 0,
                    duration: 0
                };
        }
    }, [prefersReducedMotion, performanceLevel]);

    return (
        <div className={clsx("min-h-screen pb-24", isDark ? "bg-black" : "bg-[#f5f5f7]")}>
            {animationConfig.enabled && (
                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(16px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .product-card-animate {
                        animation: fadeInUp ${animationConfig.duration}ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
                        opacity: 0;
                    }
                    ${Array.from({ length: 40 }, (_, i) => `
                        .product-card-animate:nth-child(${i + 1}) {
                            animation-delay: ${i * animationConfig.staggerDelay}ms;
                        }
                    `).join('\n')}
                `}</style>
            )}

            {/* 页头：编辑式标题，而不是仪表盘 */}
            <header className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-10 sm:pt-14 pb-6 sm:pb-8">
                <p className={clsx(
                    "text-[11px] font-medium tracking-[0.28em] uppercase mb-4",
                    isDark ? "text-white/35" : "text-black/35"
                )}>
                    {isZh ? '全球硬件雷达' : 'Global Hardware Radar'}
                </p>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <h1 className={clsx(
                        "text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[0.95]",
                        isDark ? "text-white" : "text-black"
                    )}>
                        {isZh ? '发现新品' : 'New Drops'}
                    </h1>
                    <p className={clsx(
                        "max-w-md text-sm sm:text-base font-light leading-relaxed",
                        isDark ? "text-white/50" : "text-black/50"
                    )}>
                        {isZh
                            ? '先选品类，再看值得追的硬件。数码、家用、玩具…按场景逛，不乱不堆。'
                            : 'Pick a type first — digital, home, play — then browse what matters.'}
                    </p>
                </div>
            </header>

            {/* Industry gallery — premium collapsible strip */}
            {!hideFilters && (
                <section className="relative mb-10 sm:mb-14">
                    <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className={clsx(
                                        "text-[10px] font-medium tracking-[0.32em] uppercase",
                                        isDark ? "text-white/35" : "text-black/35"
                                    )}>
                                        {isZh ? '行业展廊' : 'Industry Atelier'}
                                    </span>
                                    <span className={clsx("h-px w-10 sm:w-16", isDark ? "bg-white/15" : "bg-black/15")} />
                                    <span className={clsx(
                                        "text-[10px] tracking-[0.18em] uppercase tabular-nums",
                                        isDark ? "text-white/25" : "text-black/25"
                                    )}>
                                        {String(typeStats.length).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    <h2 className={clsx(
                                        "text-2xl sm:text-3xl font-semibold tracking-tight",
                                        isDark ? "text-white" : "text-black"
                                    )}>
                                        {isZh ? selectedType.labelZh : selectedType.labelEn}
                                    </h2>
                                    <span className={clsx(
                                        "text-sm font-light",
                                        isDark ? "text-white/40" : "text-black/40"
                                    )}>
                                        {isZh ? selectedType.descZh : selectedType.descEn}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className={clsx(
                                    "hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] tracking-[0.14em] uppercase border",
                                    isDark ? "border-white/10 text-white/40" : "border-black/10 text-black/40"
                                )}>
                                    <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: selectedType.accent }}
                                    />
                                    {typesExpanded
                                        ? (isZh ? '网格模式' : 'Grid mode')
                                        : (isZh ? '流动模式' : 'Flow mode')}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setTypesExpanded((v) => !v)}
                                    className={clsx(
                                        "group inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all duration-300",
                                        isDark
                                            ? "bg-white text-black hover:bg-white/90"
                                            : "bg-black text-white hover:bg-black/90"
                                    )}
                                    aria-expanded={typesExpanded}
                                >
                                    {typesExpanded
                                        ? (isZh ? '收起展廊' : 'Collapse')
                                        : (isZh ? '展开全部行业' : 'Expand industries')}
                                    {typesExpanded
                                        ? <ChevronUp size={14} className="transition-transform group-hover:-translate-y-0.5" />
                                        : <ChevronDown size={14} className="transition-transform group-hover:translate-y-0.5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {!typesExpanded ? (
                        <div
                            className="relative"
                            onMouseEnter={() => setMarqueePaused(true)}
                            onMouseLeave={() => setMarqueePaused(false)}
                            onFocusCapture={() => setMarqueePaused(true)}
                            onBlurCapture={() => setMarqueePaused(false)}
                        >
                            {/* ambient stage */}
                            <div
                                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70%] opacity-40 blur-3xl"
                                style={{
                                    background: `radial-gradient(ellipse at center, ${selectedType.accent}28 0%, transparent 70%)`,
                                }}
                            />

                            <div className={clsx(
                                "relative overflow-hidden border-y backdrop-blur-xl",
                                isDark
                                    ? "border-white/10 bg-gradient-to-b from-white/[0.04] via-black/40 to-white/[0.03]"
                                    : "border-black/10 bg-gradient-to-b from-white/70 via-[#f5f5f7]/80 to-white/60"
                            )}>
                                <div className={clsx(
                                    "pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 z-20",
                                    isDark
                                        ? "bg-gradient-to-r from-black via-black/80 to-transparent"
                                        : "bg-gradient-to-r from-[#f5f5f7] via-[#f5f5f7]/90 to-transparent"
                                )} />
                                <div className={clsx(
                                    "pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 z-20",
                                    isDark
                                        ? "bg-gradient-to-l from-black via-black/80 to-transparent"
                                        : "bg-gradient-to-l from-[#f5f5f7] via-[#f5f5f7]/90 to-transparent"
                                )} />

                                {/* hairline rails */}
                                <div className={clsx(
                                    "pointer-events-none absolute inset-x-0 top-0 h-px",
                                    isDark ? "bg-gradient-to-r from-transparent via-white/25 to-transparent" : "bg-gradient-to-r from-transparent via-black/15 to-transparent"
                                )} />
                                <div className={clsx(
                                    "pointer-events-none absolute inset-x-0 bottom-0 h-px",
                                    isDark ? "bg-gradient-to-r from-transparent via-white/15 to-transparent" : "bg-gradient-to-r from-transparent via-black/10 to-transparent"
                                )} />

                                {!prefersReducedMotion && (
                                    <style>{`
                                        @keyframes type-flow-rtl-a {
                                            from { transform: translate3d(0,0,0); }
                                            to { transform: translate3d(-50%,0,0); }
                                        }
                                        @keyframes type-flow-rtl-b {
                                            from { transform: translate3d(-8%,0,0); }
                                            to { transform: translate3d(-58%,0,0); }
                                        }
                                        .type-flow-a {
                                            animation: type-flow-rtl-a 48s linear infinite;
                                            width: max-content;
                                            will-change: transform;
                                        }
                                        .type-flow-b {
                                            animation: type-flow-rtl-b 64s linear infinite;
                                            width: max-content;
                                            will-change: transform;
                                        }
                                        .type-flow-a.is-paused,
                                        .type-flow-b.is-paused {
                                            animation-play-state: paused;
                                        }
                                    `}</style>
                                )}

                                <div className="relative py-5 sm:py-6 space-y-3">
                                    {/* Row A */}
                                    <div
                                        className={clsx(
                                            "flex gap-3 sm:gap-4 px-4",
                                            !prefersReducedMotion && "type-flow-a",
                                            marqueePaused && "is-paused",
                                            prefersReducedMotion && "overflow-x-auto hide-scrollbar"
                                        )}
                                    >
                                        {(prefersReducedMotion ? typeStats : [...typeStats, ...typeStats]).map(({ type, count, cover }, idx) => {
                                            const active = selectedTypeId === type.id;
                                            const label = isZh ? type.labelZh : type.labelEn;
                                            return (
                                                <button
                                                    key={`a-${type.id}-${idx}`}
                                                    type="button"
                                                    onClick={() => setSelectedTypeId(type.id)}
                                                    className={clsx(
                                                        "group relative shrink-0 overflow-hidden text-left transition-all duration-500",
                                                        "w-[200px] sm:w-[240px] h-[128px] sm:h-[148px] rounded-[22px]",
                                                        active ? "scale-[1.02]" : "hover:scale-[1.015]"
                                                    )}
                                                    style={{
                                                        boxShadow: active
                                                            ? `0 18px 50px ${type.accent}35, inset 0 0 0 1px rgba(255,255,255,0.22)`
                                                            : (isDark
                                                                ? 'inset 0 0 0 1px rgba(255,255,255,0.10)'
                                                                : 'inset 0 0 0 1px rgba(0,0,0,0.08), 0 10px 30px rgba(0,0,0,0.06)'),
                                                    }}
                                                >
                                                    {cover ? (
                                                        <img
                                                            src={cover}
                                                            alt=""
                                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="absolute inset-0"
                                                            style={{ background: `linear-gradient(145deg, ${type.accent}66, #111)` }}
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                                                    {active && (
                                                        <div
                                                            className="absolute inset-0"
                                                            style={{ background: `linear-gradient(145deg, ${type.accent}55, transparent 55%)` }}
                                                        />
                                                    )}
                                                    <div
                                                        className="absolute top-0 left-0 right-0 h-[2px]"
                                                        style={{ background: `linear-gradient(90deg, transparent, ${type.accent}, transparent)` }}
                                                    />
                                                    <div className="relative z-10 h-full p-4 flex flex-col justify-between">
                                                        <div className="flex items-start justify-between">
                                                            <span
                                                                className="inline-flex items-center justify-center w-9 h-9 rounded-full text-white border border-white/20 backdrop-blur-md shadow-lg"
                                                                style={{ backgroundColor: `${type.accent}CC` }}
                                                            >
                                                                {typeIconMap[type.id]}
                                                            </span>
                                                            <span className="text-[10px] tracking-[0.16em] uppercase text-white/55 tabular-nums">
                                                                {String(count).padStart(2, '0')}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-[15px] sm:text-base font-semibold text-white tracking-tight">{label}</p>
                                                            <p className="mt-1 text-[10px] tracking-[0.2em] uppercase text-white/45">
                                                                {active ? (isZh ? '当前选中' : 'Selected') : (isZh ? '点击筛选' : 'Select')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Row B — staggered depth */}
                                    {!prefersReducedMotion && (
                                        <div
                                            className={clsx(
                                                "flex gap-3 sm:gap-4 px-4 opacity-90",
                                                "type-flow-b",
                                                marqueePaused && "is-paused"
                                            )}
                                        >
                                            {[...typeStats].reverse().concat([...typeStats].reverse()).map(({ type, count, cover }, idx) => {
                                                const active = selectedTypeId === type.id;
                                                const label = isZh ? type.labelZh : type.labelEn;
                                                return (
                                                    <button
                                                        key={`b-${type.id}-${idx}`}
                                                        type="button"
                                                        onClick={() => setSelectedTypeId(type.id)}
                                                        className={clsx(
                                                            "group relative shrink-0 overflow-hidden text-left transition-all duration-500",
                                                            "w-[180px] sm:w-[210px] h-[110px] sm:h-[124px] rounded-[20px]",
                                                            active ? "scale-[1.02]" : "hover:scale-[1.015]"
                                                        )}
                                                        style={{
                                                            boxShadow: active
                                                                ? `0 14px 40px ${type.accent}30, inset 0 0 0 1px rgba(255,255,255,0.2)`
                                                                : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                                                        }}
                                                    >
                                                        {cover ? (
                                                            <img
                                                                src={cover}
                                                                alt=""
                                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="absolute inset-0"
                                                                style={{ background: `linear-gradient(145deg, ${type.accent}55, #0a0a0a)` }}
                                                            />
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                                        <div className="relative z-10 h-full p-3.5 flex flex-col justify-between">
                                                            <div className="flex items-center justify-between">
                                                                <span
                                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white/95 border border-white/15 backdrop-blur-md"
                                                                    style={{ backgroundColor: `${type.accent}B3` }}
                                                                >
                                                                    {typeIconMap[type.id]}
                                                                </span>
                                                                <span className="text-[10px] text-white/50 tabular-nums">{count}</span>
                                                            </div>
                                                            <p className="text-sm font-medium text-white/95 tracking-tight">{label}</p>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <p className={clsx(
                                "max-w-[1400px] mx-auto px-5 sm:px-8 mt-3 text-[11px] font-light tracking-wide",
                                isDark ? "text-white/30" : "text-black/35"
                            )}>
                                {marqueePaused
                                    ? (isZh ? '已暂停流动 · 可直接点选类型' : 'Flow paused · tap a type to filter')
                                    : (isZh ? '悬停可暂停 · 类型从右向左缓缓流动' : 'Hover to pause · drifting right to left')}
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
                            <div className={clsx(
                                "rounded-[28px] border p-3 sm:p-4 backdrop-blur-xl",
                                isDark
                                    ? "border-white/10 bg-white/[0.03]"
                                    : "border-black/10 bg-white/70"
                            )}>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2.5 sm:gap-3">
                                    {typeStats.map(({ type, count, cover }, i) => {
                                        const active = selectedTypeId === type.id;
                                        const label = isZh ? type.labelZh : type.labelEn;
                                        const desc = isZh ? type.descZh : type.descEn;
                                        return (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setSelectedTypeId(type.id)}
                                                className={clsx(
                                                    "group relative overflow-hidden rounded-2xl text-left border transition-all duration-500",
                                                    "min-h-[118px] sm:min-h-[132px]",
                                                    active
                                                        ? "border-transparent scale-[1.02]"
                                                        : (isDark
                                                            ? "border-white/10 hover:border-white/25"
                                                            : "border-black/10 hover:border-black/18")
                                                )}
                                                style={{
                                                    animationDelay: `${Math.min(i, 18) * 30}ms`,
                                                    boxShadow: active
                                                        ? `0 16px 40px ${type.accent}30`
                                                        : undefined,
                                                }}
                                            >
                                                {cover ? (
                                                    <img
                                                        src={cover}
                                                        alt=""
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div
                                                        className="absolute inset-0"
                                                        style={{ background: `linear-gradient(145deg, ${type.accent}60, #111)` }}
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
                                                {active && (
                                                    <div
                                                        className="absolute inset-0"
                                                        style={{ background: `linear-gradient(145deg, ${type.accent}50, transparent 60%)` }}
                                                    />
                                                )}
                                                <div
                                                    className="absolute top-0 inset-x-0 h-px"
                                                    style={{ background: `linear-gradient(90deg, transparent, ${type.accent}, transparent)` }}
                                                />
                                                <div className="relative z-10 h-full p-3.5 sm:p-4 flex flex-col justify-between">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <span
                                                            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white border border-white/20 backdrop-blur-md"
                                                            style={{ backgroundColor: `${type.accent}CC` }}
                                                        >
                                                            {typeIconMap[type.id]}
                                                        </span>
                                                        <span className="text-[10px] tracking-[0.14em] uppercase text-white/55 tabular-nums">
                                                            {String(count).padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-base font-semibold text-white tracking-tight">{label}</p>
                                                        <p className="text-[11px] text-white/60 font-light mt-0.5 line-clamp-1">{desc}</p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Featured：最新一款作为主视觉锚点 */}
            {spotlightProduct && (
                <section
                    className="relative w-full mb-10 sm:mb-14 cursor-pointer group"
                    onClick={() => onViewProduct(spotlightProduct)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onViewProduct(spotlightProduct);
                        }
                    }}
                >
                    <div className="relative h-[38vh] min-h-[260px] max-h-[420px] overflow-hidden rounded-none sm:rounded-3xl sm:mx-5 lg:mx-auto sm:max-w-[1400px]">
                        <img
                            src={spotlightProduct.imageUrl}
                            alt={spotlightProduct.name}
                            className="w-full h-full object-cover scale-[1.02] transition-transform duration-[1.4s] ease-out group-hover:scale-105"
                        />
                        <div className={clsx(
                            "absolute inset-0 bg-gradient-to-t via-30%",
                            isDark
                                ? "from-black via-black/55 to-black/10"
                                : "from-[#f5f5f7] via-black/35 to-black/10"
                        )} />
                        <div className="absolute inset-0 flex items-end">
                            <div className="max-w-[1400px] w-full mx-auto px-5 sm:px-8 pb-10 sm:pb-14">
                                <div className="inline-flex items-center gap-2 mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D00]" />
                                    <span className="text-[11px] uppercase tracking-[0.22em] text-white/70 font-medium">
                                        {(isZh ? selectedType.labelZh : selectedType.labelEn) +
                                            (isZh ? ' · 焦点' : ' · Focus')}
                                    </span>
                                    {spotlightProduct.launchDate && (
                                        <span className="text-[11px] text-white/40 tracking-wide">
                                            · {spotlightProduct.launchDate}
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight mb-3 max-w-3xl">
                                    {spotlightProduct.name}
                                </h2>
                                <p className="text-base sm:text-lg text-white/65 font-light leading-relaxed max-w-2xl mb-6 line-clamp-2">
                                    {spotlightProduct.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-white/55">
                                    <span>{spotlightProduct.brand}</span>
                                    {spotlightProduct.priceEstimate && (
                                        <>
                                            <span className="text-white/25">/</span>
                                            <span className="text-white/80 font-medium">{spotlightProduct.priceEstimate}</span>
                                        </>
                                    )}
                                    <span className="text-white/25">/</span>
                                    <span className="inline-flex items-center gap-1 text-white group-hover:gap-2 transition-all">
                                        {isZh ? '查看详情' : 'View details'}
                                        <ChevronRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-8 sm:space-y-10">
                {!hideFilters && (
                    <>
                        <div className={clsx(
                            "sticky top-16 z-30 backdrop-blur-xl py-3 -mx-2 px-2 border-b transition-colors",
                            isDark ? "bg-black/75 border-white/5" : "bg-[#f5f5f7]/80 border-black/5"
                        )}>
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                <div className="flex-1 min-w-0" onWheelCapture={handleWheelScroll}>
                                    <div
                                        ref={chipScrollRef}
                                        onScroll={updateScrollProgress}
                                        className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1"
                                    >
                                        {PRODUCT_TYPES.map((type) => {
                                            const active = selectedTypeId === type.id;
                                            return (
                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    onClick={() => setSelectedTypeId(type.id)}
                                                    className={clsx(
                                                        "px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all border inline-flex items-center gap-1.5",
                                                        active
                                                            ? "text-white border-transparent"
                                                            : (isDark
                                                                ? "bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white"
                                                                : "bg-transparent text-black/50 border-black/10 hover:border-black/30 hover:text-black")
                                                    )}
                                                    style={active ? { backgroundColor: type.accent, borderColor: type.accent } : undefined}
                                                >
                                                    {typeIconMap[type.id]}
                                                    {isZh ? type.labelZh : type.labelEn}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => setBatchMode(!batchMode)}
                                        className={clsx(
                                            "p-2 rounded-full transition-all border",
                                            batchMode
                                                ? "bg-[#FF4D00] text-white border-[#FF4D00]"
                                                : (isDark ? "border-white/10 text-white/50 hover:text-white" : "border-black/10 text-black/50 hover:text-black")
                                        )}
                                        title={isZh ? '批量选择' : 'Batch select'}
                                    >
                                        {batchMode ? <CheckSquare size={16} /> : <Square size={16} />}
                                    </button>

                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={clsx(
                                            "px-3 py-2 rounded-full text-xs font-medium transition-all border inline-flex items-center gap-2",
                                            hasActiveFilters || showFilters
                                                ? "bg-[#FF4D00] text-white border-[#FF4D00]"
                                                : (isDark ? "text-white/50 border-white/10 hover:text-white" : "text-black/50 border-black/10 hover:text-black")
                                        )}
                                    >
                                        <SlidersHorizontal size={14} />
                                        <span className="hidden sm:inline">{isZh ? '筛选' : 'Filters'}</span>
                                    </button>

                                    <div className="relative">
                                        <button
                                            onClick={() => {
                                                setShowSortMenu(!showSortMenu);
                                                setShowFilters(false);
                                            }}
                                            onBlur={() => setTimeout(() => setShowSortMenu(false), 200)}
                                            className={clsx(
                                                "px-3 py-2 rounded-full text-xs font-medium transition-all border inline-flex items-center gap-2",
                                                isDark
                                                    ? "text-white/50 border-white/10 hover:text-white"
                                                    : "text-black/50 border-black/10 hover:text-black"
                                            )}
                                        >
                                            <ArrowUpDown size={14} />
                                            <span className="hidden sm:inline">
                                                {sortBy === 'latest' ? (isZh ? '最新' : 'Latest') :
                                                 sortBy === 'price-low' ? (isZh ? '价格低' : 'Price ↑') :
                                                 sortBy === 'price-high' ? (isZh ? '价格高' : 'Price ↓') :
                                                 sortBy === 'popular' ? (isZh ? '推荐' : 'Recommended') :
                                                 sortBy === 'survival-high' ? (isZh ? '本土化' : 'Localization') :
                                                 sortBy === 'name-asc' ? 'A-Z' : 'Z-A'}
                                            </span>
                                            <ChevronDown size={12} className={clsx("transition-transform", showSortMenu && "rotate-180")} />
                                        </button>
                                        {showSortMenu && (
                                            <div className={clsx(
                                                "absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-lg py-2 z-50",
                                                isDark ? "bg-[#111] border-white/10" : "bg-white border-black/10"
                                            )}>
                                                {(['latest', 'price-low', 'price-high', 'popular', 'survival-high', 'name-asc', 'name-desc'] as SortOption[]).map(option => (
                                                    <button
                                                        key={option}
                                                        onClick={() => {
                                                            setSortBy(option);
                                                            setShowSortMenu(false);
                                                        }}
                                                        className={clsx(
                                                            "w-full px-4 py-2 text-left text-sm transition-colors",
                                                            sortBy === option
                                                                ? (isDark ? "bg-white/10 text-white" : "bg-gray-100 text-black")
                                                                : (isDark ? "text-white/60 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50")
                                                        )}
                                                    >
                                                        {option === 'latest' ? (isZh ? '最新发布' : 'Latest') :
                                                         option === 'price-low' ? (isZh ? '价格：低到高' : 'Price: Low to High') :
                                                         option === 'price-high' ? (isZh ? '价格：高到低' : 'Price: High to Low') :
                                                         option === 'popular' ? (isZh ? 'Aiva 推荐度' : 'Aiva Recommendation') :
                                                         option === 'survival-high' ? (isZh ? '本土化生存率' : 'Localization') :
                                                         option === 'name-asc' ? (isZh ? '名称 A-Z' : 'Name A-Z') :
                                                         (isZh ? '名称 Z-A' : 'Name Z-A')}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative w-full sm:w-56">
                                        <form onSubmit={handleSearchSubmit}>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setShowSearchSuggestions(true);
                                                }}
                                                onFocus={() => setShowSearchSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                                                placeholder={t('search_placeholder')}
                                                className={clsx(
                                                    "w-full border rounded-full py-2 pl-9 pr-4 text-xs focus:outline-none transition-all",
                                                    isDark
                                                        ? "bg-white/5 border-white/10 text-white focus:border-white/30"
                                                        : "bg-white border-black/10 text-black focus:border-black/30"
                                                )}
                                            />
                                            <Search size={14} className={clsx("absolute left-3 top-2.5", isDark ? "text-white/35" : "text-black/35")} />
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {showFilters && (
                            <GlassmorphicCard
                                blur={20}
                                opacity={0.1}
                                borderGlow={false}
                                hoverEffect="lift"
                                className="p-5 sm:p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={clsx("text-sm font-medium tracking-wide", isDark ? "text-white" : "text-gray-900")}>
                                        {isZh ? '高级筛选' : 'Advanced Filters'}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearAllFilters}
                                                className={clsx(
                                                    "px-3 py-1.5 rounded-lg text-xs transition-all",
                                                    isDark ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900"
                                                )}
                                            >
                                                {isZh ? '清除' : 'Clear'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className={clsx(
                                                "p-1.5 rounded-lg transition-all",
                                                isDark ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900"
                                            )}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div>
                                        <label className={clsx("block text-xs font-medium mb-2 tracking-wide", isDark ? "text-white/60" : "text-gray-600")}>
                                            {isZh ? '价格区间' : 'Price Range'}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder={priceRange[0].toString()}
                                                value={filters.priceRange?.[0] || ''}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || priceRange[0];
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        priceRange: [val, prev.priceRange?.[1] || priceRange[1]]
                                                    }));
                                                }}
                                                className={clsx(
                                                    "w-full px-3 py-2 rounded-lg text-sm border",
                                                    isDark
                                                        ? "bg-white/5 border-white/10 text-white"
                                                        : "bg-white border-black/10 text-black"
                                                )}
                                            />
                                            <span className={clsx(isDark ? "text-white/30" : "text-gray-400")}>-</span>
                                            <input
                                                type="number"
                                                placeholder={priceRange[1].toString()}
                                                value={filters.priceRange?.[1] || ''}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || priceRange[1];
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        priceRange: [prev.priceRange?.[0] || priceRange[0], val]
                                                    }));
                                                }}
                                                className={clsx(
                                                    "w-full px-3 py-2 rounded-lg text-sm border",
                                                    isDark
                                                        ? "bg-white/5 border-white/10 text-white"
                                                        : "bg-white border-black/10 text-black"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={clsx("block text-xs font-medium mb-2 tracking-wide", isDark ? "text-white/60" : "text-gray-600")}>
                                            {isZh ? '品牌' : 'Brand'}
                                        </label>
                                        <div className="max-h-28 overflow-y-auto space-y-1">
                                            {availableBrands.slice(0, 8).map(brand => (
                                                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.brands.includes(brand)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFilters(prev => ({ ...prev, brands: [...prev.brands, brand] }));
                                                            } else {
                                                                setFilters(prev => ({ ...prev, brands: prev.brands.filter(b => b !== brand) }));
                                                            }
                                                        }}
                                                        className="rounded"
                                                    />
                                                    <span className={clsx("text-sm", isDark ? "text-white/70" : "text-gray-700")}>{brand}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className={clsx("block text-xs font-medium mb-2 tracking-wide", isDark ? "text-white/60" : "text-gray-600")}>
                                            {isZh ? '风险等级' : 'Risk Level'}
                                        </label>
                                        <div className="space-y-1">
                                            {(['Safe', 'Low', 'Moderate', 'High', 'Critical'] as AivaRiskLevel[]).map(level => (
                                                <label key={level} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.riskLevels.includes(level)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFilters(prev => ({ ...prev, riskLevels: [...prev.riskLevels, level] }));
                                                            } else {
                                                                setFilters(prev => ({ ...prev, riskLevels: prev.riskLevels.filter(r => r !== level) }));
                                                            }
                                                        }}
                                                        className="rounded"
                                                    />
                                                    <span className={clsx("text-sm", isDark ? "text-white/70" : "text-gray-700")}>
                                                        {level === 'Safe' ? (isZh ? '安全推荐' : 'Safe') :
                                                         level === 'Low' ? (isZh ? '低风险' : 'Low') :
                                                         level === 'Moderate' ? (isZh ? '中等风险' : 'Moderate') :
                                                         level === 'High' ? (isZh ? '高风险' : 'High') :
                                                         (isZh ? '极高风险' : 'Critical')}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className={clsx("block text-xs font-medium mb-2 tracking-wide", isDark ? "text-white/60" : "text-gray-600")}>
                                            {isZh ? '产品阶段' : 'Stage'}
                                        </label>
                                        <div className="space-y-1">
                                            {[
                                                { key: 'startup', label: isZh ? '初创产品' : 'Startup' },
                                                { key: 'crowdfunding', label: isZh ? '众筹中' : 'Crowdfunding' },
                                                { key: 'released', label: isZh ? '已上市' : 'Released' }
                                            ].map(({ key, label }) => (
                                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.stages.includes(key)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFilters(prev => ({ ...prev, stages: [...prev.stages, key] }));
                                                            } else {
                                                                setFilters(prev => ({ ...prev, stages: prev.stages.filter(s => s !== key) }));
                                                            }
                                                        }}
                                                        className="rounded"
                                                    />
                                                    <span className={clsx("text-sm", isDark ? "text-white/70" : "text-gray-700")}>{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </GlassmorphicCard>
                        )}

                        <div className="flex items-end justify-between gap-4 pt-2">
                            <div>
                                <p className={clsx(
                                    "text-[11px] font-medium tracking-[0.22em] uppercase mb-1",
                                    isDark ? "text-white/35" : "text-black/35"
                                )}>
                                    {isZh ? selectedType.labelZh : selectedType.labelEn}
                                </p>
                                <p className={clsx("text-sm font-light", isDark ? "text-white/55" : "text-black/55")}>
                                    {isZh
                                        ? `${filteredAndSortedProducts.length} 款 · ${selectedType.descZh}`
                                        : `${filteredAndSortedProducts.length} drops · ${selectedType.descEn}`}
                                </p>
                            </div>
                            {batchMode && selectedProducts.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-[#FF4D00]">
                                        {isZh
                                            ? `已选 ${selectedProducts.length}`
                                            : `${selectedProducts.length} selected`}
                                    </span>
                                    {selectedProducts.length >= 2 && (
                                        <button
                                            onClick={() => navigate('/compare')}
                                            className={clsx(
                                                "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                                                isDark
                                                    ? "bg-white text-black hover:bg-white/90"
                                                    : "bg-black text-white hover:bg-black/90"
                                            )}
                                        >
                                            {isZh ? '开始对比' : 'Compare'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {isSearching && searchQuery.trim() && (
                    <div className={clsx(
                        "py-6 flex items-center gap-3 border-b",
                        isDark ? "border-white/10" : "border-black/10"
                    )}>
                        <div className="animate-spin">
                            <Search size={18} className={isDark ? "text-white/50" : "text-black/50"} />
                        </div>
                        <p className={clsx("text-sm font-light", isDark ? "text-white/60" : "text-black/60")}>
                            {isZh ? `正在搜索 “${searchQuery}”…` : `Searching “${searchQuery}”…`}
                        </p>
                    </div>
                )}

                {/* 产品网格：更少列数 + 更大留白 */}
                {isSearching ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i}>
                                <SkeletonCard />
                            </div>
                        ))}
                    </div>
                ) : gridProducts.length === 0 && !spotlightProduct ? (
                    <EmptyState />
                ) : gridProducts.length === 0 ? (
                    <div className={clsx(
                        "py-16 text-center text-sm font-light",
                        isDark ? "text-white/40" : "text-black/40"
                    )}>
                        {isZh ? '当前筛选下暂无更多产品' : 'No more products for this filter'}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                        {gridProducts.map((product) => {
                            const isFavoriteItem = favorites.some(p => p.id === product.id);
                            const isSelectedItem = selectedProducts.some(p => p.id === product.id);
                            return (
                                <div
                                    key={product.id}
                                    className={clsx(
                                        animationConfig.enabled && productsLoaded && "product-card-animate"
                                    )}
                                >
                                    <ProductCard
                                        product={product}
                                        isSelected={isSelectedItem}
                                        isFavorite={isFavoriteItem}
                                        onToggleSelect={toggleSelection}
                                        onToggleFavorite={toggleFavorite}
                                        onViewDetail={onViewProduct}
                                        t={t}
                                        hideBuyButton={hideBuyButton}
                                        lang={lang}
                                        compact={true}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {hasMoreProducts && !isSearching && (
                    <div className="flex justify-center pt-4 pb-8">
                        <button
                            type="button"
                            onClick={() => setVisibleCount((n) => n + 12)}
                            className={clsx(
                                "px-6 py-2.5 rounded-full text-sm font-medium border transition-all",
                                isDark
                                    ? "border-white/15 text-white/80 hover:bg-white/5 hover:text-white"
                                    : "border-black/15 text-black/80 hover:bg-black/5 hover:text-black"
                            )}
                        >
                            {isZh
                                ? `继续浏览（还有 ${filteredAndSortedProducts.length - visibleCount} 款）`
                                : `Show more (${filteredAndSortedProducts.length - visibleCount} left)`}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
