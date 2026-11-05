import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check, Play, Globe, Wifi, Shield, Zap, CreditCard, Star, AlertTriangle, Truck, ExternalLink, Lock, FileText, Eye, Heart, Share2, TrendingUp, Calendar, Tag, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { Language, Product, ProductDetail, PurchaseChannel, AppView, CommunityPost } from '../data';
import { useTheme } from '../ThemeContext';
import { logEvent } from '../services/supabaseService';
import { ScrollytellingGallery } from './ScrollytellingGallery';

interface ProductDetailViewProps {
    product: Product | null;
    related: Product[];
    selectedProducts: Product[];
    onBack: () => void;
    onViewProduct: (product: Product) => void;
    onToggleSelect: (product: Product) => void;
    favorites?: Product[];
    onToggleFavorite?: (product: Product) => void;
    t: (key: any) => string;
    lang: Language;
    posts?: CommunityPost[];
    userPersona?: 'consumer' | 'geek';
}

type MediaItem = {
    type: 'image' | 'video';
    url: string;
    poster?: string;
};

const FALLBACK_GALLERY = [
    'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'
];

const buildFallbackDetail = (product: Product, lang: Language): ProductDetail => ({
    gallery: [product.imageUrl, ...FALLBACK_GALLERY],
    highlights: [
        product.description,
        `${lang === 'zh' ? '核心标签' : 'Key tags'} · ${product.tags?.join(' / ') || ''}`,
        `${lang === 'zh' ? '购买渠道' : 'Channel'} · ${product.buyingChannel}`
    ],
    shipping: lang === 'zh'
        ? '全球仓 5-7 天送达，可选加急配送。'
        : 'Ships worldwide in 5-7 days with express options.',
    warranty: lang === 'zh'
        ? '提供 1 年质保与 7 天无理由退换。'
        : 'Includes 1-year warranty with 7-day returns.',
    specs: [
        { label: lang === 'zh' ? '品牌' : 'Brand', value: product.brand },
        { label: lang === 'zh' ? '类别' : 'Category', value: product.category },
        { label: lang === 'zh' ? '上市时间' : 'Launch', value: product.launchDate },
        { label: lang === 'zh' ? '购买渠道' : 'Channel', value: product.buyingChannel }
    ]
});

const getMediaItems = (detail: ProductDetail, fallbackPoster: string): MediaItem[] => {
    const images = detail.gallery.map(url => ({ type: 'image' as const, url }));
    return detail.videoUrl
        ? [...images, { type: 'video', url: detail.videoUrl, poster: fallbackPoster }]
        : images;
};

const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500 border-green-500/30 bg-green-500/10';
    if (score >= 5) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    return 'text-red-500 border-red-500/30 bg-red-500/10 animate-pulse';
};

// 简短文案工具：用于决策速览区，避免一屏信息过长
const summarizeText = (text: string | undefined, max: number) => {
    if (!text) return '';
    if (text.length <= max) return text;
    return text.slice(0, max).trim() + '…';
};

// 将风险等级与本土化生存率，汇总为一句「怎么看风险」的提示
const buildRiskSummary = (product: Product, lang: Language, persona: 'consumer' | 'geek' = 'consumer') => {
    const rate = product.survivalRate;
    const level = product.riskLevel;

    // Geek Mode Override
    if (persona === 'geek') {
        if (lang === 'zh') {
            if (level === 'Critical') return '⚠️ 极客挑战：核心功能需自行折腾，可玩性极高。';
            if (rate !== undefined && rate < 40) return '⚡️ 本土化低：适合开发与二创，普通用户勿入。';
            return '✅ 极客模式：全功能正常，可作为主力开发机。';
        } else {
            if (level === 'Critical') return '⚠️ HACKER MODE: High friction, max potential.';
            if (rate !== undefined && rate < 40) return '⚡️ RAW: Localization optional. Build your own tools.';
            return '✅ G-MODE: Fully functional dev unit.';
        }
    }

    // Consumer (Standard) Mode
    if (lang === 'zh') {
        if (rate !== undefined && level) {
            if (rate < 40) {
                return '本土化生存率偏低，更适合作为尝鲜玩具，主力设备需谨慎。';
            }
            if (level === 'Critical') {
                return '激活、售后和账号都有较大不确定性，更适合愿意折腾的极客。';
            }
            return '整体风险可控，但下单前依然建议确认保修、税费和物流时效。';
        }
        if (rate !== undefined) {
            return rate < 40
                ? '本土化生存率偏低，更偏向尝鲜属性。'
                : '本土化表现尚可，可按需考虑入手。';
        }
        if (level) {
            return level === 'Critical'
                ? '风险较高，需要有折腾成本的心理预期。'
                : '风险中等，注意阅读条款细节。';
        }
        return '暂未标注明确风险级别，可结合下方详细分析自行判断。';
    } else {
        if (rate !== undefined && level) {
            if (rate < 40) {
                return 'Low localization score – better as an early-adopter toy than a daily driver.';
            }
            if (level === 'Critical') {
                return 'High risk around activation, returns and account; best for power users only.';
            }
            return 'Overall risk is manageable, but double-check warranty, duties and shipping.';
        }
        if (rate !== undefined) {
            return rate < 40
                ? 'Low localization score – mainly for experimentation.'
                : 'Localization looks acceptable for regular use.';
        }
        if (level) {
            return level === 'Critical'
                ? 'High overall risk; expect extra work to get it running smoothly.'
                : 'Moderate risk; review the fine print before buying.';
        }
        return 'No explicit risk rating yet – please refer to the detailed analysis below.';
    }
};

const getRiskBadge = (level: string | undefined, lang: Language, persona: 'consumer' | 'geek' = 'consumer') => {
    if (!level) return null;

    const isZh = lang === 'zh';

    // Geek Mode Badges
    if (persona === 'geek') {
        switch (level) {
            case 'Critical':
                return <span className="bg-purple-500/20 text-purple-400 border border-purple-500 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1"><AlertTriangle size={12} /> {isZh ? 'BOSS级挑战' : 'BOSS LEVEL'}</span>;
            case 'High':
                return <span className="bg-blue-500/20 text-blue-400 border border-blue-500 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1"><AlertTriangle size={12} /> {isZh ? '进阶模式' : 'ADVANCED'}</span>;
            default:
                return <span className="bg-green-500/20 text-green-500 border border-green-500 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1"><Check size={12} /> {isZh ? '开箱即用' : 'READY'}</span>;
        }
    }

    switch (level) {
        case 'Critical':
            return <span className="bg-red-500/20 text-red-500 border border-red-500 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1"><AlertTriangle size={12} /> {isZh ? '极高风险' : 'Critical Risk'}</span>;
        case 'High':
            return <span className="bg-orange-500/20 text-orange-500 border border-orange-500 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1"><AlertTriangle size={12} /> {isZh ? '较高风险' : 'High Risk'}</span>;
        case 'Moderate':
            return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1"><AlertTriangle size={12} /> {isZh ? '中等风险' : 'Moderate Risk'}</span>;
        case 'Low':
            return <span className="bg-blue-500/20 text-blue-500 border border-blue-500 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1"><Check size={12} /> {isZh ? '低风险' : 'Low Risk'}</span>;
        case 'Safe':
            return <span className="bg-green-500/20 text-green-500 border border-green-500 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1"><Check size={12} /> {isZh ? '推荐购买' : 'Recommended'}</span>;
        default:
            return null;
    }
};

const SurvivalBar: React.FC<{ rate: number }> = ({ rate }) => (
    <div className="w-full bg-white/10 h-2 rounded-full mt-2 overflow-hidden relative">
        <div
            className={clsx(
                "h-full transition-all duration-1000 ease-out rounded-full relative",
                rate > 80 ? "bg-green-500" : rate > 40 ? "bg-yellow-400" : "bg-red-600"
            )}
            style={{ width: `${rate}%` }}
        >
            {rate < 40 && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
        </div>
    </div>
);

const ChannelRow: React.FC<{ channel: PurchaseChannel; lang: Language; isDark: boolean; onRequestCheckout: (channel: PurchaseChannel) => void; disabled?: boolean }> = ({ channel, lang, isDark, onRequestCheckout, disabled }) => (
    <div className={clsx(
        "flex flex-col sm:flex-row sm:items-center justify-between p-4 border-l-4 transition-all gap-4 group rounded-lg",
        isDark
            ? "bg-white/5 border-blue-500/50 hover:border-blue-500 hover:bg-white/10"
            : "bg-gray-50 border-blue-500/50 hover:border-blue-500 hover:bg-gray-100"
    )}>
        <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
                <span className={clsx(
                    "font-bold text-base",
                    isDark ? "text-white" : "text-gray-900"
                )}>{channel.name}</span>
                {channel.isOfficial && (
                    <span className="text-[9px] uppercase px-2 py-0.5 bg-blue-500/20 text-blue-600 border border-blue-500/50 font-bold tracking-wider rounded">
                        {lang === 'zh' ? '官方' : 'Official'}
                    </span>
                )}
                <div className={clsx("flex items-center gap-1 text-[10px] px-2 py-0.5 border rounded", getScoreColor(channel.score))}>
                    <Star size={10} fill="currentColor" />
                    <span className="font-bold">{channel.score}/10</span>
                </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs mb-3 font-medium">
                {channel.pros.map((pro, i) => (
                    <span key={i} className="text-green-600 dark:text-green-400">+{pro}</span>
                ))}
                {channel.cons.map((con, i) => (
                    <span key={i} className="text-red-500 dark:text-red-400">-{con}</span>
                ))}
            </div>
            <div className={clsx(
                "flex items-center gap-4 text-xs uppercase tracking-wider",
                isDark ? "text-white/50" : "text-gray-500"
            )}>
                <div className="flex items-center gap-1.5">
                    <Truck size={12} />
                    <span>{channel.shippingInfo}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <CreditCard size={12} />
                    <span>{channel.paymentMethods.join(' / ')}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[160px]">
            <span className={clsx(
                "text-2xl font-bold",
                isDark ? "text-white" : "text-gray-900"
            )}>{channel.price}</span>
            <button
                type="button"
                onClick={() => !disabled && onRequestCheckout(channel)}
                disabled={disabled}
                className={clsx(
                    "p-2.5 rounded-lg transition-colors",
                    disabled
                        ? "bg-gray-400/40 text-gray-500 cursor-not-allowed"
                        : isDark
                            ? "bg-white text-black hover:bg-blue-500 hover:text-white"
                            : "bg-gray-900 text-white hover:bg-blue-500"
                )}
            >
                <ExternalLink size={18} />
            </button>
        </div>
    </div>
);

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
    product,
    related,
    selectedProducts,
    onBack,
    onViewProduct,
    onToggleSelect,
    favorites = [],
    onToggleFavorite,
    t,
    lang,
    posts = [],
    userPersona = 'consumer'
}) => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const detail = useMemo(() => {
        if (!product) return null;
        return product.detail ?? buildFallbackDetail(product, lang);
    }, [product, lang]);

    const mediaItems = useMemo<MediaItem[]>(() => {
        if (!product || !detail) return [];
        return getMediaItems(detail, product.imageUrl);
    }, [detail, product]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [pendingChannel, setPendingChannel] = useState<PurchaseChannel | null>(null);
    const [checkoutSource, setCheckoutSource] = useState<'primary' | 'list'>('list');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setActiveIndex(0);
    }, [product?.id]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!product || !detail) return null;

    const activeMedia = mediaItems[activeIndex] ?? mediaItems[0];
    const isSelected = selectedProducts.some(p => p.id === product.id);
    const isFavorite = favorites.some(p => p.id === product.id);
    const primaryChannel = product.purchaseChannels && product.purchaseChannels.length > 0
        ? product.purchaseChannels[0]
        : undefined;
    const survivalValue = typeof product.survivalRate === 'number' ? product.survivalRate : null;
    const placeholderText = lang === 'zh' ? '暂无数据' : 'No data yet';
    const purchaseChannels = product.purchaseChannels || [];
    const hasDeepAnalysis = Boolean(
        (product.coreFeatures && product.coreFeatures.length) ||
        product.productivity ||
        product.targetAudience ||
        product.aivaReview ||
        product.localizationIntel ||
        product.tacticalAnalysis ||
        product.userIntel
    );
    const hasIntelAnalysis = Boolean(product.intelligenceAnalysis || product.localizedDescription);
    const hasUserReviews = Boolean(product.userReviews && product.userReviews.length > 0);
    const hasSpecs = Boolean(detail.specs && detail.specs.length > 0);
    const hasFeatures = Boolean(product.features && product.features.length > 0);
    const hasChannels = purchaseChannels.length > 0;

    // Community Logic
    const relevantPosts = useMemo(() => {
        return posts
            .filter(p => p.productId === product.id)
            .sort((a, b) => b.helpfulCount - a.helpfulCount)
            .slice(0, 3);
    }, [posts, product.id]);

    const handleShare = async () => {
        try {
            const url = `${window.location.origin}/products/${product.id}`;
            const title = product.name;
            const text = lang === 'zh'
                ? `我在 AIVA 看到这款产品：${product.name}`
                : `Found this device on AIVA: ${product.name}`;

            if (navigator.share) {
                await navigator.share({ title, text, url });
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(url);
                alert(lang === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
            } else {
                window.prompt(lang === 'zh' ? '复制下面的链接' : 'Copy this link', url);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const normalizeUrl = (url: string | undefined) => {
        if (!url) return '';
        const trimmed = url.trim();
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return `https://${trimmed}`;
    };

    const openCheckoutModal = (channel: PurchaseChannel, source: 'primary' | 'list') => {
        try {
            // 确保弹窗总是出现在当前视口中间
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
            // 在部分环境（如 SSR）window 可能不存在，忽略即可
        }
        setPendingChannel(channel);
        setCheckoutSource(source);
        setIsCheckoutOpen(true);
    };

    const handlePrimaryBuy = () => {
        if (primaryChannel) {
            openCheckoutModal(primaryChannel, 'primary');
        } else {
            // 如果暂时没有配置渠道，就滚动到「购买渠道」区域，避免用户迷路
            const section = document.getElementById('acquisition-channels');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    const handleConfirmCheckout = () => {
        if (!pendingChannel) return;
        const targetUrl = normalizeUrl(pendingChannel.url);
        if (!targetUrl) return;

        logEvent('click_purchase_channel', {
            productId: product.id,
            productName: product.name,
            channelName: pendingChannel.name,
            channelType: pendingChannel.isOfficial ? 'official' : 'third_party',
            channelUrl: targetUrl,
            source: checkoutSource === 'primary' ? 'primary_cta' : 'channel_list_modal',
        });

        const opened = window.open(targetUrl, '_blank', 'noopener,noreferrer');
        if (!opened) {
            alert(lang === 'zh'
                ? '浏览器拦截了新标签页，请允许弹窗或手动复制链接。'
                : 'Pop-up blocked. Please allow new tabs or copy the link manually.');
        }

        setIsCheckoutOpen(false);
        setPendingChannel(null);
    };

    return (
        <div className={clsx("min-h-screen", isDark ? "bg-black" : "bg-[#f5f5f7]")}>
            {/* Header with Back Button */}
            <div className={clsx(
                "sticky top-14 z-40 border-b backdrop-blur-xl",
                isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-black/10"
            )}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className={clsx(
                            "relative z-20 flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                            isDark ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"
                        )}
                        aria-label={lang === 'zh' ? '返回' : 'Back'}
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm font-medium">{lang === 'zh' ? '返回' : 'Back'}</span>
                    </button>
                    <div className="flex items-center gap-3">
                        {primaryChannel && (
                            <button
                                type="button"
                                onClick={handlePrimaryBuy}
                                className={clsx(
                                    "hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm",
                                    isDark
                                        ? "bg-white text-black hover:bg-gray-200"
                                        : "bg-black text-white hover:bg-gray-800"
                                )}
                            >
                                <ShoppingBag size={16} />
                                <span>{lang === 'zh' ? '去购买' : 'Buy now'}</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleShare}
                            className={clsx(
                                "flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
                                isDark
                                    ? "border-white/20 text-white/70 hover:bg-white/10"
                                    : "border-black/20 text-black/70 hover:bg-black/5"
                            )}
                        >
                            <Share2 size={16} />
                            <span>{lang === 'zh' ? '分享' : 'Share'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => onToggleFavorite?.(product)}
                            className={clsx(
                                "flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium transition-all",
                                isFavorite
                                    ? "bg-red-500/10 border-red-400 text-red-400"
                                    : isDark
                                        ? "border-white/20 text-white/70 hover:bg-white/10"
                                        : "border-black/20 text-black/70 hover:bg-black/5"
                            )}
                        >
                            <Heart
                                size={16}
                                className="mr-1"
                                fill={isFavorite ? "currentColor" : "none"}
                            />
                            {lang === 'zh' ? (isFavorite ? '已收藏' : '收藏') : (isFavorite ? 'Saved' : 'Favorite')}
                        </button>
                        <div className={clsx("text-right", isDark ? "text-white" : "text-black")}>
                            <div className="text-xl font-bold font-mono">{product.priceEstimate}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
                {/* Hero: title + gallery + features (no sticky blank scroll) */}
                <div className="space-y-8">
                    <div className="max-w-3xl space-y-5">
                        <div className={clsx(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold tracking-widest uppercase",
                            isDark ? "border-white/15 bg-white/5 text-white/70" : "border-black/10 bg-black/5 text-black/60"
                        )}>
                            {product.brand}
                        </div>
                        <h1 className={clsx(
                            "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-none",
                            isDark ? "text-white" : "text-black"
                        )}>
                            {product.name}
                        </h1>
                        <p className={clsx(
                            "text-base sm:text-lg font-light leading-relaxed",
                            isDark ? "text-white/70" : "text-black/65"
                        )}>
                            {product.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            {primaryChannel && (
                                <button
                                    type="button"
                                    onClick={handlePrimaryBuy}
                                    className={clsx(
                                        "px-7 py-2.5 rounded-full font-bold transition-all shadow-sm hover:scale-[1.02]",
                                        isDark ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-800"
                                    )}
                                >
                                    {lang === 'zh' ? '立即购买' : 'Buy Now'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => onToggleSelect(product)}
                                className={clsx(
                                    "px-7 py-2.5 rounded-full font-medium border transition-all",
                                    isDark
                                        ? "border-white/25 text-white hover:bg-white/10"
                                        : "border-black/20 text-black hover:bg-black/5"
                                )}
                            >
                                {selectedProducts.find(p => p.id === product.id)
                                    ? (lang === 'zh' ? '已加入' : 'Added')
                                    : (lang === 'zh' ? '加入对比' : 'Compare')
                                }
                            </button>
                        </div>
                    </div>

                    <ScrollytellingGallery
                        images={(detail.gallery?.length ? detail.gallery : [product.imageUrl]).filter(Boolean)}
                        highlights={
                            detail.highlights?.length
                                ? detail.highlights
                                : (product.coreFeatures || product.features || [])
                        }
                        lang={lang}
                    />
                </div>

                {/* AI Data Visualization - Stats */}
                {survivalValue !== null && (
                    <div className="space-y-8">
                        <h2 className={clsx(
                            "text-sm font-medium tracking-[0.3em] uppercase text-center",
                            isDark ? "text-white/40" : "text-black/40"
                        )}>
                            {lang === 'zh' ? '数据分析' : 'Data Analysis'}
                        </h2>

                        <div className="max-w-sm mx-auto">
                            <div className="text-center space-y-4">
                                <div className={clsx(
                                    "text-6xl font-light tabular-nums",
                                    survivalValue < 40 ? "text-red-500" : "text-blue-500"
                                )}>
                                    {survivalValue}
                                    <span className="text-2xl">%</span>
                                </div>
                                <div className={clsx(
                                    "text-xs font-medium tracking-[0.2em] uppercase",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    {lang === 'zh' ? '生存率' : 'Survival Rate'}
                                </div>
                                <div className={clsx(
                                    "h-1 rounded-full overflow-hidden",
                                    isDark ? "bg-white/10" : "bg-black/10"
                                )}>
                                    <div
                                        className={clsx(
                                            "h-full transition-all duration-1000",
                                            survivalValue < 40 ? "bg-red-500" : "bg-blue-500"
                                        )}
                                        style={{ width: `${survivalValue}%` }}
                                    />
                                </div>
                                <p className={clsx("text-xs mt-4 leading-relaxed", isDark ? "text-white/50" : "text-black/50")}>
                                    {buildRiskSummary(product, lang, userPersona)}
                                </p>
                            </div>
                        </div>
                    </div>
                )}


                {hasDeepAnalysis && (<>
                    {/* Info Sections - Clean Typography */}
                    <div className="space-y-8">
                        {product.productivity && (
                            <div className="space-y-3">
                                <h4 className={clsx(
                                    "text-xs font-medium tracking-[0.2em] uppercase",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    {lang === 'zh' ? '生产力' : 'Productivity'}
                                </h4>
                                <p className={clsx(
                                    "text-lg font-light leading-relaxed",
                                    isDark ? "text-white/80" : "text-black/80"
                                )}>
                                    {product.productivity}
                                </p>
                            </div>
                        )}

                        {product.targetAudience && (
                            <div className="space-y-3">
                                <h4 className={clsx(
                                    "text-xs font-medium tracking-[0.2em] uppercase",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    {lang === 'zh' ? '目标用户' : 'Target Users'}
                                </h4>
                                <p className={clsx(
                                    "text-lg font-light leading-relaxed",
                                    isDark ? "text-white/80" : "text-black/80"
                                )}>
                                    {product.targetAudience}
                                </p>
                            </div>
                        )}

                        {product.aivaReview && (
                            <div className="space-y-3">
                                <h4 className={clsx(
                                    "text-xs font-medium tracking-[0.2em] uppercase",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    {lang === 'zh' ? 'AIVA 评价' : 'AIVA Review'}
                                </h4>
                                <p className={clsx(
                                    "text-lg font-light leading-relaxed",
                                    isDark ? "text-white/80" : "text-black/80"
                                )}>
                                    {product.aivaReview}
                                </p>
                            </div>
                        )}

                        {product.localizationIntel && (
                            <div className="space-y-3">
                                <h4 className={clsx(
                                    "text-xs font-medium tracking-[0.2em] uppercase",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    {lang === 'zh' ? '本土化' : 'Localization'}
                                </h4>
                                <p className={clsx(
                                    "text-lg font-light leading-relaxed",
                                    isDark ? "text-white/80" : "text-black/80"
                                )}>
                                    {product.localizationIntel}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Tactical Analysis - Emphasized */}
                    {product.tacticalAnalysis && (
                        <div className={clsx(
                            "py-12 px-8 border-l-2",
                            isDark ? "border-white/20" : "border-black/20"
                        )}>
                            <h4 className={clsx(
                                "text-xs font-medium tracking-[0.2em] uppercase mb-6",
                                isDark ? "text-white/40" : "text-black/40"
                            )}>
                                {lang === 'zh' ? '战术分析' : 'Tactical Analysis'}
                            </h4>
                            <p className={clsx(
                                "text-xl font-light leading-relaxed italic",
                                isDark ? "text-white/90" : "text-black/90"
                            )}>
                                {product.tacticalAnalysis}
                            </p>
                        </div>
                    )}

                    {/* User Intel - Footnote */}
                    {product.userIntel && (
                        <div className={clsx(
                            "pt-8 border-t",
                            isDark ? "border-white/10" : "border-black/10"
                        )}>
                            <h4 className={clsx(
                                "text-xs font-medium tracking-[0.2em] uppercase mb-4",
                                isDark ? "text-white/30" : "text-black/30"
                            )}>
                                {lang === 'zh' ? '用户反馈' : 'User Feedback'}
                            </h4>
                            <p className={clsx(
                                "text-sm font-light leading-relaxed",
                                isDark ? "text-white/50" : "text-black/50"
                            )}>
                                {product.userIntel}
                            </p>
                        </div>
                    )}

                </>)
                }


                {/* Community Insights Section — unified with editorial product detail style */}
                {
                    relevantPosts.length > 0 && (
                        <div
                            data-testid="community-insights-unified"
                            className={clsx(
                                "community-insights-unified space-y-8 pt-10 border-t",
                                isDark ? "border-white/10" : "border-black/10"
                            )}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <h2 className={clsx(
                                    "text-xs font-medium tracking-[0.2em] uppercase",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    {lang === 'zh' ? '社区洞察' : 'Community Insights'}
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => navigate('/community')}
                                    className={clsx(
                                        "text-xs font-medium tracking-[0.15em] uppercase transition-colors",
                                        isDark ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
                                    )}
                                >
                                    {lang === 'zh' ? '查看全部' : 'View All'}
                                </button>
                            </div>

                            <div className={clsx(
                                "divide-y",
                                isDark ? "divide-white/10" : "divide-black/10"
                            )}>
                                {relevantPosts.map(post => (
                                    <article key={post.id} className="py-6 first:pt-0 last:pb-0 space-y-3">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={clsx(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                                                    isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/70"
                                                )}>
                                                    {post.userName.charAt(0)}
                                                </div>
                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className={clsx(
                                                            "text-sm font-medium",
                                                            isDark ? "text-white" : "text-black"
                                                        )}>
                                                            {post.userName}
                                                        </span>
                                                        {post.isVerifiedPurchase && (
                                                            <span className={clsx(
                                                                "text-[10px] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full border",
                                                                isDark
                                                                    ? "border-white/15 text-white/45"
                                                                    : "border-black/10 text-black/45"
                                                            )}>
                                                                {lang === 'zh' ? '已购买' : 'Verified'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {post.rating > 0 && (
                                                        <div className="flex items-center gap-0.5" aria-label={`${post.rating}/5`}>
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={10}
                                                                    fill={i < post.rating ? "currentColor" : "none"}
                                                                    className={i < post.rating
                                                                        ? (isDark ? "text-white/70" : "text-black/70")
                                                                        : (isDark ? "text-white/15" : "text-black/15")}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={clsx(
                                                "text-xs font-light shrink-0",
                                                isDark ? "text-white/30" : "text-black/30"
                                            )}>
                                                {post.createdAt}
                                            </span>
                                        </div>

                                        <div className="space-y-2 sm:pl-11">
                                            <h4 className={clsx(
                                                "text-base font-medium leading-snug",
                                                isDark ? "text-white/90" : "text-black/90"
                                            )}>
                                                {post.title}
                                            </h4>
                                            <p className={clsx(
                                                "text-sm font-light leading-relaxed",
                                                isDark ? "text-white/60" : "text-black/60"
                                            )}>
                                                {post.content}
                                            </p>
                                            <div className={clsx(
                                                "flex items-center gap-1.5 text-xs font-light pt-1",
                                                isDark ? "text-white/35" : "text-black/35"
                                            )}>
                                                <Heart size={12} aria-hidden="true" />
                                                <span>{post.helpfulCount}</span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    )
                }
                {/* End Community Insights */}

                {/* Intel Analysis Block */}
                {
                    hasIntelAnalysis && (
                        <div className={clsx(
                            "space-y-8 pt-10 border-t",
                            isDark ? "border-white/10" : "border-black/10"
                        )}>
                            <h3 className={clsx(
                                "text-xs font-medium tracking-[0.2em] uppercase",
                                isDark ? "text-white/40" : "text-black/40"
                            )}>
                                {lang === 'zh' ? '战术分析' : 'Tactical Analysis'}
                            </h3>

                            <div className={clsx(
                                "border-l-2 pl-6 py-1",
                                isDark ? "border-white/20" : "border-black/20"
                            )}>
                                <span className={clsx(
                                    "block mb-3 text-[10px] font-medium tracking-[0.2em] uppercase",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    {lang === 'zh' ? '分析员笔记' : "Officer's Note"}
                                </span>
                                <p className={clsx(
                                    "text-lg font-light leading-relaxed italic",
                                    isDark ? "text-white/85" : "text-black/85"
                                )}>
                                    {product.intelligenceAnalysis || placeholderText}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <h4 className={clsx(
                                        "text-xs font-medium tracking-[0.2em] uppercase",
                                        isDark ? "text-white/40" : "text-black/40"
                                    )}>
                                        {lang === 'zh' ? '产品定位' : 'Strategic Value'}
                                    </h4>
                                    <p className={clsx(
                                        "text-sm font-light leading-relaxed",
                                        isDark ? "text-white/75" : "text-black/75"
                                    )}>{product.localizedDescription?.strategy || placeholderText}</p>
                                </div>
                                <div className="space-y-3">
                                    <h4 className={clsx(
                                        "text-xs font-medium tracking-[0.2em] uppercase",
                                        isDark ? "text-white/40" : "text-black/40"
                                    )}>
                                        {lang === 'zh' ? '性能体验' : 'Performance'}
                                    </h4>
                                    <p className={clsx(
                                        "text-sm font-light leading-relaxed",
                                        isDark ? "text-white/75" : "text-black/75"
                                    )}>{product.localizedDescription?.performance || placeholderText}</p>
                                </div>
                            </div>

                            <div className={clsx(
                                "space-y-3 pt-6 border-t",
                                isDark ? "border-white/10" : "border-black/10"
                            )}>
                                <h4 className={clsx(
                                    "text-xs font-medium tracking-[0.2em] uppercase flex items-center gap-2",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    <AlertTriangle size={12} aria-hidden="true" />
                                    {lang === 'zh' ? '劝退指南' : 'User Pain Points'}
                                </h4>
                                <p className={clsx(
                                    "text-sm font-light leading-relaxed",
                                    isDark ? "text-white/75" : "text-black/75"
                                )}>{product.localizedDescription?.painPoints || placeholderText}</p>
                            </div>
                        </div>
                    )
                }

                {/* User Reviews */}
                {
                    hasUserReviews && (
                        <div className={clsx(
                            "space-y-8 pt-10 border-t",
                            isDark ? "border-white/10" : "border-black/10"
                        )}>
                            <h3 className={clsx(
                                "text-xs font-medium tracking-[0.2em] uppercase",
                                isDark ? "text-white/40" : "text-black/40"
                            )}>
                                {lang === 'zh' ? '用户情报' : 'User Intelligence'}
                            </h3>
                            <div className={clsx(
                                "divide-y",
                                isDark ? "divide-white/10" : "divide-black/10"
                            )}>
                                {product.userReviews!.map((review, idx) => (
                                    <article key={idx} className="py-6 first:pt-0 last:pb-0 space-y-3">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={clsx(
                                                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                                                    isDark ? "bg-white/10 text-white/80" : "bg-black/5 text-black/70"
                                                )}>
                                                    {review.userName.charAt(0)}
                                                </div>
                                                <div className="min-w-0 space-y-1">
                                                    <span className={clsx(
                                                        "text-sm font-medium",
                                                        isDark ? "text-white" : "text-black"
                                                    )}>{review.userName}</span>
                                                    <div className="flex items-center gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={10}
                                                                fill={i < review.rating ? "currentColor" : "none"}
                                                                className={i < review.rating
                                                                    ? (isDark ? "text-white/70" : "text-black/70")
                                                                    : (isDark ? "text-white/15" : "text-black/15")}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={clsx(
                                                "text-xs font-light shrink-0",
                                                isDark ? "text-white/30" : "text-black/30"
                                            )}>{review.date || '—'}</span>
                                        </div>
                                        <p className={clsx(
                                            "text-sm font-light leading-relaxed sm:pl-11",
                                            isDark ? "text-white/70" : "text-black/70"
                                        )}>
                                            {review.content}
                                        </p>
                                        {review.tags && review.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 sm:pl-11">
                                                {review.tags.map(tag => (
                                                    <span key={tag} className={clsx(
                                                        "text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-full border",
                                                        isDark
                                                            ? "border-white/10 text-white/45"
                                                            : "border-black/10 text-black/45"
                                                    )}>
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* Right Column: Specs & Acquisition (5 cols) */}
                <div className="lg:col-span-5 space-y-8">
                {/* Features & Specs - Minimalist */}
                {
                    (hasFeatures || hasSpecs) && (
                        <div
                            id="acquisition-channels"
                            className="space-y-6"
                        >
                            <h3 className={clsx(
                                "text-xs font-medium tracking-[0.2em] uppercase",
                                isDark ? "text-white/40" : "text-black/40"
                            )}>
                                {lang === 'zh' ? '规格参数' : 'Specifications'}
                            </h3>

                            {hasFeatures && (
                                <div className="space-y-3">
                                    {product.features!.map((feature, idx) => (
                                        <div key={idx} className="flex gap-3">
                                            <div className={clsx(
                                                "w-1 h-1 rounded-full mt-2 flex-shrink-0",
                                                "bg-blue-500"
                                            )} />
                                            <p className={clsx(
                                                "text-sm font-light leading-relaxed",
                                                isDark ? "text-white/70" : "text-black/70"
                                            )}>
                                                {feature}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {hasSpecs && (
                                <div className={clsx(
                                    "pt-6 border-t space-y-2",
                                    isDark ? "border-white/10" : "border-black/10"
                                )}>
                                    {detail.specs!.map((spec, idx) => (
                                        <div key={idx} className={clsx(
                                            "flex justify-between items-baseline py-2 border-b last:border-0",
                                            isDark ? "border-white/5" : "border-black/5"
                                        )}>
                                            <span className={clsx(
                                                "text-xs font-light",
                                                isDark ? "text-white/40" : "text-black/40"
                                            )}>
                                                {spec.label}
                                            </span>
                                            <span className={clsx(
                                                "text-sm font-light tabular-nums",
                                                isDark ? "text-white" : "text-black"
                                            )}>
                                                {spec.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }

                {/* Acquisition Channels - With Details */}
                {
                    hasChannels && (
                        <div className={clsx(
                            "space-y-6 p-6 rounded-2xl border",
                            isDark ? "bg-white/[0.02] border-white/10" : "bg-black/[0.02] border-black/10"
                        )}>
                            <div className="space-y-2">
                                <h3 className={clsx(
                                    "text-xs font-medium tracking-[0.2em] uppercase",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    {lang === 'zh' ? '购买渠道' : 'Where to Buy'}
                                </h3>
                                <p className={clsx(
                                    "text-sm font-light",
                                    isDark ? "text-white/50" : "text-black/50"
                                )}>
                                    {lang === 'zh' ? '官方授权渠道' : 'Official channels'}
                                </p>
                            </div>

                            <div className="space-y-3">
                                {purchaseChannels.map((channel, idx) => (
                                    <div
                                        key={idx}
                                        className={clsx(
                                            "group",
                                            !channel.isOfficial && "opacity-40"
                                        )}
                                    >
                                        <button
                                            onClick={() => channel.isOfficial && openCheckoutModal(channel, 'list')}
                                            disabled={!channel.isOfficial}
                                            className={clsx(
                                                "w-full text-left transition-all",
                                                channel.isOfficial
                                                    ? "cursor-pointer"
                                                    : "cursor-not-allowed"
                                            )}
                                        >
                                            <div className={clsx(
                                                "p-4 rounded-xl transition-all border",
                                                isDark ? "border-white/10 hover:border-white/20 hover:bg-white/5" : "border-black/10 hover:border-black/20 hover:bg-black/5",
                                                channel.isOfficial && "group-hover:scale-[1.01]"
                                            )}>
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={clsx(
                                                            "text-lg font-light",
                                                            isDark ? "text-white" : "text-black"
                                                        )}>
                                                            {channel.name}
                                                        </div>
                                                        {channel.isOfficial && (
                                                            <div className={clsx(
                                                                "px-2.5 py-1 text-[10px] font-medium tracking-wider uppercase rounded-full",
                                                                isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-500/10 text-blue-600"
                                                            )}>
                                                                {lang === 'zh' ? '官方' : 'Official'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {channel.price && (
                                                            <span className={clsx(
                                                                "text-base font-light tabular-nums",
                                                                isDark ? "text-white/80" : "text-black/80"
                                                            )}>
                                                                {channel.price}
                                                            </span>
                                                        )}
                                                        {channel.isOfficial && (
                                                            <ExternalLink
                                                                size={16}
                                                                className={clsx(
                                                                    "transition-all",
                                                                    isDark ? "text-white/40 group-hover:text-white/60" : "text-black/40 group-hover:text-black/60",
                                                                    "group-hover:translate-x-1"
                                                                )}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Features (Pros) */}
                                                {channel.pros && channel.pros.length > 0 && (
                                                    <div className="mb-3 flex flex-wrap gap-2">
                                                        {channel.pros.map((feature, fIdx) => (
                                                            <span
                                                                key={fIdx}
                                                                className={clsx(
                                                                    "text-xs font-light px-2 py-1 rounded",
                                                                    isDark ? "bg-white/5 text-white/60" : "bg-black/5 text-black/60"
                                                                )}
                                                            >
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Rating (Score 1-10 -> 5 stars) */}
                                                {channel.score !== undefined && (
                                                    <div className={clsx(
                                                        "flex items-center gap-3 pt-3 border-t",
                                                        isDark ? "border-white/10" : "border-black/10"
                                                    )}>
                                                        <span className={clsx(
                                                            "text-xs font-light",
                                                            isDark ? "text-white/40" : "text-black/40"
                                                        )}>
                                                            {lang === 'zh' ? '评分' : 'Rating'}
                                                        </span>
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={clsx(
                                                                        "w-1.5 h-1.5 rounded-full",
                                                                        i < (channel.score / 2)
                                                                            ? "bg-blue-500"
                                                                            : (isDark ? "bg-white/20" : "bg-black/20")
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className={clsx(
                                                            "text-xs font-light tabular-nums",
                                                            isDark ? "text-white/60" : "text-black/60"
                                                        )}>
                                                            {channel.score}/10
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
        {isMounted && isCheckoutOpen && pendingChannel && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                <div className={clsx(
                    "w-full max-w-md max-h-[80vh] rounded-2xl p-5 flex flex-col",
                    isDark ? "bg-[#111] border border-white/10 text-white" : "bg-white border border-black/10 text-black"
                )}>
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-[0.2em] opacity-60">
                            {lang === 'zh' ? '下单前的小提示' : 'Aiva pre‑order check'}
                        </p>
                        <h3 className="text-lg font-semibold">
                            {product.brand} {product.name}
                        </h3>
                        <p className="text-sm opacity-70">
                            {lang === 'zh'
                                ? `当前渠道：${pendingChannel.name} · 预计到手 ${pendingChannel.price}`
                                : `Channel: ${pendingChannel.name} · Est. price ${pendingChannel.price}`}
                        </p>
                    </div>

                    <div className={clsx(
                        "mt-3 p-3 rounded-xl text-xs space-y-2 flex-1 overflow-y-auto",
                        isDark ? "bg-white/5" : "bg-black/5"
                    )}>
                        <div className="flex items-center justify-between">
                            <span className="font-medium">
                                {lang === 'zh' ? '支持的支付方式' : 'Supported payments'}
                            </span>
                            <span className="font-mono text-[11px] opacity-80">
                                {pendingChannel.paymentMethods.join(' / ')}
                            </span>
                        </div>
                        <p className="opacity-80">
                            {pendingChannel.shippingInfo}
                        </p>
                        <div className="border-t border-white/10 dark:border-black/10 pt-2 mt-2">
                            <span className="block text-[11px] font-semibold mb-1">
                                {lang === 'zh' ? 'Aiva 提醒' : 'Aiva note'}
                            </span>
                            <p className="text-[11px] opacity-80 leading-relaxed">
                                {lang === 'zh'
                                    ? (product.riskLevel === 'Critical'
                                        ? '这款产品在激活、退货和售后流程上存在一定不确定性，更适合愿意折腾、能接受试错成本的用户；下单前请确认你可以接受这些变量。'
                                        : product.survivalRate !== undefined && product.survivalRate < 40
                                            ? '在中国大陆环境下，本土化生存率偏低，更适合作为体验新品的玩具型设备，不太建议作为日常主力生产力工具。'
                                            : '整体适配度尚可，下单前建议再确认一次保修条款、税费说明以及预计物流时效。')
                                    : (product.riskLevel === 'Critical'
                                        ? 'Higher uncertainty around activation, returns and support. Best for power users who are comfortable with extra troubleshooting.'
                                        : product.survivalRate !== undefined && product.survivalRate < 40
                                            ? 'Localization score is on the low side – better treated as an early‑adopter toy than a primary work device.'
                                            : 'Overall fit looks reasonable; still double‑check warranty, duties and shipping time before confirming your order.')}
                            </p>
                        </div>
                    </div>

                    <p className="mt-3 text-[11px] opacity-60">
                        {lang === 'zh'
                            ? '点击「前往下单」后，我们会在新标签页打开对应平台的下单或商品页面。后续的登录、选择规格与支付流程都在对方网站内完成。'
                            : 'After you click "Proceed to order", Aiva opens the partner site in a new tab. All sign‑in, configuration and payment steps happen on their side.'}
                    </p>

                    <div className="mt-3 flex gap-3 justify-end pt-1">
                        <button
                            type="button"
                            onClick={() => {
                                setIsCheckoutOpen(false);
                                setPendingChannel(null);
                            }}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm border",
                                isDark ? "border-white/20 text-white/70 hover:bg-white/10" : "border-black/20 text-black/70 hover:bg-black/5"
                            )}
                        >
                            {lang === 'zh' ? '返回修改' : 'Go back'}
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmCheckout}
                            className={clsx(
                                "px-5 py-2 rounded-full text-sm font-semibold flex items-center gap-2",
                                isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-900"
                            )}
                        >
                            <ShoppingBag size={16} />
                            {lang === 'zh' ? '前往下单' : 'Proceed to order'}
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )}
        </div>
    );
};
