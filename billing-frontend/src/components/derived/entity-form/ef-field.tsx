import type { ReactFormExtendedApi } from '@tanstack/react-form';
import { buildFormFieldValidator } from '@/components/derived/entity-form/ef-field-validator';
import { EntityFormFieldControl } from '@/components/derived/entity-form/ef-field-control';
import { EntityFormBooleanInput } from '@/components/derived/entity-form/ef-input-boolean';
import {
  isEntityFormBooleanField,
  resolveEntityFormFieldInput,
} from '@/components/derived/entity-form/ef-input-registry';
import { EntityFormLookupField } from '@/components/derived/entity-form/ef-lookup-field';
import { resolveEntityFieldLookup } from '@/components/derived/entity-form/ef-lookup-registry';
import type { MappedEntityFormField } from '@/components/derived/entity-form/ef-map-screen-fields';

type EntityFormFieldProps = {
  entityName: string;
  field: MappedEntityFormField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack Form instance is entity-specific
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;
};

export function EntityFormField({ entityName, field, form }: EntityFormFieldProps) {
  if (resolveEntityFieldLookup(entityName, field.fieldName)) {
    return <EntityFormLookupField entityName={entityName} field={field} form={form} />;
  }

  const fieldComponent = field.fieldComponent ?? 'text';
  const label = field.displayLabel ?? field.fieldName;
  const isBoolean = isEntityFormBooleanField(fieldComponent);
  const InputComponent = resolveEntityFormFieldInput(fieldComponent);

  return (
    <form.Field
      name={field.fieldName}
      validators={{
        onChange: buildFormFieldValidator(field),
        onBlur: buildFormFieldValidator(field),
      }}
    >
      {(fieldApi) =>
        isBoolean ? (
          <EntityFormFieldControl error={fieldApi.state.meta.errors[0]}>
            <EntityFormBooleanInput
              id={fieldApi.name}
              label={label}
              required={field.entityField.isRequired}
              value={fieldApi.state.value}
              onChange={(nextValue) => fieldApi.handleChange(nextValue)}
              onBlur={fieldApi.handleBlur}
              disabled={field.isReadOnly}
              readOnly={field.isReadOnly}
            />
          </EntityFormFieldControl>
        ) : (
          <EntityFormFieldControl
            id={fieldApi.name}
            label={label}
            required={field.entityField.isRequired}
            error={fieldApi.state.meta.errors[0]}
          >
            <InputComponent
              id={fieldApi.name}
              value={fieldApi.state.value}
              onChange={(nextValue) => fieldApi.handleChange(nextValue)}
              onBlur={fieldApi.handleBlur}
              disabled={field.isReadOnly}
              readOnly={field.isReadOnly}
              placeholder={label}
            />
          </EntityFormFieldControl>
        )
      }
    </form.Field>
  );
}
