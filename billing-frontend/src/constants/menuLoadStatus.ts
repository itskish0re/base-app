export const MENU_LOAD_STATUS = {
  idle: 'idle',
  loading: 'loading',
  succeeded: 'succeeded',
  failed: 'failed',
} as const;

export type MenuLoadStatus = (typeof MENU_LOAD_STATUS)[keyof typeof MENU_LOAD_STATUS];
