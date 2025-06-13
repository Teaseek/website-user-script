import { ICacheService } from './types';

declare const __CACHE_PREFIX__: string;
declare const __CACHE_TTL_MS__: number;

export interface ICacheRecord {
    data: {
        url: string;
        rating: string;
        votes: string;
    };
    date: number;
}

export class CacheService implements ICacheService {
    getCacheKey(type: string, title: string): string {
        return `${__CACHE_PREFIX__}_${type}_${encodeURIComponent(title)}`;
    }

    saveToCache<T>(type: string, title: string, data: T): void {
        try {
            const record = {
                data,
                date: Date.now(),
            };
            localStorage.setItem(this.getCacheKey(type, title), JSON.stringify(record));
        } catch {
            // skip
        }
    }

    loadFromCache<T>(type: string, title: string): { data: T; date: number } | null {
        try {
            const record = localStorage.getItem(this.getCacheKey(type, title));
            if (!record) return null;
            return JSON.parse(record)  as { data: T; date: number };
        } catch {
            return null;
        }
    }

    isCacheExpired(cache: { date?: number }): boolean {
        if (!cache?.date) return true;
        return (Date.now() - cache.date) > __CACHE_TTL_MS__;
    }
}