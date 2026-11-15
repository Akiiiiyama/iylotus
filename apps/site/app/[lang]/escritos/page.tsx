import type { Metadata } from 'next';
import { Card, CardBody, CardGroup, CardMeta, CardTag, CardTitle, Tag } from '@iylotus/react';
import { dict, LANGS, type Lang } from '@/content/site';
import { Header } from '@/components/Header';
import { SectionHead } from '@/components/SectionHead';
import { Footer } from '@/components/Footer';
import { escritos, formatarData, lerMarkdown, minutosDeLeitura, ORDEM_TIPOS } from '@/lib/escritos';

// Lista dos escritos, agrupada por tipo (primeiro as pílulas, depois os artigos). Um card por texto, do mais novo para o mais antigo.

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = dict[lang].writing;
  return {
    title: `${t.label} — Isabela Yukari`,
    description: t.lede,
    alternates: { canonical: `/${lang}/escritos`, languages: Object.fromEntries(LANGS.map((l) => [l === 'pt' ? 'pt-BR' : 'en', `/${l}/escritos`])) },
  };
}

export default async function Escritos({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = dict[lang];
  const w = t.writing;

  return (
    <>
      <Header t={t} lang={lang} path="/escritos" />
      <main id="main">
        <section className="band writing" aria-labelledby="writing-title">
          <div className="in">
            <SectionHead id="writing-title" label={w.label} counter={`${escritos.length}`} title={w.title} lede={w.lede} />

            {ORDEM_TIPOS.map((tipo) => {
              const lista = escritos.filter((e) => e.tipo === tipo);
              if (!lista.length) return null;
              return (
                <section key={tipo} className="writing__group" aria-labelledby={`tipo-${tipo}`}>
                  <h2 id={`tipo-${tipo}`} className="writing__type">{w.types[tipo]}</h2>
                  <CardGroup className="writing__cards">
                    {lista.map((e) => {
                      // sem versão neste idioma: mostra o título do outro idioma e avisa no card
                      const aqui = e.idiomas[lang];
                      const lido = aqui ? lang : (Object.keys(e.idiomas)[0] as Lang);
                      const x = e.idiomas[lido]!;
                      const min = minutosDeLeitura(lerMarkdown(e.slug, lido));
                      return (
                        <Card key={e.slug} href={`/${lang}/escritos/${e.slug}`} tone="raised" className="writing__card">
                          <CardBody>
                            <CardTag>{formatarData(e.data, lang)}{e.rascunho && ` · ${w.draft}`}</CardTag>
                            <CardTitle lang={lido === lang ? undefined : lido}>{x.titulo}</CardTitle>
                            <p className="writing__summary" lang={lido === lang ? undefined : lido}>{x.resumo}</p>
                            <CardMeta>
                              {min} {w.readTime}
                              {!aqui && ` · ${lido.toUpperCase()}`}
                            </CardMeta>
                          </CardBody>
                        </Card>
                      );
                    })}
                  </CardGroup>
                </section>
              );
            })}

            <div className="writing__foot">
              <div className="tags">{[...new Set(escritos.flatMap((e) => e.temas))].sort().map((tema) => <Tag key={tema}>{tema}</Tag>)}</div>
            </div>
          </div>
        </section>
      </main>
      <Footer t={t} lang={lang} />
    </>
  );
}
