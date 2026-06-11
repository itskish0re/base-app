import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTES } from '@/constants/routes';
import { findLatestBill } from '@/lib/billNavigation';
import { billFormDraftActions, selectBillNavigation } from '@/store/global/billFormDraftSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectSelectedFinancialYearId } from '@/store/global/financialYearContextSlice';

/** Opens the most recently created bill for the selected financial year. */
export function BillEditIndexPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const financialYearId = useAppSelector(selectSelectedFinancialYearId);
  const billNavigation = useAppSelector((state) => selectBillNavigation(state, financialYearId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (financialYearId == null) {
      return;
    }

    let cancelled = false;

    async function openLatestBill() {
      setError(null);

      const storedBillId = billNavigation?.lastBillId;
      if (storedBillId != null && storedBillId > 0) {
        if (!cancelled) {
          await navigate({
            to: ROUTES.billsEdit,
            params: { billId: String(storedBillId) },
            replace: true,
          });
        }
        return;
      }

      try {
        const latest = await findLatestBill();
        if (cancelled) {
          return;
        }

        if (!latest) {
          setError('No bills found for the selected financial year.');
          return;
        }

        dispatch(
          billFormDraftActions.setBillNavigation({
            financialYearId,
            lastBillId: latest.billId,
            lastBillNumber: latest.billNumber,
          }),
        );

        await navigate({
          to: ROUTES.billsEdit,
          params: { billId: String(latest.billId) },
          replace: true,
        });
      } catch {
        if (!cancelled) {
          setError('Could not load the latest bill.');
        }
      }
    }

    void openLatestBill();

    return () => {
      cancelled = true;
    };
  }, [billNavigation?.lastBillId, dispatch, financialYearId, navigate]);

  if (financialYearId == null) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-4 p-6">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-0 flex-1 flex-col gap-3 p-6">
        <p className="text-sm text-destructive">{error}</p>
        <button
          type="button"
          className="text-left text-sm text-primary underline-offset-4 hover:underline"
          onClick={() => void navigate({ to: ROUTES.bills })}
        >
          Go to bill list
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 p-6">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}
