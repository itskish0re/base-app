import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useMemo } from 'react';
import {
  buildEntityFormDefaultValues,
  EntityFormShellBody,
  getBatchFailureMessage,
  getPrimaryEntityScreen,
  mapScreenFormFields,
  useEntityFormReset,
} from '@/components/derived/entity-form';
import type { EntityFormShellController } from '@/components/derived/form-shell/useEntityFormShell';
import {
  ResponsiveFormShell,
  getEntityFormShellCopy,
  type FormShellPresentation,
} from '@/components/derived/form-shell';
import { Button } from '@/components/ui/button';
import { queryKeys } from '@/constants/queryKeys';
import { toastError, toastSuccess } from '@/lib/toast';
import {
  createUnitsMutationOptions,
  updateUnitsMutationOptions,
} from '@/service/mutation/units';
import { unitByIdQueryOptions } from '@/service/query/units';
import { ApiError } from '@/service/api/client';
import type { EntityScreenMetadataDto } from '@/types/entity/screen';
import type { UnitDto } from '@/types/entity';

type UnitFormValues = {
  name: string;
  code: string;
  isFixed: boolean;
};

type UnitFormShellProps = {
  shell: EntityFormShellController<number>;
  entities: EntityScreenMetadataDto[];
  presentation?: FormShellPresentation;
};

function mapFormValuesToCreateItem(values: UnitFormValues) {
  return {
    name: values.name.trim(),
    code: values.code.trim(),
    isFixed: values.isFixed,
  };
}

function mapFormValuesToUpdateItem(
  entityId: number,
  values: UnitFormValues,
  existing: UnitDto,
) {
  return {
    unitId: entityId,
    name: values.name.trim(),
    code: values.code.trim(),
    isFixed: values.isFixed,
    isEnabled: existing.isEnabled,
    isActive: existing.isActive,
  };
}

export function UnitFormShell({
  shell,
  entities,
  presentation = 'dialog',
}: UnitFormShellProps) {
  const queryClient = useQueryClient();
  const formFields = useMemo(
    () => mapScreenFormFields(getPrimaryEntityScreen(entities)),
    [entities],
  );

  const detailQuery = useQuery({
    ...unitByIdQueryOptions(shell.entityId ?? 0),
    enabled: shell.open && shell.isEdit && shell.entityId != null && shell.entityId > 0,
  });

  const createMutation = useMutation(createUnitsMutationOptions);
  const updateMutation = useMutation(updateUnitsMutationOptions);

  const initialValues = useMemo(
    () => buildEntityFormDefaultValues(formFields) as UnitFormValues,
    [formFields],
  );

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      try {
        if (shell.isCreate) {
          const result = await createMutation.mutateAsync({
            items: [mapFormValuesToCreateItem(value)],
          });
          const failureMessage = getBatchFailureMessage(result.failures);

          if (failureMessage) {
            toastError(failureMessage);
            return;
          }

          await queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
          toastSuccess('Unit created');
          shell.close();
          return;
        }

        if (shell.entityId == null || !detailQuery.data) {
          toastError('Unable to save changes. Please try again.');
          return;
        }

        const result = await updateMutation.mutateAsync({
          items: [mapFormValuesToUpdateItem(shell.entityId, value, detailQuery.data)],
        });
        const failureMessage = getBatchFailureMessage(result.failures);

        if (failureMessage) {
          toastError(failureMessage);
          return;
        }

        await queryClient.invalidateQueries({ queryKey: queryKeys.units.all });
        toastSuccess('Unit updated');
        shell.close();
      } catch (error) {
        if (error instanceof ApiError) {
          toastError(error.message);
          return;
        }

        toastError('Unable to save unit. Please try again.');
      }
    },
  });

  useEntityFormReset({
    open: shell.open,
    isEdit: shell.isEdit,
    record: detailQuery.data,
    fields: formFields,
    form,
  });

  const { title, description } = getEntityFormShellCopy({
    entityLabel: 'unit',
    createDescription: 'Add a new unit to the master list.',
    isCreate: shell.isCreate,
  });

  const isLoadingEdit =
    shell.isEdit && shell.entityId != null && detailQuery.isLoading && !detailQuery.data;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isEditBlocked = shell.isEdit && detailQuery.isError;
  const canRenderForm = !isLoadingEdit && !isEditBlocked && formFields.length > 0;

  return (
    <ResponsiveFormShell
      open={shell.open}
      onOpenChange={shell.onOpenChange}
      title={title}
      description={description}
      presentation={presentation}
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={shell.close} disabled={isSubmitting}>
            Cancel
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, formSubmitting]) => (
              <Button
                type="submit"
                form="unit-form"
                disabled={
                  !canSubmit ||
                  formSubmitting ||
                  isSubmitting ||
                  isLoadingEdit ||
                  isEditBlocked ||
                  !canRenderForm
                }
              >
                {isSubmitting || formSubmitting ? 'Saving…' : 'Save'}
              </Button>
            )}
          </form.Subscribe>
        </div>
      }
    >
      <EntityFormShellBody
        formId="unit-form"
        entityName="unit"
        formFields={formFields}
        form={form}
        isLoadingEdit={isLoadingEdit}
        isEditBlocked={isEditBlocked}
        editError={detailQuery.error}
        editErrorMessage="Failed to load unit."
        onSubmit={() => {
          void form.handleSubmit();
        }}
      />
    </ResponsiveFormShell>
  );
}
