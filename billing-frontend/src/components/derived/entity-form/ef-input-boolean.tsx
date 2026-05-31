import type { EntityFormFieldInputProps } from '@/components/derived/entity-form/ef-field-types';
import { EntityFormRequiredMark } from '@/components/derived/entity-form/ef-form-ui';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type EntityFormBooleanInputProps = EntityFormFieldInputProps & {
  label: string;
  required?: boolean;
};

export function EntityFormBooleanInput({
  id,
  value,
  onChange,
  onBlur,
  disabled,
  readOnly,
  label,
  required = false,
}: EntityFormBooleanInputProps) {
  const checked = value === true || value === 'true' || value === 1 || value === '1';

  return (
    <div className="flex items-center gap-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled || readOnly}
        readOnly={readOnly}
        className={cn(
          'size-4 shrink-0 rounded border border-input accent-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.checked)}
      />
      <Label htmlFor={id} className="font-normal">
        {label}
        {required ? <EntityFormRequiredMark /> : null}
      </Label>
    </div>
  );
}
