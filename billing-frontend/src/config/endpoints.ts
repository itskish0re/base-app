import { API_CONTROLLERS, type ApiController } from '@/constants/apiControllers';

const API_PREFIX = '/api';

/** Build `/api/{controller}/...segments`. */
export function buildApiPath(controller: ApiController | string, ...segments: string[]): string {
  const parts = [API_PREFIX, controller, ...segments].filter((part) => part.length > 0);
  return parts.join('/');
}

export const endpoints = {
  auth: {
    login: () => buildApiPath(API_CONTROLLERS.auth, 'login'),
    refresh: () => buildApiPath(API_CONTROLLERS.auth, 'refresh'),
    revoke: () => buildApiPath(API_CONTROLLERS.auth, 'revoke'),
  },
  access: {
    navigation: () => buildApiPath(API_CONTROLLERS.access, 'navigation'),
  },
  nameBoards: {
    list: () => buildApiPath(API_CONTROLLERS.nameBoards),
    byId: (id: number) => buildApiPath(API_CONTROLLERS.nameBoards, String(id)),
    lookup: () => buildApiPath(API_CONTROLLERS.nameBoards, 'lookup'),
    create: () => buildApiPath(API_CONTROLLERS.nameBoards, 'create'),
    update: () => buildApiPath(API_CONTROLLERS.nameBoards, 'update'),
    delete: () => buildApiPath(API_CONTROLLERS.nameBoards, 'delete'),
    toggle: () => buildApiPath(API_CONTROLLERS.nameBoards, 'toggle'),
  },
  trucks: {
    list: () => buildApiPath(API_CONTROLLERS.trucks),
    byId: (id: number) => buildApiPath(API_CONTROLLERS.trucks, String(id)),
    lookup: () => buildApiPath(API_CONTROLLERS.trucks, 'lookup'),
    create: () => buildApiPath(API_CONTROLLERS.trucks, 'create'),
    update: () => buildApiPath(API_CONTROLLERS.trucks, 'update'),
    delete: () => buildApiPath(API_CONTROLLERS.trucks, 'delete'),
    toggle: () => buildApiPath(API_CONTROLLERS.trucks, 'toggle'),
  },
  menus: {
    list: () => buildApiPath(API_CONTROLLERS.menus),
    byId: (id: number) => buildApiPath(API_CONTROLLERS.menus, String(id)),
    create: () => buildApiPath(API_CONTROLLERS.menus, 'create'),
    update: () => buildApiPath(API_CONTROLLERS.menus, 'update'),
    delete: () => buildApiPath(API_CONTROLLERS.menus, 'delete'),
    toggle: () => buildApiPath(API_CONTROLLERS.menus, 'toggle'),
  },
  screens: {
    byMenu: (menuCode: string) => buildApiPath(API_CONTROLLERS.screens, 'by-menu', menuCode),
  },
  health: {
    check: () => buildApiPath(API_CONTROLLERS.health),
  },
} as const;
