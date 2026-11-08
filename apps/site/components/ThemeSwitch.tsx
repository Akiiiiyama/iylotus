'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@iylotus/react';

/**
 * Liga e desliga o modo escuro com o Switch do IY Lotus.
 * Sem escolha salva, o site segue o sistema; a escolha fica guardada neste navegador.
 */
export function ThemeSwitch({ label }: { label: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const read = () => setDark(root.dataset.theme ? root.dataset.theme === 'dark' : mq.matches);
    read();
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
  }, []);

  const change = (on: boolean) => {
    const theme = on ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('iy-theme', theme); } catch { /* sem armazenamento: vale só nesta visita */ }
    setDark(on);
  };

  return <Switch label={<span className="iy-visually-hidden">{label}</span>} checked={dark ?? false} onCheckedChange={change} className="topbar__theme" />;
}
