import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService, User, AuthResponse, LoginCredentials } from '../../services/authService';

export const fetchLogin = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'auth/fetchLogin',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      localStorage.setItem('token', data.token);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Credenciais inválidas.');
    }
  }
);

export const fetchResetPassword = createAsyncThunk<{ message: string }, string, { rejectValue: string }>(
  'auth/fetchResetPassword',
  async (email, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword(email);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Email não encontrado.');
    }
  }
);
