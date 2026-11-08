import type { HTMLAttributes } from 'react';

export interface CardGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Destaque em coleção: ao passar o mouse (ou focar pelo teclado) num card, ele fica em evidência e os outros
   * se apagam. Substitui o contorno de hover do card isolado. Use em grades de cases e projetos.
   */
  spotlight?: boolean;
}

/**
 * CardGroup · IY Lotus
 *
 * Agrupa cards. O layout (grade, colunas, espaço) fica com quem usa, via `className` ou `style`;
 * o CardGroup cuida só do comportamento do grupo.
 */
export function CardGroup({ spotlight = false, className, children, ...rest }: CardGroupProps) {
  const classes = ['iy-card-group', spotlight && 'iy-card-group--spotlight', className].filter(Boolean).join(' ');
  return <div className={classes} {...rest}>{children}</div>;
}
