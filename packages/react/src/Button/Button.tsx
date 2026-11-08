import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. `accent` is the brand red: use it once per screen, for the main action. */
  variant?: ButtonVariant;
  /** Height: sm 32, md 44, lg 56. md is the minimum touch target. */
  size?: ButtonSize;
  /** Shows a spinner, keeps the label for screen readers and blocks clicks. */
  loading?: boolean;
  /** Icon before the label. */
  iconStart?: ReactNode;
  /** Icon after the label. */
  iconEnd?: ReactNode;
  /** Stretches to the width of its container. */
  fullWidth?: boolean;
}

/**
 * Button · IY Lotus
 *
 * Figma: `Button / variant=accent, size=md` · CSS: `.iy-button--accent.iy-button--md`
 * Icon-only buttons need an `aria-label`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, iconStart, iconEnd, fullWidth = false, disabled, className, children, type = 'button', onClick, ...rest },
  ref,
) {
  const iconOnly = !children && Boolean(iconStart || iconEnd);
  const classes = [
    'iy-button',
    `iy-button--${variant}`,
    `iy-button--${size}`,
    iconOnly && 'iy-button--icon-only',
    fullWidth && 'iy-button--full',
    loading && 'iy-button--loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled}
      // Loading keeps focus on the button (aria-disabled), so keyboard users don't lose their place.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      onClick={loading ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {loading && <span className="iy-button__spinner" aria-hidden="true" />}
      {iconStart && <span className="iy-button__icon" aria-hidden="true">{iconStart}</span>}
      {children && <span className="iy-button__label">{children}</span>}
      {iconEnd && <span className="iy-button__icon" aria-hidden="true">{iconEnd}</span>}
    </button>
  );
});
