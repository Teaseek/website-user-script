import fs from 'fs';
import path from 'path';

const pkgPath = path.resolve('package.json');
const envPath = path.resolve('.env');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
let [major, minor, patch] = pkg.version.split('.').map(Number);
patch++;
const newVersion = `${major}.${minor}.${patch}`;
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf-8');
    env = env.replace(/^VERSION=.*$/m, `VERSION=${newVersion}`);
    fs.writeFileSync(envPath, env);
}

console.log('Version bumped to', newVersion);
