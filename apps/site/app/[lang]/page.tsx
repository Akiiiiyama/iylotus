import { Card, CardBody, CardMedia, CardMeta, CardTag, CardTitle, Tag } from '@iylotus/react';
import { dict, type Lang, type Highlight, LINKS } from '@/content/site';
import { Header } from '@/components/Header';
import { Opening } from '@/components/Opening';
import { SectionHead } from '@/components/SectionHead';
import { LotusBloom } from '@/components/LotusBloom';

// Página única: abertura → hero → projetos → experiência → sobre → contato.
// Cada seção é uma "cena" com cor própria, como os cortes do reel.

function Hl({ text }: { text: Highlight }) {
  return (
    <>
      {text.a}
      {text.hl && <mark className="hl">{text.hl}</mark>}
      {text.b}
    </>
  );
}

const ButtonLink = ({ href, variant, children, external }: { href: string; variant: 'accent' | 'primary' | 'secondary' | 'ghost'; children: React.ReactNode; external?: boolean }) => (
  // Ainda não existe um ButtonLink no IY Lotus: usamos as mesmas classes do Button num link de verdade.
  <a href={href} className={`iy-button iy-button--${variant} iy-button--lg`} {...(external && { target: '_blank', rel: 'noopener noreferrer' })}>
    <span className="iy-button__label">{children}</span>
  </a>
);

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = dict[lang];

  return (
    <>
      <Opening skipLabel={t.skip} />
      <Header t={t} lang={lang} />

      <main id="main">
        {/* 00 · HERO: grade escura, nome gigante dentro da caixa de seleção do Figma */}
        <section className="band band--grid hero" data-theme="dark" aria-labelledby="hero-title">
          <div className="in">
            <div className="labels"><span>{t.hero.label}</span><span>{t.hero.counter}</span></div>
            <div className="sel">
              <span className="sel__h sel__h--tl" /><span className="sel__h sel__h--tr" /><span className="sel__h sel__h--bl" /><span className="sel__h sel__h--br" />
              <span className="sel__spec sel__spec--top" aria-hidden="true">W 100%  ·  H auto  ·  display</span>
              <h1 id="hero-title" className="hero__title">
                <span className="iy-lt">Isabela </span><span className="iy-bd">Yukari</span><span className="iy-dot">.</span>
              </h1>
              <span className="sel__spec sel__spec--bottom" aria-hidden="true">font: 300/700 clamp(64px, 12vw, 180px) &quot;DM Sans&quot;;</span>
            </div>
            <p className="hero__subtitle">{t.hero.subtitle}</p>
            <p className="hero__line"><Hl text={t.hero.line} /></p>
            <div className="actions">
              <ButtonLink href={LINKS.linkedin} variant="accent" external>LinkedIn ↗</ButtonLink>
              <ButtonLink href={LINKS.github} variant="secondary" external>GitHub ↗</ButtonLink>
            </div>
          </div>
        </section>

        {/* 01 · PROJETOS */}
        <section id="work" className="band band--paper" aria-labelledby="work-title">
          <div className="in">
            <SectionHead id="work-title" label={t.work.label} counter="01 / 05" title={t.work.title} lede={t.work.lede} />
            <div className="projects">
              {t.work.projects.map((p) => (
                <Card key={p.id} href={p.href} target="_blank" rel="noopener noreferrer" tone={p.id === 'iylotus' ? 'red' : p.id === 'skill' ? 'ink' : 'raised'} className={`project project--${p.id}`}>
                  <CardMedia aria-hidden="true" className="project__media">
                    {p.id === 'skill' ? (
                      <video className="project__video" src="/work/reel.mp4" poster="/work/reel.jpg" autoPlay muted loop playsInline />
                    ) : p.id === 'iylotus' ? (
                      <div className="art art--lotus"><LotusBloom /><span className="art__wordmark"><span className="iy-lt">IY </span><span className="iy-bd">Lotus</span><span className="art__dot">.</span></span></div>
                    ) : p.id === 'skills' ? (
                      <div className="art art--skills">
                        <span><b>/brand-motion-intro</b> <i>ready</i></span>
                        <span>/accessibility-review <i>next</i></span>
                        <span>/token-check <i>next</i></span>
                      </div>
                    ) : p.id === 'site' ? (
                      <div className="art art--site"><span className="art__code">&lt;Button variant=&quot;accent&quot; /&gt;</span></div>
                    ) : (
                      <div className="art art--pills"><span>prompts</span><span>agents</span><span>motion</span></div>
                    )}
                  </CardMedia>
                  <CardBody>
                    <CardTag>{p.tag}</CardTag>
                    <CardTitle><span className="iy-lt">{p.title[0]}</span><span className="iy-bd">{p.title[1]}</span></CardTitle>
                    <p className="project__body">{p.body}</p>
                    <CardMeta>{p.meta} · {p.cta} ↗</CardMeta>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 02 · EXPERIÊNCIA: só o tipo de projeto, os detalhes ficam para o LinkedIn */}
        <section id="experience" className="band band--surface" aria-labelledby="exp-title">
          <div className="in">
            <SectionHead id="exp-title" label={t.experience.label} counter="02 / 05" title={t.experience.title} lede={t.experience.lede} />
            <ol className="jobs">
              {t.experience.jobs.map((j) => (
                <li key={j.org} className="job">
                  <span className="job__years">{j.years}</span>
                  <div className="job__main">
                    <h3 className="job__org">{j.org}</h3>
                    <p className="job__role">{j.role}</p>
                  </div>
                  <p className="job__work">{j.work}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="band band--red teaser" data-theme="dark" aria-label={t.experience.ctaButton}>
          <div className="in teaser__in">
            <p className="teaser__text">{t.experience.cta}</p>
            <a className="iy-button iy-button--lg teaser__button" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              <span className="iy-button__label">{t.experience.ctaButton} ↗</span>
            </a>
          </div>
        </section>

        {/* 03 · SOBRE */}
        <section id="about" className="band band--paper" aria-labelledby="about-title">
          <div className="in">
            <SectionHead id="about-title" label={t.about.label} counter="03 / 05" title={t.about.title} />
            <div className="about">
              <div className="about__bio">
                {t.about.bio.map((b, i) => <p key={i}><Hl text={b} /></p>)}
              </div>
              <div className="about__more">
                <div>
                  <h3 className="side__label">{t.about.keywordsLabel}</h3>
                  <div className="tags">{t.about.keywords.map((k) => <Tag key={k}>{k}</Tag>)}</div>
                </div>
                <div>
                  <h3 className="side__label">{t.about.stackLabel}</h3>
                  <dl className="stack">
                    {t.about.stack.map((g) => (
                      <div key={g.group} className="stack__row"><dt>{g.group}</dt><dd>{g.items.join(' · ')}</dd></div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 04 · CONTATO */}
        <section id="contact" className="band band--grid contact" data-theme="dark" aria-labelledby="contact-title">
          <div className="in">
            <div className="labels"><span>{t.contact.label}</span><span>04 / 05</span></div>
            <h2 id="contact-title" className="contact__title"><span className="iy-lt">{t.contact.title[0]}</span><span className="iy-bd">{t.contact.title[1]}</span><span className="iy-dot">.</span></h2>
            <p className="contact__body">{t.contact.body}</p>
            <div className="actions">
              <ButtonLink href={LINKS.linkedin} variant="accent" external>{t.contact.linkedin} ↗</ButtonLink>
              <ButtonLink href={LINKS.github} variant="secondary" external>{t.contact.github} ↗</ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="band band--grid footer" data-theme="dark">
        <div className="in footer__in">
          <span>{t.footer}</span>
          <a href="?intro" className="footer__replay">{t.replay} ↺</a>
          <span>05 / 05</span>
        </div>
      </footer>
    </>
  );
}
