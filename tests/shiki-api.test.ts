import { describe, it, expect, beforeEach } from 'vitest';
import { GM_xmlhttpRequest } from './utils/gm-xml-http-request';

describe('fetchRatingByTitle', () => {
    beforeEach(() => {
        globalThis.__SHIKIMORI_HOST__ = 'shikimori.one';
        globalThis.__SHIKIMORI_API_DELAY_MS__ = "300";
        globalThis.__SHIKIMORI_API_RETRY_COUNT__ = "3";
        globalThis.__PKG_NAME__ = 'test-package';
        globalThis.__CACHE_PREFIX__ = 'test-cache_1.0.0';
        globalThis.__CACHE_TTL_MS__ = "1000";
        globalThis.GM_xmlhttpRequest = GM_xmlhttpRequest;
    });

    it('should fetch rating successfully', async () => {
        const fetchRatingByTitle = (await import('../src/api/shiki-api')).fetchRatingByTitle;

        const result = await fetchRatingByTitle('Naruto');

        expect(result).toBeDefined();
        expect(result).toHaveProperty('rating')
        expect(result).toHaveProperty('votes')
        expect(result).toHaveProperty('url', 'https://shikimori.one/animes/z20-naruto');
    });
});


