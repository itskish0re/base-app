import { queryOptions } from '@tanstack/react-query';
import { api } from '@/api/client';
import { store } from '@/store/store';
import type { NavigationResponse } from '@/types/auth';

export const navigationQueryKey = ['navigation'] as const;

async function fetchNavigation(): Promise<NavigationResponse> {
  const { data } = await api.get<NavigationResponse>('/api/access/navigation');
  return data;
}

export function navigationQueryOptions() {
  return queryOptions({
    queryKey: navigationQueryKey,
    queryFn: fetchNavigation,
    enabled: Boolean(store.getState().auth.accessToken),
  });
}
