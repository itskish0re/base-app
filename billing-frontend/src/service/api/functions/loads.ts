import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type { PagedLoadsResponse } from '@/types/entity/load';

export async function listLoads(params?: ListQueryParams): Promise<PagedLoadsResponse> {
  const { data } = await api.get<PagedLoadsResponse>(endpoints.loads.list(), { params });
  return data;
}
