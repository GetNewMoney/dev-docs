import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const output = path.join(root, '.site-source');
const sources = [
  'README.md',
  'SECURITY.md',
  'docs',
  'examples',
  'reference',
];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const source of sources) {
  fs.cpSync(path.join(root, source), path.join(output, source), {
    recursive: true,
  });
}

console.log('Prepared documentation source in .site-source.');
