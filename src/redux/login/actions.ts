import type { User, AuthResponse } from './fetch';

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

export const logoutAction = (state: AuthState) => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.loading = false;
  state.error = null;
  localStorage.removeItem('token');
};

export const clearResetPasswordStateAction = (state: AuthState) => {
  state.resetPasswordLoading = false;
  state.resetPasswordSuccess = false;
  state.resetPasswordError = null;
};

export const loginPendingAction = (state: AuthState) => {
  state.loading = true;
  state.error = null;
};

export const loginFulfilledAction = (state: AuthState, payload: AuthResponse) => {
  state.loading = false;
  state.isAuthenticated = true;
  state.user = payload.user;
  state.token = payload.token;
  localStorage.setItem('token', payload.token);
};

export const loginRejectedAction = (state: AuthState, error?: string) => {
  state.loading = false;
  state.error = error ?? 'Falha no login';
};

export const resetPasswordPendingAction = (state: AuthState) => {
  state.resetPasswordLoading = true;
  state.resetPasswordError = null;
  state.resetPasswordSuccess = false;
};

export const resetPasswordFulfilledAction = (state: AuthState) => {
  state.resetPasswordLoading = false;
  state.resetPasswordSuccess = true;
};

export const resetPasswordRejectedAction = (state: AuthState, error?: string) => {
  state.resetPasswordLoading = false;
  state.resetPasswordError = error ?? 'Falha ao enviar email de recuperação';
};
