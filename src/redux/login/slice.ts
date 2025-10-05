import { createSlice } from '@reduxjs/toolkit';
import * as actions from './actions';
import { fetchLogin, fetchResetPassword, type User } from './fetch';

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
    logout: (state) => actions.logoutAction(state),
    clearResetPasswordState: (state) => actions.clearResetPasswordStateAction(state),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => actions.loginPendingAction(state))
      .addCase(fetchLogin.fulfilled, (state, action) => actions.loginFulfilledAction(state, action.payload))
      .addCase(fetchLogin.rejected, (state, action) => actions.loginRejectedAction(state, action.payload))
      .addCase(fetchResetPassword.pending, (state) => actions.resetPasswordPendingAction(state))
      .addCase(fetchResetPassword.fulfilled, (state) => actions.resetPasswordFulfilledAction(state))
      .addCase(fetchResetPassword.rejected, (state, action) => actions.resetPasswordRejectedAction(state, action.payload));
  },
});

export const { logout, clearResetPasswordState } = authSlice.actions;

export default authSlice.reducer;
