import { describe, it, expect, beforeEach } from 'vitest';
import { getCacheKey, saveToCache, loadFromCache, isCacheExpired } from '../src/cache';
import { vi } from 'vitest';

describe('cache', () => {
    beforeEach(() => {
        globalThis.localStorage = window.localStorage;
        localStorage.clear();
        vi.useRealTimers();

        globalThis.__CACHE_PREFIX__ = 'test_cache_1_0_0';
        globalThis.__CACHE_TTL_MS__ = "1000";
    });

    it('getCacheKey should generate correct key', () => {
        expect(getCacheKey('shiki', 'Title')).toBe('test_cache_1_0_0_shiki_Title');
    });
    it('saveToCache should save data to localStorage', () => {
        const data = { url: 'https://example.com', rating: '8.5', votes: '1000' };
        saveToCache('shiki', 'Title', data);

        const record = localStorage.getItem('test_cache_1_0_0_shiki_Title');
        expect(record).not.toBeNull();

        const parsed = JSON.parse(record!);
        expect(parsed.data).toEqual(data);
        expect(parsed.date).toBeDefined();
    });
    it('loadFromCache should load data from localStorage', () => {
        vi.useFakeTimers();

        const data = { url: 'https://example.com', rating: '8.5', votes: '1000' };
        const date = Date.now();
        saveToCache('shiki', 'Title', data);

        const loaded = loadFromCache('shiki', 'Title');
        expect(loaded).toEqual({
            data,
            date: date,
        });

        vi.useRealTimers();
    });
    it('isCacheExpired should return true for expired cache', () => {
        vi.useFakeTimers();
        const data = { url: 'https://example.com', rating: '8.5', votes: '1000' };
        saveToCache('shiki', 'Title', data);

        vi.advanceTimersByTime(2000);

        const loaded = loadFromCache('shiki', 'Naruto');
        expect(isCacheExpired(loaded!)).toBe(true);

        vi.useRealTimers();
    });
});