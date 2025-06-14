import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { initEnv } from './utils/env';

const hasFixture = fs.existsSync(path.resolve(__dirname, 'fixtures/kp-detail.html'));

describe.skipIf(!hasFixture)('kp-website parse', () => {
    beforeAll(() => {
        initEnv();

        const html = fs.readFileSync(path.resolve(__dirname, 'fixtures/kp-detail.html'), 'utf-8');
        document.documentElement.innerHTML = html;
    });

    it('should create a badge with correct content', async () => {
        const insertShikimoriRating = (await import('../src/main')).insertShikimoriRating;
        await insertShikimoriRating?.();

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