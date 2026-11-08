'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Abertura do site, na linguagem do reel Design Engineer:
 * - a onda de luz (inspirada em "Wave Motion", nas cores Red Neon do IY Lotus) é desenhada num shader WebGL;
 * - um cursor de colaboração com a etiqueta "IY.", como no Figma, entra, clica e digita as frases;
 * - as frases são digitadas com o cursor de texto vermelho, em pares leve/negrito, com rótulos mono nos cantos;
 * - no fim, o cursor vira o ponto final de "Design Engineer.", o ponto viaja até o centro enquanto a onda
 *   se recolhe nele, e se abre revelando a página.
 *
 * Toca só na primeira visita da sessão e nunca para quem pediu menos movimento (o script do layout decide,
 * antes da página aparecer, colocando a classe `is-opening` no <html>).
 * TODO (voz): quando a gravação existir, tocar o áudio a partir de um clique em "Enter" e ligar `voice()` ao volume real.
 */

type Part = [text: string, cls: 'iy-lt' | 'iy-bd'];
type Phrase = { label: string; type: [number, number]; hold: number; parts: Part[] };

// Cada frase: quando digita (início, fim), até quando fica na tela, e o texto em pares leve/negrito.
const PHRASES: Phrase[] = [
  { label: 'Hello', type: [0.4, 1.25], hold: 1.6, parts: [['Welcome to my website', 'iy-lt']] },
  { label: 'Name', type: [1.75, 2.55], hold: 3.1, parts: [['I’m Isabela ', 'iy-lt'], ['Yukari', 'iy-bd']] },
  { label: 'Role', type: [3.25, 3.85], hold: 4.55, parts: [['Design ', 'iy-lt'], ['Engineer', 'iy-bd']] },
];
const DUR = 6.2;
const T = { drawIn: [0.0, 0.8], toDot: [3.95, 4.2], collapse: [4.55, 5.1], reveal: [5.3, 6.2] } as const;

// Red Neon: cada lâmina passa de uma cor para outra ao longo do comprimento, como o azul ↔ lilás da referência.
const SHEETS = [
  { c1: [255, 45, 85], c2: [255, 143, 163], a: 1.25, amp: 1.0, wid: 0.13, f: [2.2, 3.9], sp: [1.0, -0.65], ph: 0.0, tw: [4.6, 0.9] },
  { c1: [200, 16, 46], c2: [255, 45, 85], a: 1.4, amp: 0.85, wid: 0.11, f: [1.8, 4.6], sp: [-0.85, 0.75], ph: 1.9, tw: [5.4, -1.1] },
  { c1: [255, 143, 163], c2: [255, 255, 255], a: 0.8, amp: 0.6, wid: 0.09, f: [2.6, 3.3], sp: [-1.15, 0.55], ph: 5.1, tw: [6.2, -0.8] },
];
const EXPOSURE = 2.2, WHITE = 0.3;

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
const blink = (t: number) => Math.floor(t / 0.265) % 2 === 0;

// Envelope de "voz" simulado: sílabas (~4 por segundo) enquanto cada frase é digitada e logo depois.
function voice(t: number) {
  let v = 0;
  for (const p of PHRASES) {
    const [a, b] = p.type;
    if (t < a - 0.2 || t > b + 0.45) continue;
    const gate = prog(t, a - 0.15, a + 0.1) * (1 - prog(t, b + 0.05, b + 0.45));
    const syl = 0.55 + 0.45 * Math.abs(Math.sin((t - a) * Math.PI * 4.1)) * (0.7 + 0.3 * Math.sin((t - a) * 9.3));
    v = Math.max(v, gate * syl);
  }
  return v;
}

/** Texto digitado até `n` caracteres, mantendo o par leve/negrito. */
function typed(parts: Part[], n: number) {
  let left = n, html = '';
  for (const [s, c] of parts) {
    const k = Math.max(0, Math.min(s.length, left));
    left -= k;
    if (k) html += `<span class="${c}">${s.slice(0, k)}</span>`;
  }
  return html;
}

const VS = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
const FS = `
precision highp float;
uniform vec2 uRes; uniform float uT, uAmp, uHalf, uCy, uK, uExp, uWhite;
uniform vec3 uC1[3]; uniform vec3 uC2[3]; uniform float uA[3], uAmpS[3], uWid[3], uPh[3];
uniform vec2 uF[3], uSp[3], uTw[3];
void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec3 col = vec3(0.0);
  float x0 = uRes.x * 0.5 - uHalf;
  float uRaw = (p.x - x0) / max(2.0 * uHalf, 1.0);
  float u = clamp(uRaw, 0.0, 1.0);
  float outside = max(0.0, max(-uRaw, uRaw - 1.0)) * 2.0 * uHalf;
  if (uHalf > 0.5 && outside < 200.0 && abs(p.y - uCy) < uRes.y * 0.36) {
    // pontas afinam como na referência: a onda se abre no meio e termina em ponto de luz
    float env = pow(sin(3.14159265 * u), 1.6);
    // nós: pontos em que todas as lâminas se cruzam e afinam, formando os "X" da referência
    float sn = sin(3.14159265 * (1.65 * u + 0.12 + 0.05 * sin(uT * 0.5)));
    float node = 0.22 + 0.78 * sn * sn;
    float e2 = env * node;
    float tt = uT * 0.8;
    for (int i = 0; i < 3; i++) {
      float c = (sin(u * uF[i].x + tt * uSp[i].x + uPh[i]) * 0.62 + sin(u * uF[i].y + tt * uSp[i].y + uPh[i] * 1.7) * 0.38) * uAmpS[i] * 0.19 * uAmp;
      float w = sin(u * uTw[i].x + tt * uTw[i].y + uPh[i]) * uWid[i] * (0.6 + 0.4 * uAmp);
      float yc = uCy + mix(env, e2, 0.5) * uRes.y * c * 1.6;
      float hw = abs(e2 * uRes.y * w) * uK;
      float dy = abs(p.y - yc);
      float d = length(vec2(abs(dy - hw), outside));
      vec3 hue = mix(uC1[i], uC2[i], 0.5 + 0.5 * sin(u * 2.4 + uT * 0.6 + uPh[i]));
      // como na referência: a lâmina é uma faixa de luz acetinada. Uma borda é o fio branco e aceso, a outra é macia,
      // e o lado aceso troca quando a lâmina torce. O miolo tem cor, clareando em direção à borda acesa.
      float bright = (p.y < yc) == (w > 0.0) ? 1.0 : 0.0;
      float edgeCore = mix(0.12, 0.65, bright);
      float glow = edgeCore * exp(-d / 0.9) + 0.26 * exp(-d / 4.5) + 0.12 * exp(-d / 24.0);
      float side = clamp(((p.y < yc) == (w > 0.0) ? 1.0 : -1.0) * dy / max(hw, 1.0), -1.0, 1.0); // -1 borda macia · +1 borda acesa
      float inside = (1.0 - smoothstep(hw - 1.5, hw + 1.5, dy)) * step(outside, 0.0);
      float sheen = 0.65 + 0.35 * sin(u * 7.0 - uT * 1.3 + uPh[i] * 2.0);
      float streaks = 0.7 + 0.3 * cos(side * 9.0);
      float fill = inside * (0.04 + 0.42 * pow(0.5 + 0.5 * side, 2.6)) * sheen * streaks;
      float twist = 1.0 + 1.0 * exp(-hw / 8.0);
      float fade = 0.3 + 0.7 * pow(env, 0.5);
      col += (mix(hue, vec3(1.0), uWhite) * glow * twist + hue * fill) * uA[i] * fade;
    }
  }
  col = 1.0 - exp(-col * uExp);
  vec3 bg = vec3(20.0 / 255.0);
  gl_FragColor = vec4(bg + col * (1.0 - bg), 1.0);
}`;

export function Opening({ skipLabel }: { skipLabel: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains('is-opening')) return;
    setActive(true);

    const cv = canvasRef.current!, root = rootRef.current!, text = textRef.current!, caret = caretRef.current!;
    const dot = dotRef.current!, label = labelRef.current!, counter = counterRef.current!, pointer = pointerRef.current!;
    let px = NaN, py = NaN; // posição atual do cursor IY. (segue o texto com suavidade)
    const gl = cv.getContext('webgl', { antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: true });
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
    gl.uniform3fv(U('uC1'), SHEETS.flatMap((s) => s.c1.map((c) => c / 255)));
    gl.uniform3fv(U('uC2'), SHEETS.flatMap((s) => s.c2.map((c) => c / 255)));
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
      // ---- onda
      const grow = OUT(prog(t, T.drawIn[0], T.drawIn[1]));
      const shrink = INOUT(prog(t, T.collapse[0], T.collapse[1]));
      const half = W * 0.5 * grow * (1 - shrink);
      const amp = (0.55 + 0.45 * voice(t)) * (1 - shrink);
      const cy = H * 0.42;
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uT, t); gl.uniform1f(uAmp, amp); gl.uniform1f(uHalf, half); gl.uniform1f(uCy, cy); gl.uniform1f(uK, 1 - shrink);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // ---- frase atual, digitada com o cursor vermelho
      let i = PHRASES.findIndex((p) => t < p.hold);
      if (i < 0) i = PHRASES.length - 1;
      const ph = PHRASES[i];
      const total = ph.parts.reduce((n, [s]) => n + s.length, 0);
      const n = Math.round(total * prog(t, ph.type[0], ph.type[1]));
      const str = typed(ph.parts, n);
      if (text.innerHTML !== str) text.innerHTML = str;
      label.textContent = ph.label;
      counter.textContent = `0${i + 1} / 03`;

      // cursor: pisca parado, fica aceso enquanto digita; na última frase vira o ponto final
      const typing = t >= ph.type[0] && t <= ph.type[1];
      const last = i === PHRASES.length - 1;
      const toDot = last ? OUT(prog(t, T.toDot[0], T.toDot[1])) : 0;
      const caretOn = toDot > 0 || typing || blink(t);
      Object.assign(caret.style, {
        width: `${lerp(0.06, 0.2, toDot)}em`, height: `${lerp(0.8, 0.2, toDot)}em`,
        borderRadius: toDot > 0.5 ? '50%' : '2px', marginLeft: `${lerp(0.04, 0.05, toDot)}em`,
        visibility: caretOn && !(last && t >= T.collapse[0]) ? 'visible' : 'hidden',
      });
      const textFade = 1 - prog(t, T.collapse[0], T.collapse[0] + 0.3);
      text.parentElement!.style.opacity = String(textFade);

      // ---- cursor de colaboração "IY.", como no Figma: entra pelo canto, clica para começar cada frase e segue o texto
      const cr = caret.getBoundingClientRect();
      const tx = cr.right + 10, ty = cr.bottom + 6;
      const enter = OUT(prog(t, 0.0, 0.42));
      if (t < 0.42 || Number.isNaN(px)) {
        px = lerp(W * 0.86, tx, enter); py = lerp(H * 1.05, ty, enter);
      } else {
        px += (tx - px) * 0.2; py += (ty - py) * 0.2;
      }
      const leave = INOUT(prog(t, T.collapse[0] - 0.05, T.collapse[0] + 0.4));
      const ox = lerp(px, W * 0.9, leave), oy = lerp(py, H * 1.08, leave);
      // clique: um apertão rápido quando cada frase começa a ser digitada
      let press = 0;
      for (const ph2 of PHRASES) press = Math.max(press, Math.sin(Math.PI * prog(t, ph2.type[0] - 0.08, ph2.type[0] + 0.08)));
      pointer.style.transform = `translate(${ox}px, ${oy}px) scale(${1 - 0.14 * press})`;
      pointer.style.opacity = String(1 - prog(t, T.collapse[0] + 0.1, T.collapse[0] + 0.45));

      // ---- o ponto final sai do texto, viaja até o centro da onda e se abre revelando a página
      const reveal = INOUT(prog(t, T.reveal[0], T.reveal[1]));
      if (last && t >= T.collapse[0]) {
        const r0 = caret.getBoundingClientRect();
        const travel = INOUT(prog(t, T.collapse[0], T.collapse[1]));
        const size = lerp(r0.width || 14, 22, travel);
        const x = lerp(r0.left + r0.width / 2, W / 2, travel), y = lerp(r0.top + r0.height / 2, cy, travel);
        Object.assign(dot.style, { display: 'block', width: `${size}px`, height: `${size}px`, left: `${x - size / 2}px`, top: `${y - size / 2}px`, opacity: String(1 - reveal) });
      } else {
        dot.style.display = 'none';
      }
      const hole = lerp(0, Math.hypot(W, H), reveal);
      const mask = reveal > 0 ? `radial-gradient(circle at 50% ${cy}px, transparent ${hole}px, #000 ${hole + 1}px)` : 'none';
      root.style.maskImage = mask;
      root.style.webkitMaskImage = mask;
    };

    // modo de inspeção: /en?opening-debug deixa renderizar qualquer instante (usado para conferir quadros)
    if (location.search.includes('opening-debug')) {
      (window as unknown as { __opening: unknown }).__opening = { render, stop: () => cancelAnimationFrame(raf) };
    }

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
      <div className="opening__labels"><span ref={labelRef}>Hello</span><span ref={counterRef}>01 / 03</span></div>
      <p className="opening__caption" aria-live="polite">
        <span ref={textRef} />
        <span ref={caretRef} className="opening__caret" aria-hidden="true" />
      </p>
      <div ref={dotRef} className="opening__dot" />
      <div ref={pointerRef} className="opening__pointer" aria-hidden="true">
        <svg width="22" height="24" viewBox="0 0 22 24"><path d="M2 2 L2 19 L6.8 14.6 L10.2 22 L13.4 20.6 L10 13.4 L17 13.4 Z" fill="#C8102E" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        <span className="opening__pointer-tag">IY.</span>
      </div>
      <button type="button" className="opening__skip iy-button iy-button--secondary iy-button--sm" onClick={() => finishRef.current()}>
        <span className="iy-button__label">{skipLabel}</span>
      </button>
    </div>
  );
}
