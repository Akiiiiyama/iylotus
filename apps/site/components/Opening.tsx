'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Abertura do site: ela constrói a primeira dobra. Nada aparece que não fique na tela, e o último quadro
 * da abertura é o próprio hero. Uma cor (o preto da página), uma fonte, um momento de impacto.
 *
 * Roteiro (ms):
 *   300  Strategy → Design → Engineering, gigantes, uma por vez: cada uma surge devagar (sobe pouco, sai do
 *        desfoque) e se dissolve antes da próxima; ~1,1 s por palavra
 *  3650  "Engineering." parado: o ponto da palavra vira o ponto que viaja (mesmo lugar, mesma cor);
 *        a palavra se dissolve e o ponto fica sozinho um instante
 *  4000  o ponto desliza, sem tranco, até o ponto final do título (1 s)
 *  4950  "Isabela Yukari" nasce do ponto, já pousado: o nome se revela da direita para a esquerda
 *  5700  a caixa de seleção do Figma se desenha em volta; o spec entra
 *  6200  rótulos, subtítulo, texto, botões e header entram em sequência
 *  7200  fim
 *
 * Fluidez: Web Animations API, só transform e opacity (rodam no compositor, fora da thread principal).
 * As medidas são feitas uma vez, antes de começar.
 * Toca na primeira visita da aba (ou sempre com ?intro). Quem pediu menos movimento vê a página direto.
 * TODO (voz): quando a gravação existir, "Welcome to my website" entra como áudio, a partir de um clique.
 */

const WORDS: [string, 'iy-lt' | 'iy-bd'][] = [['Strategy', 'iy-lt'], ['Design', 'iy-lt'], ['Engineering', 'iy-bd']];

const EASE_OUT = 'cubic-bezier(.16, 1, .3, 1)';
const EASE_IN_OUT = 'cubic-bezier(.7, 0, .2, 1)';
/** curva suave dos dois lados, sem arrancada: para o ponto que viaja */
const EASE_GLIDE = 'cubic-bezier(.45, 0, .25, 1)';
/** entrada e saída leves das palavras */
const EASE_SOFT = 'cubic-bezier(.22, 1, .36, 1)';
const EASE_FADE = 'cubic-bezier(.4, 0, .6, 1)';

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
      // a cor é a do ponto do título real, para não haver troca de cor quando a abertura acaba
      const heroDot = hero?.querySelector('.iy-dot');
      const dotColor = heroDot ? getComputedStyle(heroDot).color : '';
      Object.assign(dot.style, { width: `${D}px`, height: `${D}px`, left: `${nmDot.cx - D / 2}px`, top: `${nmDot.cy - D / 2}px` });
      if (dotColor) dot.style.background = dotColor;
      const period = q('.op-w:last-child .op-period');
      if (dotColor) period.style.color = dotColor;
      const at = (cx: number, cy: number, sc: number) => `translate(${cx - nmDot.cx}px, ${cy - nmDot.cy}px) scale(${sc})`;

      // ---- 1 · as três palavras, uma por vez, com transição leve
      const words = [...root.querySelectorAll<HTMLElement>('.op-w-in')];
      // a palavra sobe pouco e sai do desfoque; depois se dissolve subindo um pouco, e só então a próxima entra
      // (nunca duas palavras ao mesmo tempo na tela)
      const slot = 1100, tWords = 300;
      words.forEach((w, i) => {
        const tIn = tWords + i * slot;
        anim(w, [{ opacity: 0, transform: 'translateY(10%)', filter: 'blur(8px)' }, { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }], tIn, 900, EASE_SOFT);
        if (i < words.length - 1) anim(w, [{ opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' }, { opacity: 0, transform: 'translateY(-6%)', filter: 'blur(8px)' }], tIn + slot - 480, 480, EASE_FADE, 'forwards');
      });
      const tEng = tWords + (words.length - 1) * slot; // "Engineering." começa a entrar

      // ---- 2 · o ponto entra junto com "Engineering." (é parte da palavra). Com a palavra parada, ele é trocado
      // pelo ponto que viaja, no mesmo lugar e na mesma cor (troca invisível); as palavras se dissolvem e ele viaja
      const tSwap = tEng + 1150; // a palavra já parada
      const eng = at(engDot.cx, engDot.cy, engDot.d / D);
      anim(dot, [{ opacity: 0, transform: eng }, { opacity: 1, transform: eng }], tSwap, 1, 'linear');
      anim(period, [{ opacity: 1 }, { opacity: 0 }], tSwap, 1, 'linear', 'forwards');
      anim('.op-words', [{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(6px)' }], tSwap, 500, EASE_FADE);
      // o ponto fica sozinho um instante e então desliza até o fim do nome, diminuindo junto, sem tranco
      const tGlide = tSwap + 350, glide = 1000;
      anim(dot, [{ transform: eng }, { transform: at(nmDot.cx, nmDot.cy, 1) }], tGlide, glide, EASE_GLIDE, 'forwards');
      const tName = tGlide + glide - 50; // o nome só começa a nascer com o ponto pousado
      const shift = tName - 2850; // o resto do roteiro, que antes começava em 2850, anda junto

      // ---- 3 · o nome nasce do ponto: uma janela abre da direita para a esquerda, com o texto parado no lugar final
      const wpx = r ? r.width + 40 : innerWidth;
      anim('.op-reveal', [{ transform: `translateX(${wpx}px)` }, { transform: 'translateX(0)' }], tName, 1000, EASE_IN_OUT);
      anim('.op-reveal-in', [{ transform: `translateX(${-wpx}px)` }, { transform: 'translateX(0)' }], tName, 1000, EASE_IN_OUT);

      // a cena escura sai e a página (já no lugar) aparece por trás; o nome copiado coincide com o título real
      anim('.op-bg', [{ opacity: 1 }, { opacity: 0 }], shift + 3650, 450, 'ease-out');

      // ---- 4 · a caixa de seleção do Figma se desenha em volta do nome
      const sel = document.querySelector<HTMLElement>('.hero .sel');
      if (sel) {
        anim(sel, [{ clipPath: 'inset(0 100% 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], shift + 3600, 650, EASE_IN_OUT, 'both', '::before');
        sel.querySelectorAll('.sel__h').forEach((h, i) => anim(h, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], shift + 3800 + i * 70, 380));
        sel.querySelectorAll('.sel__spec').forEach((sp, i) => anim(sp, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], shift + 4000 + i * 120, 450));
      }

      // ---- 5 · o resto da primeira dobra entra em sequência
      ['.hero .labels', '.hero__subtitle', '.hero__line', '.hero .actions'].forEach((sl, i) => {
        const el = document.querySelector(sl);
        if (el) anim(el, [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'translateY(0)' }], shift + 4100 + i * 110, 650);
      });
      outTimer = window.setTimeout(() => html.classList.add('is-opening-out'), shift + 4300);
      timer = window.setTimeout(finish, shift + 5100);
      // só agora as palavras e o nome podem aparecer: cada um já tem o seu primeiro quadro (fill 'both')
      root.classList.add('is-live');
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
