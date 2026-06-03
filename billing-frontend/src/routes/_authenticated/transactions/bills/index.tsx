import { createFileRoute } from '@tanstack/react-router';
import { BillsPage } from '@/pages/transactions/bills';

export const Route = createFileRoute('/_authenticated/transactions/bills/')({
  component: BillsPage,
});
