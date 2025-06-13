import { describe, it, expect, beforeEach } from 'vitest';
import { xmlHttpRequest } from './utils/gm-xml-http-request';

describe('searchAnime', () => {
    beforeEach(() => {
        globalThis.__SHIKIMORI_API_HOST__ = 'shikimori.one/api/graphql';
        globalThis.__SHIKIMORI_API_DELAY_MS__ = "300";
        globalThis.__SHIKIMORI_API_RETRY_COUNT__ = "3";
        globalThis.__PKG_NAME__ = 'test-package';
        globalThis.__CACHE_PREFIX__ = 'test-cache_1.0.0';
        globalThis.__CACHE_TTL_MS__ = "1000";
        if (!globalThis.GM) globalThis.GM = {} as typeof GM;
        globalThis.GM.xmlHttpRequest = xmlHttpRequest;
    });

    it('should search anime by title', async () => {
        const searchAnime = (await import('../src/api/shikimori/api')).searchAnime;

        const results = await searchAnime({ search: 'Naruto', limit: 1 });

        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        expect(results[0]).toHaveProperty('name', 'Naruto');
    });
});
