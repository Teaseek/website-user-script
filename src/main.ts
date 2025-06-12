import { fetchRatingByTitle } from './api/shiki-api';
import { saveToCache, loadFromCache, isCacheExpired } from './cache';
import { createBadge } from './views/badge';
import { logger } from './utils/logger';
import { getDetailsCell, getTitles, isAnimePage } from './parse/kp-website';

const GENRE_LABEL = 'Жанр';
const GENRES = ['Аниме', 'Мультфильм'];
const RATING_CLASS_NAME = 'shikimori';

async function fetchShikiRatingByTitles(titles: string[]): Promise<{ url: string; rating: string; votes: string }> {
    let lastError;
    for (const title of titles) {
        const cache = loadFromCache('shiki', title);
        if (cache && !isCacheExpired(cache)) {
            return cache.data;
        }
    }
    for (const title of titles) {
        try {
            const data = await fetchRatingByTitle(title);
            saveToCache('shiki', title, data);
            return data;
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError;
}

async function insertShikiRating(): Promise<void> {
    const cell = getDetailsCell();
    if (!cell || cell.querySelector(`.${RATING_CLASS_NAME}`)) return;
    if (!isAnimePage(GENRE_LABEL, GENRES)) return;

    const loaderBadge = createBadge({ url: '#' }, RATING_CLASS_NAME);
    cell.insertBefore(loaderBadge, cell.firstChild);

    const titles = getTitles();
    if (!titles.length) {
        logger.error('titles not founded');
        loaderBadge.remove();
        return;
    }

    try {
        const data = await fetchShikiRatingByTitles(titles);
        cell.replaceChild(createBadge(data, RATING_CLASS_NAME), loaderBadge);
    } catch {
        logger.error(`anime ${titles.join(', ')} not founded on shikimory`);
        loaderBadge.remove();
    }
}

function observeDetailsPage(cb: () => void): void {
    cb();
    new MutationObserver(cb).observe(document.body, { childList: true, subtree: true });
}

observeDetailsPage(insertShikiRating);
