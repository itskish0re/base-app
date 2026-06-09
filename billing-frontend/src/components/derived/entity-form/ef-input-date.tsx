import type { EntityFormFieldInputProps } from '@/components/derived/entity-form/ef-field-types';
import { DatePicker } from '@/components/ui/date-picker';

export function EntityFormDateInput({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  placeholder,
}: EntityFormFieldInputProps) {
  return (
    <DatePicker
      id={id}
      value={String(value ?? '')}
      onChange={(nextValue) => onChange(nextValue)}
      onBlur={onBlur}
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder ?? 'Pick a date…'}
    />
  );
}
