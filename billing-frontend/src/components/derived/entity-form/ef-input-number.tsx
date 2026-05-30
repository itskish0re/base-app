import type { EntityFormFieldInputProps } from '@/components/derived/entity-form/ef-field-types';
import {
  formatNumberFieldDisplay,
  parseNumberFieldValue,
} from '@/components/derived/entity-form/ef-input-value';
import { Input } from '@/components/ui/input';

export function EntityFormNumberInput({
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
      inputMode="numeric"
      value={formatNumberFieldDisplay(value)}
      readOnly={readOnly}
      disabled={disabled || readOnly}
      placeholder={placeholder}
      autoComplete="off"
      onBlur={onBlur}
      onChange={(event) => onChange(parseNumberFieldValue(event.target.value))}
    />
  );
}
