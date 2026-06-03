/** Bill + load line values edited on create/edit screens (client-side totals). */
export type BillLoadFormLine = {
  loadId?: number | null;
  partyId: number | null;
  partyName: string;
  toId: number | null;
  toLocationName: string;
  goodsId: number | null;
  goodsName: string;
  unitId: number | null;
  unitName: string;
  weightOrQuantity: number | '';
  ratePerUnit: number | '';
  freight: number | '';
  advance: number | '';
  topay: number | '';
  balance: number | '';
};

export type BillFormValues = {
  billId?: number | null;
  billNumber: string;
  billDate: string;
  fromId: number | null;
  fromLocationName: string;
  truckId: number | null;
  truckNumber: string;
  nameBoardName: string;
  ownerName: string;
  ownerMobile: string;
  driverName: string;
  driverMobile: string;
  totalFreight: number | '';
  commission: number | '';
  crossing: number | '';
  handLoan: number | '';
  truckLoan: number | '';
  officeMamul: number | '';
  tapalMamul: number | '';
  diesel: number | '';
  others: number | '';
  total: number | '';
  isCancelled: boolean;
  loads: BillLoadFormLine[];
};
