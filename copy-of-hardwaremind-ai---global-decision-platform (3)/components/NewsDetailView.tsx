import React from 'react';
import { ArrowLeft, Calendar, Share2, ExternalLink, Clock, User } from 'lucide-react';
import { clsx } from 'clsx';
import { NewsItem, Language } from '../data';
import { useTheme } from '../ThemeContext';

interface NewsDetailViewProps {
    news: NewsItem | null;
    onBack: () => void;
    t: (key: any) => string;
    lang: Language;
}

export const NewsDetailView: React.FC<NewsDetailViewProps> = ({ news, onBack, t, lang }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!news) return null;

    const paragraphs = news.description.split('\n').filter(p => p.trim().length > 0);
    const summary = paragraphs[0] || news.description;
    const restParagraphs = paragraphs.slice(1);

    const buildAivaInsight = () => {
        const isStartup = news.stage === 'startup';
        if (lang === 'zh') {
            if (isStartup) {
                return '这更像是一则「早期信号」，适合关注新品风向和项目潜力的读者。真正下单前，建议再观察后续实机评测和国内体验反馈。';
            }
            return '这条情报有助于你判断品牌和产品未来一段时间的节奏：可以结合产品详情页的 Aiva 指数，一起判断是现在入手、等下一代，还是只保持关注。';
        } else {
            if (isStartup) {
                return 'Treat this as an early signal rather than a buy trigger. Great for tracking momentum, but wait for real‑world reviews and local availability before committing money.';
            }
            return 'Use this intel to understand the brand and product roadmap: combine it with the Aiva index on the product page to decide whether to buy now, wait for the next revision, or just keep watching.';
        }
    };

    const buildExtraParagraphs = (): string[] => {
        if (lang === 'zh') {
            return [
                `从更宏观的角度看，「${news.title}」背后代表的是「${news.category}」方向的新动向，反映出这一赛道在过去一段时间里的节奏和重心。`,
                '对于在观望相关硬件/服务的用户，这类情报可以当作参考信号之一：它告诉你厂商正往哪个方向加码，但还不足以单独决定「立刻入手」或「放弃」。',
                '更稳妥的做法是，将这条新闻与产品详情页中的 Aiva 指数、本土化生存率、价格与保修信息一起看，把它当作补充背景，而不是唯一依据。'
            ];
        }
        return [
            `At a higher level, “${news.title}” signals where the “${news.category}” space is currently investing its energy and attention.`,
            'If you are considering buying into this category, treat this kind of intel as one signal among many: it shows the direction of travel, but should not, on its own, trigger an immediate purchase or a hard no.',
            'A more robust approach is to read this together with the Aiva index on the product page, localization fit, pricing and warranty details, and then decide whether to buy now, wait, or simply keep an eye on the trend.'
        ];
    };

    const structuredBody = restParagraphs.length > 0 ? restParagraphs : buildExtraParagraphs();

    return (
        <div className={clsx("min-h-screen", isDark ? "bg-black" : "bg-[#f5f5f7]")}>
            {/* Header with Back Button */}
            <div className={clsx(
                "sticky top-14 z-40 border-b backdrop-blur-xl",
                isDark ? "bg-black/80 border-white/10" : "bg-white/80 border-black/10"
            )}>
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
                </div>
            </div>

            {/* Header Image */}
            <div className="relative h-64 md:h-96 w-full">
                <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto">
                    <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#00FFC6] mb-3">
                        <span>{news.category}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight text-white mb-4">
                        {news.title}
                    </h1>
                    <div className="flex items-center gap-6 text-sm text-white/70">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {news.date}</span>
                        <span className="flex items-center gap-1"><User size={14} /> {news.source || (lang === 'zh' ? 'AIVA 情报' : 'AIVA Intelligence')}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {lang === 'zh' ? '5 分钟阅读' : '5 min read'}</span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-4xl mx-auto px-6 md:px-20 py-12 space-y-8 leading-relaxed text-lg">
                {/* 导语：沿用摘要 */}
                <div className={clsx(
                    "font-medium text-xl border-l-4 pl-6 py-1",
                    isDark ? "border-[#00FFC6] text-white/90" : "border-black text-black/90"
                )}>
                    {summary}
                </div>

                {/* 背景与补充说明 */}
                <div className={clsx("space-y-4 mt-6", isDark ? "text-white/70" : "text-black/70")}>
                    <h3 className={clsx("text-base font-semibold", isDark ? "text-white" : "text-black")}>
                        {lang === 'zh' ? '背景与关键信息' : 'Background & key facts'}
                    </h3>
                    {structuredBody.map((para, idx) => (
                        <p key={idx} className="text-sm leading-relaxed">
                            {para}
                        </p>
                    ))}
                </div>

                {/* Aiva 决策提示 */}
                <div className={clsx(
                    "mt-8 p-6 rounded-2xl border",
                    isDark ? "bg-white/5 border-white/10 text-white/80" : "bg-white border-black/10 text-black/80"
                )}>
                    <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                        <span className="text-[#00FFC6] text-lg">Aiva</span>
                        <span>{lang === 'zh' ? '怎么看这条情报？' : 'How Aiva reads this intel'}</span>
                    </h3>
                    <p className="text-sm leading-relaxed">
                        {news.editorialInsight || buildAivaInsight()}
                    </p>
                </div>

                {/* Action Bar */}
                <div className={clsx(
                    "pt-12 mt-12 border-t flex items-center justify-between",
                    isDark ? "border-white/10" : "border-black/10"
                )}>
                    <div className="flex gap-2">
                        {news.tags?.map(tag => (
                            <span key={tag} className={clsx(
                                "px-3 py-1 rounded-full text-xs border",
                                isDark ? "border-white/20 bg-white/5" : "border-black/10 bg-gray-100"
                            )}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        {typeof navigator.share === 'function' && (
                            <button type="button" aria-label={lang === 'zh' ? '分享' : 'Share'}
                                onClick={() => { void navigator.share({ title: news.title, url: window.location.href }).catch(() => {}); }}
                                className={clsx("p-3 rounded-full border transition-colors", isDark ? "border-white/20 hover:bg-white/10" : "border-black/10 hover:bg-black/5")}>
                                <Share2 size={20} />
                            </button>
                        )}
                        {news.readMoreUrl && (
                            <a 
                                href={news.readMoreUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className={clsx(
                                    "flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-colors",
                                    isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
                                )}
                            >
                                {lang === 'zh' ? '查看原始来源' : 'View original source'} <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


