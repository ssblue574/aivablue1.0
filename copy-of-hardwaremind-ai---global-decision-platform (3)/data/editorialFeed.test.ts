import { describe, it, expect } from 'vitest';
import { BUNDLED_EDITORIAL, editorialStories, nextEditorialBoundary, parseEditorialDocument } from './editorialFeed';

const at = (s: string) => Date.parse(s);
describe('curated editorial feed', () => {
    it('shows only curated entries starting November 28 Beijing time', () => {
        expect(editorialStories(BUNDLED_EDITORIAL, 'zh', at('2026-11-27T23:59:59+08:00'))).toEqual([]);
        expect(editorialStories(BUNDLED_EDITORIAL, 'zh', at('2026-11-28T00:00:00+08:00'))).toHaveLength(4);
        expect(editorialStories(BUNDLED_EDITORIAL, 'en', at('2026-11-28T00:00:00+08:00')).map(a => a.id))
          .not.toContain('n_nvidia_h200');
    });
    it.each([
        ['obsidian-agent-connectors', '2026-11-29T05:19:00+08:00'],
        ['amazon-decart-technology', '2026-11-30T00:00:00-08:00']
    ])('removes %s a millisecond beyond its window', (id, date) => {
        const boundary = at(date);
        expect(editorialStories(BUNDLED_EDITORIAL, 'zh', boundary).some(a => a.id === id)).toBe(true);
        expect(nextEditorialBoundary(BUNDLED_EDITORIAL, boundary)).toBe(boundary + 1);
        expect(editorialStories(BUNDLED_EDITORIAL, 'zh', boundary + 1).some(a => a.id === id)).toBe(false);
    });
    it('rejects malformed dates, unsafe sources, and duplicate events', () => {
        const item = BUNDLED_EDITORIAL.articles[0];
        const wrap = (articles: unknown[]) => ({version:1,articles});
        expect(parseEditorialDocument(wrap([{ ...item, occurredAt: '2026-02-30T00:00:00Z', displayDate: '2026-02-30' }]))).toBeNull();
        expect(parseEditorialDocument(wrap([{ ...item, sourceUrl: 'javascript:alert(1)' }]))).toBeNull();
        expect(parseEditorialDocument(wrap([item, {...item, id:'other', sourceUrl:item.sourceUrl+'?tracking=1'}]))).toBeNull();
        expect(parseEditorialDocument(wrap([]))).toEqual(wrap([]));
    });
    it('does not show events dated in the future', () => {
        const doc = {version: 1 as const, articles: [{ ...BUNDLED_EDITORIAL.articles[0],
            occurredAt:'2026-11-29T00:00:00-08:00', displayDate:'2026-11-29' }]};
        expect(editorialStories(doc, 'zh', at('2026-11-28T14:00:00+08:00'))).toEqual([]);
    });
});
