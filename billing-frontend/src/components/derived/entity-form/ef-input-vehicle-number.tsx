import type { EntityFormFieldInputProps } from '@/components/derived/entity-form/ef-field-types';
import {
  formatVehicleNumberInputDisplay,
  parseVehicleNumberStoredValue,
} from '@/components/derived/entity-form/ef-input-value';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function EntityFormVehicleNumberInput({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  placeholder = 'TN52 AC 0942',
}: EntityFormFieldInputProps) {
  return (
    <Input
      id={id}
      type="text"
      value={formatVehicleNumberInputDisplay(value)}
      readOnly={readOnly}
      disabled={disabled || readOnly}
      placeholder={placeholder}
      autoComplete="off"
      autoCapitalize="characters"
      spellCheck={false}
      className={cn('font-mono uppercase tracking-wide')}
      onBlur={onBlur}
      onChange={(event) => onChange(parseVehicleNumberStoredValue(event.target.value))}
    />
  );
}
