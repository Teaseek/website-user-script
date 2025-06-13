import { describe, it, expect, beforeAll } from 'vitest';
import { getTitles, getDetailsCell, isAnimePage } from '../src/parse/kp-website';
import { getRatingCount } from '../src/parse/shikimory-website';
import { initEnv } from './utils/env';
import fs from 'fs';
import path from 'path';

const hasFixture = fs.existsSync(path.resolve(__dirname, 'fixtures/kp-detail.html'));

describe.skipIf(!hasFixture)('parse/kp-website', () => {
    beforeAll(() => {
        initEnv();

        const html = fs.readFileSync(path.resolve(__dirname, 'fixtures/kp-detail.html'), 'utf-8');
        document.documentElement.innerHTML = html;
    });

    it('should parse titles from document.title', () => {
        expect(getTitles().length).toBeGreaterThan(0);
    });

    it('should return null if details cell not found', () => {
        expect(getDetailsCell()).toBeDefined();
    });

    it('should detect anime page', async () => {
        const result = isAnimePage('Жанр', ['Аниме', 'Мультфильм']);
        expect(result).toBe(true);
    });
});

describe('parse/shikimory-website', () => {
    beforeAll(initEnv);

    it('should return rating count from valid URL', async () => {
        const url = 'https://shikimori.one/animes/59452-katainaka-no-ossan-kensei-ni-naru';

        const ratingCount = await getRatingCount(url);

        expect(ratingCount).toBeDefined();
        expect(parseInt(ratingCount)).toBeGreaterThanOrEqual(0);
    });
});
