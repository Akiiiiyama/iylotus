// Embute @iylotus/tokens (dist/tokens.json) no código do plugin: o Figma roda um arquivo só, sem acesso à rede.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const tokens = await readFile(require.resolve('@iylotus/tokens/tokens.json'), 'utf8');
const source = await readFile(new URL('../src/code.js', import.meta.url), 'utf8');

if (!source.includes('__IYLOTUS_TOKENS__')) throw new Error('src/code.js precisa ter o marcador __IYLOTUS_TOKENS__');

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
await writeFile(
  new URL('../dist/code.js', import.meta.url),
  `// Gerado por scripts/build.mjs a partir de src/code.js e @iylotus/tokens. Não edite à mão.\n${source.replace('__IYLOTUS_TOKENS__', tokens.trim())}`,
);
console.log('@iylotus/figma-plugin: dist/code.js com os tokens embutidos');
