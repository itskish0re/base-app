import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderPage } from '@/features/pages/PlaceholderPage';

export const Route = createFileRoute('/_authenticated/masters/drivers')({
  component: DriversPage,
});

function DriversPage() {
  return (
    <PlaceholderPage
      title="Driver"
      description="Maintain driver records for fleet and billing."
    />
  );
}
