import { ENTITY_FORM_EXCLUDED_FIELD_NAMES } from '@/components/derived/entity-form/ef-constants';
import type {
  EntityFieldMetadataDto,
  EntityScreenMetadataDto,
  ScreenFormFieldMetadataDto,
} from '@/types/entity/screen';

export type MappedEntityFormField = ScreenFormFieldMetadataDto & {
  entityField: EntityFieldMetadataDto;
};

const excludedFieldNames = new Set<string>(ENTITY_FORM_EXCLUDED_FIELD_NAMES);

/** First entity bundle on a screen (primary form entity). */
export function getPrimaryEntityScreen(
  entities: EntityScreenMetadataDto[],
): EntityScreenMetadataDto | undefined {
  return entities[0];
}

/** Visible form fields merged with entity field metadata, excluding grid-only state fields. */
export function mapScreenFormFields(
  entityScreen: EntityScreenMetadataDto | undefined,
): MappedEntityFormField[] {
  if (!entityScreen) {
    return [];
  }

  const entityFieldById = new Map(
    entityScreen.entityFields.map((field) => [field.entityFieldId, field]),
  );

  return entityScreen.formFields
    .filter(
      (field) =>
        field.isActive &&
        field.isVisible &&
        !excludedFieldNames.has(field.fieldName),
    )
    .sort((left, right) => left.displayOrder - right.displayOrder)
    .flatMap((field) => {
      const entityField = entityFieldById.get(field.entityFieldId);
      if (!entityField) {
        return [];
      }

      return [{ ...field, entityField }];
    });
}
