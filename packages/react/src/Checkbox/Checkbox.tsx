import { forwardRef, useEffect, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  /** Help text under the label. */
  hint?: ReactNode;
  /** "Some selected": a dash instead of a check. Visual and for screen readers. */
  indeterminate?: boolean;
}

/** Checkbox · IY Lotus. Native checkbox, so Space toggles it and forms read it as usual. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, hint, indeterminate = false, className, disabled, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement);
  // indeterminate só existe como propriedade do DOM, não como atributo HTML.
  useEffect(() => { if (inner.current) inner.current.indeterminate = indeterminate; }, [indeterminate]);

  return (
    <label className={['iy-choice', disabled && 'iy-choice--disabled', className].filter(Boolean).join(' ')}>
      <input ref={inner} type="checkbox" className="iy-choice__input iy-checkbox" disabled={disabled} {...rest} />
      <span className="iy-choice__text">
        <span className="iy-choice__label">{label}</span>
        {hint && <span className="iy-choice__hint">{hint}</span>}
      </span>
    </label>
  );
});
