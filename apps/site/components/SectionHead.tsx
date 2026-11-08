/** Cabeçalho de seção no estilo do reel: rótulos mono nos cantos e título gigante leve/negrito. */
export function SectionHead({ id, label, counter, title, lede }: { id: string; label: string; counter: string; title: [string, string]; lede?: string }) {
  return (
    <header className="section-head">
      <div className="labels"><span>{label}</span><span>{counter}</span></div>
      <h2 id={id} className="headline">
        <span className="iy-lt">{title[0]}</span><span className="iy-bd">{title[1]}</span><span className="iy-dot">.</span>
      </h2>
      {lede && <p className="lede">{lede}</p>}
    </header>
  );
}
