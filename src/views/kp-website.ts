import { formatRating, formatVotes } from "../utils/format";

const SHIKIMORI_ICON  = 'https://shikimori.one/favicons/favicon-192x192.png';

export function createRatingViewBadge({ url, rating = '0', votes = '0' }: { url: string, rating?: string, votes?: string; }, className: string): HTMLElement {
    const span = document.createElement('span');
    span.className = `m-r-md ${className}`;
    span.innerHTML = `
        <img src="${SHIKIMORI_ICON}" class="img-responsive kinopoisk" alt="Shikimori">
        <a class="text-success" href="${url}" rel="nofollow" target="_blank">${formatRating(rating)}</a>
        / <small>${formatVotes(votes)}</small>
    `;
    return span;
}

export function createRatingPosterBadge({ url, rating = '0' }: { url: string, rating?: string }, className: string): HTMLElement {
    const span = document.createElement('span');
    span.className = `m-r-xs ${className}`;
    span.innerHTML = `
        <a href="${url}" target="_blank" rel="nofollow">
            <img src="${SHIKIMORI_ICON}" class="img-responsive kinopoisk" alt="Shikimori">
            ${formatRating(rating)}
        </a>
    `;
    return span;
}

export function createRatingListBadge({ url, rating = '0' }: { url: string, rating?: string }, className: string): HTMLElement {
    const li = document.createElement('li');
    li.className = `list-inline-item ${className}`;
    li.innerHTML = `
        <img src="${SHIKIMORI_ICON}" class="img-responsive kinopoisk" alt="Shikimori">
        <a class="text-success" href="${url}" rel="nofollow" target="_blank">${formatRating(rating)}</a>
    `;
    return li;
}
