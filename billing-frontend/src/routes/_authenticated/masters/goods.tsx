import { createFileRoute } from '@tanstack/react-router';
import { GoodssPage } from '@/pages/masters/goods';

export const Route = createFileRoute('/_authenticated/masters/goods')({
  component: GoodssPage,
});
