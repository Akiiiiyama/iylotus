import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import dados from '@/content/escritos/index.json';
import type { Lang } from '@/content/site';

/**
 * Os escritos do site: guias e artigos que vêm do repositório público pilulas-ia.
 * A cópia em content/escritos/ é gerada por scripts/export-escritos.mjs; esta camada só lê e transforma em HTML.
 */
export type Tipo = 'artigo' | 'guia';
/** De onde veio um artigo sobre o conteúdo de outra pessoa (vídeo, palestra, podcast). */
export type Fonte = { titulo: string; quem?: string; onde?: string; link: string };
export type Escrito = {
  slug: string;
  tipo: Tipo;
  data: string;
  temas: string[];
  rascunho?: boolean;
  idiomas: Partial<Record<Lang, { titulo: string; resumo: string; fonte?: Fonte; linkedin?: string }>>;
};

export const FONTE = dados.fonte;
export const ORDEM_TIPOS: Tipo[] = ['guia', 'artigo'];

// Rascunhos só aparecem fora da produção (no computador ou num preview da Vercel), nunca em isabelayukari.com.
const mostrarRascunhos = process.env.VERCEL_ENV !== 'production';

export const escritos: Escrito[] = (dados.textos as Escrito[]).filter((e) => mostrarRascunhos || !e.rascunho);

export const porSlug = (slug: string) => escritos.find((e) => e.slug === slug);

/** Caminho do arquivo original no GitHub, para o link "ver no GitHub". */
export const pastaNoRepo = (e: Escrito) => ({ artigo: 'artigos', guia: 'guias' })[e.tipo] + '/' + e.slug;

const pasta = join(process.cwd(), 'content', 'escritos');

export function lerMarkdown(slug: string, lang: Lang) {
  return readFileSync(join(pasta, slug, `${lang}.md`), 'utf8');
}

type No = { type: string; tagName?: string; value?: string; properties?: Record<string, unknown>; children?: No[] };

/**
 * Imagem sozinha num parágrafo vira <figure>, e o título do markdown vira a legenda:
 * ![texto alternativo](imagens/x.jpg "legenda"). As imagens carregam só quando chegam perto da tela.
 */
function figuras() {
  const visitar = (no: No) => {
    no.children?.forEach((filho, i) => {
      const conteudo = filho.children?.filter((c) => !(c.type === 'text' && !c.value?.trim()));
      if (filho.tagName === 'p' && conteudo?.length === 1 && conteudo[0].tagName === 'img') {
        const img = conteudo[0];
        const legenda = img.properties?.title as string | undefined;
        delete img.properties!.title;
        Object.assign(img.properties!, { loading: 'lazy', decoding: 'async' });
        const filhos: No[] = [img];
        if (legenda) filhos.push({ type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: legenda }] });
        no.children![i] = { type: 'element', tagName: 'figure', properties: {}, children: filhos };
      } else visitar(filho);
    });
  };
  return (arvore: No) => visitar(arvore);
}

/** Markdown para HTML no build. HTML cru dentro do markdown é descartado (o remark-rehype não deixa passar). */
export async function paraHtml(md: string) {
  const file = await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSlug).use(figuras).use(rehypeStringify, { characterReferences: { useNamedReferences: true } }).process(md);
  return String(file);
}

/** Minutos de leitura, contando 200 palavras por minuto. */
export const minutosDeLeitura = (md: string) =>
  Math.max(1, Math.round(md.replace(/!\[[^\]]*\]\([^)]*\)/g, '').split(/\s+/).filter(Boolean).length / 200));

/** Data curta, sem os "de" do português: "11 nov 2026" / "Nov 11, 2026". */
export function formatarData(data: string, lang: Lang) {
  const d = new Date(`${data}T12:00:00Z`);
  if (lang === 'en') return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(d);
  const partes = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).formatToParts(d);
  const p = (tipo: string) => partes.find((x) => x.type === tipo)?.value.replace('.', '') ?? '';
  return `${p('day')} ${p('month')} ${p('year')}`;
}
