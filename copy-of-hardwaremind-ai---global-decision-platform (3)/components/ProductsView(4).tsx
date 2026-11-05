import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Search, ChevronRight, Sparkles, Filter, X, ChevronDown, ArrowUpDown, TrendingUp, DollarSign, Clock, SortAsc, Grid3X3, CheckSquare, Square, SlidersHorizontal, XCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Product, AivaRiskLevel } from '../data';
import { ProductCard } from './ProductCard';
import { GlassmorphicCard } from './GlassmorphicCard';
import { useTheme } from '../ThemeContext';
import { storageService } from '../services/storageService';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { detectPerformance } from '../utils/performance';
import { RotateCcw } from 'lucide-react';
import { usePersonalizedRecommendations } from '../hooks/usePersonalizedRecommendations';
import { generateSearchSuggestions, getCachedSearchSuggestions, cacheSearchSuggestions } from '../utils/searchSuggestions';

interface ProductsViewProps {
    t: (key: any) => string;
    categories: string[];
    activeCategory: string;
    setActiveCategory: (category: string) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (e?: React.FormEvent) => void;
    isSearching: boolean;
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
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isZh = lang === 'zh';
    const prefersReducedMotion = useReducedMotion();
    const performanceLevel = useMemo(() => detectPerformance(), []);
    const [lastFilters, setLastFilters] = useState<FilterState | null>(null);

    // 状态管理
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

    // 搜索历史（需要状态以便删除后更新）
    const [searchHistory, setSearchHistory] = useState<string[]>(storageService.getSearchHistory());
    
    // 更新搜索历史
    useEffect(() => {
        setSearchHistory(storageService.getSearchHistory());
    }, [searchQuery]); // 当搜索查询改变时更新历史
    
    // 热门搜索（可以从数据中提取）
    const popularSearches = useMemo(() => [
        'Apple Ring', 'Rabbit R1', 'Humane AI Pin', 'Prophetic', 'Rewind Pendant'
    ], []);

    // 获取所有品牌和价格范围
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

    // 本土化生存率范围（0-100）
    const survivalRateRange = useMemo(() => {
        const rates = products
            .map(p => typeof p.survivalRate === 'number' ? p.survivalRate : -1)
            .filter(r => r >= 0);
        if (rates.length === 0) return [0, 100] as [number, number];
        return [Math.min(...rates), Math.max(...rates)] as [number, number];
    }, [products]);

    // 筛选和排序后的产品
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...products];

        // 应用筛选
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

        // 应用排序
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    const priceA = parseInt(a.priceEstimate?.replace(/[^0-9]/g, '') || '0') || 0;
                    const priceB = parseInt(b.priceEstimate?.replace(/[^0-9]/g, '') || '0') || 0;
                    return priceA - priceB;
                case 'price-high':
                    const priceA2 = parseInt(a.priceEstimate?.replace(/[^0-9]/g, '') || '0') || 0;
                    const priceB2 = parseInt(b.priceEstimate?.replace(/[^0-9]/g, '') || '0') || 0;
                    return priceB2 - priceA2;
                case 'name-asc':
                    return (a.name || '').localeCompare(b.name || '');
                case 'name-desc':
                    return (b.name || '').localeCompare(a.name || '');
                case 'popular':
                    // Aiva 推荐度排序：优先使用 recommendScore，其次 fallback 到 survivalRate
                    const scoreA = (typeof a.recommendScore === 'number' ? a.recommendScore : (a.survivalRate ?? 0));
                    const scoreB = (typeof b.recommendScore === 'number' ? b.recommendScore : (b.survivalRate ?? 0));
                    return scoreB - scoreA;
                case 'survival-high':
                    // 本土化生存率优先
                    return (b.survivalRate ?? 0) - (a.survivalRate ?? 0);
                case 'latest':
                default:
                    return new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime();
            }
        });

        return filtered;
    }, [products, filters, sortBy]);

    // Personalized recommendations
    const { recommendations } = usePersonalizedRecommendations(products, userPersona);

    // Spotlight产品（优化显示逻辑）
    const spotlightProduct = useMemo(() => {
        if (searchQuery || activeCategory !== (categories[0] || 'All Products')) return null;
        const startups = products.filter(p => p.brand && !['Apple', 'Samsung', 'Google', 'Microsoft'].includes(p.brand));
        if (startups.length > 0) {
            const randomIndex = Math.floor(Math.random() * startups.length);
            return startups[randomIndex];
        }
        return products.length > 0 ? products[0] : null;
    }, [products, searchQuery, activeCategory, categories]);

    // 智能搜索建议（使用增强算法）
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

    // 处理搜索
    const handleSearchSubmit = useCallback((e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            storageService.addSearchHistory(searchQuery.trim());
            handleSearch(e);
        }
    }, [searchQuery, handleSearch]);

    // 清除所有筛选（支持撤销）
    const clearAllFilters = () => {
        // 保存当前筛选状态用于撤销
        setLastFilters({ ...filters });
        setFilters({
            priceRange: null,
            brands: [],
            riskLevels: [],
            stages: [],
            survivalRateRange: null
        });
    };
    
    // 恢复筛选
    const restoreFilters = () => {
        if (lastFilters) {
            setFilters(lastFilters);
            setLastFilters(null);
        }
    };

    // 是否有激活的筛选
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

    // 优化的骨架屏组件
    const SkeletonCard = () => (
        <div className={clsx(
            "rounded-xl overflow-hidden border animate-pulse",
            isDark ? "bg-[#111] border-white/5" : "bg-white border-black/5"
        )}>
            {/* 图片占位符 - 带渐变效果 */}
            <div className={clsx(
                "w-full aspect-[3/4] relative overflow-hidden",
                isDark ? "bg-gradient-to-br from-white/5 to-white/10" : "bg-gradient-to-br from-gray-200 to-gray-300"
            )}>
                <div className={clsx(
                    "absolute inset-0 animate-shimmer",
                    isDark ? "bg-gradient-to-r from-transparent via-white/5 to-transparent" : "bg-gradient-to-r from-transparent via-white/20 to-transparent"
                )} />
            </div>
            {/* 内容占位符 */}
            <div className="p-4 space-y-3">
                <div className={clsx(
                    "h-4 rounded",
                    isDark ? "bg-white/10" : "bg-gray-200"
                )} style={{ width: '75%' }} />
                <div className={clsx(
                    "h-3 rounded",
                    isDark ? "bg-white/10" : "bg-gray-200"
                )} style={{ width: '50%' }} />
                <div className="flex gap-2 mt-2">
                    <div className={clsx(
                        "h-5 rounded-full",
                        isDark ? "bg-white/10" : "bg-gray-200"
                    )} style={{ width: '60px' }} />
                    <div className={clsx(
                        "h-5 rounded-full",
                        isDark ? "bg-white/10" : "bg-gray-200"
                    )} style={{ width: '80px' }} />
                </div>
            </div>
        </div>
    );

    // 空状态组件 - 增强版
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
                <h3 className={clsx("text-xl font-bold mb-2", isDark ? "text-white" : "text-gray-900")}>
                    {hasSearchQuery 
                        ? (isZh ? '未找到相关产品' : 'No products found')
                        : (isZh ? '暂无产品' : 'No products available')}
                </h3>
                <p className={clsx("text-sm mb-6 text-center max-w-md", isDark ? "text-white/60" : "text-gray-500")}>
                    {hasSearchQuery
                        ? (isZh 
                            ? '试试调整筛选条件或搜索其他关键词' 
                            : 'Try adjusting your filters or search for different keywords')
                        : (isZh
                            ? '请尝试调整筛选条件或查看其他分类'
                            : 'Please try adjusting filters or browse other categories')}
                </p>
                
                {/* 建议操作 */}
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

                {/* 操作按钮组 */}
                <div className="flex flex-wrap gap-3 justify-center">
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    clearAllFilters();
                                }
                            }}
                            className={clsx(
                                "px-6 py-2 rounded-full text-sm font-medium transition-all",
                                "focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                                isDark 
                                    ? "bg-white text-black hover:bg-white/90" 
                                    : "bg-black text-white hover:bg-black/90"
                            )}
                            aria-label={isZh ? '清除所有筛选条件' : 'Clear all filters'}
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
        <div className={clsx("min-h-screen pb-20", isDark ? "bg-black" : "bg-transparent")}>
            {/* Staggered Animation Styles */}
            {animationConfig.enabled && (
                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .product-card-animate {
                        animation: fadeInUp ${animationConfig.duration}ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
                        opacity: 0;
                    }

                    ${Array.from({ length: 50 }, (_, i) => `
                        .product-card-animate:nth-child(${i + 1}) {
                            animation-delay: ${i * animationConfig.staggerDelay}ms;
                        }
                    `).join('\n')}
                `}</style>
            )}

            {/* Spotlight Section */}
            {spotlightProduct && (
                <div className="relative w-full h-[60vh] overflow-hidden group cursor-pointer" onClick={() => onViewProduct(spotlightProduct)}>
                    <div className="absolute inset-0">
                        <img src={spotlightProduct.imageUrl} alt={spotlightProduct.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                        <div className={clsx(
                            "absolute inset-0 bg-gradient-to-t via-black/20 to-transparent",
                            isDark ? "from-black" : "from-[#f5f5f7]"
                        )} />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-[1600px] mx-auto flex flex-col justify-end h-full">
                        <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 bg-black/40 backdrop-blur-md mb-6 w-fit">
                            <Sparkles size={14} className="text-[#FF4D00]" />
                            <span className="text-xs uppercase tracking-[0.2em] text-white font-bold">{heroTitle || t('products_spotlight_title')}</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">{spotlightProduct.name}</h2>
                        <p className="text-xl text-white/70 max-w-2xl mb-8 leading-relaxed">{spotlightProduct.description}</p>
                        <button className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg w-fit hover:scale-105 transition-transform">
                            {t('products_section_all')}
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 space-y-8 sm:space-y-10">
                {/* Quick Stats */}
                <div className={clsx(
                    "grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 rounded-2xl p-4 sm:p-5 border",
                    isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10 shadow-sm"
                )}>
                    <div>
                        <p className={clsx("text-[11px] uppercase tracking-[0.15em] mb-1", isDark ? "text-white/50" : "text-gray-500")}>
                            {isZh ? '在售/在研' : 'Catalog'}
                        </p>
                        <p className={clsx("text-2xl font-semibold", isDark ? "text-white" : "text-black")}>
                            {products.length}
                        </p>
                    </div>
                    <div>
                        <p className={clsx("text-[11px] uppercase tracking-[0.15em] mb-1", isDark ? "text-white/50" : "text-gray-500")}>
                            {isZh ? '品类' : 'Categories'}
                        </p>
                        <p className={clsx("text-2xl font-semibold", isDark ? "text-white" : "text-black")}>
                            {categories.length}
                        </p>
                    </div>
                    <div>
                        <p className={clsx("text-[11px] uppercase tracking-[0.15em] mb-1", isDark ? "text-white/50" : "text-gray-500")}>
                            {isZh ? '价格跨度' : 'Price range'}
                        </p>
                        <p className={clsx("text-base sm:text-lg font-semibold", isDark ? "text-white" : "text-black")}>
                            {`$${priceRange[0]} - $${priceRange[1]}`}
                        </p>
                    </div>
                    <div>
                        <p className={clsx("text-[11px] uppercase tracking-[0.15em] mb-1", isDark ? "text-white/50" : "text-gray-500")}>
                            {isZh ? '本土化评分跨度' : 'Localization range'}
                        </p>
                        <p className={clsx("text-base sm:text-lg font-semibold", isDark ? "text-white" : "text-black")}>
                            {`${survivalRateRange[0]} - ${survivalRateRange[1]}%`}
                        </p>
                    </div>
                </div>

                {/* Header & Controls */}
                {!hideFilters && (
                    <>
                        <div className={clsx(
                            "flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-12 sticky top-20 z-30 backdrop-blur-xl py-3 sm:py-4 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 border-b transition-colors",
                            isDark ? "bg-black/80 border-white/5" : "bg-[#f5f5f7]/80 border-black/5"
                        )}>
                            {/* 左侧：分类筛选 */}
                            <div className="flex-1" onWheelCapture={handleWheelScroll}>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className={clsx("text-sm font-medium uppercase tracking-wider whitespace-nowrap", isDark ? "text-white/40" : "text-black/40")}>{t('products_filter_label')}</span>
                                    <div
                                        ref={chipScrollRef}
                                        onScroll={updateScrollProgress}
                                        className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 md:pb-0 flex-1"
                                    >
                                        {categories.map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveCategory(cat)}
                                                className={clsx(
                                                    "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
                                                    activeCategory === cat
                                                        ? (isDark ? "bg-white text-black border-white" : "bg-black text-white border-black")
                                                        : (isDark ? "bg-transparent text-white/60 border-white/10 hover:border-white/40 hover:text-white" : "bg-transparent text-black/60 border-black/10 hover:border-black/40 hover:text-black")
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className={clsx("h-1 rounded-full mt-3 overflow-hidden", isDark ? "bg-white/5" : "bg-black/5")}>
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#FF4D00] via-[#00FFC6] to-[#4ADE80]"
                                        style={{ width: `${Math.min(100, Math.max(10, scrollProgress * 100))}%` }}
                                    />
                                </div>
                            </div>

                            {/* 右侧：搜索和操作 */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                {/* 批量选择按钮 */}
                                <button
                                    onClick={() => setBatchMode(!batchMode)}
                                    className={clsx(
                                        "p-2 rounded-lg transition-all",
                                        batchMode 
                                            ? (isDark ? "bg-[#FF4D00] text-white" : "bg-[#FF4D00] text-white")
                                            : (isDark ? "bg-white/5 text-white/60 hover:bg-white/10" : "bg-gray-100 text-gray-600 hover:bg-gray-200")
                                    )}
                                    title={isZh ? '批量选择' : 'Batch select'}
                                >
                                    {batchMode ? <CheckSquare size={18} /> : <Square size={18} />}
                                </button>

                                {/* 更多筛选按钮 */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={clsx(
                                            "px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-2",
                                            hasActiveFilters || showFilters
                                                ? (isDark ? "bg-[#FF4D00] text-white border-[#FF4D00]" : "bg-[#FF4D00] text-white border-[#FF4D00]")
                                                : (isDark ? "bg-transparent text-white/60 border-white/10 hover:border-white/40" : "bg-transparent text-black/60 border-black/10 hover:border-black/40")
                                        )}
                                    >
                                        <SlidersHorizontal size={16} />
                                        <span className="hidden sm:inline">{isZh ? '筛选' : 'Filters'}</span>
                                        {hasActiveFilters && (
                                            <span className={clsx("px-1.5 py-0.5 rounded-full text-xs", isDark ? "bg-white/20" : "bg-black/20")}>
                                                {filters.brands.length +
                                                    filters.riskLevels.length +
                                                    filters.stages.length +
                                                    (filters.priceRange ? 1 : 0) +
                                                    (filters.survivalRateRange ? 1 : 0)}
                                            </span>
                                        )}
                                    </button>

                                {/* 排序选择 */}
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setShowSortMenu(!showSortMenu);
                                            setShowFilters(false);
                                        }}
                                        onBlur={() => setTimeout(() => setShowSortMenu(false), 200)}
                                        className={clsx(
                                            "px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-2",
                                            isDark 
                                                ? "bg-transparent text-white/60 border-white/10 hover:border-white/40" 
                                                : "bg-transparent text-black/60 border-black/10 hover:border-black/40"
                                        )}
                                    >
                                        <ArrowUpDown size={16} />
                                        <span className="hidden sm:inline">
                                            {sortBy === 'latest' ? (isZh ? '最新' : 'Latest') :
                                             sortBy === 'price-low' ? (isZh ? '价格低' : 'Price ↑') :
                                             sortBy === 'price-high' ? (isZh ? '价格高' : 'Price ↓') :
                                             sortBy === 'popular' ? (isZh ? 'Aiva 推荐' : 'Aiva Recommended') :
                                             sortBy === 'survival-high' ? (isZh ? '本土化生存率' : 'Localization Fit') :
                                             sortBy === 'name-asc' ? (isZh ? '名称 A-Z' : 'Name A-Z') :
                                             (isZh ? '名称 Z-A' : 'Name Z-A')}
                                        </span>
                                        <ChevronDown size={14} className={clsx("transition-transform", showSortMenu && "rotate-180")} />
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
                                                        "w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2",
                                                        sortBy === option
                                                            ? (isDark ? "bg-white/10 text-white" : "bg-gray-100 text-black")
                                                            : (isDark ? "text-white/60 hover:bg-white/5" : "text-gray-600 hover:bg-gray-50")
                                                    )}
                                                >
                                                    {option === 'latest' && <Clock size={14} />}
                                                    {option === 'price-low' && <DollarSign size={14} />}
                                                    {option === 'price-high' && <DollarSign size={14} />}
                                                    {option === 'popular' && <TrendingUp size={14} />}
                                                    {option === 'survival-high' && <Grid3X3 size={14} />}
                                                    {(option === 'name-asc' || option === 'name-desc') && <SortAsc size={14} />}
                                                    {option === 'latest' ? (isZh ? '最新' : 'Latest') :
                                                     option === 'price-low' ? (isZh ? '价格：低到高' : 'Price: Low to High') :
                                                     option === 'price-high' ? (isZh ? '价格：高到低' : 'Price: High to Low') :
                                                     option === 'popular' ? (isZh ? 'Aiva 推荐度' : 'Aiva Recommendation') :
                                                     option === 'survival-high' ? (isZh ? '本土化生存率优先' : 'Localization Survival Rate') :
                                                     option === 'name-asc' ? (isZh ? '名称 A-Z' : 'Name A-Z') :
                                                     (isZh ? '名称 Z-A' : 'Name Z-A')}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* 搜索框 */}
                                <div className="relative w-full md:w-80">
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
                                                "w-full border rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none transition-all",
                                                isDark 
                                                    ? "bg-white/5 border-white/10 text-white focus:border-[#00FFC6] focus:bg-white/10 focus:shadow-[0_0_20px_rgba(0,255,198,0.3)]" 
                                                    : "bg-white border-black/10 text-black focus:border-[#0071E3] focus:bg-gray-50 focus:shadow-[0_0_20px_rgba(0,113,227,0.3)]"
                                            )}
                                        />
                                        <Search size={18} className={clsx("absolute left-4 top-3.5", isDark ? "text-white/40" : "text-black/40")} />
                                    </form>

                                    {/* 搜索建议下拉 */}
                                    {showSearchSuggestions && (searchSuggestions.length > 0 || searchHistory.length > 0 || popularSearches.length > 0) && (
                                        <div className={clsx(
                                            "absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-lg py-2 z-50 max-h-96 overflow-y-auto",
                                            isDark ? "bg-[#111] border-white/10" : "bg-white border-black/10"
                                        )}>
                                            {searchSuggestions.length > 0 && (
                                                <>
                                                    <div className={clsx("px-4 py-2 text-xs uppercase tracking-wider", isDark ? "text-white/40" : "text-black/40")}>
                                                        {isZh ? '搜索建议' : 'Suggestions'}
                                                    </div>
                                                    {searchSuggestions.map((suggestion, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                setSearchQuery(suggestion);
                                                                setShowSearchSuggestions(false);
                                                                handleSearchSubmit();
                                                            }}
                                                            className={clsx(
                                                                "w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2",
                                                                isDark ? "text-white/80 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            <Search size={14} className={clsx(isDark ? "text-white/40" : "text-gray-400")} />
                                                            {suggestion}
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                            {searchHistory.length > 0 && (
                                                <>
                                                    <div className={clsx("px-4 py-2 text-xs uppercase tracking-wider mt-2 flex items-center justify-between", isDark ? "text-white/40" : "text-black/40")}>
                                                        <span>{isZh ? '搜索历史' : 'History'}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                storageService.clearSearchHistory();
                                                                setSearchHistory([]);
                                                                setShowSearchSuggestions(false);
                                                            }}
                                                            className={clsx(
                                                                "text-[10px] px-2 py-0.5 rounded hover:bg-white/5 transition-colors",
                                                                isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black"
                                                            )}
                                                            title={isZh ? '清空历史' : 'Clear history'}
                                                        >
                                                            {isZh ? '清空' : 'Clear'}
                                                        </button>
                                                    </div>
                                                    {searchHistory.slice(0, 5).map((history, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={clsx(
                                                                "flex items-center gap-2 group",
                                                                isDark ? "hover:bg-white/5" : "hover:bg-gray-50"
                                                            )}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    setSearchQuery(history);
                                                                    setShowSearchSuggestions(false);
                                                                    handleSearchSubmit();
                                                                }}
                                                                className={clsx(
                                                                    "flex-1 px-4 py-2 text-left text-sm transition-colors flex items-center gap-2",
                                                                    isDark ? "text-white/80" : "text-gray-700"
                                                                )}
                                                            >
                                                                <Clock size={14} className={clsx(isDark ? "text-white/40" : "text-gray-400")} />
                                                                {history}
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    storageService.removeSearchHistory(history);
                                                                    setSearchHistory(storageService.getSearchHistory());
                                                                }}
                                                                className={clsx(
                                                                    "p-1.5 mr-2 rounded opacity-0 group-hover:opacity-100 transition-opacity",
                                                                    isDark ? "hover:bg-white/10 text-white/60" : "hover:bg-gray-100 text-gray-500"
                                                                )}
                                                                title={isZh ? '删除' : 'Delete'}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </>
                                            )}
                                            {popularSearches.length > 0 && searchQuery.length < 2 && (
                                                <>
                                                    <div className={clsx("px-4 py-2 text-xs uppercase tracking-wider mt-2", isDark ? "text-white/40" : "text-black/40")}>
                                                        {isZh ? '热门搜索' : 'Popular'}
                                                    </div>
                                                    {popularSearches.map((popular, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => {
                                                                setSearchQuery(popular);
                                                                setShowSearchSuggestions(false);
                                                                handleSearchSubmit();
                                                            }}
                                                            className={clsx(
                                                                "w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2",
                                                                isDark ? "text-white/80 hover:bg-white/5" : "text-gray-700 hover:bg-gray-50"
                                                            )}
                                                        >
                                                            <TrendingUp size={14} className={clsx(isDark ? "text-white/40" : "text-gray-400")} />
                                                            {popular}
                                                        </button>
                                                    ))}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 筛选面板 */}
                        {showFilters && (
                            <GlassmorphicCard 
                                blur={20} 
                                opacity={0.1} 
                                borderGlow={true} 
                                hoverEffect="glow"
                                className="mb-6 p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={clsx("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>
                                        {isZh ? '高级筛选' : 'Advanced Filters'}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearAllFilters}
                                                className={clsx(
                                                    "px-3 py-1.5 rounded-lg text-sm transition-all",
                                                    isDark ? "text-white/60 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                                )}
                                            >
                                                {isZh ? '清除全部' : 'Clear all'}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className={clsx(
                                                "p-1.5 rounded-lg transition-all",
                                                isDark ? "text-white/60 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                            )}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* 价格区间 */}
                                    <div>
                                        <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-white/80" : "text-gray-700")}>
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
                                                        : "bg-gray-50 border-black/10 text-black"
                                                )}
                                            />
                                            <span className={clsx(isDark ? "text-white/40" : "text-gray-400")}>-</span>
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
                                                        : "bg-gray-50 border-black/10 text-black"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* 品牌筛选 */}
                                    <div>
                                        <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-white/80" : "text-gray-700")}>
                                            {isZh ? '品牌' : 'Brand'}
                                        </label>
                                        <div className="max-h-32 overflow-y-auto space-y-1">
                                            {availableBrands.slice(0, 10).map(brand => (
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
                                                    <span className={clsx("text-sm", isDark ? "text-white/80" : "text-gray-700")}>{brand}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 风险等级 */}
                                    <div>
                                        <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-white/80" : "text-gray-700")}>
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
                                                    <span className={clsx("text-sm", isDark ? "text-white/80" : "text-gray-700")}>
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

                                    {/* 产品阶段 */}
                                    <div>
                                        <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-white/80" : "text-gray-700")}>
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
                                                    <span className={clsx("text-sm", isDark ? "text-white/80" : "text-gray-700")}>{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 本土化生存率 */}
                                    <div>
                                        <label className={clsx("block text-sm font-medium mb-2", isDark ? "text-white/80" : "text-gray-700")}>
                                            {isZh ? '本土化生存率（%）' : 'Localization Survival Rate (%)'}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                placeholder={survivalRateRange[0].toString()}
                                                value={filters.survivalRateRange?.[0] ?? ''}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    const safeVal = isNaN(val) ? survivalRateRange[0] : val;
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        survivalRateRange: [
                                                            safeVal,
                                                            prev.survivalRateRange?.[1] ?? survivalRateRange[1]
                                                        ]
                                                    }));
                                                }}
                                                className={clsx(
                                                    "w-full px-3 py-2 rounded-lg text-sm border",
                                                    isDark 
                                                        ? "bg-white/5 border-white/10 text-white" 
                                                        : "bg-gray-50 border-black/10 text-black"
                                                )}
                                            />
                                            <span className={clsx(isDark ? "text-white/40" : "text-gray-400")}>-</span>
                                            <input
                                                type="number"
                                                placeholder={survivalRateRange[1].toString()}
                                                value={filters.survivalRateRange?.[1] ?? ''}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value);
                                                    const safeVal = isNaN(val) ? survivalRateRange[1] : val;
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        survivalRateRange: [
                                                            prev.survivalRateRange?.[0] ?? survivalRateRange[0],
                                                            safeVal
                                                        ]
                                                    }));
                                                }}
                                                className={clsx(
                                                    "w-full px-3 py-2 rounded-lg text-sm border",
                                                    isDark 
                                                        ? "bg-white/5 border-white/10 text-white" 
                                                        : "bg-gray-50 border-black/10 text-black"
                                                )}
                                            />
                                        </div>
                                        <p className={clsx("mt-1 text-xs", isDark ? "text-white/40" : "text-gray-400")}>
                                            {isZh 
                                                ? '例如：只看生存率在 60%-100% 的产品' 
                                                : 'e.g. only show products with survival rate between 60%-100%'}
                                        </p>
                                    </div>
                                </div>
                            </GlassmorphicCard>
                        )}

                        {/* 产品数量和批量操作提示 */}
                        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                            <div className={clsx("text-sm", isDark ? "text-white/60" : "text-gray-500")}>
                                {isZh 
                                    ? `找到 ${filteredAndSortedProducts.length} 个产品` 
                                    : `Found ${filteredAndSortedProducts.length} products`}
                            </div>
                            {batchMode && selectedProducts.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className={clsx("text-sm font-medium", isDark ? "text-[#FF4D00]" : "text-[#FF4D00]")}>
                                        {isZh 
                                            ? `已选择 ${selectedProducts.length} 个产品` 
                                            : `${selectedProducts.length} selected`}
                                    </div>
                                    {selectedProducts.length >= 2 && (
                                        <button
                                            onClick={() => {
                                                // Navigate to compare page - this will be handled by parent
                                                window.location.href = '/compare';
                                            }}
                                            className={clsx(
                                                "px-4 py-1.5 rounded-full text-xs font-medium transition-all",
                                                "hover:scale-105 active:scale-95",
                                                isDark 
                                                    ? "bg-[#00FFC6] text-black hover:bg-[#00FFC6]/90" 
                                                    : "bg-[#0071E3] text-white hover:bg-[#0071E3]/90"
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

                {/* 搜索进度指示 */}
                {isSearching && searchQuery.trim() && (
                    <div className={clsx(
                        "mb-6 p-4 rounded-xl border flex items-center gap-3",
                        isDark ? "bg-white/5 border-white/10" : "bg-white border-black/10"
                    )}>
                        <div className="animate-spin">
                            <Search size={20} className={clsx(isDark ? "text-[#00FFC6]" : "text-[#0071E3]")} />
                        </div>
                        <div className="flex-1">
                            <p className={clsx("text-sm font-medium", isDark ? "text-white" : "text-black")}>
                                {isZh ? '正在搜索...' : 'Searching...'}
                            </p>
                            <p className={clsx("text-xs mt-1", isDark ? "text-white/60" : "text-gray-500")}>
                                {isZh ? `搜索关键词: "${searchQuery}"` : `Searching for: "${searchQuery}"`}
                            </p>
                        </div>
                    </div>
                )}

                {/* Grid */}
                {isSearching ? (
                    <div className="columns-2 sm:columns-3 lg:columns-4 gap-1 sm:gap-1.5 md:gap-2">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="break-inside-avoid mb-1 sm:mb-1.5 md:mb-2">
                                <SkeletonCard />
                            </div>
                        ))}
                    </div>
                ) : filteredAndSortedProducts.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="columns-2 sm:columns-3 lg:columns-4 gap-1 sm:gap-1.5 md:gap-2">
                        {filteredAndSortedProducts.map((product, index) => {
                            const isFavorite = favorites.some(p => p.id === product.id);
                            const isSelected = selectedProducts.some(p => p.id === product.id);
                            return (
                                <div 
                                    key={product.id} 
                                    className={clsx(
                                        "break-inside-avoid mb-1 sm:mb-1.5 md:mb-2",
                                        animationConfig.enabled && productsLoaded && "product-card-animate"
                                    )}
                                >
                                    <ProductCard
                                        product={product}
                                        isSelected={isSelected}
                                        isFavorite={isFavorite}
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
            </div>
        </div>
    );
};
