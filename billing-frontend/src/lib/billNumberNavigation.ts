/** Mirrors backend BillNumberSuggestion for stepper navigation. */
export function incrementBillNumber(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return '1';
  }

  if (/^\d+$/.test(trimmed)) {
    return String(Number.parseInt(trimmed, 10) + 1);
  }

  let suffixStart = trimmed.length;
  while (suffixStart > 0 && /\d/.test(trimmed[suffixStart - 1] ?? '')) {
    suffixStart -= 1;
  }

  if (suffixStart < trimmed.length) {
    const prefix = trimmed.slice(0, suffixStart);
    const trailing = Number.parseInt(trimmed.slice(suffixStart), 10);
    if (!Number.isNaN(trailing)) {
      return `${prefix}${trailing + 1}`;
    }
  }

  return `${trimmed}1`;
}

export function decrementBillNumber(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    const numeric = Number.parseInt(trimmed, 10);
    if (Number.isNaN(numeric) || numeric <= 1) {
      return null;
    }

    return String(numeric - 1);
  }

  let suffixStart = trimmed.length;
  while (suffixStart > 0 && /\d/.test(trimmed[suffixStart - 1] ?? '')) {
    suffixStart -= 1;
  }

  if (suffixStart < trimmed.length) {
    const prefix = trimmed.slice(0, suffixStart);
    const trailing = Number.parseInt(trimmed.slice(suffixStart), 10);
    if (!Number.isNaN(trailing)) {
      if (trailing <= 1) {
        return prefix || null;
      }

      return `${prefix}${trailing - 1}`;
    }
  }

  return null;
}

export function compareBillNumbers(left: string, right: string): number {
  const a = left.trim();
  const b = right.trim();

  if (a === b) {
    return 0;
  }

  if (/^\d+$/.test(a) && /^\d+$/.test(b)) {
    return Number.parseInt(a, 10) - Number.parseInt(b, 10);
  }

  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

export function isBillNumberWithinRange(
  value: string,
  minBillNumber: string,
  maxBillNumber: string,
): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  return compareBillNumbers(trimmed, minBillNumber) >= 0 && compareBillNumbers(trimmed, maxBillNumber) <= 0;
}

export const BILL_NUMBER_MIN = '1';
