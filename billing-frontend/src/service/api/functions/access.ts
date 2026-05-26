import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { NavigationResponse } from '@/types/access';

export async function fetchNavigationMenus(): Promise<NavigationResponse> {
  const { data } = await api.get<NavigationResponse>(endpoints.access.navigation());
  return data;
}
