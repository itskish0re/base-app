import { mutationOptions } from '@tanstack/react-query';
import {
  createNameBoards,
  deleteNameBoards,
  toggleNameBoards,
  updateNameBoards,
} from '@/service/api/functions/nameBoards';

export const nameBoardMutationKeys = {
  all: ['name-boards'] as const,
  create: () => [...nameBoardMutationKeys.all, 'create'] as const,
  update: () => [...nameBoardMutationKeys.all, 'update'] as const,
  delete: () => [...nameBoardMutationKeys.all, 'delete'] as const,
  toggle: () => [...nameBoardMutationKeys.all, 'toggle'] as const,
};

export const createNameBoardsMutationOptions = mutationOptions({
  mutationKey: nameBoardMutationKeys.create(),
  mutationFn: createNameBoards,
});

export const updateNameBoardsMutationOptions = mutationOptions({
  mutationKey: nameBoardMutationKeys.update(),
  mutationFn: updateNameBoards,
});

export const deleteNameBoardsMutationOptions = mutationOptions({
  mutationKey: nameBoardMutationKeys.delete(),
  mutationFn: deleteNameBoards,
});

export const toggleNameBoardsMutationOptions = mutationOptions({
  mutationKey: nameBoardMutationKeys.toggle(),
  mutationFn: toggleNameBoards,
});
