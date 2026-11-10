// Exporta o recorte PÚBLICO do Mapa do conhecimento do painel de estudos (AI_Studies) para o site.
// Entra só o que é conhecimento geral: termos do glossário, práticas, materiais da biblioteca de Design Eng & IA
// e os temas que os agrupam. Fica de fora tudo que é pessoal: vagas, LinkedIn, marcos (com nomes de cases),
// hábitos, notas e o progresso (o que já foi feito ou não).
//
// Uso (na raiz do repositório):
//   node apps/site/scripts/export-study-graph.mjs [caminho/para/painel.json]
// Padrão: ~/IA_Studies/painel/historico/painel.json
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';

const src = process.argv[2] || `${homedir()}/IA_Studies/painel/historico/painel.json`;
const out = new URL('../content/study-graph.json', import.meta.url);
const p = JSON.parse(readFileSync(src, 'utf8'));

// mesmos temas do painel
const TEMAS_PRATICA = { prompt: 'Prompt & context', agente: 'Agent workflows', qualidade: 'Design & code quality', seguranca: 'Security & privacy', aprendizado: 'Evaluation & learning', frontend: 'Front-end' };
const TEMAS_GLOSSARIO = { vibe_coding: 'Vibe coding', llm: 'LLM', front_end: 'Front-end', design_eng: 'Design Eng' };

// grupos (definem a cor no site): 0 centro, 1 tema, 2 termo, 3 prática, 4 biblioteca
const nodes = new Map();
const edges = [];
const add = (id, label, group) => nodes.set(id, { id, label, group });
const link = (a, b, inferred = false) => {
  if (a === b || !nodes.has(a) || !nodes.has(b)) return;
  if (edges.some((e) => (e.source === a && e.target === b) || (e.source === b && e.target === a))) return;
  edges.push({ source: a, target: b, inferred });
};

add('hub', 'Design Eng & AI', 0);
add('tema:biblioteca', 'Library', 1);
link('tema:biblioteca', 'hub');
for (const [k, r] of Object.entries(TEMAS_PRATICA)) { add(`tema:${k}`, r, 1); link(`tema:${k}`, 'hub'); }
for (const [k, r] of Object.entries(TEMAS_GLOSSARIO)) { add(`tema:g-${k}`, r, 1); link(`tema:g-${k}`, 'hub'); }

const bib = p.biblioteca.filter((b) => b.frente === 'design-eng');
for (const g of p.glossario) { add(g.id, g.termo, 2); link(g.id, `tema:g-${g.categoria}`); }
for (const x of p.praticas) { add(x.id, x.titulo, 3); link(x.id, `tema:${x.categoria}`); }
for (const b of bib) { add(b.id, b.titulo, 4); link(b.id, 'tema:biblioteca'); }

// ligações deduzidas, como no painel: uma prática que menciona um termo ou um material
const norm = (s) => ` ${s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9.]+/g, ' ')} `;
const keys = (t) => t.split(/[/()]/).map((x) => norm(x).trim()).filter((x) => x.length >= 3 && !['rules', 'tokens', 'agente'].includes(x));
const textos = p.praticas.map((x) => ({ id: x.id, texto: norm(`${x.titulo} ${x.como ?? ''}`) }));
for (const g of p.glossario) for (const { id, texto } of textos) if (keys(g.termo).some((c) => texto.includes(` ${c} `))) link(id, g.id, true);
for (const b of bib) {
  const c = norm(b.titulo.split(/ \(|,/)[0]).trim();
  if (c.length < 6) continue;
  for (const { id, texto } of textos) if (texto.includes(` ${c} `)) link(id, b.id, true);
}

// posições estáveis (simulação de forças, uma vez), enquadradas em 0..1
const list = [...nodes.values()].map((n, i) => ({ ...n, x: Math.cos(i * 2.4) * 10 * Math.sqrt(i), y: Math.sin(i * 2.4) * 10 * Math.sqrt(i) }));
const deg = Object.fromEntries(list.map((n) => [n.id, 0]));
for (const e of edges) { deg[e.source]++; deg[e.target]++; }
const radius = (n) => [10, 6, 2.6, 2.2, 2.4][n.group] + Math.min(4, deg[n.id] * 0.15);
forceSimulation(list)
  .force('link', forceLink(edges.map((e) => ({ ...e }))).id((n) => n.id).distance((l) => (l.inferred ? 90 : 34)).strength((l) => (l.inferred ? 0.04 : 0.5)))
  .force('charge', forceManyBody().strength((n) => -40 - deg[n.id] * 4).distanceMax(400))
  .force('collide', forceCollide().radius((n) => radius(n) + 3))
  .force('center', forceCenter(0, 0))
  .force('x', forceX(0).strength(0.04))
  .force('y', forceY(0).strength(0.07))
  .stop()
  .tick(400);
const xs = list.map((n) => n.x), ys = list.map((n) => n.y);
const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
const k = Math.max(x1 - x0, y1 - y0);
const index = new Map(list.map((n, i) => [n.id, i]));
const r3 = (v) => Math.round(v * 1000) / 1000;

const json = {
  source: 'AI_Studies · Mapa do conhecimento (recorte público)',
  counts: { terms: p.glossario.length, practices: p.praticas.length, library: bib.length, edges: edges.length },
  nodes: list.map((n) => ({ x: r3((n.x - (x0 + x1) / 2) / k + 0.5), y: r3((n.y - (y0 + y1) / 2) / k + 0.5), r: r3(radius(n)), g: n.group, l: n.label })),
  edges: edges.map((e) => [index.get(e.source), index.get(e.target), e.inferred ? 1 : 0]),
};
writeFileSync(out, JSON.stringify(json));
console.log(`study-graph.json: ${json.nodes.length} pontos, ${json.edges.length} ligações (${src})`);
