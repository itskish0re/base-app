import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, useStore } from '@tanstack/react-form';
import { useEffect, useMemo } from 'react';
import {
  buildEntityFormDefaultValues,
  EntityFormShellBody,
  formatFinancialYearName,
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
  createFinancialYearsMutationOptions,
  updateFinancialYearsMutationOptions,
} from '@/service/mutation/financialYears';
import { financialYearByIdQueryOptions } from '@/service/query/financialYears';
import { ApiError } from '@/service/api/client';
import type { EntityScreenMetadataDto } from '@/types/entity/screen';
import type { FinancialYearDto } from '@/types/entity';

type FinancialYearFormValues = {
  name: string;
  code: string;
};

type FinancialYearFormShellProps = {
  shell: EntityFormShellController<number>;
  entities: EntityScreenMetadataDto[];
  presentation?: FormShellPresentation;
};

function mapFormValuesToCreateItem(values: FinancialYearFormValues) {
  return {
    code: values.code.trim(),
  };
}

function mapFormValuesToUpdateItem(
  entityId: number,
  values: FinancialYearFormValues,
  existing: FinancialYearDto,
) {
  return {
    financialYearId: entityId,
    code: values.code.trim(),
    isEnabled: existing.isEnabled,
    isActive: existing.isActive,
  };
}

function FinancialYearNameSync({
  form,
  open,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  open: boolean;
}) {
  const code = useStore(form.store, (state: unknown) => (state as { values: FinancialYearFormValues }).values.code);

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextName = formatFinancialYearName(code);
    if (form.getFieldValue('name') !== nextName) {
      form.setFieldValue('name', nextName);
    }
  }, [code, form, open]);

  return null;
}

export function FinancialYearFormShell({
  shell,
  entities,
  presentation = 'dialog',
}: FinancialYearFormShellProps) {
  const queryClient = useQueryClient();
  const formFields = useMemo(
    () => mapScreenFormFields(getPrimaryEntityScreen(entities)),
    [entities],
  );

  const detailQuery = useQuery({
    ...financialYearByIdQueryOptions(shell.entityId ?? 0),
    enabled: shell.open && shell.isEdit && shell.entityId != null && shell.entityId > 0,
  });

  const createMutation = useMutation(createFinancialYearsMutationOptions);
  const updateMutation = useMutation(updateFinancialYearsMutationOptions);

  const initialValues = useMemo(
    () => buildEntityFormDefaultValues(formFields) as FinancialYearFormValues,
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

          await queryClient.invalidateQueries({ queryKey: queryKeys.financialYears.all });
          toastSuccess('Financial year created');
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

        await queryClient.invalidateQueries({ queryKey: queryKeys.financialYears.all });
        toastSuccess('Financial year updated');
        shell.close();
      } catch (error) {
        if (error instanceof ApiError) {
          toastError(error.message);
          return;
        }

        toastError('Unable to save financial year. Please try again.');
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
    entityLabel: 'financial year',
    createDescription: 'Add a new financial year to the master list.',
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
                form="financial-year-form"
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
      <FinancialYearNameSync form={form} open={shell.open} />
      <EntityFormShellBody
        formId="financial-year-form"
        entityName="financial_year"
        formFields={formFields}
        form={form}
        isLoadingEdit={isLoadingEdit}
        isEditBlocked={isEditBlocked}
        editError={detailQuery.error}
        editErrorMessage="Failed to load financial year."
        onSubmit={() => {
          void form.handleSubmit();
        }}
      />
    </ResponsiveFormShell>
  );
}
