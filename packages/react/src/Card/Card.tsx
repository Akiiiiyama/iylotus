import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';

export type CardTone = 'raised' | 'grey' | 'ink' | 'red';
export type CardShape = 'rounded' | 'tile';

interface CardBaseProps {
  /**
   * Background. `raised` follows the theme. `grey`, `ink` and `red` are fixed scenes, like the reel's artifacts:
   * they look the same in light and dark.
   */
  tone?: CardTone;
  /** `rounded`: radius 18 with a hairline border. `tile`: square, 4:5, for edge-to-edge grids (gap 2). */
  shape?: CardShape;
  className?: string;
  children: ReactNode;
}

type CardAsArticle = CardBaseProps & Omit<HTMLAttributes<HTMLElement>, 'children'> & { href?: undefined };
type CardAsLink = CardBaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string };
export type CardProps = CardAsArticle | CardAsLink;

/**
 * Card · IY Lotus
 *
 * With `href`, the whole card is one link (and gets hover and focus). Without it, it is a static `<article>`.
 * Compose with CardMedia, CardTag, CardTitle, CardMeta and CardStat.
 */
export function Card({ tone = 'raised', shape = 'rounded', className, children, ...rest }: CardProps) {
  const classes = ['iy-card', `iy-card--${tone}`, `iy-card--${shape}`, rest.href && 'iy-card--link', className].filter(Boolean).join(' ');
  if (rest.href !== undefined) {
    return <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
  }
  return <article className={classes} {...(rest as HTMLAttributes<HTMLElement>)}>{children}</article>;
}

/** Image or visual area on top of the card. Decorative visuals should carry `aria-hidden`. */
export function CardMedia({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['iy-card__media', className].filter(Boolean).join(' ')} {...rest}>{children}</div>;
}

/** Card content area with the standard padding. Tile cards can skip it and place parts directly. */
export function CardBody({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['iy-card__body', className].filter(Boolean).join(' ')} {...rest}>{children}</div>;
}

/** Mono, uppercase label: "Case", "Tokens". */
export function CardTag({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={['iy-card__tag', className].filter(Boolean).join(' ')} {...rest}>{children}</span>;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level for the page outline. Visual size stays the same. */
  as?: 'h2' | 'h3' | 'h4' | 'p';
}

/** Title. Pair `.iy-lt` and `.iy-bd` on whole words: <span className="iy-lt">Design </span><span className="iy-bd">System</span>. */
export function CardTitle({ as: Tag = 'h3', className, children, ...rest }: CardTitleProps) {
  return <Tag className={['iy-card__title', className].filter(Boolean).join(' ')} {...rest}>{children}</Tag>;
}

/** Small mono line at the bottom: year, area, call to action. */
export function CardMeta({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={['iy-card__meta', className].filter(Boolean).join(' ')} {...rest}>{children}</span>;
}

export interface CardStatProps extends HTMLAttributes<HTMLParagraphElement> {
  /** The number, in light weight. */
  value: ReactNode;
  /** What comes after the number, in bold: "+", "%", "k". */
  suffix?: ReactNode;
}

/** Big number in the light/bold pair, like the reel's stat tile. */
export function CardStat({ value, suffix, className, ...rest }: CardStatProps) {
  return (
    <p className={['iy-card__stat', className].filter(Boolean).join(' ')} {...rest}>
      <span className="iy-lt">{value}</span>
      {suffix && <span className="iy-bd">{suffix}</span>}
    </p>
  );
}
