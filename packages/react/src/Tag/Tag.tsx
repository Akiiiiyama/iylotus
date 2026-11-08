import type { HTMLAttributes } from 'react';

/**
 * Tag · IY Lotus
 *
 * Mono, uppercase label with a hairline border, like the reel's `ROLE 01 / 02`. For categories and counters, not actions.
 */
export function Tag({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={['iy-tag', className].filter(Boolean).join(' ')} {...rest}>{children}</span>;
}
