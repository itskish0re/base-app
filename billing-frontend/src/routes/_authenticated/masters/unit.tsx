import { createFileRoute } from '@tanstack/react-router';
import { UnitsPage } from '@/pages/masters/units';

export const Route = createFileRoute('/_authenticated/masters/unit')({
  component: UnitsPage,
});
