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
  createPartiesMutationOptions,
  updatePartiesMutationOptions,
} from '@/service/mutation/parties';
import { partyByIdQueryOptions } from '@/service/query/parties';
import { ApiError } from '@/service/api/client';
import type { EntityScreenMetadataDto } from '@/types/entity/screen';
import type { PartyDto } from '@/types/entity';

type PartyFormValues = {
  name: string;
  code: string;
};

type PartyFormShellProps = {
  shell: EntityFormShellController<number>;
  entities: EntityScreenMetadataDto[];
  presentation?: FormShellPresentation;
};

function mapFormValuesToCreateItem(values: PartyFormValues) {
  return {
    name: values.name.trim(),
    code: values.code.trim(),

  };
}

function mapFormValuesToUpdateItem(
  entityId: number,
  values: PartyFormValues,
  existing: PartyDto,
) {
  return {
    partyId: entityId,
    name: values.name.trim(),
    code: values.code.trim(),

    isEnabled: existing.isEnabled,
    isActive: existing.isActive,
  };
}

export function PartyFormShell({
  shell,
  entities,
  presentation = 'dialog',
}: PartyFormShellProps) {
  const queryClient = useQueryClient();
  const formFields = useMemo(
    () => mapScreenFormFields(getPrimaryEntityScreen(entities)),
    [entities],
  );

  const detailQuery = useQuery({
    ...partyByIdQueryOptions(shell.entityId ?? 0),
    enabled: shell.open && shell.isEdit && shell.entityId != null && shell.entityId > 0,
  });

  const createMutation = useMutation(createPartiesMutationOptions);
  const updateMutation = useMutation(updatePartiesMutationOptions);

  const initialValues = useMemo(
    () => buildEntityFormDefaultValues(formFields) as PartyFormValues,
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

          await queryClient.invalidateQueries({ queryKey: queryKeys.parties.all });
          toastSuccess('Party created');
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

        await queryClient.invalidateQueries({ queryKey: queryKeys.parties.all });
        toastSuccess('Party updated');
        shell.close();
      } catch (error) {
        if (error instanceof ApiError) {
          toastError(error.message);
          return;
        }

        toastError('Unable to save party. Please try again.');
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
    entityLabel: 'party',
    createDescription: 'Add a new party to the master list.',
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
                form="party-form"
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
        formId="party-form"
        entityName="party"
        formFields={formFields}
        form={form}
        isLoadingEdit={isLoadingEdit}
        isEditBlocked={isEditBlocked}
        editError={detailQuery.error}
        editErrorMessage="Failed to load party."
        onSubmit={() => {
          void form.handleSubmit();
        }}
      />
    </ResponsiveFormShell>
  );
}
