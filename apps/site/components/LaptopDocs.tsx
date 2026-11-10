'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Notebook no estilo dos produtos da Apple: tampa de alumínio que abre quando o card entra na tela,
 * bordas pretas finas, notch, e a documentação do IY Lotus (só no tema escuro) rolando na tela.
 * O desenho e o movimento são CSS (globals.css, bloco "notebook"). Onde o navegador acompanha a rolagem
 * (animation-timeline: view()), a tampa abre junto com o scroll; nos outros, abre uma vez ao aparecer.
 * Decorativo (aria-hidden no CardMedia). Quem pediu menos movimento vê o notebook já aberto e a página parada.
 */
const NEUTRALS = ['#FFFFFF', '#F2F2F2', '#E4E4E4', '#CFCFCF', '#A8A8A8', '#8A8A8A', '#6B6B6B', '#444444', '#2A2A2A', '#1C1C1C', '#141414'];
const NAV = ['Primitives', 'Components', 'Layouts', 'Foundations', 'Theme', 'Typography'];

function Page() {
  return (
    <div className="lx-page" data-theme="dark">
      <div className="lx-scroll">
        <section className="lx-band lx-band--ink">
          <div className="lx-labels"><span>Primitives</span><span>01 / 06</span></div>
          <p className="lx-headline"><span className="iy-lt">Raw </span><span className="iy-bd">values</span><span className="lx-dot">.</span></p>
          <div className="lx-swatches">{NEUTRALS.map((c) => <i key={c} style={{ background: c }} />)}</div>
        </section>
        <section className="lx-band lx-band--paper">
          <div className="lx-labels"><span>Components</span><span>02 / 06</span></div>
          <p className="lx-headline"><span className="iy-lt">I design in </span><span className="iy-bd">pixels</span><span className="lx-dot">.</span></p>
          <div className="lx-row">
            <span className="iy-button iy-button--accent iy-button--lg">View work</span>
            <span className="iy-button iy-button--primary iy-button--lg">Primary</span>
            <span className="iy-button iy-button--secondary iy-button--lg">Secondary</span>
          </div>
          <div className="lx-field"><span className="lx-field__label">Email</span><span className="lx-field__control">you@email.com</span></div>
        </section>
        <section className="lx-band lx-band--surface">
          <div className="lx-labels"><span>Typography</span><span>06 / 06</span></div>
          <p className="lx-headline"><span className="iy-lt">Light </span><span className="iy-bd">&amp; bold</span><span className="lx-dot">.</span></p>
          <p className="lx-type lx-type--h2"><span className="iy-lt">Design </span><span className="iy-bd">Engineer</span></p>
          <p className="lx-type lx-type--label">Role 01 / 02</p>
        </section>
      </div>
      <div className="lx-topbar">
        <div className="lx-panel">
          <span className="lx-brand">IY Lotus</span>
          {NAV.map((n, i) => <span key={n} className={`lx-nav${i === 0 ? ' lx-nav--on' : ''}`}><b>0{i + 1}</b>{n}</span>)}
        </div>
        <div className="lx-panel lx-panel--end"><span className="lx-switch" /></div>
      </div>
    </div>
  );
}

export function LaptopDocs() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOpen(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="laptop" data-lid={open ? 'open' : 'closed'}>
      <div className="laptop__lid">
        <div className="laptop__face laptop__face--front">
          <div className="laptop__screen">
            <div className="laptop__viewport"><Page /></div>
            <span className="laptop__notch" />
            <span className="laptop__glare" />
          </div>
        </div>
        <div className="laptop__face laptop__face--back" />
      </div>
      <div className="laptop__base"><span className="laptop__lip" /></div>
    </div>
  );
}
