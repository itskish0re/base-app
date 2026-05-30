export function formatDataTableDisplayValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

/** Indian mobile: +91 XXX XXX XXXX (10-digit local). */
export function formatIndianMobile(value: unknown): string {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  let local = digits;
  if (local.startsWith('91') && local.length > 10) {
    local = local.slice(2);
  } else if (local.startsWith('0') && local.length === 11) {
    local = local.slice(1);
  }

  if (local.length <= 10) {
    const a = local.slice(0, 3);
    const b = local.slice(3, 6);
    const c = local.slice(6, 10);
    const parts = [a, b, c].filter((part) => part.length > 0);
    return parts.length > 0 ? `+91 ${parts.join(' ')}` : '';
  }

  return `+91 ${local}`;
}

/** Indian vehicle registration stored compact; displayed as first 4, middle, last 4. */
export function formatIndianVehicleNumber(value: unknown): string {
  const raw = String(value ?? '')
    .replace(/[\s-]/g, '')
    .toUpperCase();

  if (!raw) {
    return '';
  }

  if (raw.length >= 8) {
    const first = raw.slice(0, 4);
    const last = raw.slice(-4);
    const middle = raw.slice(4, -4);

    if (middle) {
      return `${first} ${middle} ${last}`;
    }

    return `${first} ${last}`;
  }

  return raw;
}

export function formatCodeBadgeLabel(value: unknown): string {
  return formatDataTableDisplayValue(value).trim().toUpperCase();
}

export function formatInrCurrency(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const amount = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''));
  if (Number.isNaN(amount)) {
    return formatDataTableDisplayValue(value);
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDataTableDate(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return formatDataTableDisplayValue(value);
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
