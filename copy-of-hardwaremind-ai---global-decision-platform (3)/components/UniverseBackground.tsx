import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

export const UniverseBackground: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Generate static stars for performance
    const stars = useMemo(() => {
        return Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            size: Math.random() * 2 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 2}s`
        }));
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            {/* 1. Deep Space Base Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')`,
                    opacity: isDark ? 0.4 : 0.1, // Subtle in light mode, deeper in dark mode
                    filter: isDark ? 'contrast(1.2) brightness(0.8)' : 'contrast(1.1) brightness(1.2) invert(1) hue-rotate(180deg)' // Invert for light mode to keep it interesting
                }}
            />

            {/* 2. Gradient Overlay for Depth */}
            <div className={clsx(
                "absolute inset-0 bg-gradient-to-b transition-colors duration-1000",
                isDark
                    ? "from-black/90 via-black/60 to-black/90"
                    : "from-white/90 via-white/60 to-white/90"
            )} />

            {/* 3. Nebula Drift Layer (Subtle) */}
            <div
                className="absolute inset-0 opacity-30 mix-blend-screen"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2000&auto=format&fit=crop')`,
                    backgroundSize: 'cover',
                    filter: 'hue-rotate(220deg) saturate(1.5)', // Cool teal/blue tones
                    animation: 'driftNebula 60s linear infinite alternate'
                }}
            />

            {/* 4. Starfield */}
            <div className="absolute inset-0">
                {stars.map(star => (
                    <div
                        key={star.id}
                        className={clsx("absolute rounded-full", isDark ? "bg-white" : "bg-black")}
                        style={{
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            left: star.left,
                            top: star.top,
                            opacity: star.opacity,
                            animation: `twinkle ${star.animationDuration} ease-in-out infinite`,
                            animationDelay: star.animationDelay
                        }}
                    />
                ))}
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes driftNebula {
                    0% { transform: scale(1.1) translate(0, 0); }
                    100% { transform: scale(1.2) translate(-2%, -2%); }
                }
            `}</style>
        </div>
    );
};
