import type { ReactFormExtendedApi } from '@tanstack/react-form';
import { buildFormFieldValidator } from '@/components/derived/entity-form/ef-field-validator';
import { EntityFormFieldSkeleton } from '@/components/derived/entity-form/ef-field-skeleton';
import {
  EntityFormFieldError,
  EntityFormRequiredMark,
} from '@/components/derived/entity-form/ef-form-ui';
import { EntityFormLookupCombobox } from '@/components/derived/entity-form/ef-lookup-combobox';
import { resolveEntityFieldLookup } from '@/components/derived/entity-form/ef-lookup-registry';
import type { MappedEntityFormField } from '@/components/derived/entity-form/ef-map-screen-fields';
import { useEntityLookupOptions } from '@/components/derived/entity-form/useEntityLookupOptions';
import { Label } from '@/components/ui/label';

type EntityFormLookupFieldProps = {
  entityName: string;
  field: MappedEntityFormField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack Form instance is entity-specific
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;
};

export function EntityFormLookupField({ entityName, field, form }: EntityFormLookupFieldProps) {
  const lookup = resolveEntityFieldLookup(entityName, field.fieldName);
  const lookupQuery = useEntityLookupOptions(lookup);
  const isLookupLoading = lookupQuery.isLoading && !lookupQuery.data;

  return (
    <form.Field
      name={field.fieldName}
      validators={{
        onChange: buildFormFieldValidator(field),
        onBlur: buildFormFieldValidator(field),
      }}
    >
      {(fieldApi) =>
        isLookupLoading ? (
          <EntityFormFieldSkeleton
            label={field.displayLabel ?? field.fieldName}
            required={field.entityField.isRequired}
          />
        ) : (
          <div className="space-y-2">
            <Label htmlFor={fieldApi.name}>
              {field.displayLabel ?? field.fieldName}
              {field.entityField.isRequired ? <EntityFormRequiredMark /> : null}
            </Label>
            <EntityFormLookupCombobox
              id={fieldApi.name}
              value={fieldApi.state.value}
              onChange={(nextValue) => fieldApi.handleChange(nextValue)}
              onBlur={fieldApi.handleBlur}
              disabled={field.isReadOnly}
              placeholder={`Select ${field.displayLabel ?? field.fieldName}…`}
              searchPlaceholder={`Search ${field.displayLabel ?? field.fieldName}…`}
              items={lookupQuery.data?.items ?? []}
              isLoading={lookupQuery.isLoading}
              isError={lookupQuery.isError}
            />
            <EntityFormFieldError message={fieldApi.state.meta.errors[0]} />
          </div>
        )
      }
    </form.Field>
  );
}
