import { describe, it, expect, beforeAll } from 'vitest';
import { getItemPosterRatingContainers, getItemListRatingContainers, getTitles, getViewRatingBadgeContainer, isAnimePage, getItemPosterRatingBadgeContainer, getItemListRatingBadgeContainer } from '../src/parse/kp-website';
import { getRatingCount } from '../src/parse/shikimory-website';
import { initEnv } from './utils/env';
import fs from 'fs';
import path from 'path';

const hasFixtureDetails = fs.existsSync(path.resolve(__dirname, 'fixtures/kp-detail.html'));
const hasFixturePosters = fs.existsSync(path.resolve(__dirname, 'fixtures/kp-posters.html'));
const hasFixtureList = fs.existsSync(path.resolve(__dirname, 'fixtures/kp-list.html'));

describe.skipIf(!hasFixtureDetails)('parse/kp-website/details', () => {
    beforeAll(() => {
        initEnv();

        const html = fs.readFileSync(path.resolve(__dirname, 'fixtures/kp-detail.html'), 'utf-8');
        document.documentElement.innerHTML = html;
    });

    it('should parse titles from document.title', () => {
        expect(getTitles().length).toBeGreaterThan(0);
    });

    it('should return null if details cell not found', () => {
        expect(getViewRatingBadgeContainer()).toBeDefined();
    });

    it('should detect anime page', async () => {
        const result = isAnimePage('Жанр', ['Аниме', 'Мультфильм']);
        expect(result).toBe(true);
    });
});

describe.skipIf(!hasFixturePosters)('parse/kp-website/posters', () => {
    beforeAll(() => {
        initEnv();

        const html = fs.readFileSync(path.resolve(__dirname, 'fixtures/kp-posters.html'), 'utf-8');
        document.documentElement.innerHTML = html;
    });

    it('should parse titles from item-info', () => {
        const container = getItemPosterRatingContainers()?.[0];
        expect(container).toBeDefined();
        if (!container) {
            return;
        }

        expect(getTitles('item-info', container).length).toBeGreaterThan(0);
    });

    it('should return null if item poster rating containers not found', () => {
        const containers = getItemPosterRatingContainers();
        expect(containers).toBeDefined();
        if (!containers) {
            return;
        }

        const badgeContainer = getItemPosterRatingBadgeContainer(containers[0]);

        expect(badgeContainer).toBeDefined();
        expect(containers.length).toBeGreaterThan(0);
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

describe.skipIf(!hasFixtureList)('parse/kp-website/list', () => {
    beforeAll(() => {
        initEnv();

        const html = fs.readFileSync(path.resolve(__dirname, 'fixtures/kp-list.html'), 'utf-8');
        document.documentElement.innerHTML = html;
    });

    it('should return item list rating containers', () => {
        const containers = getItemListRatingContainers();
        expect(containers).toBeDefined();
        if (!containers) {
            return;
        }
        const budgeContainer = getItemListRatingBadgeContainer(containers?.[0]);

        expect(budgeContainer).toBeDefined();
        expect(containers?.length).toBeGreaterThan(0);
    });

    it('should parse titles from item-info', () => {
        const container = getItemListRatingContainers()?.[0];
        expect(container).toBeDefined();
        if (!container) {
            return;
        }

        expect(getTitles('item-info', container).length).toBeGreaterThan(0);
    });
});
