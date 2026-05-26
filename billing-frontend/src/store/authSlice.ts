import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  clearTokens,
  loadAccessExpiresAt,
  loadAccessToken,
  loadRefreshToken,
  saveTokens,
} from '@/lib/storage';
import type { AuthTokens } from '@/types/auth';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: loadAccessToken(),
  refreshToken: loadRefreshToken(),
  accessTokenExpiresAt: loadAccessExpiresAt(),
  isAuthenticated: Boolean(loadAccessToken() && loadRefreshToken()),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<AuthTokens>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
      state.isAuthenticated = true;
      saveTokens(
        action.payload.accessToken,
        action.payload.refreshToken,
        action.payload.accessTokenExpiresAt,
      );
    },
    clearAuth(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.accessTokenExpiresAt = null;
      state.isAuthenticated = false;
      clearTokens();
    },
  },
});

export const { setTokens, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
