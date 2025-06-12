export { };

declare global {
    var __SHIKIMORI_HOST__: string;
    var __SHIKIMORI_API_DELAY_MS__: string;
    var __SHIKIMORI_API_RETRY_COUNT__: string;
    var __CACHE_PREFIX__: string;
    var __CACHE_TTL_MS__: string;
    var __PKG_NAME__: string;

    var GM_xmlhttpRequest: (options: {
        method: string;
        url: string;
        responseType?: string;
        onload: (res: { status: number; response: unknown }) => void;
        onerror?: () => void;
        ontimeout?: () => void;
    }) => void;
}