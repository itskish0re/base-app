import {
  createParties,
  deleteParties,
  toggleParties,
  updateParties,
} from '@/service/api/functions/parties';
import type {
  BatchCreatePartiesRequest,
  BatchDeletePartiesRequest,
  BatchTogglePartiesRequest,
  BatchUpdatePartiesRequest,
} from '@/types/entity';

export const createPartiesMutationOptions = {
  mutationFn: (body: BatchCreatePartiesRequest) => createParties(body),
};

export const updatePartiesMutationOptions = {
  mutationFn: (body: BatchUpdatePartiesRequest) => updateParties(body),
};

export const deletePartiesMutationOptions = {
  mutationFn: (body: BatchDeletePartiesRequest) => deleteParties(body),
};

export const togglePartiesMutationOptions = {
  mutationFn: (body: BatchTogglePartiesRequest) => toggleParties(body),
};
