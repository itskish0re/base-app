import type { PagedResponse } from '@/types/common';

export type LoadListRowDto = {
  loadId: number;
  billId: number;
  billNumber: string;
  loadNumber: number;
  consignorId: number;
  consignorName: string;
  consigneeId: number | null;
  consigneeName: string | null;
  asPerBill: boolean;
  toId: number;
  toLocationName: string;
  goodsId: number;
  goodsName: string;
  unitId: number;
  unitName: string;
  weightOrQuantity: number;
  ratePerUnit: number;
  freight: number;
  advance: number;
  topay: number;
  balance: number;
  isActive: boolean;
  financialYearId: number;
};

export type PagedLoadsResponse = PagedResponse<LoadListRowDto>;
