import { LINKS, type Dict, type Lang } from '@/content/site';
import { ThemeSwitch } from './ThemeSwitch';

/**
 * Header flutuante em dois painéis soltos do topo: à esquerda a assinatura IY. e a navegação,
 * à direita idioma, tema e o CV como ação principal. Usa só tokens do IY Lotus (superfície, borda, raio lg, pill).
 */
export function Header({ t, lang }: { t: Dict; lang: Lang }) {
  const other: Lang = lang === 'en' ? 'pt' : 'en';
  return (
    <header className="topbar">
      <div className="topbar__panel topbar__panel--start">
        <a href={`/${lang}`} className="topbar__brand" aria-label="Isabela Yukari, home">
          IY<span className="iy-dot">.</span>
        </a>
        <nav className="topbar__nav" aria-label="Main">
          <a href="#work">{t.nav.work}</a>
          <a href="#experience">{t.nav.experience}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
      </div>
      <div className="topbar__panel topbar__panel--end">
        <a href={`/${other}`} className="topbar__lang" hrefLang={other} lang={other}>{other.toUpperCase()}<span className="iy-visually-hidden"> · {t.langSwitch}</span></a>
        <ThemeSwitch label={t.theme} />
        <a href={LINKS.cv} download className="topbar__cv" aria-label={t.nav.cvLabel}>{t.nav.cv} <span aria-hidden="true">↓</span></a>
      </div>
    </header>
  );
}
