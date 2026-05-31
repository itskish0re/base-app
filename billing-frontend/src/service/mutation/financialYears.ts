import {
  createFinancialYears,
  deleteFinancialYears,
  toggleFinancialYears,
  updateFinancialYears,
} from '@/service/api/functions/financialYears';
import type {
  BatchCreateFinancialYearsRequest,
  BatchDeleteFinancialYearsRequest,
  BatchToggleFinancialYearsRequest,
  BatchUpdateFinancialYearsRequest,
} from '@/types/entity';

export const createFinancialYearsMutationOptions = {
  mutationFn: (body: BatchCreateFinancialYearsRequest) => createFinancialYears(body),
};

export const updateFinancialYearsMutationOptions = {
  mutationFn: (body: BatchUpdateFinancialYearsRequest) => updateFinancialYears(body),
};

export const deleteFinancialYearsMutationOptions = {
  mutationFn: (body: BatchDeleteFinancialYearsRequest) => deleteFinancialYears(body),
};

export const toggleFinancialYearsMutationOptions = {
  mutationFn: (body: BatchToggleFinancialYearsRequest) => toggleFinancialYears(body),
};
