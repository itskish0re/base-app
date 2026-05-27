import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { NameBoardsScreenState } from '@/types/store/screens/nameBoards';

const initialState: NameBoardsScreenState = {
  filter: '',
  page: 1,
  pageSize: 20,
  selectedId: null,
};

const nameBoardsSlice = createSlice({
  name: SCREEN_KEYS.nameBoards,
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<string>) {
      state.filter = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
      state.page = 1;
    },
    setSelectedId(state, action: PayloadAction<number | null>) {
      state.selectedId = action.payload;
    },
    resetScreenState: () => initialState,
  },
});

export const nameBoardsScreenActions = nameBoardsSlice.actions;
export const nameBoardsScreenReducer = nameBoardsSlice.reducer;
