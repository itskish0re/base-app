export type FinancialYearOption = {
  financialYearId: number;
  code: string;
  name: string;
};

export type FinancialYearContextLoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type FinancialYearContextState = {
  status: FinancialYearContextLoadStatus;
  options: FinancialYearOption[];
  selectedFinancialYearId: number | null;
  selectedCode: string | null;
  selectedName: string | null;
  error: string | null;
};

export const FINANCIAL_YEAR_CONTEXT_LOAD_STATUS = {
  idle: 'idle',
  loading: 'loading',
  succeeded: 'succeeded',
  failed: 'failed',
} as const satisfies Record<string, FinancialYearContextLoadStatus>;

export function createInitialFinancialYearContextState(): FinancialYearContextState {
  return {
    status: FINANCIAL_YEAR_CONTEXT_LOAD_STATUS.idle,
    options: [],
    selectedFinancialYearId: null,
    selectedCode: null,
    selectedName: null,
    error: null,
  };
}
