import { api } from '@/api/client';
import type { NavigationResponse } from '@/types/auth';

export async function fetchNavigationMenus(): Promise<NavigationResponse> {
  const { data } = await api.get<NavigationResponse>('/api/access/navigation');
  return data;
}
