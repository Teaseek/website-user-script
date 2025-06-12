import { defineConfig } from 'vite';
import pkg from './package.json';
import dotenv from 'dotenv';

dotenv.config();

const CACHE_PREFIX = `${pkg.name}_cache_${pkg.version}`;
const CACHE_TTL_MS = process.env.CACHE_TTL_MS ? Number(process.env.CACHE_TTL_MS) : 24 * 60 * 60 * 1000;

export default defineConfig({
    define: {
        __SHIKIMORI_HOST__: JSON.stringify(process.env.SHIKIMORI_HOST || 'shikimori.one'),
        __SHIKIMORI_API_DELAY_MS__: JSON.stringify(process.env.SHIKIMORI_API_DELAY_MS || 300),
        __SHIKIMORI_API_RETRY_COUNT__: JSON.stringify(process.env.SHIKIMORI_API_RETRY_COUNT || 3),
        __CACHE_PREFIX__: JSON.stringify(CACHE_PREFIX),
        __CACHE_TTL_MS__: JSON.stringify(CACHE_TTL_MS),
        __PKG_NAME__: JSON.stringify(pkg.name),
    },
    build: {
        lib: {
            entry: 'src/main.ts',
            formats: ['es'],
            fileName: () => `${process.env.SCRIPT_NAME || pkg.name}.user.js`,
        },
        emptyOutDir: true,
        outDir: 'dist',
        minify: false,
    },
});
