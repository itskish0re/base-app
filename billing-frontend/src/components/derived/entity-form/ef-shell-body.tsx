import type { ReactFormExtendedApi } from '@tanstack/react-form';
import { EntityFormFields } from '@/components/derived/entity-form/ef-fields';
import { EntityFormFieldsSkeleton } from '@/components/derived/entity-form/ef-fields-skeleton';
import { EntityFormLoadingPanel } from '@/components/derived/entity-form/ef-loading-panel';
import type { MappedEntityFormField } from '@/components/derived/entity-form/ef-map-screen-fields';

type EntityFormShellBodyProps = {
  formId: string;
  entityName: string;
  formFields: MappedEntityFormField[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack Form instance is entity-specific
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;
  isLoadingEdit: boolean;
  isEditBlocked: boolean;
  editError: unknown;
  editErrorMessage: string;
  onSubmit: () => void;
};

export function EntityFormShellBody({
  formId,
  entityName,
  formFields,
  form,
  isLoadingEdit,
  isEditBlocked,
  editError,
  editErrorMessage,
  onSubmit,
}: EntityFormShellBodyProps) {
  if (isEditBlocked) {
    return (
      <p className="text-sm text-destructive">
        {editError instanceof Error ? editError.message : editErrorMessage}
      </p>
    );
  }

  if (formFields.length === 0) {
    return <EntityFormLoadingPanel />;
  }

  if (isLoadingEdit) {
    return <EntityFormFieldsSkeleton fields={formFields} />;
  }

  return (
    <form
      id={formId}
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onSubmit();
      }}
    >
      <EntityFormFields entityName={entityName} fields={formFields} form={form} />
    </form>
  );
}
