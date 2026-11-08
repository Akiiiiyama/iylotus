'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Abertura do site em tipografia cinética (inspirada em "JustType & Motion", Studio Size), nas cores do IY Lotus.
 *
 * Fluidez: tudo é animado com a Web Animations API e só com transform e opacity. Essas animações rodam no
 * compositor (placa de vídeo), fora da thread principal, então não travam enquanto o Next prepara a página.
 * Nenhuma medida de layout acontece durante a animação: o título do hero é medido uma vez, antes de começar.
 *
 * Roteiro (ms):
 *     0  WELCOME assenta no preto
 *  1100  painel vermelho sobe: TO MY / WEBSITE
 *  2200  painel branco desce: a coluna Strategy · Design · Engineering rola e freia em ENGINEERING.
 *  4400  corte para o preto: IY.; a câmera mergulha no ponto vermelho até a tela virar vermelha
 *  5450  o vermelho se recolhe e vira o ponto final de "Isabela Yukari.", que sobe da máscara
 *  6600  o nome desliza até o título do hero e as cenas se dissolvem
 *  7450  a caixa de seleção do Figma se desenha em volta do nome; o resto do hero e o header entram
 *  8700  fim
 * O ponto vermelho é o fio da história: ENGINEERING. → IY. → Isabela Yukari.
 *
 * Toca na primeira visita da aba (ou sempre com ?intro). Quem pediu menos movimento vê a página direto.
 * TODO (voz): quando a gravação existir, tocar o áudio a partir de um clique e alinhar o roteiro às palavras.
 */

const DUR = 8700;
const TICKER = ['Strategy', 'Design', 'Engineering', 'Strategy', 'Design', 'Engineering', 'Strategy', 'Design', 'Engineering'];
const TICKER_STOP = 5; // freia no segundo "Engineering"

const EASE_OUT = 'cubic-bezier(.16, 1, .3, 1)';
const EASE_IN_OUT = 'cubic-bezier(.7, 0, .2, 1)';
const EASE_IN = 'cubic-bezier(.55, 0, .9, .45)';
const EASE_BRAKE = 'cubic-bezier(.22, .0, .08, 1)'; // corre e freia devagar

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

    /** Uma animação no relógio da abertura: começa em `at` ms, dura `dur` ms e segura o estado final. */
    // fill 'both' mostra o primeiro quadro antes de começar; as etapas seguintes do mesmo elemento usam 'forwards',
    // para não sobrescrever as anteriores antes da sua vez.
    const anim = (sel: string | HTMLElement, frames: Keyframe[], at: number, dur: number, easing = EASE_OUT, fill: FillMode = 'both') => {
      const el = typeof sel === 'string' ? q(sel) : sel;
      const a = el.animate(frames, { delay: at, duration: dur, easing, fill });
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
      const H = innerHeight, W = innerWidth;

      // medidas, uma vez só
      const lineH = (q('.op-s3 .op-item')).offsetHeight;
      const stopY = H / 2 - (TICKER_STOP + 0.5) * lineH;
      const r = hero?.getBoundingClientRect();
      const name = q('.op-name');
      let dx = 0, dy = 0;
      if (r) {
        Object.assign(name.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px` });
        dx = W / 2 - (r.left + r.width / 2);
        dy = H / 2 - (r.top + r.height / 2);
      }

      // 1 · WELCOME assenta no preto
      anim('.op-s1 .op-word', [{ opacity: 0, transform: 'scale(1.18)' }, { opacity: 1, transform: 'scale(1)' }], 150, 900);
      anim('.op-side', [{ opacity: 0 }, { opacity: 0.7 }], 300, 600);

      // 2 · painel vermelho sobe como cortina; TO MY / WEBSITE sobem da máscara
      anim('.op-s2', [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], 1100, 650, EASE_IN_OUT);
      anim('.op-s2 .op-a', [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], 1450, 750);
      anim('.op-s2 .op-b', [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], 1580, 750);

      // 3 · painel branco desce; a coluna corre e freia devagar em ENGINEERING., que fica preto com o ponto vermelho
      anim('.op-s3', [{ transform: 'translateY(-100%)' }, { transform: 'translateY(0)' }], 2200, 650, EASE_IN_OUT);
      anim('.op-s3 .op-col', [{ transform: `translateY(${H}px)` }, { transform: `translateY(${stopY}px)` }], 2200, 2000, EASE_BRAKE);
      anim(`.op-s3 .op-item:nth-child(${TICKER_STOP + 1}) .op-ink`, [{ opacity: 0 }, { opacity: 1 }], 3900, 350);

      // 4 · corte para o preto: IY. assenta, e a câmera mergulha no ponto vermelho até a tela virar vermelha
      const iyDot = dotGeom(q('.op-s4 .op-giant span'));
      const nmDot = dotGeom(q('.op-name .iy-dot'));
      const dot = q('.op-dot');
      const D = nmDot.d;
      Object.assign(dot.style, { width: `${D}px`, height: `${D}px`, left: `${nmDot.cx - D / 2}px`, top: `${nmDot.cy - D / 2}px` });
      const at = (cx: number, cy: number, sc: number) => `translate(${cx - nmDot.cx}px, ${cy - nmDot.cy}px) scale(${sc})`;
      const cover = (2 * Math.hypot(W, H)) / D;
      anim('.op-s4', [{ opacity: 0 }, { opacity: 1 }], 4400, 1, 'linear');
      anim('.op-s4 .op-giant', [{ transform: 'scale(0.86)' }, { transform: 'scale(1)' }], 4400, 600);
      anim('.op-s4 .op-giant', [{ opacity: 1 }, { opacity: 0 }], 5450, 1, 'linear', 'forwards');
      anim(dot, [
        { transform: at(iyDot.cx, iyDot.cy, iyDot.d / D), opacity: 0 },
        { transform: at(iyDot.cx, iyDot.cy, iyDot.d / D), opacity: 1, offset: 0.01 },
        { transform: at(iyDot.cx, iyDot.cy, cover), opacity: 1 },
      ], 4900, 550, EASE_IN);

      // 5 · o vermelho se recolhe e volta a ser um ponto: o ponto final de "Isabela Yukari.", que sobe da máscara
      anim(name, [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: `translate(${dx}px, ${dy}px)` }], 0, 1, 'linear');
      anim(dot, [{ transform: at(W / 2, H / 2, cover) }, { transform: at(nmDot.cx + dx, nmDot.cy + dy, 1) }], 5450, 850, EASE_OUT, 'forwards');
      anim('.op-name-in', [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }], 5750, 900);
      anim('.op-im', [{ opacity: 0, transform: 'translateY(12px)', offset: 0 }, { opacity: 1, transform: 'translateY(0)', offset: 0.35 }, { opacity: 1, transform: 'translateY(0)', offset: 0.85 }, { opacity: 0, transform: 'translateY(0)', offset: 1 }], 5700, 1250);
      anim('.op-side', [{ opacity: 0, offset: 0 }, { opacity: 0.7, offset: 0.08 }, { opacity: 0.7, offset: 0.92 }, { opacity: 0, offset: 1 }], 300, 6500, 'linear');

      // 6 · o nome (com o ponto) desliza até o título do hero; as cenas se dissolvem em volta
      anim(name, [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], 6600, 1000, EASE_IN_OUT, 'forwards');
      anim(dot, [{ transform: at(nmDot.cx + dx, nmDot.cy + dy, 1) }, { transform: at(nmDot.cx, nmDot.cy, 1) }], 6600, 1000, EASE_IN_OUT, 'forwards');
      anim('.op-scenes', [{ opacity: 1 }, { opacity: 0 }], 6950, 700, 'ease-out');

      // 7 · a página começa pela caixa de seleção do Figma, que se desenha em volta do nome; depois o resto entra em sequência
      const sel = document.querySelector<HTMLElement>('.hero .sel');
      if (sel) {
        anims.push(sel.animate([{ clipPath: 'inset(0 100% 100% 0)' }, { clipPath: 'inset(0 0 0 0)' }], { pseudoElement: '::before', delay: 7450, duration: 650, easing: EASE_IN_OUT, fill: 'both' }));
        sel.querySelectorAll<HTMLElement>('.sel__h').forEach((h, i) => anim(h, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], 7650 + i * 70, 400));
        sel.querySelectorAll<HTMLElement>('.sel__spec').forEach((sp, i) => anim(sp, [{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], 7900 + i * 120, 500));
      }
      ['.hero .labels', '.hero__subtitle', '.hero__line', '.hero .actions'].forEach((sl, i) => {
        const el = document.querySelector<HTMLElement>(sl);
        if (el) anim(el, [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], 7700 + i * 120, 700);
      });
      outTimer = window.setTimeout(() => html.classList.add('is-opening-out'), 7900);

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
      <div className="op-scenes">
        <section className="op-scene op-s1"><p className="op-word">Welcome</p></section>
        <section className="op-scene op-s2">
          <p className="op-stack"><span className="op-mask"><span className="op-a">To my</span></span><span className="op-mask"><span className="op-b">website</span></span></p>
        </section>
        <section className="op-scene op-s3">
          <div className="op-col">
            {TICKER.map((w, i) => (
              <p key={i} className="op-item">
                <span className="op-grey">{w}</span>
                {i === TICKER_STOP && <span className="op-ink" aria-hidden="true">{w}<span className="op-period">.</span></span>}
              </p>
            ))}
          </div>
        </section>
        <section className="op-scene op-s4"><p className="op-giant">IY<span>.</span></p></section>
      </div>
      <p className="op-im">I’m</p>
      <p className="op-name hero__title"><span className="op-mask op-mask--name"><span className="op-name-in"><span className="iy-lt">Isabela </span><span className="iy-bd">Yukari</span><span className="iy-dot">.</span></span></span></p>
      <div className="op-dot" aria-hidden="true" />
      <p className="op-side">Isabela Yukari — Design Engineer</p>
      <button type="button" className="opening__skip iy-button iy-button--secondary iy-button--sm" onClick={() => finishRef.current()}>
        <span className="iy-button__label">{skipLabel}</span>
      </button>
    </div>
  );
}
