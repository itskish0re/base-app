/** Display model for the truck memo HTML preview (form → preview mapping). */
export type BillPreviewLoadLine = {
  loadNumber: number;
  partyName: string;
  toLocationName: string;
  goodsName: string;
  unitName: string;
  weightOrQuantity: number | null;
  ratePerUnit: number | null;
  freight: number | null;
  advance: number | null;
  balance: number | null;
};

export type BillPreviewCompany = {
  motto: string;
  titleTop: string;
  titleBottom: string;
  companyName: string;
  addressLines: string[];
  phone: string;
  signatureLabel: string;
};

export type BillPreviewModel = {
  company: BillPreviewCompany;
  billNumber: string;
  billDate: string;
  fromLocationName: string;
  truckNumber: string;
  nameBoardName: string;
  ownerName: string;
  ownerMobile: string;
  driverName: string;
  driverMobile: string;
  loads: BillPreviewLoadLine[];
  /** Minimum empty rows on the memo (pad for handwriting). */
  minLoadRows: number;
  truckLoan: number | null;
  commission: number | null;
  /** Shown as "Loading Charges" on memo */
  officeMamul: number | null;
  /** Shown as "Hamali/Guide" on memo */
  tapalMamul: number | null;
  crossing: number | null;
  handLoan: number | null;
  diesel: number | null;
  /** Shown as "Extra" on memo */
  others: number | null;
  total: number | null;
  totalFreight: number | null;
  isCancelled: boolean;
};
