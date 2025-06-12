export declare const GM_xmlhttpRequest: (options: {
    method: string;
    url: string;
    responseType?: string;
    onload: (res: { status: number; response: unknown }) => void;
    onerror?: () => void;
    ontimeout?: () => void;
}) => void;

export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry<T>(fn: () => Promise<T>, retries: number = 3, delay: number = 1000): Promise<T> {
    return new Promise((resolve, reject) => {
        const attempt = (n: number): void => {
            fn()
                .then(resolve)
                .catch(err => {
                    if (n <= 1) {
                        reject(err);
                    } else {
                        setTimeout(() => attempt(n - 1), delay);
                    }
                });
        };
        attempt(retries);
    });
}

export function gmFetch<T>(url: string, responseType: 'json' | 'text' = 'json'): Promise<T> {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            responseType,
            onload: res => {
                if (res.status === 200) resolve(res.response as T);
                else reject(new Error(`Status ${res.status}`));
            },
            onerror: () => reject(new Error('Network error')),
            ontimeout: () => reject(new Error('Timeout')),
        });
    });
}

export function gmFetchRetry<T>(url: string, responseType: 'json' | 'text' = 'json', retries: number = 3, delay: number = 1000): Promise<T> {
    return retry(() => gmFetch<T>(url, responseType), retries, delay);
}