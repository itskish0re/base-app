import { createFileRoute } from '@tanstack/react-router';
import { LoadsPage } from '@/pages/transactions/loads';

export const Route = createFileRoute('/_authenticated/transactions/loads')({
  component: LoadsPage,
});
