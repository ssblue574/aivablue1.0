import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

interface ScrollytellingGalleryProps {
    images: string[];
    highlights: string[];
    lang: 'zh' | 'en';
}

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80';

export const ScrollytellingGallery: React.FC<ScrollytellingGalleryProps> = ({
    images,
    highlights,
    lang
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeIndex, setActiveIndex] = useState(0);
    const [brokenUrls, setBrokenUrls] = useState<Record<string, boolean>>({});

    const safeImages = useMemo(() => {
        const list = (images || []).filter(Boolean);
        return list.length > 0 ? list : [FALLBACK_IMAGE];
    }, [images]);

    const contentBlocks = useMemo(
        () => (highlights || []).filter(text => text && text.trim().length > 0).map(text => text.trim()),
        [highlights]
    );

    const currentSrc = brokenUrls[safeImages[activeIndex]]
        ? FALLBACK_IMAGE
        : safeImages[activeIndex];

    return (
        <div className="w-full space-y-8">
            {/* Compact hero — no sticky spacer / blank scroll */}
            <div
                className={clsx(
                    'relative w-full overflow-hidden rounded-2xl',
                    isDark ? 'bg-zinc-900' : 'bg-zinc-200'
                )}
                style={{ aspectRatio: '16 / 10', minHeight: 280, maxHeight: 560 }}
            >
                <img
                    key={currentSrc}
                    src={currentSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => {
                        setBrokenUrls(prev => ({ ...prev, [safeImages[activeIndex]]: true }));
                    }}
                />
                <div className={clsx(
                    'absolute inset-0 bg-gradient-to-t',
                    isDark
                        ? 'from-black/70 via-black/20 to-transparent'
                        : 'from-black/50 via-black/10 to-transparent'
                )} />

                {safeImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        {safeImages.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                aria-label={lang === 'zh' ? `图片 ${idx + 1}` : `Image ${idx + 1}`}
                                onClick={() => setActiveIndex(idx)}
                                className={clsx(
                                    'h-1.5 rounded-full transition-all',
                                    idx === activeIndex
                                        ? 'w-6 bg-white'
                                        : 'w-1.5 bg-white/50 hover:bg-white/80'
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* All features visible at once */}
            {contentBlocks.length > 0 && (
                <div className="space-y-4">
                    <h2 className={clsx(
                        'text-xs font-medium tracking-[0.25em] uppercase',
                        isDark ? 'text-white/45' : 'text-black/45'
                    )}>
                        {lang === 'zh' ? '核心特性' : 'Key Features'}
                    </h2>
                    {/* layout marker: compact grid, no sticky blank scroll */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {contentBlocks.map((text, idx) => (
                            <div
                                key={`${idx}-${text}`}
                                className={clsx(
                                    'p-5 rounded-2xl border transition-colors',
                                    isDark
                                        ? 'bg-white/[0.04] border-white/10 text-white'
                                        : 'bg-white border-black/8 text-black shadow-sm'
                                )}
                            >
                                <div className={clsx(
                                    'text-[11px] font-bold tracking-widest uppercase mb-2',
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                )}>
                                    {lang === 'zh' ? `特性 0${idx + 1}` : `Feature 0${idx + 1}`}
                                </div>
                                <p className="text-base sm:text-lg font-medium leading-snug">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
