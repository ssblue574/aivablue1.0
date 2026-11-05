import React, { useEffect, useMemo, useState } from 'react';
import { X, ShoppingBag, Check, Play, Globe, Wifi, Shield, Zap, CreditCard, Star, AlertTriangle, Truck, ExternalLink, Lock, Gauge, FileText, Eye, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { Language, Product, ProductDetail, PurchaseChannel } from '../data';
import { FuturisticModal } from './FuturisticModal';

interface ProductDetailModalProps {
    isOpen: boolean;
    product: Product | null;
    related: Product[];
    selectedProducts: Product[];
    onClose: () => void;
    onViewProduct: (product: Product) => void;
    onToggleSelect: (product: Product) => void;
    t: (key: any) => string;
    lang: Language;
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

const getRiskBadge = (level: string | undefined, lang: Language) => {
    if (!level) return null;
    
    const isZh = lang === 'zh';
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
             {/* Glow Effect for low survival */}
             {rate < 40 && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
        </div>
    </div>
);

const ConfidenceMeter: React.FC<{ score: number }> = ({ score }) => (
    <div className="w-full bg-white/10 rounded-none h-2 mt-2 overflow-hidden relative">
        {/* Grid lines on bar */}
        <div className="absolute inset-0 flex justify-between pointer-events-none">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="w-px h-full bg-black/50" />
            ))}
        </div>
        <div 
            className={clsx(
                "h-full transition-all duration-1000 ease-out",
                score > 80 ? "bg-green-500" : score > 50 ? "bg-yellow-400" : "bg-red-500"
            )}
            style={{ width: `${score}%` }}
        />
    </div>
);

const ChannelRow: React.FC<{ channel: PurchaseChannel; lang: Language }> = ({ channel, lang }) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border-l-4 border-blue-500/50 hover:border-blue-500 hover:bg-white/10 transition-all gap-4 group rounded-lg">
        <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-base text-white">{channel.name}</span>
                {channel.isOfficial && (
                    <span className="text-[9px] uppercase px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/50 font-bold tracking-wider rounded">
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
                    <span key={i} className="text-green-400">+{pro}</span>
                ))}
                {channel.cons.map((con, i) => (
                    <span key={i} className="text-red-400">-{con}</span>
                ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-white/50 uppercase tracking-wider">
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
            <span className="text-2xl font-bold text-white">{channel.price}</span>
            <a 
                href={channel.url} 
                target="_blank" 
                rel="noreferrer"
                className="p-2.5 bg-white text-black hover:bg-blue-500 hover:text-white transition-colors rounded-lg"
            >
                <ExternalLink size={18} />
            </a>
        </div>
    </div>
);

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
    isOpen,
    product,
    related,
    selectedProducts,
    onClose,
    onViewProduct,
    onToggleSelect,
    t,
    lang
}) => {
    const detail = useMemo(() => {
        if (!product) return null;
        return product.detail ?? buildFallbackDetail(product, lang);
    }, [product, lang]);

    const mediaItems = useMemo<MediaItem[]>(() => {
        if (!product || !detail) return [];
        return getMediaItems(detail, product.imageUrl);
    }, [detail, product]);

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setActiveIndex(0);
    }, [product?.id]);

    if (!product || !detail) return null;

    const activeMedia = mediaItems[activeIndex] ?? mediaItems[0];
    const isSelected = selectedProducts.some(p => p.id === product.id);

    return (
        <FuturisticModal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="7xl"
            showCloseButton={false}
            closeOnBackdropClick={true}
        >
            <div className="relative w-full h-full md:h-[85vh] flex flex-col overflow-hidden">
                
                {/* Classified Header */}
                <div className="flex justify-between items-center px-6 py-4 bg-black/20 border-b border-white/10 z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-white/70 font-mono tracking-[0.2em] uppercase">
                                    {product.category}
                                </span>
                                {product.riskLevel && getRiskBadge(product.riskLevel, lang)}
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-white uppercase">{product.name}</h2>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                            <div className="text-xl font-bold text-white font-mono">{product.priceEstimate}</div>
                        </div>
                        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                            <X size={24} strokeWidth={1.5} />
                    </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                        
                        {/* Left Column: Visuals & Analysis (7 cols) */}
                        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0A0A0A] p-6 lg:p-8 overflow-y-auto">
                            {/* Main Visual */}
                            <div className="aspect-video bg-black border border-white/10 relative mb-6 group">
                                {/* HUD Overlay */}
                                <div className="absolute inset-0 pointer-events-none border-[0.5px] border-white/5 m-2">
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />
                                    {/* Risk Indicator on Image */}
                                    {product.riskLevel === 'Critical' && (
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-widest animate-pulse">
                                            {lang === 'zh' ? '极高风险' : 'CRITICAL RISK'}
                                        </div>
                                    )}
                                </div>

                                {activeMedia?.type === 'video' ? (
                                    <video
                                        key={activeMedia.url}
                                        className="w-full h-full object-contain"
                                        controls
                                        playsInline
                                        poster={activeMedia.poster || product.imageUrl}
                                    >
                                        <source src={activeMedia.url} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img src={activeMedia?.url || product.imageUrl} alt={product.name} className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
                                )}

                                {product.isInsiderOnly && (
                                    <div className="absolute inset-0 backdrop-blur-md bg-black/60 flex flex-col items-center justify-center text-center p-6 border-2 border-white/10">
                                        <Lock size={48} className="text-white/80 mb-4" />
                                        <h3 className="text-2xl font-bold text-white mb-2 font-mono uppercase tracking-widest">
                                            {lang === 'zh' ? '访问受限' : 'Access Restricted'}
                                        </h3>
                                        <p className="text-white/60 font-mono text-xs mb-6">
                                            {lang === 'zh' ? '需要等级 4 权限' : 'LEVEL 4 CLEARANCE REQUIRED'}
                                        </p>
                                        <button className="bg-white text-black font-bold py-3 px-8 hover:bg-gray-200 transition-colors font-mono text-xs uppercase tracking-widest">
                                            {lang === 'zh' ? '授权访问' : 'Authorize Access'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Media Selector */}
                            {mediaItems.length > 1 && (
                                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                                    {mediaItems.map((media, idx) => (
                                        <button
                                            key={`${media.type}-${idx}`}
                                            onClick={() => setActiveIndex(idx)}
                                            className={clsx(
                                                "w-16 h-12 border transition-all duration-200 focus:outline-none flex-shrink-0 bg-black",
                                                activeIndex === idx ? "border-white opacity-100" : "border-white/10 opacity-50 hover:opacity-100"
                                            )}
                                        >
                                            <img src={media.url} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Survival Rate (Aiva Index) - The "Don't Buy" Signal */}
                            {product.survivalRate !== undefined && (
                                <div className="mb-8">
                                    <div className="flex justify-between items-end mb-2">
                                        <h3 className="text-sm text-white/80">
                                            {lang === 'zh' ? '本土化生存率' : 'Localization Survival Rate'}
                                        </h3>
                                        <span className={clsx("text-xl font-bold font-mono", product.survivalRate < 40 ? "text-red-500" : "text-green-500")}>
                                            {product.survivalRate}%
                                        </span>
                                    </div>
                                    <SurvivalBar rate={product.survivalRate} />
                                    
                                    {/* Key Tags */}
                                    <div className="flex gap-2 mt-4">
                                        {product.survivalRate < 40 && (
                                            <>
                                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-xs text-white/60">
                                                    {lang === 'zh' ? '服务未适配' : 'Service Mismatch'}
                                                </span>
                                                <span className="px-2 py-1 bg-white/5 border border-white/10 text-xs text-white/60">
                                                    {lang === 'zh' ? '语音延迟' : 'Latency'}
                                                </span>
                                            </>
                                        )}
                                        <span className="px-2 py-1 bg-white/5 border border-white/10 text-xs text-white/60">
                                            {lang === 'zh' ? '娱乐性强' : 'Entertaining'}
                                        </span>
                        </div>

                                    {/* AIVA Verdict Quote */}
                                    {product.verdict && (
                                        <div className="mt-6 pt-6 border-t border-white/10">
                                            <p className="text-lg text-white italic font-serif leading-relaxed">
                                                <span className="text-[#0071e3] font-bold not-italic mr-2 font-sans">AIVA:</span>
                                                "{product.verdict}"
                                </p>
                            </div>
                                    )}
                                </div>
                            )}

                            {/* Localization Feature Introduction (New Section) */}
                            {product.chinaAdaptability && lang === 'zh' && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-4">
                                        <Globe size={16} className="text-white/70" />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                                            {lang === 'zh' ? '本土化特别情报' : 'China Focus'}
                                        </h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Wifi size={14} className={product.chinaAdaptability.network.score >= 5 ? "text-green-400" : "text-red-400"} />
                                                <span className="text-xs font-bold text-white/80">网络环境</span>
                                            </div>
                                            <p className="text-xs text-white/60 leading-relaxed">
                                                {product.chinaAdaptability.network.description}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Globe size={14} className={product.chinaAdaptability.language.score >= 5 ? "text-green-400" : "text-red-400"} />
                                                <span className="text-xs font-bold text-white/80">中文支持</span>
                                            </div>
                                            <p className="text-xs text-white/60 leading-relaxed">
                                                {product.chinaAdaptability.language.description}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Shield size={14} className={product.chinaAdaptability.warranty.score >= 5 ? "text-green-400" : "text-red-400"} />
                                                <span className="text-xs font-bold text-white/80">售后保修</span>
                                            </div>
                                            <p className="text-xs text-white/60 leading-relaxed">
                                                {product.chinaAdaptability.warranty.description}
                                            </p>
                                        </div>
                                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Zap size={14} className={product.chinaAdaptability.ecosystem.score >= 5 ? "text-green-400" : "text-red-400"} />
                                                <span className="text-xs font-bold text-white/80">生态适配</span>
                                            </div>
                                            <p className="text-xs text-white/60 leading-relaxed">
                                                {product.chinaAdaptability.ecosystem.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Intel Analysis Block */}
                            {(product.intelligenceAnalysis || product.localizedDescription) && (
                                <div className="mb-8 space-y-6">
                                    <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                                        <Eye size={16} className="text-white/70" />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                                            {lang === 'zh' ? '战术分析' : 'Tactical Analysis'}
                                        </h3>
                            </div>

                                    {product.intelligenceAnalysis && (
                                        <div className="bg-white/5 border-l-2 border-white/30 p-4 text-sm text-white/80 leading-relaxed font-mono">
                                            <span className="text-white/50 block mb-2 text-[10px] uppercase tracking-wider">
                                                {lang === 'zh' ? '分析员笔记:' : "Officer's Note:"}
                                            </span>
                                            "{product.intelligenceAnalysis}"
                                        </div>
                                    )}

                                    {product.localizedDescription && (
                                        <div className="space-y-4">
                                            {/* Strategy & Performance */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-mono">
                                                        {lang === 'zh' ? '产品定位' : 'Strategic Value'}
                                                    </h4>
                                                    <p className="text-sm text-white leading-relaxed">{product.localizedDescription.strategy}</p>
                            </div>
                                                <div>
                                                    <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-mono">
                                                        {lang === 'zh' ? '性能体验' : 'Performance'}
                                                    </h4>
                                                    <p className="text-sm text-white leading-relaxed">{product.localizedDescription.performance}</p>
                        </div>
                    </div>

                                            {/* Pain Points - Highlighted */}
                                            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                                                <h4 className="text-[10px] text-red-400 uppercase tracking-widest mb-2 font-mono flex items-center gap-2">
                                                    <AlertTriangle size={12} />
                                                    {lang === 'zh' ? '劝退指南' : 'User Pain Points'}
                                                </h4>
                                                <p className="text-sm text-white/90 leading-relaxed">{product.localizedDescription.painPoints}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* User Reviews */}
                            {product.userReviews && product.userReviews.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-4">
                                        <Star size={16} className="text-white/70" />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                                            {lang === 'zh' ? '用户情报' : 'User Intelligence'}
                                        </h3>
                                    </div>
                                    <div className="space-y-4">
                                        {product.userReviews.map((review, idx) => (
                                            <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/10">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                                            {review.userName.charAt(0)}
                                                        </div>
                                                        <span className="text-xs font-bold text-white">{review.userName}</span>
                                                    </div>
                                                    <span className="text-[10px] text-white/40 font-mono">{review.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1 mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={10} 
                                                            fill={i < review.rating ? "currentColor" : "none"} 
                                                            className={i < review.rating ? "text-yellow-400" : "text-white/20"} 
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-sm text-white/80 leading-relaxed mb-2">"{review.content}"</p>
                                                {review.tags && (
                                                    <div className="flex gap-2">
                                                        {review.tags.map(tag => (
                                                            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded text-white/60">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                </div>
                            ))}
                        </div>
                    </div>
                            )}
                        </div>

                        {/* Right Column: Specs & Acquisition (5 cols) */}
                        <div className="lg:col-span-5 bg-[#050505] p-6 lg:p-8 flex flex-col overflow-y-auto border-l border-white/10">
                            
                            {/* Features & Specs */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileText size={14} className="text-white/70" />
                                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                                        {lang === 'zh' ? '核心参数与功能' : 'Specs & Features'}
                                    </h3>
                                </div>

                                {/* Features List */}
                                {product.features && (
                                    <div className="mb-6">
                                        <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-mono">
                                            {lang === 'zh' ? '功能亮点' : 'Key Features'}
                                        </h4>
                                        <ul className="space-y-2">
                                            {product.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
                                                    <Check size={14} className="text-green-500 mt-0.5 shrink-0" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Specs List */}
                                {detail.specs && detail.specs.length > 0 && (
                                    <div>
                                        <h4 className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-mono">
                                            {lang === 'zh' ? '技术参数' : 'Technical Specs'}
                                        </h4>
                                        <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                                            {detail.specs.map((spec, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 last:border-0 pb-2 last:pb-0 mb-2 last:mb-0">
                                                    <span className="text-white/50">{spec.label}</span>
                                                    <span className="text-white font-mono font-bold">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Acquisition Channels */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShoppingBag size={14} className="text-white/70" />
                                    <h3 className="text-xs font-bold text-white uppercase tracking-widest">
                                        {lang === 'zh' ? '购买渠道' : 'Acquisition Channels'}
                                    </h3>
                    </div>

                                <div className="space-y-2">
                                    {product.purchaseChannels && product.purchaseChannels.length > 0 ? (
                                        product.purchaseChannels.map((channel, idx) => (
                                            <ChannelRow key={idx} channel={channel} lang={lang} />
                                        ))
                                    ) : (
                                        <div className="p-4 border border-white/10 border-dashed text-center">
                                            <p className="text-xs text-white/40 font-mono uppercase">
                                                {lang === 'zh' ? '暂无购买渠道' : 'No channels found'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Human Service CTA (Replacing generic buttons) */}
                            <div className="mt-auto pt-8 border-t border-white/10">
                                <h3 className="text-sm font-bold text-white mb-3">
                                    {lang === 'zh' ? '找不到想要的评测？' : "Can't find the review you want?"}
                                </h3>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        placeholder={lang === 'zh' ? "输入产品名称，让 Aiva 侦察兵去挖..." : "Enter product name to request intel..."} 
                                        className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-md text-black hover:bg-gray-200 transition-colors">
                                        <Search size={14} />
                                </button>
                                </div>
                                <p className="text-[10px] text-white/40 mt-2 text-center">
                                    {lang === 'zh' 
                                        ? '提交后，我们将启动全球雷达为您生成专属情报报告。' 
                                        : 'We will launch global radar to generate exclusive intelligence reports for you.'}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </FuturisticModal>
    );
};
