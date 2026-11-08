'use client';

import { useState, type HTMLAttributes } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** Full name: used for the initials and as the accessible name. */
  name: string;
  /** Photo. If it fails to load, the initials show instead. */
  src?: string;
  /** sm 32, md 44, lg 64. */
  size?: AvatarSize;
  /** The brand's red dot, at the corner of the initials. */
  dot?: boolean;
}

const initials = (name: string) =>
  name.trim().split(/\s+/).filter(Boolean).map((w) => w[0]).filter((_, i, a) => i === 0 || i === a.length - 1).join('').toUpperCase();

/** Avatar · IY Lotus. Photo or initials, with the red dot as signature. */
export function Avatar({ name, src, size = 'md', dot = true, className, ...rest }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <span
      role="img"
      aria-label={name}
      className={['iy-avatar', `iy-avatar--${size}`, dot && !showImage && 'iy-avatar--dot', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {showImage
        ? <img className="iy-avatar__img" src={src} alt="" onError={() => setFailed(true)} />
        : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}
