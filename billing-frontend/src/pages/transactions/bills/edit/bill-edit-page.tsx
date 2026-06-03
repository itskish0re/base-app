import { BillFormPage } from '@/pages/transactions/bills/shared/bill-form-page';

type BillEditPageProps = {
  billId: number;
};

export function BillEditPage({ billId }: BillEditPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BillFormPage mode="edit" billId={billId} />
    </div>
  );
}
