import type {
  BatchDeleteResponse,
  BatchItemFailure,
  LookupFieldMapping,
  LookupResponse,
  PagedResponse,
} from '@/types/common';

export interface GoodsDto {
  goodsId: number;
  code: string;
  name: string;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PagedGoodsResponse = PagedResponse<GoodsDto>;

export type BatchGoodsItemFailure = BatchItemFailure;

export interface BatchCreateGoodsResponse {
  created: GoodsDto[];
  failures: BatchGoodsItemFailure[];
}

export interface BatchUpdateGoodsResponse {
  updated: GoodsDto[];
  failures: BatchGoodsItemFailure[];
}

export type BatchDeleteGoodsResponse = BatchDeleteResponse;

export interface BatchToggleGoodsResponse {
  updated: GoodsDto[];
  failures: BatchGoodsItemFailure[];
}

export interface CreateGoodsItemRequest {
  name: string;
  code: string;
}

export interface UpdateGoodsItemRequest {
  goodsId: number;
  name: string;
  code: string;
  isEnabled?: boolean;
  isActive?: boolean;
}

export interface ToggleGoodsItemRequest {
  goodsId: number;
  isEnabled: boolean;
}

export interface BatchCreateGoodsRequest {
  items: CreateGoodsItemRequest[];
}

export interface BatchUpdateGoodsRequest {
  items: UpdateGoodsItemRequest[];
}

export interface BatchDeleteGoodsRequest {
  ids: number[];
}

export interface BatchToggleGoodsRequest {
  items: ToggleGoodsItemRequest[];
}

export type GoodsLookupFieldMapping = LookupFieldMapping;

export interface LookupGoodsRequest {
  value: string;
  label: string;
  fields?: GoodsLookupFieldMapping[] | null;
}

export type GoodsLookupResponse = LookupResponse;
