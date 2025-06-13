import { xmlHttpRequest } from "./gm-xml-http-request";

export const initEnv = (): void => {
    globalThis.__SHIKIMORI_API_HOST__ = 'shikimori.one/api/graphql';
    globalThis.__SHIKIMORI_API_DELAY_MS__ = '300';
    globalThis.__SHIKIMORI_API_RETRY_COUNT__ = '3';
    globalThis.__PKG_NAME__ = 'test-package';
    globalThis.__CACHE_PREFIX__ = 'test-cache_1.0.0';
    globalThis.__CACHE_TTL_MS__ = '1000';
    if (!globalThis.GM) globalThis.GM = {} as typeof GM;
    globalThis.GM.xmlHttpRequest = xmlHttpRequest;
};