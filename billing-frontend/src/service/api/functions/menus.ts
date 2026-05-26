import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type {
  BatchCreateMenusRequest,
  BatchCreateMenusResponse,
  BatchDeleteMenusRequest,
  BatchDeleteMenusResponse,
  BatchToggleMenusRequest,
  BatchToggleMenusResponse,
  BatchUpdateMenusRequest,
  BatchUpdateMenusResponse,
  ListMenusParams,
  MenuDto,
  PagedMenusResponse,
} from '@/types/menu';

export type { ListMenusParams };

export async function listMenus(params?: ListMenusParams): Promise<PagedMenusResponse> {
  const { data } = await api.get<PagedMenusResponse>(endpoints.menus.list(), { params });
  return data;
}

export async function getMenuById(id: number): Promise<MenuDto> {
  const { data } = await api.get<MenuDto>(endpoints.menus.byId(id));
  return data;
}

export async function createMenus(body: BatchCreateMenusRequest): Promise<BatchCreateMenusResponse> {
  const { data } = await api.post<BatchCreateMenusResponse>(endpoints.menus.create(), body);
  return data;
}

export async function updateMenus(body: BatchUpdateMenusRequest): Promise<BatchUpdateMenusResponse> {
  const { data } = await api.post<BatchUpdateMenusResponse>(endpoints.menus.update(), body);
  return data;
}

export async function deleteMenus(body: BatchDeleteMenusRequest): Promise<BatchDeleteMenusResponse> {
  const { data } = await api.post<BatchDeleteMenusResponse>(endpoints.menus.delete(), body);
  return data;
}

export async function toggleMenus(body: BatchToggleMenusRequest): Promise<BatchToggleMenusResponse> {
  const { data } = await api.post<BatchToggleMenusResponse>(endpoints.menus.toggle(), body);
  return data;
}
