import type { PagedResponse } from '@/types/common';
import type { BillOtherItem } from '@/types/billOther';

export type BillPayBy = 'upi' | 'cash' | 'owner';

export const BILL_PAY_BY_OPTIONS: { value: BillPayBy; label: string }[] = [
  { value: 'upi', label: 'UPI' },
  { value: 'cash', label: 'Cash' },
  { value: 'owner', label: 'Owner' },
];

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
  truckLoan: boolean;
  payBy: BillPayBy | null;
  paidName: string | null;
  paidMobile: string | null;
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
  truckLoan: boolean;
  payBy: BillPayBy | null;
  paidName: string | null;
  paidMobile: string | null;
  officeMamul: number;
  tapalMamul: number;
  diesel: number;
  others: BillOtherItem[];
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
  consignorId: number;
  consigneeId: number | null;
  asPerBill: boolean;
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
  consignorId: number;
  consigneeId: number | null;
  asPerBill: boolean;
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
  truckLoan: boolean;
  payBy: BillPayBy | null;
  paidName: string | null;
  paidMobile: string | null;
  officeMamul: number;
  tapalMamul: number;
  diesel: number;
  others: BillOtherItem[];
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
