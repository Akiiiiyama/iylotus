'use client';

import { useEffect, useRef } from 'react';

/**
 * Vídeo em loop que só baixa quando está perto de aparecer na tela.
 * Antes, o reel (o arquivo mais pesado da página) baixava assim que o site abria, mesmo estando lá embaixo,
 * nos projetos. Agora a página abre só com o poster (uma imagem leve); o vídeo carrega a ~600px de distância
 * e começa a tocar. Fora da tela ele pausa, para não gastar bateria. Quem pediu menos movimento vê só o poster.
 */
export function LazyVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!v.src) v.src = src;
        v.play().catch(() => { /* o navegador pode bloquear o autoplay: fica o poster */ });
      } else if (v.src) {
        v.pause();
      }
    }, { rootMargin: '600px 0px' });
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" />;
}
