import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { MENU_LOAD_STATUS, type MenuLoadStatus } from '@/constants/menuLoadStatus';
import { fetchNavigationMenus } from '@/service/api/functions/access';
import { clearAuth } from '@/store/authSlice';
import { partitionNavigationMenus } from '@/lib/navigationTree';
import type { NavigationMenu } from '@/types/access';

export interface MenuState {
  menus: NavigationMenu[];
  currentMenu: NavigationMenu | null;
  status: MenuLoadStatus;
  error: string | null;
}

const initialState: MenuState = {
  menus: [],
  currentMenu: null,
  status: MENU_LOAD_STATUS.idle,
  error: null,
};

export function findMenuForPath(
  menus: NavigationMenu[],
  pathname: string,
): NavigationMenu | undefined {
  return [...menus]
    .sort((a, b) => b.routePath.length - a.routePath.length)
    .find((menu) => {
      const path = menu.routePath;
      if (path === '/') {
        return pathname === '/';
      }

      return pathname === path || pathname.startsWith(`${path}/`);
    });
}

export const fetchMenus = createAsyncThunk(
  'menu/fetchMenus',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchNavigationMenus();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load menus';
      return rejectWithValue(message);
    }
  },
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setCurrentMenuFromPath(state, action: PayloadAction<string>) {
      state.currentMenu = findMenuForPath(state.menus, action.payload) ?? null;
    },
    setCurrentMenu(state, action: PayloadAction<NavigationMenu | null>) {
      state.currentMenu = action.payload;
    },
    resetMenuState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.status = MENU_LOAD_STATUS.loading;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.status = MENU_LOAD_STATUS.succeeded;
        state.menus = action.payload.menus;
        state.currentMenu =
          findMenuForPath(action.payload.menus, window.location.pathname) ?? null;
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.status = MENU_LOAD_STATUS.failed;
        state.error = (action.payload as string) ?? action.error.message ?? 'Failed to load menus';
      })
      .addCase(clearAuth, () => initialState);
  },
});

export const { setCurrentMenuFromPath, setCurrentMenu, resetMenuState } = menuSlice.actions;
export const menuReducer = menuSlice.reducer;

const selectMenuState = (state: { menu: MenuState }) => state.menu;

export const selectMenus = createSelector(selectMenuState, (menu) => menu.menus);

export const selectCurrentMenu = createSelector(selectMenuState, (menu) => menu.currentMenu);

export const selectCurrentMenuCode = createSelector(
  selectCurrentMenu,
  (menu) => menu?.menuCode ?? null,
);

export const selectCurrentMenuTitle = createSelector(
  selectCurrentMenu,
  (_menu) => _menu?.displayName ?? 'Billing',
);

export const selectMenuLoadStatus = createSelector(selectMenuState, (menu) => menu.status);

export const selectMenusLoading = createSelector(
  selectMenuLoadStatus,
  (status) => status === MENU_LOAD_STATUS.loading || status === MENU_LOAD_STATUS.idle,
);

export const selectMenusError = createSelector(selectMenuState, (menu) => menu.error);

export const selectMenuSections = createSelector(selectMenus, (menus) =>
  partitionNavigationMenus(menus),
);
