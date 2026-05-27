import type { BatchDeleteResponse, BatchItemFailure, ListQueryParams, PagedResponse } from '@/types/common';

export interface MenuDto {
  menuId: number;
  menuCode: string;
  displayName: string;
  routePath: string;
  icon: string | null;
  parentMenuId: number | null;
  sortOrder: number;
  badge: string | null;
  tooltip: string | null;
  defaultExpanded: boolean;
  menuGroup: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListMenusParams extends ListQueryParams {
  isActive?: boolean;
}

export type PagedMenusResponse = PagedResponse<MenuDto>;

export type BatchMenuItemFailure = BatchItemFailure;

export interface BatchCreateMenusResponse {
  created: MenuDto[];
  failures: BatchMenuItemFailure[];
}

export interface BatchUpdateMenusResponse {
  updated: MenuDto[];
  failures: BatchMenuItemFailure[];
}

export type BatchDeleteMenusResponse = BatchDeleteResponse;

export interface BatchToggleMenusResponse {
  updated: MenuDto[];
  failures: BatchMenuItemFailure[];
}

export interface CreateMenuItemRequest {
  menuCode: string;
  displayName: string;
  routePath: string;
  icon?: string | null;
  parentMenuId?: number | null;
  sortOrder: number;
  badge?: string | null;
  tooltip?: string | null;
  defaultExpanded?: boolean;
  menuGroup?: string;
}

export interface UpdateMenuItemRequest {
  menuId: number;
  menuCode: string;
  displayName: string;
  routePath: string;
  icon?: string | null;
  parentMenuId?: number | null;
  sortOrder: number;
  badge?: string | null;
  tooltip?: string | null;
  defaultExpanded?: boolean;
  menuGroup: string;
  isActive: boolean;
}

export interface ToggleMenuItemRequest {
  menuId: number;
  isActive: boolean;
}

export interface BatchCreateMenusRequest {
  items: CreateMenuItemRequest[];
}

export interface BatchUpdateMenusRequest {
  items: UpdateMenuItemRequest[];
}

export interface BatchDeleteMenusRequest {
  ids: number[];
}

export interface BatchToggleMenusRequest {
  items: ToggleMenuItemRequest[];
}
