import type { ReactFormExtendedApi } from '@tanstack/react-form';
import { EntityFormField } from '@/components/derived/entity-form/ef-field';
import type { MappedEntityFormField } from '@/components/derived/entity-form/ef-map-screen-fields';

type EntityFormFieldsProps = {
  entityName: string;
  fields: MappedEntityFormField[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack Form instance is entity-specific
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;
};

export function EntityFormFields({ entityName, fields, form }: EntityFormFieldsProps) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <EntityFormField
          key={field.entityScreenFieldId}
          entityName={entityName}
          field={field}
          form={form}
        />
      ))}
    </div>
  );
}
