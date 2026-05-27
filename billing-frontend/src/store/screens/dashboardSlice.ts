import { createSlice } from '@reduxjs/toolkit';
import { SCREEN_KEYS } from '@/constants/screenKeys';
import type { DashboardScreenState } from '@/types/store/screens/dashboard';

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
