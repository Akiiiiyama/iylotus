import { useId, type ReactNode } from 'react';

export interface FieldProps {
  /** Visible label. Always present: a placeholder is not a label. */
  label: ReactNode;
  /** Help text under the control. */
  hint?: ReactNode;
  /** Error message. When set, the control is marked invalid and the message replaces nothing: hint stays. */
  error?: ReactNode;
}

/** Ids and aria attributes shared by every text-like field. */
export function useFieldIds(id: string | undefined, hint: ReactNode, error: ReactNode) {
  const auto = useId();
  const controlId = id ?? `iy-field-${auto}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return { controlId, hintId, errorId, describedBy, invalid: Boolean(error) };
}

interface FieldShellProps extends FieldProps {
  controlId: string;
  hintId?: string;
  errorId?: string;
  disabled?: boolean;
  className?: string;
  /** Extra text at the end of the label row, e.g. a character counter. */
  aside?: ReactNode;
  children: ReactNode;
}

/** Label on top, control, then hint and error. Internal: used by TextField, TextArea and Select. */
export function FieldShell({ label, hint, error, controlId, hintId, errorId, disabled, className, aside, children }: FieldShellProps) {
  return (
    <div className={['iy-field', disabled && 'iy-field--disabled', error && 'iy-field--invalid', className].filter(Boolean).join(' ')}>
      <div className="iy-field__top">
        <label className="iy-field__label" htmlFor={controlId}>{label}</label>
        {aside && <span className="iy-field__aside">{aside}</span>}
      </div>
      {children}
      {hint && <p className="iy-field__hint" id={hintId}>{hint}</p>}
      {error && <p className="iy-field__error" id={errorId}>{error}</p>}
    </div>
  );
}
