import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import { createScreenMetadataReducers } from '@/store/screens/screenMetadataReducers';
import type { TrucksScreenState } from '@/types/store/screens/trucks';
import { createInitialScreenMetadataState } from '@/types/store/screen';

const initialState: TrucksScreenState = {
  filter: '',
  page: 1,
  selectedId: null,
  metadata: createInitialScreenMetadataState(),
};

const trucksSlice = createSlice({
  name: SCREEN_KEYS.truck,
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
    ...createScreenMetadataReducers(),
  },
});

export const trucksScreenActions = trucksSlice.actions;
export const trucksScreenReducer = trucksSlice.reducer;
