import { createFileRoute, redirect } from '@tanstack/react-router';
import { AppShell } from '@/components/app/app-shell';
import { store } from '@/store/store';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    if (!store.getState().auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: AppShell,
});
