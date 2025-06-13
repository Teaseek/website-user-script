import { describe, it, expect } from 'vitest';
import { getTitles, getDetailsCell } from '../src/parse/kp-website';
import { createRatingBadge } from '../src/views/kp-badge';

describe('kp-website parse', () => {
    it('getTitles should parse titles from document.title', () => {
        document.title = 'Наруто / Naruto';
        expect(getTitles()).toEqual(['Naruto', 'Наруто']);
    });

    it('getDetailsCell should return null if not found', () => {
        document.body.innerHTML = '';
        expect(getDetailsCell()).toBeNull();
    });
});

describe('kp-website createBadge', () => {
    it('should create a badge with correct content', () => {
        const data = { url: 'https://test', rating: '6.99', votes: '15488' };
        const badge = createRatingBadge(data, 'shikimori');

        expect(badge.outerHTML).toContain('class="m-r-md shikimori"');
        expect(badge.innerHTML).toContain('img-responsive kinopoisk');
        expect(badge.innerHTML).toContain('https://shikimori.one/favicons/favicon-192x192.png');
        expect(badge.innerHTML).toContain('href="https://test"');
        expect(badge.innerHTML).toContain('6,99');
        expect(badge.innerHTML).toContain('15,488');
    });
});
