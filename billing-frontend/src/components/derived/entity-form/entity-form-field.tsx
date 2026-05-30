import type { ReactFormExtendedApi } from '@tanstack/react-form';
import { buildFormFieldValidator } from '@/components/derived/entity-form/build-form-field-validator';
import type { MappedEntityFormField } from '@/components/derived/entity-form/map-screen-form-fields';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type EntityFormFieldProps = {
  field: MappedEntityFormField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack Form instance is entity-specific
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;
};

export function EntityFormField({ field, form }: EntityFormFieldProps) {
  const component = field.fieldComponent ?? 'text';

  if (component !== 'text' && component !== 'number') {
    return null;
  }

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
          <Input
            id={fieldApi.name}
            type={component === 'number' ? 'number' : 'text'}
            value={String(fieldApi.state.value ?? '')}
            readOnly={field.isReadOnly}
            disabled={field.isReadOnly}
            onBlur={fieldApi.handleBlur}
            onChange={(event) => fieldApi.handleChange(event.target.value)}
          />
          {fieldApi.state.meta.errors[0] ? (
            <p className="text-sm text-destructive">{fieldApi.state.meta.errors[0]}</p>
          ) : null}
        </div>
      )}
    </form.Field>
  );
}
