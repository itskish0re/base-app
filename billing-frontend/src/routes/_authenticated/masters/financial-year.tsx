import { createFileRoute } from '@tanstack/react-router';
import { FinancialYearsPage } from '@/pages/masters/financial-years';

export const Route = createFileRoute('/_authenticated/masters/financial-year')({
  component: FinancialYearsPage,
});
