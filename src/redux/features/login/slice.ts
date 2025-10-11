import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUserServer, resetPasswordServer, updatePasswordServer, User, AuthResponse } from './fetch';

export type UserRole = 'admin' | 'monitor' | 'user';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  resetPasswordLoading: boolean;
  resetPasswordSuccess: boolean;
  resetPasswordError: string | null;
  updatePasswordLoading: boolean;
  updatePasswordSuccess: boolean;
  updatePasswordError: string | null;
}

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

console.log('Loading from localStorage - user:', savedUser);
console.log('Loading from localStorage - token:', savedToken);

const initialState: AuthState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
  loading: false,
  error: null,
  resetPasswordLoading: false,
  resetPasswordSuccess: false,
  resetPasswordError: null,
  updatePasswordLoading: false,
  updatePasswordSuccess: false,
  updatePasswordError: null,
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
      localStorage.removeItem('user');
    },
    clearResetPasswordState: (state) => {
      state.resetPasswordLoading = false;
      state.resetPasswordSuccess = false;
      state.resetPasswordError = null;
    },
    clearUpdatePasswordState: (state) => {
      state.updatePasswordLoading = false;
      state.updatePasswordSuccess = false;
      state.updatePasswordError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserServer.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        console.log('Login successful - user:', action.payload.user);
        console.log('Login successful - token:', action.payload.token);
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;        
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        console.log('Saved to localStorage - user:', JSON.stringify(action.payload.user));
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
      })
      .addCase(updatePasswordServer.pending, (state) => {
        state.updatePasswordLoading = true;
        state.updatePasswordError = null;
        state.updatePasswordSuccess = false;
      })
      .addCase(updatePasswordServer.fulfilled, (state) => {
        state.updatePasswordLoading = false;
        state.updatePasswordSuccess = true;
      })
      .addCase(updatePasswordServer.rejected, (state, action) => {
        state.updatePasswordLoading = false;
        state.updatePasswordError = action.error.message ?? 'Falha ao redefinir senha';
      });
  },
});

export const { logout, clearResetPasswordState, clearUpdatePasswordState } = authSlice.actions;
export default authSlice.reducer;
