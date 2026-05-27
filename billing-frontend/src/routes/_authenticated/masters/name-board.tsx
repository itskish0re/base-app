import { createFileRoute } from '@tanstack/react-router';
import { NameBoardsPage } from '@/pages/masters/name-boards';

export const Route = createFileRoute('/_authenticated/masters/name-board')({
  component: NameBoardsPage,
});
