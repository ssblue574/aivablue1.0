import { useEffect, useMemo, useState } from 'react';
import type { Language } from '../data';
import { BUNDLED_EDITORIAL, editorialStories, fetchEditorialFeed, nextEditorialBoundary } from '../data/editorialFeed';

export function useEditorialFeed(lang: Language) {
    const [document, setDocument] = useState(BUNDLED_EDITORIAL);
    const [now, setNow] = useState(Date.now);
    useEffect(() => {
        let pending: AbortController | undefined;
        const refresh = () => {
            setNow(Date.now());
            pending?.abort();
            const request = new AbortController();
            pending = request;
            const timeout = window.setTimeout(() => request.abort(), 5000);
            void fetchEditorialFeed(request.signal)
                .then(feed => { if (feed && !request.signal.aborted) setDocument(feed); })
                .catch(() => { /* Keep only verified, still-fresh data. No legacy fallback. */ })
                .finally(() => window.clearTimeout(timeout));
        };
        refresh();
        const timer = window.setInterval(refresh, 5 * 60_000);
        window.addEventListener('focus', refresh);
        return () => { pending?.abort(); window.clearInterval(timer); window.removeEventListener('focus', refresh); };
    }, []);
    useEffect(() => {
        const boundary = nextEditorialBoundary(document, now);
        if (boundary === null) return;
        const timer = window.setTimeout(() => setNow(Date.now()), Math.min(2_147_483_647, Math.max(1, boundary - Date.now())));
        return () => window.clearTimeout(timer);
    }, [document, now]);
    return useMemo(() => editorialStories(document, lang, now), [document, lang, now]);
}
