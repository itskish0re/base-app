import type { PagedResponse } from '@/types/common';

export type BillListRowDto = {
  billId: number;
  billNumber: string;
  billDate: string;
  fromId: number;
  fromLocationName: string;
  truckId: number;
  truckNumber: string;
  nameBoardName: string;
  ownerName: string;
  ownerMobile: string | null;
  driverName: string;
  driverMobile: string | null;
  totalFreight: number;
  commission: number;
  crossing: number;
  handLoan: number;
  truckLoan: number;
  officeMamul: number;
  tapalMamul: number;
  diesel: number;
  others: number;
  total: number;
  isCancelled: boolean;
  financialYearId: number;
};

export type PagedBillsResponse = PagedResponse<BillListRowDto>;

export type BillDto = {
  billId: number;
  billNumber: string;
  billDate: string;
  fromId: number;
  truckId: number;
  driverName: string;
  driverMobile: string | null;
  totalFreight: number;
  commission: number;
  crossing: number;
  handLoan: number;
  truckLoan: number;
  officeMamul: number;
  tapalMamul: number;
  diesel: number;
  others: number;
  total: number;
  isCancelled: boolean;
  financialYearId: number;
  createdAt: string;
  updatedAt: string;
};

export type LoadLineDto = {
  loadId: number;
  billId: number;
  loadNumber: number;
  partyId: number;
  toId: number;
  goodsId: number;
  unitId: number;
  weightOrQuantity: number;
  ratePerUnit: number;
  freight: number;
  advance: number;
  topay: number;
  balance: number;
  isActive: boolean;
  financialYearId: number;
};

export type BillDetailResponse = {
  bill: BillDto;
  loads: LoadLineDto[];
};

export type NextBillNumberResponse = {
  billNumber: string;
};

export type SaveBillLoadItem = {
  loadId?: number | null;
  partyId: number;
  toId: number;
  goodsId: number;
  unitId: number;
  weightOrQuantity: number;
  ratePerUnit: number;
  freight: number;
  advance: number;
  topay: number;
  balance: number;
};

export type SaveBillItem = {
  billId?: number | null;
  billNumber: string;
  billDate: string;
  fromId: number;
  truckId: number;
  driverName: string;
  driverMobile?: string | null;
  totalFreight: number;
  commission: number;
  crossing: number;
  handLoan: number;
  truckLoan: number;
  officeMamul: number;
  tapalMamul: number;
  diesel: number;
  others: number;
  total: number;
  isCancelled?: boolean;
};

export type SaveBillRequest = {
  bill: SaveBillItem;
  loads: SaveBillLoadItem[];
};

export type SaveBillResponse = BillDetailResponse;

export type CancelBillRequest = {
  billId: number;
};

export type CancelBillResponse = {
  bill: BillDto;
};
