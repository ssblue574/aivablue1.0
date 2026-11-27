import type { Language, NewsItem } from './types';
import bundled from '../public/editorial-feed.json';

export const EDITORIAL_ENDPOINT = '/editorial-runtime.json';
const HOUR = 60 * 60 * 1000;
const BEIJING_ACTIVATION = Date.parse('2026-11-28T00:00:00+08:00');
const WINDOWS = { frontier: 72 * HOUR, startup: 7 * 24 * HOUR } as const;
const ID = /^[a-z0-9][a-z0-9-]{0,79}$/;
const OFFSET_TIME = /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:Z|[+-](?:0\d|1[0-4]):[0-5]\d)$/;
const YM_DAY = /^(\d{4})-(\d{2})-(\d{2})$/;

type Channel = keyof typeof WINDOWS;
type Copy = { title: string; category: string; body: string[]; insight: string };
type Article = {
    id: string;
    channel: Channel;
    occurredAt: string;
    datePrecision: 'day' | 'time';
    displayDate: string;
    source: string;
    sourceUrl: string;
    locales: Record<'zh' | 'en', Copy>;
};
export type EditorialDocument = { version: 1; articles: Article[] };

const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, max: number): v is string => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
function validDay(v: unknown): v is string {
    if (typeof v !== 'string' || !YM_DAY.test(v)) return false;
    const millis = Date.parse(v);
    return Number.isFinite(millis) && new Date(millis).toISOString().slice(0, 10) === v;
}
function validCopy(v: unknown): v is Copy {
    return object(v) && str(v.title, 200) && str(v.category, 70) && str(v.insight, 1500) &&
        Array.isArray(v.body) && v.body.length >= 2 && v.body.length <= 12 && v.body.every(p => str(p, 1800));
}
function validSourceUrl(v: unknown): v is string {
    if (!str(v, 2048)) return false;
    try {
        const u = new URL(v);
        return u.protocol === 'https:' && !u.username && !u.password &&
            !u.port && u.hostname.includes('.') && !u.hostname.endsWith('.localhost');
    } catch { return false; }
}
function validArticle(v: unknown): v is Article {
    if (!object(v) || !str(v.id, 80) || !ID.test(v.id) || (v.channel !== 'frontier' && v.channel !== 'startup') ||
        !str(v.occurredAt, 35) || !OFFSET_TIME.test(v.occurredAt) || !validDay(v.displayDate) ||
        v.occurredAt.slice(0, 10) !== v.displayDate || !Number.isFinite(Date.parse(v.occurredAt)) ||
        (v.datePrecision !== 'day' && v.datePrecision !== 'time') || !str(v.source, 140) || !validSourceUrl(v.sourceUrl) ||
        !object(v.locales) || !validCopy(v.locales.zh) || !validCopy(v.locales.en)) return false;
    return v.datePrecision !== 'day' || v.occurredAt.slice(11, 19) === '00:00:00';
}
export function parseEditorialDocument(raw: unknown): EditorialDocument | null {
    if (!object(raw) || raw.version !== 1 || !Array.isArray(raw.articles) || raw.articles.length > 100 ||
        !raw.articles.every(validArticle)) return null;
    const ids = new Set(raw.articles.map(a => a.id));
    const links = new Set(raw.articles.map(a => { const url = new URL(a.sourceUrl); return url.origin + url.pathname.replace(/\/+$/, ''); }));
    if (ids.size !== raw.articles.length || links.size !== raw.articles.length) return null;
    return { version: 1, articles: raw.articles };
}

export const BUNDLED_EDITORIAL = parseEditorialDocument(bundled) ?? { version: 1, articles: [] };

export function editorialStories(doc: EditorialDocument, lang: Language, now: number): NewsItem[] {
    if (now < BEIJING_ACTIVATION) return [];
    return doc.articles
        .filter(a => { const age = now - Date.parse(a.occurredAt); return age >= 0 && age <= WINDOWS[a.channel]; })
        .sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt))
        .map(a => {
            const copy = a.locales[lang === 'zh' ? 'zh' : 'en'];
            return { id: a.id, stage: a.channel === 'startup' ? 'startup' : 'enterprise', editorialChannel: a.channel, title: copy.title,
                category: copy.category, description: copy.body.join('\n'), editorialInsight: copy.insight,
                date: a.displayDate, imageUrl: '/images/editorial-placeholder.svg',
                source: a.source, readMoreUrl: a.sourceUrl };
        });
}

export function nextEditorialBoundary(doc: EditorialDocument, now: number): number | null {
    const candidates = [BEIJING_ACTIVATION, ...doc.articles.flatMap(a => {
        const event = Date.parse(a.occurredAt);
        return [event, event + WINDOWS[a.channel] + 1];
    })].filter(boundary => boundary > now);
    return candidates.length ? Math.min(...candidates) : null;
}

export async function fetchEditorialFeed(signal: AbortSignal): Promise<EditorialDocument | null> {
    const response = await fetch(EDITORIAL_ENDPOINT, { cache: 'no-store', credentials: 'omit', redirect: 'error', signal });
    const contentType = response.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
    if (!response.ok || (contentType !== 'application/json' && contentType !== 'text/plain')) return null;
    const reader = response.body?.getReader();
    if (!reader) return null;
    const decoder = new TextDecoder('utf-8', { fatal: true });
    let body = '', size = 0;
    for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 400_000) { await reader.cancel(); return null; }
        body += decoder.decode(value, { stream: true });
    }
    return parseEditorialDocument(JSON.parse(body + decoder.decode()));
}
