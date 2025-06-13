import { ILogger } from './types';

declare const __PKG_NAME__: string;

export class Logger implements ILogger {
    context = `[${__PKG_NAME__}]:`;

    log(...args: unknown[]): void {
        return console.log(this.context, ...args);
    }
    info(...args: unknown[]): void {
        return console.info(this.context, ...args);
    }
    warn(...args: unknown[]): void {
        return console.warn(this.context, ...args);
    }
    error(...args: unknown[]): void {
        return console.error(this.context, ...args);
    }
    debug(...args: unknown[]): void {
        return console.debug(this.context, ...args);
    }
};