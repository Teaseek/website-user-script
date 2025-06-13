

function buildResponse<T>(resp: Response, body: unknown, options: GMXMLHttpRequestOptions<T>, context?: unknown): GMXMLHttpRequestResponse<T> {
    return {
        finalUrl: resp.url,
        readyState: 4,
        status: resp.status,
        statusText: resp.statusText,
        responseHeaders: Array.from(resp.headers.entries()).map(([k, v]) => `${k}: ${v}`).join('\r\n'),
        response: body as T,
        responseXML: undefined,
        responseText: typeof body === 'string' ? body : undefined,
        context,
    };
}

export function GM_xmlhttpRequest<T = unknown>(options: GMXMLHttpRequestOptions<T>): { abort(): void } {
    let aborted = false;
    let controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let context = options.context;

    const setReadyState = (state: number, resp?: GMXMLHttpRequestResponse<T>): void => {
        options.onreadystatechange?.(resp!);
    };

    const fetchOptions: RequestInit = {
        method: options.method,
        headers: options.headers,
        signal: controller.signal,
        credentials: options.anonymous ? 'omit' : 'same-origin',
        body: options.data instanceof FormData || typeof options.data === 'string' || options.data instanceof Blob || options.data instanceof File ? options.data : undefined,
    };
    if (options.user && options.password) {
        fetchOptions.headers = fetchOptions.headers || {};
        (fetchOptions.headers as Record<string, string>)[
            'Authorization'
        ] = 'Basic ' + btoa(`${options.user}:${options.password}`);
    }
    if (options.overrideMimeType && fetchOptions.headers) {
        (fetchOptions.headers as Record<string, string>)['Content-Type'] = options.overrideMimeType;
    }

    if (options.timeout) {
        timeoutId = setTimeout(() => {
            controller.abort();
            options.ontimeout?.();
        }, options.timeout);
    }

    fetch(typeof options.url === 'string' ? options.url : options.url.toString(), fetchOptions)
        .then(async (resp) => {
            if (aborted) return;
            if (timeoutId) clearTimeout(timeoutId);
            let body: unknown;
            let contentType = resp.headers.get('content-type') || '';
            if (options.responseType === 'json') {
                if (contentType.includes('application/json')) {
                    body = await resp.json();
                } else {
                    body = undefined;
                }
            } else if (options.responseType === 'arraybuffer') {
                body = await resp.arrayBuffer();
            } else if (options.responseType === 'blob') {
                body = await resp.blob();
            } else {
                body = await resp.text();
            }
            const response = buildResponse<T>(resp, body, options, context);
            options.onload?.(response);
            setReadyState(4, response);
        })
        .catch((e) => {
            if (timeoutId) clearTimeout(timeoutId);
            if (aborted) {
                options.onabort?.();
                return;
            }
            if (e.name === 'AbortError') {
                options.ontimeout?.();
                return;
            }
            options.onerror?.();
        });

    setReadyState(1);
    options.onloadstart?.({
        finalUrl: typeof options.url === 'string' ? options.url : options.url.toString(),
        readyState: 1,
        status: 0,
        statusText: '',
        responseHeaders: '',
        response: undefined as unknown as T,
        context,
    });

    return {
        abort(): void {
            aborted = true;
            controller.abort();
            options.onabort?.();
        },
    };
}

export function xmlHttpRequest<T = unknown>(options: GMXMLHttpRequestOptions<T>): Promise<GMXMLHttpRequestResponse<T>> & { abort(): void } {
    let controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let context = options.context;
    let aborted = false;
    const promise = new Promise<GMXMLHttpRequestResponse<T>>((resolve, reject) => {
        if (options.timeout) {
            timeoutId = setTimeout(() => {
                controller.abort();
                options.ontimeout?.();
                reject(new Error('timeout'));
            }, options.timeout);
        }
        fetch(typeof options.url === 'string' ? options.url : options.url.toString(), {
            method: options.method,
            headers: options.headers,
            signal: controller.signal,
            credentials: options.anonymous ? 'omit' : 'same-origin',
            body: options.data instanceof FormData || typeof options.data === 'string' || options.data instanceof Blob || options.data instanceof File ? options.data : undefined,
        })
            .then(async (resp) => {
                if (aborted) return;
                if (timeoutId) clearTimeout(timeoutId);
                let body: unknown;
                const contentType = resp.headers.get('content-type') || '';
                if (options.responseType === 'json') {
                    if (contentType.includes('application/json')) {
                        try {
                            body = await resp.json();
                        } catch (e) {
                            options.onerror?.();
                            reject(e);
                            return;
                        }
                    } else {
                        body = undefined;
                    }
                } else if (options.responseType === 'arraybuffer') {
                    body = await resp.arrayBuffer();
                } else if (options.responseType === 'blob') {
                    body = await resp.blob();
                } else {
                    body = await resp.text();
                }
                const response = buildResponse<T>(resp, body, options, context);
                resolve(response);
            })
            .catch((e) => {
                if (timeoutId) clearTimeout(timeoutId);
                if (aborted) {
                    options.onabort?.();
                    reject(new Error('aborted'));
                    return;
                }
                if (e.name === 'AbortError') {
                    options.ontimeout?.();
                    reject(new Error('timeout'));
                    return;
                }
                options.onerror?.();
                reject(e);
            });
    }) as Promise<GMXMLHttpRequestResponse<T>> & { abort(): void };
    (promise as unknown as { abort(): void }).abort = function (): void {
        aborted = true;
        controller.abort();
        options.onabort?.();
    };
    return promise;
}