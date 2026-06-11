import { createFileRoute } from '@tanstack/react-router';
import { BillCreatePage } from '@/pages/transactions/bills/create';

export const Route = createFileRoute('/_authenticated/transactions/bill-create')({
  component: BillCreatePage,
});
