'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Abertura do site: ela constrói a primeira dobra. Nada aparece que não fique na tela, e o último quadro
 * da abertura é o próprio hero. Uma cor (o preto da página), uma fonte, um momento de impacto.
 *
 * Roteiro (ms):
 *     0  Strategy → Design → Engineering, gigantes, uma por vez, cada uma empurra a anterior pela máscara
 *  1700  as palavras se dissolvem; fica o ponto vermelho de "Engineering.", que viaja até o ponto final do título
 *  2300  "Isabela Yukari" nasce do ponto: o nome se revela da direita para a esquerda, já no lugar final
 *  3200  a caixa de seleção do Figma se desenha em volta; o spec entra
 *  3700  rótulos, subtítulo, texto, botões e header entram em sequência
 *  4700  fim
 *
 * Fluidez: Web Animations API, só transform e opacity (rodam no compositor, fora da thread principal).
 * As medidas são feitas uma vez, antes de começar.
 * Toca na primeira visita da aba (ou sempre com ?intro). Quem pediu menos movimento vê a página direto.
 * TODO (voz): quando a gravação existir, "Welcome to my website" entra como áudio, a partir de um clique.
 */

const DUR = 4700;
const WORDS: [string, 'iy-lt' | 'iy-bd'][] = [['Strategy', 'iy-lt'], ['Design', 'iy-lt'], ['Engineering', 'iy-bd']];

const EASE_OUT = 'cubic-bezier(.16, 1, .3, 1)';
const EASE_IN_OUT = 'cubic-bezier(.7, 0, .2, 1)';

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
    const hero = document.getElementById('hero-title');
    if (hero) hero.style.visibility = 'hidden';

    const anims: Animation[] = [];
    let done = false, timer = 0, outTimer = 0;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(timer); clearTimeout(outTimer);
      anims.forEach((a) => a.cancel());
      if (hero) hero.style.visibility = '';
      try { sessionStorage.setItem('iy-opening-seen', '1'); } catch { /* sem armazenamento: toca de novo na próxima visita */ }
      html.classList.remove('is-opening', 'is-opening-out');
      setActive(false);
    };
    finishRef.current = finish;

    // fill 'both' mostra o primeiro quadro antes de começar; etapas seguintes do mesmo elemento usam 'forwards',
    // para não sobrescrever as anteriores antes da sua vez.
    const anim = (sel: string | Element, frames: Keyframe[], at: number, dur: number, easing = EASE_OUT, fill: FillMode = 'both', pseudoElement?: string) => {
      const el = typeof sel === 'string' ? q(sel) : sel;
      const a = el.animate(frames, { delay: at, duration: dur, easing, fill, pseudoElement });
      anims.push(a);
      return a;
    };

    /** Onde está, de verdade, a tinta de um ponto final: centro e diâmetro, medidos com a métrica da fonte. */
    const dotGeom = (span: HTMLElement) => {
      const probe = document.createElement('span');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      span.after(probe);
      const baseline = probe.getBoundingClientRect().top;
      probe.remove();
      const rr = span.getBoundingClientRect();
      const ctx = document.createElement('canvas').getContext('2d')!;
      const cs = getComputedStyle(span);
      ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = ctx.measureText('.');
      const left = rr.left - m.actualBoundingBoxLeft, right = rr.left + m.actualBoundingBoxRight;
      const top = baseline - m.actualBoundingBoxAscent, bottom = baseline + m.actualBoundingBoxDescent;
      return { cx: (left + right) / 2, cy: (top + bottom) / 2, d: Math.max(right - left, bottom - top) };
    };

    const start = () => {
      if (done) return;

      // ---- medidas, uma vez só: o título do hero define onde o nome e o ponto vão parar
      const r = hero?.getBoundingClientRect();
      const name = q('.op-name');
      if (r) Object.assign(name.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px` });
      const engDot = dotGeom(q('.op-w:last-child .op-period'));
      const nmDot = dotGeom(q('.op-name .iy-dot'));
      const dot = q('.op-dot');
      const D = nmDot.d;
      Object.assign(dot.style, { width: `${D}px`, height: `${D}px`, left: `${nmDot.cx - D / 2}px`, top: `${nmDot.cy - D / 2}px` });
      const at = (cx: number, cy: number, sc: number) => `translate(${cx - nmDot.cx}px, ${cy - nmDot.cy}px) scale(${sc})`;

      // ---- 1 · as três palavras, uma por vez, cada uma empurra a anterior para cima
      const words = [...root.querySelectorAll<HTMLElement>('.op-w-in')];
      const slot = 560;
      words.forEach((w, i) => {
        const tIn = 150 + i * slot;
        anim(w, [{ transform: 'translateY(130%)' }, { transform: 'translateY(0)' }], tIn, 650);
        if (i < words.length - 1) anim(w, [{ transform: 'translateY(0)' }, { transform: 'translateY(-130%)' }], tIn + slot, 650, EASE_OUT, 'forwards');
      });

      // ---- 2 · o ponto de "Engineering." aparece, as palavras se dissolvem e ele viaja até o ponto final do título
      anim(dot, [{ transform: at(engDot.cx, engDot.cy, 0) }, { transform: at(engDot.cx, engDot.cy, engDot.d / D) }], 150 + 2 * slot + 320, 380);
      anim('.op-words', [{ opacity: 1 }, { opacity: 0 }], 1750, 450, 'ease-out');
      anim(dot, [{ transform: at(engDot.cx, engDot.cy, engDot.d / D) }, { transform: at(nmDot.cx, nmDot.cy, 1) }], 1800, 650, EASE_IN_OUT, 'forwards');

      // ---- 3 · o nome nasce do ponto: uma janela abre da direita para a esquerda, com o texto parado no lugar final
      const wpx = r ? r.width + 40 : innerWidth;
      anim('.op-reveal', [{ transform: `translateX(${wpx}px)` }, { transform: 'translateX(0)' }], 2350, 900, EASE_IN_OUT);
      anim('.op-reveal-in', [{ transform: `translateX(${-wpx}px)` }, { transform: 'translateX(0)' }], 2350, 900, EASE_IN_OUT);

      // a cena escura sai e a página (já no lugar) aparece por trás; o nome copiado coincide com o título real
      anim('.op-bg', [{ opacity: 1 }, { opacity: 0 }], 3150, 450, 'ease-out');

      // ---- 4 · a caixa de seleção do Figma se desenha em volta do nome
      const sel = document.querySelector<HTMLElement>('.hero .sel');
      if (sel) {
        anim(sel, [{ clipPath: 'inset(0 100% 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], 3200, 650, EASE_IN_OUT, 'both', '::before');
        sel.querySelectorAll('.sel__h').forEach((h, i) => anim(h, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], 3400 + i * 70, 380));
        sel.querySelectorAll('.sel__spec').forEach((sp, i) => anim(sp, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], 3600 + i * 120, 450));
      }

      // ---- 5 · o resto da primeira dobra entra em sequência
      ['.hero .labels', '.hero__subtitle', '.hero__line', '.hero .actions'].forEach((sl, i) => {
        const el = document.querySelector(sl);
        if (el) anim(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], 3700 + i * 110, 650);
      });
      outTimer = window.setTimeout(() => html.classList.add('is-opening-out'), 3900);
      timer = window.setTimeout(finish, DUR);
    };

    // modo de inspeção: /en?intro&opening-debug congela o relógio e deixa ver qualquer instante (para conferir quadros)
    if (location.search.includes('opening-debug')) {
      (window as unknown as { __opening: unknown }).__opening = {
        render: (t: number) => anims.forEach((a) => { a.pause(); a.currentTime = t * 1000; }),
        stop: () => { clearTimeout(timer); clearTimeout(outTimer); anims.forEach((a) => a.pause()); },
      };
    }

    // começa quando as fontes estiverem prontas, para medir o título com a fonte certa
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => requestAnimationFrame(start));

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') finish(); };
    addEventListener('keydown', onKey);
    return () => { clearTimeout(timer); clearTimeout(outTimer); removeEventListener('keydown', onKey); };
  }, []);

  return (
    <div ref={rootRef} className="opening" data-theme="dark" aria-hidden={!active}>
      <div className="op-bg" />
      <div className="op-words">
        {WORDS.map(([w, cls], i) => (
          <p key={w} className="op-w">
            <span className={`op-w-in ${cls}`}>{w}{i === WORDS.length - 1 && <span className="op-period">.</span>}</span>
          </p>
        ))}
      </div>
      <p className="op-name hero__title">
        <span className="op-reveal"><span className="op-reveal-in"><span className="iy-lt">Isabela </span><span className="iy-bd">Yukari</span><span className="iy-dot">.</span></span></span>
      </p>
      <div className="op-dot" aria-hidden="true" />
      <button type="button" className="opening__skip iy-button iy-button--secondary iy-button--sm" onClick={() => finishRef.current()}>
        <span className="iy-button__label">{skipLabel}</span>
      </button>
    </div>
  );
}
