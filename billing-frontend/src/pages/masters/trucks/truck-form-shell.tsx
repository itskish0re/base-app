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
  createTrucksMutationOptions,
  updateTrucksMutationOptions,
} from '@/service/mutation/trucks';
import { truckByIdQueryOptions } from '@/service/query/trucks';
import { ApiError } from '@/service/api/client';
import type { EntityScreenMetadataDto } from '@/types/entity/screen';
import type { TruckDto } from '@/types/entity';

type TruckFormValues = {
  truckNumber: string;
  nameBoardId: number | null;
};

type TruckFormShellProps = {
  shell: EntityFormShellController<number>;
  entities: EntityScreenMetadataDto[];
  presentation?: FormShellPresentation;
};

function normalizeTruckNumber(value: string): string {
  return value.replace(/\s+/g, '').trim();
}

function mapFormValuesToCreateItem(values: TruckFormValues) {
  return {
    truckNumber: normalizeTruckNumber(values.truckNumber),
    nameBoardId: values.nameBoardId!,
  };
}

function mapFormValuesToUpdateItem(
  entityId: number,
  values: TruckFormValues,
  existing: TruckDto,
) {
  return {
    truckId: entityId,
    truckNumber: normalizeTruckNumber(values.truckNumber),
    nameBoardId: values.nameBoardId!,
    isEnabled: existing.isEnabled,
    isActive: existing.isActive,
  };
}

export function TruckFormShell({
  shell,
  entities,
  presentation = 'dialog',
}: TruckFormShellProps) {
  const queryClient = useQueryClient();
  const entityScreen = getPrimaryEntityScreen(entities);
  const entityName = entityScreen?.entity.entityName ?? 'truck';

  const formFields = useMemo(() => mapScreenFormFields(entityScreen), [entityScreen]);

  const detailQuery = useQuery({
    ...truckByIdQueryOptions(shell.entityId ?? 0),
    enabled: shell.open && shell.isEdit && shell.entityId != null && shell.entityId > 0,
  });

  const createMutation = useMutation(createTrucksMutationOptions);
  const updateMutation = useMutation(updateTrucksMutationOptions);

  const initialValues = useMemo(
    () => buildEntityFormDefaultValues(formFields) as TruckFormValues,
    [formFields],
  );

  const form = useForm({
    defaultValues: initialValues,
    onSubmit: async ({ value }) => {
      try {
        if (value.nameBoardId == null || value.nameBoardId <= 0) {
          toastError('Name board is required.');
          return;
        }

        if (!normalizeTruckNumber(value.truckNumber)) {
          toastError('Truck number is required.');
          return;
        }

        if (shell.isCreate) {
          const result = await createMutation.mutateAsync({
            items: [mapFormValuesToCreateItem(value)],
          });
          const failureMessage = getBatchFailureMessage(result.failures);

          if (failureMessage) {
            toastError(failureMessage);
            return;
          }

          await queryClient.invalidateQueries({ queryKey: queryKeys.trucks.all });
          toastSuccess('Truck created');
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

        await queryClient.invalidateQueries({ queryKey: queryKeys.trucks.all });
        toastSuccess('Truck updated');
        shell.close();
      } catch (error) {
        if (error instanceof ApiError) {
          toastError(error.message);
          return;
        }

        toastError('Unable to save truck. Please try again.');
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
    entityLabel: 'truck',
    createDescription: 'Add a new truck and link it to a name board.',
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
                form="truck-form"
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
        formId="truck-form"
        entityName={entityName}
        formFields={formFields}
        form={form}
        isLoadingEdit={isLoadingEdit}
        isEditBlocked={isEditBlocked}
        editError={detailQuery.error}
        editErrorMessage="Failed to load truck."
        onSubmit={() => {
          void form.handleSubmit();
        }}
      />
    </ResponsiveFormShell>
  );
}
