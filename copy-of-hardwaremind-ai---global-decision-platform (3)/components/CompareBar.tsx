import React, { useEffect, useState } from 'react';
import { X, ArrowRight, Layers, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Product, Language } from '../data';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';

interface CompareBarProps {
    selectedProducts: Product[];
    onToggleSelect: (product: Product) => void;
    onClear: () => void;
    lang: Language;
}

export const CompareBar: React.FC<CompareBarProps> = ({
    selectedProducts,
    onToggleSelect,
    onClear,
    lang
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (selectedProducts.length > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [selectedProducts.length]);

    if (!isVisible) return null;

    return (
        <div className={clsx(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 transition-all duration-500",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        )}>
            {/* Main Bar */}
            <div className={clsx(
                "flex items-center gap-4 px-2 py-2 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all",
                isDark
                    ? "bg-black/80 border-white/10 shadow-blue-900/20"
                    : "bg-white/90 border-black/5 shadow-xl"
            )}>
                {/* Product Thumbnails */}
                <div className="flex items-center gap-2 pl-2">
                    {selectedProducts.map((product) => (
                        <div
                            key={product.id}
                            className={clsx(
                                "relative group w-10 h-10 rounded-lg overflow-hidden border cursor-pointer transition-transform hover:scale-105",
                                isDark ? "bg-white/5 border-white/20" : "bg-gray-100 border-black/10"
                            )}
                            onClick={() => onToggleSelect(product)}
                            title={lang === 'zh' ? '点击移除' : 'Click to remove'}
                        >
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <X size={12} className="text-white" />
                            </div>
                        </div>
                    ))}

                    {/* Placeholder slots (up to 3) */}
                    {[...Array(Math.max(0, 3 - selectedProducts.length))].map((_, i) => (
                        <div
                            key={`placeholder-${i}`}
                            className={clsx(
                                "w-10 h-10 rounded-lg border border-dashed flex items-center justify-center",
                                isDark ? "border-white/10" : "border-black/10"
                            )}
                        >
                            <span className={clsx("text-xs font-mono", isDark ? "text-white/20" : "text-black/20")}>
                                {i + 1 + selectedProducts.length}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className={clsx("h-8 w-[1px]", isDark ? "bg-white/10" : "bg-black/10")} />

                {/* Actions */}
                <div className="flex items-center gap-2 pr-2">
                    <button
                        onClick={onClear}
                        className={clsx(
                            "p-2 rounded-xl transition-colors",
                            isDark ? "hover:bg-white/10 text-white/60 hover:text-white" : "hover:bg-black/5 text-black/60 hover:text-black"
                        )}
                        title={lang === 'zh' ? '清空' : 'Clear'}
                    >
                        <Trash2 size={16} />
                    </button>

                    <button
                        onClick={() => navigate('/compare')}
                        disabled={selectedProducts.length < 2}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-500/20",
                            selectedProducts.length < 2
                                ? isDark ? "bg-white/5 text-white/40 cursor-not-allowed" : "bg-gray-100 text-black/40 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500 text-white hover:scale-105"
                        )}
                    >
                        {selectedProducts.length < 2 ? (
                            <span>{lang === 'zh' ? '至少选两项' : 'Select 2+'}</span>
                        ) : (
                            <>
                                <span>{lang === 'zh' ? '开始对比' : 'Compare'}</span>
                                <ArrowRight size={14} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Helper Text */}
            <div className={clsx(
                "text-[10px] font-medium tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-md",
                isDark ? "bg-white/5 text-white/40" : "bg-black/5 text-black/40"
            )}>
                {lang === 'zh' ? '正在使用 AI 对比引擎' : 'AI COMPARISON ENGINE ACTIVE'}
            </div>
        </div>
    );
};
