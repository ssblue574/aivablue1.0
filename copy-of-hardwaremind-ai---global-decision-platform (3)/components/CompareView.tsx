import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { AppView, ComparisonResult, Product } from '../data';
import { ComparisonChart } from './ComparisonChart';

interface CompareViewProps {
    setView: (view: AppView) => void;
    isComparing: boolean;
    comparisonResult: ComparisonResult | null;
    selectedProducts: Product[];
    t?: (key: any) => string;
}

export const CompareView: React.FC<CompareViewProps> = ({
    setView,
    isComparing,
    comparisonResult,
    selectedProducts,
    t = (k: any) => k
}) => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <button onClick={() => setView(AppView.PRODUCTS)} className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-white"><ArrowRight className="rotate-180" size={16} /> {t('compare_back')}</button>
            {isComparing ? (
                <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                        <Zap size={64} className="text-[#FF4D00] animate-pulse mb-8" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 border-4 border-[#FF4D00]/20 border-t-[#FF4D00] rounded-full animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">{t('compare_processing')}</h2>
                    <p className="text-gray-400 text-sm max-w-md text-center">
                        {t('compare_processing_desc') || '正在分析产品差异，生成对比报告...'}
                    </p>
                    <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-[#FF4D00] animate-pulse" style={{ width: '60%' }} />
                    </div>
                </div>
            ) : comparisonResult ? (
                <div className="space-y-12 pb-20">
                    {/* Aiva 决策简报 */}
                    <div className="bg-[#1c1c1e] rounded-[40px] p-8 md:p-12 border border-white/10 relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                                <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#FF4D00]">
                                    Aiva Decision Brief
                                </span>
                                <span className="text-xs text-gray-400">
                                    决策简报
                                </span>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">
                                    这几款里面，如果只选一款，Aiva 更推荐：
                                </p>
                                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    {comparisonResult.winner}
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-gray-400">
                                        适合什么样的人？
                                    </p>
                                    <p className="text-sm text-gray-200 leading-relaxed">
                                        {comparisonResult.buyingGuide.targetAudience}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        最适合的使用场景：{comparisonResult.buyingGuide.bestFor}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-gray-400">
                                        本土化与下单建议
                                    </p>
                                    <p className="text-sm text-gray-200 leading-relaxed">
                                        {comparisonResult.buyingGuide.localizedTip}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        推荐下单平台：{comparisonResult.buyingGuide.recommendedPlatform}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-medium text-gray-400">
                                        Aiva 一句话总结
                                    </p>
                                    <p className="text-sm text-gray-200 leading-relaxed">
                                        {comparisonResult.verdict || comparisonResult.summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 候选产品速览卡片 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {selectedProducts.map(p => {
                            const primaryChannel = p.purchaseChannels?.find(ch => ch.isOfficial) || p.purchaseChannels?.[0];
                            return (
                                <div
                                    key={p.id}
                                    className="bg-[#1c1c1e] rounded-3xl p-6 border border-white/10 space-y-3"
                                >
                                    <div className="text-[11px] font-medium text-gray-400 tracking-[0.18em] uppercase">
                                        CANDIDATE
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">
                                        {p.brand} {p.name}
                                    </h3>
                                    {p.priceEstimate && (
                                        <p className="text-sm text-gray-300">
                                            参考价格：{p.priceEstimate}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap gap-2 text-xs mt-1">
                                        {typeof p.survivalRate === 'number' && (
                                            <span className="px-2 py-0.5 rounded-full bg-green-400/10 text-green-300">
                                                本土化生存率 {p.survivalRate}%
                                            </span>
                                        )}
                                        {p.riskLevel && (
                                            <span className="px-2 py-0.5 rounded-full bg-red-400/10 text-red-300">
                                                风险：{p.riskLevel}
                                            </span>
                                        )}
                                        {primaryChannel && (
                                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-200">
                                                推荐渠道：{primaryChannel.name}
                                            </span>
                                        )}
                                    </div>
                                    {p.verdict && (
                                        <p className="text-sm text-gray-400 leading-relaxed mt-2">
                                            Aiva 判词：{p.verdict}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* 详细对比：指标 + 优劣势 */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-medium text-gray-400 tracking-[0.18em] uppercase">
                            详细对比 · 指标与优劣势
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-[#1c1c1e] rounded-3xl p-8 border border-white/10">
                                <ComparisonChart
                                    data={comparisonResult.metrics}
                                    products={selectedProducts.map(p => p.name)}
                                    t={t}
                                />
                            </div>
                            <div className="space-y-6">
                                {comparisonResult.prosCons.map((pc, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-[#1c1c1e] rounded-3xl p-8 border border-white/10"
                                    >
                                        <h3 className="text-lg font-bold text-white mb-4">
                                            {pc.productName}
                                        </h3>
                                        <div className="space-y-4 text-sm text-gray-200">
                                            <div>
                                                <div className="flex items-center gap-2 text-green-300 font-semibold mb-2">
                                                    <span className="text-[12px]">优点</span>
                                                </div>
                                                <ul className="space-y-2 text-gray-300">
                                                    {(pc.pros || []).slice(0, 3).map((pro, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-green-400/70" />
                                                            <span className="leading-relaxed">{pro}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-red-300 font-semibold mb-2">
                                                    <span className="text-[12px]">风险/短板</span>
                                                </div>
                                                <ul className="space-y-2 text-gray-300">
                                                    {(pc.cons || []).slice(0, 3).map((con, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-red-400/70" />
                                                            <span className="leading-relaxed">{con}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* China Adaptability Matrix */}
                    <div className="bg-[#1c1c1e] rounded-3xl p-8 border border-white/10 overflow-x-auto relative">
                        <div className="md:hidden text-xs text-gray-400 mb-3">
                            👆 左右滑动查看更多列
                        </div>
                        <div className="pointer-events-none absolute inset-y-8 left-0 w-6 bg-gradient-to-r from-[#1c1c1e] to-transparent md:hidden" />
                        <div className="pointer-events-none absolute inset-y-8 right-0 w-6 bg-gradient-to-l from-[#1c1c1e] to-transparent md:hidden" />
                        <h3 className="text-xl font-bold text-white mb-6">
                            🇨🇳 本土化适应性对比 (China Adaptability Matrix)
                        </h3>
                        <table className="w-full text-left text-sm text-gray-400 min-w-[600px]">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-4 font-normal text-gray-500 w-32">
                                        Dimension
                                    </th>
                                    {selectedProducts.map(p => (
                                        <th
                                            key={p.id}
                                            className="py-4 px-4 font-bold text-white"
                                        >
                                            {p.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-white/5">
                                    <td className="py-4 font-medium text-white">网络环境</td>
                                    {selectedProducts.map(p => (
                                        <td key={p.id} className="py-4 px-4 align-top">
                                            {p.chinaAdaptability ? (
                                                <div>
                                                    <span
                                                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-1 ${
                                                            p.chinaAdaptability.network.score >= 8
                                                                ? 'bg-green-400/20 text-green-400'
                                                                : p.chinaAdaptability.network.score >= 5
                                                                ? 'bg-yellow-400/20 text-yellow-400'
                                                                : 'bg-red-400/20 text-red-400'
                                                        }`}
                                                    >
                                                        {p.chinaAdaptability.network.score}/10
                                                    </span>
                                                    <p className="leading-relaxed">
                                                        {p.chinaAdaptability.network.description}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-white/20">-</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="py-4 font-medium text-white">语言支持</td>
                                    {selectedProducts.map(p => (
                                        <td key={p.id} className="py-4 px-4 align-top">
                                            {p.chinaAdaptability ? (
                                                <div>
                                                    <span
                                                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-1 ${
                                                            p.chinaAdaptability.language.score >= 8
                                                                ? 'bg-green-400/20 text-green-400'
                                                                : p.chinaAdaptability.language.score >= 5
                                                                ? 'bg-yellow-400/20 text-yellow-400'
                                                                : 'bg-red-400/20 text-red-400'
                                                        }`}
                                                    >
                                                        {p.chinaAdaptability.language.score}/10
                                                    </span>
                                                    <p className="leading-relaxed">
                                                        {p.chinaAdaptability.language.description}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-white/20">-</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/5">
                                    <td className="py-4 font-medium text-white">售后服务</td>
                                    {selectedProducts.map(p => (
                                        <td key={p.id} className="py-4 px-4 align-top">
                                            {p.chinaAdaptability ? (
                                                <div>
                                                    <span
                                                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-1 ${
                                                            p.chinaAdaptability.warranty.score >= 8
                                                                ? 'bg-green-400/20 text-green-400'
                                                                : p.chinaAdaptability.warranty.score >= 5
                                                                ? 'bg-yellow-400/20 text-yellow-400'
                                                                : 'bg-red-400/20 text-red-400'
                                                        }`}
                                                    >
                                                        {p.chinaAdaptability.warranty.score}/10
                                                    </span>
                                                    <p className="leading-relaxed">
                                                        {p.chinaAdaptability.warranty.description}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-white/20">-</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="py-4 font-medium text-white">生态/电压</td>
                                    {selectedProducts.map(p => (
                                        <td key={p.id} className="py-4 px-4 align-top">
                                            {p.chinaAdaptability ? (
                                                <div className="space-y-1">
                                                    <span
                                                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold mb-1 ${
                                                            p.chinaAdaptability.ecosystem.score >= 8
                                                                ? 'bg-green-400/20 text-green-400'
                                                                : p.chinaAdaptability.ecosystem.score >= 5
                                                                ? 'bg-yellow-400/20 text-yellow-400'
                                                                : 'bg-red-400/20 text-red-400'
                                                        }`}
                                                    >
                                                        {p.chinaAdaptability.ecosystem.score}/10
                                                    </span>
                                                    <p className="leading-relaxed">
                                                        {p.chinaAdaptability.ecosystem.description}
                                                    </p>
                                                </div>
                                            ) : (
                                                <span className="text-white/20">-</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
