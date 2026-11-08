import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { FieldShell, useFieldIds, type FieldProps } from '../Field/Field.js';

export interface TextFieldProps extends FieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  /** Text or icon before the value, e.g. `https://` or a search icon. */
  prefix?: ReactNode;
  /** Text or icon after the value, e.g. `⌘K` or a unit. */
  suffix?: ReactNode;
  /** Shows `length / maxLength` next to the label. Needs `maxLength`. */
  showCount?: boolean;
}

/**
 * TextField · IY Lotus
 *
 * Figma: `TextField / state=default|focus|filled|error|disabled` · use `type="search"` for search.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, prefix, suffix, showCount, id, className, disabled, type = 'text', maxLength, value, defaultValue, ...rest },
  ref,
) {
  const { controlId, hintId, errorId, describedBy, invalid } = useFieldIds(id, hint, error);
  const length = String(value ?? defaultValue ?? '').length;

  return (
    <FieldShell
      label={label} hint={hint} error={error} controlId={controlId} hintId={hintId} errorId={errorId}
      disabled={disabled} className={className}
      aside={showCount && maxLength ? `${length} / ${maxLength}` : undefined}
    >
      <div className="iy-control">
        {prefix && <span className="iy-control__affix" aria-hidden="true">{prefix}</span>}
        <input
          ref={ref}
          id={controlId}
          type={type}
          className="iy-control__input"
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {suffix && <span className="iy-control__affix" aria-hidden="true">{suffix}</span>}
      </div>
    </FieldShell>
  );
});
