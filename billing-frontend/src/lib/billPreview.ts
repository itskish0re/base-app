import type { BillPreviewLoadLine, BillPreviewModel } from '@/types/billPreview';

/** Maximum load lines rendered on the printed memo. */
export const BILL_MEMO_MAX_LOAD_ROWS = 3;

export const DEFAULT_BILL_PREVIEW_COMPANY: BillPreviewModel['company'] = {
  motto: '|| OM NAMAH SHIVAYA ||',
  titleTop: 'TRUCK MEMO',
  titleBottom: 'COMMISSION MEMO',
  companyNameMain: 'Shiv Krupa',
  companyNameSub: 'Transport',
  addressLines: [
    'Balaji Chamber, N.H., 8-A, Opp. New R.T.O., At. New Jambudiya,',
    'Dist. MORBI-363 642. (Guj.)',
  ],
  phone: 'Mo. 98240 45196',
  signatureLabel: 'For, Shiv Krupa Transport',
  terms: [
    'In cash if truck goes out of order, we will not be responsible for the goods.',
    'In case any shortage is found in the goods we will not be responsible.',
    'In case goods are not delivered to the proper person we will not be responsible.',
    'At the time of loading truck driver has checked the goods properly.',
    'After delivery as per the way bill our responsibility is finished.',
  ],
};

export function formatBillPreviewDate(value: string | null | undefined): string {
  if (!value?.trim()) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatBillPreviewAmount(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '';
  }

  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/** Shown in the Consignee column when as per bill is enabled. */
export const BILL_PREVIEW_AS_PER_BILL_LABEL = 'As per bill';

export function formatBillPreviewConsigneeName(
  consigneeName: string,
  asPerBill: boolean,
): string {
  if (asPerBill) {
    return BILL_PREVIEW_AS_PER_BILL_LABEL;
  }

  return consigneeName;
}

export function formatBillPreviewWeight(
  weight: number | null | undefined,
  unitName: string | null | undefined,
): string {
  const amount = formatBillPreviewAmount(weight);
  if (!amount) {
    return '';
  }

  const unit = unitName?.trim();
  return unit ? `${amount} ${unit}` : amount;
}

function createEmptyLoadRow(loadNumber: number): BillPreviewLoadLine {
  return {
    loadNumber,
    consignorName: '',
    consigneeName: '',
    asPerBill: false,
    toLocationName: '',
    goodsName: '',
    unitName: '',
    weightOrQuantity: null,
    ratePerUnit: null,
    freight: null,
    advance: null,
    topay: null,
    balance: null,
  };
}

/** Sample data aligned with Bill_sample_photo.jpeg for template development. */
export function createSampleBillPreview(): BillPreviewModel {
  return {
    company: DEFAULT_BILL_PREVIEW_COMPANY,
    billNumber: '902',
    billDate: '2026-05-30',
    fromLocationName: 'Morbi',
    toLocationName: '',
    truckNumber: '',
    nameBoardName: '',
    ownerName: '',
    ownerMobile: '',
    driverName: '',
    driverMobile: '',
    loads: prepareBillPreviewLoads([]),
    truckLoan: null,
    commission: null,
    officeMamul: null,
    tapalMamul: null,
    crossing: null,
    handLoan: null,
    diesel: null,
    others: [],
    total: null,
    totalFreight: null,
    isCancelled: false,
  };
}

/** Caps at {@link BILL_MEMO_MAX_LOAD_ROWS}; renumbers S. No. 1…n from load count. */
export function prepareBillPreviewLoads(loads: BillPreviewLoadLine[]): BillPreviewLoadLine[] {
  const sorted = [...loads].sort((a, b) => a.loadNumber - b.loadNumber);
  const capped = sorted.slice(0, BILL_MEMO_MAX_LOAD_ROWS);

  if (capped.length === 0) {
    return [createEmptyLoadRow(1)];
  }

  return capped.map((line, index) => ({
    ...line,
    loadNumber: index + 1,
  }));
}

export type BillPreviewChargeRow = {
  key: string;
  label: string;
  value: number | null;
};

/** Charge rows shown below loads (fixed order, skips empty optional rows). */
export function buildBillPreviewChargeRows(data: BillPreviewModel): BillPreviewChargeRow[] {
  const rows: BillPreviewChargeRow[] = [
    { key: 'commission', label: 'Commission', value: data.commission },
    { key: 'crossing', label: 'Crossing', value: data.crossing },
    { key: 'truckLoan', label: 'Truck Loan', value: data.truckLoan },
    { key: 'officeMamul', label: 'Office Mamul', value: data.officeMamul },
    { key: 'tapalMamul', label: 'Tapal Mamul', value: data.tapalMamul },
    { key: 'handLoan', label: 'Hand Loan', value: data.handLoan },
    { key: 'diesel', label: 'Diesel', value: data.diesel },
  ];

  data.others.forEach((item, index) => {
    rows.push({
      key: `other-${index}-${item.key}`,
      label: item.key.trim() || 'Extra',
      value: item.value,
    });
  });

  rows.push({ key: 'total', label: 'TOTAL', value: data.total });

  return rows;
}
