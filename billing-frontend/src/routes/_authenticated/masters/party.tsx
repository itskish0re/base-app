import { createFileRoute } from '@tanstack/react-router';
import { PartysPage } from '@/pages/masters/parties';

export const Route = createFileRoute('/_authenticated/masters/party')({
  component: PartysPage,
});
