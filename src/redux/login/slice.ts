import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUserServer, resetPasswordServer, User, AuthResponse } from './fetch';

export type UserRole = 'admin' | 'monitor' | 'user';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  resetPasswordLoading: boolean;
  resetPasswordSuccess: boolean;
  resetPasswordError: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  resetPasswordLoading: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearResetPasswordState: (state) => {
      state.resetPasswordLoading = false;
      state.resetPasswordSuccess = false;
      state.resetPasswordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserServer.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;        
        state.token = action.payload.token;
      })
      .addCase(loginUserServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Falha no login';
      })
      .addCase(resetPasswordServer.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordError = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetPasswordServer.fulfilled, (state) => {
        state.resetPasswordLoading = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPasswordServer.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.error.message ?? 'Falha ao enviar email de recuperação';
      });
  },
});

export const { logout, clearResetPasswordState } = authSlice.actions;
export default authSlice.reducer;
