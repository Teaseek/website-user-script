import { gmFetchRetry, sleep } from "../utils";
import { logger } from "../utils/logger";

declare const __SHIKIMORI_HOST__: string;
declare const __SHIKIMORI_API_DELAY_MS__: string;
declare const __SHIKIMORI_API_RETRY_COUNT__: string;

const DOMAIN = `https://${__SHIKIMORI_HOST__}`;
const API_SEARCH = '/api/animes';
const DELAY_MS = parseFloat(__SHIKIMORI_API_DELAY_MS__) || 1000;
const RETRY_COUNT = parseInt(__SHIKIMORI_API_RETRY_COUNT__, 10) || 3;
const SEARCH_LIMIT = 1;

export async function fetchRatingByTitle(title: string): Promise<{ url: string; rating: string; votes: string }> {
    if (!__SHIKIMORI_HOST__) {
        throw new Error('Shikimori host is not defined');
    }

    const searchUrl = `${DOMAIN}${API_SEARCH}?search=${encodeURIComponent(title)}&limit=${SEARCH_LIMIT}`;
    const results = await gmFetchRetry<{ url: string }[]>(searchUrl, 'json', RETRY_COUNT, DELAY_MS);
    const relUrl = results?.[0]?.url;
    if (!relUrl) throw new Error('Not found');

    await sleep(DELAY_MS);

    const html = await gmFetchRetry<string>(DOMAIN + relUrl, 'text', RETRY_COUNT, DELAY_MS);
    const doc = new DOMParser().parseFromString(html, 'text/html');

    let rating = (doc.querySelector('meta[itemprop="ratingValue"]') as HTMLMetaElement | null)?.content;
    let votes = (doc.querySelector('meta[itemprop="ratingCount"]') as HTMLMetaElement | null)?.content;

    if (!rating || !votes) throw new Error('Not found');

    logger.debug(`Shiki rating for "${title}": ${rating} (${votes} votes)`);

    return { url: DOMAIN + relUrl, rating, votes };
}
