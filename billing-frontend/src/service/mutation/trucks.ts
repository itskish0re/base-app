import { mutationOptions } from '@tanstack/react-query';
import { createTrucks, deleteTrucks, toggleTrucks, updateTrucks } from '@/service/api/functions/trucks';

export const truckMutationKeys = {
  all: ['trucks'] as const,
  create: () => [...truckMutationKeys.all, 'create'] as const,
  update: () => [...truckMutationKeys.all, 'update'] as const,
  delete: () => [...truckMutationKeys.all, 'delete'] as const,
  toggle: () => [...truckMutationKeys.all, 'toggle'] as const,
};

export const createTrucksMutationOptions = mutationOptions({
  mutationKey: truckMutationKeys.create(),
  mutationFn: createTrucks,
});

export const updateTrucksMutationOptions = mutationOptions({
  mutationKey: truckMutationKeys.update(),
  mutationFn: updateTrucks,
});

export const deleteTrucksMutationOptions = mutationOptions({
  mutationKey: truckMutationKeys.delete(),
  mutationFn: deleteTrucks,
});

export const toggleTrucksMutationOptions = mutationOptions({
  mutationKey: truckMutationKeys.toggle(),
  mutationFn: toggleTrucks,
});
