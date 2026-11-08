'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Marca do IY Lotus: a flor de lótus em traço, com o ponto vermelho na base.
 * As pétalas abrem quando a flor entra na tela (e de novo ao passar o mouse no card).
 * Quem pediu menos movimento vê a flor já aberta.
 */
const PETALS = [
  { angle: -62, delay: 0.18, scale: 0.78 },
  { angle: -32, delay: 0.08, scale: 0.92 },
  { angle: 0, delay: 0, scale: 1 },
  { angle: 32, delay: 0.08, scale: 0.92 },
  { angle: 62, delay: 0.18, scale: 0.78 },
];

export function LotusBloom() {
  const ref = useRef<SVGSVGElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => setOpen(e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    // ao passar o mouse no card, a flor fecha e abre de novo
    const card = el.closest('a, article');
    const replay = () => { setOpen(false); requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true))); };
    card?.addEventListener('mouseenter', replay);
    return () => { io.disconnect(); card?.removeEventListener('mouseenter', replay); };
  }, []);

  return (
    <svg ref={ref} className={`lotus${open ? ' is-open' : ''}`} viewBox="0 0 200 140" role="img" aria-label="IY Lotus">
      <g className="lotus__petals">
        {PETALS.map((p, i) => (
          <path
            key={i}
            className="lotus__petal"
            style={{ '--a': `${p.angle}deg`, '--s': p.scale, '--d': `${p.delay}s` } as React.CSSProperties}
            d="M100 112 C116 92 118 56 100 22 C82 56 84 92 100 112 Z"
          />
        ))}
      </g>
      <circle className="lotus__dot" cx="100" cy="124" r="5.5" />
    </svg>
  );
}
