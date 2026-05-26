import { createSlice } from '@reduxjs/toolkit';
import { SCREEN_KEYS } from '@/store/screenKeys';

/** Extend when dashboard widgets need client state. */
export type DashboardScreenState = Record<string, never>;

const initialState: DashboardScreenState = {};

const dashboardSlice = createSlice({
  name: SCREEN_KEYS.dashboard,
  initialState,
  reducers: {
    resetScreenState: () => initialState,
  },
});

export const dashboardScreenActions = dashboardSlice.actions;
export const dashboardScreenReducer = dashboardSlice.reducer;
