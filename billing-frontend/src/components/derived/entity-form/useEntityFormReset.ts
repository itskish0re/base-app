import type { ReactFormExtendedApi } from '@tanstack/react-form';
import { useEffect } from 'react';
import {
  buildEntityFormDefaultValues,
  buildEntityFormValuesFromRecord,
} from '@/components/derived/entity-form/ef-default-values';
import type { MappedEntityFormField } from '@/components/derived/entity-form/ef-map-screen-fields';

type UseEntityFormResetOptions<TRow extends object> = {
  open: boolean;
  isEdit: boolean;
  record: TRow | undefined;
  fields: MappedEntityFormField[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack Form instance is entity-specific
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>;
};

export function useEntityFormReset<TRow extends object>({
  open,
  isEdit,
  record,
  fields,
  form,
}: UseEntityFormResetOptions<TRow>) {
  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEdit) {
      if (record) {
        form.reset(buildEntityFormValuesFromRecord(fields, record));
      }

      return;
    }

    form.reset(buildEntityFormDefaultValues(fields));
  }, [open, isEdit, record, fields, form]);
}
