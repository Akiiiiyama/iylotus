import type { Dict, Lang } from '@/content/site';

/** Rodapé escuro de todas as páginas. "Repetir abertura" leva para a home com ?intro. */
export function Footer({ t, lang, counter }: { t: Dict; lang: Lang; counter?: string }) {
  return (
    <footer className="band band--grid footer" data-theme="dark">
      <div className="in footer__in">
        <span>{t.footer}</span>
        <a href={`/${lang}?intro`} className="footer__replay">{t.replay} ↺</a>
        {counter && <span>{counter}</span>}
      </div>
    </footer>
  );
}
