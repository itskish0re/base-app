import type {
  AuthState,
  BillFormDraftState,
  MenuState,
  FinancialYearContextState,
} from '@/types/store/global';
import type { ScreenCacheState } from '@/types/store/screenCache';
import type { ScreenStateByKey } from '@/types/store/screens';

/** Auth, menu, and screen cache are always mounted; per-route slices mount with their page. */
export type RootState = {
  auth: AuthState;
  menu: MenuState;
  screenCache: ScreenCacheState;
  financialYearContext: FinancialYearContextState;
  billFormDraft: BillFormDraftState;
} & Partial<ScreenStateByKey>;
