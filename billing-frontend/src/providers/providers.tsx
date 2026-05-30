import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { Toaster } from '@/components/ui/sonner';
import { QueryDevtools } from '@/providers/query-devtools';
import { ApiError } from '@/service/api/client';
import { store } from '@/store/store';
import { clearAuth } from '@/store/global/authSlice';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 401) {
          return false;
        }

        return failureCount < 1;
      },
    },
  },
});

queryClient.getQueryCache().subscribe((event) => {
  if (event.type !== 'updated' || event.action.type !== 'error') {
    return;
  }

  const error = event.query.state.error;
  if (error instanceof ApiError && error.status === 401) {
    store.dispatch(clearAuth());
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <QueryDevtools />
      </QueryClientProvider>
    </Provider>
  );
}
