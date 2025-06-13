export type ServiceMap = Record<string | symbol, unknown>;

export class SimpleContainer {
    private services: ServiceMap = {};
    set<T>(key: string | symbol, value: T): void {
        this.services[key] = value;
    }
    get<T>(key: string | symbol): T {
        if (!(key in this.services)) throw new Error(`Service not found: ${String(key)}`);
        return this.services[key] as T;
    }
    has(key: string | symbol): boolean {
        return key in this.services;
    }
}