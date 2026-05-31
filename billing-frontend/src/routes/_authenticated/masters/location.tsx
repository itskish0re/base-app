import { createFileRoute } from '@tanstack/react-router';
import { LocationsPage } from '@/pages/masters/locations';

export const Route = createFileRoute('/_authenticated/masters/location')({
  component: LocationsPage,
});
