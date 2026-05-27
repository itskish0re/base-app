import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import {
  createScreenMetadataReducers,
} from '@/store/screens/screenMetadataReducers';
import type { NameBoardsScreenState } from '@/types/store/screens/nameBoards';
import { createInitialScreenMetadataState } from '@/types/store/screen';

const initialState: NameBoardsScreenState = {
  filter: '',
  page: 1,
  pageSize: 20,
  selectedId: null,
  metadata: createInitialScreenMetadataState(),
};

const nameBoardsSlice = createSlice({
  name: SCREEN_KEYS.nameBoard,
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
    ...createScreenMetadataReducers(),
  },
});

export const nameBoardsScreenActions = nameBoardsSlice.actions;
export const nameBoardsScreenReducer = nameBoardsSlice.reducer;
