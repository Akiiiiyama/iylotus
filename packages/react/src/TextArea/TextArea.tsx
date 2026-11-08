import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { FieldShell, useFieldIds, type FieldProps } from '../Field/Field.js';

export interface TextAreaProps extends FieldProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Shows `length / maxLength` next to the label. Needs `maxLength`. */
  showCount?: boolean;
}

/** TextArea · IY Lotus. Multi-line text with the same label, hint and error as TextField. */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { label, hint, error, showCount, id, className, disabled, rows = 4, maxLength, value, defaultValue, ...rest },
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
      <div className="iy-control iy-control--multiline">
        <textarea
          ref={ref}
          id={controlId}
          rows={rows}
          className="iy-control__input"
          disabled={disabled}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      </div>
    </FieldShell>
  );
});
