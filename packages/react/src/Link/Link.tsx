import { forwardRef, type AnchorHTMLAttributes } from 'react';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Opens in a new tab with `rel="noopener noreferrer"` and an arrow that says so. */
  external?: boolean;
}

/**
 * Link · IY Lotus
 *
 * Text link with the red underline. For navigation; for actions, use Button.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ external = false, className, children, ...rest }, ref) {
  return (
    <a
      ref={ref}
      className={['iy-link', className].filter(Boolean).join(' ')}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
    >
      {children}
      {external && (
        <>
          <span className="iy-link__arrow" aria-hidden="true">↗</span>
          <span className="iy-visually-hidden">(opens in a new tab)</span>
        </>
      )}
    </a>
  );
});
