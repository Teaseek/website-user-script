export interface RetryOptions {
    retries?: number;
    delay?: number;
}

export function retry<T>(
    fn: () => Promise<T>,
    {
        retries = 3,
        delay = 1000
    }: RetryOptions = {}
): Promise<T> {
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