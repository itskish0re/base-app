import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  createInitialDataTableState,
  type DataTableState,
} from '@/components/derived/data-table';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { NameBoardsScreenState } from '@/types/store/screens/nameBoards';

const initialState: NameBoardsScreenState = {
  table: createInitialDataTableState(),
};

const nameBoardsSlice = createSlice({
  name: SCREEN_KEYS.nameBoard,
  initialState,
  reducers: {
    setTable(state, action: PayloadAction<DataTableState>) {
      state.table = action.payload;
    },
    resetScreenState: () => initialState,
  },
});

export const nameBoardsScreenActions = nameBoardsSlice.actions;
export const nameBoardsScreenReducer = nameBoardsSlice.reducer;
