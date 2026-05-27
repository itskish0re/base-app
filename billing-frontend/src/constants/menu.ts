/** Sidebar section keys (match `app_menu.menu_group`). */
export const MENU_GROUPS = {
  main: 'main',
  secondary: 'secondary',
  config: 'config',
} as const;

export type MenuGroup = (typeof MENU_GROUPS)[keyof typeof MENU_GROUPS];

export const MENU_GROUP_ORDER: readonly MenuGroup[] = [
  MENU_GROUPS.main,
  MENU_GROUPS.secondary,
  MENU_GROUPS.config,
];

export const MENU_LOAD_STATUS = {
  idle: 'idle',
  loading: 'loading',
  succeeded: 'succeeded',
  failed: 'failed',
} as const;

export type MenuLoadStatus = (typeof MENU_LOAD_STATUS)[keyof typeof MENU_LOAD_STATUS];
