import { useCallback, useState } from 'react';

export type EntityFormMode = 'create' | 'edit';

export type EntityFormShellState<TId> = {
  open: boolean;
  mode: EntityFormMode;
  entityId: TId | null;
};

/** Controls open state for create/edit entity forms (dialog or sheet). */
export function useEntityFormShell<TId = number>() {
  const [state, setState] = useState<EntityFormShellState<TId>>({
    open: false,
    mode: 'create',
    entityId: null,
  });

  const openCreate = useCallback(() => {
    setState({ open: true, mode: 'create', entityId: null });
  }, []);

  const openEdit = useCallback((entityId: TId) => {
    setState({ open: true, mode: 'edit', entityId });
  }, []);

  const onOpenChange = useCallback((open: boolean) => {
    setState((previous) => ({ ...previous, open }));
  }, []);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return {
    open: state.open,
    mode: state.mode,
    entityId: state.entityId,
    isCreate: state.mode === 'create',
    isEdit: state.mode === 'edit',
    openCreate,
    openEdit,
    onOpenChange,
    close,
  };
}

export type EntityFormShellController<TId = number> = ReturnType<typeof useEntityFormShell<TId>>;
