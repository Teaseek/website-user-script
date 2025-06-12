import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { format } from "prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
let env = {};
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    env = process.env;
}

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));

const header = fs.readFileSync(path.resolve(__dirname, '../scripts/userscript-header.txt'), 'utf8')
    .replace(/\$\{name\}/g, env.SCRIPT_DISPLAY_NAME || pkg.displayName || pkg.name)
    .replace(/\$\{namespace\}/g, pkg.homepage || '')
    .replace(/\$\{version\}/g, pkg.version)
    .replace(/\$\{description\}/g, pkg.description)
    .replace(/\$\{match\}/g, env.MATCH || '')
    .replace(/\$\{grant\}/g, env.GRANT || '')
    .replace(/\$\{icon\}/g, env.ICON || '')
    .replace(/\$\{runAt\}/g, env.RUN_AT || 'document-end')
    .replace(/\$\{connect\}/g, env.CONNECT || '');
const footer = fs.readFileSync(path.resolve(__dirname, '../scripts/userscript-footer.txt'), 'utf8');

const filePath = path.resolve(__dirname, '../dist', `${env.SCRIPT_NAME || pkg.name}.user.js`);
const code = fs.readFileSync(filePath, 'utf8');

if (code.startsWith('// ==UserScript==')) {
    console.log('Header already present, skipping injection.');
    process.exit(0);
}

const formattedCode = await format(header + code + footer, { parser: "babel", tabWidth: 4, useTabs: false });

fs.writeFileSync(filePath, formattedCode, 'utf8');
console.log('Userscript header injected.');