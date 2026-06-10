import { formatIndianVehicleNumber } from '@/components/derived/data-table/column-cells/formatters';

/** Store up to 10 local digits (strips +91 / leading 0). */
export function parseMobileStoredValue(raw: string): string {
  let digits = raw.replace(/\D/g, '');

  if (digits.startsWith('91') && digits.length > 10) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

/** Plain mobile display for inputs — digits only, no +91 prefix. */
export function formatMobileInputDisplay(stored: unknown): string {
  return parseMobileStoredValue(String(stored ?? ''));
}

/** Compact uppercase vehicle number for storage/API. */
export function parseVehicleNumberStoredValue(raw: string): string {
  return raw.replace(/[\s-]/g, '').toUpperCase();
}

export function formatVehicleNumberInputDisplay(stored: unknown): string {
  const compact = parseVehicleNumberStoredValue(String(stored ?? ''));
  if (!compact) {
    return '';
  }

  return formatIndianVehicleNumber(compact);
}

export function parseNumberFieldValue(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

export function formatNumberFieldDisplay(value: unknown): string {
  if (value == null || value === '') {
    return '';
  }

  return String(value);
}
