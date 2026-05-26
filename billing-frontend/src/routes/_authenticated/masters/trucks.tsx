import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderPage } from '@/features/pages/PlaceholderPage';

export const Route = createFileRoute('/_authenticated/masters/trucks')({
  component: TrucksPage,
});

function TrucksPage() {
  return (
    <PlaceholderPage
      title="Truck"
      description="Maintain trucks linked to name boards."
    />
  );
}
