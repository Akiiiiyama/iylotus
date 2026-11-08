/**
 * Frase que acende palavra por palavra conforme a rolagem (como nas páginas de produto da Apple).
 * Cada palavra recebe sua posição (--i) e o total (--n); o CSS liga o brilho de cada uma a um trecho da rolagem.
 * Palavras entre *asteriscos* ficam em negrito. Sem suporte ou com menos movimento, a frase aparece inteira.
 */
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <p className={['scroll-words', className].filter(Boolean).join(' ')} style={{ '--n': words.length } as React.CSSProperties}>
      {words.map((w, i) => {
        const bold = w.startsWith('*');
        const clean = w.replace(/\*/g, '');
        return (
          <span key={i} className={`scroll-words__w${bold ? ' iy-bd' : ''}`} style={{ '--i': i } as React.CSSProperties}>
            {clean}{i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </p>
  );
}
