import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vitest from "eslint-plugin-vitest";
import { defineConfig } from "eslint/config";

export default defineConfig([
    { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.browser } },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                sourceType: "module"
            }
        },
        plugins: { "@typescript-eslint": tseslint },
        rules: {
            ...tseslint.configs.recommended.rules,
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "@typescript-eslint/no-explicit-any": "warn"
        }
    },
    {
        files: ["tests/**/*.ts"],
        plugins: { vitest },
        languageOptions: { globals: globals.node },
        rules: {
            ...vitest.configs.recommended.rules
        }
    },
    { ignores: ["scripts/**", "dist/**", "vite.config.ts", "vitest.config.ts"] },
]);
