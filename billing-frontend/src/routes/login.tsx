import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '@/features/auth/LoginPage';
import { store } from '@/store/store';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (store.getState().auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});
