import type {
  BatchDeleteResponse,
  BatchItemFailure,
  LookupFieldMapping,
  LookupResponse,
  PagedResponse,
} from '@/types/common';

export interface NameBoardDto {
  nameBoardId: number;
  name: string;
  code: string;
  ownerName: string;
  ownerPhone: string | null;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PagedNameBoardsResponse = PagedResponse<NameBoardDto>;

export type BatchNameBoardItemFailure = BatchItemFailure;

export interface BatchCreateNameBoardsResponse {
  created: NameBoardDto[];
  failures: BatchNameBoardItemFailure[];
}

export interface BatchUpdateNameBoardsResponse {
  updated: NameBoardDto[];
  failures: BatchNameBoardItemFailure[];
}

export type BatchDeleteNameBoardsResponse = BatchDeleteResponse;

export interface BatchToggleNameBoardsResponse {
  updated: NameBoardDto[];
  failures: BatchNameBoardItemFailure[];
}

export interface CreateNameBoardItemRequest {
  name: string;
  code: string;
  ownerName: string;
  ownerPhone?: string | null;
}

export interface UpdateNameBoardItemRequest {
  nameBoardId: number;
  name: string;
  code: string;
  ownerName: string;
  ownerPhone?: string | null;
  isEnabled?: boolean;
  isActive?: boolean;
}

export interface ToggleNameBoardItemRequest {
  nameBoardId: number;
  isEnabled: boolean;
}

export interface BatchCreateNameBoardsRequest {
  items: CreateNameBoardItemRequest[];
}

export interface BatchUpdateNameBoardsRequest {
  items: UpdateNameBoardItemRequest[];
}

export interface BatchDeleteNameBoardsRequest {
  ids: number[];
}

export interface BatchToggleNameBoardsRequest {
  items: ToggleNameBoardItemRequest[];
}

export type NameBoardLookupFieldMapping = LookupFieldMapping;

export interface LookupNameBoardsRequest {
  value: string;
  label: string;
  fields?: NameBoardLookupFieldMapping[] | null;
}

export type NameBoardLookupResponse = LookupResponse;
