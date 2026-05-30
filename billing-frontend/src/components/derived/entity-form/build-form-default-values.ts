import type { MappedEntityFormField } from '@/components/derived/entity-form/map-screen-form-fields';
import { parseEntityFieldDefaultValue } from '@/components/derived/entity-form/parse-field-default-value';

export function buildEntityFormDefaultValues(
  fields: MappedEntityFormField[],
): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const field of fields) {
    values[field.fieldName] = parseEntityFieldDefaultValue(field.entityField);
  }

  return values;
}

export function buildEntityFormValuesFromRecord<TRow extends object>(
  fields: MappedEntityFormField[],
  record: TRow,
): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const field of fields) {
    const value = (record as Record<string, unknown>)[field.fieldName];
    values[field.fieldName] =
      value ?? parseEntityFieldDefaultValue(field.entityField);
  }

  return values;
}
