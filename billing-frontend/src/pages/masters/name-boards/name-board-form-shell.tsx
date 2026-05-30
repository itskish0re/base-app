import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useMemo } from 'react';
import {
  buildEntityFormDefaultValues,
  EntityFormFields,
  getBatchFailureMessage,
  getPrimaryEntityScreen,
  mapScreenFormFields,
  useEntityFormReset,
} from '@/components/derived/entity-form';
import type { EntityFormShellController } from '@/components/derived/form-shell/use-entity-form-shell';
import {
  ResponsiveFormShell,
  type FormShellPresentation,
} from '@/components/derived/form-shell/responsive-form-shell';
import { Button } from '@/components/ui/button';
import { queryKeys } from '@/constants/queryKeys';
import { toastError, toastSuccess } from '@/lib/toast';
import {
  createNameBoardsMutationOptions,
  updateNameBoardsMutationOptions,
} from '@/service/mutation/nameBoards';
import { nameBoardByIdQueryOptions } from '@/service/query/nameBoards';
import { ApiError } from '@/service/api/client';
import type { EntityScreenMetadataDto } from '@/types/entity/screen';
import type { NameBoardDto } from '@/types/entity';

type NameBoardFormValues = {
  name: string;
  code: string;
  ownerName: string;
  ownerPhone: string;
};

type NameBoardFormShellProps = {
  shell: EntityFormShellController<number>;
  entities: EntityScreenMetadataDto[];
  /** Desktop layout; mobile always uses a bottom sheet. */
  presentation?: FormShellPresentation;
};

function toOptionalText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function mapFormValuesToCreateItem(values: NameBoardFormValues) {
  return {
    name: values.name.trim(),
    code: values.code.trim(),
    ownerName: values.ownerName.trim(),
    ownerPhone: toOptionalText(values.ownerPhone),
  };
}

function mapFormValuesToUpdateItem(
  entityId: number,
  values: NameBoardFormValues,
  existing: NameBoardDto,
) {
  return {
    nameBoardId: entityId,
    name: values.name.trim(),
    code: values.code.trim(),
    ownerName: values.ownerName.trim(),
    ownerPhone: toOptionalText(values.ownerPhone),
    isEnabled: existing.isEnabled,
    isActive: existing.isActive,
  };
}

export function NameBoardFormShell({
  shell,
  entities,
  presentation = 'dialog',
}: NameBoardFormShellProps) {
  const queryClient = useQueryClient();
  const formFields = useMemo(
    () => mapScreenFormFields(getPrimaryEntityScreen(entities)),
    [entities],
  );

  const detailQuery = useQuery({
    ...nameBoardByIdQueryOptions(shell.entityId ?? 0),
    enabled: shell.open && shell.isEdit && shell.entityId != null && shell.entityId > 0,
  });

  const createMutation = useMutation(createNameBoardsMutationOptions);
  const updateMutation = useMutation(updateNameBoardsMutationOptions);

  const initialValues = useMemo(
    () => buildEntityFormDefaultValues(formFields) as NameBoardFormValues,
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

          await queryClient.invalidateQueries({ queryKey: queryKeys.nameBoards.all });
          toastSuccess('Name board created');
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

        await queryClient.invalidateQueries({ queryKey: queryKeys.nameBoards.all });
        toastSuccess('Name board updated');
        shell.close();
      } catch (error) {
        if (error instanceof ApiError) {
          toastError(error.message);
          return;
        }

        toastError('Unable to save name board. Please try again.');
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

  const title = shell.isCreate ? 'Create name board' : 'Edit name board';
  const description = shell.isCreate
    ? 'Add a new name board to the master list.'
    : shell.entityId != null
      ? `Update name board #${shell.entityId}.`
      : 'Update name board.';

  const isLoadingEdit = shell.isEdit && (detailQuery.isLoading || detailQuery.isFetching);
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isEditBlocked = shell.isEdit && detailQuery.isError;
  const canRenderForm = !isLoadingEdit && !isEditBlocked;

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
                form="name-board-form"
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
      {isLoadingEdit ? (
        <p className="text-sm text-muted-foreground">Loading name board…</p>
      ) : isEditBlocked ? (
        <p className="text-sm text-destructive">
          {detailQuery.error instanceof Error
            ? detailQuery.error.message
            : 'Failed to load name board.'}
        </p>
      ) : (
        <form
          id="name-board-form"
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <EntityFormFields fields={formFields} form={form} />
        </form>
      )}
    </ResponsiveFormShell>
  );
}
