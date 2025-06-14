import { describe, it, expect } from 'vitest';
import { createRatingViewBadge, createRatingPosterBadge } from '../src/views/kp-website';
import { beforeEach } from 'vitest';

describe('views/kp-badge', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should create a badge element with correct content', () => {
        const badge = createRatingViewBadge({ url: 'https://test', rating: '7.5', votes: '1234' }, 'test-class');
        document.body.appendChild(badge);
        expect(badge.outerHTML).toContain('test-class');
        expect(badge.innerHTML).toContain('https://test');
        expect(badge.innerHTML).toContain('7,5');
        expect(badge.innerHTML).toContain('1,234');
    });

    it('should create a poster badge element with correct content', () => {
        const badge = createRatingPosterBadge({ url: 'https://test', rating: '8.0' }, 'poster-class');
        document.body.appendChild(badge);
        expect(badge.innerHTML).toContain('https://test');
        expect(badge.outerHTML).toContain('poster-class');
        expect(badge.innerHTML).toContain('8');
    });
});
