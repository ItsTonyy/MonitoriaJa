import { createAsyncThunk } from '@reduxjs/toolkit';
import { notificacoesService, type Notificacao } from '../../services/notificacoesService';

interface FetchNotificacoesParams {
  userId: number;
  userRole: 'admin' | 'monitor' | 'user';
}

export const fetchNotificacoes = createAsyncThunk<Notificacao[], FetchNotificacoesParams, { rejectValue: string }>(
  'notificacoes/fetchNotificacoes',
  async ({ userId, userRole }, { rejectWithValue }) => {
    try {
      const data = await notificacoesService.getNotificacoes(userId, userRole);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar notificações.');
    }
  }
);

export const fetchMarkAsRead = createAsyncThunk<Notificacao, string, { rejectValue: string }>(
  'notificacoes/markAsRead',
  async (notificacaoId, { rejectWithValue }) => {
    try {
      const data = await notificacoesService.markAsRead(notificacaoId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao marcar notificação como lida.');
    }
  }
);

export const fetchMarkAllAsRead = createAsyncThunk<void, number, { rejectValue: string }>(
  'notificacoes/markAllAsRead',
  async (userId, { rejectWithValue }) => {
    try {
      await notificacoesService.markAllAsRead(userId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao marcar todas como lidas.');
    }
  }
);
