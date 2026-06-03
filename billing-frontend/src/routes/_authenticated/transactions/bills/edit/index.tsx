import { createFileRoute } from '@tanstack/react-router';
import { BillEditIndexPage } from '@/pages/transactions/bills/edit';

export const Route = createFileRoute('/_authenticated/transactions/bills/edit/')({
  component: BillEditIndexPage,
});
