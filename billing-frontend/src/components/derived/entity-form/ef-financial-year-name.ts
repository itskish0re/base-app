/** Build display name from a financial year code (starting year). */
export function formatFinancialYearName(code: string | number | null | undefined): string {
  if (code == null || code === '') {
    return '';
  }

  const year = typeof code === 'number' ? code : Number.parseInt(String(code).trim(), 10);
  if (Number.isNaN(year)) {
    return '';
  }

  return `FY ${year}-${year + 1}`;
}

/** Year options for the picker (current year ± 20). */
export function buildFinancialYearOptions(anchorYear = new Date().getFullYear()): number[] {
  const years: number[] = [];
  for (let year = anchorYear - 20; year <= anchorYear + 20; year += 1) {
    years.push(year);
  }
  return years;
}
