import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ScreenMetadataResponse } from '@/types/entity';

export async function fetchScreenByMenuCode(menuCode: string): Promise<ScreenMetadataResponse> {
  const { data } = await api.get<ScreenMetadataResponse>(endpoints.screens.byMenu(menuCode));
  return data;
}
