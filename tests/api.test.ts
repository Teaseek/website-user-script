import { describe, it, expect, beforeEach } from 'vitest';
import { initEnv } from './utils/env';

describe('api/shikimori', () => {
    beforeEach(initEnv);

    it('should search anime by title', async () => {
        const searchAnime = (await import('../src/api/shikimori/api')).searchAnime;

        const results = await searchAnime({ search: 'Naruto', limit: 1 });
        expect(results).toBeDefined();
        expect(results.length).toBeGreaterThan(0);
        expect(results[0]).toHaveProperty('name');
    });
});
