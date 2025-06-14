import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { initEnv } from './utils/env';

const hasFixture = fs.existsSync(path.resolve(__dirname, 'fixtures/kp-detail.html'));
const hasFixturePosters = fs.existsSync(path.resolve(__dirname, 'fixtures/kp-posters.html'));

describe.skipIf(!hasFixture)('kp-website/kp-detail', () => {
    beforeAll(() => {
        initEnv();

        const html = fs.readFileSync(path.resolve(__dirname, 'fixtures/kp-detail.html'), 'utf-8');
        document.documentElement.innerHTML = html;
    });

    it('should create a badge with correct content', async () => {
        const insertShikimoriRating = (await import('../src/main')).insertShikimoriViewRating;
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

describe.skipIf(!hasFixturePosters)('kp-website/kp-posters', () => {
    beforeAll(() => {
        initEnv();

        const html = fs.readFileSync(path.resolve(__dirname, 'fixtures/kp-posters.html'), 'utf-8');
        document.documentElement.innerHTML = html;
    });

    it('should create a poster badge with correct content', async () => {
        const insertShikimoriPosterRating = (await import('../src/main')).insertShikimoriPosterRating;
        await insertShikimoriPosterRating?.();

        const badges = document.querySelectorAll('.shikimori');
        expect(badges.length).toBeGreaterThan(0);

        badges.forEach(badge => {
            expect(badge.outerHTML).toContain('class="m-r-xs shikimori"');
            expect(badge.innerHTML).toContain('img-responsive kinopoisk');
            expect(badge.innerHTML).toContain('https://shikimori.one/favicons/favicon-192x192.png');
            expect(badge.innerHTML).toContain('https://shikimori.one/animes/59452-katainaka-no-ossan-kensei-ni-naru');
        });
    });
});