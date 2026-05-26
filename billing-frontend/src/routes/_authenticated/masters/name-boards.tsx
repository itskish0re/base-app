import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderPage } from '@/features/pages/PlaceholderPage';

export const Route = createFileRoute('/_authenticated/masters/name-boards')({
  component: NameBoardsPage,
});

function NameBoardsPage() {
  return (
    <PlaceholderPage
      title="Name Board"
      description="Manage name boards used to group trucks and billing context."
    />
  );
}
