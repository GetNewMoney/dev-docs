import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const errors = [];
const required = [
  'README.md',
  'SECURITY.md',
  'docs/getting-started.md',
  'docs/authentication.md',
  'docs/concepts/mint-requests.md',
  'docs/concepts/payment-lifecycle.md',
  'docs/resources/errors.md',
  'reference/openapi.yaml',
];

for (const relativePath of required) {
  if (!fs.existsSync(path.join(root, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

const patterns = [
  { label: 'private key', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { label: 'GitHub token', regex: /\bgh[opusr]_[A-Za-z0-9_]{20,}\b/ },
  { label: 'DNZD API key', regex: /\bdnzd_(?:test|live)_[A-Za-z0-9_-]{20,}\b/ },
  { label: 'Basic credential', regex: /Authorization["':\s]+Basic\s+[A-Za-z0-9+/=]{24,}/i },
  { label: 'n8n webhook', regex: /https:\/\/[^/\s]+\/webhook\/[A-Za-z0-9_-]+/i },
];

const ignoredDirectories = new Set(['.git', '.claude', '.codex', 'node_modules']);

function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      scan(absolute);
      continue;
    }

    const content = fs.readFileSync(absolute, 'utf8');
    for (const pattern of patterns) {
      if (pattern.regex.test(content)) {
        errors.push(`${path.relative(root, absolute)}: possible ${pattern.label}`);
      }
    }

    if (path.extname(absolute) === '.md') {
      const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
      for (const match of content.matchAll(linkPattern)) {
        const target = match[1].split('#')[0];
        if (!target || /^(?:https?:|mailto:)/.test(target)) continue;

        const resolved = path.resolve(path.dirname(absolute), target);
        if (!fs.existsSync(resolved)) {
          errors.push(
            `${path.relative(root, absolute)}: broken local link to ${target}`
          );
        }
      }
    }
  }
}

scan(root);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Developer documentation structure and secret patterns validated.');
