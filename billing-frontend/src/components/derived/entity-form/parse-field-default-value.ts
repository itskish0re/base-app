import type { EntityFieldMetadataDto } from '@/types/entity/screen';

/** Parses `defaultValue` from entity field metadata into a form-friendly value. */
export function parseEntityFieldDefaultValue(field: EntityFieldMetadataDto): unknown {
  const raw = field.defaultValue;

  if (raw == null || raw.trim() === '') {
    if (field.dataType === 'boolean') {
      return false;
    }

    if (field.dataType === 'integer' || field.dataType === 'number') {
      return null;
    }

    return '';
  }

  if (field.dataType === 'boolean') {
    return raw === 'true' || raw === '1';
  }

  if (field.dataType === 'integer' || field.dataType === 'number') {
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }

  return raw;
}
