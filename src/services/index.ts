import { SimpleContainer } from '../utils/di';
import { Logger } from './logger';
import { CacheService } from './cacheService';

export const TYPES = {
    Logger: Symbol('Logger'),
    Cache: Symbol('Cache'),
};

export const container = new SimpleContainer();

container.set(TYPES.Cache, new CacheService());
container.set(TYPES.Logger, new Logger());