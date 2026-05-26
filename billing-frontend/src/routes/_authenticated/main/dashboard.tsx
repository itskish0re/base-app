import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderPage } from '@/features/pages/PlaceholderPage';

export const Route = createFileRoute('/_authenticated/main/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Overview and shortcuts for billing operations."
    />
  );
}
