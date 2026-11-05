import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Play, Calendar, User, Video, Sparkles, ChevronRight, Clock, ChevronDown, Grid3X3, List, AlertCircle, Search, Heart, Share2, Gauge } from 'lucide-react';
import { clsx } from 'clsx';
import { KeynoteItem, Language } from '../data';
import { useTheme } from '../ThemeContext';
import { storageService } from '../services/storageService';
import { GlassmorphicCard } from './GlassmorphicCard';
import { useInteractionFeedback } from '../hooks/useInteractionFeedback';

interface KeynoteViewProps {
    t: (key: any) => string;
    keynotes: KeynoteItem[];
}

export const KeynoteView: React.FC<KeynoteViewProps> = ({ t, keynotes }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeKeynote, setActiveKeynote] = useState<KeynoteItem | null>(null);
    const [expandedPlaylist, setExpandedPlaylist] = useState(false);
    const [videoLoading, setVideoLoading] = useState(true);
    const [videoError, setVideoError] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [autoPlayNext, setAutoPlayNext] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'replay' | 'upcoming'>('all');
    const [videoFading, setVideoFading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    // 收藏状态
    const [favoriteIds, setFavoriteIds] = useState<string[]>(() => storageService.getKeynoteFavorites());

    // Interaction feedback for playlist items
    const { handleClick, handleMouseEnter, handleMouseLeave } = useInteractionFeedback({
        enableGlow: true,
        glowConfig: { duration: 300 }
    });

    // 视频切换函数（带淡入淡出动画）
    const switchKeynote = (keynote: KeynoteItem) => {
        setVideoFading(true);
        setTimeout(() => {
            setActiveKeynote(keynote);
            setVideoFading(false);
        }, 300); // 300ms fade out, then switch
    };

    // 搜索/筛选功能
    const filteredKeynotes = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        return keynotes.filter(k => {
            const matchText = !query
                || k.title.toLowerCase().includes(query)
                || k.speaker.toLowerCase().includes(query)
                || k.description.toLowerCase().includes(query)
                || k.date.includes(query);
            const isUpcoming = k.preorderStatus === 'announced';
            const matchStatus =
                filterStatus === 'all'
                    ? true
                    : filterStatus === 'upcoming'
                        ? isUpcoming
                        : !isUpcoming;
            return matchText && matchStatus;
        });
    }, [keynotes, searchQuery, filterStatus]);

    useEffect(() => {
        if (filteredKeynotes.length > 0) {
            setActiveKeynote(filteredKeynotes[0]);
            setVideoLoading(true);
            setVideoError(false);
        }
    }, [filteredKeynotes]);

    // 切换视频时恢复播放进度
    useEffect(() => {
        if (activeKeynote && videoRef.current) {
            const progress = storageService.getKeynoteProgress()[activeKeynote.id];
            if (progress && progress > 5) { // 如果进度超过5秒，恢复播放位置
                videoRef.current.currentTime = progress;
            }
            setVideoLoading(true);
            setVideoError(false);
        }
    }, [activeKeynote?.id]);

    // 保存播放进度
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !activeKeynote) return;

        const handleTimeUpdate = () => {
            if (progressSaveTimeoutRef.current) {
                clearTimeout(progressSaveTimeoutRef.current);
            }
            progressSaveTimeoutRef.current = setTimeout(() => {
                storageService.saveKeynoteProgress(activeKeynote.id, video.currentTime);
            }, 1000); // 每秒保存一次
        };

        const handleEnded = () => {
            if (autoPlayNext) {
                const currentIndex = filteredKeynotes.findIndex(k => k.id === activeKeynote.id);
                if (currentIndex < filteredKeynotes.length - 1) {
                    setActiveKeynote(filteredKeynotes[currentIndex + 1]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('ended', handleEnded);
        video.playbackRate = playbackRate;

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('ended', handleEnded);
            if (progressSaveTimeoutRef.current) {
                clearTimeout(progressSaveTimeoutRef.current);
            }
        };
    }, [activeKeynote, playbackRate, autoPlayNext, filteredKeynotes]);

    // 键盘快捷键支持
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!videoRef.current) return;
            
            // 空格：播放/暂停
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                if (videoRef.current.paused) {
                    videoRef.current.play();
                } else {
                    videoRef.current.pause();
                }
            }
            // 左右箭头：快进/快退
            if (e.code === 'ArrowLeft' && e.target === document.body) {
                e.preventDefault();
                videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
            }
            if (e.code === 'ArrowRight' && e.target === document.body) {
                e.preventDefault();
                videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // 收藏功能
    const toggleFavorite = (keynoteId: string) => {
        const updated = storageService.toggleKeynoteFavorite(keynoteId);
        setFavoriteIds(updated);
    };

    // 分享功能
    const handleShare = async (keynote: KeynoteItem) => {
        const shareData = {
            title: keynote.title,
            text: keynote.description,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('分享取消');
            }
        } else {
            // 降级方案：复制链接到剪贴板
            navigator.clipboard.writeText(window.location.href);
            alert(t('home_date_format') === 'zh-CN' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
        }
    };

    if (!activeKeynote) {
        return (
            <div className={clsx("min-h-screen flex items-center justify-center", isDark ? "bg-black" : "bg-gray-50")}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 text-center">
                    <div className={clsx("w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center", isDark ? "bg-white/5" : "bg-gray-100")}>
                        <Video size={40} className={isDark ? "text-white/30" : "text-gray-400"} />
                    </div>
                    <h2 className={clsx("text-4xl font-bold mb-4 tracking-tight", isDark ? "text-white" : "text-black")}>
                        {t('section_keynote_title')}
                    </h2>
                    <p className={clsx("text-lg mb-2", isDark ? "text-white/60" : "text-black/60")}>{t('keynote_empty')}</p>
                    <p className={clsx("text-sm", isDark ? "text-white/40" : "text-gray-500")}>
                        {t('home_date_format') === 'zh-CN' ? '请稍后再来查看最新发布会' : 'Please check back later for the latest keynotes'}
                    </p>
                </div>
            </div>
        );
    }

    const statusBadge = (k: KeynoteItem) => {
        const isZh = t('home_date_format') === 'zh-CN';
        switch (k.preorderStatus) {
            case 'announced':
                return { label: isZh ? '即将开始' : 'Upcoming', color: isDark ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' : 'text-amber-600 bg-amber-100 border-amber-200' };
            case 'preorder':
                return { label: isZh ? '预购中' : 'Preorder', color: isDark ? 'text-blue-300 bg-blue-500/10 border-blue-500/30' : 'text-blue-600 bg-blue-50 border-blue-100' };
            default:
                return { label: isZh ? '已发布' : 'Released', color: isDark ? 'text-green-300 bg-green-500/10 border-green-500/30' : 'text-green-600 bg-green-50 border-green-100' };
        }
    };

    return (
        <div className={clsx("min-h-screen", isDark ? "bg-black" : "bg-gray-50")}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-24">
                {/* Header */}
                <div className="mb-6">
                    <div className="border-l-4 border-[#FF4D00] pl-4 mb-4">
                     <h2 className={clsx("text-3xl font-bold tracking-tight", isDark ? "text-white" : "text-black")}>
                        {t('section_keynote_title')}
                    </h2>
                    <p className={clsx("text-base mt-2", isDark ? "text-white/60" : "text-black/60")}>
                        {t('keynote_intro')}
                    </p>
                    </div>
                    
                    {/* 搜索栏 */}
                    <div className="relative mb-4">
                        <Search size={18} className={clsx("absolute left-3 top-1/2 -translate-y-1/2", isDark ? "text-white/40" : "text-gray-400")} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('home_date_format') === 'zh-CN' ? '搜索发布会、演讲者...' : 'Search keynotes, speakers...'}
                            className={clsx(
                                "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm",
                                isDark 
                                    ? "bg-white/5 border-white/10 text-white placeholder-white/40 focus:border-[#FF4D00] focus:outline-none" 
                                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#FF4D00] focus:outline-none"
                            )}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={clsx("absolute right-3 top-1/2 -translate-y-1/2 text-xs", isDark ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-600")}
                            >
                                清除
                            </button>
                        )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className={clsx("text-sm", isDark ? "text-white/60" : "text-gray-600")}>
                            {searchQuery
                                ? (t('home_date_format') === 'zh-CN'
                                ? `找到 ${filteredKeynotes.length} 个结果` 
                                    : `Found ${filteredKeynotes.length} results`)
                                : (t('home_date_format') === 'zh-CN' ? '按状态筛选：' : 'Filter by status:')}
                        </div>
                        <div className="flex items-center gap-2">
                            {[
                                { id: 'all', label: t('home_date_format') === 'zh-CN' ? '全部' : 'All' },
                                { id: 'upcoming', label: t('home_date_format') === 'zh-CN' ? '即将开始' : 'Upcoming' },
                                { id: 'replay', label: t('home_date_format') === 'zh-CN' ? '已发布' : 'Released' },
                            ].map(btn => (
                                <button
                                    key={btn.id}
                                    onClick={() => setFilterStatus(btn.id as 'all' | 'upcoming' | 'replay')}
                                    className={clsx(
                                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                                        filterStatus === btn.id
                                            ? (isDark ? "bg-white text-black border-white/0" : "bg-black text-white border-black")
                                            : (isDark ? "text-white/60 border-white/10 hover:text-white" : "text-gray-600 border-gray-200 hover:text-black")
                                    )}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Stage */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Player */}
                        <div className={clsx(
                            "relative aspect-video rounded-2xl overflow-hidden shadow-2xl transition-opacity duration-300",
                            isDark ? "bg-[#111]" : "bg-black",
                            videoFading ? "opacity-0" : "opacity-100"
                        )}>
                            {videoError ? (
                                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                                    <AlertCircle size={48} className={clsx("mb-4", isDark ? "text-white/30" : "text-gray-400")} />
                                    <p className={clsx("text-sm font-medium mb-2", isDark ? "text-white/70" : "text-gray-600")}>
                                        {t('home_date_format') === 'zh-CN' ? '视频加载失败' : 'Video failed to load'}
                                    </p>
                                    <p className={clsx("text-xs", isDark ? "text-white/50" : "text-gray-500")}>
                                        {t('home_date_format') === 'zh-CN' ? '请检查网络连接或稍后重试' : 'Please check your connection or try again later'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {videoLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                                            <div className="w-12 h-12 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                            <video
                                        ref={videoRef}
                                key={activeKeynote.videoUrl}
                                className="w-full h-full object-cover"
                                controls
                                poster={activeKeynote.thumbnailUrl}
                                playsInline
                                        onLoadedData={() => setVideoLoading(false)}
                                        onError={() => {
                                            setVideoLoading(false);
                                            setVideoError(true);
                                        }}
                                        onLoadStart={() => setVideoLoading(true)}
                                        aria-label={`${activeKeynote.title} - ${t('home_date_format') === 'zh-CN' ? '视频播放器' : 'Video player'}`}
                            >
                                <source src={activeKeynote.videoUrl} type="video/mp4" />
                                        {t('home_date_format') === 'zh-CN' ? '您的浏览器不支持视频播放' : 'Your browser does not support video playback'}
                            </video>
                                </>
                            )}
                        </div>
                        
                        {/* Info & Meta */}
                        <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm font-medium flex-wrap">
                                <span className="px-3 py-1 bg-[#FF4D00] text-white rounded text-xs font-bold uppercase">
                                    {activeKeynote.stage === 'startup' ? (t('home_date_format') === 'zh-CN' ? '初创首发' : 'STARTUP') : 'KEYNOTE'}
                                </span>
                        <span className={clsx("flex items-center gap-1 rounded-full px-2 py-1 border text-[12px]", statusBadge(activeKeynote).color)}>
                            <Clock size={12} /> {statusBadge(activeKeynote).label}
                        </span>
                                <span className={clsx("flex items-center gap-1", isDark ? "text-white/60" : "text-gray-500")}>
                                    <Calendar size={14} /> {activeKeynote.date}
                                </span>
                                <span className={clsx("flex items-center gap-1", isDark ? "text-white/60" : "text-gray-500")}>
                                    <User size={14} /> {activeKeynote.speaker}
                                </span>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h1 className={clsx("text-xl sm:text-2xl lg:text-3xl font-bold leading-tight mb-2", isDark ? "text-white" : "text-gray-900")}>
                                {activeKeynote.title}
                            </h1>
                            <p className={clsx("text-sm sm:text-base lg:text-lg leading-relaxed", isDark ? "text-white/70" : "text-gray-600")}>
                                {activeKeynote.description}
                            </p>
                                </div>
                                
                                {/* 操作按钮组 */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {/* 收藏按钮 */}
                                    <button
                                        onClick={() => toggleFavorite(activeKeynote.id)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                toggleFavorite(activeKeynote.id);
                                            }
                                        }}
                                        className={clsx(
                                            "p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                                            favoriteIds.includes(activeKeynote.id)
                                                ? "bg-[#FF4D00] text-white"
                                                : isDark 
                                                    ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white" 
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        )}
                                        title={favoriteIds.includes(activeKeynote.id) 
                                            ? (t('home_date_format') === 'zh-CN' ? '取消收藏' : 'Unfavorite')
                                            : (t('home_date_format') === 'zh-CN' ? '收藏' : 'Favorite')}
                                    >
                                        <Heart size={18} fill={favoriteIds.includes(activeKeynote.id) ? "currentColor" : "none"} />
                                    </button>
                                    
                                    {/* 分享按钮 */}
                                    <button
                                        onClick={() => handleShare(activeKeynote)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleShare(activeKeynote);
                                            }
                                        }}
                                        className={clsx(
                                            "p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                                            isDark 
                                                ? "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white" 
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        )}
                                        title={t('home_date_format') === 'zh-CN' ? '分享' : 'Share'}
                                        aria-label={t('home_date_format') === 'zh-CN' ? '分享视频' : 'Share video'}
                                    >
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            {/* 播放控制选项 - 使用玻璃态效果 */}
                            <GlassmorphicCard blur={15} opacity={0.08} className="p-3">
                                <div className="flex items-center gap-4">
                                    {/* 播放速度 */}
                                    <div className="flex items-center gap-2">
                                        <Gauge size={14} className={clsx(isDark ? "text-white/60" : "text-gray-500")} />
                                        <span className={clsx("text-xs", isDark ? "text-white/60" : "text-gray-500")}>
                                            {t('home_date_format') === 'zh-CN' ? '速度' : 'Speed'}:
                                        </span>
                                        <select
                                            value={playbackRate}
                                            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                                            className={clsx(
                                                "text-xs px-2 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 dark:focus:ring-offset-gray-900",
                                                isDark 
                                                    ? "bg-white/5 border-white/10 text-white" 
                                                    : "bg-white border-gray-200 text-gray-900"
                                            )}
                                            aria-label={t('home_date_format') === 'zh-CN' ? '播放速度' : 'Playback speed'}
                                        >
                                            <option value="0.5">0.5x</option>
                                            <option value="0.75">0.75x</option>
                                            <option value="1">1x</option>
                                            <option value="1.25">1.25x</option>
                                            <option value="1.5">1.5x</option>
                                            <option value="2">2x</option>
                                        </select>
                                    </div>
                                    
                                    {/* 自动播放下一集 */}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={autoPlayNext}
                                            onChange={(e) => setAutoPlayNext(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#FF4D00] focus:ring-2 focus:ring-[#FF4D00] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                                            aria-label={t('home_date_format') === 'zh-CN' ? '自动播放下一集' : 'Auto play next'}
                                        />
                                        <span className={clsx("text-xs", isDark ? "text-white/60" : "text-gray-500")}>
                                            {t('home_date_format') === 'zh-CN' ? '自动播放下一集' : 'Auto play next'}
                                        </span>
                                    </label>
                                </div>
                            </GlassmorphicCard>
                        </div>

                        {/* Commercial / Preorder Box */}
                        <div className={clsx(
                            "rounded-xl p-6 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6",
                            isDark ? "bg-[#111] border-white/10" : "bg-white border-black/5 shadow-sm"
                        )}>
                            <div className="space-y-1">
                                <div className="text-xs font-bold uppercase tracking-wider text-[#FF4D00]">
                                    {activeKeynote.preorderStatus}
                                </div>
                                <div className={clsx("font-medium", isDark ? "text-white" : "text-black")}>
                                    {activeKeynote.preorderShipWindow} · {activeKeynote.preorderDeposit}
                                </div>
                                <div className={clsx("text-sm", isDark ? "text-white/50" : "text-gray-500")}>
                                    {activeKeynote.preorderNote}
                                </div>
                            </div>
                            <a
                                href={activeKeynote.preorderUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-2.5 rounded-full bg-[#FF4D00] text-white font-bold text-sm hover:bg-[#e64600] transition-colors whitespace-nowrap"
                            >
                                {activeKeynote.preorderCta || t('keynote_preorder_cta')}
                            </a>
                        </div>
                    </div>

                    {/* Sidebar Playlist - 右边5个始终显示 */}
                    <div className="space-y-4">
                        <GlassmorphicCard blur={15} opacity={0.05} className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className={clsx("font-bold text-sm uppercase tracking-wider", isDark ? "text-white/50" : "text-gray-400")}>
                                {t('keynote_recent')}
                            </h3>
                                <span className={clsx("text-xs", isDark ? "text-white/30" : "text-gray-400")}>
                                    {filteredKeynotes.length} {t('home_date_format') === 'zh-CN' ? '个视频' : 'videos'}
                                </span>
                            </div>
                            <div className="space-y-3">
                                {filteredKeynotes.slice(0, 5).map(keynote => {
                                    const badge = statusBadge(keynote);
                                    const isUpcoming = badge.label === (t('home_date_format') === 'zh-CN' ? '即将开始' : 'Upcoming');
                                    return (
                            <div
                                key={keynote.id}
                                onClick={() => switchKeynote(keynote)}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                className={clsx(
                                    "group flex gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200",
                                    activeKeynote?.id === keynote.id
                                        ? (isDark 
                                            ? "bg-white/10 border-white/20 shadow-md" 
                                            : "bg-white border-[#FFD700] shadow-md")
                                        : (isDark 
                                            ? "bg-transparent border-transparent hover:bg-white/5" 
                                            : "bg-transparent border-transparent hover:bg-gray-100")
                                )}
                            >
                                    <div className="relative w-24 h-16 sm:w-28 sm:h-18 lg:w-32 lg:h-20 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                                    <img 
                                        src={keynote.thumbnailUrl} 
                                        alt={keynote.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                        loading="lazy"
                                        onError={(e) => {
                                            // 图片加载失败时使用占位符
                                            const target = e.target as HTMLImageElement;
                                            target.src = `https://via.placeholder.com/400x225?text=${encodeURIComponent(keynote.title.substring(0, 20))}`;
                                        }}
                                    />
                                    {activeKeynote.id === keynote.id && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-[#FF4D00] flex items-center justify-center text-white">
                                                <Play size={12} fill="white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2">
                                    <div className="flex items-center justify-between gap-2">
                                    <h4 className={clsx(
                                            "font-bold text-sm line-clamp-2 leading-snug",
                                        activeKeynote.id === keynote.id 
                                            ? "text-[#FF4D00]" 
                                            : (isDark ? "text-white" : "text-gray-900")
                                    )}>
                                        {keynote.title}
                                    </h4>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(keynote.id);
                                            }}
                                            className={clsx(
                                                "p-1 rounded-full border text-xs transition-colors",
                                                favoriteIds.includes(keynote.id)
                                                    ? (isDark ? "border-red-500 text-red-400 bg-red-500/10" : "border-red-500 text-red-500 bg-red-50")
                                                    : (isDark ? "border-white/10 text-white/60 hover:text-white" : "border-gray-200 text-gray-600 hover:text-black")
                                            )}
                                        >
                                            <Heart size={14} fill={favoriteIds.includes(keynote.id) ? "currentColor" : "none"} />
                                        </button>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-2 text-[11px]">
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded-full border flex items-center gap-1",
                                            isDark ? "border-white/10 text-white/60" : "border-gray-200 text-gray-600"
                                        )}>
                                            <Calendar size={10} /> {keynote.date}
                                        </span>
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded-full border flex items-center gap-1",
                                            isDark ? "border-white/10 text-white/60" : "border-gray-200 text-gray-600"
                                        )}>
                                            <User size={10} /> {keynote.speaker}
                                        </span>
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded-full border flex items-center gap-1",
                                            badge.color
                                        )}>
                                            <Clock size={10} /> {badge.label}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            );
                            })}
                        </div>
                        
                        {/* 展开/收起按钮 */}
                        {filteredKeynotes.length > 5 && (
                            <button
                                onClick={() => setExpandedPlaylist(!expandedPlaylist)}
                                className={clsx(
                                    "w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2",
                                    isDark
                                        ? "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <Grid3X3 size={14} />
                                <span>
                                    {expandedPlaylist
                                        ? (t('home_date_format') === 'zh-CN' ? '收起更多' : 'Show Less')
                                        : (t('home_date_format') === 'zh-CN' ? `展开更多 ${filteredKeynotes.length - 5} 个` : `Show ${filteredKeynotes.length - 5} more`)
                                    }
                                </span>
                                <ChevronDown size={14} className={clsx("transition-transform", expandedPlaylist && "rotate-180")} />
                            </button>
                        )}
                        </GlassmorphicCard>
                    </div>

                {/* 展开后的更多视频（第6个及以后） */}
                {expandedPlaylist && filteredKeynotes.length > 5 && (
                    <div className="mt-6 sm:mt-10 animate-fade-in">
                        {/* 展开区域头部 */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-1 h-5 sm:h-6 bg-[#FF4D00] rounded-full" />
                                <h3 className={clsx("font-bold text-base sm:text-xl", isDark ? "text-white" : "text-gray-900")}>
                                    {t('home_date_format') === 'zh-CN' ? '更多视频' : 'More Videos'}
                                </h3>
                                <span className={clsx(
                                    "px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium",
                                    isDark ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-500"
                                )}>
                                    {filteredKeynotes.length - 5} {t('home_date_format') === 'zh-CN' ? '个' : 'videos'}
                                </span>
                            </div>
                            <button
                                onClick={() => setExpandedPlaylist(false)}
                                className={clsx(
                                    "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 sm:gap-2",
                                    isDark
                                        ? "bg-white/10 hover:bg-white/15 text-white/80 hover:text-white"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <ChevronDown size={14} className="rotate-180" />
                                <span className="hidden sm:inline">{t('home_date_format') === 'zh-CN' ? '收起' : 'Collapse'}</span>
                            </button>
                        </div>

                        {/* 视频网格 - 只显示第6个及以后的视频 */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                            {filteredKeynotes.slice(5).map((keynote, index) => (
                                <div
                                    key={keynote.id}
                                    onClick={() => {
                                        setActiveKeynote(keynote);
                                        // 滚动到顶部播放器
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={clsx(
                                        "group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                                        activeKeynote.id === keynote.id
                                            ? (isDark 
                                                ? "ring-2 ring-[#FF4D00] bg-[#111]" 
                                                : "ring-2 ring-[#FF4D00] bg-white shadow-lg")
                                            : (isDark 
                                                ? "bg-[#111] border border-white/5 hover:border-white/20" 
                                                : "bg-white border border-gray-100 hover:border-gray-300 shadow-sm")
                                    )}
                                >
                                    {/* 缩略图 */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <img 
                                            src={keynote.thumbnailUrl} 
                                            alt={keynote.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                            loading="lazy"
                                            onError={(e) => {
                                                // 图片加载失败时使用占位符
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://via.placeholder.com/400x225?text=${encodeURIComponent(keynote.title.substring(0, 20))}`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        
                                        {/* 播放按钮 */}
                                        <div className={clsx(
                                            "absolute inset-0 flex items-center justify-center transition-opacity duration-200",
                                            activeKeynote.id === keynote.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                        )}>
                                            <div className={clsx(
                                                "w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white transition-transform group-hover:scale-110",
                                                activeKeynote.id === keynote.id 
                                                    ? "bg-[#FF4D00]" 
                                                    : "bg-black/50 backdrop-blur-sm"
                                            )}>
                                                <Play size={16} className="sm:hidden" fill="white" />
                                                <Play size={20} className="hidden sm:block" fill="white" />
                                            </div>
                                        </div>

                                        {/* 正在播放标签 */}
                                        {activeKeynote.id === keynote.id && (
                                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 px-2 sm:px-3 py-1 sm:py-1 bg-[#FF4D00] text-white text-[10px] sm:text-xs font-bold rounded-md flex items-center gap-1">
                                                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-white"></span>
                                                </span>
                                                <span className="hidden sm:inline">{t('home_date_format') === 'zh-CN' ? '正在播放' : 'Playing'}</span>
                                            </div>
                                        )}

                                        {/* 序号标签 */}
                                        <div className={clsx(
                                            "absolute top-2 right-2 sm:top-3 sm:right-3 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold",
                                            isDark ? "bg-black/50 text-white/80" : "bg-white/90 text-gray-700"
                                        )}>
                                            {index + 6}
                                        </div>
                                    </div>

                                    {/* 信息区域 */}
                                    <div className="p-2.5 sm:p-4">
                                        <h4 className={clsx(
                                            "font-bold text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 leading-snug transition-colors",
                                            activeKeynote.id === keynote.id 
                                                ? "text-[#FF4D00]" 
                                                : (isDark ? "text-white group-hover:text-[#FF4D00]" : "text-gray-900 group-hover:text-[#FF4D00]")
                                        )}>
                                            {keynote.title}
                                        </h4>
                                        <div className="hidden sm:flex items-center gap-3 text-xs">
                                            <span className={clsx(
                                                "flex items-center gap-1",
                                                isDark ? "text-white/50" : "text-gray-500"
                                            )}>
                                                <Calendar size={12} />
                                                {keynote.date}
                                            </span>
                                            <span className={clsx(
                                                "flex items-center gap-1",
                                                isDark ? "text-white/50" : "text-gray-500"
                                            )}>
                                                <User size={12} />
                                                {keynote.speaker}
                                            </span>
                                        </div>
                                        {/* 手机端简化显示 */}
                                        <div className="flex sm:hidden items-center text-[10px] text-gray-400">
                                            <span>{keynote.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 底部收起按钮 */}
                        <div className="flex justify-center mt-6 sm:mt-8">
                            <button
                                onClick={() => setExpandedPlaylist(false)}
                                className={clsx(
                                    "px-4 py-2 sm:px-6 sm:py-3 rounded-full font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 sm:gap-2 hover:scale-105",
                                    isDark
                                        ? "bg-white/10 hover:bg-white/15 text-white/80 hover:text-white border border-white/10"
                                        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                                )}
                            >
                                <ChevronDown size={14} className="rotate-180" />
                                <span>{t('home_date_format') === 'zh-CN' ? '收起' : 'Collapse'}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};
