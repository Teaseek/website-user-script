import { describe, it, expect } from 'vitest';
import { formatRating, formatVotes } from '../src/utils/format';

describe('utils/format', () => {
    it('formatRating should format numbers to 2 decimals with comma', () => {
        expect(formatRating('7.123')).toBe('7,123');
        expect(formatRating(8)).toBe('8');
        expect(formatRating('bad')).toBe('0');
    });

    it('formatVotes should format numbers with separator', () => {
        expect(formatVotes('12345123')).toBe('12,345,123');
        expect(formatVotes(1000)).toBe('1,000');
        expect(formatVotes('bad')).toBe('0');
    });
});
