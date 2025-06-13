import { describe, it, expect, beforeEach } from 'vitest';
import { CacheService } from '../src/services/cache-service';
import { initEnv } from './utils/env';
import { vi } from 'vitest';
import { ICacheService } from '../src/services/types';

describe('services/cacheService', () => {
    let cacheService: ICacheService;

    beforeEach(() => {
        initEnv();

        globalThis.localStorage = window.localStorage;
        localStorage.clear();
        cacheService = new CacheService();
    });

    it('getCacheKey should generate correct key', () => {
        expect(cacheService.getCacheKey('shiki', 'Title')).toBe('test-cache_1.0.0_shiki_Title');
    });
    it('saveToCache should save data to localStorage', () => {
        const data = { url: 'https://example.com', rating: '8.5', votes: '1000' };
        cacheService.saveToCache('shiki', 'Title', data);

        const record = localStorage.getItem('test-cache_1.0.0_shiki_Title');
        expect(record).not.toBeNull();

        const parsed = JSON.parse(record!);
        expect(parsed.data).toEqual(data);
        expect(parsed.date).toBeDefined();
    });
    it('loadFromCache should load data from localStorage', () => {
        vi.useFakeTimers();

        const data = { url: 'https://example.com', rating: '8.5', votes: '1000' };
        const date = Date.now();
        cacheService.saveToCache('shiki', 'Title', data);

        const loaded = cacheService.loadFromCache('shiki', 'Title');
        expect(loaded).toEqual({
            data,
            date: date,
        });

        vi.useRealTimers();
    });
    it('isCacheExpired should return true for expired cache', () => {
        vi.useFakeTimers();
        const data = { url: 'https://example.com', rating: '8.5', votes: '1000' };
        cacheService.saveToCache('shiki', 'Title', data);

        vi.advanceTimersByTime(2000);

        const loaded = cacheService.loadFromCache('shiki', 'Naruto');
        expect(cacheService.isCacheExpired(loaded!)).toBe(true);

        vi.useRealTimers();
    });
});
