declare const __CACHE_PREFIX__: string;
declare const __CACHE_TTL_MS__: number;

export function getCacheKey(type: string, title: string): string {
    return `${__CACHE_PREFIX__}_${type}_${encodeURIComponent(title)}`;
}

export function saveToCache(type: string, title: string, data: unknown): void {
    try {
        const record = {
            data,
            date: Date.now(),
        };
        localStorage.setItem(getCacheKey(type, title), JSON.stringify(record));
    } catch {
        // skip
    }
}

export function loadFromCache(type: string, title: string): { data: { url: string; rating: string; votes: string }; date: number } | null {
    try {
        const record = localStorage.getItem(getCacheKey(type, title));
        if (!record) return null;
        return JSON.parse(record);
    } catch {
        return null;
    }
}

export function isCacheExpired(cache: { date?: number }): boolean {
    if (!cache?.date) return true;
    return (Date.now() - cache.date) > __CACHE_TTL_MS__;
}
