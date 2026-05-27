import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DriversScreenState } from '@/types/store/screens/drivers';

const initialState: DriversScreenState = {
  filter: '',
  page: 1,
  selectedId: null,
};

const driversSlice = createSlice({
  name: SCREEN_KEYS.drivers,
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSelectedId(state, action: PayloadAction<number | null>) {
      state.selectedId = action.payload;
    },
    resetScreenState: () => initialState,
  },
});

export const driversScreenActions = driversSlice.actions;
export const driversScreenReducer = driversSlice.reducer;
