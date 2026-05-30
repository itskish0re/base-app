import { EntityFormFieldSkeleton } from '@/components/derived/entity-form/ef-field-skeleton';
import type { MappedEntityFormField } from '@/components/derived/entity-form/ef-map-screen-fields';

type EntityFormFieldsSkeletonProps = {
  fields: MappedEntityFormField[];
};

/** Shimmer placeholders for each configured form field (stable height while edit data loads). */
export function EntityFormFieldsSkeleton({ fields }: EntityFormFieldsSkeletonProps) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading form fields">
      {fields.map((field) => (
        <EntityFormFieldSkeleton
          key={field.entityScreenFieldId}
          label={field.displayLabel ?? field.fieldName}
          required={field.entityField.isRequired}
        />
      ))}
    </div>
  );
}
