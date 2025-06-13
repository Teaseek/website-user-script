import { formatRating, formatVotes } from "../utils/format";

export function createRatingBadge({ url, rating = '0', votes = '0' }: { url: string, rating?: string, votes?: string; }, className: string): HTMLElement {
    const span = document.createElement('span');
    span.className = `m-r-md ${className}`;
    span.innerHTML = `
        <img src="https://shikimori.one/favicons/favicon-192x192.png" class="img-responsive kinopoisk" alt="Shikimori">
        <a class="text-success" href="${url}" rel="nofollow" target="_blank">${formatRating(rating)}</a>
        / <small>${formatVotes(votes)}</small>
    `;
    return span;
}
