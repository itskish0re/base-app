import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/pages/login';
import { DASHBOARD_ROUTE } from '@/constants/routes';
import { store } from '@/store/store';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (store.getState().auth.isAuthenticated) {
      throw redirect({ to: DASHBOARD_ROUTE });
    }
  },
  component: LoginPage,
});
