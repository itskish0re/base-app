import { mutationOptions } from '@tanstack/react-query';
import {
  createDrivers,
  deleteDrivers,
  toggleDrivers,
  updateDrivers,
} from '@/service/api/functions/drivers';

export const driverMutationKeys = {
  all: ['drivers'] as const,
  create: () => [...driverMutationKeys.all, 'create'] as const,
  update: () => [...driverMutationKeys.all, 'update'] as const,
  delete: () => [...driverMutationKeys.all, 'delete'] as const,
  toggle: () => [...driverMutationKeys.all, 'toggle'] as const,
};

export const createDriversMutationOptions = mutationOptions({
  mutationKey: driverMutationKeys.create(),
  mutationFn: createDrivers,
});

export const updateDriversMutationOptions = mutationOptions({
  mutationKey: driverMutationKeys.update(),
  mutationFn: updateDrivers,
});

export const deleteDriversMutationOptions = mutationOptions({
  mutationKey: driverMutationKeys.delete(),
  mutationFn: deleteDrivers,
});

export const toggleDriversMutationOptions = mutationOptions({
  mutationKey: driverMutationKeys.toggle(),
  mutationFn: toggleDrivers,
});
