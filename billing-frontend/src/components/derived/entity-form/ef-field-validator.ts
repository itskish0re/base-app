import type { MappedEntityFormField } from '@/components/derived/entity-form/ef-map-screen-fields';

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
