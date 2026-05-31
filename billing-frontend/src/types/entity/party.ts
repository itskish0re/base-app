import type {
  BatchDeleteResponse,
  BatchItemFailure,
  LookupFieldMapping,
  LookupResponse,
  PagedResponse,
} from '@/types/common';

export interface PartyDto {
  partyId: number;
  code: string;
  name: string;
  isEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PagedPartiesResponse = PagedResponse<PartyDto>;

export type BatchPartyItemFailure = BatchItemFailure;

export interface BatchCreatePartiesResponse {
  created: PartyDto[];
  failures: BatchPartyItemFailure[];
}

export interface BatchUpdatePartiesResponse {
  updated: PartyDto[];
  failures: BatchPartyItemFailure[];
}

export type BatchDeletePartiesResponse = BatchDeleteResponse;

export interface BatchTogglePartiesResponse {
  updated: PartyDto[];
  failures: BatchPartyItemFailure[];
}

export interface CreatePartyItemRequest {
  name: string;
  code: string;
}

export interface UpdatePartyItemRequest {
  partyId: number;
  name: string;
  code: string;
  isEnabled?: boolean;
  isActive?: boolean;
}

export interface TogglePartyItemRequest {
  partyId: number;
  isEnabled: boolean;
}

export interface BatchCreatePartiesRequest {
  items: CreatePartyItemRequest[];
}

export interface BatchUpdatePartiesRequest {
  items: UpdatePartyItemRequest[];
}

export interface BatchDeletePartiesRequest {
  ids: number[];
}

export interface BatchTogglePartiesRequest {
  items: TogglePartyItemRequest[];
}

export type PartyLookupFieldMapping = LookupFieldMapping;

export interface LookupPartiesRequest {
  value: string;
  label: string;
  fields?: PartyLookupFieldMapping[] | null;
}

export type PartyLookupResponse = LookupResponse;
