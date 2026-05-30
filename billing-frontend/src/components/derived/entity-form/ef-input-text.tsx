import type { EntityFormFieldInputProps } from '@/components/derived/entity-form/ef-field-types';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function EntityFormTextInput({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  placeholder,
}: EntityFormFieldInputProps) {
  return (
    <Input
      id={id}
      type="text"
      value={String(value ?? '')}
      readOnly={readOnly}
      disabled={disabled || readOnly}
      placeholder={placeholder}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      onBlur={onBlur}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

/** Uppercase display; stores lowercase for API (e.g. name board code slug). */
export function EntityFormBadgeTextInput(props: EntityFormFieldInputProps) {
  return (
    <Input
      id={props.id}
      type="text"
      value={String(props.value ?? '').toUpperCase()}
      readOnly={props.readOnly}
      disabled={props.disabled || props.readOnly}
      placeholder={props.placeholder}
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="characters"
      spellCheck={false}
      className={cn('font-mono uppercase tracking-wide')}
      onBlur={props.onBlur}
      onChange={(event) => props.onChange(event.target.value.toLowerCase())}
    />
  );
}
