import { describe, it, expect } from 'vitest';
import { createRatingBadge } from '../src/views/kp-badge';

describe('views/kp-badge', () => {
    it('should create a badge element with correct content', () => {
        const badge = createRatingBadge({ url: 'https://test', rating: '7.5', votes: '1234' }, 'test-class');
        document.body.appendChild(badge);
        expect(badge.outerHTML).toContain('test-class');
        expect(badge.innerHTML).toContain('7,5');
        expect(badge.innerHTML).toContain('1,234');
    });
});
