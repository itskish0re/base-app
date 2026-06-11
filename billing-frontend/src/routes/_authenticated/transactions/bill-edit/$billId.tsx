import { createFileRoute } from '@tanstack/react-router';
import { BillEditPage } from '@/pages/transactions/bills/edit/bill-edit-page';

export const Route = createFileRoute('/_authenticated/transactions/bill-edit/$billId')({
  component: BillEditRoutePage,
});

function BillEditRoutePage() {
  const { billId } = Route.useParams();
  const id = Number(billId);

  if (!Number.isFinite(id) || id <= 0) {
    return <p className="p-4 text-sm text-destructive">Invalid bill id.</p>;
  }

  return <BillEditPage billId={id} />;
}
