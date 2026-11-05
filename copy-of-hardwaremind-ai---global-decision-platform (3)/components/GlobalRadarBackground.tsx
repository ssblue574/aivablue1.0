import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../ThemeContext';

export const GlobalRadarBackground: React.FC = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // 生成随机数据点(模拟全球硬件产品位置)
    const dataPoints = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            size: Math.random() * 4 + 2,
            delay: Math.random() * 3,
            duration: Math.random() * 2 + 2
        }));
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            {/* 1. 深色基底 */}
            <div className={clsx(
                "absolute inset-0 transition-colors duration-1000",
                isDark
                    ? "bg-gradient-to-br from-[#0a0a0f] via-[#050508] to-[#0a0a0f]"
                    : "bg-gradient-to-br from-[#f8f9fa] via-[#ffffff] to-[#f0f2f5]"
            )} />

            {/* 2. 网格层 - 全球地图网格 */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(${isDark ? 'rgba(0,255,198,0.1)' : 'rgba(0,100,150,0.08)'} 1px, transparent 1px),
                        linear-gradient(90deg, ${isDark ? 'rgba(0,255,198,0.1)' : 'rgba(0,100,150,0.08)'} 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                    animation: 'gridDrift 40s linear infinite'
                }}
            />

            {/* 3. 雷达扫描圆环 */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[1, 2, 3].map((ring) => (
                    <div
                        key={ring}
                        className={clsx(
                            "absolute rounded-full border",
                            isDark ? "border-[#00FFC6]/20" : "border-[#0066cc]/15"
                        )}
                        style={{
                            width: `${ring * 35}%`,
                            height: `${ring * 35}%`,
                            animation: `pulse ${3 + ring}s ease-in-out infinite`,
                            animationDelay: `${ring * 0.5}s`
                        }}
                    />
                ))}
            </div>

            {/* 4. 雷达扫描线 */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <div
                    className="absolute w-[120%] h-[1px] origin-center"
                    style={{
                        background: isDark
                            ? 'linear-gradient(90deg, transparent, rgba(0,255,198,0.6) 50%, transparent)'
                            : 'linear-gradient(90deg, transparent, rgba(0,100,200,0.4) 50%, transparent)',
                        animation: 'radarScan 8s linear infinite',
                        boxShadow: isDark
                            ? '0 0 20px rgba(0,255,198,0.5)'
                            : '0 0 15px rgba(0,100,200,0.3)'
                    }}
                />
            </div>

            {/* 5. 数据点 - 模拟全球硬件产品位置 */}
            <div className="absolute inset-0">
                {dataPoints.map(point => (
                    <div
                        key={point.id}
                        className={clsx(
                            "absolute rounded-full",
                            isDark ? "bg-[#00FFC6]" : "bg-[#0066cc]"
                        )}
                        style={{
                            left: point.left,
                            top: point.top,
                            width: `${point.size}px`,
                            height: `${point.size}px`,
                            animation: `dataPulse ${point.duration}s ease-in-out infinite`,
                            animationDelay: `${point.delay}s`,
                            boxShadow: isDark
                                ? `0 0 ${point.size * 3}px rgba(0,255,198,0.6)`
                                : `0 0 ${point.size * 2}px rgba(0,100,200,0.4)`
                        }}
                    />
                ))}
            </div>

            {/* 6. 波纹扩散效果 */}
            <div className="absolute top-1/4 left-1/3">
                <div
                    className={clsx(
                        "w-32 h-32 rounded-full border-2",
                        isDark ? "border-[#FF4D00]/30" : "border-[#ff6b35]/20"
                    )}
                    style={{
                        animation: 'ripple 4s ease-out infinite'
                    }}
                />
            </div>
            <div className="absolute bottom-1/3 right-1/4">
                <div
                    className={clsx(
                        "w-40 h-40 rounded-full border-2",
                        isDark ? "border-[#FF4D00]/30" : "border-[#ff6b35]/20"
                    )}
                    style={{
                        animation: 'ripple 5s ease-out infinite',
                        animationDelay: '1s'
                    }}
                />
            </div>

            {/* 7. 光晕层 */}
            <div className="absolute inset-0">
                <div
                    className={clsx(
                        "absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[100px]",
                        isDark ? "bg-[#00FFC6]/10" : "bg-[#0066cc]/8"
                    )}
                    style={{
                        animation: 'float 10s ease-in-out infinite'
                    }}
                />
                <div
                    className={clsx(
                        "absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px]",
                        isDark ? "bg-[#FF4D00]/10" : "bg-[#ff6b35]/8"
                    )}
                    style={{
                        animation: 'float 12s ease-in-out infinite',
                        animationDelay: '2s'
                    }}
                />
            </div>

            {/* 8. 顶部渐变遮罩 */}
            <div className={clsx(
                "absolute inset-0 pointer-events-none",
                isDark
                    ? "bg-gradient-to-b from-black/60 via-transparent to-black/80"
                    : "bg-gradient-to-b from-white/60 via-transparent to-white/80"
            )} />
            
            {/* 9. 内容保护层 */}
            <div className="absolute inset-0 pointer-events-none bg-black/20" />

            {/* CSS 动画 */}
            <style>{`
                @keyframes radarScan {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes dataPulse {
                    0%, 100% { opacity: 0.3; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes ripple {
                    0% { transform: scale(0.5); opacity: 0.8; }
                    100% { transform: scale(3); opacity: 0; }
                }
                @keyframes gridDrift {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(60px, 60px); }
                }
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(20px, -20px) scale(1.1); }
                }
            `}</style>
        </div>
    );
};
