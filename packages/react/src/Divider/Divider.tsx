import type { HTMLAttributes } from 'react';

export interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  /** `hairline` (1 px, border color) between items; `strong` (1.5 px, text color) under section titles. */
  weight?: 'hairline' | 'strong';
}

/** Divider · IY Lotus. A real `<hr>`, so screen readers announce the break. */
export function Divider({ weight = 'hairline', className, ...rest }: DividerProps) {
  return <hr className={['iy-divider', `iy-divider--${weight}`, className].filter(Boolean).join(' ')} {...rest} />;
}
