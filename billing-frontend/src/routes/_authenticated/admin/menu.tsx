import { createFileRoute } from '@tanstack/react-router';
import { MenusPage } from '@/pages/admin/menus';

export const Route = createFileRoute('/_authenticated/admin/menu')({
  component: MenusPage,
});
