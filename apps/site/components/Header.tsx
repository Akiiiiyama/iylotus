import type { Dict, Lang } from '@/content/site';
import { ThemeSwitch } from './ThemeSwitch';

/** Barra fixa: assinatura IY., navegação, idioma e tema. */
export function Header({ t, lang }: { t: Dict; lang: Lang }) {
  const other: Lang = lang === 'en' ? 'pt' : 'en';
  return (
    <header className="topbar">
      <div className="topbar__in">
        <a href={`/${lang}`} className="topbar__brand" aria-label="Isabela Yukari, home">
          IY<span className="iy-dot">.</span>
        </a>
        <nav className="topbar__nav" aria-label="Main">
          <a href="#work">{t.nav.work}</a>
          <a href="#experience">{t.nav.experience}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
        <div className="topbar__tools">
          <a href={`/${other}`} className="topbar__lang" hrefLang={other} lang={other}>{other.toUpperCase()}<span className="iy-visually-hidden"> · {t.langSwitch}</span></a>
          <ThemeSwitch label={t.theme} />
        </div>
      </div>
    </header>
  );
}
