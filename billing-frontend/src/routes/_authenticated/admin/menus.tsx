import { createFileRoute } from '@tanstack/react-router';
import { PlaceholderPage } from '@/features/pages/PlaceholderPage';

export const Route = createFileRoute('/_authenticated/admin/menus')({
  component: MenusAdminPage,
});

function MenusAdminPage() {
  return (
    <PlaceholderPage
      title="Menus"
      description="Configure sidebar menus and role visibility."
    />
  );
}
