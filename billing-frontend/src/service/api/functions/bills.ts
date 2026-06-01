import { endpoints } from '@/config/endpoints';
import { api } from '@/service/api/client';
import type { ListQueryParams } from '@/types/common';
import type {
  BillDetailResponse,
  CancelBillRequest,
  CancelBillResponse,
  NextBillNumberResponse,
  PagedBillsResponse,
  SaveBillRequest,
  SaveBillResponse,
} from '@/types/entity/bill';

export async function listBills(params?: ListQueryParams): Promise<PagedBillsResponse> {
  const { data } = await api.get<PagedBillsResponse>(endpoints.bills.list(), { params });
  return data;
}

export async function getNextBillNumber(): Promise<NextBillNumberResponse> {
  const { data } = await api.get<NextBillNumberResponse>(endpoints.bills.nextNumber());
  return data;
}

export async function getBillById(id: number): Promise<BillDetailResponse> {
  const { data } = await api.get<BillDetailResponse>(endpoints.bills.byId(id));
  return data;
}

export async function saveBill(body: SaveBillRequest): Promise<SaveBillResponse> {
  const { data } = await api.post<SaveBillResponse>(endpoints.bills.save(), body);
  return data;
}

export async function cancelBill(body: CancelBillRequest): Promise<CancelBillResponse> {
  const { data } = await api.post<CancelBillResponse>(endpoints.bills.cancel(), body);
  return data;
}
