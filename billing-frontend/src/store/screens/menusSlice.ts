import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { MenusScreenState } from '@/types/store/screens/menus';

const initialState: MenusScreenState = {
  filter: '',
  selectedMenuId: null,
};

const menusSlice = createSlice({
  name: SCREEN_KEYS.menus,
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
    setSelectedMenuId(state, action: PayloadAction<number | null>) {
      state.selectedMenuId = action.payload;
    },
    resetScreenState: () => initialState,
  },
});

export const menusScreenActions = menusSlice.actions;
export const menusScreenReducer = menusSlice.reducer;
