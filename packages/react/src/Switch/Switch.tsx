import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  label: ReactNode;
  /** On or off, for a controlled switch. */
  checked?: boolean;
  /** Initial state, for an uncontrolled switch. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Label before (default) or after the track. */
  labelPosition?: 'start' | 'end';
}

/**
 * Switch · IY Lotus
 *
 * For settings that apply right away, like the reel's dark-mode toggle. For choices sent with a form, use Checkbox.
 */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, checked, defaultChecked = false, onCheckedChange, labelPosition = 'start', className, disabled, onClick, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;

  const track = (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      className="iy-switch__track"
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (checked === undefined) setInner(!on);
        onCheckedChange?.(!on);
      }}
      {...rest}
    >
      <span className="iy-switch__thumb" aria-hidden="true" />
    </button>
  );

  // O label envolve tudo: clicar no texto também alterna, e o leitor de tela lê o texto como nome do switch.
  return (
    <label className={['iy-switch', disabled && 'iy-switch--disabled', className].filter(Boolean).join(' ')}>
      {labelPosition === 'start' && <span className="iy-switch__label">{label}</span>}
      {track}
      {labelPosition === 'end' && <span className="iy-switch__label">{label}</span>}
    </label>
  );
});
