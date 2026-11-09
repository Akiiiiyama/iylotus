/**
 * O loop design ↔ código, ao lado da frase do manifesto.
 * Um anel em traço fino com dois pontos, Figma e React, que giram com a rolagem enquanto o anel se fecha.
 * Quando a frase chega em "in one loop.", o ponto vermelho aparece no centro.
 * O movimento vem do CSS (ligado à mesma rolagem que acende as palavras); sem suporte, o loop aparece pronto.
 */
const TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

export function LoopDiagram({ from, to }: { from: string; to: string }) {
  return (
    <svg className="loop" viewBox="0 0 400 400" role="img" aria-label={`${from} ↔ ${to}`}>
      {/* trilho e marcações, como uma régua do Figma em volta do anel */}
      <circle className="loop__track" cx="200" cy="200" r="150" />
      <g className="loop__ticks">
        {TICKS.map((a) => (
          <line key={a} x1="200" y1="38" x2="200" y2={a % 90 === 0 ? 30 : 34} transform={`rotate(${a} 200 200)`} />
        ))}
      </g>
      {/* o anel que se fecha com a rolagem (começa no topo e corre no sentido horário) */}
      <circle className="loop__arc" cx="200" cy="200" r="150" pathLength={1} transform="rotate(-90 200 200)" />
      {/* os dois lados do trabalho, girando juntos; os rótulos giram ao contrário para ficar de pé */}
      <g className="loop__spin">
        <g transform="translate(200 50)">
          <circle className="loop__node" r="9" />
          <g className="loop__upright"><text className="loop__label" y="-26">{from}</text></g>
        </g>
        <g transform="translate(200 350)">
          <circle className="loop__node loop__node--code" r="9" />
          <g className="loop__upright"><text className="loop__label" y="40">{to}</text></g>
        </g>
      </g>
      <text className="loop__center" x="200" y="186">design ↔ code</text>
      <circle className="loop__dot" cx="200" cy="216" r="9" />
    </svg>
  );
}
