'use client';

import { createContext, forwardRef, useContext, useId, type ChangeEvent, type InputHTMLAttributes, type ReactNode } from 'react';

interface GroupContext {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}
const RadioGroupContext = createContext<GroupContext | null>(null);

export interface RadioGroupProps {
  /** The question, read by screen readers before the options. */
  legend: ReactNode;
  /** Shared `name`. Generated when omitted. */
  name?: string;
  /** Selected value, for a controlled group. */
  value?: string;
  /** Initial value, for an uncontrolled group. */
  defaultValue?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  hint?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  /** Stack (default) or side by side. */
  direction?: 'column' | 'row';
  className?: string;
  children: ReactNode;
}

/** RadioGroup · IY Lotus. A fieldset with a legend: arrow keys move between options. */
export function RadioGroup({ legend, name, value, defaultValue, onChange, hint, error, disabled, direction = 'column', className, children }: RadioGroupProps) {
  const auto = useId();
  const groupName = name ?? `iy-radio-${auto}`;
  const hintId = hint ? `${groupName}-hint` : undefined;
  const errorId = error ? `${groupName}-error` : undefined;

  return (
    <fieldset
      className={['iy-radio-group', `iy-radio-group--${direction}`, className].filter(Boolean).join(' ')}
      disabled={disabled}
      aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="iy-radio-group__legend">{legend}</legend>
      <RadioGroupContext.Provider value={{ name: groupName, value, defaultValue, onChange, disabled }}>
        <div className="iy-radio-group__options">{children}</div>
      </RadioGroupContext.Provider>
      {hint && <p className="iy-field__hint" id={hintId}>{hint}</p>}
      {error && <p className="iy-field__error" id={errorId}>{error}</p>}
    </fieldset>
  );
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  label: ReactNode;
  value: string;
  hint?: ReactNode;
}

/** Radio · IY Lotus. Use inside a RadioGroup. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio({ label, hint, value, className, disabled, ...rest }, ref) {
  const group = useContext(RadioGroupContext);
  // Grupo controlado marca pelo value; não controlado só define o estado inicial (defaultChecked).
  const controlled = group?.value !== undefined;
  const isDisabled = disabled ?? group?.disabled;

  return (
    <label className={['iy-choice', isDisabled && 'iy-choice--disabled', className].filter(Boolean).join(' ')}>
      <input
        ref={ref}
        type="radio"
        className="iy-choice__input iy-radio"
        name={group?.name}
        value={value}
        disabled={isDisabled}
        {...(controlled ? { checked: group?.value === value, onChange: group?.onChange } : { defaultChecked: group?.defaultValue === value, onChange: group?.onChange })}
        {...rest}
      />
      <span className="iy-choice__text">
        <span className="iy-choice__label">{label}</span>
        {hint && <span className="iy-choice__hint">{hint}</span>}
      </span>
    </label>
  );
});
