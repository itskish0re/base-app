import type { BillPayBy } from '@/types/entity/bill';

/** Display model for the truck memo HTML preview (form → preview mapping). */
export type BillPreviewOtherItem = {
  key: string;
  value: number | null;
};

export type BillPreviewLoadLine = {
  loadNumber: number;
  consignorName: string;
  consigneeName: string;
  asPerBill: boolean;
  toLocationName: string;
  goodsName: string;
  unitName: string;
  weightOrQuantity: number | null;
  ratePerUnit: number | null;
  freight: number | null;
  advance: number | null;
  topay: number | null;
  balance: number | null;
};

export type BillPreviewCompany = {
  motto: string;
  titleTop: string;
  titleBottom: string;
  /** Primary script line (e.g. "Shiv Krupa"). */
  companyNameMain: string;
  /** Secondary script line on same row (e.g. "Transport"). */
  companyNameSub: string;
  addressLines: string[];
  phone: string;
  signatureLabel: string;
  /** Numbered disclaimer lines at the bottom-left of the memo. */
  terms: string[];
};

export type BillPreviewModel = {
  company: BillPreviewCompany;
  billNumber: string;
  billDate: string;
  fromLocationName: string;
  /** Primary destination — `to` of the load with the lowest load number. */
  toLocationName: string;
  truckNumber: string;
  nameBoardName: string;
  ownerName: string;
  ownerMobile: string;
  driverName: string;
  driverMobile: string;
  loads: BillPreviewLoadLine[];
  truckLoan: boolean;
  payBy: BillPayBy | null;
  paidName: string | null;
  paidMobile: string | null;
  /** Sum of load advances — left ledger summary. */
  totalAdvance: number | null;
  /** Sum of load balances — left ledger summary. */
  totalBalance: number | null;
  commission: number | null;
  /** Office mamul */
  officeMamul: number | null;
  /** Tapal mamul */
  tapalMamul: number | null;
  crossing: number | null;
  handLoan: number | null;
  diesel: number | null;
  /** Shown as dynamic rows on memo (replaces single Extra). */
  others: BillPreviewOtherItem[];
  total: number | null;
  totalFreight: number | null;
  isCancelled: boolean;
};
