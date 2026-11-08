import type { HTMLAttributes } from 'react';

export type BadgeTone = 'accent' | 'neutral' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** `accent` (red) for the one thing to notice, `neutral` for status, `outline` for quiet metadata. */
  tone?: BadgeTone;
}

/** Badge · IY Lotus. Short pill with a status or a number, like the reel's `AA 5.9 : 1`. */
export function Badge({ tone = 'accent', className, children, ...rest }: BadgeProps) {
  return <span className={['iy-badge', `iy-badge--${tone}`, className].filter(Boolean).join(' ')} {...rest}>{children}</span>;
}
