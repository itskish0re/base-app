import { parseMobileStoredValue } from '@/components/derived/entity-form/ef-input-value';
import type { BillFormValues, BillLoadFormLine } from '@/types/billForm';
import { z } from 'zod';

export const BILL_FORM_NUMERIC_MAX_DIGITS = 8;
export const BILL_FORM_PHONE_MAX_DIGITS = 10;

export type BillFormFieldErrors = Partial<Record<string, string>>;

export type BillFormValidationResult = {
  fieldErrors: BillFormFieldErrors;
  formError: string | null;
};

const requiredMessage = (label: string) => `${label} is required.`;

function numericIntegerDigitCount(value: number): number {
  return Math.abs(Math.trunc(value)).toString().length;
}

function isNumericWithinDigitLimit(value: number | ''): boolean {
  if (value === '') {
    return true;
  }

  return numericIntegerDigitCount(value) <= BILL_FORM_NUMERIC_MAX_DIGITS;
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

function isLoadLineEmpty(line: BillLoadFormLine): boolean {
  return (
    (line.consignorId == null || line.consignorId <= 0) &&
    !line.asPerBill &&
    (line.consigneeId == null || line.consigneeId <= 0) &&
    (line.toId == null || line.toId <= 0) &&
    (line.goodsId == null || line.goodsId <= 0) &&
    (line.unitId == null || line.unitId <= 0) &&
    line.weightOrQuantity === '' &&
    line.ratePerUnit === '' &&
    line.advance === '' &&
    line.topay === ''
  );
}

const phoneFieldSchema = z.string().superRefine((value, ctx) => {
  if (!value.trim()) {
    return;
  }

  const digits = parseMobileStoredValue(value);
  if (!/^\d+$/.test(digits)) {
    ctx.addIssue({ code: 'custom', message: 'Must contain digits only.' });
    return;
  }

  if (digits.length > BILL_FORM_PHONE_MAX_DIGITS) {
    ctx.addIssue({
      code: 'custom',
      message: `Must be at most ${BILL_FORM_PHONE_MAX_DIGITS} digits.`,
    });
  }
});

const formNumericSchema = z.union([z.literal(''), z.number()]).superRefine((value, ctx) => {
  if (value === '' || isNumericWithinDigitLimit(value)) {
    return;
  }

  ctx.addIssue({
    code: 'custom',
    message: `Must be at most ${BILL_FORM_NUMERIC_MAX_DIGITS} digits.`,
  });
});

const billOtherItemSchema = z.object({
  key: z.string(),
  value: formNumericSchema,
});

const billLoadLineSchema = z.object({
  loadId: z.number().nullable().optional(),
  loadNumber: z.number(),
  consignorId: z.number().nullable(),
  consignorName: z.string(),
  consigneeId: z.number().nullable(),
  consigneeName: z.string(),
  asPerBill: z.boolean(),
  toId: z.number().nullable(),
  toLocationName: z.string(),
  goodsId: z.number().nullable(),
  goodsName: z.string(),
  unitId: z.number().nullable(),
  unitName: z.string(),
  unitIsFixed: z.boolean(),
  weightOrQuantity: formNumericSchema,
  ratePerUnit: formNumericSchema,
  freight: formNumericSchema,
  advance: formNumericSchema,
  topay: formNumericSchema,
  balance: formNumericSchema,
});

export const billFormSchema = z
  .object({
    billId: z.number().nullable().optional(),
    billNumber: z.string(),
    billDate: z.string(),
    fromId: z.number().nullable(),
    fromLocationName: z.string(),
    truckId: z.number().nullable(),
    truckNumber: z.string(),
    nameBoardName: z.string(),
    ownerName: z.string(),
    ownerMobile: z.string(),
    driverName: z.string(),
    driverMobile1: phoneFieldSchema,
    driverMobile2: phoneFieldSchema,
    totalFreight: formNumericSchema,
    commission: formNumericSchema,
    crossing: formNumericSchema,
    handLoan: formNumericSchema,
    truckLoan: z.boolean(),
    payBy: z.enum(['upi', 'cash', 'owner']).nullable(),
    paidName: z.string(),
    paidMobile: phoneFieldSchema,
    officeMamul: formNumericSchema,
    tapalMamul: formNumericSchema,
    diesel: formNumericSchema,
    others: z.array(billOtherItemSchema),
    total: formNumericSchema,
    isCancelled: z.boolean(),
    loads: z.array(billLoadLineSchema),
  })
  .superRefine((values, ctx) => {
    if (!values.billNumber.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['billNumber'],
        message: requiredMessage('Bill number'),
      });
    }

    if (!values.billDate.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['billDate'],
        message: requiredMessage('Date'),
      });
    }

    if (values.isCancelled) {
      return;
    }

    if (!values.fromId || values.fromId <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['fromId'],
        message: requiredMessage('Origin / Branch'),
      });
    }

    if (!values.truckId || values.truckId <= 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['truckId'],
        message: requiredMessage('Truck No.'),
      });
    }

    if (!values.driverName.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['driverName'],
        message: requiredMessage('Driver name'),
      });
    }

    const driverMobile1Digits = parseMobileStoredValue(values.driverMobile1);
    if (!driverMobile1Digits) {
      ctx.addIssue({
        code: 'custom',
        path: ['driverMobile1'],
        message: requiredMessage('Driver mobile 1'),
      });
    } else if (driverMobile1Digits.length !== BILL_FORM_PHONE_MAX_DIGITS) {
      ctx.addIssue({
        code: 'custom',
        path: ['driverMobile1'],
        message: `Driver mobile 1 must be ${BILL_FORM_PHONE_MAX_DIGITS} digits.`,
      });
    }

    const savableLoads = values.loads.filter(isLoadLineSavable);
    const linesToValidate =
      savableLoads.length > 0
        ? values.loads.filter((line, index) => !isLoadLineEmpty(line) || index === 0)
        : values.loads.length > 0
          ? [values.loads[0]]
          : [];

    if (savableLoads.length === 0) {
      for (const line of linesToValidate) {
        const index = values.loads.indexOf(line);
        if (index < 0) {
          continue;
        }

        if (!line.consignorId || line.consignorId <= 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, 'consignorId'],
            message: requiredMessage('Consignor'),
          });
        }

        if (!line.asPerBill && (!line.consigneeId || line.consigneeId <= 0)) {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, 'consigneeId'],
            message: requiredMessage('Consignee'),
          });
        }

        if (!line.toId || line.toId <= 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, 'toId'],
            message: requiredMessage('Destination'),
          });
        }

        if (!line.goodsId || line.goodsId <= 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, 'goodsId'],
            message: requiredMessage('Goods description'),
          });
        }

        if (!line.unitId || line.unitId <= 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, 'unitId'],
            message: requiredMessage('Unit'),
          });
        }

        if (line.weightOrQuantity === '') {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, 'weightOrQuantity'],
            message: requiredMessage('Weight / Qty'),
          });
        }

        if (line.ratePerUnit === '') {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, 'ratePerUnit'],
            message: requiredMessage('Rate'),
          });
        }
      }
    }

    if (savableLoads.length > 0) {
      for (const line of savableLoads) {
        const index = values.loads.indexOf(line);
        if (index < 0) {
          continue;
        }

        if (line.weightOrQuantity === '') {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, 'weightOrQuantity'],
            message: requiredMessage('Weight / Qty'),
          });
        }

        if (line.ratePerUnit === '') {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, 'ratePerUnit'],
            message: requiredMessage('Rate'),
          });
        }
      }
    }

    if (values.payBy === 'upi') {
      if (!values.paidName.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['paidName'],
          message: requiredMessage('Paid name'),
        });
      }

      const paidDigits = parseMobileStoredValue(values.paidMobile);
      if (!paidDigits) {
        ctx.addIssue({
          code: 'custom',
          path: ['paidMobile'],
          message: requiredMessage('Paid mobile'),
        });
      } else if (paidDigits.length !== BILL_FORM_PHONE_MAX_DIGITS) {
        ctx.addIssue({
          code: 'custom',
          path: ['paidMobile'],
          message: `Paid mobile must be ${BILL_FORM_PHONE_MAX_DIGITS} digits.`,
        });
      }
    }

    for (const [index, line] of values.loads.entries()) {
      for (const field of ['weightOrQuantity', 'ratePerUnit', 'advance', 'topay'] as const) {
        const numericValue = line[field];
        if (numericValue !== '' && !isNumericWithinDigitLimit(numericValue)) {
          ctx.addIssue({
            code: 'custom',
            path: ['loads', index, field],
            message: `Must be at most ${BILL_FORM_NUMERIC_MAX_DIGITS} digits.`,
          });
        }
      }
    }

    for (const [index, item] of values.others.entries()) {
      if (item.value !== '' && !isNumericWithinDigitLimit(item.value)) {
        ctx.addIssue({
          code: 'custom',
          path: ['others', index, 'value'],
          message: `Must be at most ${BILL_FORM_NUMERIC_MAX_DIGITS} digits.`,
        });
      }
    }

    for (const field of ['crossing', 'officeMamul', 'tapalMamul', 'diesel', 'handLoan'] as const) {
      const numericValue = values[field];
      if (numericValue !== '' && !isNumericWithinDigitLimit(numericValue)) {
        ctx.addIssue({
          code: 'custom',
          path: [field],
          message: `Must be at most ${BILL_FORM_NUMERIC_MAX_DIGITS} digits.`,
        });
      }
    }
  });

function issuePathToFieldKey(path: PropertyKey[]): string {
  return path.map(String).join('.');
}

export function billFormFieldError(
  fieldErrors: BillFormFieldErrors | undefined,
  path: string,
): string | undefined {
  return fieldErrors?.[path];
}

export function validateBillFormFields(values: BillFormValues): BillFormValidationResult {
  const result = billFormSchema.safeParse(values);
  if (result.success) {
    return { fieldErrors: {}, formError: null };
  }

  const fieldErrors: BillFormFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issuePathToFieldKey(issue.path);
    if (!key || fieldErrors[key]) {
      continue;
    }

    fieldErrors[key] = issue.message;
  }

  const formError = result.error.issues[0]?.message ?? 'Please fix the highlighted fields.';

  return { fieldErrors, formError };
}

export function validateBillFormNumericValue(value: number | ''): string | undefined {
  if (value === '' || isNumericWithinDigitLimit(value)) {
    return undefined;
  }

  return `Must be at most ${BILL_FORM_NUMERIC_MAX_DIGITS} digits.`;
}

export function validateBillFormPhoneValue(value: string, required = false): string | undefined {
  const digits = parseMobileStoredValue(value);
  if (!digits) {
    return required ? requiredMessage('Mobile') : undefined;
  }

  if (!/^\d+$/.test(digits)) {
    return 'Must contain digits only.';
  }

  if (digits.length > BILL_FORM_PHONE_MAX_DIGITS) {
    return `Must be at most ${BILL_FORM_PHONE_MAX_DIGITS} digits.`;
  }

  if (required && digits.length !== BILL_FORM_PHONE_MAX_DIGITS) {
    return `Mobile must be ${BILL_FORM_PHONE_MAX_DIGITS} digits.`;
  }

  return undefined;
}

export function isBillLoadLineSavable(line: BillLoadFormLine): boolean {
  return isLoadLineSavable(line);
}
