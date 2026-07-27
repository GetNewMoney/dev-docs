import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const siteDirectory = path.resolve(process.argv[2] || '.site');
const referenceDirectory = path.join(siteDirectory, 'reference');
const specification = path.resolve('reference/openapi.yaml');

fs.mkdirSync(referenceDirectory, { recursive: true });
fs.copyFileSync(specification, path.join(referenceDirectory, 'openapi.yaml'));

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="New Money DNZD DEV API reference">
    <title>New Money DNZD API Reference</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%2300776f'/><text x='50' y='66' text-anchor='middle' font-size='48' fill='white' font-family='sans-serif'>NM</text></svg>">
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; background: #f8faf9; }
      .portal-bar {
        align-items: center;
        background: #062f2c;
        color: #fff;
        display: flex;
        font: 600 14px/1.2 "IBM Plex Sans", sans-serif;
        justify-content: space-between;
        min-height: 52px;
        padding: 0 24px;
      }
      .portal-bar a { color: #fff; text-decoration: none; }
      .portal-bar nav { display: flex; gap: 20px; }
      .portal-bar nav a:last-child { color: #ffb15c; }
      @media (max-width: 640px) {
        .portal-bar { padding: 0 14px; }
        .portal-bar nav { gap: 12px; }
      }
    </style>
  </head>
  <body>
    <header class="portal-bar">
      <a href="../">New Money Developer</a>
      <nav aria-label="Developer portal">
        <a href="../docs/">Docs</a>
        <a href="./" aria-current="page">API Reference</a>
      </nav>
    </header>
    <main id="redoc"></main>
    <script src="https://cdn.redoc.ly/redoc/v2.5.3/bundles/redoc.standalone.js"></script>
    <script>
      Redoc.init('./openapi.yaml', {
        hideHostname: false,
        nativeScrollbars: true,
        theme: {
          colors: {
            primary: { main: '#00776f' },
            success: { main: '#00776f' }
          },
          typography: {
            fontFamily: '"IBM Plex Sans", sans-serif',
            headings: { fontFamily: '"IBM Plex Sans", sans-serif' },
            code: { fontFamily: '"IBM Plex Mono", monospace' }
          },
          sidebar: { backgroundColor: '#eef5f3' },
          rightPanel: { backgroundColor: '#102f2d' }
        }
      }, document.getElementById('redoc'));
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(referenceDirectory, 'index.html'), html);
console.log(`Built API reference in ${referenceDirectory}.`);
