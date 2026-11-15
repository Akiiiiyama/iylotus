import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Tag } from '@iylotus/react';
import { dict, LANGS, type Lang } from '@/content/site';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { escritos, FONTE, formatarData, lerMarkdown, minutosDeLeitura, paraHtml, pastaNoRepo, porSlug } from '@/lib/escritos';

// Página de um texto. Gerada no build para cada texto nos dois idiomas; se o texto não existe num idioma,
// a página avisa e leva para a versão que existe (e fica fora dos buscadores).

export function generateStaticParams() {
  return escritos.flatMap((e) => LANGS.map((lang) => ({ lang, slug: e.slug })));
}
export const dynamicParams = false;

const hreflang = (l: Lang) => (l === 'pt' ? 'pt-BR' : 'en');

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const e = porSlug(slug);
  if (!e) return {};
  const x = e.idiomas[lang];
  const outro = Object.values(e.idiomas)[0]!;
  const disponiveis = LANGS.filter((l) => e.idiomas[l]);
  return {
    title: `${(x ?? outro).titulo} — Isabela Yukari`,
    description: (x ?? outro).resumo,
    alternates: {
      canonical: `/${x ? lang : disponiveis[0]}/escritos/${slug}`,
      languages: Object.fromEntries(disponiveis.map((l) => [hreflang(l), `/${l}/escritos/${slug}`])),
    },
    ...(x ? { openGraph: { type: 'article', title: x.titulo, description: x.resumo, publishedTime: e.data, locale: hreflang(lang) } } : { robots: { index: false } }),
    ...(e.rascunho && { robots: { index: false } }),
  };
}

export default async function Escrito({ params }: { params: Promise<{ lang: Lang; slug: string }> }) {
  const { lang, slug } = await params;
  const e = porSlug(slug);
  if (!e) notFound();
  const t = dict[lang];
  const w = t.writing;
  const x = e.idiomas[lang];
  const outro = (Object.keys(e.idiomas) as Lang[]).find((l) => l !== lang);

  const md = x ? lerMarkdown(slug, lang) : '';
  const html = x ? await paraHtml(md) : '';

  return (
    <>
      <Header t={t} lang={lang} path={`/escritos/${slug}`} />
      <main id="main">
        <article className="band article" aria-labelledby="article-title">
          <div className="in">
            <nav className="article__nav" aria-label={w.label}>
              <a href={`/${lang}/escritos`} className="article__back">
                <span className="article__back-arrow" aria-hidden="true">←</span>
                {w.back}
              </a>
            </nav>

            {x ? (
              <>
                <header className="article__head">
                  <div className="labels">
                    <span>{w.types[e.tipo]}{e.rascunho && ` · ${w.draft}`}</span>
                    <span>{formatarData(e.data, lang)} · {minutosDeLeitura(md)} {w.readTime}</span>
                  </div>
                  <h1 id="article-title" className="article__title">{x.titulo}</h1>
                  {x.resumo && <p className="lede">{x.resumo}</p>}
                  {e.temas.length > 0 && <div className="tags article__tags">{e.temas.map((tema) => <Tag key={tema}>{tema}</Tag>)}</div>}
                </header>

                {x.fonte && (
                  <aside className="article__source" aria-label={w.basedOn}>
                    <span className="article__source-label">{w.basedOn}</span>
                    <p className="article__source-title">{x.fonte.titulo}</p>
                    {(x.fonte.quem || x.fonte.onde) && <p className="article__source-meta">{[x.fonte.quem, x.fonte.onde].filter(Boolean).join(' · ')}</p>}
                    <a href={x.fonte.link} target="_blank" rel="noopener noreferrer">{w.watch} ↗</a>
                  </aside>
                )}

                <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

                <footer className="article__foot">
                  {/* o convite para o outro idioma fica escrito no próprio outro idioma */}
                  {outro && <a href={`/${outro}/escritos/${slug}`} hrefLang={outro} lang={outro}>{outro === 'pt' ? 'Leia em português' : 'Read in English'} →</a>}
                  {x.linkedin && <a href={x.linkedin} target="_blank" rel="noopener noreferrer">{w.linkedin} ↗</a>}
                  <a href={`${FONTE}/tree/main/${pastaNoRepo(e)}`} target="_blank" rel="noopener noreferrer">{w.source} ↗</a>
                  <p>{w.license}</p>
                </footer>
              </>
            ) : (
              <div className="article__missing">
                <h1 id="article-title" className="article__title" lang={outro}>{e.idiomas[outro!]!.titulo}</h1>
                <p className="lede">{w.onlyIn}</p>
                <a href={`/${outro}/escritos/${slug}`} className="iy-button iy-button--accent iy-button--lg" hrefLang={outro}>
                  <span className="iy-button__label">{w.readIn} →</span>
                </a>
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
