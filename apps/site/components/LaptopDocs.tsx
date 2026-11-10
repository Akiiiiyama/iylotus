/**
 * Notebook com a documentação do IY Lotus rolando na tela e o tema trocando de claro para escuro.
 * Só CSS (globals.css, bloco "notebook"): a página é desenhada em tamanho real (1120 × 700) e reduzida na tela.
 * Duas cópias da página rolam juntas; a escura aparece num círculo que nasce do switch, como no site.
 * Decorativo (aria-hidden no CardMedia). Quem pediu menos movimento vê o topo da página, parado, no tema claro.
 */
const NEUTRALS = ['#FFFFFF', '#F2F2F2', '#E4E4E4', '#CFCFCF', '#A8A8A8', '#8A8A8A', '#6B6B6B', '#444444', '#2A2A2A', '#1C1C1C', '#141414'];
const NAV = ['Primitives', 'Components', 'Layouts', 'Foundations', 'Theme', 'Typography'];

function Page({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <div className={`lx-page lx-page--${theme}`} data-theme={theme}>
      <div className="lx-scroll">
        <section className="lx-band lx-band--ink">
          <div className="lx-labels"><span>Primitives</span><span>01 / 06</span></div>
          <p className="lx-headline"><span className="iy-lt">Raw </span><span className="iy-bd">values</span><span className="lx-dot">.</span></p>
          <div className="lx-swatches">{NEUTRALS.map((c) => <i key={c} style={{ background: c }} />)}</div>
          <div className="lx-swatches lx-swatches--red">{['#FDEBEE', '#F9CCD3', '#E4637A', '#C8102E', '#A80D27', '#8C0A20'].map((c) => <i key={c} style={{ background: c }} />)}</div>
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
        <section className="lx-band lx-band--red">
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
  return (
    <div className="laptop">
      <div className="laptop__lid">
        <div className="laptop__screen">
          <div className="laptop__viewport">
            <Page theme="light" />
            <Page theme="dark" />
          </div>
        </div>
      </div>
      <div className="laptop__base"><span className="laptop__notch" /></div>
    </div>
  );
}
