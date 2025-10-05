import { createSlice } from '@reduxjs/toolkit';
import * as actions from './actions';
import { fetchNotificacoes, fetchMarkAsRead, fetchMarkAllAsRead } from './fetch';
import { type Notificacao } from '../../services/notificacoesService';

interface NotificacoesState {
  notificacoes: Notificacao[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificacoesState = {
  notificacoes: [],
  loading: false,
  error: null,
};

const notificacoesSlice = createSlice({
  name: 'notificacoes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificacoes.pending, (state) => actions.fetchNotificacoesPendingAction(state))
      .addCase(fetchNotificacoes.fulfilled, (state, action) => actions.fetchNotificacoesFulfilledAction(state, action.payload))
      .addCase(fetchNotificacoes.rejected, (state, action) => actions.fetchNotificacoesRejectedAction(state, action.payload))
      .addCase(fetchMarkAsRead.pending, (state) => actions.markAsReadPendingAction(state))
      .addCase(fetchMarkAsRead.fulfilled, (state, action) => actions.markAsReadFulfilledAction(state, action.payload))
      .addCase(fetchMarkAsRead.rejected, (state, action) => actions.markAsReadRejectedAction(state, action.payload))
      .addCase(fetchMarkAllAsRead.pending, (state) => actions.markAllAsReadPendingAction(state))
      .addCase(fetchMarkAllAsRead.fulfilled, (state) => actions.markAllAsReadFulfilledAction(state))
      .addCase(fetchMarkAllAsRead.rejected, (state, action) => actions.markAllAsReadRejectedAction(state, action.payload));
  },
});

export default notificacoesSlice.reducer;
