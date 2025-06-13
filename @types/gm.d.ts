export { };

declare global {
    interface GMXMLHttpRequestResponse<T = unknown> {
        finalUrl: string;
        readyState: number;
        status: number;
        statusText: string;
        responseHeaders: string;
        response: T;
        responseXML?: Document | null;
        responseText?: string;
        context?: unknown;
    }

    interface GMXMLHttpRequestOptions<T = unknown> {
        method: string;
        url: string | URL | File | Blob;
        headers?: Record<string, string>;
        data?: string | Blob | File | object | unknown[] | FormData | URLSearchParams;
        redirect?: 'follow' | 'error' | 'manual';
        cookie?: string;
        cookiePartition?: object;
        topLevelSite?: string;
        binary?: boolean;
        nocache?: boolean;
        revalidate?: boolean;
        timeout?: number;
        context?: unknown;
        responseType?: 'arraybuffer' | 'blob' | 'json' | 'stream';
        overrideMimeType?: string;
        anonymous?: boolean;
        fetch?: boolean;
        user?: string;
        password?: string;
        onabort?: () => void;
        onerror?: () => void;
        onloadstart?: (response: GMXMLHttpRequestResponse<T>) => void;
        onprogress?: (response: GMXMLHttpRequestResponse<T>) => void;
        onreadystatechange?: (response: GMXMLHttpRequestResponse<T>) => void;
        ontimeout?: () => void;
        onload?: (response: GMXMLHttpRequestResponse<T>) => void;
    }

    function GM_xmlhttpRequest<T = unknown>(
        options: GMXMLHttpRequestOptions<T>
    ): { abort(): void };

    namespace GM {
        function xmlHttpRequest<T = unknown>(
            options: GMXMLHttpRequestOptions<T>
        ): Promise<GMXMLHttpRequestResponse<T>> & { abort(): void };
    }
}