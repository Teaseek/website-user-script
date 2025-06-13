import { describe, it, expect, beforeEach } from 'vitest';
import { createRatingBadge } from '../src/views/kp-badge';

describe('createBadge', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    it('should create a badge element with correct content', () => {
        const badge = createRatingBadge({ url: 'https://test', rating: '7.5', votes: '1234' }, 'test-class');
        document.body.appendChild(badge);
        expect(badge.outerHTML).toContain('test-class');
        expect(badge.innerHTML).toContain('7,5');
        expect(badge.innerHTML).toContain('1,234');
    });
});
