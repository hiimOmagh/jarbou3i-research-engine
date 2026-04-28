import fs from 'node:fs';

const fail = (message) => {
  console.error(`Accessibility static check failed: ${message}`);
  process.exit(1);
};

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('src/app.js', 'utf8');
const html = index + '\n' + app;

if (!/<html[^>]+lang="ar"[^>]+dir="rtl"/.test(index)) fail('root html must define initial lang and dir');
if (!index.includes('name="viewport"')) fail('viewport meta tag missing');
if (!index.includes('aria-live="polite"')) fail('aria-live region missing');
if (!index.includes('role="dialog"')) fail('modal dialog role missing');
if (!index.includes('aria-modal="true"')) fail('modal aria-modal missing');
if (!index.includes('aria-labelledby="modalTitle"')) fail('modal labelling missing');
if (!index.includes('role="tablist"')) fail('tablist role missing');
if (!app.includes('role="tab"')) fail('runtime tabs must use role tab');
if (!app.includes('aria-selected')) fail('runtime tabs must set aria-selected');
if (!app.includes('aria-current="step"')) fail('current stage marker missing');

const imgTags = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
for (const tag of imgTags) {
  if (!/\balt="[^"]*"/.test(tag)) fail(`image without alt attribute: ${tag}`);
}

const buttonTags = [...html.matchAll(/<button\b[^>]*>/g)].map((m) => m[0]);
for (const tag of buttonTags) {
  if (!/\btype="button"/.test(tag)) fail(`button without explicit type=button: ${tag}`);
}

if (!/\.srOnly/.test(fs.readFileSync('src/styles.css', 'utf8'))) fail('screen-reader utility class missing');
if (!/:focus-visible/.test(fs.readFileSync('src/styles.css', 'utf8'))) fail('focus-visible styling missing');

console.log('Accessibility static checks passed.');
process.exit(0);
