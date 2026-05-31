import {
  createUnits,
  deleteUnits,
  toggleUnits,
  updateUnits,
} from '@/service/api/functions/units';
import type {
  BatchCreateUnitsRequest,
  BatchDeleteUnitsRequest,
  BatchToggleUnitsRequest,
  BatchUpdateUnitsRequest,
} from '@/types/entity';

export const createUnitsMutationOptions = {
  mutationFn: (body: BatchCreateUnitsRequest) => createUnits(body),
};

export const updateUnitsMutationOptions = {
  mutationFn: (body: BatchUpdateUnitsRequest) => updateUnits(body),
};

export const deleteUnitsMutationOptions = {
  mutationFn: (body: BatchDeleteUnitsRequest) => deleteUnits(body),
};

export const toggleUnitsMutationOptions = {
  mutationFn: (body: BatchToggleUnitsRequest) => toggleUnits(body),
};
