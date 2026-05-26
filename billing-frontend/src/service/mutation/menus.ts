import { mutationOptions } from '@tanstack/react-query';
import { createMenus, deleteMenus, toggleMenus, updateMenus } from '@/service/api/functions/menus';

export const menuMutationKeys = {
  all: ['menus'] as const,
  create: () => [...menuMutationKeys.all, 'create'] as const,
  update: () => [...menuMutationKeys.all, 'update'] as const,
  delete: () => [...menuMutationKeys.all, 'delete'] as const,
  toggle: () => [...menuMutationKeys.all, 'toggle'] as const,
};

export const createMenusMutationOptions = mutationOptions({
  mutationKey: menuMutationKeys.create(),
  mutationFn: createMenus,
});

export const updateMenusMutationOptions = mutationOptions({
  mutationKey: menuMutationKeys.update(),
  mutationFn: updateMenus,
});

export const deleteMenusMutationOptions = mutationOptions({
  mutationKey: menuMutationKeys.delete(),
  mutationFn: deleteMenus,
});

export const toggleMenusMutationOptions = mutationOptions({
  mutationKey: menuMutationKeys.toggle(),
  mutationFn: toggleMenus,
});
