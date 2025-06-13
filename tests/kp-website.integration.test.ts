import { describe, it, expect, beforeAll } from 'vitest';
import { isAnimePage, getTitles, getDetailsCell } from '../src/parse/kp-website';
import fs from 'fs';
import path from 'path';
import { GM_xmlhttpRequest } from './utils/gm-xml-http-request';

const hasFixture = fs.existsSync(path.resolve(__dirname, 'fixtures/kp-detail.html'));

describe.skipIf(!hasFixture)('kp-website parse', () => {
    beforeAll(() => {
        globalThis.__SHIKIMORI_API_HOST__ = 'shikimori.one/api/graphql';
        globalThis.__SHIKIMORI_API_DELAY_MS__ = "300";
        globalThis.__SHIKIMORI_API_RETRY_COUNT__ = "3";
        globalThis.__PKG_NAME__ = 'test-package';
        globalThis.__CACHE_PREFIX__ = 'test-cache_1.0.0';
        globalThis.__CACHE_TTL_MS__ = "1000";
        globalThis.GM_xmlhttpRequest = GM_xmlhttpRequest;

        const html = fs.readFileSync(path.resolve(__dirname, 'fixtures/kp-detail.html'), 'utf-8');
        document.documentElement.innerHTML = html;
    });

    it('should detect anime page and extract titles', () => {
        expect(isAnimePage('Жанр', ['Аниме', 'Мультфильм'])).toBe(true);
        expect(getTitles().length).toBeGreaterThan(0);
        expect(getDetailsCell()).not.toBeNull();
    });

    it('should create a badge with correct content', async () => {
        const insertShikiRating = (await import('../src/main')).insertShikiRating;
        await insertShikiRating?.();

        const badge = document.querySelector('.shikimori');
        expect(badge).not.toBeNull();
        if (!badge) {
            throw new Error('Badge not found');
        }

        expect(badge.outerHTML).toContain('class="m-r-md shikimori"');
        expect(badge.innerHTML).toContain('img-responsive kinopoisk');
        expect(badge.innerHTML).toContain('https://shikimori.one/favicons/favicon-192x192.png');
        expect(badge.innerHTML).toContain('https://shikimori.one/animes/59452-katainaka-no-ossan-kensei-ni-naru');
    });
});