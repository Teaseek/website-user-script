import { fetchRetry } from "../utils/fetchAdapter";
import { RetryOptions } from "../utils/retry";

export async function getRatingCount(url: string, retryOptions?: RetryOptions): Promise<string> {
    const html = await fetchRetry<string>({ url, method: "GET" }, retryOptions);
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const votes = (doc.querySelector('meta[itemprop="ratingCount"]') as HTMLMetaElement | null)?.content ?? '0';

    return votes;
}