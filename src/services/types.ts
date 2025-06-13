export interface ICacheService {
    getCacheKey(type: string, title: string): string;
    saveToCache<T>(type: string, title: string, data: T): void;
    loadFromCache<T>(type: string, title: string): { data: T; date: number } | null;
    isCacheExpired(cache: { date?: number }): boolean;
}

export interface ILogger {
    log(...args: unknown[]): void;
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    debug(...args: unknown[]): void;
}