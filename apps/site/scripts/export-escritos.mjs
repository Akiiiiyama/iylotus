// Exporta os textos do repositório público pilulas-ia (guias e artigos) para o site.
// O site nunca lê o repositório direto: ele usa a cópia em content/escritos/, versionada como o study-graph.json.
//
// O que o script faz em cada texto:
//   - lê o cabeçalho (data, temas, rascunho, fonte, linkedin), o título (#) e o resumo (primeira citação >);
//   - tira do corpo o título, o resumo e a linha "Read in English / Leia em português" (o site tem a troca de idioma);
//   - troca os links entre textos por links do site (/pt/escritos/<slug>) e os outros links relativos pelo GitHub;
//   - confere tudo contra a lista privada de palavras bloqueadas e para se encontrar alguma.
//
// Uso (na raiz do repositório):
//   node apps/site/scripts/export-escritos.mjs [caminho/para/pilulas-ia] [--rascunhos]
// Padrões: ~/pilulas-ia e a lista em ~/IA_Studies/privado/palavras-bloqueadas.txt (ou ESCRITOS_BLOQUEIO=caminho).
// --rascunhos inclui os textos com "rascunho: true", só para revisar localmente. Rode sem ele antes de commitar.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, posix } from 'node:path';

const args = process.argv.slice(2);
const comRascunhos = args.includes('--rascunhos');
const src = args.find((a) => !a.startsWith('--')) || `${homedir()}/pilulas-ia`;
const bloqueioPath = process.env.ESCRITOS_BLOQUEIO || `${homedir()}/IA_Studies/privado/palavras-bloqueadas.txt`;
const out = new URL('../content/escritos/', import.meta.url).pathname;

const REPO = 'https://github.com/Akiiiiyama/pilulas-ia';
const LANGS = ['pt', 'en'];
const TIPOS = { guias: 'guia', artigos: 'artigo' };

// ---------- trava de privacidade ----------
if (!existsSync(bloqueioPath)) {
  console.error(`Lista de palavras bloqueadas não encontrada em ${bloqueioPath}.\nSem ela o export não roda, para nada sair sem a conferência.`);
  process.exit(1);
}
const semAcento = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const bloqueadas = readFileSync(bloqueioPath, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const problemas = [];
const conferir = (texto, onde) => {
  const linhas = semAcento(texto).split('\n');
  for (const palavra of bloqueadas) {
    const p = semAcento(palavra);
    linhas.forEach((l, i) => { if (l.includes(p)) problemas.push(`${onde}: "${palavra}" em ${l.trim().slice(0, 60)}…`); });
  }
};

// ---------- leitura ----------
function lerCabecalho(texto) {
  const m = texto.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { meta: {}, corpo: texto };
  const meta = {};
  let grupo = null; // chave com valores aninhados, como "fonte:"
  const valor = (v) => {
    if (v.startsWith('[')) return v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    if (v === 'true' || v === 'false') return v === 'true';
    return v.replace(/^["']|["']$/g, '');
  };
  for (const linha of m[1].split('\n')) {
    // o comentário precisa de espaço antes do #, senão um link com âncora seria cortado
    const kv = linha.match(/^(\s*)(\w+):\s*(.*?)(?:\s+#.*)?$/);
    if (!kv) continue;
    const [, recuo, k, v] = kv;
    if (recuo && grupo) { grupo[k] = valor(v); continue; }
    if (!v) { grupo = meta[k] = {}; continue; }
    grupo = null;
    meta[k] = valor(v);
  }
  return { meta, corpo: texto.slice(m[0].length) };
}

const semMarkdown = (s) => s.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`]/g, '').trim();

function separar(corpo, arquivo) {
  const linhas = corpo.replace(/^\n+/, '').split('\n');
  if (!linhas[0]?.startsWith('# ')) throw new Error(`${arquivo}: o texto precisa começar com um título (# ...)`);
  const titulo = semMarkdown(linhas[0].slice(2));
  let i = 1;
  const pular = () => { while (i < linhas.length && linhas[i].trim() === '') i++; };
  pular();
  // linha de idioma do GitHub: *[Read in English](en.md)* ou *[Leia em português](pt.md)*
  if (/^\*\[[^\]]+\]\((pt|en)\.md\)\*$/.test(linhas[i]?.trim() ?? '')) { i++; pular(); }
  let resumo = '';
  if (linhas[i]?.startsWith('>')) {
    const bloco = [];
    while (i < linhas.length && linhas[i].startsWith('>')) bloco.push(linhas[i++].replace(/^>\s?/, ''));
    resumo = bloco.join(' ').trim();
  }
  return { titulo, resumo, md: linhas.slice(i).join('\n').replace(/^\n+/, '') };
}

// ---------- coleta ----------
const textos = [];
for (const [pasta, tipo] of Object.entries(TIPOS)) {
  const dir = join(src, pasta);
  if (!existsSync(dir)) continue;
  for (const slug of readdirSync(dir).sort()) {
    const idiomas = {};
    let meta = null;
    for (const lang of LANGS) {
      const f = join(dir, slug, `${lang}.md`);
      if (!existsSync(f)) continue;
      const { meta: m, corpo } = lerCabecalho(readFileSync(f, 'utf8'));
      meta ??= m;
      // fonte e linkedin podem mudar de um idioma para o outro (a data do evento, o post em inglês)
      idiomas[lang] = { arquivo: `${pasta}/${slug}/${lang}.md`, fonte: m.fonte, linkedin: m.linkedin, ...separar(corpo, f) };
    }
    if (!meta) continue;
    if (meta.rascunho && !comRascunhos) { console.log(`pulado (rascunho): ${pasta}/${slug}`); continue; }
    if (!meta.data) throw new Error(`${pasta}/${slug}: falta "data" no cabeçalho`);
    if (textos.some((t) => t.slug === slug)) throw new Error(`slug repetido: ${slug}`);
    textos.push({ slug, tipo, pasta, data: meta.data, temas: meta.temas ?? [], rascunho: !!meta.rascunho, idiomas });
  }
}
const porCaminho = new Map(textos.flatMap((t) => LANGS.map((l) => [`${t.pasta}/${t.slug}/${l}.md`, { slug: t.slug, lang: l }])));

// ---------- links ----------
function trocarLinks(md, arquivo) {
  const base = posix.dirname(arquivo);
  return md.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)\)/g, (todo, img, rotulo, alvo) => {
    if (/^(https?:|mailto:|#)/.test(alvo)) return todo;
    const [caminho, ancora = ''] = alvo.split('#');
    const resolvido = posix.normalize(posix.join(base, caminho));
    if (img) return `![${rotulo}](${REPO.replace('github.com', 'raw.githubusercontent.com')}/main/${resolvido})`;
    const destino = porCaminho.get(resolvido);
    if (destino) return `[${rotulo}](/${destino.lang}/escritos/${destino.slug}${ancora ? `#${ancora}` : ''})`;
    return `[${rotulo}](${REPO}/blob/main/${resolvido}${ancora ? `#${ancora}` : ''})`;
  });
}

// ---------- conferência e escrita ----------
// Primeiro monta tudo e confere; só depois apaga a cópia antiga e escreve a nova.
// Se a trava encontrar algo, a cópia que já estava no site fica como estava.
const indice = [];
const arquivos = [];
for (const t of textos) {
  const item = { slug: t.slug, tipo: t.tipo, data: t.data, temas: t.temas, ...(t.rascunho && { rascunho: true }), idiomas: {} };
  for (const [lang, x] of Object.entries(t.idiomas)) {
    const md = trocarLinks(x.md, x.arquivo);
    if (x.fonte && !x.fonte.link) throw new Error(`${x.arquivo}: "fonte" precisa de um link`);
    conferir(`${x.titulo}\n${x.resumo}\n${md}\n${JSON.stringify(x.fonte ?? '')}\n${x.linkedin ?? ''}`, x.arquivo);
    arquivos.push([join(t.slug, `${lang}.md`), md]);
    item.idiomas[lang] = { titulo: x.titulo, resumo: semMarkdown(x.resumo), ...(x.fonte && { fonte: x.fonte }), ...(x.linkedin && { linkedin: x.linkedin }) };
  }
  indice.push(item);
}
indice.sort((a, b) => b.data.localeCompare(a.data) || a.slug.localeCompare(b.slug));

if (problemas.length) {
  console.error(`Parei: encontrei palavras bloqueadas.\n  ${[...new Set(problemas)].join('\n  ')}\nNada foi exportado, a cópia anterior do site continua igual.`);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
for (const [rel, md] of arquivos) {
  mkdirSync(join(out, rel, '..'), { recursive: true });
  writeFileSync(join(out, rel), md);
}
writeFileSync(join(out, 'index.json'), JSON.stringify({ fonte: REPO, textos: indice }, null, 2) + '\n');
console.log(`${indice.length} textos exportados para apps/site/content/escritos/`);
if (comRascunhos) console.warn('Atenção: rascunhos incluídos. Rode de novo sem --rascunhos antes de commitar.');
