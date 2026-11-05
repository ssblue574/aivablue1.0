import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../data';
import { Award, Calendar, User, DollarSign, Newspaper, Clock, Sparkles, X, ChevronLeft, ChevronRight, History, Star, Globe, Lightbulb, BookOpen, Quote } from 'lucide-react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

interface MilestonesViewProps {
    t: (key: any) => string;
    milestones: Product[];
    onViewProduct: (product: Product) => void;
}

export const MilestonesView: React.FC<MilestonesViewProps> = ({ t, milestones, onViewProduct }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [selectedMilestone, setSelectedMilestone] = useState<Product | null>(null);
    const [heroIndex, setHeroIndex] = useState(0);

    // Shuffle array using Fisher-Yates algorithm with seed
    const shuffleArray = <T,>(array: T[], seed: number): T[] => {
        const shuffled = [...array];
        let m = shuffled.length;
        while (m) {
            const i = Math.floor((seed = (seed * 9301 + 49297) % 233280) / 233280 * m--);
            [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
        }
        return shuffled;
    };

    // Randomize milestones (use date as seed for consistent shuffle per session)
    const shuffledMilestones = useMemo(() => {
        const seed = new Date().getDate();
        return shuffleArray(milestones, seed);
    }, [milestones]);

    // Pick a random hero (featured) milestone
    const heroMilestone = useMemo(() => {
        if (shuffledMilestones.length === 0) return null;
        return shuffledMilestones[heroIndex % shuffledMilestones.length];
    }, [shuffledMilestones, heroIndex]);

    // Rest of milestones (excluding hero)
    const gridMilestones = useMemo(() => {
        if (!heroMilestone) return shuffledMilestones;
        return shuffledMilestones.filter(m => m.id !== heroMilestone.id);
    }, [shuffledMilestones, heroMilestone]);

    // Random sizes for masonry effect
    const getSizeClass = (index: number): string => {
        const sizes = [
            'col-span-1 row-span-1',
            'col-span-1 row-span-2',
            'col-span-2 row-span-1',
            'col-span-1 row-span-1',
            'col-span-1 row-span-1',
            'col-span-2 row-span-2',
        ];
        return sizes[index % sizes.length];
    };

    const getYearFromDate = (dateStr: string) => {
        return new Date(dateStr).getFullYear();
    };

    // Navigate hero
    const nextHero = () => setHeroIndex((prev) => (prev + 1) % shuffledMilestones.length);
    const prevHero = () => setHeroIndex((prev) => (prev - 1 + shuffledMilestones.length) % shuffledMilestones.length);

    // Auto-rotate hero
    useEffect(() => {
        const interval = setInterval(nextHero, 8000);
        return () => clearInterval(interval);
    }, [shuffledMilestones.length]);

    if (!milestones.length) {
        return (
            <div className={clsx("min-h-screen flex items-center justify-center", isDark ? "bg-black text-white" : "bg-gray-50 text-black")}>
                <p className="text-lg">No milestones found</p>
            </div>
        );
    }

    return (
        <div className={clsx("min-h-screen pb-20", isDark ? "bg-black" : "bg-[#fafafa]")}>
            {/* Hero Section - Featured Milestone with Full Background */}
            {heroMilestone && (
                <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                        style={{ backgroundImage: `url(${heroMilestone.imageUrl})` }}
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                    
                    {/* Noise texture */}
                    <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
                    }} />

                    {/* Content */}
                    <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
                        {/* Badge */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-4 py-2 bg-amber-500 text-black font-bold text-sm rounded-full flex items-center gap-2">
                                <Award size={16} />
                                {t('home_date_format') === 'zh-CN' ? '今日聚焦' : 'FEATURED'}
                            </div>
                            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white font-mono text-sm rounded-full">
                                {getYearFromDate(heroMilestone.launchDate)}
                            </span>
                        </div>

                        {/* Title */}
                        <p className="text-amber-400 text-xl font-medium mb-2">{heroMilestone.brand}</p>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
                            {heroMilestone.name}
                        </h1>
                        <p className="text-white/70 text-xl md:text-2xl max-w-2xl mb-8 leading-relaxed">
                            {heroMilestone.legacyImpact || heroMilestone.description}
                        </p>

                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-6 text-white/60 text-sm">
                            {heroMilestone.inventor && (
                                <div className="flex items-center gap-2">
                                    <User size={16} />
                                    <span>{heroMilestone.inventor}</span>
                                </div>
                            )}
                            {heroMilestone.originalPrice && (
                                <div className="flex items-center gap-2">
                                    <DollarSign size={16} />
                                    <span>{heroMilestone.originalPrice}</span>
                                </div>
                            )}
                        </div>

                        {/* View Details Button */}
                        <button
                            onClick={() => setSelectedMilestone(heroMilestone)}
                            className="mt-8 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-amber-400 transition-colors w-fit"
                        >
                            {t('home_date_format') === 'zh-CN' ? '查看详情' : 'View Details'}
                        </button>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="absolute bottom-8 right-8 flex gap-3 z-20">
                        <button
                            onClick={prevHero}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center text-white"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextHero}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center text-white"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div 
                            className="h-full bg-amber-500 transition-all duration-300"
                            style={{ width: `${((heroIndex + 1) / shuffledMilestones.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Stats Bar */}
            <div className={clsx(
                "border-y",
                isDark ? "bg-[#111] border-white/10" : "bg-white border-black/10"
            )}>
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-12">
                    <div className="text-center">
                        <div className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-black")}>
                            {milestones.length}+
                        </div>
                        <div className={clsx("text-sm", isDark ? "text-white/50" : "text-black/50")}>
                            {t('home_date_format') === 'zh-CN' ? '经典产品' : 'Classic Products'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className={clsx("text-3xl font-bold", isDark ? "text-white" : "text-black")}>
                            50+
                        </div>
                        <div className={clsx("text-sm", isDark ? "text-white/50" : "text-black/50")}>
                            {t('home_date_format') === 'zh-CN' ? '年科技史' : 'Years of Tech'}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className={clsx("text-3xl font-bold text-amber-500")}>
                            ∞
                        </div>
                        <div className={clsx("text-sm", isDark ? "text-white/50" : "text-black/50")}>
                            {t('home_date_format') === 'zh-CN' ? '改变世界' : 'World Changed'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Masonry Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-black")}>
                        {t('home_date_format') === 'zh-CN' ? '时光长廊' : 'Hall of Fame'}
                    </h2>
                    <span className={clsx("text-sm", isDark ? "text-white/40" : "text-black/40")}>
                        {t('home_date_format') === 'zh-CN' ? '随机排列 · 点击探索' : 'Randomly arranged · Click to explore'}
                    </span>
                </div>

                {/* Masonry Grid with random sizes */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[180px]">
                    {gridMilestones.map((milestone, index) => (
                        <button
                            key={milestone.id}
                            onClick={() => setSelectedMilestone(milestone)}
                            className={clsx(
                                "group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:z-10",
                                getSizeClass(index)
                            )}
                        >
                            {/* Background Image */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${milestone.imageUrl})` }}
                            />
                            
                            {/* Overlay */}
                            <div className={clsx(
                                "absolute inset-0 transition-opacity duration-300",
                                "bg-gradient-to-t from-black via-black/40 to-transparent",
                                "group-hover:opacity-90"
                            )} />

                            {/* Year Badge */}
                            <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500/90 text-black text-xs font-bold rounded-md">
                                {getYearFromDate(milestone.launchDate)}
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                                <p className="text-amber-400/80 text-xs font-medium mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {milestone.brand}
                                </p>
                                <h3 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-2">
                                    {milestone.name}
                                </h3>
                                <p className="text-white/60 text-xs mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {milestone.category}
                                </p>
                            </div>

                            {/* Hover Border */}
                            <div className="absolute inset-0 border-2 border-amber-500/0 group-hover:border-amber-500/50 rounded-2xl transition-colors" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Detail Modal */}
            {selectedMilestone && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedMilestone(null)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                    
                    {/* Modal */}
                    <div 
                        className={clsx(
                            "relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl",
                            isDark ? "bg-[#111]" : "bg-white"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedMilestone(null)}
                            className={clsx(
                                "absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                                "bg-black/50 hover:bg-black/70 text-white"
                            )}
                        >
                            <X size={20} />
                        </button>

                        {/* Hero Image */}
                        <div className="relative aspect-video overflow-hidden rounded-t-3xl">
                            <img 
                                src={selectedMilestone.imageUrl} 
                                alt={selectedMilestone.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                            
                            {/* Year Badge */}
                            <div className="absolute top-6 left-6">
                                <span className="px-4 py-2 bg-amber-500 text-black font-bold text-sm rounded-full flex items-center gap-2">
                                    <Calendar size={14} />
                                    {getYearFromDate(selectedMilestone.launchDate)}
                                </span>
                            </div>

                            {/* Title Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <p className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-2">
                                    {selectedMilestone.brand}
                                </p>
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                    {selectedMilestone.name}
                                </h2>
                                <p className="text-white/70 text-lg max-w-2xl">
                                    {selectedMilestone.description}
                                </p>
                            </div>
                        </div>

                        {/* Info Content */}
                        <div className="p-8">
                            {/* Key Facts Header */}
                            <div className="flex items-center gap-2 mb-6">
                                <BookOpen size={18} className="text-amber-500" />
                                <h3 className={clsx(
                                    "text-lg font-bold",
                                    isDark ? "text-white" : "text-black"
                                )}>
                                    {t('home_date_format') === 'zh-CN' ? '档案资料' : 'Historical Record'}
                                </h3>
                            </div>

                            {/* Info Cards - 4 columns */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {/* Inventor */}
                                {selectedMilestone.inventor && (
                                    <div className={clsx(
                                        "p-5 rounded-2xl border",
                                        isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                                    )}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <User size={16} className="text-amber-500" />
                                            <span className={clsx(
                                                "text-[10px] font-bold uppercase tracking-wider",
                                                isDark ? "text-white/50" : "text-black/50"
                                            )}>
                                                {t('home_date_format') === 'zh-CN' ? '发明者/创始人' : 'Inventor'}
                                            </span>
                                        </div>
                                        <p className={clsx(
                                            "font-semibold text-sm",
                                            isDark ? "text-white" : "text-black"
                                        )}>
                                            {selectedMilestone.inventor}
                                        </p>
                                    </div>
                                )}

                                {/* Original Price */}
                                {selectedMilestone.originalPrice && (
                                    <div className={clsx(
                                        "p-5 rounded-2xl border",
                                        isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                                    )}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <DollarSign size={16} className="text-amber-500" />
                                            <span className={clsx(
                                                "text-[10px] font-bold uppercase tracking-wider",
                                                isDark ? "text-white/50" : "text-black/50"
                                            )}>
                                                {t('home_date_format') === 'zh-CN' ? '发行价格' : 'Original Price'}
                                            </span>
                                        </div>
                                        <p className={clsx(
                                            "font-semibold text-sm",
                                            isDark ? "text-white" : "text-black"
                                        )}>
                                            {selectedMilestone.originalPrice}
                                        </p>
                                    </div>
                                )}

                                {/* Launch Date */}
                                <div className={clsx(
                                    "p-5 rounded-2xl border",
                                    isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                                )}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Calendar size={16} className="text-amber-500" />
                                        <span className={clsx(
                                            "text-[10px] font-bold uppercase tracking-wider",
                                            isDark ? "text-white/50" : "text-black/50"
                                        )}>
                                            {t('home_date_format') === 'zh-CN' ? '发布日期' : 'Launch Date'}
                                        </span>
                                    </div>
                                    <p className={clsx(
                                        "font-semibold text-sm",
                                        isDark ? "text-white" : "text-black"
                                    )}>
                                        {selectedMilestone.launchDate}
                                    </p>
                                </div>

                                {/* Category */}
                                <div className={clsx(
                                    "p-5 rounded-2xl border",
                                    isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                                )}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Award size={16} className="text-amber-500" />
                                        <span className={clsx(
                                            "text-[10px] font-bold uppercase tracking-wider",
                                            isDark ? "text-white/50" : "text-black/50"
                                        )}>
                                            {t('home_date_format') === 'zh-CN' ? '产品类别' : 'Category'}
                                        </span>
                                    </div>
                                    <p className={clsx(
                                        "font-semibold text-sm",
                                        isDark ? "text-white" : "text-black"
                                    )}>
                                        {selectedMilestone.category}
                                    </p>
                                </div>
                            </div>

                            {/* Legacy Impact - Highlighted Section */}
                            {selectedMilestone.legacyImpact && (
                                <div className={clsx(
                                    "p-6 rounded-2xl border mb-8 relative overflow-hidden",
                                    "bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-red-500/5 border-amber-500/30"
                                )}>
                                    {/* Decorative Quote */}
                                    <Quote size={60} className="absolute -top-2 -left-2 text-amber-500/10" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Lightbulb size={18} className="text-amber-500" />
                                            <span className="text-sm font-bold uppercase tracking-wider text-amber-500">
                                                {t('home_date_format') === 'zh-CN' ? '历史影响与意义' : 'Historical Impact'}
                                            </span>
                                        </div>
                                        <p className={clsx(
                                            "text-lg leading-relaxed font-medium",
                                            isDark ? "text-white" : "text-black"
                                        )}>
                                            {selectedMilestone.legacyImpact}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Historical News Timeline */}
                            {selectedMilestone.historicalNews && selectedMilestone.historicalNews.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Newspaper size={18} className="text-amber-500" />
                                        <h3 className={clsx(
                                            "text-sm font-bold uppercase tracking-wider",
                                            isDark ? "text-white/70" : "text-black/70"
                                        )}>
                                            {t('home_date_format') === 'zh-CN' ? '当时的新闻报道' : 'News Coverage at the Time'}
                                        </h3>
                                    </div>

                                    {/* Timeline */}
                                    <div className="relative pl-8 border-l-2 border-amber-500/30 space-y-6">
                                        {selectedMilestone.historicalNews.map((news, index) => (
                                            <div 
                                                key={index}
                                                className="relative"
                                            >
                                                {/* Timeline Dot */}
                                                <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-amber-500 border-4 border-amber-500/20" />
                                                
                                                <div className={clsx(
                                                    "p-4 rounded-xl border transition-colors hover:border-amber-500/50",
                                                    isDark 
                                                        ? "bg-white/5 border-white/10" 
                                                        : "bg-black/5 border-black/10"
                                                )}>
                                                    {/* Date Badge */}
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className={clsx(
                                                            "px-3 py-1 rounded-full text-xs font-bold",
                                                            isDark ? "bg-amber-500/20 text-amber-400" : "bg-amber-500/20 text-amber-600"
                                                        )}>
                                                            {news.date}
                                                        </span>
                                                        <span className={clsx(
                                                            "text-xs",
                                                            isDark ? "text-white/40" : "text-black/40"
                                                        )}>
                                                            {news.source}
                                                        </span>
                                                    </div>
                                                    
                                                    <h4 className={clsx(
                                                        "font-semibold text-base",
                                                        isDark ? "text-white" : "text-black"
                                                    )}>
                                                        {news.headline}
                                                    </h4>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Era Context */}
                            <div className={clsx(
                                "p-5 rounded-2xl border mb-8",
                                isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
                            )}>
                                <div className="flex items-center gap-2 mb-3">
                                    <History size={16} className="text-amber-500" />
                                    <span className={clsx(
                                        "text-xs font-bold uppercase tracking-wider",
                                        isDark ? "text-white/50" : "text-black/50"
                                    )}>
                                        {t('home_date_format') === 'zh-CN' ? '时代背景' : 'Era Context'}
                                    </span>
                                </div>
                                <p className={clsx(
                                    "text-sm leading-relaxed",
                                    isDark ? "text-white/70" : "text-black/70"
                                )}>
                                    {t('home_date_format') === 'zh-CN' 
                                        ? `${getYearFromDate(selectedMilestone.launchDate)} 年，${selectedMilestone.brand} 推出了 ${selectedMilestone.name}，这款产品在 ${selectedMilestone.category} 领域开创了新纪元，成为科技史上的重要里程碑。`
                                        : `In ${getYearFromDate(selectedMilestone.launchDate)}, ${selectedMilestone.brand} introduced the ${selectedMilestone.name}, a groundbreaking ${selectedMilestone.category.toLowerCase()} that would become a defining milestone in tech history.`
                                    }
                                </p>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 pt-6 border-t border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                                <span className={clsx(
                                    "text-xs font-bold uppercase tracking-wider mr-2",
                                    isDark ? "text-white/40" : "text-black/40"
                                )}>
                                    {t('home_date_format') === 'zh-CN' ? '相关标签' : 'Related Tags'}:
                                </span>
                                {selectedMilestone.tags.map(tag => (
                                    <span 
                                        key={tag}
                                        className={clsx(
                                            "px-3 py-1.5 text-xs font-medium rounded-full border",
                                            isDark ? "border-white/10 text-white/60 hover:border-amber-500/50 hover:text-amber-400" : "border-black/10 text-black/60 hover:border-amber-500/50 hover:text-amber-600",
                                            "transition-colors cursor-default"
                                        )}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
