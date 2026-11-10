'use client';

import { useEffect, useRef } from 'react';
import graph from '@/content/study-graph.json';

/**
 * Constelação do mapa de estudos (recorte público do painel AI_Studies, no formato do Graphify).
 * Pontos e ligações flutuam devagar; pulsos de luz correm pelas ligações; ao passar o mouse no card,
 * a constelação se aproxima e acende. Pausa fora da tela; com menos movimento, fica parada.
 * Atualizar os dados: node apps/site/scripts/export-study-graph.mjs
 */
type Node = { x: number; y: number; r: number; g: number; l: string };
const NODES = graph.nodes as Node[];
const EDGES = graph.edges as [number, number, number][];

// cores do IY Lotus por grupo: centro, temas, termos, práticas, biblioteca
const COLORS = ['#C8102E', '#FF2D55', '#FFFFFF', '#A8A8A8', '#FF8FA3'];

export function StudyGraph({ label }: { label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext('2d')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, raf = 0, visible = false, hover = 0, hoverTarget = 0, last = performance.now(), t = 0;

    // pulsos: um ponto de luz que corre por uma ligação estrutural e escolhe outra ao chegar
    const structural = EDGES.filter((e) => e[2] === 0);
    const pulses = Array.from({ length: 7 }, (_, i) => ({ e: structural[(i * 23) % structural.length], p: i / 7 }));

    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pos = (n: Node, i: number) => {
      // enquadra o grafo (0..1) na área, com leve deriva e aproximação no hover
      const s = Math.min(W, H) * (0.92 + 0.14 * hover);
      const dx = reduced ? 0 : Math.sin(t * 0.35 + i * 1.7) * 2.2;
      const dy = reduced ? 0 : Math.cos(t * 0.3 + i * 2.3) * 2.2;
      return [W / 2 + (n.x - 0.5) * s * (W / Math.min(W, H)) * 0.92 + dx, H / 2 + (n.y - 0.5) * s + dy];
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const P = NODES.map(pos);
      const glow = 0.6 + 0.4 * hover;

      ctx.lineWidth = 1;
      for (const [a, b, inferred] of EDGES) {
        ctx.strokeStyle = inferred ? `rgba(255, 143, 163, ${0.10 * glow})` : `rgba(255, 255, 255, ${0.09 * glow})`;
        ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke();
      }

      for (const pu of pulses) {
        const [a, b] = pu.e;
        const x = P[a][0] + (P[b][0] - P[a][0]) * pu.p, y = P[a][1] + (P[b][1] - P[a][1]) * pu.p;
        ctx.fillStyle = `rgba(255, 45, 85, ${0.9 * glow})`;
        ctx.shadowColor = '#FF2D55'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;

      NODES.forEach((n, i) => {
        const [x, y] = P[i];
        const r = n.r * (0.55 + 0.1 * hover) * Math.min(W, H) / 240;
        if (n.g <= 1) { ctx.shadowColor = COLORS[n.g]; ctx.shadowBlur = 10 * glow; }
        ctx.globalAlpha = n.g >= 2 ? 0.55 + 0.4 * hover : 1;
        ctx.fillStyle = COLORS[n.g];
        ctx.beginPath(); ctx.arc(x, y, Math.max(1, r), 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      });
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now; t += dt;
      hover += (hoverTarget - hover) * Math.min(1, dt * 6);
      for (const pu of pulses) {
        pu.p += dt * 0.6;
        if (pu.p >= 1) {
          // continua por uma ligação que sai do ponto onde chegou
          const end = pu.e[1];
          const next = structural.filter((e) => e[0] === end || e[1] === end);
          const e = next[Math.floor(Math.random() * next.length)] ?? structural[Math.floor(Math.random() * structural.length)];
          pu.e = e[0] === end ? e : [e[1], e[0], e[2]];
          pu.p = 0;
        }
      }
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };

    resize();
    draw();
    if (reduced) return;

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) { last = performance.now(); raf = requestAnimationFrame(loop); }
    });
    io.observe(cv);
    const card = cv.closest('a, article');
    const on = () => { hoverTarget = 1; }, off = () => { hoverTarget = 0; };
    card?.addEventListener('mouseenter', on); card?.addEventListener('mouseleave', off);
    card?.addEventListener('focusin', on); card?.addEventListener('focusout', off);
    const ro = new ResizeObserver(() => { resize(); draw(); });
    ro.observe(cv);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      card?.removeEventListener('mouseenter', on); card?.removeEventListener('mouseleave', off);
      card?.removeEventListener('focusin', on); card?.removeEventListener('focusout', off);
    };
  }, []);

  return (
    <div className="study-graph">
      <canvas ref={ref} className="study-graph__canvas" aria-hidden="true" />
      <span className="study-graph__label">{label} · {NODES.length} nodes</span>
    </div>
  );
}
