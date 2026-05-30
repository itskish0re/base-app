import type { MappedEntityFormField } from '@/components/derived/entity-form/ef-map-screen-fields';
import { parseMobileStoredValue } from '@/components/derived/entity-form/ef-input-value';

function isMobileFieldComponent(fieldComponent: string | null | undefined): boolean {
  const key = (fieldComponent ?? '').trim().toLowerCase();
  return key === 'mobile' || key === 'phone';
}

export function buildFormFieldValidator(field: MappedEntityFormField) {
  return ({ value }: { value: unknown }) => {
    const label = field.displayLabel ?? field.fieldName;

    if (field.entityField.isRequired) {
      if (value == null || value === '') {
        return `${label} is required`;
      }

      if (typeof value === 'number' && value <= 0) {
        return `${label} is required`;
      }

      if (typeof value === 'string' && !value.trim()) {
        return `${label} is required`;
      }
    }

    if (
      typeof value === 'string' &&
      value.trim() &&
      isMobileFieldComponent(field.fieldComponent)
    ) {
      const digits = parseMobileStoredValue(value);
      if (digits.length > 0 && digits.length !== 10) {
        return `${label} must be a valid 10-digit mobile number`;
      }

      if (field.entityField.isRequired && digits.length !== 10) {
        return `${label} must be a valid 10-digit mobile number`;
      }
    }

    if (typeof value === 'string' && field.entityField.maxLength != null) {
      if (value.length > field.entityField.maxLength) {
        return `${label} must be at most ${field.entityField.maxLength} characters`;
      }
    }

    if (typeof value === 'string' && field.entityField.minLength != null) {
      if (value.trim().length < field.entityField.minLength) {
        return `${label} must be at least ${field.entityField.minLength} characters`;
      }
    }

    return undefined;
  };
}
