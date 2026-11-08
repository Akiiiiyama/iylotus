import { forwardRef, type SelectHTMLAttributes } from 'react';
import { FieldShell, useFieldIds, type FieldProps } from '../Field/Field.js';

export interface SelectProps extends FieldProps, SelectHTMLAttributes<HTMLSelectElement> {
  /** Shown as the first, empty option until something is chosen. */
  placeholder?: string;
}

/**
 * Select · IY Lotus
 *
 * Native `<select>` styled like TextField: keyboard, screen readers and mobile pickers work out of the box.
 * Pass `<option>` elements as children.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, placeholder, id, className, disabled, children, defaultValue, value, ...rest },
  ref,
) {
  const { controlId, hintId, errorId, describedBy, invalid } = useFieldIds(id, hint, error);

  return (
    <FieldShell label={label} hint={hint} error={error} controlId={controlId} hintId={hintId} errorId={errorId} disabled={disabled} className={className}>
      <div className="iy-control iy-select">
        <select
          ref={ref}
          id={controlId}
          className="iy-control__input iy-select__input"
          disabled={disabled}
          value={value}
          defaultValue={value === undefined ? (defaultValue ?? (placeholder ? '' : undefined)) : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...rest}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {children}
        </select>
        <svg className="iy-select__chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </FieldShell>
  );
});
