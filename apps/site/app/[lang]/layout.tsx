import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DM_Sans, JetBrains_Mono } from 'next/font/google';
import '@iylotus/styles';
import '@iylotus/react/styles.css';
import '../globals.css';
import { LANGS, type Lang } from '@/content/site';

// As fontes do IY Lotus, servidas pelo próprio Next (sem pedir nada ao Google no navegador).
const sans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '700'], variable: '--font-dm-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-jetbrains-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Isabela Yukari — Design Engineer',
  description: 'Senior Design Engineer. I design in pixels and ship in code.',
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><circle cx='8' cy='8' r='6' fill='%23C8102E'/></svg>" },
};

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}
export const dynamicParams = false;

// Roda antes da página aparecer: aplica o tema (escuro por padrão, ou o salvo) e decide se a abertura toca (só na primeira visita da sessão).
const BOOT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('iy-theme');d.setAttribute('data-theme',t==='light'?'light':'dark');
var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(!r&&!sessionStorage.getItem('iy-opening-seen'))d.classList.add('is-opening');}catch(e){}})();`;

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!LANGS.includes(lang as Lang)) notFound();
  return (
    <html lang={lang === 'pt' ? 'pt-BR' : 'en'} className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
