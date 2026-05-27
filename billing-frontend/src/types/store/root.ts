import type { AuthState, MenuState } from '@/types/store/global';
import type { ScreenStateByKey } from '@/types/store/screens';

/** Auth and menu are always mounted; screen slices exist only while their page is mounted. */
export type RootState = {
  auth: AuthState;
  menu: MenuState;
} & Partial<ScreenStateByKey>;
