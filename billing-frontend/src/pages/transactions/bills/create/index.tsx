import { BillFormPage } from '@/pages/transactions/bills/shared/bill-form-page';

export function BillCreatePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BillFormPage mode="create" />
    </div>
  );
}
