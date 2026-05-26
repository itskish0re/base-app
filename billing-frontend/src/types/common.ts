/** Shared list query parameters (Gridify-backed masters). */
export interface ListQueryParams {
  filter?: string;
  orderBy?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResponse<TItem> {
  items: TItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface BatchItemFailure {
  index: number;
  errorCode: string;
  message: string;
}

export interface BatchDeleteResponse {
  deletedIds: number[];
  failures: BatchItemFailure[];
}

/** Dropdown lookup field mapping (value/label + optional extra columns). */
export interface LookupFieldMapping {
  keyName: string;
  columnName: string;
}

export interface LookupItem {
  value: unknown;
  label: unknown | null;
  fields: Record<string, unknown | null>;
}

export interface LookupResponse {
  items: LookupItem[];
}
