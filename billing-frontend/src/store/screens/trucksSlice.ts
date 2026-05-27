import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { TrucksScreenState } from '@/types/store/screens/trucks';

const initialState: TrucksScreenState = {
  filter: '',
  page: 1,
  selectedId: null,
};

const trucksSlice = createSlice({
  name: SCREEN_KEYS.trucks,
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

export const trucksScreenActions = trucksSlice.actions;
export const trucksScreenReducer = trucksSlice.reducer;
