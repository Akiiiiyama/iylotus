// Junta o CSS de cada componente (src/**/Componente.css) em dist/styles.css.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';

const src = new URL('../src/', import.meta.url);
const dirs = (await readdir(src, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();

const parts = [];
for (const dir of dirs) {
  const file = new URL(`${dir}/${dir}.css`, src);
  try { parts.push(await readFile(file, 'utf8')); } catch { /* componente sem CSS */ }
}

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/styles.css', import.meta.url), `/* @iylotus/react · gerado. Use junto com @iylotus/styles. */\n\n${parts.join('\n')}`);
console.log(`@iylotus/react: CSS de ${parts.length} componente(s) → dist/styles.css`);
