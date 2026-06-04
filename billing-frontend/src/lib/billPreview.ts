import type { BillPreviewLoadLine, BillPreviewModel } from '@/types/billPreview';

export const DEFAULT_BILL_PREVIEW_COMPANY: BillPreviewModel['company'] = {
  motto: '|| OM NAMAH SHIVAYA ||',
  titleTop: 'TRUCK MEMO',
  titleBottom: 'COMMISSION MEMO',
  companyName: 'Shiv Krupa Transport',
  addressLines: [
    'Balaji Chamber, N.H., 8-A, Opp. New R.T.O.,',
    'At. New Jambudiya, Dist. MORBI-363 642. (Guj.)',
  ],
  phone: 'Mo. 98240 45196',
  signatureLabel: 'For, Shiv Krupa Transport',
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

function padLoadRows(loads: BillPreviewLoadLine[], minRows: number): BillPreviewLoadLine[] {
  const rows = [...loads];
  while (rows.length < minRows) {
    rows.push({
      loadNumber: rows.length + 1,
      consignorName: '',
      consigneeName: '',
      goodsName: '',
      unitName: '',
      weightOrQuantity: null,
      ratePerUnit: null,
      freight: null,
      advance: null,
      balance: null,
    });
  }

  return rows;
}

/** Sample data aligned with Bill_sample_photo.jpeg for template development. */
export function createSampleBillPreview(): BillPreviewModel {
  return {
    company: DEFAULT_BILL_PREVIEW_COMPANY,
    billNumber: '902',
    billDate: '2026-05-30',
    fromLocationName: 'Morbi',
    truckNumber: 'GJ-12-AB-1234',
    nameBoardName: 'Shiv Krupa',
    ownerName: 'Ramesh Bhai',
    ownerMobile: '9824045196',
    driverName: 'Suresh',
    driverMobile: '9876543210',
    loads: padLoadRows(
      [
        {
          loadNumber: 1,
          consignorName: 'ABC Traders',
          consigneeName: 'XYZ Stores',
          goodsName: 'Ceramic Tiles',
          unitName: 'Ton',
          weightOrQuantity: 12,
          ratePerUnit: 850,
          freight: 10200,
          advance: 2000,
          balance: 8200,
        },
      ],
      6,
    ),
    minLoadRows: 6,
    truckLoan: null,
    commission: 500,
    officeMamul: 200,
    tapalMamul: 150,
    crossing: null,
    handLoan: null,
    diesel: null,
    others: [{ key: 'Parking', value: 100 }],
    total: 11150,
    totalFreight: 10200,
    isCancelled: false,
  };
}

export function prepareBillPreviewLoads(
  loads: BillPreviewLoadLine[],
  minLoadRows: number,
): BillPreviewLoadLine[] {
  return padLoadRows(loads, minLoadRows);
}
