import { createFileRoute, redirect } from '@tanstack/react-router';
import { DASHBOARD_ROUTE } from '@/lib/routes';

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    throw redirect({ to: DASHBOARD_ROUTE });
  },
});
