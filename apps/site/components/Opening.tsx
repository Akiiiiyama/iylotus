'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Abertura do site em tipografia cinética (inspirada em "JustType & Motion", Studio Size), nas cores do IY Lotus.
 * As palavras passam em cenas de cor com cortes secos; no fim, "Isabela Yukari." aparece no tamanho do título
 * e desliza até o lugar exato do título do hero, enquanto a página surge em volta. Sem corte: o título da
 * página é o mesmo texto que acabou de chegar.
 *
 * Cenas (segundos):
 *   0.00 WELCOME            preto, a palavra bate na tela
 *   0.55 TO MY WEBSITE      painel vermelho sobe como cortina
 *   1.15 STRATEGY…          branco, coluna de palavras rola e para em ENGINEERING
 *   2.35 IY                 preto, as letras atravessam a câmera
 *   2.85 I'm Isabela Yukari. o nome sobe da máscara
 *   3.55 → 4.45             o nome desliza até o hero e a página aparece
 *
 * Toca na primeira visita da aba (ou sempre com ?intro). Quem pediu menos movimento vê a página direto.
 * TODO (voz): quando a gravação existir, tocar o áudio a partir de um clique e alinhar as cenas às palavras.
 */

const DUR = 4.45;
const T = {
  welcome: [0.0, 0.55], toMy: [0.55, 1.15], ticker: [1.15, 2.35], iy: [2.35, 2.85], name: [2.85, 3.55], handoff: [3.55, 4.45],
} as const;
const TICKER = ['Strategy', 'Design', 'Engineering', 'Strategy', 'Design', 'Engineering', 'Strategy', 'Design', 'Engineering'];
const TICKER_STOP = 5; // para no segundo "Engineering"

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
function bez(x1: number, y1: number, x2: number, y2: number) {
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 12; i++) {
      const cx = 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3 - x;
      const d = 3 * x1 * (1 - t) ** 2 + 6 * (x2 - x1) * t * (1 - t) + 3 * (1 - x2) * t * t;
      if (Math.abs(cx) < 1e-6 || d === 0) break;
      t = clamp(t - cx / d);
    }
    return 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  };
}
const OUT = bez(0.16, 1, 0.3, 1), INOUT = bez(0.7, 0, 0.2, 1), IN = bez(0.6, 0, 0.9, 0.4), TICK = bez(0.25, 0.1, 0.1, 1);
const inScene = (t: number, [a, b]: readonly [number, number]) => t >= a && t < b;

export function Opening({ skipLabel }: { skipLabel: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('is-opening')) return;
    setActive(true);

    const root = rootRef.current!;
    const q = <E extends HTMLElement>(s: string) => root.querySelector(s) as E;
    const bg = q('.op-bg'), side = q('.op-side');
    const s1 = q('.op-s1'), w1 = q('.op-s1 .op-word');
    const s2 = q('.op-s2'), w2a = q('.op-s2 .op-a'), w2b = q('.op-s2 .op-b');
    const s3 = q('.op-s3'), col = q('.op-s3 .op-col'), items = [...root.querySelectorAll<HTMLElement>('.op-s3 .op-item')];
    const s4 = q('.op-s4'), giant = q('.op-s4 .op-giant');
    const s5 = q('.op-s5'), im = q('.op-s5 .op-im'), name = q('.op-s5 .op-name'), nameIn = q('.op-s5 .op-name-in');
    const hero = document.getElementById('hero-title');
    if (hero) hero.style.visibility = 'hidden';

    let raf = 0, done = false;
    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      if (hero) hero.style.visibility = '';
      try { sessionStorage.setItem('iy-opening-seen', '1'); } catch { /* sem armazenamento: toca de novo na próxima visita */ }
      html.classList.remove('is-opening');
      setActive(false);
    };
    finishRef.current = finish;

    const show = (el: HTMLElement, on: boolean) => { el.style.visibility = on ? 'visible' : 'hidden'; };
    const tickY = (t: number, H: number, lineH: number) => lerp(H, H / 2 - (TICKER_STOP + 0.5) * lineH, TICK(prog(t, T.ticker[0], T.ticker[1] - 0.25)));

    const render = (t: number) => {
      const W = innerWidth, H = innerHeight;

      // 1 · WELCOME bate na tela: chega grande e desfocada, assenta no tamanho
      show(s1, inScene(t, T.welcome));
      if (inScene(t, T.welcome)) {
        const p = OUT(prog(t, 0.05, 0.32));
        w1.style.transform = `scale(${lerp(1.35, 1, p)})`;
        w1.style.filter = `blur(${lerp(10, 0, p)}px)`;
        w1.style.opacity = String(p > 0 ? 1 : 0);
      }

      // 2 · painel vermelho sobe como cortina; TO MY / WEBSITE sobem da máscara
      const s2on = t >= T.toMy[0] && t < T.ticker[0] + 0.25;
      show(s2, s2on);
      if (s2on) {
        const wipe = INOUT(prog(t, T.toMy[0], T.toMy[0] + 0.22));
        s2.style.clipPath = `inset(${(1 - wipe) * 100}% 0 0 0)`;
        w2a.style.transform = `translateY(${(1 - OUT(prog(t, 0.68, 0.9))) * 110}%)`;
        w2b.style.transform = `translateY(${(1 - OUT(prog(t, 0.76, 1.0))) * 110}%)`;
      }

      // 3 · branco desce como cortina; a coluna de palavras rola rápido e freia em ENGINEERING (desfoque enquanto corre)
      show(s3, inScene(t, T.ticker));
      if (inScene(t, T.ticker)) {
        const wipe = INOUT(prog(t, T.ticker[0], T.ticker[0] + 0.25));
        s3.style.clipPath = `inset(0 0 ${(1 - wipe) * 100}% 0)`;
        const lineH = items[0].offsetHeight;
        const y = tickY(t, H, lineH), speed = Math.abs(y - tickY(t - 1 / 60, H, lineH));
        col.style.transform = `translateY(${y}px)`;
        col.style.filter = `blur(${Math.min(6, speed / 14)}px)`;
        items.forEach((el, i) => el.classList.toggle('is-on', i === TICKER_STOP && t > T.ticker[1] - 0.3));
      }

      // 4 · IY atravessa a câmera: cresce até as letras passarem da tela
      show(s4, inScene(t, T.iy));
      if (inScene(t, T.iy)) {
        const p = IN(prog(t, T.iy[0], T.iy[1]));
        giant.style.transform = `scale(${lerp(0.55, 9, p)})`;
        giant.style.filter = `blur(${lerp(0, 14, p)}px)`;
      }

      // 5 · I'm + o nome sobe da máscara, no mesmo tamanho do título do hero, centralizado
      const nameOn = t >= T.name[0];
      show(s5, nameOn);
      side.style.opacity = String(0.7 * (1 - prog(t, T.handoff[0], T.handoff[0] + 0.3)));
      bg.style.opacity = '1';
      if (nameOn) {
        nameIn.style.transform = `translateY(${(1 - OUT(prog(t, T.name[0] + 0.05, T.name[0] + 0.45))) * 110}%)`;
        im.style.opacity = String(OUT(prog(t, T.name[0], T.name[0] + 0.3)) * (1 - prog(t, T.handoff[0], T.handoff[0] + 0.25)));

        // 6 · o nome desliza até o título do hero e a página aparece em volta
        if (hero) {
          const r = hero.getBoundingClientRect();
          Object.assign(name.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px` });
          const dx = W / 2 - (r.left + r.width / 2), dy = H / 2 - (r.top + r.height / 2);
          const h = INOUT(prog(t, T.handoff[0], T.handoff[1] - 0.15));
          name.style.transform = `translate(${dx * (1 - h)}px, ${dy * (1 - h)}px)`;
        }
        bg.style.opacity = String(1 - prog(t, T.handoff[0] + 0.35, T.handoff[1]));
      }
    };

    // modo de inspeção: /en?intro&opening-debug deixa renderizar qualquer instante (usado para conferir quadros)
    if (location.search.includes('opening-debug')) {
      (window as unknown as { __opening: unknown }).__opening = { render, stop: () => cancelAnimationFrame(raf) };
    }

    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      render(Math.min(t, DUR));
      if (t < DUR) raf = requestAnimationFrame(loop); else finish();
    };
    render(0);
    raf = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') finish(); };
    addEventListener('keydown', onKey);
    return () => { cancelAnimationFrame(raf); removeEventListener('keydown', onKey); };
  }, []);

  return (
    <div ref={rootRef} className="opening" data-theme="dark" aria-hidden={!active}>
      <div className="op-bg" />
      <section className="op-scene op-s1"><p className="op-word">Welcome</p></section>
      <section className="op-scene op-s2">
        <p className="op-stack"><span className="op-mask"><span className="op-a">To my</span></span><span className="op-mask"><span className="op-b">website</span></span></p>
      </section>
      <section className="op-scene op-s3">
        <div className="op-col">{TICKER.map((w, i) => <p key={i} className="op-item">{w}</p>)}</div>
      </section>
      <section className="op-scene op-s4"><p className="op-giant">IY<span>.</span></p></section>
      <section className="op-scene op-s5">
        <p className="op-im">I’m</p>
        <p className="op-name hero__title"><span className="op-mask op-mask--name"><span className="op-name-in"><span className="iy-lt">Isabela </span><span className="iy-bd">Yukari</span><span className="iy-dot">.</span></span></span></p>
      </section>
      <p className="op-side">Isabela Yukari — Design Engineer</p>
      <button type="button" className="opening__skip iy-button iy-button--secondary iy-button--sm" onClick={() => finishRef.current()}>
        <span className="iy-button__label">{skipLabel}</span>
      </button>
    </div>
  );
}
