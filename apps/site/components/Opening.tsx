'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Abertura do site: lâminas de luz em neon (paleta Red Neon do IY Lotus), desenhadas num shader WebGL.
 * A onda pulsa no ritmo das frases, se recolhe no ponto vermelho e o ponto se abre revelando a página.
 *
 * Toca só na primeira visita da sessão e nunca para quem pediu menos movimento (o script do layout decide,
 * antes da página aparecer, colocando a classe `is-opening` no <html>).
 * TODO (voz): quando a gravação existir, tocar o áudio a partir de um clique em "Enter" e ligar `voice()` ao volume real.
 */

const DUR = 6.2;
const LINES: [number, number, string][] = [
  [0.35, 1.55, '<span class="iy-lt">Welcome to my website.</span>'],
  [1.75, 3.1, '<span class="iy-lt">I’m Isabela </span><span class="iy-bd">Yukari</span>'],
  [3.25, 4.45, '<span class="iy-bd">Design Engineer</span><span class="iy-dot">.</span>'],
];
const T = { drawIn: [0.0, 0.7], collapse: [4.55, 5.05], dot: [5.05, 5.35], reveal: [5.35, 6.2] } as const;

// Red Neon: vermelho elétrico faz a luz, o #C8102E da marca é a base do brilho, rosa claro nas dobras.
const SHEETS = [
  { rgb: [255, 45, 85], a: 1.3, amp: 1.0, wid: 0.13, f: [3.1, 5.3], sp: [1.1, -0.7], ph: 0.0, tw: [3.4, 0.9] },
  { rgb: [200, 16, 46], a: 1.5, amp: 0.85, wid: 0.11, f: [2.6, 6.1], sp: [-0.9, 0.8], ph: 1.9, tw: [4.1, -1.1] },
  { rgb: [255, 143, 163], a: 0.9, amp: 0.55, wid: 0.09, f: [2.2, 7.0], sp: [-1.2, 0.6], ph: 5.1, tw: [5.0, -0.8] },
];
const EXPOSURE = 2.3, WHITE = 0.35;

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
const OUT = bez(0.16, 1, 0.3, 1), INOUT = bez(0.7, 0, 0.2, 1);

// Envelope de "voz" simulado: sílabas (~4 por segundo) dentro de cada frase.
function voice(t: number) {
  let v = 0;
  for (const [a, b] of LINES) {
    if (t < a - 0.2 || t > b + 0.3) continue;
    const gate = prog(t, a - 0.15, a + 0.1) * (1 - prog(t, b - 0.05, b + 0.3));
    const syl = 0.55 + 0.45 * Math.abs(Math.sin((t - a) * Math.PI * 4.1)) * (0.7 + 0.3 * Math.sin((t - a) * 9.3));
    v = Math.max(v, gate * syl);
  }
  return v;
}

const VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
const FS = `
precision highp float;
uniform vec2 uRes; uniform float uT, uAmp, uHalf, uCy, uK, uExp, uWhite;
uniform vec3 uCol[3]; uniform float uA[3], uAmpS[3], uWid[3], uPh[3];
uniform vec2 uF[3], uSp[3], uTw[3];
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec3 col = vec3(0.0);
  float x0 = uRes.x * 0.5 - uHalf;
  float uRaw = (p.x - x0) / max(2.0 * uHalf, 1.0);
  float u = clamp(uRaw, 0.0, 1.0);
  float outside = max(0.0, max(-uRaw, uRaw - 1.0)) * 2.0 * uHalf;
  if (uHalf > 0.5 && outside < 200.0 && abs(p.y - uCy) < uRes.y * 0.36) {
    float env = pow(sin(3.14159265 * u), 1.25);
    float tt = uT * 0.8;
    for (int i = 0; i < 3; i++) {
      float c = (sin(u * uF[i].x + tt * uSp[i].x + uPh[i]) * 0.62 + sin(u * uF[i].y + tt * uSp[i].y + uPh[i] * 1.7) * 0.38) * uAmpS[i] * 0.17 * uAmp;
      float w = sin(u * uTw[i].x + tt * uTw[i].y + uPh[i]) * uWid[i] * (0.55 + 0.45 * uAmp);
      float yc = uCy + env * uRes.y * c;
      float hw = abs(env * uRes.y * w) * uK;
      float dy = abs(p.y - yc);
      float d = length(vec2(abs(dy - hw), outside));
      // borda: brilho largo e macio; miolo: vidro translúcido com reflexo; torção: a luz se concentra
      float glow = 0.22 * exp(-d / 1.8) + 0.32 * exp(-d / 7.0) + 0.16 * exp(-d / 30.0);
      float vv = clamp(dy / max(hw, 1.0), 0.0, 1.0);
      float inside = (1.0 - smoothstep(hw - 2.0, hw + 2.0, dy)) * step(outside, 0.0);
      float sheen = 0.55 + 0.45 * sin(u * 8.0 - uT * 1.4 + uPh[i] * 2.0);
      float fill = inside * (0.16 + 0.55 * pow(vv, 2.0)) * sheen;
      float twist = 1.0 + 0.9 * exp(-hw / 10.0);
      float fade = 0.35 + 0.65 * pow(env, 0.6);
      col += (mix(uCol[i], vec3(1.0), uWhite) * glow * twist + uCol[i] * fill) * uA[i] * fade;
    }
  }
  col = 1.0 - exp(-col * uExp);
  vec3 bg = vec3(20.0 / 255.0);
  gl_FragColor = vec4(bg + col * (1.0 - bg), 1.0);
}`;

export function Opening({ skipLabel }: { skipLabel: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('is-opening')) return;
    setActive(true);

    const cv = canvasRef.current!, root = rootRef.current!, cap = capRef.current!, dot = dotRef.current!;
    const gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    let raf = 0, done = false;

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      try { sessionStorage.setItem('iy-opening-seen', '1'); } catch { /* sem armazenamento: toca de novo na próxima visita */ }
      html.classList.remove('is-opening');
      setActive(false);
    };
    finishRef.current = finish;
    if (!gl) { finish(); return; }

    // compila o shader e passa os parâmetros fixos das lâminas
    const sh = (type: number, src: string) => { const o = gl.createShader(type)!; gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { finish(); return; }
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string) => gl.getUniformLocation(pr, n);
    gl.uniform3fv(U('uCol'), SHEETS.flatMap((s) => s.rgb.map((c) => c / 255)));
    gl.uniform1fv(U('uA'), SHEETS.map((s) => s.a));
    gl.uniform1fv(U('uAmpS'), SHEETS.map((s) => s.amp));
    gl.uniform1fv(U('uWid'), SHEETS.map((s) => s.wid));
    gl.uniform1fv(U('uPh'), SHEETS.map((s) => s.ph));
    gl.uniform2fv(U('uF'), SHEETS.flatMap((s) => s.f));
    gl.uniform2fv(U('uSp'), SHEETS.flatMap((s) => s.sp));
    gl.uniform2fv(U('uTw'), SHEETS.flatMap((s) => s.tw));
    gl.uniform1f(U('uExp'), EXPOSURE);
    gl.uniform1f(U('uWhite'), WHITE);
    const uRes = U('uRes'), uT = U('uT'), uAmp = U('uAmp'), uHalf = U('uHalf'), uCy = U('uCy'), uK = U('uK');

    // o neon é macio por natureza: 1 pixel do canvas por pixel CSS basta, mesmo em telas Retina
    let W = 0, H = 0;
    const resize = () => {
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W; cv.height = H;
      gl.viewport(0, 0, W, H);
    };
    resize();
    addEventListener('resize', resize);

    const render = (t: number) => {
      const grow = OUT(prog(t, T.drawIn[0], T.drawIn[1]));
      const shrink = INOUT(prog(t, T.collapse[0], T.collapse[1]));
      const half = W * 0.5 * grow * (1 - shrink);
      const amp = (0.55 + 0.45 * voice(t)) * (1 - shrink);
      const cy = H * 0.46;
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uT, t); gl.uniform1f(uAmp, amp); gl.uniform1f(uHalf, half); gl.uniform1f(uCy, cy); gl.uniform1f(uK, 1 - shrink);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // o ponto vermelho nasce do fim da onda e se abre num círculo que revela a página
      const dotIn = OUT(prog(t, T.collapse[1] - 0.1, T.dot[1]));
      const reveal = INOUT(prog(t, T.reveal[0], T.reveal[1]));
      const r = dotIn > 0 ? lerp(0, 14, dotIn) : 0;
      Object.assign(dot.style, { width: `${2 * r}px`, height: `${2 * r}px`, left: `${W / 2 - r}px`, top: `${cy - r}px`, opacity: String(1 - reveal) });
      const hole = lerp(0, Math.hypot(W, H), reveal);
      const mask = reveal > 0 ? `radial-gradient(circle at 50% ${cy}px, transparent ${hole}px, #000 ${hole + 1}px)` : 'none';
      root.style.maskImage = mask;
      root.style.webkitMaskImage = mask;

      // legendas da fala
      let html_ = '', op = 0, dy = 0;
      for (const [a, b, h] of LINES) {
        if (t >= a - 0.05 && t < b + 0.25) {
          html_ = h;
          const pin = OUT(prog(t, a - 0.05, a + 0.35)), pout = prog(t, b, b + 0.25);
          op = pin * (1 - pout); dy = (1 - pin) * 18 - pout * 8;
        }
      }
      if (cap.innerHTML !== html_) cap.innerHTML = html_;
      cap.style.opacity = String(op);
      cap.style.transform = `translateY(${dy}px)`;
    };

    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      render(Math.min(t, DUR));
      if (t < DUR) raf = requestAnimationFrame(loop); else finish();
    };
    raf = requestAnimationFrame(loop);

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') finish(); };
    addEventListener('keydown', onKey);
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('keydown', onKey); };
  }, []);

  return (
    <div ref={rootRef} className="opening" data-theme="dark" aria-hidden={!active}>
      <canvas ref={canvasRef} className="opening__canvas" />
      <div ref={dotRef} className="opening__dot" />
      <div ref={capRef} className="opening__caption" aria-live="polite" />
      <button type="button" className="opening__skip iy-button iy-button--secondary iy-button--sm" onClick={() => finishRef.current()}>
        <span className="iy-button__label">{skipLabel}</span>
      </button>
    </div>
  );
}
