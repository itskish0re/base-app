import { createFileRoute } from '@tanstack/react-router';
import { TrucksPage } from '@/pages/masters/trucks';

export const Route = createFileRoute('/_authenticated/masters/trucks')({
  component: TrucksPage,
});
