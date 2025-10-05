import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLogin, fetchResetPassword, AuthResponse, LoginCredentials } from './fetch';

export const loginUser = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await fetchLogin(credentials);
      localStorage.setItem('token', data.token);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Credenciais inválidas.');
    }
  }
);

export const resetPassword = createAsyncThunk<{ message: string }, string, { rejectValue: string }>(
  'auth/resetPassword',
  async (email, { rejectWithValue }) => {
    try {
      const data = await fetchResetPassword(email);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao enviar email de recuperação.');
    }
  }
);
