import { formatIndianVehicleNumber } from '@/components/derived/data-table/column-cells/formatters';
import { parseVehicleNumberStoredValue } from '@/components/derived/entity-form/ef-input-value';
import { buildBillAdvanceSummary, DEFAULT_BILL_PREVIEW_COMPANY } from '@/lib/billPreview';
import {
  createEmptyBillOtherItem,
  sumBillOtherItems,
  type BillOtherItem,
} from '@/types/billOther';
import type { BillDetailResponse, SaveBillLoadItem, SaveBillRequest } from '@/types/entity/bill';
import type { BillFormValues, BillLoadFormLine } from '@/types/billForm';
import type { BillPreviewLoadLine, BillPreviewModel } from '@/types/billPreview';
import type { LookupItem } from '@/types/common';

export const BILL_FORM_MAX_LOAD_ROWS = 3;

export function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createEmptyLoadLine(loadNumber = 1): BillLoadFormLine {
  return {
    loadNumber,
    consignorId: null,
    consignorName: '',
    consigneeId: null,
    consigneeName: '',
    asPerBill: false,
    toId: null,
    toLocationName: '',
    goodsId: null,
    goodsName: '',
    unitId: null,
    unitName: '',
    unitIsFixed: false,
    weightOrQuantity: '',
    ratePerUnit: '',
    freight: '',
    advance: '',
    topay: '',
    balance: '',
    loadId: null,
  };
}

export function createInitialBillFormValues(): BillFormValues {
  return recalculateBillForm({
    billNumber: '',
    billDate: todayIsoDate(),
    fromId: null,
    fromLocationName: '',
    truckId: null,
    truckNumber: '',
    nameBoardName: '',
    ownerName: '',
    ownerMobile: '',
    driverName: '',
    driverMobile1: '',
    driverMobile2: '',
    totalFreight: '',
    commission: '',
    crossing: '',
    handLoan: '',
    truckLoan: false,
    payBy: 'upi',
    paidName: '',
    paidMobile: '',
    officeMamul: '',
    tapalMamul: '',
    diesel: '',
    others: [createEmptyBillOtherItem()],
    total: '',
    isCancelled: false,
    loads: [createEmptyLoadLine()],
  });
}

export function formatBillFormAmount(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '';
  }

  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

const BILL_COMMISSION_RATE = 0.02;

export function sumLoadField(
  loads: BillLoadFormLine[],
  field: 'advance' | 'balance',
): number {
  return loads.reduce((sum, line) => sum + (toFormNumber(line[field]) ?? 0), 0);
}

export function sumLoadAdvances(loads: BillLoadFormLine[]): number {
  return sumLoadField(loads, 'advance');
}

export function sumLoadTopay(loads: BillLoadFormLine[]): number {
  return loads.reduce((sum, line) => sum + (toFormNumber(line.topay) ?? 0), 0);
}

export function formatBillFormCurrency(value: number | null | undefined): string {
  const amount = value ?? 0;
  return `₹ ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function isTruckLoanAllowed(loads: BillLoadFormLine[]): boolean {
  return sumLoadAdvances(loads) === 0;
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function lookupUnitIsFixed(units: LookupItem[], unitId: number | null): boolean {
  if (unitId == null) {
    return false;
  }

  const item = units.find((row) => Number(row.value) === unitId);
  const isFixed = item?.fields?.isFixed;
  return isFixed === true || isFixed === 'true';
}

function calculateLoadFreight(line: BillLoadFormLine): number | null {
  const rate = toFormNumber(line.ratePerUnit);
  if (rate == null) {
    return null;
  }

  if (line.unitIsFixed) {
    return roundMoney(rate);
  }

  const weight = toFormNumber(line.weightOrQuantity);
  if (weight == null) {
    return null;
  }

  return roundMoney(weight * rate);
}

export function toFormNumber(value: number | '' | null | undefined): number | null {
  if (value === '' || value == null) {
    return null;
  }

  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Empty editable numeric fields use '' instead of 0 so inputs do not show a leading zero. */
export function normalizeEditableNumeric(value: number | '' | null | undefined): number | '' {
  if (value === '' || value == null || value === 0) {
    return '';
  }

  return value;
}

export function parseBillFormNumericInput(raw: string): number | '' {
  if (raw.trim() === '') {
    return '';
  }

  const n = Number(raw);
  return Number.isFinite(n) ? n : '';
}

export function formNumericInputValue(value: number | ''): string | number {
  if (value === '' || value === 0) {
    return '';
  }

  return value;
}

function toFormNumberOrZero(value: number | '' | null | undefined): number {
  return toFormNumber(value) ?? 0;
}

export function recalculateLoadLine(line: BillLoadFormLine): BillLoadFormLine {
  const freight = calculateLoadFreight(line);
  const advance = toFormNumber(line.advance) ?? 0;
  const topay = toFormNumber(line.topay) ?? 0;
  const balance =
    freight != null ? roundMoney(freight - advance - topay) : toFormNumber(line.balance);

  return {
    ...line,
    freight: freight ?? '',
    balance: balance ?? '',
  };
}

export function recalculateBillForm(values: BillFormValues): BillFormValues {
  const loads = values.loads.map(recalculateLoadLine);
  const totalFreight = roundMoney(
    loads.reduce((sum, line) => sum + (toFormNumber(line.freight) ?? 0), 0),
  );
  const commission = roundMoney(totalFreight * BILL_COMMISSION_RATE);
  const truckLoanAllowed = isTruckLoanAllowed(loads);

  const charges =
    commission +
    (toFormNumber(values.crossing) ?? 0) +
    (toFormNumber(values.officeMamul) ?? 0) +
    (toFormNumber(values.tapalMamul) ?? 0) +
    (toFormNumber(values.diesel) ?? 0) +
    (toFormNumber(values.handLoan) ?? 0) +
    sumBillOtherItems(values.others);

  const total = roundMoney(charges);

  return {
    ...values,
    loads,
    totalFreight,
    commission,
    truckLoan: truckLoanAllowed ? values.truckLoan : false,
    total,
  };
}

function lookupItemRawLabel(item: LookupItem): string {
  const label = item.label;
  return label == null || label === '' ? String(item.value ?? '') : String(label);
}

export function formatBillFormTruckNumber(value: string | null | undefined): string {
  return formatIndianVehicleNumber(value);
}

/** Drops placeholder / invalid truck numbers from bill-form lookup options. */
export function filterBillFormTruckLookupItems(items: LookupItem[]): LookupItem[] {
  return items.filter((item) => {
    const normalized = parseVehicleNumberStoredValue(lookupItemRawLabel(item));
    return normalized.length > 0 && normalized !== 'CANCEL';
  });
}

export function lookupItemLabel(items: LookupItem[], id: number | null): string {
  if (id == null) {
    return '';
  }

  const item = items.find((row) => Number(row.value) === id);
  if (!item) {
    return '';
  }

  return lookupItemRawLabel(item);
}

export function mapBillDetailToFormValues(
  detail: BillDetailResponse,
  lookups: {
    locations: LookupItem[];
    parties: LookupItem[];
    goods: LookupItem[];
    units: LookupItem[];
    trucks: LookupItem[];
  },
): BillFormValues {
  const { bill, loads } = detail;

  return recalculateBillForm({
    billId: bill.billId,
    billNumber: bill.billNumber,
    billDate: bill.billDate.slice(0, 10),
    fromId: bill.fromId,
    fromLocationName: lookupItemLabel(lookups.locations, bill.fromId),
    truckId: bill.truckId,
    truckNumber: formatBillFormTruckNumber(lookupItemLabel(lookups.trucks, bill.truckId)),
    nameBoardName: '',
    ownerName: '',
    ownerMobile: '',
    driverName: bill.driverName,
    driverMobile1: bill.driverMobile1 ?? '',
    driverMobile2: bill.driverMobile2 ?? '',
    totalFreight: bill.totalFreight,
    commission: bill.commission,
    crossing: normalizeEditableNumeric(bill.crossing),
    handLoan: normalizeEditableNumeric(bill.handLoan),
    truckLoan: bill.truckLoan,
    payBy: bill.payBy,
    paidName: bill.payBy === 'upi' ? bill.paidName ?? '' : '',
    paidMobile: bill.payBy === 'upi' ? bill.paidMobile ?? '' : '',
    officeMamul: normalizeEditableNumeric(bill.officeMamul),
    tapalMamul: normalizeEditableNumeric(bill.tapalMamul),
    diesel: normalizeEditableNumeric(bill.diesel),
    others: bill.others?.length
      ? bill.others.map((o) => ({
          key: o.key,
          value: normalizeEditableNumeric(o.value),
        }))
      : [createEmptyBillOtherItem()],
    total: bill.total,
    isCancelled: bill.isCancelled,
    loads:
      loads.length > 0
        ? loads
            .slice()
            .sort((a, b) => a.loadNumber - b.loadNumber)
            .map((line) =>
            recalculateLoadLine({
              loadId: line.loadId,
              loadNumber: line.loadNumber,
              consignorId: line.consignorId,
              consignorName: lookupItemLabel(lookups.parties, line.consignorId),
              consigneeId: line.asPerBill ? null : line.consigneeId,
              consigneeName: line.asPerBill
                ? ''
                : lookupItemLabel(lookups.parties, line.consigneeId),
              asPerBill: line.asPerBill,
              toId: line.toId,
              toLocationName: lookupItemLabel(lookups.locations, line.toId),
              goodsId: line.goodsId,
              goodsName: lookupItemLabel(lookups.goods, line.goodsId),
              unitId: line.unitId,
              unitName: lookupItemLabel(lookups.units, line.unitId),
              unitIsFixed: lookupUnitIsFixed(lookups.units, line.unitId),
              weightOrQuantity: normalizeEditableNumeric(line.weightOrQuantity),
              ratePerUnit: normalizeEditableNumeric(line.ratePerUnit),
              freight: line.freight,
              advance: normalizeEditableNumeric(line.advance),
              topay: normalizeEditableNumeric(line.topay),
              balance: line.balance,
            }),
          )
        : [createEmptyLoadLine()],
  });
}

export function mapBillFormToPreview(values: BillFormValues): BillPreviewModel {
  const loads: BillPreviewLoadLine[] = values.loads.map((line, index) => ({
    loadNumber: line.loadNumber || index + 1,
    consignorName: line.consignorName,
    consigneeName: line.consigneeName,
    asPerBill: line.asPerBill,
    toLocationName: line.toLocationName,
    goodsName: line.goodsName,
    unitName: line.unitName,
    weightOrQuantity: toFormNumber(line.weightOrQuantity),
    ratePerUnit: toFormNumber(line.ratePerUnit),
    freight: toFormNumber(line.freight),
    advance: toFormNumber(line.advance),
    topay: toFormNumber(line.topay),
    balance: toFormNumber(line.balance),
  }));

  const primaryLoad = values.loads
    .map((line, index) => ({
      loadNumber: line.loadNumber || index + 1,
      toLocationName: line.toLocationName,
    }))
    .sort((a, b) => a.loadNumber - b.loadNumber)[0];

  return {
    company: DEFAULT_BILL_PREVIEW_COMPANY,
    billNumber: values.billNumber,
    billDate: values.billDate,
    fromLocationName: values.fromLocationName,
    toLocationName: primaryLoad?.toLocationName ?? '',
    truckNumber: values.truckNumber,
    nameBoardName: values.nameBoardName,
    ownerName: values.ownerName,
    ownerMobile: values.ownerMobile,
    driverName: values.driverName,
    driverMobile1: values.driverMobile1,
    driverMobile2: values.driverMobile2,
    loads: loads.slice(0, BILL_FORM_MAX_LOAD_ROWS),
    truckLoan: values.truckLoan,
    payBy: values.payBy,
    paidName: values.payBy === 'upi' ? values.paidName.trim() || null : null,
    paidMobile: values.payBy === 'upi' ? values.paidMobile.trim() || null : null,
    advanceSummary: buildBillAdvanceSummary(loads, toFormNumber(values.total)),
    commission: toFormNumber(values.commission),
    officeMamul: toFormNumber(values.officeMamul),
    tapalMamul: toFormNumber(values.tapalMamul),
    crossing: toFormNumber(values.crossing),
    handLoan: toFormNumber(values.handLoan),
    diesel: toFormNumber(values.diesel),
    others: values.others
      .filter((o) => o.key.trim() || o.value !== '')
      .map((o) => ({
        key: o.key.trim(),
        value: toFormNumber(o.value),
      })),
    total: toFormNumber(values.total),
    totalFreight: toFormNumber(values.totalFreight),
    isCancelled: values.isCancelled,
  };
}

function isLoadLineSavable(line: BillLoadFormLine): boolean {
  const hasConsignee = line.asPerBill || (line.consigneeId != null && line.consigneeId > 0);

  return (
    line.consignorId != null &&
    line.consignorId > 0 &&
    hasConsignee &&
    line.toId != null &&
    line.toId > 0 &&
    line.goodsId != null &&
    line.goodsId > 0 &&
    line.unitId != null &&
    line.unitId > 0
  );
}

function mapOthersToSave(items: BillOtherItem[]) {
  return items
    .filter((o) => o.key.trim() && o.value !== '')
    .map((o) => ({
      key: o.key.trim(),
      value: toFormNumberOrZero(o.value),
    }));
}

export function mapBillFormToSaveRequest(values: BillFormValues): SaveBillRequest {
  const mapLoadLine = (line: BillLoadFormLine): SaveBillLoadItem => ({
    loadId: line.loadId ?? null,
    consignorId: line.consignorId ?? 0,
    consigneeId: line.asPerBill ? null : line.consigneeId,
    asPerBill: line.asPerBill,
    toId: line.toId ?? 0,
    goodsId: line.goodsId ?? 0,
    unitId: line.unitId ?? 0,
    weightOrQuantity: toFormNumberOrZero(line.weightOrQuantity),
    ratePerUnit: toFormNumberOrZero(line.ratePerUnit),
    freight: toFormNumberOrZero(line.freight),
    advance: toFormNumberOrZero(line.advance),
    topay: toFormNumberOrZero(line.topay),
    balance: toFormNumberOrZero(line.balance),
  });

  const loads: SaveBillLoadItem[] = values.isCancelled
    ? values.loads.map(mapLoadLine)
    : values.loads.filter(isLoadLineSavable).map((line) => ({
        loadId: line.loadId ?? null,
        consignorId: line.consignorId!,
        consigneeId: line.asPerBill ? null : line.consigneeId,
        asPerBill: line.asPerBill,
        toId: line.toId!,
        goodsId: line.goodsId!,
        unitId: line.unitId!,
        weightOrQuantity: toFormNumberOrZero(line.weightOrQuantity),
        ratePerUnit: toFormNumberOrZero(line.ratePerUnit),
        freight: toFormNumberOrZero(line.freight),
        advance: toFormNumberOrZero(line.advance),
        topay: toFormNumberOrZero(line.topay),
        balance: toFormNumberOrZero(line.balance),
      }));

  const driverName = values.driverName.trim();

  return {
    bill: {
      billId: values.billId ?? null,
      billNumber: values.billNumber.trim(),
      billDate: values.billDate,
      fromId: values.fromId ?? 0,
      truckId: values.truckId ?? 0,
      driverName: values.isCancelled ? driverName || '-' : driverName,
      driverMobile1: values.driverMobile1.trim() || null,
      driverMobile2: values.driverMobile2.trim() || null,
      totalFreight: toFormNumberOrZero(values.totalFreight),
      commission: toFormNumberOrZero(values.commission),
      crossing: toFormNumberOrZero(values.crossing),
      handLoan: toFormNumberOrZero(values.handLoan),
      truckLoan: values.truckLoan,
      payBy: values.payBy,
      paidName: values.payBy === 'upi' ? values.paidName.trim() || null : null,
      paidMobile: values.payBy === 'upi' ? values.paidMobile.trim() || null : null,
      officeMamul: toFormNumberOrZero(values.officeMamul),
      tapalMamul: toFormNumberOrZero(values.tapalMamul),
      diesel: toFormNumberOrZero(values.diesel),
      others: mapOthersToSave(values.others),
      total: toFormNumberOrZero(values.total),
      isCancelled: values.isCancelled,
    },
    loads,
  };
}

export function validateBillForm(values: BillFormValues): string | null {
  if (!values.billNumber.trim()) {
    return 'Bill number is required.';
  }

  if (values.isCancelled) {
    return null;
  }

  if (!values.fromId) {
    return 'From location is required.';
  }

  if (!values.truckId) {
    return 'Truck is required.';
  }

  if (!values.driverName.trim()) {
    return 'Driver name is required.';
  }

  const savableLoads = values.loads.filter(isLoadLineSavable);
  if (savableLoads.length === 0) {
    return 'Add at least one load line with consignor, destination, goods, and unit (consignee required unless as per bill).';
  }

  if (values.payBy === 'upi') {
    if (!values.paidName.trim()) {
      return 'Paid name is required when pay by is UPI.';
    }

    if (!values.paidMobile.trim()) {
      return 'Paid mobile is required when pay by is UPI.';
    }
  }

  return null;
}
