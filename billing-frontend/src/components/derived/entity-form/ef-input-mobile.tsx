import type { EntityFormFieldInputProps } from '@/components/derived/entity-form/ef-field-types';
import {
  formatMobileInputDisplay,
  parseMobileStoredValue,
} from '@/components/derived/entity-form/ef-input-value';
import { Input } from '@/components/ui/input';

export function EntityFormMobileInput({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  placeholder = '+91 XXX XXX XXXX',
}: EntityFormFieldInputProps) {
  return (
    <Input
      id={id}
      type="tel"
      inputMode="tel"
      value={formatMobileInputDisplay(value)}
      readOnly={readOnly}
      disabled={disabled || readOnly}
      placeholder={placeholder}
      autoComplete="tel"
      onBlur={onBlur}
      onChange={(event) => onChange(parseMobileStoredValue(event.target.value))}
    />
  );
}
