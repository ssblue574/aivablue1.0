import { Product } from './types';

/**
 * 首页「最近发布的 5 款新品」横条 —— 仅此模块配置。
 *
 * | 数据用途           | 修改位置                          |
 * |--------------------|-----------------------------------|
 * | 发现新品 / 全站列表 | `getLatestDrops()` in index.ts    |
 * | 首页 5 张样板卡片   | 本文件 `HOME_SHOWCASE_PRODUCT_IDS` |
 *
 * 不要在 getLatestDrops / PRODUCT_LIBRARY 里为首页单独改日期或删数据；
 * 首页固定展示哪几款，只改下面的 ID 列表即可。
 */
export const HOME_SHOWCASE_COUNT = 5;

/** 按顺序优先展示；找不到 ID 时自动用目录里最新的产品补齐 */
export const HOME_SHOWCASE_PRODUCT_IDS: readonly string[] = [
    'p_limitless_pendant',
    'p_friend_necklace',
    'p_brilliant_frame',
    'p_rabbit_r1',
    'p_rewind_pendant',
];

/**
 * 从已加载的产品目录中解析首页展示列表（置顶 ID + 时间排序兜底）。
 */
export function resolveHomeShowcaseProducts(
    sortedCatalog: Product[],
    fallbackPool: Product[]
): Product[] {
    const mapById = new Map(
        [...sortedCatalog, ...fallbackPool].map(p => [p.id, p])
    );

    const pinned = HOME_SHOWCASE_PRODUCT_IDS
        .map(id => mapById.get(id))
        .filter((p): p is Product => Boolean(p));

    const pool =
        sortedCatalog.length >= HOME_SHOWCASE_COUNT ? sortedCatalog : fallbackPool;

    const deduped = [...pinned, ...pool].filter(
        (p, idx, arr) => p && arr.findIndex(x => x?.id === p.id) === idx
    );

    return deduped.slice(0, HOME_SHOWCASE_COUNT);
}
