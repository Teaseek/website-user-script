export function GM_xmlhttpRequest(options: {
    method: string;
    url: string;
    responseType?: string;
    onload: (res: { status: number; response: unknown }) => void;
    onerror?: () => void;
    ontimeout?: () => void;
}): void {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
        controller.abort();
        options.ontimeout?.();
    }, 5000);

    fetch(options.url, { method: options.method, signal: controller.signal })
        .then(async (resp) => {
            clearTimeout(timeout);
            let response: unknown;
            if (options.responseType === "json") {
                response = await resp.json();
            } else if (options.responseType === "arraybuffer") {
                response = await resp.arrayBuffer();
            } else if (options.responseType === "blob") {
                response = await resp.blob();
            } else {
                response = await resp.text();
            }
            options.onload({ status: resp.status, response });
        })
        .catch((e) => {
            clearTimeout(timeout);
            if (e.name === "AbortError") {
                // Таймаут уже вызвал ontimeout
                return;
            }
            options.onerror?.();
        });
};