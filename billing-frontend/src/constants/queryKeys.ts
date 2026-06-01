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
  locations: {
    all: ['locations'] as const,
    list: (params?: ListQueryParams) => [...queryKeys.locations.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.locations.all, 'detail', id] as const,
    lookup: (valueColumn: string, labelColumn: string) =>
      [...queryKeys.locations.all, 'lookup', valueColumn, labelColumn] as const,
  },
  parties: {
    all: ['parties'] as const,
    list: (params?: ListQueryParams) => [...queryKeys.parties.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.parties.all, 'detail', id] as const,
    lookup: (valueColumn: string, labelColumn: string) =>
      [...queryKeys.parties.all, 'lookup', valueColumn, labelColumn] as const,
  },
  goods: {
    all: ['goods'] as const,
    list: (params?: ListQueryParams) => [...queryKeys.goods.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.goods.all, 'detail', id] as const,
    lookup: (valueColumn: string, labelColumn: string) =>
      [...queryKeys.goods.all, 'lookup', valueColumn, labelColumn] as const,
  },
  units: {
    all: ['units'] as const,
    list: (params?: ListQueryParams) => [...queryKeys.units.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.units.all, 'detail', id] as const,
    lookup: (valueColumn: string, labelColumn: string) =>
      [...queryKeys.units.all, 'lookup', valueColumn, labelColumn] as const,
  },
  financialYears: {
    all: ['financial-years'] as const,
    list: (params?: ListQueryParams) => [...queryKeys.financialYears.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.financialYears.all, 'detail', id] as const,
    lookup: (valueColumn: string, labelColumn: string) =>
      [...queryKeys.financialYears.all, 'lookup', valueColumn, labelColumn] as const,
  },
  menus: {
    all: ['menus'] as const,
    list: (params?: ListMenusParams) => [...queryKeys.menus.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.menus.all, 'detail', id] as const,
  },
  bills: {
    all: ['bills'] as const,
    list: (params?: ListQueryParams) => [...queryKeys.bills.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.bills.all, 'detail', id] as const,
  },
  loads: {
    all: ['loads'] as const,
    list: (params?: ListQueryParams) => [...queryKeys.loads.all, 'list', params] as const,
  },
} as const;
