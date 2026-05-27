import type { MenuLoadStatus } from '@/constants/menu';
import type { NavigationMenu } from '@/types/access';

export interface MenuState {
  menus: NavigationMenu[];
  currentMenu: NavigationMenu | null;
  status: MenuLoadStatus;
  error: string | null;
}
