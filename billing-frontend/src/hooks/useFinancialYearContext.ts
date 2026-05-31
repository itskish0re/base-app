import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { lookupFinancialYears } from '@/service/api/functions/financialYears';
import { store } from '@/store/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  financialYearContextActions,
  selectFinancialYearContextStatus,
} from '@/store/global/financialYearContextSlice';
import { FINANCIAL_YEAR_CONTEXT_LOAD_STATUS } from '@/types/store/global/financialYearContext';
import type { FinancialYearOption } from '@/types/store/global/financialYearContext';
import { invalidateFinancialYearScopedQueries } from '@/lib/financialYearQueries';
import type { LookupItem } from '@/types/common';

function readLookupItems(response: Awaited<ReturnType<typeof lookupFinancialYears>>): LookupItem[] {
  if (Array.isArray(response.items)) {
    return response.items;
  }

  const legacyItems = (response as { Items?: LookupItem[] }).Items;
  return Array.isArray(legacyItems) ? legacyItems : [];
}

function mapLookupItems(items: LookupItem[]): FinancialYearOption[] {
  return items
    .map((item) => {
      const rawValue = item.value;
      const financialYearId =
        typeof rawValue === 'number'
          ? rawValue
          : Number.parseInt(String(rawValue ?? ''), 10);

      if (Number.isNaN(financialYearId) || financialYearId <= 0) {
        return null;
      }

      const code = String(item.fields?.code ?? '').trim();
      const name = String(item.label ?? item.fields?.name ?? code).trim();

      return {
        financialYearId,
        code,
        name,
      };
    })
    .filter((option): option is FinancialYearOption => option != null)
    .sort((left, right) => right.code.localeCompare(left.code));
}

function shouldBootstrapFinancialYears(): boolean {
  const { status, options } = store.getState().financialYearContext;

  if (status === FINANCIAL_YEAR_CONTEXT_LOAD_STATUS.succeeded) {
    return false;
  }

  if (status === FINANCIAL_YEAR_CONTEXT_LOAD_STATUS.loading && options.length > 0) {
    return false;
  }

  return true;
}

/** Loads financial year options once after auth; restores persisted selection. */
export function useFinancialYearBootstrap() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !shouldBootstrapFinancialYears()) {
      return;
    }

    let cancelled = false;
    const preferredId = store.getState().financialYearContext.selectedFinancialYearId;

    async function load() {
      dispatch(financialYearContextActions.setFinancialYearOptionsLoading());

      try {
        const response = await lookupFinancialYears({
          value: 'financial_year_id',
          label: 'name',
          fields: [{ keyName: 'code', columnName: 'code' }],
        });

        if (cancelled) {
          return;
        }

        dispatch(
          financialYearContextActions.setFinancialYearOptions({
            options: mapLookupItems(readLookupItems(response)),
            preferredId,
          }),
        );
      } catch {
        if (!cancelled) {
          dispatch(
            financialYearContextActions.setFinancialYearOptionsFailed(
              'Failed to load financial years.',
            ),
          );
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isAuthenticated]);
}

/** Switches FY and invalidates transaction-scoped query caches. */
export function useFinancialYearSelection() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return (option: FinancialYearOption) => {
    dispatch(financialYearContextActions.setSelectedFinancialYear(option));
    invalidateFinancialYearScopedQueries(queryClient);
  };
}
