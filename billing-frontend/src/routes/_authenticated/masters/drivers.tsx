import { createFileRoute } from '@tanstack/react-router';
import { DriversPage } from '@/pages/masters/drivers';

export const Route = createFileRoute('/_authenticated/masters/drivers')({
  component: DriversPage,
});
