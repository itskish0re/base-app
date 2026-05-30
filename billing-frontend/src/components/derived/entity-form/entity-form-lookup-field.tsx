import type { ReactFormExtendedApi } from '@tanstack/react-form';
import { buildFormFieldValidator } from '@/components/derived/entity-form/build-form-field-validator';
import { EntityFormLookupCombobox } from '@/components/derived/entity-form/entity-form-lookup-combobox';
import { resolveEntityFieldLookup } from '@/components/derived/entity-form/entity-lookup-registry';
import type { MappedEntityFormField } from '@/components/derived/entity-form/map-screen-form-fields';
import { useEntityLookupOptions } from '@/components/derived/entity-form/use-entity-lookup-options';
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

  return (
    <form.Field
      name={field.fieldName}
      validators={{
        onChange: buildFormFieldValidator(field),
        onBlur: buildFormFieldValidator(field),
      }}
    >
      {(fieldApi) => (
        <div className="space-y-2">
          <Label htmlFor={fieldApi.name}>
            {field.displayLabel ?? field.fieldName}
            {field.entityField.isRequired ? (
              <span className="text-destructive" aria-hidden="true">
                {' '}
                *
              </span>
            ) : null}
          </Label>
          <EntityFormLookupCombobox
            id={fieldApi.name}
            value={fieldApi.state.value}
            onChange={(nextValue) => fieldApi.handleChange(nextValue)}
            onBlur={fieldApi.handleBlur}
            disabled={field.isReadOnly || lookupQuery.isLoading}
            placeholder={`Select ${field.displayLabel ?? field.fieldName}…`}
            searchPlaceholder={`Search ${field.displayLabel ?? field.fieldName}…`}
            items={lookupQuery.data?.items ?? []}
            isLoading={lookupQuery.isLoading}
            isError={lookupQuery.isError}
          />
          {fieldApi.state.meta.errors[0] ? (
            <p className="text-sm text-destructive">{fieldApi.state.meta.errors[0]}</p>
          ) : null}
        </div>
      )}
    </form.Field>
  );
}
