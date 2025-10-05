import type { Notificacao } from '../../services/notificacoesService';

interface NotificacoesState {
  notificacoes: Notificacao[];
  loading: boolean;
  error: string | null;
}

export const fetchNotificacoesPendingAction = (state: NotificacoesState) => {
  state.loading = true;
  state.error = null;
};

export const fetchNotificacoesFulfilledAction = (state: NotificacoesState, payload: Notificacao[]) => {
  state.loading = false;
  state.notificacoes = payload;
};

export const fetchNotificacoesRejectedAction = (state: NotificacoesState, error?: string) => {
  state.loading = false;
  state.error = error ?? 'Erro ao buscar notificações';
};

export const markAsReadPendingAction = (state: NotificacoesState) => {
  state.loading = true;
};

export const markAsReadFulfilledAction = (state: NotificacoesState, payload: Notificacao) => {
  state.loading = false;
  const index = state.notificacoes.findIndex(n => n.id === payload.id);
  if (index !== -1) {
    state.notificacoes[index] = payload;
  }
};

export const markAsReadRejectedAction = (state: NotificacoesState, error?: string) => {
  state.loading = false;
  state.error = error ?? 'Erro ao marcar como lida';
};

export const markAllAsReadPendingAction = (state: NotificacoesState) => {
  state.loading = true;
};

export const markAllAsReadFulfilledAction = (state: NotificacoesState) => {
  state.loading = false;
  state.notificacoes = state.notificacoes.map(n => ({ ...n, lida: true }));
};

export const markAllAsReadRejectedAction = (state: NotificacoesState, error?: string) => {
  state.loading = false;
  state.error = error ?? 'Erro ao marcar todas como lidas';
};
