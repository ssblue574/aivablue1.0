import React, { KeyboardEvent } from 'react';
import { Product } from '../data';
import { Check, AlertTriangle, Lock, ArrowUpRight, Rocket, Sparkles, Heart, ShoppingCart, Zap, TrendingUp, Star, Gift, Tag, Compass, FileText, Video, MessageCircle, Globe } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

// 根据品牌推断国家（如果产品没有 country 字段）
const inferCountryFromBrand = (brand: string | undefined): string => {
    if (!brand) return 'UNKNOWN';
    const brandLower = brand.toLowerCase();
    
    // 美国品牌
    const usBrands = ['apple', 'google', 'microsoft', 'amazon', 'meta', 'tesla', 'openai', 'nvidia', 'amd', 'intel', 'qualcomm', 'hp', 'dell', 'ibm', 'broadcom', 'motorola', 'snapchat', 'rabbit', 'humane', 'prophetic'];
    if (usBrands.some(b => brandLower.includes(b))) return 'US';
    
    // 中国品牌
    const cnBrands = ['huawei', 'xiaomi', 'oppo', 'vivo', 'oneplus', 'lenovo', 'honor', 'meizu', 'realme', '华为', '小米', '欧珀', '维沃', '一加', '联想', '荣耀', '魅族'];
    if (cnBrands.some(b => brandLower.includes(b))) return 'CN';
    
    // 日本品牌
    const jpBrands = ['sony', 'panasonic', 'sharp', 'nintendo', 'canon', 'nikon', 'fujifilm', '索尼', '松下', '夏普', '任天堂'];
    if (jpBrands.some(b => brandLower.includes(b))) return 'JP';
    
    // 韩国品牌
    const krBrands = ['samsung', 'lg', '三星', 'lg'];
    if (krBrands.some(b => brandLower.includes(b))) return 'KR';
    
    // 欧洲品牌
    const euBrands = ['nokia', 'philips', 'siemens', 'bosch', '诺基亚', '飞利浦'];
    if (euBrands.some(b => brandLower.includes(b))) return 'EU';
    
    return 'UNKNOWN';
};

// 国家标识配置
const getCountryInfo = (countryCode: string, lang: string) => {
    const isZh = lang === 'zh';
    const countryMap: Record<string, { name: string; flag: string; color: string }> = {
        'US': { name: isZh ? '美国' : 'USA', flag: '🇺🇸', color: '#3B82F6' },
        'CN': { name: isZh ? '中国' : 'China', flag: '🇨🇳', color: '#EF4444' },
        'JP': { name: isZh ? '日本' : 'Japan', flag: '🇯🇵', color: '#F59E0B' },
        'KR': { name: isZh ? '韩国' : 'Korea', flag: '🇰🇷', color: '#8B5CF6' },
        'EU': { name: isZh ? '欧洲' : 'Europe', flag: '🇪🇺', color: '#10B981' },
        'UNKNOWN': { name: isZh ? '未知' : 'Unknown', flag: '🌍', color: '#6B7280' }
    };
    return countryMap[countryCode] || countryMap['UNKNOWN'];
};

const IMG_FALLBACK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320"><rect width="480" height="320" fill="%23f2f3f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2399a1b3" font-family="sans-serif" font-size="16">Image unavailable</text></svg>';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
    isFavorite?: boolean;
    onToggleFavorite?: (product: Product) => void;
  t?: (key: any) => string;
  hideBuyButton?: boolean;
    lang?: string;
    compact?: boolean;
}

const getRiskBadge = (level: string | undefined, isDark: boolean | undefined, lang: string) => {
    const isZh = lang === 'zh';
    switch (level) {
        case 'Critical':
            return (
                <span className="bg-red-600 text-white px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.75 md:py-1 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 rounded-full shadow-lg shadow-red-600/30">
                    <AlertTriangle size={8} className="sm:w-[9px] sm:h-[9px] md:w-[10px] md:h-[10px]" /> <span className="hidden xs:inline">{isZh ? '极高风险' : 'CRITICAL'}</span>
                </span>
            );
        case 'High':
            return (
                <span className="bg-orange-500 text-white px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.75 md:py-1 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 rounded-full shadow-lg shadow-orange-500/30">
                    <AlertTriangle size={8} className="sm:w-[9px] sm:h-[9px] md:w-[10px] md:h-[10px]" /> <span className="hidden xs:inline">{isZh ? '较高风险' : 'HIGH RISK'}</span>
                </span>
            );
        case 'Moderate':
            return (
                <span className="bg-yellow-500 text-white px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.75 md:py-1 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 rounded-full shadow-lg shadow-yellow-500/30">
                    <AlertTriangle size={8} className="sm:w-[9px] sm:h-[9px] md:w-[10px] md:h-[10px]" /> <span className="hidden xs:inline">{isZh ? '中等风险' : 'MODERATE'}</span>
                </span>
            );
        case 'Low':
            return (
                <span className="bg-blue-500 text-white px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.75 md:py-1 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 rounded-full shadow-lg shadow-blue-500/30">
                    <Check size={8} className="sm:w-[9px] sm:h-[9px] md:w-[10px] md:h-[10px]" /> <span className="hidden xs:inline">{isZh ? '低风险' : 'LOW RISK'}</span>
                </span>
            );
        case 'Safe':
            return (
                <span className="bg-green-500 text-white px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.75 md:py-1 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 rounded-full shadow-lg shadow-green-500/30">
                    <Check size={8} className="sm:w-[9px] sm:h-[9px] md:w-[10px] md:h-[10px]" /> <span className="hidden xs:inline">{isZh ? '推荐购买' : 'RECOMMENDED'}</span>
                </span>
            );
        default:
            return null;
    }
};

const getStageBadge = (stage: string | undefined, fundingStatus: string | undefined, lang: string) => {
    const isZh = lang === 'zh';
    if (stage === 'startup') {
        return (
            <span className="bg-[#FF4D00] text-white px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.75 md:py-1 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 rounded-full">
                <Rocket size={8} className="sm:w-[9px] sm:h-[9px] md:w-[10px] md:h-[10px]" /> <span className="hidden xs:inline">{isZh ? '初创新品' : 'STARTUP'}</span>
            </span>
        );
    }
    if (fundingStatus) {
        return (
            <span className="bg-purple-600 text-white px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-0.75 md:py-1 text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 sm:gap-1.5 rounded-full">
                <Sparkles size={8} className="sm:w-[9px] sm:h-[9px] md:w-[10px] md:h-[10px]" /> <span className="hidden xs:inline">{isZh ? '众筹中' : fundingStatus}</span>
            </span>
        );
    }
    return null;
};

// Dynamic action buttons based on product characteristics
const getProductActions = (product: Product, isZh: boolean, isDark: boolean) => {
    const category = product.category?.toLowerCase() || '';
    const survivalRate = product.survivalRate || 0;
    const stage = product.stage;
    const riskLevel = product.riskLevel;
    const index = (product.id?.charCodeAt(0) || 0) % 6; // Create variety based on product id

    // Define different action combinations
    const actionSets = [
        // Set 0: Shopping focused
        {
            primary: { icon: ShoppingCart, label: isZh ? '查看购买渠道' : 'Buy Channels', color: 'bg-[#00FFC6] text-black' },
            secondary: { icon: TrendingUp, label: isZh ? '价格走势' : 'Price Trend' }
        },
        // Set 1: Review focused
        {
            primary: { icon: Video, label: isZh ? '观看评测' : 'Watch Review', color: 'bg-blue-500 text-white' },
            secondary: { icon: MessageCircle, label: isZh ? '用户讨论' : 'Discussion' }
        },
        // Set 2: Deal focused（弱化“对比”文案）
        {
            primary: { icon: Tag, label: isZh ? '优惠信息' : 'Deals', color: 'bg-orange-500 text-white' },
            secondary: { icon: Compass, label: isZh ? '查看更多类似' : 'Similar Options' }
        },
        // Set 3: Analysis focused
        {
            primary: { icon: FileText, label: isZh ? '深度分析' : 'Deep Analysis', color: 'bg-purple-500 text-white' },
            secondary: { icon: Star, label: isZh ? '专家评分' : 'Expert Score' }
        },
        // Set 4: Gift/New focused
        {
            primary: { icon: Gift, label: isZh ? '新品尝鲜' : 'Try New', color: 'bg-pink-500 text-white' },
            secondary: { icon: Zap, label: isZh ? '快速了解' : 'Quick Look' }
        },
        // Set 5: Trending focused
        {
            primary: { icon: TrendingUp, label: isZh ? '市场热度' : 'Market Heat', color: 'bg-emerald-500 text-white' },
            secondary: { icon: Sparkles, label: isZh ? 'AI 解读' : 'AI Insight' }
        }
    ];

    // Override based on specific conditions
    if (stage === 'startup') {
        return {
            primary: { icon: Rocket, label: isZh ? '支持众筹' : 'Back Project', color: 'bg-[#FF4D00] text-white' },
            secondary: { icon: FileText, label: isZh ? '项目详情' : 'Project Info' }
        };
    }

    if (riskLevel === 'Safe' && survivalRate > 85) {
        return {
            primary: { icon: ShoppingCart, label: isZh ? '立即购买' : 'Buy Now', color: 'bg-[#00FFC6] text-black' },
            secondary: { icon: Star, label: isZh ? '查看评价' : 'Reviews' }
        };
    }

    if (riskLevel === 'Critical' || riskLevel === 'High') {
        return {
            primary: { icon: AlertTriangle, label: isZh ? '风险解读' : 'Risk Analysis', color: 'bg-red-500 text-white' },
            secondary: { icon: Compass, label: isZh ? '替代方案' : 'Alternatives' }
        };
    }

    if (category.includes('游戏') || category.includes('game')) {
        return {
            primary: { icon: Video, label: isZh ? '游戏试玩' : 'Gameplay', color: 'bg-purple-600 text-white' },
            secondary: { icon: MessageCircle, label: isZh ? '玩家社区' : 'Community' }
        };
    }

    if (category.includes('ai') || category.includes('智能') || category.includes('终端')) {
        return {
            primary: { icon: Sparkles, label: isZh ? 'AI 能力详解' : 'AI Features', color: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' },
            secondary: { icon: Zap, label: isZh ? '性能参数' : 'Specs' }
        };
    }

    if (category.includes('摄影') || category.includes('camera') || category.includes('photo')) {
        return {
            primary: { icon: Video, label: isZh ? '样张赏析' : 'Sample Photos', color: 'bg-amber-500 text-white' },
            secondary: { icon: FileText, label: isZh ? '查看参数' : 'View Specs' }
        };
    }

    // Default: use index-based variety
    return actionSets[index];
};

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    isSelected,
    onToggleSelect,
    onViewDetail,
    isFavorite = false,
    onToggleFavorite,
    t = (k: any) => k,
    hideBuyButton = false,
    lang = 'en',
    compact = false
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isZh = lang === 'zh';
    
    // 获取国家信息
    const countryCode = product.country || inferCountryFromBrand(product.brand);
    const countryInfo = getCountryInfo(countryCode, lang);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        img.onerror = null;
        img.src = IMG_FALLBACK;
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onViewDetail?.(product);
        }
    };

    // Survival Rate Color Logic
    const survivalRate = product.survivalRate || 0;
    const survivalColor = survivalRate < 40 ? '#ef4444' : survivalRate > 80 ? '#22c55e' : '#eab308';
    const survivalLabel = survivalRate < 40
        ? (isZh ? '谨慎购买' : 'Caution')
        : survivalRate > 80
            ? (isZh ? '推荐购买' : 'Recommended')
            : (isZh ? '持续观望' : 'Watch');

    // Get dynamic actions for this product
    const actions = getProductActions(product, isZh, isDark);

    // 紧凑模式：更小体积，明确展示国家 / 生存率 / 购买指数
    if (compact) {
        const buyIndex = typeof product.recommendScore === 'number'
            ? product.recommendScore
            : (survivalRate > 0
                ? Math.min(100, Math.round(survivalRate * 0.85 + (product.riskLevel === 'Safe' ? 12 : product.riskLevel === 'Low' ? 6 : 0)))
                : null);
        const buyColor = buyIndex == null
            ? (isDark ? '#ffffff66' : '#00000066')
            : buyIndex < 40
                ? '#ef4444'
                : buyIndex > 80
                    ? '#22c55e'
                    : '#eab308';

        return (
            <div
                className="group relative flex flex-col w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
                tabIndex={0}
                role="button"
                aria-label={product.name}
                onClick={() => onViewDetail?.(product)}
                onKeyDown={handleKeyDown}
            >
                <div className={clsx(
                    "relative overflow-hidden rounded-xl mb-2.5 aspect-[4/3]",
                    isDark ? "bg-[#111]" : "bg-[#e8e8ed]",
                    isSelected && "ring-1 ring-[#FF4D00]"
                )}>
                    <img
                        src={product.imageUrl}
                        alt={product.name || 'Product image'}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        loading="lazy"
                        onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/40 text-white/90 backdrop-blur-sm border border-white/10">
                            <span aria-hidden="true">{countryInfo.flag}</span>
                            <span>{countryInfo.name}</span>
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleSelect(product);
                                }}
                                className={clsx(
                                    "w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border",
                                    isSelected
                                        ? "bg-[#FF4D00] text-white border-[#FF4D00]"
                                        : "bg-black/30 text-white/75 border-white/15 opacity-0 group-hover:opacity-100"
                                )}
                                aria-label={isSelected ? (isZh ? '取消对比' : 'Deselect') : (isZh ? '加入对比' : 'Compare')}
                                aria-pressed={isSelected}
                            >
                                <Check size={12} />
                            </button>
                            {onToggleFavorite && (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite(product);
                                    }}
                                    className={clsx(
                                        "w-7 h-7 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border",
                                        isFavorite
                                            ? "bg-white text-black border-white"
                                            : "bg-black/30 text-white/85 border-white/15 hover:bg-black/45"
                                    )}
                                    aria-label={isFavorite ? (isZh ? `取消收藏 ${product.name}` : `Remove ${product.name} from favorites`) : (isZh ? `收藏 ${product.name}` : `Add ${product.name} to favorites`)}
                                    aria-pressed={isFavorite}
                                >
                                    <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                        <span className="text-xs font-semibold text-white tabular-nums drop-shadow-sm">
                            {product.priceEstimate}
                        </span>
                        <span className="text-[10px] text-white/65 tabular-nums">
                            {product.launchDate}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 px-0.5">
                    <div className="space-y-0.5">
                        <p className={clsx(
                            "text-[10px] tracking-[0.12em] uppercase",
                            isDark ? "text-white/40" : "text-black/40"
                        )}>
                            {product.brand}
                        </p>
                        <h3 className={clsx(
                            "text-sm font-medium leading-snug tracking-tight line-clamp-2",
                            isDark ? "text-white" : "text-black"
                        )}>
                            {product.name}
                        </h3>
                    </div>

                    {/* 核心指标：生存率 / 购买指数 / 国家 */}
                    <div className={clsx(
                        "grid grid-cols-3 gap-1.5 pt-1 border-t",
                        isDark ? "border-white/10" : "border-black/10"
                    )}>
                        <div className="min-w-0">
                            <p className={clsx("text-[9px] tracking-wide mb-0.5", isDark ? "text-white/35" : "text-black/35")}>
                                {isZh ? '生存率' : 'Survival'}
                            </p>
                            <p
                                className="text-xs font-semibold tabular-nums truncate"
                                style={{ color: survivalRate > 0 ? survivalColor : (isDark ? '#ffffff66' : '#00000066') }}
                            >
                                {survivalRate > 0 ? `${survivalRate}%` : '—'}
                            </p>
                        </div>
                        <div className="min-w-0">
                            <p className={clsx("text-[9px] tracking-wide mb-0.5", isDark ? "text-white/35" : "text-black/35")}>
                                {isZh ? '购买指数' : 'Buy Index'}
                            </p>
                            <p
                                className="text-xs font-semibold tabular-nums truncate"
                                style={{ color: buyColor }}
                            >
                                {buyIndex != null ? buyIndex : '—'}
                            </p>
                        </div>
                        <div className="min-w-0">
                            <p className={clsx("text-[9px] tracking-wide mb-0.5", isDark ? "text-white/35" : "text-black/35")}>
                                {isZh ? '国家' : 'Origin'}
                            </p>
                            <p className={clsx(
                                "text-xs font-medium truncate inline-flex items-center gap-1",
                                isDark ? "text-white/75" : "text-black/75"
                            )}>
                                <span aria-hidden="true">{countryInfo.flag}</span>
                                <span>{countryInfo.name}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 标准模式（原有样式 + 3D 效果）
    return (
        <div
            className="group relative flex flex-col transition-all duration-300 hover:-translate-y-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FFC6]"
            style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
            tabIndex={0}
            role="button"
            aria-label={product.name}
            onClick={() => onViewDetail?.(product)}
            onKeyDown={handleKeyDown}
        >
            {/* Card Container with 3D effects */}
            <div 
                className={clsx(
                    "flex-1 flex flex-col overflow-hidden rounded-xl sm:rounded-2xl border relative cursor-pointer",
                    "group-hover:shadow-[0_0_30px_rgba(0,255,198,0.15),0_20px_60px_rgba(0,0,0,0.3)]",
                    isDark
                        ? "bg-[#111] border-white/10 group-hover:border-[#00FFC6]/50"
                        : "bg-white border-black/10 hover:border-[#00FFC6]/50 shadow-sm hover:shadow-xl",
                    isSelected && "ring-2 ring-[#00FFC6] border-[#00FFC6] shadow-[0_0_20px_rgba(0,255,198,0.3)]"
                )}
                style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseMove={(e) => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;
                    
                    card.style.transform = `
                        perspective(1000px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        translateY(-10px)
                        scale(1.02)
                    `;
                }}
                onMouseLeave={(e) => {
                    const card = e.currentTarget;
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
                }}
            >
                {/* Holographic border animation */}
                <div 
                    className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 198, 0.5), rgba(255, 95, 210, 0.5), rgba(139, 92, 246, 0.5))',
                        padding: '2px',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        animation: 'holographic-border 3s linear infinite',
                    }}
                />
                
                {/* Gradient overlay for depth */}
                <div 
                    className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{
                        background: isDark 
                            ? 'radial-gradient(circle at 50% 0%, rgba(0, 255, 198, 0.1), transparent 50%)'
                            : 'radial-gradient(circle at 50% 0%, rgba(0, 255, 198, 0.05), transparent 50%)',
                    }}
                />

                {/* === IMAGE SECTION === */}
                <div className="relative aspect-[3/2] sm:aspect-[4/3] overflow-hidden bg-black">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover saturate-[1.1] transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={handleImageError}
                    />

                    {/* Enhanced Gradient Overlay with depth */}
                    <div 
                        className="absolute inset-0 transition-opacity duration-500"
                        style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, transparent 60%)',
                        }}
                    />
                    
                    {/* Holographic gradient overlay on hover */}
                    <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                        style={{
                            background: 'linear-gradient(135deg, rgba(0, 255, 198, 0.2), rgba(255, 95, 210, 0.2), rgba(139, 92, 246, 0.2))',
                            backgroundSize: '200% 200%',
                            animation: 'holographic-border 3s ease infinite',
                        }}
                    />

                    {/* Top Badges Row */}
                    <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-2 sm:left-2 sm:right-2 md:top-3 md:left-3 md:right-3 flex justify-between items-start gap-1 sm:gap-1.5 md:gap-2">
                        {/* Stage Badge (Left) */}
                        <div className="flex flex-col gap-2">
                            {/* 国家标识 */}
                            <div className={clsx(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-md border shadow-sm",
                                isDark 
                                    ? "bg-black/50 border-white/20 text-white" 
                                    : "bg-white/90 border-black/10 text-black"
                            )}>
                                <span className="text-sm">{countryInfo.flag}</span>
                                <span>{countryInfo.name}</span>
                            </div>
                            {getStageBadge(product.stage, product.fundingStatus, lang)}
            </div>

                        {/* Right Side: Risk Badge + Favorite */}
                        <div className="flex flex-col items-end gap-2">
                            <div>
                                {getRiskBadge(product.riskLevel, isDark, lang)}
                            </div>
            <button
                                type="button"
              onClick={(e) => {
                e.stopPropagation();
                                    onToggleFavorite?.(product);
              }}
              className={clsx(
                                    "inline-flex items-center justify-center rounded-full border px-2 py-1 transition-all bg-black/40 backdrop-blur-sm",
                                    isFavorite
                                        ? "border-red-400 text-red-400 shadow-[0_0_12px_rgba(248,113,113,0.6)]"
                                        : "border-white/30 text-white/70 hover:border-white hover:text-white"
                                )}
                                aria-label={isFavorite ? (isZh ? `取消收藏 ${product.name}` : `Remove ${product.name} from favorites`) : (isZh ? `收藏 ${product.name}` : `Add ${product.name} to favorites`)}
                                aria-pressed={isFavorite}
                            >
                                <Heart
                                    size={14}
                                    className="transition-transform duration-150"
                                    fill={isFavorite ? "currentColor" : "none"}
                                />
            </button>
          </div>
                    </div>

                    {/* Insider Lock Overlay */}
                    {product.isInsiderOnly && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
                            <Lock size={32} className="text-white mb-3" />
                            <span className="text-white text-xs font-bold uppercase tracking-widest">
                                {isZh ? '仅限会员' : 'Insider Only'}
                            </span>
                        </div>
                    )}

                    {/* Bottom Info Strip */}
                    <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 md:p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                {/* Brand */}
                                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-white/70 uppercase tracking-wider mb-0.5">
                                    {product.brand}
                                </span>
                                {/* Launch Date */}
                                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-white/50 flex items-center gap-1">
                                    {product.launchDate}
                                </span>
                            </div>
                            {/* Price */}
                            <span className="text-xs sm:text-sm font-bold text-white">
                                {product.priceEstimate}
                            </span>
                        </div>
                    </div>
                </div>

                {/* === CONTENT SECTION === */}
                <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-5 flex flex-col">
                    {/* Product Name */}
                    <h3 className={clsx(
                        "text-sm sm:text-base md:text-lg font-bold leading-tight mb-1 sm:mb-1.5 md:mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors",
                        isDark ? "text-white" : "text-black"
                    )}>
                        {product.name}
                    </h3>

                    {/* Category */}
                    <p className={clsx("text-[10px] sm:text-xs mb-1 sm:mb-1.5 md:mb-2", isDark ? "text-white/40" : "text-black/40")}>
                        {product.category}
                    </p>

                    {/* Aiva Index (Survival Rate) - Enhanced with glow effects */}
                    {product.survivalRate !== undefined && (
                        <div className="mb-2 sm:mb-3 md:mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp 
                                        size={16} 
                                        className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" 
                                        style={{ 
                                            color: survivalColor,
                                            filter: `drop-shadow(0 0 4px ${survivalColor}40)`
                                        }}
                                        strokeWidth={2}
                                    />
                                    <span className={clsx(
                                        "text-xs sm:text-sm font-medium",
                                        isDark ? "text-white/70" : "text-black/70"
                                    )}>
                                        {isZh ? '艾瓦指数' : 'Aiva Index'}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span 
                                        className="text-xl sm:text-2xl md:text-3xl font-semibold leading-none transition-all duration-300 group-hover:scale-105"
                                        style={{ 
                                            color: survivalColor,
                                            fontFeatureSettings: '"tnum"',
                                            letterSpacing: '-0.01em',
                                            textShadow: `0 0 10px ${survivalColor}40`
                                        }}
                                    >
                                        {survivalRate}
                                    </span>
                                    <span 
                                        className="text-sm sm:text-base font-medium"
                                        style={{ 
                                            color: survivalColor,
                                            opacity: 0.7
                                        }}
                                    >
                                        %
                                    </span>
                                </div>
                            </div>
                            <div className={clsx(
                                "h-1.5 w-full rounded-full overflow-hidden relative",
                                isDark ? "bg-white/10" : "bg-black/10"
                            )}>
                                <div
                                    className="h-full rounded-full transition-all duration-1000 relative"
                                    style={{
                                        width: `${survivalRate}%`,
                                        backgroundColor: survivalColor,
                                        boxShadow: `0 0 8px ${survivalColor}60, inset 0 1px 0 rgba(255,255,255,0.3)`
                                    }}
                                >
                                    {/* Animated shine effect */}
                                    <div 
                                        className="absolute inset-0 opacity-50"
                                        style={{
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                                            animation: 'shimmer 2s infinite',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Verdict */}
                    {product.verdict && (
                        <div className={clsx(
                            "p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 md:mb-3 border",
                            isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                        )}>
                            <p className={clsx("text-[9px] sm:text-[10px] md:text-xs leading-relaxed italic line-clamp-2", isDark ? "text-white/70" : "text-black/70")}>
                                "{product.verdict}"
                            </p>
                        </div>
                    )}

          {/* Tags */}
                    <div className="flex flex-wrap gap-0.5 sm:gap-1 md:gap-1.5 mb-1.5 sm:mb-2 md:mb-3">
                        {product.tags.slice(0, 3).map(tag => (
                            <span
                                key={tag}
                                className={clsx(
                                    "px-2 py-0.5 text-[10px] rounded-md border",
                                    isDark ? "border-white/10 text-white/50" : "border-black/10 text-black/50"
                                )}
                            >
                {tag}
              </span>
            ))}
          </div>

                    {/* Dynamic Action Row */}
                    <div className="mt-auto pt-1.5 sm:pt-2 md:pt-3 border-t border-dashed flex items-center justify-between gap-1.5 sm:gap-2 md:gap-3" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                        {/* Primary Action - Unique per product */}
            <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewDetail?.(product);
                            }}
                            className={clsx(
                                "flex-1 flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg md:rounded-xl text-[9px] sm:text-[10px] md:text-xs font-bold transition-all hover:scale-105 shadow-lg",
                                actions.primary.color
                            )}
                        >
                            <actions.primary.icon size={10} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px]" />
                            <span className="hidden xs:inline">{actions.primary.label}</span>
            </button>

                        {/* Secondary Action */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewDetail?.(product);
                            }}
                            className={clsx(
                                "flex items-center gap-0.5 sm:gap-1 md:gap-1.5 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg md:rounded-xl text-[9px] sm:text-[10px] md:text-xs font-medium transition-all",
                                isDark
                                    ? "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                                    : "bg-black/5 text-black/60 hover:bg-black/10 hover:text-black"
                            )}
                        >
                            <actions.secondary.icon size={10} className="sm:w-3 sm:h-3 md:w-[14px] md:h-[14px]" />
                            <span className="hidden sm:inline">{actions.secondary.label}</span>
                            <ArrowUpRight size={8} className="sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 opacity-50" />
                        </button>
                    </div>
        </div>
      </div>
    </div>
  );
};
