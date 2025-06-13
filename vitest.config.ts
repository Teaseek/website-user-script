import { defineConfig } from 'vitest/config';
import string from 'vite-plugin-string';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        include: ['tests/**/*.test.ts'],
    },
    plugins: [
        string({
            include: ['**/*.graphql'],
            compress: false,
        }),
    ],
    esbuild: {
        treeShaking: true,
        tsconfigRaw: undefined,
    },
});
