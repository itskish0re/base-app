import type { ListQueryParams } from '@/types/common';
import type { ListMenusParams } from '@/types/entity';

export const queryKeys = {
  access: {
    all: ['access'] as const,
    navigation: () => [...queryKeys.access.all, 'navigation'] as const,
  },
  screens: {
    all: ['screens'] as const,
    byMenu: (menuCode: string) => [...queryKeys.screens.all, 'by-menu', menuCode] as const,
  },
  nameBoards: {
    all: ['name-boards'] as const,
    list: (params?: ListQueryParams) => [...queryKeys.nameBoards.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.nameBoards.all, 'detail', id] as const,
    lookup: (valueColumn: string, labelColumn: string) =>
      [...queryKeys.nameBoards.all, 'lookup', valueColumn, labelColumn] as const,
  },
  trucks: {
    all: ['trucks'] as const,
    list: (params?: ListQueryParams) => [...queryKeys.trucks.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.trucks.all, 'detail', id] as const,
    lookup: (valueColumn: string, labelColumn: string) =>
      [...queryKeys.trucks.all, 'lookup', valueColumn, labelColumn] as const,
  },
  menus: {
    all: ['menus'] as const,
    list: (params?: ListMenusParams) => [...queryKeys.menus.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.menus.all, 'detail', id] as const,
  },
} as const;
