import { retry, RetryOptions } from "./retry";

export async function fetchAdapter<T>({
  url,
  method = "GET",
  responseType,
  body,
  headers,
}: {
  url: string,
  method: string,
  responseType?: "json" | "blob" | "arraybuffer" | "stream" | undefined,
  body?: string,
  headers?: Record<string, string>,
}): Promise<T> {
  const response = await GM.xmlHttpRequest<T>({
    url,
    method,
    headers,
    data: body,
    responseType,
  });

  if (response.status >= 200 && response.status < 300) {
    return response.response;
  }

  throw new Error(`HTTP Error: ${response.status}`);
}

export function fetchRetry<T>(
  data: {
    url: string,
    method: string,
    responseType?: "json" | "blob" | "arraybuffer" | "stream" | undefined,
    body?: string,
    headers?: Record<string, string>,
  },
  retryOptions: RetryOptions = {},
): Promise<T> {
  return retry(() => fetchAdapter<T>(data), retryOptions);
}
