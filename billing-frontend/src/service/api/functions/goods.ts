import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type {
  BatchCreateGoodsRequest,
  BatchCreateGoodsResponse,
  BatchDeleteGoodsRequest,
  BatchDeleteGoodsResponse,
  BatchToggleGoodsRequest,
  BatchToggleGoodsResponse,
  BatchUpdateGoodsRequest,
  BatchUpdateGoodsResponse,
  LookupGoodsRequest,
  GoodsDto,
  GoodsLookupResponse,
  PagedGoodsResponse,
} from '@/types/entity';

export async function listGoods(
  params?: ListQueryParams,
): Promise<PagedGoodsResponse> {
  const { data } = await api.get<PagedGoodsResponse>(endpoints.goods.list(), { params });
  return data;
}

export async function getGoodsById(id: number): Promise<GoodsDto> {
  const { data } = await api.get<GoodsDto>(endpoints.goods.byId(id));
  return data;
}

export async function lookupGoods(
  body: LookupGoodsRequest,
): Promise<GoodsLookupResponse> {
  const { data } = await api.post<GoodsLookupResponse>(endpoints.goods.lookup(), body);
  return data;
}

export async function createGoods(
  body: BatchCreateGoodsRequest,
): Promise<BatchCreateGoodsResponse> {
  const { data } = await api.post<BatchCreateGoodsResponse>(endpoints.goods.create(), body);
  return data;
}

export async function updateGoods(
  body: BatchUpdateGoodsRequest,
): Promise<BatchUpdateGoodsResponse> {
  const { data } = await api.post<BatchUpdateGoodsResponse>(endpoints.goods.update(), body);
  return data;
}

export async function deleteGoods(
  body: BatchDeleteGoodsRequest,
): Promise<BatchDeleteGoodsResponse> {
  const { data } = await api.post<BatchDeleteGoodsResponse>(endpoints.goods.delete(), body);
  return data;
}

export async function toggleGoods(
  body: BatchToggleGoodsRequest,
): Promise<BatchToggleGoodsResponse> {
  const { data } = await api.post<BatchToggleGoodsResponse>(endpoints.goods.toggle(), body);
  return data;
}
