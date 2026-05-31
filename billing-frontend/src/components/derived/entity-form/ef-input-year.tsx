import type { EntityFormFieldInputProps } from '@/components/derived/entity-form/ef-field-types';
import { buildFinancialYearOptions } from '@/components/derived/entity-form/ef-financial-year-name';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const yearOptions = buildFinancialYearOptions();

export function EntityFormYearInput({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  placeholder,
}: EntityFormFieldInputProps) {
  const selectedValue = String(value ?? '').trim();
  const isDisabled = disabled || readOnly;

  return (
    <Select
      value={selectedValue || null}
      disabled={isDisabled}
      onValueChange={(nextValue) => {
        onChange(nextValue ?? '');
      }}
    >
      <SelectTrigger
        id={id}
        className={cn('w-full', isDisabled && 'cursor-not-allowed opacity-50')}
        aria-label={placeholder ?? 'Select year'}
        onBlur={onBlur}
      >
        <SelectValue placeholder={placeholder ?? 'Select year…'} />
      </SelectTrigger>
      <SelectContent>
        {yearOptions.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
