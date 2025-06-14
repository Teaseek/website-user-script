import { createRatingViewBadge, createRatingPosterBadge, createRatingListBadge } from './views/kp-website';
import { getViewRatingBadgeContainer, getTitles, isAnimePage, getItemPosterRatingContainers, getItemPosterRatingBadgeContainer, getItemListRatingContainers, getItemListRatingBadgeContainer } from './parse/kp-website';
import { searchAnime } from './api/shikimori/api';
import { getRatingCount } from './parse/shikimory-website';
import { RetryOptions } from './utils/retry';
import { ICacheService, ILogger } from './services/types';
import { container, TYPES } from './services';

const cacheService = container.get<ICacheService>(TYPES.Cache);
const logger = container.get<ILogger>(TYPES.Logger);

declare const __SHIKIMORI_API_DELAY_MS__: string;
declare const __SHIKIMORI_API_RETRY_COUNT__: string;

const DELAY_MS = parseFloat(__SHIKIMORI_API_DELAY_MS__) || 1000;
const RETRY_COUNT = parseInt(__SHIKIMORI_API_RETRY_COUNT__, 10) || 3;

const GENRE_LABEL = 'Жанр';
const GENRES = ['Аниме', 'Мультфильм'];
const RATING_CLASS_NAME = 'shikimori';
const CACHE_NAME = 'shikimori';
const SEARCH_LIMIT = 1;
const retryOptions: RetryOptions = {
    delay: DELAY_MS,
    retries: RETRY_COUNT,
}

function getShikimoriCachedRatingByTitles(titles: string[], checkDate = false): { url: string; rating: string; votes: string } | undefined {
    for (const title of titles) {
        const cache = cacheService.loadFromCache<{ url: string; rating: string; votes: string }>(CACHE_NAME, title);
        if (cache && (!checkDate || !cacheService.isCacheExpired(cache))) {
            return cache.data;
        }
    }
}

async function fetchShikimoriRatingByTitles(titles: string[]): Promise<{ url: string; rating: string; votes: string }> {
    const cachedData = await getShikimoriCachedRatingByTitles(titles, true);
    if (cachedData) {
        return cachedData;
    }

    let lastError;
    for (const title of titles) {
        try {
            const data = await fetchRatingByTitle(title);
            cacheService.saveToCache(CACHE_NAME, title, data);
            return data;
        } catch (err) {
            lastError = err;
        }
    }
    
    throw lastError;
}

async function fetchRatingByTitle(title: string): Promise<{ url: string; rating: string; votes: string }> {
    const anime = await searchAnime({ search: title, limit: SEARCH_LIMIT }, retryOptions);
    if (anime.length === 0) {
        throw new Error(`Anime with title "${title}" not found`);
    }

    const { score, name, url } = anime[0];
    if (!score) {
        throw new Error(`Anime with title "${title}" does not have a valid score or name`);
    }

    const votes = await getRatingCount(url, retryOptions);
    
    logger.debug(`Shikimori rating for "${name}": ${score}`);

    return {
        url,
        rating: score.toString(),
        votes,
    };
}

export async function insertShikimoriViewRating(): Promise<void> {
    const cell = getViewRatingBadgeContainer();
    if (!cell || cell.querySelector(`.${RATING_CLASS_NAME}`)) return;
    if (!isAnimePage(GENRE_LABEL, GENRES)) return;

    const loaderBadge = createRatingViewBadge({ url: '#' }, RATING_CLASS_NAME);
    cell.insertBefore(loaderBadge, cell.firstChild);

    try {
        const titles = getTitles();
        if (!titles.length) {
            logger.error('titles not founded');
            loaderBadge.remove();
            return;
        }

        const data = await fetchShikimoriRatingByTitles(titles);
        cell.replaceChild(createRatingViewBadge(data, RATING_CLASS_NAME), loaderBadge);
    } catch {
        loaderBadge.remove();
    }
}

export async function insertShikimoriPosterRating(): Promise<void> {
    const containers = getItemPosterRatingContainers();
    if (!containers || containers.length === 0) return;

    for (const container of containers) {
        if (container.querySelector(`.${RATING_CLASS_NAME}`)) continue;

        const titles = getTitles('item-info', container);
        if (!titles.length) {
            logger.error('titles not founded');
            continue;
        }

        try {
            const cachedData = getShikimoriCachedRatingByTitles(titles, false);
            if (!cachedData) {
                continue;
            }

            logger.debug(`Cached data for titles ${titles.join(', ')}:`, cachedData);

            const badgeContainer = getItemPosterRatingBadgeContainer(container);
            if (!badgeContainer) {
                logger.error('Poster rating badge container not found');
                continue;
            }

            badgeContainer.appendChild(createRatingPosterBadge(cachedData, RATING_CLASS_NAME));
        }  catch (error) {
            logger.error(`Error fetching cached data for titles ${titles.join(', ')}`, error);
            continue;
        }
    }
}

export async function insertShikimoriListRating(): Promise<void> {
    const containers = getItemListRatingContainers();
    if (!containers || containers.length === 0) return;

    for (const container of containers) {
        if (container.querySelector(`.${RATING_CLASS_NAME}`)) continue;

        const titles = getTitles('item-info', container);
        if (!titles.length) {
            logger.error('titles not founded');
            continue;
        }

        try {
            const cachedData = getShikimoriCachedRatingByTitles(titles, false);
            if (!cachedData) {
                continue;
            }

            logger.debug(`Cached data for titles ${titles.join(', ')}:`, cachedData);

            const badgeContainer = getItemListRatingBadgeContainer(container);
            if (!badgeContainer) {
                logger.error('Poster rating badge container not found');
                continue;
            }

            badgeContainer.appendChild(createRatingListBadge(cachedData, RATING_CLASS_NAME));
        }  catch (error) {
            logger.error(`Error fetching cached data for titles ${titles.join(', ')}`, error);
            continue;
        }
    }
}