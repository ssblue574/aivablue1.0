import React, { useState } from 'react';
import { ArrowLeft, Zap, TrendingUp, Clock, Eye, Heart, Share2, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { Product } from '../data';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';

interface TrendingViewProps {
    t: (key: any) => string;
    products: Product[];
    onViewProduct?: (product: Product) => void;
    lang?: string;
}

export const TrendingView: React.FC<TrendingViewProps> = ({
    t,
    products,
    onViewProduct,
    lang = 'zh'
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const isZh = lang === 'zh';
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        { id: 'all', label: isZh ? '全部' : 'All' },
        { id: 'ai', label: isZh ? 'AI 硬件' : 'AI Hardware' },
        { id: 'wearable', label: isZh ? '可穿戴' : 'Wearables' },
        { id: 'audio', label: isZh ? '音频' : 'Audio' },
        { id: 'smart-home', label: isZh ? '智能家居' : 'Smart Home' },
    ];

    const trendingProducts = products.slice(0, 12).map((p, i) => ({
        ...p,
        rank: i + 1,
        trend: Math.random() > 0.3 ? 'up' : 'stable',
        heat: Math.floor(Math.random() * 5000) + 1000,
        releaseDate: `2025-${String(Math.floor(Math.random() * 3) + 10).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    }));

    return (
        <div className={clsx("min-h-screen", isDark ? "bg-black text-white" : "bg-[#fafafa] text-black")}>
            {/* Header */}
            <div className={clsx(
                "sticky top-14 z-40 backdrop-blur-xl border-b",
                isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-gray-200"
            )}>
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/community')}
                            className={clsx(
                                "relative z-20 shrink-0 p-2 rounded-full transition-colors",
                                isDark ? "hover:bg-white/10" : "hover:bg-gray-100"
                            )}
                            aria-label={isZh ? '返回' : 'Back'}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                <Zap size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">{isZh ? '热门新品' : 'Trending Drops'}</h1>
                                <p className={clsx("text-xs", isDark ? "text-gray-400" : "text-gray-500")}>
                                    {isZh ? '本周最火爆的硬件新品' : 'This weeks hottest hardware'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={clsx(
                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                                selectedCategory === cat.id
                                    ? "bg-orange-500 text-white"
                                    : isDark 
                                        ? "bg-white/5 text-white/70 hover:bg-white/10" 
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-6xl mx-auto px-4 pb-12">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {trendingProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => onViewProduct && onViewProduct(product)}
                            className={clsx(
                                "group rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1",
                                isDark 
                                    ? "bg-[#1a1a1a] hover:bg-[#222]" 
                                    : "bg-white shadow-sm hover:shadow-lg"
                            )}
                        >
                            {/* Image */}
                            <div className="relative aspect-square">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Rank Badge */}
                                <div className={clsx(
                                    "absolute top-3 left-3 px-2 py-1 rounded-lg font-bold text-sm",
                                    product.rank <= 3 
                                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                                        : isDark ? "bg-black/60 text-white" : "bg-white/90 text-black"
                                )}>
                                    #{product.rank}
                                </div>
                                {/* Trend Indicator */}
                                {product.trend === 'up' && (
                                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-green-500/20 text-green-500 text-xs font-medium flex items-center gap-1">
                                        <TrendingUp size={12} />
                                        {isZh ? '热度上升' : 'Rising'}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <p className={clsx("text-xs mb-1", isDark ? "text-gray-400" : "text-gray-500")}>
                                    {product.brand}
                                </p>
                                <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">
                                    {product.name}
                                </h3>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1 text-orange-500">
                                        <Eye size={12} />
                                        <span>{product.heat.toLocaleString()}</span>
                                    </div>
                                    <div className={clsx("flex items-center gap-1", isDark ? "text-gray-400" : "text-gray-500")}>
                                        <Clock size={12} />
                                        <span>{product.releaseDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

