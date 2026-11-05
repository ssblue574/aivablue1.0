import { Language, NewsItem, Product, KeynoteItem, CommunityPost } from './types';
import { NEWS_LIBRARY } from './news';
import { PRODUCT_LIBRARY } from './products';
import { KEYNOTE_LIBRARY } from './keynotes';
import { COMMUNITY_POSTS, getLocalizedCommunityPosts } from './community';
import { toNews, toProduct, toKeynote } from './helpers';
import { generateMockProducts, generateMilestones } from './generators';

export * from './types';
export * from './news';
export * from './products';
export * from './keynotes';
export * from './community';
export * from './helpers';
export * from './generators';
export * from './homeShowcase';
export * from './productTypes';

export const getNewsFeed = (lang: Language): NewsItem[] => {
    try {
        return NEWS_LIBRARY.map(n => toNews(n, lang)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (error) {
        console.error('Error in getNewsFeed:', error);
        return [];
    }
};

const formatLaunchDate = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

/**
 * 「发现新品」页 / `products` 状态的全量数据源（PRODUCT_LIBRARY + mock 扩展）。
 *
 * 与首页横条无关；首页固定 5 款见 `data/homeShowcase.ts`。
 * 发布日期相对「今天」计算，避免写死年份导致整站列表被 6 个月窗口筛空。
 */
export const getLatestDrops = (lang: Language): Product[] => {
    try {
        const now = new Date();
        const sixMonthsAgo = new Date(now);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Generate 40 mock products (dates are relative to "now" inside generator)
        const mocks = generateMockProducts(66);

        // Spread core library launch dates across the last ~6 months so the window never goes stale
        const recentCore = PRODUCT_LIBRARY.map((p, idx) => {
            const d = new Date(now);
            d.setDate(d.getDate() - ((idx * 11) % 170));
            return {
                ...p,
                launchDate: formatLaunchDate(d)
            };
        });

        const all = [...recentCore, ...mocks];

        const mapped = all
            .filter(p => !p.isClassic)
            .map(p => {
                try {
                    return toProduct(p, lang);
                } catch (error) {
                    console.error('toProduct failed for', p?.id, error);
                    return null;
                }
            })
            .filter((p): p is Product => Boolean(p));

        const withinWindow = mapped
            .filter(p => {
                const launch = new Date(p.launchDate);
                if (isNaN(launch.getTime())) return true;
                return launch >= sixMonthsAgo;
            })
            .sort((a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime());

        // Safety net: never return empty catalog because static dates aged out
        if (withinWindow.length > 0) return withinWindow;
        if (mapped.length > 0) {
            return [...mapped].sort(
                (a, b) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()
            );
        }

        // Last resort: core library only
        return PRODUCT_LIBRARY
            .filter(p => !p.isClassic)
            .map(p => toProduct(p, lang));
    } catch (error) {
        console.error('Error in getLatestDrops:', error);
        try {
            return PRODUCT_LIBRARY.filter(p => !p.isClassic).map(p => toProduct(p, lang));
        } catch {
            return [];
        }
    }
};

export const getKeynotes = (lang: Language): KeynoteItem[] => {
    return KEYNOTE_LIBRARY.map(k => toKeynote(k, lang)).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getCategories = (lang: Language): string[] => {
    const all = PRODUCT_LIBRARY.map(p => p.locales[lang].category);
    return [lang === 'zh' ? '全部' : 'All', ...Array.from(new Set(all))];
};

export const getCommunityPosts = (lang: Language): CommunityPost[] => getLocalizedCommunityPosts(lang);

const GENERATED_MILESTONES = generateMilestones();

export const getMilestones = (lang: Language): Product[] => {
    // Combine existing classics with generated milestones
    const existingClassics = PRODUCT_LIBRARY.filter(p => p.isClassic).map(p => toProduct(p, lang));
    const generatedMilestones = GENERATED_MILESTONES.map(p => toProduct(p, lang));
    return [...existingClassics, ...generatedMilestones];
};
